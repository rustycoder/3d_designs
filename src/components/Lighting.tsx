import { useRef } from 'react'
import * as THREE from 'three'
import { useHelper } from '@react-three/drei'

interface LightingProps {
  mode: 'day' | 'dusk'
  lightsIntensity: number // multiplier (0 - 2)
  sunIntensity: number // multiplier (0 - 2)
  debugLights?: boolean
}

export default function Lighting({
  mode,
  lightsIntensity,
  sunIntensity,
  debugLights = false
}: LightingProps) {
  const dirLightRef = useRef<THREE.DirectionalLight>(null)

  // Debug helpers
  if (debugLights) {
    useHelper(dirLightRef as any, THREE.DirectionalLightHelper, 1, 'red')
  }

  // Calculate intensities and colors based on the mode
  const isDusk = mode === 'dusk'
  
  // Day ambient: sky blue, relatively bright
  // Dusk ambient: deep blue-indigo, very soft
  const ambientColor = isDusk ? '#0c152b' : '#cce3f5'
  const ambientIntensity = isDusk ? 0.3 * lightsIntensity : 0.8

  // Main directional light (Sun or Moon/Dusk sky)
  const dirColor = isDusk ? '#38bdf8' : '#fffdeb'
  const dirIntensity = isDusk ? 0.4 * sunIntensity : 1.5 * sunIntensity
  const dirPos: [number, number, number] = isDusk ? [-15, 8, -10] : [15, 20, 10]

  // Warm interior light settings
  const warmColor = '#ff9d42' // Rich warm amber/gold
  const warmInt = 1.8 * lightsIntensity

  return (
    <>
      {/* Sky Ambient Light */}
      <ambientLight color={ambientColor} intensity={ambientIntensity} />

      {/* Directional Light (Sun/Dusk directional fill) */}
      <directionalLight
        ref={dirLightRef}
        color={dirColor}
        intensity={dirIntensity}
        position={dirPos}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0005}
      />

      {/* ARCHITECTURAL LIGHTS (Warm ambers under the pavilion) */}
      {isDusk && (
        <group>
          {/* Main Ceiling Spotlights - Illuminating kitchen & dining area */}
          {/* Spot 1: Above dining table */}
          <spotLight
            position={[1.5, 4.2, 0.5]}
            angle={Math.PI / 4.5}
            penumbra={0.8}
            intensity={warmInt * 1.5}
            color={warmColor}
            castShadow
            shadow-bias={-0.001}
          />
          {/* Spot 2: Above kitchen island */}
          <spotLight
            position={[4.5, 4.2, 1.5]}
            angle={Math.PI / 5}
            penumbra={0.7}
            intensity={warmInt * 2.0}
            color={warmColor}
            castShadow
            shadow-bias={-0.001}
          />

          {/* Column Uplights/Downlights */}
          {/* Column 1 (Left foreground column) */}
          <pointLight
            position={[-3.3, 1.2, 3.8]}
            distance={5}
            intensity={warmInt * 1.2}
            color={warmColor}
          />
          <pointLight
            position={[-3.3, 3.8, 3.8]}
            distance={5}
            intensity={warmInt * 1.2}
            color={warmColor}
          />

          {/* Column 2 (Right center main column) */}
          <pointLight
            position={[5.8, 1.2, 3.8]}
            distance={5}
            intensity={warmInt * 1.5}
            color={warmColor}
          />
          <pointLight
            position={[5.8, 3.8, 3.8]}
            distance={5}
            intensity={warmInt * 1.5}
            color={warmColor}
          />

          {/* Column 3 (Far left pool deck column) */}
          <pointLight
            position={[-3.3, 2.5, -4.8]}
            distance={6}
            intensity={warmInt * 0.8}
            color={warmColor}
          />

          {/* Interior warm glow (lounge area) */}
          <pointLight
            position={[8.5, 2.2, -1.5]}
            distance={10}
            intensity={warmInt * 2.2}
            color="#ffad5a"
            castShadow
          />
          {/* Warm linear light under-cabinet/counter */}
          <pointLight
            position={[4.5, 0.9, 1.5]}
            distance={4}
            intensity={warmInt * 0.8}
            color="#ffe29c"
          />

          {/* Decorative floor lamps & pools uplights */}
          {/* Water feature foreground light */}
          <pointLight
            position={[-2.0, -0.4, 2.0]}
            distance={6}
            intensity={warmInt * 0.5}
            color="#47a5ff"
          />
          <pointLight
            position={[1.5, -0.4, 0.0]}
            distance={6}
            intensity={warmInt * 0.5}
            color="#47a5ff"
          />
        </group>
      )}

      {/* Day Mode Interior Fills (softer, so interior isn't pitch black) */}
      {!isDusk && (
        <group>
          <pointLight
            position={[6, 2.5, 0]}
            distance={15}
            intensity={0.5}
            color="#ffffff"
          />
          <pointLight
            position={[4.5, 2.5, 2.5]}
            distance={10}
            intensity={0.3}
            color="#ffffff"
          />
        </group>
      )}
    </>
  )
}
