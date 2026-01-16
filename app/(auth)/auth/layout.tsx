import Link from "next/link";
import { ImageIcon, Upload, Shield, Zap, Lock } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Brand Panel - Left Side */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col p-10 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>

        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 text-white group">
            <div className="h-11 w-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-white/30 transition-colors">
              <ImageIcon className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight">ImageVault</span>
          </Link>
        </div>

        {/* Feature Bullets */}
        <div className="relative z-10 space-y-8 max-w-md my-auto">
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
            Your images, beautifully organized
          </h2>
          
          <div className="space-y-5">
            <FeatureItem 
              icon={<Upload className="h-5 w-5" />}
              title="Instant Upload"
              description="Drag, drop, done. Upload images in seconds."
            />
            <FeatureItem 
              icon={<Zap className="h-5 w-5" />}
              title="Lightning Fast"
              description="Optimized delivery with smart compression."
            />
            <FeatureItem 
              icon={<Shield className="h-5 w-5" />}
              title="Secure Storage"
              description="Your images are encrypted and protected."
            />
          </div>
        </div>


      </div>

      {/* Auth Form Panel - Right Side */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Mobile Logo */}
        <div className="lg:hidden p-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">ImageVault</span>
          </Link>
        </div>

        {/* Centered Card Container */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        {/* Subtle Background for Right Panel */}
        <div className="fixed inset-0 lg:left-1/2 xl:left-[55%] -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-secondary/5 blur-3xl" />
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
        <span className="text-white">{icon}</span>
      </div>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-white/70">{description}</p>
      </div>
    </div>
  );
}
