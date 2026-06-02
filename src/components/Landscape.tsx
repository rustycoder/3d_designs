import { useRef } from 'react'
import * as THREE from 'three'
import Water from './Water'

export default function Landscape() {
  return (
    <group>
      {/* ======================================================== */}
      {/* WATER FEATURES                                           */}
      {/* ======================================================== */}
      
      {/* 1. Foreground Reflecting Pond */}
      <Water
        position={[-1.2, 0.02, 1.2]}
        args={[3.8, 5.8]}
        deepColor="#03080f"
        shallowColor="#081524"
        speed={0.4}
        scale={2.2}
      />
      {/* Pond border/lining (dark stone) */}
      <mesh position={[-1.2, 0.01, 1.2]} receiveShadow>
        <boxGeometry args={[4.0, 0.05, 6.0]} />
        <meshStandardMaterial color="#090d16" roughness={0.9} />
      </mesh>

      {/* 2. Recessed Rectangular Swimming Pool */}
      <group position={[-7.0, 0.0, -4.5]}>
        {/* Pool Water Plane (suspended inside) */}
        <Water
          position={[0, 0.12, 0]}
          args={[6.6, 4.6]}
          deepColor="#0284c7" // Vibrant turquoise
          shallowColor="#38bdf8"
          speed={0.6}
          scale={1.4}
        />

        {/* Pool Floor (recessed below ground) */}
        <mesh position={[0, -0.6, 0]} receiveShadow>
          <boxGeometry args={[6.6, 0.08, 4.6]} />
          <meshStandardMaterial color="#0891b2" roughness={0.7} />
        </mesh>

        {/* Linear COB lights inside the pool walls */}
        {/* Left COB light strip */}
        <mesh position={[-3.28, 0.12, 0]} castShadow>
          <boxGeometry args={[0.02, 0.02, 4.6]} />
          <meshStandardMaterial color="#bae6fd" emissive="#0ea5e9" emissiveIntensity={3.5} />
        </mesh>
        {/* Right COB light strip */}
        <mesh position={[3.28, 0.12, 0]} castShadow>
          <boxGeometry args={[0.02, 0.02, 4.6]} />
          <meshStandardMaterial color="#bae6fd" emissive="#0ea5e9" emissiveIntensity={3.5} />
        </mesh>
        {/* Back COB light strip */}
        <mesh position={[0, 0.12, -2.28]} castShadow>
          <boxGeometry args={[6.6, 0.02, 0.02]} />
          <meshStandardMaterial color="#bae6fd" emissive="#0ea5e9" emissiveIntensity={3.5} />
        </mesh>
        {/* Front COB light strip */}
        <mesh position={[0, 0.12, 2.28]} castShadow>
          <boxGeometry args={[6.6, 0.02, 0.02]} />
          <meshStandardMaterial color="#bae6fd" emissive="#0ea5e9" emissiveIntensity={3.5} />
        </mesh>

        {/* Water glow lights inside pool */}
        <pointLight position={[-1.5, 0.05, 0]} distance={4.5} intensity={1.8} color="#0ea5e9" />
        <pointLight position={[1.5, 0.05, 0]} distance={4.5} intensity={1.8} color="#0ea5e9" />

        {/* Pool Retaining Walls (Left, Right, Back, Front) */}
        {/* Left Wall */}
        <mesh position={[-3.4, -0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.8, 4.8]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
        {/* Right Wall */}
        <mesh position={[3.4, -0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.8, 4.8]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
        {/* Back Wall */}
        <mesh position={[0, -0.3, -2.4]} castShadow receiveShadow>
          <boxGeometry args={[7.0, 0.8, 0.2]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
        {/* Front Wall */}
        <mesh position={[0, -0.3, 2.4]} castShadow receiveShadow>
          <boxGeometry args={[7.0, 0.8, 0.2]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>

        {/* Concrete Coping Borders (framing the pool surface) */}
        {/* Left Coping */}
        <mesh position={[-3.4, 0.20, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.3, 0.04, 4.9]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </mesh>
        {/* Right Coping */}
        <mesh position={[3.4, 0.20, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.3, 0.04, 4.9]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </mesh>
        {/* Back Coping */}
        <mesh position={[0, 0.20, -2.4]} receiveShadow castShadow>
          <boxGeometry args={[7.1, 0.04, 0.3]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </mesh>
        {/* Front Coping */}
        <mesh position={[0, 0.20, 2.4]} receiveShadow castShadow>
          <boxGeometry args={[7.1, 0.04, 0.3]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* POOL SIDE DECK & BEACH ACCESSORIES                       */}
      {/* ======================================================== */}
      
      {/* Expanded Back Pool Deck (where the umbrellas and loungers sit) */}
      <mesh position={[-7.0, 0.1, -8.15]} castShadow receiveShadow>
        <boxGeometry args={[7.1, 0.2, 2.1]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>

      {/* Beach Umbrellas (moved back onto the expanded deck) */}
      {[
        { pos: [-8.0, 0.2, -8.4] },
        { pos: [-4.8, 0.2, -8.4] }
      ].map((u, i) => (
        <group key={`umbrella-${i}`} position={u.pos}>
          {/* Shaft */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 2.4, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
          {/* Canopy (Cone) */}
          <mesh position={[0, 2.3, 0]} castShadow>
            <coneGeometry args={[1.1, 0.4, 16]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Sun loungers on the back deck facing the pool */}
      {[
        { pos: [-7.8, 0.2, -7.6] },
        { pos: [-4.8, 0.2, -7.6] }
      ].map((l, i) => (
        <group key={`back-lounger-${i}`} position={l.pos}>
          {/* Base frame */}
          <mesh position={[0, 0.05, 0]} castShadow>
            <boxGeometry args={[0.6, 0.08, 1.4]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
          {/* Cushion */}
          <mesh position={[0, 0.1, 0]} castShadow>
            <boxGeometry args={[0.54, 0.05, 1.3]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
          {/* Angled backrest */}
          <mesh position={[0, 0.25, -0.45]} rotation={[Math.PI / 6, 0, 0]} castShadow>
            <boxGeometry args={[0.52, 0.05, 0.6]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
        </group>
      ))}





      {/* ======================================================== */}
      {/* SHRUBS & RIGHT PLANTERS                                 */}
      {/* ======================================================== */}
      
      {/* Planter boxes on the right foreground */}
      <group position={[6.0, 0.2, 1.5]}>
        {/* Stone planter wall */}
        <mesh position={[1.5, 0.2, 1.5]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.8, 3.8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        
        {/* Planter dirt */}
        <mesh position={[1.5, 0.58, 1.5]}>
          <boxGeometry args={[1.3, 0.02, 3.6]} />
          <meshStandardMaterial color="#2d3748" roughness={0.9} />
        </mesh>

        {/* Plants (Green Spheres/Cones grouped) */}
        {[
          { pos: [1.2, 0.7, 0.2], size: 0.35 },
          { pos: [1.6, 0.75, 0.8], size: 0.4 },
          { pos: [1.3, 0.7, 1.5], size: 0.32 },
          { pos: [1.7, 0.8, 2.2], size: 0.45 },
          { pos: [1.4, 0.7, 2.9], size: 0.38 }
        ].map((p, idx) => (
          <group key={`plant-${idx}`} position={p.pos}>
            <mesh castShadow>
              <sphereGeometry args={[p.size, 8, 8]} />
              <meshStandardMaterial color="#166534" roughness={0.9} />
            </mesh>
            {/* Small accent flowers/leaves */}
            <mesh position={[0, p.size * 0.8, 0]}>
              <sphereGeometry args={[p.size * 0.5, 6, 6]} />
              <meshStandardMaterial color="#0f766e" roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ======================================================== */}
      {/* FOREGROUND TREE (Left side framing branches)             */}
      {/* ======================================================== */}
      <group position={[-7.0, 0.2, 6.0]}>
        {/* Shrub plants around the base of the tree (positioned on the sides of the path) */}
        {[
          { pos: [-0.8, 0.05, -0.4], size: 0.25, color: '#166534' }, // Left-back
          { pos: [-0.7, 0.05, 0.5], size: 0.28, color: '#15803d' },  // Left-front
          { pos: [-0.9, 0.05, 0.0], size: 0.22, color: '#14532d' },  // Far left
          { pos: [0.0, 0.05, -0.8], size: 0.3, color: '#166534' },   // Back center
          { pos: [-0.3, 0.05, -0.9], size: 0.26, color: '#1b4332' }, // Left-back-back
          { pos: [0.0, 0.05, 0.8], size: 0.2, color: '#0f766e' }     // Front center
        ].map((p, idx) => (
          <group key={`tree-plant-${idx}`} position={p.pos}>
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[p.size, 8, 8]} />
              <meshStandardMaterial color={p.color} roughness={0.8} />
            </mesh>
            {/* Soft accent flowers (small red/coral colored spheres on top) */}
            <mesh position={[0, p.size * 0.8, 0]}>
              <sphereGeometry args={[p.size * 0.3, 6, 6]} />
              <meshStandardMaterial color="#f43f5e" roughness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Garden Spike Uplights around the tree */}
        {[
          { pos: [-0.6, 0.0, 0.6] as [number, number, number], rot: [-0.2, 0.0, 0.2] as [number, number, number] },
          { pos: [0.6, 0.0, -0.5] as [number, number, number], rot: [0.2, 0.0, -0.2] as [number, number, number] },
          { pos: [-0.1, 0.0, -0.7] as [number, number, number], rot: [0.25, 0.0, 0.0] as [number, number, number] }
        ].map((light, idx) => (
          <group key={`garden-light-${idx}`} position={light.pos}>
            {/* Small spike body */}
            <mesh castShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.15, 6]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>
            {/* Swivel head */}
            <mesh position={[0, 0.09, 0]} rotation={light.rot} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.08, 8]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} />
            </mesh>
            {/* Glowing LED lens */}
            <mesh position={[0, 0.13, 0]} rotation={light.rot}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial color="#fffbeb" emissive="#ffea8f" emissiveIntensity={4.0} />
            </mesh>
            {/* SpotLight pointing up into the tree canopy */}
            <spotLight
              position={[0, 0.15, 0]}
              angle={Math.PI / 4.5}
              penumbra={0.9}
              intensity={2.5}
              distance={6.0}
              color="#ffc163" // Warm golden light
              castShadow
            />
          </group>
        ))}

        {/* Main Trunk */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.3, 2.0, 8]} />
          <meshStandardMaterial color="#1e1b18" roughness={0.9} />
        </mesh>
        
        {/* Branch 1 (Extending right and up) */}
        <group position={[0, 1.8, 0]} rotation={[0, 0.5, -0.6]}>
          <mesh position={[0, 1.0, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.2, 2.0, 8]} />
            <meshStandardMaterial color="#1e1b18" roughness={0.9} />
          </mesh>
          
          {/* Sub-branch 1a */}
          <group position={[0, 1.8, 0]} rotation={[0.4, 0, -0.4]}>
            <mesh position={[0, 0.8, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.12, 1.6, 6]} />
              <meshStandardMaterial color="#1e1b18" roughness={0.9} />
            </mesh>
            {/* Fine twigs */}
            <group position={[0, 1.5, 0]} rotation={[0.2, 0.6, 0.3]}>
              <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.02, 0.07, 1.0, 6]} />
                <meshStandardMaterial color="#1e1b18" roughness={0.9} />
              </mesh>
            </group>
          </group>

          {/* Sub-branch 1b */}
          <group position={[0, 1.4, 0]} rotation={[-0.3, 0.5, -0.5]}>
            <mesh position={[0, 0.7, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.1, 1.4, 6]} />
              <meshStandardMaterial color="#1e1b18" roughness={0.9} />
            </mesh>
          </group>
        </group>

        {/* Branch 2 (Extending left and up) */}
        <group position={[0, 1.6, 0]} rotation={[0, -0.8, 0.4]}>
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, 1.8, 8]} />
            <meshStandardMaterial color="#1e1b18" roughness={0.9} />
          </mesh>
          
          {/* Sub-branch 2a */}
          <group position={[0, 1.7, 0]} rotation={[0.5, 0.2, 0.5]}>
            <mesh position={[0, 0.8, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.15, 1.6, 6]} />
              <meshStandardMaterial color="#1e1b18" roughness={0.9} />
            </mesh>
          </group>
        </group>

        {/* Branch 3 (Main central arch arching over the top) */}
        <group position={[0, 1.9, 0]} rotation={[-0.4, 0.2, -0.2]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.16, 2.4, 8]} />
            <meshStandardMaterial color="#1e1b18" roughness={0.9} />
          </mesh>
          
          {/* Sub-branch 3a (Extends far to the right, framing the ceiling) */}
          <group position={[0, 2.2, 0]} rotation={[0.1, -0.8, -0.6]}>
            <mesh position={[0, 1.2, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.1, 2.4, 6]} />
              <meshStandardMaterial color="#1e1b18" roughness={0.9} />
            </mesh>
            {/* Fine twigs hanging down */}
            {[-0.5, 0.5, 1.0].map((yOffset, tIdx) => (
              <group key={`twig-${tIdx}`} position={[0, 1.2 + yOffset, 0]} rotation={[0.8, 0, -0.2]}>
                <mesh position={[0, 0.5, 0]}>
                  <cylinderGeometry args={[0.015, 0.05, 1.0, 5]} />
                  <meshStandardMaterial color="#1e1b18" roughness={0.9} />
                </mesh>
              </group>
            ))}
          </group>
        </group>
      </group>
    </group>
  )
}
