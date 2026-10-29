import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type ScanBeamProps = {
  height?: number
  width?: number
  speed?: number
  opacity?: number
  range?: number
  zOffset?: number
}

export function ScanBeam({
  height = 5.4,
  width = 1.05,
  speed = 0.34,
  opacity = 0.32,
  range = 1.55,
  zOffset = 0.92,
}: ScanBeamProps) {
  const group = useRef<THREE.Group>(null)

  const glowMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uOpacity: { value: opacity } },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform float uOpacity;
          void main() {
            float edge = smoothstep(0.5, 0.0, abs(vUv.x - 0.5));
            float vertical = smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
            float alpha = pow(edge, 4.0) * vertical * uOpacity;
            gl_FragColor = vec4(vec3(1.0), alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    [opacity],
  )

  useEffect(() => () => glowMaterial.dispose(), [glowMaterial])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const sweep = (Math.sin(t * speed) + 1) / 2
    group.current.position.x = THREE.MathUtils.lerp(-range, range, sweep)
    group.current.position.z = zOffset + Math.sin(t * 0.4) * 0.02
  })

  return (
    <group ref={group} position={[0, 2.55, zOffset]}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <primitive object={glowMaterial} attach="material" />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[0.008, height]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[0.16, height]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
