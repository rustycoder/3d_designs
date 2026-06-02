import * as THREE from 'three'

// Generate a wood slatted ceiling texture programmatically
export function createWoodSlatsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  if (!ctx) return new THREE.CanvasTexture(canvas)

  // Base wood color
  ctx.fillStyle = '#8b5a2b'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const numSlats = 32
  const slatWidth = canvas.width / numSlats

  for (let i = 0; i < numSlats; i++) {
    const x = i * slatWidth

    // Base color gradient for each slat (giving 3D depth)
    const grad = ctx.createLinearGradient(x, 0, x + slatWidth, 0)
    // Randomize wood hues slightly for natural variation
    const hueShift = Math.random() * 15 - 7.5
    const r = Math.floor(139 + hueShift)
    const g = Math.floor(90 + hueShift * 0.7)
    const b = Math.floor(43 + hueShift * 0.5)

    grad.addColorStop(0, `rgb(${r-15}, ${g-12}, ${b-10})`)
    grad.addColorStop(0.1, `rgb(${r}, ${g}, ${b})`)
    grad.addColorStop(0.9, `rgb(${r+10}, ${g+8}, ${b+5})`)
    grad.addColorStop(1, `rgb(${r-25}, ${g-20}, ${b-18})`) // Dark groove between slats

    ctx.fillStyle = grad
    ctx.fillRect(x, 0, slatWidth, canvas.height)

    // Add fine wood grain lines
    ctx.strokeStyle = 'rgba(60, 30, 10, 0.08)'
    ctx.lineWidth = 1 + Math.random() * 2
    const numGrains = 6
    for (let j = 0; j < numGrains; j++) {
      const gx = x + Math.random() * slatWidth
      ctx.beginPath()
      ctx.moveTo(gx, 0)
      // Wavy grain line
      for (let y = 0; y <= canvas.height; y += 50) {
        const offset = Math.sin(y * 0.05 + i) * 2 + (Math.random() - 0.5) * 1.5
        ctx.lineTo(gx + offset, y)
      }
      ctx.stroke()
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1, 2)
  return texture
}

// Generate vertical wood texture for columns
export function createColumnWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  if (!ctx) return new THREE.CanvasTexture(canvas)

  // Dark luxurious wood color
  ctx.fillStyle = '#653a1b'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const numPlanks = 4
  const plankWidth = canvas.width / numPlanks

  for (let i = 0; i < numPlanks; i++) {
    const x = i * plankWidth
    const grad = ctx.createLinearGradient(x, 0, x + plankWidth, 0)
    grad.addColorStop(0, '#532f15')
    grad.addColorStop(0.5, '#6a3f1e')
    grad.addColorStop(1, '#4b2a12')

    ctx.fillStyle = grad
    ctx.fillRect(x, 0, plankWidth, canvas.height)

    // Add knots and grain
    ctx.strokeStyle = 'rgba(35, 15, 5, 0.15)'
    for (let j = 0; j < 8; j++) {
      const gx = x + Math.random() * plankWidth
      ctx.beginPath()
      ctx.moveTo(gx, 0)
      ctx.quadraticCurveTo(
        gx + (Math.random() - 0.5) * 20, 
        canvas.height * 0.5, 
        gx + (Math.random() - 0.5) * 10, 
        canvas.height
      )
      ctx.stroke()
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1, 1)
  return texture
}

// Generate a subtle concrete texture for the deck floor and kitchen counter
export function createConcreteTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  if (!ctx) return new THREE.CanvasTexture(canvas)

  // Cool concrete light grey/cream base
  ctx.fillStyle = '#e2e8f0'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw fine random concrete aggregate spots and noise
  for (let i = 0; i < 200000; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const val = Math.random()
    
    if (val > 0.98) {
      // Dark aggregate speck
      ctx.fillStyle = 'rgba(100, 116, 139, 0.12)'
      ctx.fillRect(x, y, 1.5, 1.5)
    } else if (val < 0.05) {
      // White speck
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
      ctx.fillRect(x, y, 1, 1)
    }
  }

  // Draw soft cloud-like concrete discoloration patches
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const radius = 50 + Math.random() * 150
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius)
    
    const darkVal = 0.03 + Math.random() * 0.04
    grad.addColorStop(0, `rgba(15, 23, 42, ${darkVal})`)
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  return texture
}

// Generate a ribbed/fluted diffuser texture for the LED batten
export function createFlutedTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')

  if (!ctx) return new THREE.CanvasTexture(canvas)

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const numRibs = 16
  const ribWidth = canvas.width / numRibs

  for (let i = 0; i < numRibs; i++) {
    const x = i * ribWidth
    const grad = ctx.createLinearGradient(x, 0, x + ribWidth, 0)
    // Create soft dark edges on each rib to simulate a fluted 3D look
    grad.addColorStop(0, '#e2e8f0')
    grad.addColorStop(0.3, '#ffffff')
    grad.addColorStop(0.7, '#ffffff')
    grad.addColorStop(1, '#cbd5e1')

    ctx.fillStyle = grad
    ctx.fillRect(x, 0, ribWidth, canvas.height)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(25, 1) // Repeat along the length of the batten
  return texture
}

// Generate a vertical aluminum fin / heat-sink texture for the recessed downlight
// Simulates tight radial cooling fins: dark groove lines on a brushed aluminium base
export function createHeatSinkTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  if (!ctx) return new THREE.CanvasTexture(canvas)

  // Dark anodised aluminium base
  ctx.fillStyle = '#1a1a1e'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw vertical fin grooves (repeating pattern)
  const numFins = 32
  const finWidth = canvas.width / numFins

  for (let i = 0; i < numFins; i++) {
    const x = i * finWidth

    // Fin body — slightly lighter than the base
    const grad = ctx.createLinearGradient(x, 0, x + finWidth, 0)
    grad.addColorStop(0,   '#111114') // dark groove edge
    grad.addColorStop(0.15,'#2e2e34') // fin shoulder
    grad.addColorStop(0.45,'#3c3c44') // fin top highlight
    grad.addColorStop(0.55,'#3c3c44')
    grad.addColorStop(0.85,'#2e2e34')
    grad.addColorStop(1,   '#111114') // dark groove edge

    ctx.fillStyle = grad
    ctx.fillRect(x, 0, finWidth, canvas.height)
  }

  // Subtle horizontal banding to simulate lathe marks
  for (let y = 0; y < canvas.height; y += 8) {
    ctx.fillStyle = 'rgba(0,0,0,0.06)'
    ctx.fillRect(0, y, canvas.width, 1)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}
