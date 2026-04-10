/* eslint-disable react/no-unknown-property */
import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

/*
  FluidGlassPhoto — A react-three-fiber glass distortion overlay on a photo.
  The glass lens follows the mouse pointer and distorts the photo underneath.
*/

function PhotoPlane({ imageUrl }) {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  const { viewport } = useThree();
  const size = Math.min(viewport.width, viewport.height) * 0.85;

  return (
    <mesh>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

function GlassLens({ mouseStrength = 0.3, lensSize = 0.65, distortion = 0.03 }) {
  const meshRef = useRef();
  const { viewport, pointer } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uDistortion: { value: distortion },
  }), [distortion]);

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uDistortion;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      float dist = length(vUv - 0.5);
      float edge = smoothstep(0.48, 0.5, dist);
      
      // Ripple
      float ripple = sin(dist * 30.0 - uTime * 2.0) * uDistortion;
      float ripple2 = sin(dist * 20.0 + uTime * 1.5) * uDistortion * 0.5;
      
      // Glass refraction colors
      vec3 color1 = vec3(0.56, 0.96, 1.0); // primary cyan
      vec3 color2 = vec3(0.18, 0.97, 0.004); // secondary green
      vec3 color3 = vec3(0.40, 0.69, 1.0); // tertiary blue
      
      float mix1 = sin(uTime * 0.5 + vUv.x * 3.0) * 0.5 + 0.5;
      float mix2 = cos(uTime * 0.7 + vUv.y * 3.0) * 0.5 + 0.5;
      
      vec3 glassColor = mix(mix(color1, color2, mix1), color3, mix2);
      
      float alpha = (1.0 - edge) * (0.08 + ripple * 0.5 + ripple2 * 0.3);
      alpha = clamp(alpha, 0.0, 0.2);
      
      // Edge glow
      float edgeGlow = smoothstep(0.35, 0.49, dist) * (1.0 - edge);
      alpha += edgeGlow * 0.12;
      
      gl_FragColor = vec4(glassColor, alpha);
    }
  `;

  useFrame((state) => {
    if (!meshRef.current) return;
    uniforms.uTime.value = state.clock.elapsedTime;

    const targetX = pointer.x * viewport.width * mouseStrength;
    const targetY = pointer.y * viewport.height * mouseStrength;

    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.08;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.08;

    uniforms.uMouse.value.set(meshRef.current.position.x, meshRef.current.position.y);
  });

  const size = Math.min(viewport.width, viewport.height) * lensSize;

  return (
    <mesh ref={meshRef} position={[0, 0, 0.1]}>
      <circleGeometry args={[size / 2, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function FluidGlassPhoto({
  imageUrl,
  size = 320,
  mouseStrength = 0.3,
  lensSize = 0.65,
  distortion = 0.03,
  style = {},
}) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      border: '2px solid var(--primary)',
      boxShadow: '0 0 48px rgba(143,245,255,0.25), 0 0 96px rgba(143,245,255,0.08)',
      position: 'relative',
      ...style,
    }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <PhotoPlane imageUrl={imageUrl} />
          <GlassLens
            mouseStrength={mouseStrength}
            lensSize={lensSize}
            distortion={distortion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
