import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import Pavilion from './Pavilion'
import Landscape from './Landscape'
import Lighting from './Lighting'

interface SceneProps {
  mode: 'day' | 'dusk'
  lightsIntensity: number
  sunIntensity: number
  cameraPreset: 'default' | 'side' | 'interior' | 'top'
  isDoorOpen: boolean
  setIsDoorOpen: (open: boolean) => void
}

// Camera Rig to smoothly animate the camera position and target
function CameraRig({ preset }: { preset: 'default' | 'side' | 'interior' | 'top' }) {
  const { camera } = useThree()
  const isTransitioning = useRef(true)
  const lastPreset = useRef(preset)
  
  // Target position and lookup targets
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
    }
  }

  // Trigger transition when the preset changes
  useEffect(() => {
    isTransitioning.current = true
    lastPreset.current = preset
  }, [preset])

  useFrame((state) => {
    if (!isTransitioning.current) return

    const targetConfig = config[preset]
    const orbitControls = state.controls as any

    if (orbitControls) {
      // Lerp camera position
      camera.position.lerp(targetConfig.pos, 0.05)
      
      // Lerp controls target (where OrbitControls rotates around and looks at)
      orbitControls.target.lerp(targetConfig.look, 0.05)
      
      // Force OrbitControls to recalculate camera angles
      orbitControls.update()

      // Stop transitioning when close enough
      const posDist = camera.position.distanceTo(targetConfig.pos)
      const lookDist = orbitControls.target.distanceTo(targetConfig.look)

      if (posDist < 0.02 && lookDist < 0.02) {
        camera.position.copy(targetConfig.pos)
        orbitControls.target.copy(targetConfig.look)
        orbitControls.update()
        isTransitioning.current = false
      }
    } else {
      // Fallback before OrbitControls is fully bound/active
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
  setIsDoorOpen
}: SceneProps) {
  // Deep navy dusk sky background or light grey day sky
  const skyColor = mode === 'dusk' ? '#070a13' : '#e0f2fe'
  const fogDensity = 0.035

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
        <fogExp2 attach="fog" color={skyColor} density={fogDensity} />

        {/* Dynamic environment map for premium reflections */}
        <Environment preset={mode === 'dusk' ? 'sunset' : 'apartment'} />

        {/* Ambient & Spot lighting */}
        <Lighting
          mode={mode}
          lightsIntensity={lightsIntensity}
          sunIntensity={sunIntensity}
        />

        {/* 3D Geometry Components */}
        <Pavilion isDoorOpen={isDoorOpen} onToggleDoor={() => setIsDoorOpen(!isDoorOpen)} />
        <Landscape />

        {/* Camera management & controls */}
        <CameraRig preset={cameraPreset} />
        
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.02} // Stop camera going under floor
          minDistance={2}
          maxDistance={25}
          target={[2.0, 1.6, 0.0]}
        />
      </Canvas>
    </div>
  )
}
