'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  Crown,
  Search,
  Headphones,
} from 'lucide-react';
import toast from 'react-hot-toast';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const uid = searchParams.get('uid');
  const planParam = searchParams.get('plan');
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [planDetails, setPlanDetails] = useState<{
    role: string;
    plan: string;
    amount: number;
  }>({
    role: 'Vendor',
    plan: 'vendor_premium',
    amount: 49.0,
  });

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId) {
        setVerifying(false);
        setErrorMessage('No Stripe Checkout Session identifier provided.');
        return;
      }

      try {
        // Securely call server-side verification endpoint
        const res = await api.transactions.verifySession(sessionId, {
          uid: uid || undefined,
          plan: planParam || undefined,
        });

        if (res.success) {
          // If server issued a fresh token (e.g. from incognito or direct Stripe callback), persist it
          if (res.token) {
            localStorage.setItem('wedplan_token', res.token);
          }

          // Refresh authenticated user state
          await refreshUser();

          const activeRole = res.user?.role || user?.role || (planParam === 'customer_vip' ? 'Customer' : 'Vendor');
          const isCustomer = activeRole === 'Customer' || planParam === 'customer_vip';

          setPlanDetails({
            role: activeRole,
            plan: isCustomer ? 'customer_vip' : 'vendor_premium',
            amount: isCustomer ? 29.0 : 49.0,
          });

          setSuccess(true);
          toast.success(
            isCustomer
              ? '💎 VIP Concierge Support Activated!'
              : '🎉 Vendor Premium Subscription Activated!'
          );
        } else {
          setErrorMessage(res.message || 'Payment verification failed.');
        }
      } catch (err: any) {
        console.error('Session verify error:', err);
        setErrorMessage(err.message || 'Failed to verify transaction with server.');
      } finally {
        setVerifying(false);
      }
    }

    verifyPayment();
  }, [sessionId, uid, planParam]);

  const isCustomer = planDetails.role === 'Customer' || planDetails.plan === 'customer_vip';

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-50/50 via-white to-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-16">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-rose-100 text-center space-y-6">
          {verifying ? (
            <div className="py-8">
              <LoadingSpinner text="Verifying payment confirmation with Stripe..." />
            </div>
          ) : success ? (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-md ${
                  isCustomer
                    ? 'bg-amber-100 text-amber-600 ring-8 ring-amber-50'
                    : 'bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50'
                }`}
              >
                {isCustomer ? <Crown className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
              </div>

              <div className="space-y-2">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    isCustomer
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {isCustomer ? 'VIP Customer Concierge Pass Active' : 'Premium Vendor Unlocked'}
                  </span>
                </div>
                <h1 className="text-3xl font-serif font-bold text-stone-900">
                  {isCustomer ? 'Welcome to VIP Concierge! 💎' : 'Payment Successful! 🎉'}
                </h1>
                <p className="text-stone-600 text-sm leading-relaxed max-w-sm mx-auto">
                  {isCustomer
                    ? 'Your couple account now enjoys dedicated 24/7 wedding planner concierge support, priority vendor booking, and exclusive planning privileges.'
                    : 'Thank you for upgrading. Your vendor account has been upgraded to Premium with unlimited service listings and golden badge placement.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-left text-xs space-y-2 text-stone-600">
                <div className="flex justify-between">
                  <span className="text-stone-400">Transaction ID:</span>
                  <span className="font-mono font-bold truncate max-w-[200px]">{sessionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Amount Paid:</span>
                  <span className="font-bold text-stone-900">${planDetails.amount.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Subscription Plan:</span>
                  <span className="font-bold text-rose-600">
                    {isCustomer ? 'VIP Concierge Pass (Annual)' : 'Premium Vendor Tier (Annual)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Support Level:</span>
                  <span className="font-bold text-emerald-600">
                    {isCustomer ? '24/7 Dedicated Concierge Planner' : 'Priority Vendor Technical Support'}
                  </span>
                </div>
              </div>

              {/* Action Buttons based on User Role */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                {isCustomer ? (
                  <>
                    <Link
                      href="/dashboard/customer/vip"
                      className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                    >
                      <Headphones className="w-4 h-4" />
                      <span>Access VIP Concierge</span>
                    </Link>
                    <Link
                      href="/services"
                      className="flex-1 py-3.5 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold text-xs transition flex items-center justify-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      <span>Explore Services</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard/vendor/add-service"
                      className="flex-1 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Publish New Service</span>
                    </Link>
                    <Link
                      href="/dashboard/vendor"
                      className="flex-1 py-3.5 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold text-xs transition flex items-center justify-center gap-2"
                    >
                      <span>Go to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">Verification Pending</h2>
                <p className="text-sm text-stone-600 mt-2">{errorMessage}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={user?.role === 'Customer' ? '/dashboard/customer/vip' : '/dashboard/vendor/subscription'}
                  className="inline-block px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition"
                >
                  Return to Subscription Page
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-block px-6 py-3 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs transition"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading payment verification...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
