import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface WaterProps {
  position?: [number, number, number]
  args: [number, number] // [width, height]
  deepColor?: string
  shallowColor?: string
  speed?: number
  scale?: number
}

// Custom water shader
const WaterShader = {
  uniforms: {
    uTime: { value: 0 },
    uDeepColor: { value: new THREE.Color('#08141c') },
    uShallowColor: { value: new THREE.Color('#143547') },
    uSkyColor: { value: new THREE.Color('#4a8aa8') },
    uSpeed: { value: 0.8 },
    uScale: { value: 2.0 },
    uNormalScale: { value: 0.15 }
  },
  vertexShader: `
    uniform float uTime;
    uniform float uSpeed;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    
    // Simple pseudo-random hash
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    
    // Simple 2D noise
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      
      return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                 mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
    }
    
    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      
      // Calculate a wave displacement
      float time = uTime * uSpeed;
      float wave = sin(position.x * 0.5 + time) * 0.05 + 
                   cos(position.y * 0.5 + time * 1.3) * 0.05 +
                   noise(position.xy * 2.0 + time * 0.5) * 0.03;
                   
      vec3 newPosition = position;
      newPosition.z += wave; // Displace vertically (plane is rotated)
      
      vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Pass normal
      vNormal = normalize(normalMatrix * normal);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uDeepColor;
    uniform vec3 uShallowColor;
    uniform vec3 uSkyColor;
    uniform float uSpeed;
    uniform float uScale;
    uniform float uNormalScale;
    
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    
    // Hash and noise functions for bump mapping
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                 mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
    }
    
    // Fractal Brownian Motion
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100.0);
      // Rotate to reduce axial bias
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
      for (int i = 0; i < 4; ++i) {
        v += a * noise(p);
        p = rot * p * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }
    
    void main() {
      float time = uTime * uSpeed;
      
      // Dual-octave moving noise for animated normal/bump mapping
      vec2 uv1 = vUv * uScale * 5.0 + vec2(time * 0.05, time * 0.03);
      vec2 uv2 = vUv * uScale * 8.0 - vec2(time * 0.04, -time * 0.05);
      
      float n1 = fbm(uv1);
      float n2 = fbm(uv2);
      float finalNoise = mix(n1, n2, 0.5);
      
      // Calculate a perturbed normal for reflections
      vec3 normal = normalize(vNormal);
      
      // Compute derivatives of noise to get normals
      float epsilon = 0.01;
      float n_x = fbm(uv1 + vec2(epsilon, 0.0)) - n1;
      float n_y = fbm(uv1 + vec2(0.0, epsilon)) - n1;
      vec3 bumpNormal = normalize(vec3(-n_x, -n_y, 1.0));
      
      // Blending basic normal and bumped normal
      vec3 finalNormal = normalize(mix(normal, bumpNormal, uNormalScale));
      
      // View direction
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      
      // Fresnel effect: higher reflection at grazing angles
      float fresnel = pow(1.0 - max(dot(viewDir, finalNormal), 0.0), 3.0);
      
      // Mix colors: Deep color, shallow color, and sky reflection
      vec3 baseWaterColor = mix(uDeepColor, uShallowColor, vUv.y);
      vec3 reflectionColor = mix(uSkyColor, vec3(1.0), fresnel * 0.5);
      
      vec3 finalColor = mix(baseWaterColor, reflectionColor, fresnel * 0.7 + 0.1);
      
      // Add a subtle glitter highlight from a mock light source (sunset sun)
      vec3 lightDir = normalize(vec3(-3.0, 1.5, -2.0));
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(finalNormal, halfDir), 0.0), 128.0);
      finalColor += vec3(1.0, 0.95, 0.8) * spec * 0.6;
      
      gl_FragColor = vec4(finalColor, 0.9);
    }
  `
}

export default function Water({
  position = [0, 0, 0],
  args,
  deepColor = '#06111a',
  shallowColor = '#0b202e',
  speed = 0.6,
  scale = 1.8
}: WaterProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
    }
  })

  // Deep clone of shader object to avoid sharing uniforms between pools
  const shader = {
    ...WaterShader,
    uniforms: THREE.UniformsUtils.clone(WaterShader.uniforms)
  }

  shader.uniforms.uDeepColor.value.set(deepColor)
  shader.uniforms.uShallowColor.value.set(shallowColor)
  shader.uniforms.uSpeed.value = speed
  shader.uniforms.uScale.value = scale

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={args} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={shader.vertexShader}
        fragmentShader={shader.fragmentShader}
        uniforms={shader.uniforms}
        transparent={true}
      />
    </mesh>
  )
}
