import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { Guardian } from './Guardian'
import { useCanvasActive } from '../../lib/useCanvasActive'
import { useMediaQuery } from '../../lib/useMediaQuery'

export default function EchoCanvas() {
  const { ref, active } = useCanvasActive<HTMLDivElement>()
  const mobile = useMediaQuery('(max-width: 900px)')
  const quality = mobile ? 'low' : 'high'
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.35 : 1.8)

  return (
    <div ref={ref} className="final-canvas" aria-hidden="true">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={dpr}
        gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 2.15, 8.6], fov: 34, near: 0.1, far: 40 }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor('#000000', 0)
          camera.lookAt(0, 2.1, 0)
        }}
      >
        <Suspense fallback={null}>
          <Guardian
            mode="echo"
            quality={quality}
            scale={mobile ? 0.86 : 1.02}
            beam
            particles={false}
          />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
            <ringGeometry args={[2.05, 2.06, 160]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.14} />
          </mesh>
          {quality === 'high' && (
            <EffectComposer multisampling={0}>
              <Bloom
                luminanceThreshold={0.4}
                luminanceSmoothing={0.4}
                intensity={0.45}
                mipmapBlur
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}
