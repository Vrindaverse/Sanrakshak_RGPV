import { useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type MorphCloudProps = {
  progressRef: RefObject<number>
  count?: number
}

export function MorphCloud({ progressRef, count = 560 }: MorphCloudProps) {
  const ref = useRef<THREE.Points>(null)

  const { random, ordered } = useMemo(() => {
    const randomArray = new Float32Array(count * 3)
    const orderedArray = new Float32Array(count * 3)
    const perLine = Math.ceil(count / 6)

    for (let index = 0; index < count; index += 1) {
      randomArray[index * 3] = (Math.random() - 0.5) * 3.2
      randomArray[index * 3 + 1] = (Math.random() - 0.5) * 2.1
      randomArray[index * 3 + 2] = (Math.random() - 0.5) * 0.7

      const line = Math.floor(index / perLine)
      const column = index % perLine
      const width = 2.2 - line * 0.24
      orderedArray[index * 3] = (column / perLine - 0.5) * width
      orderedArray[index * 3 + 1] = 0.82 - line * 0.31
      orderedArray[index * 3 + 2] = (Math.random() - 0.5) * 0.02
    }

    return { random: randomArray, ordered: orderedArray }
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const geometry = ref.current.geometry
    const attribute = geometry.getAttribute('position') as THREE.BufferAttribute
    const array = attribute.array as Float32Array
    const progress = progressRef.current ?? 0
    const morph = THREE.MathUtils.smoothstep(progress, 0.48, 0.69)
    const t = state.clock.elapsedTime

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3
      const wobble = Math.sin(t * 0.8 + index * 0.21) * 0.012 * (1 - morph)
      array[offset] = THREE.MathUtils.lerp(random[offset], ordered[offset], morph)
      array[offset + 1] =
        THREE.MathUtils.lerp(random[offset + 1], ordered[offset + 1], morph) + wobble
      array[offset + 2] = THREE.MathUtils.lerp(random[offset + 2], ordered[offset + 2], morph)
    }

    attribute.needsUpdate = true
    ref.current.rotation.y = Math.sin(t * 0.14) * 0.12
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(count * 3), 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.024}
        color="#ffffff"
        transparent
        opacity={0.72}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
