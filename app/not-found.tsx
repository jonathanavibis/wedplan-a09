import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Heart, ChevronLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fffbf9]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-20 text-center">
        <div className="max-w-md w-full space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 fill-rose-500" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-rose-500">404 Error</span>
            <h1 className="text-3xl font-serif font-bold text-stone-900">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              The wedding celebration page or resource you are looking for has been moved or does not exist.
            </p>
          </div>

          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Return to WedPlan Home</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
