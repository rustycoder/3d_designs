import { useMemo } from 'react'
import * as THREE from 'three'
import { createConcreteTexture } from '../utils/textures'

interface ShowcaseSpacesProps {
  type: 'batten' | 'downlight'
  mode: 'day' | 'dusk'
}

export default function ShowcaseSpaces({ type, mode }: ShowcaseSpacesProps) {
  // Memoize concrete texture for high-fidelity wall and floor surfaces
  const concreteTexture = useMemo(() => {
    const tex = createConcreteTexture()
    // Tile the texture for a realistic concrete paneled look
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(3, 2)
    return tex
  }, [])

  // Light color configurations based on environment modes
  const lightColor = mode === 'dusk' ? '#ffdfa9' : '#fafaf9' // Warm amber at dusk, crisp neutral in day
  const emissiveColor = mode === 'dusk' ? '#ff9f43' : '#ffffff'

  return (
    <group>
      {/* ======================================================== */}
      {/* MINIMALIST ROOM BOX (Empty Space)                        */}
      {/* ======================================================== */}
      
      {/* Concrete Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial
          map={concreteTexture}
          roughness={0.75}
          metalness={0.1}
        />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 4.0, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial
          map={concreteTexture}
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 2.0, -5.0]} receiveShadow>
        <planeGeometry args={[14, 4.0]} />
        <meshStandardMaterial
          map={concreteTexture}
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-7.0, 2.0, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10, 4.0]} />
        <meshStandardMaterial
          map={concreteTexture}
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* Right Wall */}
      <mesh position={[7.0, 2.0, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10, 4.0]} />
        <meshStandardMaterial
          map={concreteTexture}
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>


      {/* ======================================================== */}
      {/* 3D PRODUCT GEOMETRY & SHADOW LIGHTING                   */}
      {/* ======================================================== */}

      {type === 'batten' && (
        <group>
          {/* Surface Mounted LED Batten Fixture */}
          <group position={[0, 3.94, -1.0]}>
            {/* Aluminum Profile Casing */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[4.5, 0.08, 0.08]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Glowing Opal Polycarbonate Diffuser Lens */}
            <mesh position={[0, -0.041, 0]}>
              <boxGeometry args={[4.46, 0.005, 0.07]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive={emissiveColor}
                emissiveIntensity={mode === 'dusk' ? 3.5 : 2.0}
              />
            </mesh>

            {/* End Caps */}
            <mesh position={[-2.26, 0, 0]}>
              <boxGeometry args={[0.02, 0.085, 0.085]} />
              <meshStandardMaterial color="#0f172a" metalness={0.7} />
            </mesh>
            <mesh position={[2.26, 0, 0]}>
              <boxGeometry args={[0.02, 0.085, 0.085]} />
              <meshStandardMaterial color="#0f172a" metalness={0.7} />
            </mesh>
          </group>

          {/* Tri-source Linear Light Wash (Simulating continuous batten light) */}
          {[
            { pos: [-1.4, 3.75, -1.0] as [number, number, number] },
            { pos: [0.0, 3.75, -1.0] as [number, number, number] },
            { pos: [1.4, 3.75, -1.0] as [number, number, number] }
          ].map((source, i) => (
            <group key={`batten-light-${i}`} position={source.pos}>
              {/* Point light casting glow in all directions inside the room */}
              <pointLight
                color={lightColor}
                intensity={mode === 'dusk' ? 2.5 : 1.2}
                distance={7.0}
                decay={1.6}
              />
              {/* Spotlight to wash the back wall and create soft linear floor shadow */}
              <spotLight
                color={lightColor}
                intensity={mode === 'dusk' ? 4.5 : 2.0}
                distance={7.5}
                angle={Math.PI / 2.5}
                penumbra={0.7}
                decay={1.4}
                castShadow
                shadow-mapSize-width={512}
                shadow-mapSize-height={512}
                shadow-bias={-0.002}
              />
            </group>
          ))}
        </group>
      )}

      {type === 'downlight' && (
        <group>
          {/* 2x2 Grid of Recessed Downlight Fixtures */}
          {[
            { pos: [-1.8, 3.99, -1.8] as [number, number, number], id: 1 },
            { pos: [1.8, 3.99, -1.8] as [number, number, number], id: 2 },
            { pos: [-1.8, 3.99, 1.8] as [number, number, number], id: 3 },
            { pos: [1.8, 3.99, 1.8] as [number, number, number], id: 4 }
          ].map((dl) => (
            <group key={`downlight-fixture-${dl.id}`} position={dl.pos}>
              {/* Outer trim ring */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.12, 0.12, 0.01, 16]} />
                <meshStandardMaterial color="#0f172a" roughness={0.5} />
              </mesh>
              
              {/* Recessed black baffle chamber (creates the physical anti-glare pocket) */}
              <mesh position={[0, -0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
                <meshStandardMaterial color="#020203" roughness={0.9} />
              </mesh>

              {/* Deeply recessed glowing diode */}
              <mesh position={[0, -0.015, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 0.01, 16]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive={emissiveColor}
                  emissiveIntensity={mode === 'dusk' ? 5.0 : 2.5}
                />
              </mesh>

              {/* Direct downward spotlight spotlight */}
              <spotLight
                position={[0, -0.02, 0]}
                color={lightColor}
                intensity={mode === 'dusk' ? 6.0 : 3.0}
                distance={7.0}
                angle={Math.PI / 5} // Concentrated spot cone (36 degrees)
                penumbra={0.6} // Soft edge fall-off
                decay={1.5}
                castShadow
                shadow-mapSize-width={512}
                shadow-mapSize-height={512}
                shadow-bias={-0.001}
              />
            </group>
          ))}
        </group>
      )}
    </group>
  )
}
