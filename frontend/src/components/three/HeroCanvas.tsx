import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer, MeshReflectorMaterial } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { Guardian } from './Guardian'
import { useCanvasActive } from '../../lib/useCanvasActive'
import { useMediaQuery } from '../../lib/useMediaQuery'

export default function HeroCanvas() {
  const { ref, active } = useCanvasActive<HTMLDivElement>()
  const mobile = useMediaQuery('(max-width: 900px)')
  const quality = mobile ? 'low' : 'high'
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)

  return (
    <div ref={ref} className="hero-canvas" aria-hidden="true">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={dpr}
        gl={{
          antialias: !mobile,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        camera={{
          position: mobile ? [0, 2.3, 10.2] : [0, 2.35, 8.5],
          fov: mobile ? 38 : 35,
          near: 0.1,
          far: 50,
        }}
        onCreated={({ gl, camera }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.08
          gl.setClearColor('#000000')
          camera.lookAt(0, 2.02, 0)
        }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 10, 27]} />

        <Suspense fallback={null}>
          <ambientLight intensity={0.18} />
          <directionalLight position={[-4.5, 7, 5]} intensity={3} color="#ffffff" />
          <pointLight position={[-2.4, 3.4, 3.2]} intensity={48} distance={14} color="#e8e8e8" />
          <pointLight position={[3.1, 1.7, 3.1]} intensity={26} distance={12} color="#c8c8c8" />
          <pointLight position={[-3.9, 2.6, -2.8]} intensity={90} distance={18} color="#ffffff" />
          <pointLight position={[3.9, 1.9, -3.1]} intensity={72} distance={17} color="#e0e0e0" />
          <spotLight
            position={[4.2, 6.4, -3.6]}
            angle={0.58}
            penumbra={1}
            intensity={110}
            distance={24}
            color="#ffffff"
          />

          <Environment resolution={mobile ? 128 : 256} frames={1}>
            <Lightformer
              form="rect"
              intensity={3.6}
              position={[0, 5.5, -2.5]}
              scale={[9, 7, 1]}
              color="#ffffff"
            />
            <Lightformer
              form="rect"
              intensity={1.4}
              position={[-5, 2, 3.5]}
              scale={[3, 7, 1]}
              color="#a8a8a8"
            />
            <Lightformer
              form="rect"
              intensity={2.2}
              position={[5, 3, -1]}
              scale={[2, 8, 1]}
              color="#f5f5f5"
            />
            <Lightformer
              form="rect"
              intensity={0.8}
              position={[0, 1.2, 6]}
              scale={[5, 2, 1]}
              color="#6b6b6b"
            />
          </Environment>

          <Guardian
            quality={quality}
            xOffset={mobile ? 0.6 : 1.3}
            scale={mobile ? 0.84 : 1}
            beam
            particles
          />

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
            <planeGeometry args={[34, 34]} />
            {quality === 'high' ? (
              <MeshReflectorMaterial
                blur={[280, 90]}
                resolution={512}
                mixBlur={0.85}
                mixStrength={18}
                roughness={0.92}
                depthScale={1.2}
                minDepthThreshold={0.35}
                maxDepthThreshold={1.4}
                color="#030303"
                metalness={0.55}
                mirror={0.42}
              />
            ) : (
              <meshStandardMaterial color="#040404" metalness={0.45} roughness={0.55} />
            )}
          </mesh>

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
            <ringGeometry args={[2.05, 2.058, 180]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} depthWrite={false} />
          </mesh>

          {quality === 'high' && (
            <EffectComposer multisampling={0}>
              <Bloom
                luminanceThreshold={0.68}
                luminanceSmoothing={0.28}
                intensity={0.62}
                mipmapBlur
              />
              <Vignette eskil={false} offset={0.18} darkness={0.72} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}
