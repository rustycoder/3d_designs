import { Suspense, useMemo, Component, ReactNode } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface TreeModelProps {
  mode: 'day' | 'dusk'
}

class GLBErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(err: Error, info: React.ErrorInfo) {
    console.error('[TreeModel] GLB failed to load:', err.message, info)
  }
  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

function Model() {
  const { scene } = useGLTF('/models/tree.glb')

  const clone = useMemo(() => {
    const c = scene.clone(true)
    const box = new THREE.Box3().setFromObject(c)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) {
      const scale = 3.5 / maxDim
      c.scale.setScalar(scale)
      const scaled = new THREE.Box3().setFromObject(c)
      c.position.set(-center.x * scale, -scaled.min.y, -center.z * scale)
    }
    return c
  }, [scene])

  return <primitive object={clone} />
}

export default function TreeModel({ mode }: TreeModelProps) {
  return (
    <group>
      <ambientLight intensity={mode === 'dusk' ? 0.3 : 0.9} />
      <directionalLight
        position={[10, 12, 6]}
        color={mode === 'dusk' ? '#ffd580' : '#ffffff'}
        intensity={mode === 'dusk' ? 1.5 : 2.2}
        castShadow
      />
      <directionalLight position={[-6, 8, -4]} color={mode === 'dusk' ? '#c8aaff' : '#d4e8ff'} intensity={0.5} />
      {/* Soft fill from below to simulate ground bounce */}
      <hemisphereLight
        color={mode === 'dusk' ? '#2a1f3d' : '#e0f2fe'}
        groundColor={mode === 'dusk' ? '#0a0a12' : '#c8b97a'}
        intensity={mode === 'dusk' ? 0.4 : 0.6}
      />

      <GLBErrorBoundary>
        <Suspense fallback={null}>
          <Model />
        </Suspense>
      </GLBErrorBoundary>
    </group>
  )
}
