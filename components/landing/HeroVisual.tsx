"use client";

import dynamic from "next/dynamic";

// Dynamically import the Three.js scene to avoid SSR issues
const HeroThreeScene = dynamic(
  () => import("@/components/landing/HeroThreeScene"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[320px] md:min-h-[400px] lg:min-h-[480px] flex items-center justify-center bg-gradient-to-br from-primary/5 via-muted/30 to-purple-500/5 rounded-2xl">
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full scale-150 animate-pulse" />
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
      </div>
    ),
  }
);

export function HeroVisual() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-purple-500/10 to-cyan-500/20 rounded-3xl blur-3xl" />

      {/* Glass card container for 3D scene */}
      <div className="relative w-full glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <HeroThreeScene />
      </div>
    </div>
  );
}

export default HeroVisual;
