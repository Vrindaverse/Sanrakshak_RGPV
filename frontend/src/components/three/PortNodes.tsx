import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

const NODES: [number, number, number][] = [
  [1.75, 0.45, 0.4],
  [-1.55, 0.9, 0.75],
  [1.15, -0.75, -0.85],
  [-1.35, -0.45, -0.6],
  [0.55, 1.35, -0.55],
  [-0.55, -1.2, 0.8],
  [1.95, -0.1, -0.35],
]

function Node({ position, phase }: { position: [number, number, number]; phase: number }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.3 + phase) * 0.22
    ref.current.scale.setScalar(pulse)
  })

  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.085, 0]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
    </mesh>
  )
}

export function PortNodes() {
  const orbit = useRef<THREE.Group>(null)
  const arcA = useRef<THREE.Mesh>(null)
  const arcB = useRef<THREE.Mesh>(null)
  const spin = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (orbit.current) orbit.current.rotation.y = t * 0.13
    if (spin.current) spin.current.rotation.z += delta * 0.18
    if (arcA.current) arcA.current.rotation.z = t * 0.5
    if (arcB.current) arcB.current.rotation.x = -t * 0.42
  })

  return (
    <group>
      <group ref={spin}>
        <mesh>
          <icosahedronGeometry args={[0.56, 1]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.32} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      <group ref={orbit}>
        {NODES.map((position, index) => (
          <group key={index}>
            <Line
              points={[
                [0, 0, 0],
                position,
              ]}
              color="#ffffff"
              transparent
              opacity={0.17}
              lineWidth={1}
            />
            <Node position={position} phase={index * 0.9} />
          </group>
        ))}
      </group>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.15, 0.0035, 4, 140]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>
      <mesh rotation={[Math.PI / 2.8, 0.5, 0.2]}>
        <torusGeometry args={[2.45, 0.003, 4, 140]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>

      <mesh ref={arcA} rotation={[0.1, 0.2, 0]}>
        <torusGeometry args={[2.3, 0.012, 4, 64, Math.PI * 0.5]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
      </mesh>
      <mesh ref={arcB} rotation={[0.8, 0, 0.3]}>
        <torusGeometry args={[2.62, 0.008, 4, 64, Math.PI * 0.36]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
    </group>
  )
}
