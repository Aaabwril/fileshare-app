'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Cloud, Shield, Zap, Share2, Lock, Download } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-bg min-h-screen">
      {/* Navigation */}
      <nav className="glass-card border-b border-white/20">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="icon-rounded">
              <Cloud className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-title">CloudeStorage</span>
          </div>
          <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-0">
            <Link href="/login">
              <Button variant="ghost" className="text-body hover:bg-white/50 rounded-xl text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="btn-primary text-white font-semibold text-sm sm:text-base px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-xl">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-title mb-4 sm:mb-6 leading-tight">
            Share Your Files<br />
            With 
            <span className="text-purple-500 font-bold pl-1 inline-block">CloudeStorage</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-subtle mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload, store, and share your files with anyone. Generate secure shareable links and track downloads in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button className="btn-primary text-white text-base sm:text-lg font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl w-full sm:w-auto">
                Start Now →
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="bg-white/80 backdrop-blur text-body hover:bg-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-soft w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-title mb-2 sm:mb-3">Key Features</h2>
          <p className="text-subtle text-sm sm:text-base">Everything you need for secure and effortless file sharing</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto px-2 sm:px-4">
          <div className="glass-card rounded-2xl p-4 sm:p-6 hover:transform hover:scale-105 transition-all duration-300 h-full flex flex-col">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center mb-3 sm:mb-4">
              <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-title">Secure Storage</h3>
            <p className="text-subtle text-xs sm:text-sm leading-relaxed mt-auto">
              Your files are encrypted and stored securely in our cloud infrastructure with enterprise-grade security.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-6 hover:transform hover:scale-105 transition-all duration-300 h-full flex flex-col">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-cyan-100 to-cyan-50 flex items-center justify-center mb-3 sm:mb-4">
              <Share2 className="h-6 w-6 sm:h-7 sm:w-7 text-secondary" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-title">Easy Sharing</h3>
            <p className="text-subtle text-xs sm:text-sm leading-relaxed mt-auto">
              Generate secure sharing links instantly and share your files with anyone, anywhere in the world.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-6 hover:transform hover:scale-105 transition-all duration-300 h-full flex flex-col">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center mb-3 sm:mb-4">
              <Download className="h-6 w-6 sm:h-7 sm:w-7 text-accent" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-title">Download Tracking</h3>
            <p className="text-subtle text-xs sm:text-sm leading-relaxed mt-auto">
              Monitor who downloads your shared files with real-time download tracking and statistics.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-6 hover:transform hover:scale-105 transition-all duration-300 h-full flex flex-col">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center mb-3 sm:mb-4">
              <Zap className="h-6 w-6 sm:h-7 sm:w-7" style={{color: 'rgb(34, 197, 94)'}} />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-title">Lightning Fast</h3>
            <p className="text-subtle text-xs sm:text-sm leading-relaxed mt-auto">
              Upload and download files at maximum speed with our optimized cloud infrastructure.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-6 hover:transform hover:scale-105 transition-all duration-300 h-full flex flex-col">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center mb-3 sm:mb-4">
              <Lock className="h-6 w-6 sm:h-7 sm:w-7" style={{color: 'rgb(251, 146, 60)'}} />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-title">Privacy Control</h3>
            <p className="text-subtle text-xs sm:text-sm leading-relaxed mt-auto">
              Maintain full control over your shared files with privacy settings and access permissions.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-6 hover:transform hover:scale-105 transition-all duration-300 h-full flex flex-col">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center mb-3 sm:mb-4">
              <Cloud className="h-6 w-6 sm:h-7 sm:w-7" style={{color: 'rgb(99, 102, 241)'}} />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-title">Anywhere Access</h3>
            <p className="text-subtle text-xs sm:text-sm leading-relaxed mt-auto">
              Access your files from any device, anywhere, anytime with our responsive cloud platform.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-title">Start Sharing Today</h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-subtle">
              Join thousands of users sharing files securely every day with CloudeStorage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="w-full sm:w-auto">
                <Button className="bg-white/80 text-body px-6 py-3 rounded-xl shadow-soft hover:bg-white w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" className="w-full sm:w-auto">
                <Button className="btn-primary text-white px-6 sm:px-8 py-3 rounded-xl font-semibold w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-card border-t border-white/20 mt-12 sm:mt-16 md:mt-20">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 text-center">
          <p className="text-subtle text-sm sm:text-base">&copy; 2025 CloudeStorage. Built with Next.js and InsForge.</p>
        </div>
      </footer>
    </div>
  );
}
