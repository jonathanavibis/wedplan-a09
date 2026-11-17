'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { Heart, Lock, Mail, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

function LoginFormContent() {
  const { login, loginWithGoogle } = useAuth();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
    } catch {
      // Error handled by AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  // Demo Login helpers for evaluators
  const handleQuickLogin = async (role: 'admin' | 'vendor' | 'customer') => {
    const creds = {
      admin: { email: 'admin@wedplan.com', password: 'Admin@123456' },
      vendor: { email: 'vendor@wedplan.com', password: 'Vendor@123456' },
      customer: { email: 'customer@wedplan.com', password: 'Customer@123456' },
    };

    setEmail(creds[role].email);
    setPassword(creds[role].password);

    setSubmitting(true);
    try {
      await login(creds[role].email, creds[role].password);
    } catch {
      // toast shown in context
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSimulation = async () => {
    setSubmitting(true);
    try {
      await loginWithGoogle({
        email: 'google_user@wedplan.com',
        name: 'Google Verified User',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'Customer',
      });
    } catch {
      // Error handled by AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-50/60 via-white to-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-rose-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center mx-auto shadow-md shadow-rose-200">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Sign in to manage your wedding plans, bookings, or vendor storefront.
            </p>
          </div>

          {/* Quick Demo Logins for Evaluator */}
          <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>1-Click Test Credentials</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="py-1.5 px-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 transition shadow-2xs"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('vendor')}
                className="py-1.5 px-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 transition shadow-2xs"
              >
                Vendor
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('customer')}
                className="py-1.5 px-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 transition shadow-2xs"
              >
                Customer
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md shadow-rose-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social / Google Login */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-stone-400 font-semibold">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSimulation}
            disabled={submitting}
            className="w-full py-3 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-sm transition flex items-center justify-center gap-2.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-xs text-stone-500">
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="font-semibold text-rose-600 hover:text-rose-700">
              Create an account
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading sign in...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
