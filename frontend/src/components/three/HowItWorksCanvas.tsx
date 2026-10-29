import type { RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'
import { StationFrame } from './StationFrame'
import { PortNodes } from './PortNodes'
import { MorphCloud } from './MorphCloud'
import { ScoreRing } from './ScoreRing'
import { TunnelDust } from './TunnelDust'
import { useCanvasActive } from '../../lib/useCanvasActive'
import { useMediaQuery } from '../../lib/useMediaQuery'

type HowItWorksCanvasProps = {
  progressRef: RefObject<number>
}

const STATION_Z = [0, -8, -16, -24]
const CAMERA_Z = [7, -1, -9, -17]

function CameraRig({ progressRef }: { progressRef: RefObject<number> }) {
  const { camera } = useThree()

  useFrame((state, delta) => {
    const progress = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1)
    const scaled = progress * 3
    const index = Math.min(2, Math.floor(scaled))
    const blend = THREE.MathUtils.smoothstep(scaled - index, 0, 1)
    const targetZ = THREE.MathUtils.lerp(CAMERA_Z[index], CAMERA_Z[index + 1], blend)

    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 4.2, delta)
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      Math.sin(progress * Math.PI * 3) * 0.55 + state.pointer.x * 0.16,
      3.2,
      delta,
    )
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      2.28 + Math.sin(progress * Math.PI * 4) * 0.14 - state.pointer.y * 0.06,
      3.2,
      delta,
    )
    camera.lookAt(0, 2.2, camera.position.z - 7)
  })

  return null
}

function StationHalo({ z }: { z: number }) {
  return (
    <mesh position={[0, 2.2, z]}>
      <torusGeometry args={[2.95, 0.0035, 4, 180]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.09} depthWrite={false} />
    </mesh>
  )
}

export default function HowItWorksCanvas({ progressRef }: HowItWorksCanvasProps) {
  const { ref, active } = useCanvasActive<HTMLDivElement>()
  const mobile = useMediaQuery('(max-width: 900px)')
  const quality = mobile ? 'low' : 'high'
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)

  return (
    <div ref={ref} className="hiw-canvas" aria-hidden="true">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={dpr}
        gl={{ antialias: !mobile, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 2.28, 7], fov: 38, near: 0.1, far: 80 }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor('#000000')
          camera.lookAt(0, 2.2, 0)
        }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 9, 34]} />
        <CameraRig progressRef={progressRef} />
        <TunnelDust count={mobile ? 160 : 420} />

        <StationHalo z={STATION_Z[0]} />
        <StationHalo z={STATION_Z[1]} />
        <StationHalo z={STATION_Z[2]} />
        <StationHalo z={STATION_Z[3]} />

        <group position={[0, 2.2, STATION_Z[0]]}>
          <StationFrame />
        </group>

        <group position={[0, 2.25, STATION_Z[1]]}>
          <PortNodes />
        </group>

        <group position={[0, 2.2, STATION_Z[2]]}>
          <MorphCloud progressRef={progressRef} count={mobile ? 280 : 560} />
        </group>

        <group position={[0, 2.2, STATION_Z[3]]}>
          <ScoreRing progressRef={progressRef} radius={1.55} range={[0.72, 1]} maxProgress={0.92} />
          <mesh position={[-1.9, 0.8, -0.5]} rotation={[0, 0.18, 0]}>
            <planeGeometry args={[0.95, 1.2]} />
            <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.16} />
          </mesh>
          <mesh position={[1.95, -0.35, -0.6]} rotation={[0, -0.2, 0]}>
            <planeGeometry args={[0.8, 1.05]} />
            <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.12} />
          </mesh>
        </group>

        {quality === 'high' && (
          <EffectComposer multisampling={0}>
            <Bloom
              luminanceThreshold={0.6}
              luminanceSmoothing={0.35}
              intensity={0.5}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
