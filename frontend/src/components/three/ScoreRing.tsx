import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type ScoreRingProps = {
  progress?: number
  progressRef?: RefObject<number>
  radius?: number
  segments?: number
  range?: [number, number]
  maxProgress?: number
}

export function ScoreRing({
  progress = 0,
  progressRef,
  radius = 1.5,
  segments = 220,
  range,
  maxProgress = 1,
}: ScoreRingProps) {
  const current = useRef(0)
  const marker = useRef<THREE.Mesh>(null)

  const lineObject = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(segments * 3), 3),
    )
    geometry.setDrawRange(0, 0)
    const material = new THREE.LineBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    })
    const line = new THREE.Line(geometry, material)
    line.frustumCulled = false
    return line
  }, [segments])

  const ticks = useMemo(() => {
    const array = new Float32Array(48 * 6)
    for (let index = 0; index < 48; index += 1) {
      const angle = (index / 48) * Math.PI * 2 - Math.PI / 2
      const inner = radius + 0.11
      const outer = index % 4 === 0 ? radius + 0.22 : radius + 0.16
      array[index * 6] = Math.cos(angle) * inner
      array[index * 6 + 1] = Math.sin(angle) * inner
      array[index * 6 + 2] = 0
      array[index * 6 + 3] = Math.cos(angle) * outer
      array[index * 6 + 4] = Math.sin(angle) * outer
      array[index * 6 + 5] = 0
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(array, 3))
    const material = new THREE.LineBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
    })
    const object = new THREE.LineSegments(geometry, material)
    object.frustumCulled = false
    return object
  }, [radius])

  useEffect(() => {
    return () => {
      lineObject.geometry.dispose()
      ;(lineObject.material as THREE.Material).dispose()
      ticks.geometry.dispose()
      ;(ticks.material as THREE.Material).dispose()
    }
  }, [lineObject, ticks])

  useFrame((_, delta) => {
    const raw = THREE.MathUtils.clamp(progressRef?.current ?? progress, 0, 1)
    const mapped = range
      ? THREE.MathUtils.clamp((raw - range[0]) / (range[1] - range[0]), 0, 1)
      : raw
    const target = mapped * maxProgress
    current.current = THREE.MathUtils.damp(current.current, target, 4.5, delta)
    const value = current.current
    const attribute = lineObject.geometry.getAttribute('position') as THREE.BufferAttribute
    const count = Math.max(2, Math.floor(value * (segments - 1)) + 1)

    for (let index = 0; index < segments; index += 1) {
      const angle = -Math.PI / 2 + (index / (segments - 1)) * Math.PI * 2
      attribute.setXYZ(
        index,
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0,
      )
    }
    attribute.needsUpdate = true
    lineObject.geometry.setDrawRange(0, value <= 0.002 ? 0 : count)

    if (marker.current) {
      const markerAngle = -Math.PI / 2 + value * Math.PI * 2
      marker.current.position.set(
        Math.cos(markerAngle) * radius,
        Math.sin(markerAngle) * radius,
        0.01,
      )
      marker.current.visible = value > 0.01
    }
  })

  return (
    <group>
      <mesh>
        <torusGeometry args={[radius, 0.004, 4, 180]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.16} depthWrite={false} />
      </mesh>
      <primitive object={ticks} />
      <primitive object={lineObject} />
      <mesh ref={marker}>
        <sphereGeometry args={[0.045, 14, 14]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}
