"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Stars, Float, MeshDistortMaterial, Sparkles } from "@react-three/drei"
import { useRef } from "react"
import type * as THREE from "three"

function MoonPlanet({
  position,
  speed,
  size = 1,
}: { position: [number, number, number]; speed: number; size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2
    }
  })

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 64, 64]} />
        <MeshDistortMaterial 
          color="#9CA3AF" 
          transparent 
          opacity={0.25} 
          distort={0.3} 
          speed={1.5} 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    </Float>
  )
}

function AnimatedSphere({
  position,
  color,
  speed,
  size = 1,
}: { position: [number, number, number]; color: string; speed: number; size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2
    }
  })

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[size, 4]} />
        <MeshDistortMaterial color={color} transparent opacity={0.15} distort={0.4} speed={2} roughness={0.3} />
      </mesh>
    </Float>
  )
}

function GridPlane() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[60, 60, 40, 40]} />
      <meshBasicMaterial color="#1a1a2e" transparent opacity={0.08} />
    </mesh>
  )
}

function Nebula({ position, color, size }: { position: [number, number, number]; color: string; size: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.06) * 0.2
      ref.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 0.05) * 0.4
    }
  })
  return (
    <mesh ref={ref} position={position} rotation={[0, 0, 0] as any}>
      <planeGeometry args={[size, size, 1, 1]} />
      <MeshDistortMaterial color={color} roughness={0.6} metalness={0.2} distort={0.8} speed={0.05} transparent opacity={0.08} />
    </mesh>
  )
}

function GlowOrb({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  )
}

export function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0f0f1a]">
      <Canvas camera={{ position: [0, 0, 12], fov: 55 }} style={{ background: 'transparent' }}>
        <CameraDrift />
        <fog attach="fog" args={["#0a0a0f", 8, 35]} />
        <ambientLight intensity={0.12} />
        <pointLight position={[10, 10, 10]} intensity={0.3} color="#9CA3AF" />
        <pointLight position={[-10, -10, -10]} intensity={0.15} color="#6B7280" />
        <pointLight position={[0, 15, 5]} intensity={0.2} color="#D1D5DB" />

        {/* Glittery Stars - Multiple layers for depth and sparkle */}
        <Stars radius={100} depth={50} count={1200} factor={4} saturation={0} fade speed={0.3} />
        <Stars radius={80} depth={60} count={800} factor={5} saturation={0} fade speed={0.5} />
        <Stars radius={60} depth={40} count={600} factor={6} saturation={0} fade speed={0.7} />

        {/* Moon Planet - Large grey moon */}
        <MoonPlanet position={[-8, 3, -12]} speed={0.4} size={2.2} />
        
        {/* Grey-themed planets */}
        <AnimatedSphere position={[7, -3, -10]} color="#6B7280" speed={0.6} size={1.5} />
        <AnimatedSphere position={[-4, -4, -8]} color="#4B5563" speed={0.8} size={1.1} />
        <AnimatedSphere position={[3, 5, -14]} color="#9CA3AF" speed={0.5} size={1.3} />
        <AnimatedSphere position={[-6, -1, -6]} color="#737373" speed={0.7} size={0.9} />
        <AnimatedSphere position={[5, 2, -11]} color="#808080" speed={0.55} size={1.0} />

        <GlowOrb position={[3, 2, -4]} color="#9CA3AF" />
        <GlowOrb position={[-4, -1, -5]} color="#6B7280" />
        <GlowOrb position={[2, -2, -3]} color="#737373" />
        <GlowOrb position={[-2, 3, -5]} color="#D1D5DB" />

        <Nebula position={[-6, -2, -10]} color="#374151" size={18} />
        <Nebula position={[6, 0, -12]} color="#1f2937" size={14} />
        <Nebula position={[0, 6, -14]} color="#2a2a3e" size={20} />
        
        {/* Enhanced glittery sparkles */}
        <Sparkles size={10} scale={[15, 15, 15]} count={120} speed={0.3} color="#D1D5DB" />
        <Sparkles size={6} scale={[12, 12, 12]} count={100} speed={0.4} color="#9CA3AF" />
        <Sparkles size={4} scale={[8, 8, 8]} count={80} speed={0.5} color="#FFFFFF" />
        
        <GridPlane />
      </Canvas>
    </div>
  )
}

function CameraDrift() {
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.2
    state.camera.position.x = Math.cos(t) * 0.25
    state.camera.position.y = Math.sin(t * 0.5) * 0.15
    state.camera.lookAt(0, 0, 0)
  })
  return null
}
