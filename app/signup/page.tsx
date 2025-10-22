'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(email, password, nickname || undefined);
      if (error) {
        toast.error(error.message || 'Failed to create account');
      } else {
        toast.success('Account created successfully!');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
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

        <div className="glass-card rounded-2xl py-8 shadow-soft">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-title text-center">Create Account</CardTitle>
            <CardDescription className="text-center text-subtle">Sign up to start sharing files securely</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="nickname" className="text-body font-medium flex items-center gap-2">
                  Name (Optional)
                </Label>
                <div className="relative">
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="John Doe"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    disabled={isLoading}
                    className="rounded-xl border-gray-200 bg-white/50 backdrop-blur h-12 pl-10 pr-4"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-primary h-5 w-5 opacity-70" />
                </div>
              </div>

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
                    className="rounded-xl border-gray-200 bg-white/50 backdrop-blur h-12 pl-10 pr-4"
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
                    minLength={6}
                    className="rounded-xl border-gray-200 bg-white/50 backdrop-blur h-12 pl-10 pr-4"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coral-accent h-5 w-5 opacity-70" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-subtle">
                  <AlertCircle size={14} className="text-coral-accent" />
                  Must be at least 6 characters
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-subtle">Already have an account? </span>
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
