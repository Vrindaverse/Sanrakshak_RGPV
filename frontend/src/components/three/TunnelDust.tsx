import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type TunnelDustProps = {
  count?: number
}

export function TunnelDust({ count = 420 }: TunnelDustProps) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3)
    for (let index = 0; index < count; index += 1) {
      array[index * 3] = (Math.random() - 0.5) * 12
      array[index * 3 + 1] = Math.random() * 5.5 - 0.5
      array[index * 3 + 2] = 6 - Math.random() * 40
    }
    return array
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.08
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#ffffff"
        transparent
        opacity={0.32}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
