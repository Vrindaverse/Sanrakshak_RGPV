import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { ScanBeam } from './ScanBeam'
import { Particles } from './Particles'

type GuardianProps = {
  mode?: 'hero' | 'echo'
  quality?: 'high' | 'low'
  xOffset?: number
  scale?: number
  beam?: boolean
  particles?: boolean
}

type Plate = {
  geometry: THREE.ExtrudeGeometry
  edges: THREE.EdgesGeometry
  outline: THREE.Vector3[]
  z: number
}

const SHARD_POSITIONS: [number, number, number][] = [
  [1.72, 1.28, -0.22],
  [-1.62, 2.88, -0.08],
  [1.46, 3.46, 0.38],
  [-1.86, 1.62, 0.46],
  [2.12, 2.38, -0.68],
]

function makeShieldShape(scale: number) {
  const shape = new THREE.Shape()
  shape.moveTo(0, 2.14 * scale)
  shape.lineTo(1.03 * scale, 1.84 * scale)
  shape.lineTo(0.96 * scale, -0.22 * scale)
  shape.quadraticCurveTo(0.8 * scale, -1.36 * scale, 0, -2.02 * scale)
  shape.quadraticCurveTo(-0.8 * scale, -1.36 * scale, -0.96 * scale, -0.22 * scale)
  shape.lineTo(-1.03 * scale, 1.84 * scale)
  shape.closePath()
  return shape
}

function makePlate(scale: number, depth: number, z: number): Plate {
  const shape = makeShieldShape(scale)
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.035,
    bevelThickness: 0.035,
    curveSegments: 24,
  })
  geometry.translate(0, 0, -depth / 2)
  geometry.computeVertexNormals()

  const outline = shape
    .getPoints(72)
    .map((point) => new THREE.Vector3(point.x, point.y, depth / 2 + 0.004))
  if (outline[0].distanceTo(outline[outline.length - 1]) > 1e-5) {
    outline.push(outline[0].clone())
  }

  return {
    geometry,
    edges: new THREE.EdgesGeometry(geometry, 18),
    outline,
    z,
  }
}

