import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type ParticlesProps = {
  count?: number
  radius?: number
  height?: number
  size?: number
  opacity?: number
}

export function Particles({
  count = 170,
  radius = 2.9,
  height = 5.4,
  size = 0.021,
  opacity = 0.55,
}: ParticlesProps) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3)
    for (let index = 0; index < count; index += 1) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.sqrt(Math.random()) * radius
      array[index * 3] = Math.cos(angle) * distance
      array[index * 3 + 1] = Math.random() * height
      array[index * 3 + 2] = Math.sin(angle) * distance * 0.7
    }
    return array
  }, [count, radius, height])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.y = t * 0.018
    ref.current.position.y = Math.sin(t * 0.22) * 0.05
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color="#ffffff"
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
