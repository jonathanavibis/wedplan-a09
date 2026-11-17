'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { Heart, Lock, Mail, User, Building, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

function RegisterFormContent() {
  const { register } = useAuth();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'Vendor' ? 'Vendor' : 'Customer';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Customer' | 'Vendor'>(initialRole);
  const [businessName, setBusinessName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Password requirements check: min 6 chars, 1 uppercase, 1 lowercase
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.error('Password must be at least 6 characters with at least one uppercase and one lowercase letter.');
      return;
    }

    setSubmitting(true);

    try {
      await register({
        name,
        email,
        password,
        role,
        businessName: role === 'Vendor' ? businessName : undefined,
      });
    } catch {
      // toast shown in context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-50/60 via-white to-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-rose-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center mx-auto shadow-md shadow-rose-200">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Join WedPlan
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Create an account as a couple planning a wedding or a professional vendor.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Role Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                I am signing up as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('Customer')}
                  className={`py-3 px-4 rounded-2xl border text-sm font-semibold transition flex flex-col items-center gap-1 ${
                    role === 'Customer'
                      ? 'border-rose-500 bg-rose-50/70 text-rose-700 ring-2 ring-rose-200'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Customer (Couple)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('Vendor')}
                  className={`py-3 px-4 rounded-2xl border text-sm font-semibold transition flex flex-col items-center gap-1 ${
                    role === 'Vendor'
                      ? 'border-rose-500 bg-rose-50/70 text-rose-700 ring-2 ring-rose-200'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Vendor (Business)</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition"
                />
              </div>
            </div>

            {/* Business Name (Vendor only) */}
            {role === 'Vendor' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Business / Studio Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rosewood Wedding Studios"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
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

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Min 6 chars with uppercase & lowercase"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition"
                />
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                At least 6 characters, including 1 uppercase and 1 lowercase letter.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md shadow-rose-200 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              <span>{submitting ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-stone-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-rose-600 hover:text-rose-700">
              Sign In
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading sign up...</div>}>
      <RegisterFormContent />
    </Suspense>
  );
}
