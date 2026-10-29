import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const bars: { position: [number, number, number]; scale: [number, number, number] }[] = [
  { position: [0, 0.85, 0], scale: [2.5, 0.008, 0.008] },
  { position: [0, -0.85, 0], scale: [2.5, 0.008, 0.008] },
  { position: [-1.25, 0, 0], scale: [0.008, 1.7, 0.008] },
  { position: [1.25, 0, 0], scale: [0.008, 1.7, 0.008] },
]

export function StationFrame() {
  const scan = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!scan.current) return
    scan.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.62
  })

  return (
    <group>
      {bars.map((bar, index) => (
        <mesh key={index} position={bar.position} scale={bar.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.28} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[2.3, 1.55]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.07} />
      </mesh>
      <mesh ref={scan} position={[0, 0, 0.01]}>
        <planeGeometry args={[2.28, 0.004]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
      </mesh>
      <mesh position={[-1.05, 0, 0.02]}>
        <planeGeometry args={[0.005, 1.5]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
      </mesh>
      <mesh position={[1.05, 0, 0.02]}>
        <planeGeometry args={[0.005, 1.5]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
      </mesh>
    </group>
  )
}
