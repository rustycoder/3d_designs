import { useState } from 'react'
import {
  Sun,
  Moon,
  Info,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Layers,
  Lightbulb,
  Home,
  X
} from 'lucide-react'

interface ControlsProps {
  mode: 'day' | 'dusk'
  setMode: (mode: 'day' | 'dusk') => void
  isDoorOpen: boolean
  setIsDoorOpen: (open: boolean) => void
  activeDesign: 'pavilion' | 'batten' | 'downlight' | 'nail'
  setActiveDesign: (design: 'pavilion' | 'batten' | 'downlight' | 'nail') => void
}

export default function Controls({
  mode,
  setMode,
  isDoorOpen,
  setIsDoorOpen,
  activeDesign,
  setActiveDesign
}: ControlsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isProjectsOpen, setIsProjectsOpen] = useState(false)

  // Dynamic description card content based on selected lighting design/product
  const conceptContent = {
    pavilion: {
      name: "Pavilion",
      desc: "A minimalist luxury outdoor pavilion designed with structural wood framing, a floating concrete foundation slab, and full-height folding glass facades. The pavilion sits cantilevered over a dark reflecting pond, creating continuous visual symmetry.",
      tags: ["Wood & Concrete", "Reflecting Water", "Indoor-Outdoor"]
    },
    batten: {
      name: "Surface mounted LED batten",
      desc: "An empty minimalist gallery space designed to showcase the linear light distribution of a surface-mounted architectural LED batten. The fixture provides a uniform light wash on the ceiling and floor, highlighting structural lines.",
      tags: ["Linear Fixture", "Minimalist Space", "Wall Wash"]
    },
    downlight: {
      name: "Recessed downlight",
      desc: "A precision-engineered recessed downlight: 75mm aperture, 88mm body height. Features a deep anti-glare baffle, anodised aluminium heat-sink with 32 radial cooling fins, a die-cast driver housing, and 4 spring-clip mounting brackets for tool-less ceiling installation.",
      tags: ["75mm Aperture", "Anti-Glare Baffle", "Radial Heat Sink"]
    },
    nail: {
      name: "Nail",
      desc: "A high-fidelity GLB model rendered with physically-based materials and three-point studio lighting. Demonstrates seamless integration of external 3D assets using the useGLTF loader, with auto-centering, PBR material upgrades, and passive auto-rotation.",
      tags: ["GLB Model", "PBR Materials", "Studio Lighting"]
    }
  }

  const currentConcept = conceptContent[activeDesign]

  return (
    <div className="ui-overlay">
      {/* ======================================================== */}
      {/* SIDEBAR CONTAINER & STACKED DETAILS/CONTROLS CARD        */}
      {/* ======================================================== */}
      <div className="sidebar-container interactive">
        
        {/* Main Left Card: Design Listings Only */}
        <aside className={`controls-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
          {/* Collapse toggle button on the sidebar edge */}
          <button
            className="collapse-toggle-btn"
            onClick={() => {
              setIsCollapsed(!isCollapsed)
              if (!isCollapsed) setIsProjectsOpen(false) // auto-close drawer if collapsing
            }}
            title={isCollapsed ? "Expand Panel" : "Collapse Panel"}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {!isCollapsed ? (
            <div className="sidebar-content">
              {/* Design Listings Selection */}
              <div className="control-section">
                <h2>3D Visualizer Designs</h2>
                <div className="projects-list" style={{ marginTop: 0 }}>
                  <div 
                    className={`project-item-card compact ${activeDesign === 'pavilion' ? 'active' : ''}`} 
                    onClick={() => setActiveDesign('pavilion')}
                  >
                    <h3>Pavilion</h3>
                  </div>

                  <div 
                    className={`project-item-card compact ${activeDesign === 'batten' ? 'active' : ''}`} 
                    onClick={() => setActiveDesign('batten')}
                  >
                    <h3>Surface mounted LED batten</h3>
                  </div>

                  <div 
                    className={`project-item-card compact ${activeDesign === 'downlight' ? 'active' : ''}`} 
                    onClick={() => setActiveDesign('downlight')}
                  >
                    <h3>Recessed downlight</h3>
                  </div>

                  <div 
                    className={`project-item-card compact ${activeDesign === 'nail' ? 'active' : ''}`} 
                    onClick={() => setActiveDesign('nail')}
                  >
                    <h3>Nail</h3>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Collapsed Sidebar Indicator */
            <div className="collapsed-logo" onClick={() => setIsCollapsed(false)} title="Click to expand">
              <h1 style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '0.3em',
                color: 'var(--text-secondary)',
                opacity: 0.8,
                userSelect: 'none',
                textTransform: 'uppercase'
              }}>
                {currentConcept.name}
              </h1>
            </div>
          )}
        </aside>

        {/* Secondary Right Card: Design Controls Drawer */}
        <aside className={`projects-stacked-card ${isProjectsOpen ? 'expanded' : ''} ${isCollapsed ? 'collapsed-hidden' : ''}`}>
          {/* Close button tab on the outer edge (only visible when expanded) */}
          {!isCollapsed && (
            <button 
              className={`close-drawer-tab ${isProjectsOpen ? 'visible' : ''}`}
              onClick={() => setIsProjectsOpen(false)}
              title="Close Controls Drawer"
            >
              <X size={12} />
            </button>
          )}

          {/* Peeking tab trigger (only clickable when left sidebar is expanded) */}
          {!isCollapsed && (
            <div 
              className="peeking-tab" 
              onClick={() => setIsProjectsOpen(!isProjectsOpen)}
              title={isProjectsOpen ? "Close Controls Drawer" : "Open Controls Drawer"}
            >
              <div className="peeking-tab-content">
                <Sliders size={11} style={{ transform: 'rotate(-90deg)', marginBottom: '4px' }} />
                <span>CONTROLS</span>
              </div>
            </div>
          )}

          <div className="projects-card-content">

            {/* Application Logo & Active Design details */}
            <div className="projects-header" style={{ paddingRight: '28px' }}>
              <h1 style={{
                fontSize: activeDesign === 'pavilion' ? '20px' : '15px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: '1.2',
                textTransform: 'uppercase'
              }}>
                {currentConcept.name}
              </h1>
              
              <div className="tag-list" style={{ marginTop: '8px' }}>
                <span className="tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={10} color="#d4af37" /> R3F Mockup
                </span>
              </div>
              
              <hr className="sidebar-divider" style={{ margin: '14px 0' }} />

              <h2 style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
                Details
              </h2>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: '1.45', marginTop: '8px' }}>
                {currentConcept.desc}
              </p>
              <div className="tag-list" style={{ marginTop: '8px' }}>
                {currentConcept.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>

            <hr className="sidebar-divider" />
            
            <div className="projects-list" style={{ marginTop: '4px', gap: '16px' }}>
              {/* 1. Environment Selection */}
              <div className="control-section">
                <h2 style={{ fontSize: '12px' }}>Environment Mode</h2>
                <div className="time-toggle">
                  <button
                    className={`time-btn ${mode === 'day' ? 'active' : ''}`}
                    onClick={() => setMode('day')}
                    title="Switch to Bright Day"
                  >
                    <Sun size={14} />
                    Daylight
                  </button>
                  <button
                    className={`time-btn ${mode === 'dusk' ? 'active' : ''}`}
                    onClick={() => setMode('dusk')}
                    title="Switch to Twilight / Dusk"
                  >
                    <Moon size={14} />
                    Dusk (Sunset)
                  </button>
                </div>
              </div>

              {/* 2. Pavilion Features (Only visible when Pavilion is active) */}
              {activeDesign === 'pavilion' && (
                <div className="control-section">
                  <h2 style={{ fontSize: '12px' }}>Pavilion Features</h2>
                  <div className="switch-control">
                    <div className="switch-label">
                      <Sparkles size={13} color="#6366f1" />
                      <span>Sliding Glass Door</span>
                    </div>
                    <label className="switch-btn">
                      <input
                        type="checkbox"
                        checked={isDoorOpen}
                        onChange={(e) => setIsDoorOpen(e.target.checked)}
                      />
                      <span className="switch-slider"></span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Help tooltip center bottom */}
      <div className="help-tip">
        <span>🖱️ Drag to rotate</span>
        <span>•</span>
        <span>scroll to zoom</span>
        <span>•</span>
        <span>Right-click + drag to pan</span>
      </div>
    </div>
  )
}
