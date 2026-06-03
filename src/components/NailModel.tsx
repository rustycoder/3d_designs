import { Suspense, useMemo, Component, ReactNode } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface NailModelProps {
  mode: 'day' | 'dusk'
}

// Pre-warm the loader so it fetches before the component mounts
useGLTF.preload('/models/nail.glb')

// ── Bug 3 fix: ErrorBoundary catches GLB load / parse failures ────────────────
interface EBState { hasError: boolean; message: string }
class GLBErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { hasError: false, message: '' }
  static getDerivedStateFromError(err: Error): EBState {
    return { hasError: true, message: err.message }
  }
  render() {
    if (this.state.hasError) {
      // Render a red placeholder cube so the user sees something
      return (
        <mesh position={[0, 2.4, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="red" wireframe />
        </mesh>
      )
    }
    return this.props.children
  }
}

// ── Visible loading fallback (wireframe sphere) ───────────────────────────────
function LoadingFallback() {
  return (
    <mesh position={[0, 2.4, 0]}>
      <sphereGeometry args={[0.18, 12, 12]} />
      <meshStandardMaterial color="#4f6280" wireframe />
    </mesh>
  )
}

// ── Inner model component ─────────────────────────────────────────────────────
// useGLTF suspends here until the file is ready.
// Bug 1 fix: clone the scene so we never mutate the shared useGLTF cache.
// Bug 2 fix: useMemo runs synchronously before render — bounding box is
//            computed on the fresh clone (not yet in the scene graph), giving
//            reliable results every time.
function Model() {
  const { scene } = useGLTF('/models/nail.glb')

  const clone = useMemo(() => {
    // Clone deeply so all geometry/material refs are independent
    const c = scene.clone(true)

    // Compute bounding box on the clone in its default (unscaled) state
    const box = new THREE.Box3().setFromObject(c)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    const maxDim = Math.max(size.x, size.y, size.z)
    const targetSize = 1.5                        // desired max scene extent
    const scale = maxDim > 0 ? targetSize / maxDim : 1

    c.scale.setScalar(scale)

    // Translate so the model's bottom sits at Y = 2.4
    // We recompute after scaling to get the correct min Y
    const scaled = new THREE.Box3().setFromObject(c)
    c.position.set(
      -center.x * scale,           // center X/Z at origin
      2.4 - scaled.min.y,          // lift bottom to Y=2.4
      -center.z * scale
    )

    return c
  }, [scene])  // only recomputes when the GLB asset itself changes

  return <primitive object={clone} />
}

// ── Public export ─────────────────────────────────────────────────────────────
export default function NailModel({ mode }: NailModelProps) {
  const lightColor    = mode === 'dusk' ? '#ffd580' : '#ffffff'
  const ambientIntens = mode === 'dusk' ? 0.5 : 0.7

  return (
    <group>
      {/* Three-point studio lighting */}
      <ambientLight intensity={ambientIntens} />
      <directionalLight
        position={[10, 10, 5]}
        color={lightColor}
        intensity={mode === 'dusk' ? 1.5 : 2.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-5, 5, -3]} color="#c8d4ff" intensity={0.5} />
      <directionalLight position={[0, -2, 3]}  color="#6080a0" intensity={0.2} />

      {/* ErrorBoundary catches loader failures; Suspense shows spinner while loading */}
      <GLBErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Model />
        </Suspense>
      </GLBErrorBoundary>
    </group>
  )
}
