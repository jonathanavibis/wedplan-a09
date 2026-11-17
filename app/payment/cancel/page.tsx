'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { XCircle, ArrowRight } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fffbf9]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-stone-200 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-bold text-stone-900">
              Payment Cancelled
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Your Stripe checkout session was cancelled. No charges were made to your account.
              You can upgrade to Premium at any time from your vendor dashboard.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard/vendor/subscription"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
            >
              <span>Back to Subscription Plans</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
