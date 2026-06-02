import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import Pavilion from './Pavilion'
import Landscape from './Landscape'
import Lighting from './Lighting'
import ShowcaseSpaces from './ShowcaseSpaces'

interface SceneProps {
  mode: 'day' | 'dusk'
  lightsIntensity: number
  sunIntensity: number
  cameraPreset: 'default' | 'side' | 'interior' | 'top'
  isDoorOpen: boolean
  setIsDoorOpen: (open: boolean) => void
  activeDesign: 'pavilion' | 'batten' | 'downlight'
}

// Camera Rig — TRULY ABSOLUTE navigation.
// The camera moves ONLY on the very first app load (to set the initial position).
// After that: switching designs, toggling day/dusk, opening drawers, toggling doors
// — absolutely nothing moves the camera. Zero spring-back, ever.
function CameraRig({ 
  preset, 
  activeDesign 
}: { 
  preset: 'default' | 'side' | 'interior' | 'top'
  activeDesign: 'pavilion' | 'batten' | 'downlight' 
}) {
  const { camera } = useThree()
  // Starts false — the useEffect on mount immediately sets it to true once
  const isTransitioning = useRef(false)
  const hasMounted = useRef(false)
  
  // Starting camera positions — used ONLY on initial app load
  const config = {
    default: {
      pos: new THREE.Vector3(-7.5, 1.4, 6.5),
      look: new THREE.Vector3(2.0, 1.6, 0.0)
    },
    side: {
      pos: new THREE.Vector3(9.5, 3.2, 13.0),
      look: new THREE.Vector3(1.5, 1.5, -1.0)
    },
    interior: {
      pos: new THREE.Vector3(2.5, 1.2, -1.5),
      look: new THREE.Vector3(0.5, 1.2, 1.2)
    },
    top: {
      pos: new THREE.Vector3(0.1, 10.0, 0.0),
      look: new THREE.Vector3(0.0, 0.0, 0.0)
    },
    batten: {
      pos: new THREE.Vector3(0.0, 2.2, 5.5),
      look: new THREE.Vector3(0.0, 2.4, 0.0)
    },
    downlight: {
      pos: new THREE.Vector3(1.2, 1.8, 3.2),
      look: new THREE.Vector3(0.0, 2.4, 0.0)
    }
  }

  const getConfigKey = (design: string, p: string): keyof typeof config =>
    (design === 'pavilion' ? p : design) as keyof typeof config

  // Fire ONCE on mount — sets the initial camera position only
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      isTransitioning.current = true
    }
    // Intentionally no dependencies — this effect only runs once on mount.
    // Design changes, preset changes, and all other state changes are completely ignored.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((state) => {
    if (!isTransitioning.current) return

    const key = getConfigKey(activeDesign, preset)
    const targetConfig = config[key]
    const orbitControls = state.controls as any

    if (orbitControls) {
      camera.position.lerp(targetConfig.pos, 0.05)
      orbitControls.target.lerp(targetConfig.look, 0.05)
      orbitControls.update()

      const posDist = camera.position.distanceTo(targetConfig.pos)
      const lookDist = orbitControls.target.distanceTo(targetConfig.look)

      if (posDist < 0.02 && lookDist < 0.02) {
        camera.position.copy(targetConfig.pos)
        orbitControls.target.copy(targetConfig.look)
        orbitControls.update()
        // Done — camera will never move again unless the user drags/scrolls
        isTransitioning.current = false
      }
    } else {
      // Fallback: OrbitControls not yet bound on the very first frames
      camera.position.lerp(targetConfig.pos, 0.05)
      camera.lookAt(targetConfig.look)
      const posDist = camera.position.distanceTo(targetConfig.pos)
      if (posDist < 0.02) {
        camera.position.copy(targetConfig.pos)
        isTransitioning.current = false
      }
    }
  })

  return null
}

export default function Scene({
  mode,
  lightsIntensity,
  sunIntensity,
  cameraPreset,
  isDoorOpen,
  setIsDoorOpen,
  activeDesign
}: SceneProps) {
  // Deep navy dusk sky background or light grey day sky
  const skyColor = activeDesign === 'pavilion'
    ? (mode === 'dusk' ? '#070a13' : '#e0f2fe')
    : (mode === 'day' ? '#ffffff' : '#030408')
  const fogDensity = activeDesign === 'pavilion' ? 0.035 : 0.0

  return (
    <div className="canvas-container">
      <Canvas
        shadows
        camera={{ fov: 45, near: 0.1, far: 100, position: [9.5, 3.2, 13.0] }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        {/* Set canvas background */}
        <color attach="background" args={[skyColor]} />
        
        {/* Cinematic depth fog */}
        {fogDensity > 0 && <fogExp2 attach="fog" color={skyColor} density={fogDensity} />}

        {/* Dynamic environment map for premium reflections */}
        <Environment preset={mode === 'dusk' ? 'sunset' : 'apartment'} />

        {/* Ambient & Spot lighting */}
        {activeDesign === 'pavilion' ? (
          <Lighting
            mode={mode}
            lightsIntensity={lightsIntensity}
            sunIntensity={sunIntensity}
          />
        ) : (
          <ambientLight intensity={mode === 'day' ? 0.08 : 0.02} color="#f8fafc" />
        )}

        {/* 3D Geometry Components */}
        {activeDesign === 'pavilion' ? (
          <>
            <Pavilion isDoorOpen={isDoorOpen} onToggleDoor={() => setIsDoorOpen(!isDoorOpen)} />
            <Landscape />
          </>
        ) : (
          <ShowcaseSpaces type={activeDesign} mode={mode} />
        )}

        {/* Camera management & controls */}
        <CameraRig preset={cameraPreset} activeDesign={activeDesign} />
        
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.02} // Stop camera going under floor
          minDistance={2}
          maxDistance={25}
        />
      </Canvas>
    </div>
  )
}
