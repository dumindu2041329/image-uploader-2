"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Sparkles,
  Environment,
} from "@react-three/drei";
import type { Mesh } from "three";

// ============================================================================
// Hooks
// ============================================================================

function useWebGLSupport(): boolean {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}

// ============================================================================
// 3D Scene Components
// ============================================================================

interface PointerState {
  x: number;
  y: number;
}

function GlowingOrb({ pointer }: { pointer: PointerState }) {
  const meshRef = useRef<Mesh>(null);

  // Breathing scale animation
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle breathing effect
      const breathe = Math.sin(state.clock.elapsedTime * 0.8) * 0.05 + 1;
      meshRef.current.scale.setScalar(breathe);

      // Subtle rotation
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.003;

      // Pointer-based rotation (parallax effect)
      meshRef.current.rotation.x +=
        (pointer.y * 0.3 - meshRef.current.rotation.x) * 0.02;
      meshRef.current.rotation.y +=
        (pointer.x * 0.3 - meshRef.current.rotation.y) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusKnotGeometry args={[1, 0.35, 100, 16]} />
      <MeshDistortMaterial
        color="#4f9eff"
        emissive="#2060ff"
        emissiveIntensity={0.4}
        roughness={0.2}
        metalness={0.8}
        distort={0.3}
        speed={2}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function InnerCore() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;

      // Pulse effect
      const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.1 + 0.9;
      meshRef.current.scale.setScalar(pulse * 0.5);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[0.5, 1]} />
      <MeshDistortMaterial
        color="#a855f7"
        emissive="#7c3aed"
        emissiveIntensity={0.8}
        roughness={0.1}
        metalness={0.9}
        distort={0.4}
        speed={3}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function SceneParticles() {
  return (
    <>
      {/* Main sparkle field */}
      <Sparkles
        count={80}
        scale={6}
        size={2}
        speed={0.4}
        opacity={0.6}
        color="#60a5fa"
      />
      {/* Secondary particles */}
      <Sparkles
        count={40}
        scale={4}
        size={1.5}
        speed={0.3}
        opacity={0.4}
        color="#a78bfa"
      />
    </>
  );
}

function Lights() {
  return (
    <>
      {/* Ambient fill */}
      <ambientLight intensity={0.3} />

      {/* Key light - main illumination */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        color="#ffffff"
      />

      {/* Rim light - edge definition */}
      <pointLight position={[-5, 2, -5]} intensity={0.8} color="#a855f7" />

      {/* Fill light - soften shadows */}
      <pointLight position={[0, -3, 2]} intensity={0.4} color="#60a5fa" />

      {/* Top accent */}
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#22d3ee" />
    </>
  );
}

function PointerTracker({
  onPointerUpdate,
}: {
  onPointerUpdate: (pointer: PointerState) => void;
}) {
  const { viewport } = useThree();

  useFrame(({ pointer }) => {
    // Normalize pointer to -1 to 1 range
    onPointerUpdate({
      x: (pointer.x * viewport.width) / 10,
      y: (pointer.y * viewport.height) / 10,
    });
  });

  return null;
}

function Scene() {
  const [pointer, setPointer] = useState<PointerState>({ x: 0, y: 0 });

  return (
    <>
      <PointerTracker onPointerUpdate={setPointer} />
      <Lights />
      <Environment preset="city" />

      <Float
        speed={1.5}
        rotationIntensity={0.2}
        floatIntensity={0.5}
        floatingRange={[-0.1, 0.1]}
      >
        <GlowingOrb pointer={pointer} />
        <InnerCore />
      </Float>

      <SceneParticles />
    </>
  );
}

// ============================================================================
// Fallback Components
// ============================================================================

function WebGLUnavailableFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-muted/50 to-purple-500/10 rounded-2xl">
      <div className="relative mb-4">
        {/* Glow effect */}
        <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full scale-125" />

        {/* Placeholder shape */}
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/60 to-purple-600/60 animate-pulse" />
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-500/30" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground text-center px-4">
        3D preview unavailable
      </p>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 via-muted/30 to-purple-500/5 rounded-2xl">
      <div className="relative">
        <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full scale-150 animate-pulse" />
        <div className="w-16 h-16 md:w-24 md:h-24 rounded-full animate-spin" />
      </div>
    </div>
  );
}

// ============================================================================
// Main Export
// ============================================================================

export function HeroThreeScene() {
  const webGLSupported = useWebGLSupport();
  const [hasError, setHasError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything on server
  if (!isClient) {
    return (
      <div className="relative w-full aspect-square max-h-[320px] md:max-h-[480px] lg:max-h-[520px]">
        <LoadingFallback />
      </div>
    );
  }

  // Show fallback if WebGL is not supported or there was an error
  if (!webGLSupported || hasError) {
    return (
      <div
        className="relative w-full aspect-square max-h-[320px] md:max-h-[480px] lg:max-h-[520px]"
        aria-hidden="true"
      >
        <WebGLUnavailableFallback />
      </div>
    );
  }

  return (
    <div
      className="relative w-full aspect-square max-h-[320px] md:max-h-[480px] lg:max-h-[520px]"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onError={() => setHasError(true)}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* Subtle vignette overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-background/20 via-transparent to-transparent" />
    </div>
  );
}

export default HeroThreeScene;
