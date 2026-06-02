import { useState, useEffect } from 'react'
import Scene from './components/Scene'
import Controls from './components/Controls'

export default function App() {
  const [mode, setMode] = useState<'day' | 'dusk'>('day')
  const [isDoorOpen, setIsDoorOpen] = useState(false)
  const [activeDesign, setActiveDesign] = useState<'pavilion' | 'batten' | 'downlight'>('pavilion')
  
  // Loading screen state
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Soft delay to let Three.js assets and canvas initialize before fade-out
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="app-container">
      {/* Loading overlay screen */}
      {isLoading && (
        <div className="loading-screen" style={{ opacity: isLoading ? 1 : 0 }}>
          <div className="spinner"></div>
          <p className="loading-text">3D Visualizer Designs</p>
          <p style={{ color: '#64748b', fontSize: '12px' }}>Compiling 3D Scene Shader...</p>
        </div>
      )}

      {/* Fullscreen 3D Canvas */}
      <Scene
        mode={mode}
        lightsIntensity={1.0}
        sunIntensity={1.0}
        cameraPreset="side"
        isDoorOpen={isDoorOpen}
        setIsDoorOpen={setIsDoorOpen}
        activeDesign={activeDesign}
      />

      {/* Sleek UI Control Panel and Dashboard */}
      <Controls
        mode={mode}
        setMode={setMode}
        isDoorOpen={isDoorOpen}
        setIsDoorOpen={setIsDoorOpen}
        activeDesign={activeDesign}
        setActiveDesign={setActiveDesign}
      />
    </div>
  )
}