export function Guardian({
  mode = 'hero',
  quality = 'high',
  xOffset = 0,
  scale = 1,
  beam = true,
  particles = true,
}: GuardianProps) {
  const motionGroup = useRef<THREE.Group>(null)
  const shardGroup = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const sweepRef = useRef<THREE.Group>(null)

  const echo = mode === 'echo'

  const plates = useMemo(
    () => [
      makePlate(1, 0.28, -0.1),
      makePlate(0.82, 0.17, 0.07),
      makePlate(0.64, 0.1, 0.18),
    ],
    [],
  )

  const bodyMaterial = useMemo(() => {
    if (echo) {
      return new THREE.MeshBasicMaterial({
        color: '#ffffff',
        wireframe: true,
        transparent: true,
        opacity: 0.13,
        depthWrite: false,
        toneMapped: false,
      })
    }
    return new THREE.MeshPhysicalMaterial({
      color: '#070707',
      metalness: 0.92,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.8,
    })
  }, [echo])

  const plateMaterial = useMemo(() => {
    if (echo) {
      return new THREE.MeshBasicMaterial({
        color: '#ffffff',
        wireframe: true,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        toneMapped: false,
      })
    }
    return new THREE.MeshPhysicalMaterial({
      color: '#111111',
      metalness: 0.92,
      roughness: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 2,
    })
  }, [echo])

  const frontMaterial = useMemo(() => {
    if (echo) {
      return new THREE.MeshBasicMaterial({
        color: '#ffffff',
        wireframe: true,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
        toneMapped: false,
      })
    }
    return new THREE.MeshPhysicalMaterial({
      color: '#1c1c1c',
      metalness: 0.84,
      roughness: 0.24,
      clearcoat: 1,
      clearcoatRoughness: 0.14,
      envMapIntensity: 2.1,
    })
  }, [echo])

  const edgeMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: echo ? 0.26 : 0.58,
        depthWrite: false,
        toneMapped: false,
      }),
    [echo],
  )

  const glowEdgeMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: echo ? 0.07 : 0.25,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [echo],
  )

  const auraMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uOpacity: { value: echo ? 0.022 : 0.1 } },
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
            float d = length(vUv - 0.5) * 2.0;
            float a = smoothstep(1.0, 0.12, d);
            gl_FragColor = vec4(vec3(1.0), a * a * uOpacity);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [echo],
  )

  const accentMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: echo ? 0.42 : 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [echo],
  )

  const ringMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: echo ? 0.26 : 0.46,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [echo],
  )

  const hairlineMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: echo ? 0.16 : 0.3,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    [echo],
  )

  const haloMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: echo ? 0.08 : 0.14,
        depthWrite: false,
        toneMapped: false,
      }),
    [echo],
  )

  const sweepMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: echo ? 0.3 : 0.42,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    [echo],
  )

  const sweepGlowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: echo ? 0.03 : 0.045,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    [echo],
  )

  useEffect(() => {
    return () => {
      bodyMaterial.dispose()
      plateMaterial.dispose()
      frontMaterial.dispose()
      edgeMaterial.dispose()
      glowEdgeMaterial.dispose()
      auraMaterial.dispose()
      accentMaterial.dispose()
      ringMaterial.dispose()
      hairlineMaterial.dispose()
      haloMaterial.dispose()
      sweepMaterial.dispose()
      sweepGlowMaterial.dispose()
      plates.forEach((plate) => {
        plate.geometry.dispose()
        plate.edges.dispose()
      })
    }
  }, [
    bodyMaterial,
    plateMaterial,
    frontMaterial,
    edgeMaterial,
    glowEdgeMaterial,
    auraMaterial,
    accentMaterial,
    ringMaterial,
    hairlineMaterial,
    haloMaterial,
    sweepMaterial,
    sweepGlowMaterial,
    plates,
  ])

  useFrame((state) => {
    if (!motionGroup.current) return
    const t = state.clock.elapsedTime
    const pointerX = state.pointer.x
    const pointerY = state.pointer.y

    motionGroup.current.rotation.y =
      Math.sin(t * 0.1) * 0.13 + pointerX * (echo ? 0.05 : 0.1)
    motionGroup.current.rotation.x = -pointerY * (echo ? 0.015 : 0.035)
    motionGroup.current.position.y = Math.sin(t * 0.32) * 0.016

    if (shardGroup.current) {
      shardGroup.current.rotation.y = t * 0.04
      shardGroup.current.rotation.x = Math.sin(t * 0.07) * 0.06
    }

    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 1.35) * 0.08
      coreRef.current.scale.set(pulse * 0.82, pulse * 1.42, pulse * 0.4)
      coreRef.current.rotation.y = t * 0.5
    }

    if (sweepRef.current) {
      const travel = (Math.sin(t * 0.46) + 1) / 2
      const y = THREE.MathUtils.lerp(-1.72, 1.82, travel)
      const normalized = THREE.MathUtils.clamp((y + 2.02) / 4.16, 0, 1)
      const taper = 0.22 + Math.sin(normalized * Math.PI) * 0.78
      sweepRef.current.position.y = y
      sweepRef.current.scale.x = taper
    }
  })

  return (
    <group position={[xOffset, 0, 0]} scale={scale}>
      <group ref={motionGroup}>
        <group position={[0, 2.12, 0]}>
          <mesh position={[0, 0.06, -1.4]}>
            <planeGeometry args={[7.2, 8.4]} />
            <primitive object={auraMaterial} attach="material" />
          </mesh>

          {plates.map((plate, index) => (
            <group key={index} position={[0, 0, plate.z]}>
              <mesh geometry={plate.geometry}>
                <primitive
                  object={index === 0 ? bodyMaterial : index === 1 ? plateMaterial : frontMaterial}
                  attach="material"
                />
              </mesh>
              <lineSegments position={[0, 0, 0.002]} geometry={plate.edges}>
                <primitive object={edgeMaterial} attach="material" />
              </lineSegments>
              <Line
                points={plate.outline}
                color="#ffffff"
                lineWidth={index === 0 ? 1.25 : index === 1 ? 1 : 0.85}
                transparent
                opacity={echo ? 0.2 : index === 0 ? 0.82 : index === 1 ? 0.66 : 0.54}
                depthWrite={false}
                toneMapped={false}
              />
              {index === 0 && (
                <lineSegments
                  position={[0, 0, 0.001]}
                  scale={1.012}
                  geometry={plate.edges}
                >
                  <primitive object={glowEdgeMaterial} attach="material" />
                </lineSegments>
              )}
            </group>
          ))}

          <mesh position={[0, 0.08, 0.241]}>
            <circleGeometry args={[0.23, 64]} />
            <meshBasicMaterial color="#000000" />
          </mesh>

          <mesh position={[0, 0.02, 0.236]}>
            <boxGeometry args={[0.042, 2.56, 0.034]} />
            <primitive object={plateMaterial} attach="material" />
          </mesh>
          <mesh position={[0.022, 0.02, 0.255]}>
            <planeGeometry args={[0.005, 2.48]} />
            <primitive object={hairlineMaterial} attach="material" />
          </mesh>

          <mesh position={[0, 0.08, 0.255]}>
            <torusGeometry args={[0.3, 0.0045, 4, 96]} />
            <primitive object={ringMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 0.08, 0.252]}>
            <torusGeometry args={[0.48, 0.003, 4, 120]} />
            <primitive object={ringMaterial} attach="material" />
          </mesh>

          <mesh ref={coreRef} position={[0, 0.08, 0.255]}>
            <octahedronGeometry args={[0.085, 0]} />
            <primitive object={accentMaterial} attach="material" />
          </mesh>

          <mesh position={[0, 0.02, 0.247]}>
            <planeGeometry args={[0.008, 2.36]} />
            <primitive object={hairlineMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 0.68, 0.247]}>
            <planeGeometry args={[1.06, 0.005]} />
            <primitive object={hairlineMaterial} attach="material" />
          </mesh>
          <mesh position={[0, -0.52, 0.247]}>
            <planeGeometry args={[0.82, 0.005]} />
            <primitive object={hairlineMaterial} attach="material" />
          </mesh>

          <mesh position={[-0.11, 1.05, 0.247]} rotation={[0, 0, 0.42]}>
            <planeGeometry args={[0.46, 0.006]} />
            <primitive object={hairlineMaterial} attach="material" />
          </mesh>
          <mesh position={[0.11, 1.05, 0.247]} rotation={[0, 0, -0.42]}>
            <planeGeometry args={[0.46, 0.006]} />
            <primitive object={hairlineMaterial} attach="material" />
          </mesh>

          <group ref={sweepRef} position={[0, 0, 0.27]}>
            <mesh>
              <planeGeometry args={[1.62, 0.07]} />
              <primitive object={sweepGlowMaterial} attach="material" />
            </mesh>
            <mesh>
              <planeGeometry args={[1.55, 0.006]} />
              <primitive object={sweepMaterial} attach="material" />
            </mesh>
          </group>

          <mesh position={[0, 0, -0.86]}>
            <torusGeometry args={[2.12, 0.004, 4, 180]} />
            <primitive object={haloMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 0, -0.94]} rotation={[0.14, 0, -0.1]}>
            <torusGeometry args={[2.52, 0.0035, 4, 200]} />
            <primitive object={haloMaterial} attach="material" />
          </mesh>
        </group>

        {quality === 'high' && (
          <group ref={shardGroup}>
            {SHARD_POSITIONS.map((position, index) => (
              <mesh
                key={index}
                position={position}
                scale={0.06 + index * 0.01}
                rotation={[index * 0.8, index * 0.5, index * 0.3]}
              >
                <tetrahedronGeometry args={[1, 0]} />
                <primitive object={plateMaterial} attach="material" />
              </mesh>
            ))}
          </group>
        )}

        {beam && (
          <ScanBeam
            height={4.9}
            width={0.54}
            opacity={echo ? 0.08 : 0.16}
            speed={echo ? 0.22 : 0.3}
            range={1.02}
            zOffset={0.46}
          />
        )}
      </group>

      {particles && (
        <Particles
          count={quality === 'high' ? 170 : 55}
          radius={3}
          height={5.6}
          opacity={echo ? 0.22 : 0.5}
        />
      )}
    </group>
  )
}
