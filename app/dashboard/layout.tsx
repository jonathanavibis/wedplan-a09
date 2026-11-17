'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ShieldAlert } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fffbf9]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner text="Checking authentication & permissions..." />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  if (user?.isBlocked) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fffbf9]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-rose-200 text-center shadow-lg space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold font-serif text-stone-900">Account Access Suspended</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Your WedPlan account has been blocked by an administrator. Please reach out to{' '}
              <span className="font-semibold text-rose-600">concierge@wedplan.com</span> for assistance.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fffbf9]">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <DashboardSidebar />
        <main className="flex-1 p-4 sm:p-8 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
