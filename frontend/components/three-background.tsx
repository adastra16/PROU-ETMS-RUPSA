"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Stars, Float, MeshDistortMaterial, Sparkles } from "@react-three/drei"
import { useRef } from "react"
import type * as THREE from "three"

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
        <MeshDistortMaterial color={color} transparent opacity={0.12} distort={0.4} speed={2} roughness={0.2} />
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
      <meshBasicMaterial color="#111827" transparent opacity={0.05} />
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
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#050505] via-[#0b0b0b] to-[#090909]">
      <Canvas camera={{ position: [0, 0, 12], fov: 55 }} style={{ background: 'transparent' }}>
        <CameraDrift />
        <fog attach="fog" args={["#050505", 8, 35]} />
        <ambientLight intensity={0.15} />
        <pointLight position={[10, 10, 10]} intensity={0.23} color="#9CA3AF" />
        <pointLight position={[-10, -10, -10]} intensity={0.12} color="#6B7280" />

        <Stars radius={80} depth={40} count={600} factor={3} saturation={0} fade speed={0.5} />
  <Stars radius={80} depth={80} count={900} factor={4} saturation={0} fade speed={0.7} />

        <AnimatedSphere position={[-6, 1.5, -9]} color="#6B7280" speed={1.0} size={1.6} />
        <AnimatedSphere position={[6.5, -2, -11]} color="#4B5563" speed={0.8} size={1.9} />
        <AnimatedSphere position={[0, 4, -14]} color="#9CA3AF" speed={0.6} size={1.2} />
        <AnimatedSphere position={[-3, -3, -6]} color="#737373" speed={1.3} size={0.8} />

        <GlowOrb position={[3, 2, -4]} color="#9CA3AF" />
        <GlowOrb position={[-4, -1, -5]} color="#6B7280" />
        <GlowOrb position={[2, -2, -3]} color="#737373" />

        <Nebula position={[-6, -2, -10]} color="#374151" size={18} />
        <Nebula position={[6, 0, -12]} color="#111827" size={14} />
        <Nebula position={[0, 6, -14]} color="#1f2937" size={20} />
        <Sparkles size={8} scale={[10, 10, 10]} count={80} speed={0.2} color="#9CA3AF" />
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
