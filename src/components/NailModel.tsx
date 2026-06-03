import { Suspense, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface NailModelProps {
  mode: 'day' | 'dusk'
}

// Pre-warm the loader before the component ever mounts
useGLTF.preload('/models/nail.glb')

// Inner component — useGLTF suspends here until the asset is ready.
// Must be wrapped in <Suspense> by the parent.
function NailScene({ mode }: NailModelProps) {
  const { scene } = useGLTF('/models/nail.glb')
  const pivotRef = useRef<THREE.Group>(null)

  // Prepare the cloned, scaled, centered scene once
  const preparedScene = useMemo(() => {
    const clone = scene.clone(true)

    // Compute bounding box to auto-center and scale
    const box = new THREE.Box3().setFromObject(clone)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    // Scale so the longest dimension is ~1.2 scene units
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = maxDim > 0 ? 1.2 / maxDim : 1
    clone.scale.setScalar(scale)

    // Offset so the model is centered at origin of this group
    clone.position
      .copy(center)
      .multiplyScalar(-scale)

    // Upgrade every mesh to a PBR material for premium rendering
    clone.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return
      const mesh = child as THREE.Mesh
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]

      mesh.material = mats.map((mat) => {
        if (mat instanceof THREE.MeshStandardMaterial) {
          // Already PBR — boost env map influence
          const m = mat.clone()
          m.envMapIntensity = 1.5
          m.needsUpdate = true
          return m
        }
        // Convert Lambert / Phong / Basic → StandardMaterial
        return new THREE.MeshStandardMaterial({
          color: (mat as any).color ?? new THREE.Color('#c0c8d0'),
          metalness: 0.65,
          roughness: 0.28,
          envMapIntensity: 1.5,
        })
      })
      mesh.castShadow = true
      mesh.receiveShadow = true
    })

    return clone
  }, [scene])

  // Slow passive auto-rotation so all faces are visible on first view
  useFrame((_state, delta) => {
    if (pivotRef.current) pivotRef.current.rotation.y += delta * 0.3
  })

  return (
    <group ref={pivotRef} position={[0, 2.4, 0]}>
      {/* primitive renders the prepared THREE.Group directly into the scene */}
      <primitive object={preparedScene} />
    </group>
  )
}

// Fallback shown while the GLB is being fetched
function LoadingPlaceholder() {
  return (
    <mesh position={[0, 2.4, 0]}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color="#334155" wireframe />
    </mesh>
  )
}

// Public component — wraps NailScene in Suspense so the canvas never crashes
export default function NailModel({ mode }: NailModelProps) {
  const lightColor   = mode === 'dusk' ? '#ffd580' : '#f0f4ff'
  const ambientIntens = mode === 'dusk' ? 0.04 : 0.15

  return (
    <group>
      {/* ── Studio three-point lighting ── */}
      <directionalLight
        position={[-3.0, 6.0, 4.0]}
        color={lightColor}
        intensity={mode === 'dusk' ? 1.2 : 3.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight
        position={[4.0, 3.0, -2.0]}
        color="#d0dff0"
        intensity={mode === 'dusk' ? 0.4 : 1.0}
      />
      <directionalLight
        position={[0, 1.0, -5.0]}
        color="#8090a8"
        intensity={mode === 'dusk' ? 0.15 : 0.5}
      />
      <pointLight
        position={[0, 0.5, 0]}
        color={mode === 'dusk' ? '#ff9f43' : '#fff5e0'}
        intensity={mode === 'dusk' ? 0.3 : 0.8}
        distance={5}
        decay={2}
      />
      <ambientLight color="#b0bec5" intensity={ambientIntens} />

      {/* ── Shadow catcher floor ── */}
      <mesh position={[0, 0.0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial
          color={mode === 'dusk' ? '#030408' : '#ffffff'}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* ── GLB model with Suspense boundary ── */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <NailScene mode={mode} />
      </Suspense>
    </group>
  )
}
