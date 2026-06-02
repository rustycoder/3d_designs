import { useMemo } from 'react'
import * as THREE from 'three'
import { createConcreteTexture, createFlutedTexture, createHeatSinkTexture } from '../utils/textures'

interface ShowcaseSpacesProps {
  type: 'batten' | 'downlight'
  mode: 'day' | 'dusk'
}

// ─────────────────────────────────────────────────────────────────────────────
// RECESSED DOWNLIGHT — accurate 3D model based on technical drawings
//
// Spec from drawings:
//   • Outer diameter : 75mm  → scene units: 0.075 (we scale ×10 → 0.75)
//   • Height (body)  : 88mm  → scene units: 0.88
//
// Parts (top to bottom, fixture mounted at ceiling Y=4.0, hanging downward):
//   1. Driver junction box (square, die-cast aluminium)
//   2. Heat-sink cylinder with 32 radial vertical fins (dark anodised)
//   3. Anti-glare baffle (deep dark cylinder, narrowing inward)
//   4. Trim / bezel ring (white, flush with ceiling)
//   5. LED emitter disc (glowing centre)
//   6. Spring mounting clips ×4 (thin metal brackets with pivot)
// ─────────────────────────────────────────────────────────────────────────────
function RecessedDownlight({ mode }: { mode: 'day' | 'dusk' }) {
  const heatSinkTex = useMemo(() => {
    const t = createHeatSinkTexture()
    t.repeat.set(1, 1)
    return t
  }, [])

  const emissiveColor  = mode === 'dusk' ? '#ffeeba' : '#ffffff'
  const emissiveIntens = mode === 'dusk' ? 6.0 : 2.5
  const lightIntens    = mode === 'dusk' ? 8.0 : 4.0

  // Shared materials
  const darkAlumMat = {
    color: '#1c1c20' as const,
    metalness: 0.7,
    roughness: 0.35,
  }
  const whiteTrimMat = {
    color: '#e8e8e8' as const,
    metalness: 0.4,
    roughness: 0.3,
  }
  const springClipMat = {
    color: '#b0b8c1' as const,
    metalness: 0.85,
    roughness: 0.2,
  }

  // D = 0.75 (75mm ×10), H = 0.88 (88mm ×10)
  const D      = 0.75   // outer diameter of bezel
  const R      = D / 2  // 0.375

  // Body sections (heights proportional to the real drawing)
  const trimH       = 0.02   // thin bezel ring
  const baffleH     = 0.28   // anti-glare deep black cylinder
  const heatSinkH   = 0.38   // finned heat-sink
  const driverH     = 0.20   // square driver junction box
  const totalH      = trimH + baffleH + heatSinkH + driverH  // ≈ 0.88

  // Y positions (fixture origin at 0, grows upward — will be positioned at ceiling)
  const trimY       = 0
  const baffleY     = trimH + baffleH / 2
  const heatSinkY   = trimH + baffleH + heatSinkH / 2
  const driverY     = trimH + baffleH + heatSinkH + driverH / 2

  // Radial cooling fins — 32 thin rectangular fins wrapping the heat-sink cylinder
  const numFins = 32
  const finThick = 0.005
  const finDepth = 0.025
  const finRadius = R * 0.92 + finDepth / 2  // placed just outside heat-sink body

  return (
    <group>
      {/* ── 5. LED emitter disc (bottom-most, glowing, recessed inside baffle) ── */}
      <mesh position={[0, trimH + 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R * 0.28, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntens}
          roughness={0.1}
          metalness={0}
        />
      </mesh>

      {/* Light source emitted from LED */}
      <pointLight
        position={[0, trimH + 0.05, 0]}
        color={mode === 'dusk' ? '#ffd580' : '#fff5e0'}
        intensity={lightIntens}
        distance={6}
        decay={1.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
      />

      {/* ── 4. Bezel / trim ring (white, flush face visible when installed) ── */}
      {/* Outer flat ring face */}
      <mesh position={[0, trimY + trimH / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[R * 0.82, R * 1.02, 64]} />
        <meshStandardMaterial {...whiteTrimMat} />
      </mesh>
      {/* Trim ring edge (thin vertical band) */}
      <mesh position={[0, trimY + trimH / 2, 0]}>
        <cylinderGeometry args={[R * 1.02, R * 1.02, trimH, 64, 1, true]} />
        <meshStandardMaterial {...whiteTrimMat} side={THREE.BackSide} />
      </mesh>
      {/* Inner lip of the ring */}
      <mesh position={[0, trimY + trimH / 2, 0]}>
        <cylinderGeometry args={[R * 0.82, R * 0.82, trimH * 1.5, 64, 1, true]} />
        <meshStandardMaterial {...whiteTrimMat} />
      </mesh>

      {/* ── 3. Anti-glare baffle (deep dark cylinder — creates the recessed effect) ── */}
      {/* Outer baffle wall */}
      <mesh position={[0, baffleY, 0]}>
        <cylinderGeometry args={[R * 0.82, R * 0.80, baffleH, 64, 1, true]} />
        <meshStandardMaterial color="#0d0d0f" roughness={0.9} metalness={0.1} side={THREE.FrontSide} />
      </mesh>
      {/* Inner baffle — micro-stepped narrowing toward emitter for anti-glare */}
      <mesh position={[0, baffleY - 0.04, 0]}>
        <cylinderGeometry args={[R * 0.68, R * 0.80, baffleH * 0.85, 48, 1, true]} />
        <meshStandardMaterial color="#080808" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* ── 2. Heat-sink cylinder (dark anodised with fin texture) ── */}
      {/* Solid cylinder body */}
      <mesh position={[0, heatSinkY, 0]}>
        <cylinderGeometry args={[R * 0.78, R * 0.82, heatSinkH, 64, 1, true]} />
        <meshStandardMaterial
          map={heatSinkTex}
          {...darkAlumMat}
          side={THREE.FrontSide}
        />
      </mesh>
      {/* Top cap of heat sink */}
      <mesh position={[0, trimH + baffleH + heatSinkH, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R * 0.78, 48]} />
        <meshStandardMaterial {...darkAlumMat} />
      </mesh>

      {/* 32 radial cooling fins wrapped around the heat-sink cylinder */}
      {Array.from({ length: numFins }).map((_, i) => {
        const angle = (i / numFins) * Math.PI * 2
        return (
          <mesh
            key={`fin-${i}`}
            position={[
              Math.cos(angle) * finRadius,
              heatSinkY,
              Math.sin(angle) * finRadius
            ]}
            rotation={[0, -angle, 0]}
          >
            <boxGeometry args={[finThick, heatSinkH * 0.92, finDepth]} />
            <meshStandardMaterial
              color="#2a2a30"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
        )
      })}

      {/* ── 1. Driver / junction box (square die-cast housing on top) ── */}
      {/* Main square housing — slightly narrower than the cylinder */}
      <mesh position={[0, driverY, 0]}>
        <boxGeometry args={[R * 1.1, driverH, R * 1.1]} />
        <meshStandardMaterial {...darkAlumMat} roughness={0.5} />
      </mesh>
      {/* Two rectangular terminal slots on the front face */}
      <mesh position={[0, driverY + 0.01, R * 0.56]}>
        <boxGeometry args={[R * 0.25, driverH * 0.5, 0.008]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.9} />
      </mesh>
      <mesh position={[R * 0.28, driverY + 0.01, R * 0.56]}>
        <boxGeometry args={[R * 0.1, driverH * 0.35, 0.008]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.9} />
      </mesh>
      {/* Small cable entry grommet on top */}
      <mesh position={[0, driverY + driverH / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.022, 0.025, 16]} />
        <meshStandardMaterial color="#333338" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* ── 6. Spring mounting clips ×4 (at 0°, 90°, 180°, 270°) ── */}
      {/* Each clip: a thin metal L-bracket with a spring arm */}
      {[0, 90, 180, 270].map((deg, idx) => {
        const rad = (deg * Math.PI) / 180
        const cx  = Math.cos(rad) * (R * 0.88)
        const cz  = Math.sin(rad) * (R * 0.88)

        return (
          <group
            key={`clip-${idx}`}
            position={[cx, trimH + baffleH * 0.15, cz]}
            rotation={[0, -rad, 0]}
          >
            {/* Vertical mounting arm */}
            <mesh position={[0, 0.06, 0]}>
              <boxGeometry args={[0.008, 0.14, 0.018]} />
              <meshStandardMaterial {...springClipMat} />
            </mesh>
            {/* Angled spring tab (pivots outward when uncompressed) */}
            <mesh position={[0, 0.12, 0.04]} rotation={[0.5, 0, 0]}>
              <boxGeometry args={[0.008, 0.10, 0.016]} />
              <meshStandardMaterial {...springClipMat} />
            </mesh>
            {/* Horizontal foot tab */}
            <mesh position={[0, -0.005, 0.04]} rotation={[Math.PI / 4, 0, 0]}>
              <boxGeometry args={[0.008, 0.03, 0.045]} />
              <meshStandardMaterial {...springClipMat} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main showcase: single downlight mounted to a thin white ceiling panel,
// floating in empty space. The panel simulates a section of a real ceiling.
// ─────────────────────────────────────────────────────────────────────────────
export default function ShowcaseSpaces({ type, mode }: ShowcaseSpacesProps) {
  const concreteTexture = useMemo(() => {
    const tex = createConcreteTexture()
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(3, 2)
    return tex
  }, [])

  const flutedTexture = useMemo(() => {
    const tex = createFlutedTexture()
    return tex
  }, [])

  const lightColor    = mode === 'dusk' ? '#ffdfa9' : '#fafaf9'
  const emissiveColor = mode === 'dusk' ? '#ff9f43' : '#ffffff'

  return (
    <group>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  RECESSED DOWNLIGHT — product showcase in empty space               */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {type === 'downlight' && (
        <group>
          {/* ── Floating ceiling panel (represents the installation surface) ── */}
          {/* Main ceiling slab */}
          <mesh position={[0, 2.4, 0]} receiveShadow castShadow>
            <boxGeometry args={[2.0, 0.06, 2.0]} />
            <meshStandardMaterial color="#d4d8dc" roughness={0.55} metalness={0.05} />
          </mesh>
          {/* Cutout ring (black aperture hole where fixture mounts) — sits just below */}
          <mesh position={[0, 2.365, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.375, 0.51, 64]} />
            <meshStandardMaterial color="#111113" roughness={0.9} side={THREE.DoubleSide} />
          </mesh>

          {/* ── The actual downlight fixture, origin at trim-ring face ── */}
          {/* Fixture is mounted upside-down from the ceiling:
              the trim ring sits flush with the bottom face of the slab,
              the body extends upward into the slab cutout */}
          <group position={[0, 2.37, 0]} rotation={[Math.PI, 0, 0]}>
            <RecessedDownlight mode={mode} />
          </group>

          {/* ── Studio key + fill lights for product visualization ── */}
          {/* Warm top key light from above-left */}
          <directionalLight
            position={[-2.5, 5.0, 3.0]}
            color="#e8ecf0"
            intensity={mode === 'dusk' ? 0.6 : 1.8}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          {/* Cool fill from right */}
          <directionalLight
            position={[3.0, 4.0, -2.0]}
            color="#c8d4e8"
            intensity={mode === 'dusk' ? 0.2 : 0.7}
          />
          {/* Soft back-rim light to separate fixture from bg */}
          <directionalLight
            position={[0, 1.0, -4.0]}
            color="#ffffff"
            intensity={mode === 'dusk' ? 0.1 : 0.4}
          />
          {/* Ambient fill */}
          <ambientLight
            color="#b0bec5"
            intensity={mode === 'dusk' ? 0.04 : 0.18}
          />

          {/* ── Thin ground shadow catcher (invisible, catches the light pool) ── */}
          <mesh position={[0, 0.0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[6, 6]} />
            <meshStandardMaterial color="#0d0d0f" roughness={1} metalness={0} />
          </mesh>
        </group>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  LED BATTEN — floating in empty space (unchanged)                   */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {type === 'batten' && (
        <group>
          {/* Professional 3D Grid Helper in empty space to ground the floating model */}
          <gridHelper args={[12, 12, '#334155', '#1e293b']} position={[0, 1.2, 0]} />

          {/* Floating Surface Mounted LED Batten (Centered at camera target Y=2.4) */}
          <group position={[0, 2.4, 0]}>

            {/* 1. Metal Mount Base Plate (1.1m long, 92mm wide) */}
            <mesh position={[0, 0.045, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.1, 0.015, 0.092]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* 2. Tapered Housing Profile Casing */}
            <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.1, 0.045, 0.082]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.4} />
            </mesh>

            {/* 3. Glowing Polycarbonate Fluted Diffuser Lens */}
            <mesh position={[0, -0.02, 0]} castShadow>
              <boxGeometry args={[1.08, 0.03, 0.076]} />
              <meshStandardMaterial
                map={flutedTexture}
                color="#ffffff"
                emissive={emissiveColor}
                emissiveIntensity={mode === 'dusk' ? 3.0 : 1.5}
                roughness={0.2}
                metalness={0.1}
              />
            </mesh>

            {/* Curved bottom cover of diffuser (Cylinder parallel to X-axis) */}
            <mesh position={[0, -0.035, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.038, 0.038, 1.08, 16]} />
              <meshStandardMaterial
                map={flutedTexture}
                color="#ffffff"
                emissive={emissiveColor}
                emissiveIntensity={mode === 'dusk' ? 3.0 : 1.5}
                roughness={0.2}
                metalness={0.1}
              />
            </mesh>

            {/* 4. Left End Cap (with cable glands) */}
            <group position={[-0.555, 0, 0]}>
              <mesh position={[0, 0.01, 0]} castShadow>
                <boxGeometry args={[0.01, 0.08, 0.092]} />
                <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.5} />
              </mesh>
              <mesh position={[0, 0.05, 0]} castShadow>
                <boxGeometry args={[0.01, 0.02, 0.065]} />
                <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.5} />
              </mesh>
              <mesh position={[-0.01, 0.05, -0.018]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.01, 0.01, 0.015, 12]} />
                <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
              </mesh>
              <mesh position={[-0.01, 0.05, 0.018]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.01, 0.01, 0.015, 12]} />
                <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>

            {/* 5. Right End Cap */}
            <group position={[0.555, 0, 0]}>
              <mesh position={[0, 0.01, 0]} castShadow>
                <boxGeometry args={[0.01, 0.08, 0.092]} />
                <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.5} />
              </mesh>
            </group>
          </group>

          {/* Studio lighting for batten */}
          <pointLight
            position={[0, 2.35, 0]}
            color={lightColor}
            intensity={mode === 'dusk' ? 3.5 : 1.8}
            distance={8.0}
            decay={1.4}
          />
          <directionalLight position={[0, 4.0, 4.0]} color="#ffffff" intensity={1.2} />
          <directionalLight position={[-2.0, 3.0, -2.0]} color={lightColor} intensity={0.4} />
        </group>
      )}

    </group>
  )
}
