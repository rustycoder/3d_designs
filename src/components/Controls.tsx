import { useState } from 'react'
import {
  Sun,
  Moon,
  Info,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Folder,
  Compass,
  Mountain,
  Home
} from 'lucide-react'

interface ControlsProps {
  mode: 'day' | 'dusk'
  setMode: (mode: 'day' | 'dusk') => void
  isDoorOpen: boolean
  setIsDoorOpen: (open: boolean) => void
}

export default function Controls({
  mode,
  setMode,
  isDoorOpen,
  setIsDoorOpen
}: ControlsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isProjectsOpen, setIsProjectsOpen] = useState(false)

  return (
    <div className="ui-overlay">
      {/* ======================================================== */}
      {/* SIDEBAR CONTAINER & STACKED PROJECT CARD                 */}
      {/* ======================================================== */}
      <div className="sidebar-container interactive">
        
        {/* Main Controls Sidebar */}
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
              {/* 1. Header / Logo */}
              <div className="logo-section">
                <h1>PAVILLION</h1>
                <p>Luxe Architectural Visualization</p>
                <div className="tag-list" style={{ marginTop: '8px' }}>
                  <span className="tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={10} color="#d4af37" /> R3F Mockup
                  </span>
                </div>
              </div>

              <hr className="sidebar-divider" />

              {/* 2. Environment Selection */}
              <div className="control-section">
                <h2>Environment Mode</h2>
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

              <hr className="sidebar-divider" />

              {/* 3. Pavilion Sliding Door Control */}
              <div className="control-section">
                <h2>Pavilion Features</h2>
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

              <hr className="sidebar-divider" />

              {/* 4. Concept description */}
              <div className="control-section">
                <h2>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Info size={13} color="#6366f1" /> Architectural Concept
                  </span>
                </h2>
                <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                  A minimalist luxury outdoor pavilion designed with structural wood framing,
                  a floating concrete foundation slab, and full-height folding glass facades.
                  The pavilion sits cantilevered over a dark reflecting pond, creating continuous visual symmetry.
                </p>
                <div className="tag-list" style={{ marginTop: '6px' }}>
                  <span className="tag">Wood & Concrete</span>
                  <span className="tag">Reflecting Water</span>
                  <span className="tag">Indoor-Outdoor</span>
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
                color: '#94a3b8',
                opacity: 0.8,
                userSelect: 'none'
              }}>
                PAVILLION
              </h1>
            </div>
          )}
        </aside>

        {/* Stacked Projects Card (Sits behind main sidebar, slides out on click) */}
        <aside className={`projects-stacked-card ${isProjectsOpen ? 'expanded' : ''} ${isCollapsed ? 'collapsed-hidden' : ''}`}>
          {/* Peeking tab trigger (only clickable when sidebar is expanded) */}
          {!isCollapsed && (
            <div 
              className="peeking-tab" 
              onClick={() => setIsProjectsOpen(!isProjectsOpen)}
              title={isProjectsOpen ? "Close Design Deck" : "Explore other 3D designs"}
            >
              <div className="peeking-tab-content">
                <Folder size={11} style={{ transform: 'rotate(-90deg)', marginBottom: '4px' }} />
                <span>EXPLORE DESIGNS</span>
              </div>
            </div>
          )}

          <div className="projects-card-content">
            <div className="projects-header">
              <h2>Other 3D Designs</h2>
              <p>Luxury architectural concepts by Studio Lumen</p>
            </div>
            
            <div className="projects-list">
              <div className="project-item-card" onClick={() => alert("Loading Lakeside Glass Villa visualizer mockup...")}>
                <div className="project-icon-wrapper villa">
                  <Compass size={18} />
                </div>
                <div className="project-info">
                  <h3>Lakeside Glass Villa</h3>
                  <p>Cantilevered glass structure with warm birch accents, floating over a twilight lake.</p>
                  <div className="tag-list">
                    <span className="tag">Glass & Steel</span>
                    <span className="tag">Lake View</span>
                  </div>
                </div>
              </div>

              <div className="project-item-card" onClick={() => alert("Loading Brutalist Desert Oasis visualizer mockup...")}>
                <div className="project-icon-wrapper oasis">
                  <Mountain size={18} />
                </div>
                <div className="project-info">
                  <h3>Brutalist Desert Oasis</h3>
                  <p>Raw concrete forms and sunken lounges integrated with natural desert landscaping.</p>
                  <div className="tag-list">
                    <span className="tag">Raw Concrete</span>
                    <span className="tag">Desert Oasis</span>
                  </div>
                </div>
              </div>

              <div className="project-item-card" onClick={() => alert("Loading Nordic Forest Cabin visualizer mockup...")}>
                <div className="project-icon-wrapper cabin">
                  <Home size={18} />
                </div>
                <div className="project-info">
                  <h3>Nordic Forest Cabin</h3>
                  <p>Dark timber A-frame with full-height double-glazed windows, nested in pine woods.</p>
                  <div className="tag-list">
                    <span className="tag">Timber</span>
                    <span className="tag">Forest</span>
                  </div>
                </div>
              </div>
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
