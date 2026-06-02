import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  createWoodSlatsTexture,
  createColumnWoodTexture,
  createConcreteTexture
} from '../utils/textures'

interface PavilionProps {
  isDoorOpen?: boolean
  onToggleDoor?: () => void
}

export default function Pavilion({
  isDoorOpen = false,
  onToggleDoor
}: PavilionProps) {
  const leftSlidingRef = useRef<THREE.Group>(null)
  const rightSlidingRef = useRef<THREE.Group>(null)

  useFrame(() => {
    // Left sliding panel target position (overlap fixed left panel when open)
    const targetLeftX = isDoorOpen ? -3.3 : -1.125
    // Right sliding panel target position (overlap fixed right panel when open)
    const targetRightX = isDoorOpen ? 3.3 : 1.125

    if (leftSlidingRef.current) {
      leftSlidingRef.current.position.x = THREE.MathUtils.lerp(
        leftSlidingRef.current.position.x,
        targetLeftX,
        0.1
      )
    }
    if (rightSlidingRef.current) {
      rightSlidingRef.current.position.x = THREE.MathUtils.lerp(
        rightSlidingRef.current.position.x,
        targetRightX,
        0.1
      )
    }
  })

  // Memoize textures so they aren't recreated on every render
  const textures = useMemo(() => {
    const slats = createWoodSlatsTexture()
    const colWood = createColumnWoodTexture()
    const concrete = createConcreteTexture()
    return { slats, colWood, concrete }
  }, [])

  return (
    <group>
      {/* ======================================================== */}
      {/* FLOORS & DECK                                            */}
      {/* ======================================================== */}
      
      {/* Main floating concrete deck slab */}
      <mesh position={[1.5, 0.2, 0.0]} receiveShadow castShadow>
        <boxGeometry args={[9.5, 0.4, 7.0]} />
        <meshStandardMaterial
          map={textures.concrete}
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* Green grass lawn (lower landscape base) */}
      <mesh position={[-6.2, 0.0, 3.75]} receiveShadow castShadow>
        <boxGeometry args={[8.0, 0.38, 11.5]} />
        <meshStandardMaterial
          color="#15803d" // Lush grass green
          roughness={1.0}
          metalness={0.0}
        />
      </mesh>

      {/* Stepping stone pathway on the lawn */}
      {[
        // Pool connection area (repositioned to not overlap pool coping)
        { pos: [-7.6, 0.2, -1.1], size: [1.8, 0.04, 1.0] as [number, number, number] },
        { pos: [-7.0, 0.2, 0.4], size: [1.8, 0.04, 1.2] as [number, number, number] },
        { pos: [-5.8, 0.2, 1.7], size: [1.8, 0.04, 1.2] as [number, number, number] },
        // Pavilion steps connection
        { pos: [-3.4, 0.2, 1.7], size: [1.6, 0.04, 1.2] as [number, number, number] },
        // Winding path passing next to the tree
        { pos: [-5.0, 0.2, 3.2], size: [1.8, 0.04, 1.2] as [number, number, number] },
        { pos: [-5.5, 0.2, 5.0], size: [1.8, 0.04, 1.2] as [number, number, number] } // right next to the tree
      ].map((p, idx) => (
        <mesh key={`paver-${idx}`} position={p.pos} receiveShadow castShadow>
          <boxGeometry args={p.size} />
          <meshStandardMaterial
            map={textures.concrete}
            roughness={0.85}
            metalness={0.0}
          />
        </mesh>
      ))}

      {/* Small floating steps/slabs bridging walkway and deck */}
      <group>
        {/* Step 1 */}
        <mesh position={[-2.2, 0.1, 2.5]} receiveShadow>
          <boxGeometry args={[1.5, 0.2, 1.2]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
        </mesh>
        {/* Step 1 Linear COB LED Strip */}
        <mesh position={[-2.2, 0.01, 3.05]}>
          <boxGeometry args={[1.4, 0.02, 0.03]} />
          <meshStandardMaterial color="#fffbeb" emissive="#ff9d42" emissiveIntensity={4.0} />
        </mesh>
        {/* Step 1 Point light casting glow onto the lawn */}
        <pointLight position={[-2.2, -0.05, 2.5]} distance={2.5} intensity={1.5} color="#ff9d42" />

        {/* Step 2 */}
        <mesh position={[-2.2, 0.1, 0.5]} receiveShadow>
          <boxGeometry args={[1.5, 0.2, 1.2]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
        </mesh>
        {/* Step 2 Linear COB LED Strip */}
        <mesh position={[-2.2, 0.01, 1.05]}>
          <boxGeometry args={[1.4, 0.02, 0.03]} />
          <meshStandardMaterial color="#fffbeb" emissive="#ff9d42" emissiveIntensity={4.0} />
        </mesh>
        {/* Step 2 Point light casting glow onto the lawn */}
        <pointLight position={[-2.2, -0.05, 0.5]} distance={2.5} intensity={1.5} color="#ff9d42" />
      </group>

      {/* ======================================================== */}
      {/* COLUMNS / PILLARS                                       */}
      {/* ======================================================== */}
      
      {/* Column 1 (Left foreground) with vertical COB LED light */}
      <group>
        <mesh position={[-3.0, 2.2, 3.2]} castShadow receiveShadow>
          <boxGeometry args={[0.45, 3.6, 0.45]} />
          <meshStandardMaterial map={textures.colWood} roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Inside vertical COB LED strip */}
        <mesh position={[-2.76, 2.2, 2.96]}>
          <boxGeometry args={[0.02, 3.58, 0.02]} />
          <meshStandardMaterial color="#fffbeb" emissive="#ff9d42" emissiveIntensity={4.0} />
        </mesh>
      </group>

      {/* Column 2 (Right center foreground) with vertical COB LED light */}
      <group>
        <mesh position={[6.0, 2.2, 3.2]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 3.6, 0.5]} />
          <meshStandardMaterial map={textures.colWood} roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Inside vertical COB LED strip */}
        <mesh position={[5.73, 2.2, 2.93]}>
          <boxGeometry args={[0.02, 3.58, 0.02]} />
          <meshStandardMaterial color="#fffbeb" emissive="#ff9d42" emissiveIntensity={4.0} />
        </mesh>
      </group>

      {/* Column 3 (Far left pool side) with vertical COB LED light */}
      <group>
        <mesh position={[-3.0, 2.2, -3.2]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 3.6, 0.4]} />
          <meshStandardMaterial map={textures.colWood} roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Inside vertical COB LED strip */}
        <mesh position={[-2.78, 2.2, -2.98]}>
          <boxGeometry args={[0.02, 3.58, 0.02]} />
          <meshStandardMaterial color="#fffbeb" emissive="#ff9d42" emissiveIntensity={4.0} />
        </mesh>
      </group>

      {/* Column 4 (Inside right background structural) with vertical COB LED light */}
      <group>
        <mesh position={[6.0, 2.2, -3.2]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 3.6, 0.4]} />
          <meshStandardMaterial map={textures.colWood} roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Inside vertical COB LED strip */}
        <mesh position={[5.78, 2.2, -2.98]}>
          <boxGeometry args={[0.02, 3.58, 0.02]} />
          <meshStandardMaterial color="#fffbeb" emissive="#ff9d42" emissiveIntensity={4.0} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* ROOF STRUCTURE                                           */}
      {/* ======================================================== */}
      
      {/* Main roof slab (thick core) */}
      <mesh position={[1.5, 4.2, 0.0]} castShadow>
        <boxGeometry args={[10.2, 0.4, 7.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>

      {/* Charcoal metal roof fascia (outer dark frame) */}
      <mesh position={[1.5, 4.25, 0.0]}>
        <boxGeometry args={[10.4, 0.5, 7.8]} />
        <meshStandardMaterial
          color="#0f172a" // Very dark slate/navy
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Wood-paneled ceiling (underside mapping) */}
      <mesh position={[1.5, 3.99, 0.0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10.0, 7.4]} />
        <meshStandardMaterial
          map={textures.slats}
          roughness={0.5}
          metalness={0.15}
        />
      </mesh>

      {/* Recessed Ceiling Downlights */}
      {[
        [-1.2, -1.8], [1.5, -1.8], [4.2, -1.8],
        [-1.2, 1.8], [1.5, 1.8], [4.2, 1.8]
      ].map((pos, idx) => (
        <group key={`downlight-${idx}`} position={[pos[0], 3.98, pos[1]]}>
          {/* Black trim ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.01, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.6} />
          </mesh>
          {/* Glowing central diode */}
          <mesh position={[0, -0.005, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.01, 12]} />
            <meshStandardMaterial color="#fffbeb" emissive="#ffea8f" emissiveIntensity={5.0} />
          </mesh>
        </group>
      ))}


      {/* ======================================================== */}
      {/* OUTDOOR KITCHEN ISLAND                                   */}
      {/* ======================================================== */}
      <group position={[4.0, 0.4, 1.5]}>
        {/* Concrete main island block */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.9, 1.1]} />
          <meshStandardMaterial
            map={textures.concrete}
            roughness={0.8}
            metalness={0.0}
          />
        </mesh>
        
        {/* Built-in metal BBQ Grill unit */}
        <mesh position={[-0.2, 0.91, 0]} castShadow>
          <boxGeometry args={[1.2, 0.04, 0.8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Grill hood / handle */}
        <mesh position={[-0.2, 0.96, 0.2]} castShadow>
          <boxGeometry args={[1.0, 0.06, 0.1]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Kitchen Sink & Faucet */}
        <mesh position={[0.7, 0.905, 0]} castShadow>
          <boxGeometry args={[0.6, 0.01, 0.6]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Faucet arc */}
        <mesh position={[0.7, 1.1, -0.2]} rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.15, 0.02, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Lit fridge front window */}
        <mesh position={[0.0, 0.45, 0.56]} castShadow>
          <boxGeometry args={[0.8, 0.6, 0.02]} />
          <meshPhysicalMaterial
            color="#bae6fd"
            roughness={0.1}
            transmission={0.8}
            ior={1.5}
            thickness={0.1}
            emissive="#0284c7"
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* DINING AREA                                              */}
      {/* ======================================================== */}
      <group position={[0.5, 0.4, 0.5]}>
        {/* Table Top */}
        <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.08, 1.1]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.1} />
        </mesh>
        
        {/* Table Legs */}
        {[-1.0, 1.0].map((x, idx1) => 
          [-0.45, 0.45].map((z, idx2) => (
            <mesh 
              key={`leg-${idx1}-${idx2}`} 
              position={[x, 0.3, z]} 
              castShadow
            >
              <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
              <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
            </mesh>
          ))
        )}

        {/* Chairs (6 surrounding table) */}
        {[
          // Back side chairs
          { pos: [-0.7, 0.35, 0.8], rot: 0 },
          { pos: [0.0, 0.35, 0.8], rot: 0 },
          { pos: [0.7, 0.35, 0.8], rot: 0 },
          // Front side chairs
          { pos: [-0.7, 0.35, -0.8], rot: Math.PI },
          { pos: [0.0, 0.35, -0.8], rot: Math.PI },
          { pos: [0.7, 0.35, -0.8], rot: Math.PI }
        ].map((c, i) => (
          <group key={`chair-${i}`} position={c.pos} rotation={[0, c.rot, 0]}>
            {/* Seat */}
            <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.4, 0.05, 0.4]} />
              <meshStandardMaterial color="#334155" roughness={0.8} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, 0.35, 0.18]} castShadow>
              <boxGeometry args={[0.4, 0.4, 0.04]} />
              <meshStandardMaterial color="#1e293b" roughness={0.8} />
            </mesh>
            {/* Thin Legs */}
            {[-0.18, 0.18].map((x, legX) => 
              [-0.18, 0.18].map((z, legZ) => (
                <mesh key={`cleg-${legX}-${legZ}`} position={[x, -0.1, z]} castShadow>
                  <cylinderGeometry args={[0.015, 0.015, 0.4, 6]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.7} />
                </mesh>
              ))
            )}
          </group>
        ))}
      </group>

      {/* ======================================================== */}
      {/* INDOOR LIVING ROOM LOUNGE (Right interior)               */}
      {/* ======================================================== */}
      <group position={[4.5, 0.4, -1.8]}>
        {/* L-shaped Cozy Sofa */}
        {/* Main back section */}
        <mesh position={[0.2, 0.3, -0.4]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.5, 0.8]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
        </mesh>
        {/* L-extension section */}
        <mesh position={[0.9, 0.3, 0.4]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.5, 1.0]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
        </mesh>
        {/* Backrest pillows */}
        <mesh position={[0.2, 0.65, -0.7]} castShadow>
          <boxGeometry args={[2.0, 0.4, 0.2]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
        </mesh>

        {/* Wooden Coffee Table */}
        <mesh position={[-0.4, 0.15, 0.4]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.2, 0.8]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>

        {/* Sleek Interior Floor Lamp */}
        <group position={[1.0, 0.0, -1.0]}>
          <mesh position={[0, 0.02, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.8, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          {/* Glowing shade */}
          <mesh position={[0, 1.7, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.35, 16]} />
            <meshStandardMaterial 
              color="#ffeedb" 
              emissive="#ff9d42" 
              emissiveIntensity={1.5}
            />
          </mesh>
        </group>
      </group>

      {/* ======================================================== */}
      {/* SLIDING GLASS DOORS (Rear boundary)                      */}
      {/* ======================================================== */}
      <group position={[1.5, 0.4, -3.35]}>
        {/* Metal tracks (Top and Bottom) */}
        {/* Bottom track */}
        <mesh position={[0, 0.02, 0]} castShadow>
          <boxGeometry args={[9.0, 0.04, 0.16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Top track */}
        <mesh position={[0, 3.58, 0]}>
          <boxGeometry args={[9.0, 0.04, 0.16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Panel A: Fixed Glass Panel (Far Left) */}
        <GlassDoorPanel
          width={2.25}
          height={3.5}
          depth={0.06}
          borderThickness={0.07}
          position={[-3.375, 1.8, -0.02]}
        />

        {/* Panel B: Sliding Glass Panel (Center Left) */}
        <GlassDoorPanel
          width={2.25}
          height={3.5}
          depth={0.06}
          borderThickness={0.07}
          groupRef={leftSlidingRef}
          position={[-1.125, 1.8, 0.02]}
          isInteractive={true}
          onClick={onToggleDoor}
          hasHandle={true}
          handleSide={1} // Right side
        />

        {/* Panel C: Sliding Glass Panel (Center Right) */}
        <GlassDoorPanel
          width={2.25}
          height={3.5}
          depth={0.06}
          borderThickness={0.07}
          groupRef={rightSlidingRef}
          position={[1.125, 1.8, 0.02]}
          isInteractive={true}
          onClick={onToggleDoor}
          hasHandle={true}
          handleSide={-1} // Left side
        />

        {/* Panel D: Fixed Glass Panel (Far Right) */}
        <GlassDoorPanel
          width={2.25}
          height={3.5}
          depth={0.06}
          borderThickness={0.07}
          position={[3.375, 1.8, -0.02]}
        />
      </group>
    </group>
  )
}

// ========================================================
// GLASS DOOR PANEL COMPONENT
// ========================================================

interface DoorPanelProps {
  width: number
  height: number
  depth: number
  borderThickness: number
  groupRef?: React.RefObject<THREE.Group>
  position: [number, number, number]
  isInteractive?: boolean
  onClick?: () => void
  hasHandle?: boolean
  handleSide?: number // 1 for right, -1 for left
}

function GlassDoorPanel({
  width,
  height,
  depth,
  borderThickness,
  groupRef,
  position,
  isInteractive = false,
  onClick,
  hasHandle = false,
  handleSide = 1
}: DoorPanelProps) {
  const glassW = width - borderThickness * 2
  const glassH = height - borderThickness * 2

  const handlePointerOver = (e: any) => {
    if (isInteractive) {
      e.stopPropagation()
      document.body.style.cursor = 'pointer'
    }
  }

  const handlePointerOut = (e: any) => {
    if (isInteractive) {
      e.stopPropagation()
      document.body.style.cursor = 'auto'
    }
  }

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        if (isInteractive && onClick) {
          e.stopPropagation()
          onClick()
        }
      }}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Outer borders (Solid charcoal frame) */}
      {/* Top border */}
      <mesh position={[0, height / 2 - borderThickness / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, borderThickness, depth]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Bottom border */}
      <mesh position={[0, -height / 2 + borderThickness / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, borderThickness, depth]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Left border */}
      <mesh position={[-width / 2 + borderThickness / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[borderThickness, height - borderThickness * 2, depth]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Right border */}
      <mesh position={[width / 2 - borderThickness / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[borderThickness, height - borderThickness * 2, depth]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Glass Pane */}
      <mesh receiveShadow>
        <boxGeometry args={[glassW, glassH, 0.015]} />
        <meshPhysicalMaterial
          color="#bae6fd"
          transparent={true}
          opacity={0.15}
          transmission={0.95}
          ior={1.5}
          roughness={0.05}
          depthWrite={false}
          metalness={0.1}
        />
      </mesh>

      {/* Minimalist vertical handle bar */}
      {hasHandle && (
        <mesh position={[handleSide * (width / 2 - borderThickness - 0.04), 0, 0.05]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.8, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </mesh>
      )}
    </group>
  )
}
