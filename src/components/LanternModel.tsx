import { Suspense, useMemo, Component, ReactNode } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface LanternModelProps {
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
    console.error('[LanternModel] GLB failed to load:', err.message, info)
  }
  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

function Model() {
  const { scene } = useGLTF('/models/lantern.glb')

  const clone = useMemo(() => {
    const c = scene.clone(true)
    const box = new THREE.Box3().setFromObject(c)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) {
      const scale = 2.0 / maxDim
      c.scale.setScalar(scale)
      const scaled = new THREE.Box3().setFromObject(c)
      c.position.set(-center.x * scale, -scaled.min.y, -center.z * scale)
    }
    return c
  }, [scene])

  return <primitive object={clone} />
}

export default function LanternModel({ mode }: LanternModelProps) {
  return (
    <group>
      <ambientLight intensity={mode === 'dusk' ? 0.4 : 0.8} />
      <directionalLight
        position={[8, 10, 5]}
        color={mode === 'dusk' ? '#ff9f40' : '#ffffff'}
        intensity={mode === 'dusk' ? 1.8 : 2.5}
        castShadow
      />
      <directionalLight position={[-5, 6, -3]} color="#c8d4ff" intensity={0.4} />
      {/* Warm fill light to simulate lantern glow */}
      <pointLight
        position={[0, 1.2, 0]}
        color={mode === 'dusk' ? '#ffb347' : '#fff5e0'}
        intensity={mode === 'dusk' ? 2.5 : 0.8}
        distance={6}
        decay={2}
      />

      <GLBErrorBoundary>
        <Suspense fallback={null}>
          <Model />
        </Suspense>
      </GLBErrorBoundary>
    </group>
  )
}
