import { Suspense, useMemo, Component, ReactNode } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface NailModelProps {
  mode: 'day' | 'dusk'
}

// ErrorBoundary — catches useGLTF errors so the canvas never crashes.
// Shows nothing visible but logs the real error to the browser console.
class GLBErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(err: Error, info: React.ErrorInfo) {
    // Check the browser console (F12) for the real error message
    console.error('[NailModel] GLB failed to load:', err.message, info)
  }
  render() {
    if (this.state.hasError) return null   // transparent — no red cube
    return this.props.children
  }
}

// Simplest possible model loader — exactly the user's reference pattern
function Model() {
  const { scene } = useGLTF('/models/nail.glb')

  const clone = useMemo(() => {
    const c = scene.clone(true)
    const box = new THREE.Box3().setFromObject(c)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) {
      const scale = 1.5 / maxDim
      c.scale.setScalar(scale)
      const scaled = new THREE.Box3().setFromObject(c)
      c.position.set(-center.x * scale, 2.4 - scaled.min.y, -center.z * scale)
    }
    return c
  }, [scene])

  return <primitive object={clone} />
}

export default function NailModel({ mode }: NailModelProps) {
  return (
    <group>
      <ambientLight intensity={mode === 'dusk' ? 0.5 : 0.8} />
      <directionalLight
        position={[10, 10, 5]}
        color={mode === 'dusk' ? '#ffd580' : '#ffffff'}
        intensity={mode === 'dusk' ? 1.5 : 2.5}
        castShadow
      />
      <directionalLight position={[-5, 5, -3]} color="#c8d4ff" intensity={0.5} />

      <GLBErrorBoundary>
        <Suspense fallback={null}>
          <Model />
        </Suspense>
      </GLBErrorBoundary>
    </group>
  )
}
