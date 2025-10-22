'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Mail, Lock, LogIn, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError('Invalid email or password. Please check your credentials and try again.');
        toast.error('Login failed');
      } else {
        toast.success('Welcome back!');
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again later.');
      toast.error('Login error');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="gradient-bg flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-body font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3 mb-4">
            <div className="icon-rounded w-16 h-16 flex items-center justify-center">
              <Cloud className="h-8 w-8 text-primary" />
            </div>
            <span className="text-3xl font-bold text-title">CloudeStorage</span>
          </Link>
        </div>

        <div className="glass-card rounded-2xl shadow-soft overflow-hidden">
          <CardHeader className="px-6 sm:px-8 pt-6 sm:pt-8 pb-2 sm:pb-4">
            <CardTitle className="text-2xl text-title text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center text-subtle">Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent className="px-6 sm:px-8 pb-6 sm:pb-8">
            {error && (
              <div className="bg-accent/10 border border-accent/20 text-body p-3 rounded-xl mb-5 text-sm flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-coral-accent flex-shrink-0" />
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-body font-medium flex items-center gap-2">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value); setError('');}}
                    required
                    disabled={isLoading}
                    className="rounded-xl border-gray-200 bg-white/50 backdrop-blur h-12 pl-10 pr-4 transition-shadow focus:ring-2 focus:ring-primary/25 focus:border-primary"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-secondary h-5 w-5 opacity-70" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-body font-medium flex items-center gap-2">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value); setError('');}}
                    required
                    disabled={isLoading}
                    className="rounded-xl border-gray-200 bg-white/50 backdrop-blur h-12 pl-10 pr-4 transition-shadow focus:ring-2 focus:ring-primary/25 focus:border-primary"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coral-accent h-5 w-5 opacity-70" />
                </div>
              </div>

              <Button 
                type="submit" 
                className="btn-primary w-full h-12 rounded-xl text-white font-semibold transition-all" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="inline-block h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-white border-r-transparent" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <LogIn className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-subtle">Don&apos;t have an account? </span>
              <Link href="/signup" className="text-primary hover:text-primary/80 font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
