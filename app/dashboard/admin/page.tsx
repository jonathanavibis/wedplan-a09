'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  Users,
  Building,
  UserCheck,
  Layers,
  Clock,
  Receipt,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboardOverview() {
  const { user } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Role Guard: Only Admin
  useEffect(() => {
    if (user && user.role !== 'Admin') {
      if (user.role === 'Vendor') router.replace('/dashboard/vendor');
      else router.replace('/dashboard/customer');
    }
  }, [user, router]);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.users.getAdminStats();
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Aggregating platform KPI metrics..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Admin Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-stone-900 via-stone-800 to-rose-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-bold text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2.5 py-0.5 rounded-full">
              Platform Administration
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Full System Authority</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">
            Administrator Command Center
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm">
            Monitor platform growth, review vendor service submissions, moderate accounts, and audit financial transactions.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/dashboard/admin/services"
            className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm transition shadow-sm flex items-center gap-2 shrink-0"
          >
            <span>Review Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Primary KPI Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Users */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Users</span>
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">{stats?.totalUsers || 0}</p>
          <span className="text-[11px] text-stone-400">Registered platform accounts</span>
        </div>

        {/* Total Vendors */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Vendors</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-purple-700">{stats?.totalVendors || 0}</p>
          <span className="text-[11px] text-stone-400">Service providers</span>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Customers</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-blue-700">{stats?.totalCustomers || 0}</p>
          <span className="text-[11px] text-stone-400">Engaged couples</span>
        </div>

        {/* Total Services */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Services</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">{stats?.totalServices || 0}</p>
          <span className="text-[11px] text-stone-400">
            {stats?.approvedServices || 0} approved live
          </span>
        </div>

        {/* Pending Services */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Pending Review</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-amber-600">{stats?.pendingServices || 0}</p>
          <span className="text-[11px] text-stone-400">Needs editorial review</span>
        </div>

        {/* Transactions & Revenue */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Gross Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-emerald-600">
            {formatCurrency(stats?.totalRevenue || 0)}
          </p>
          <span className="text-[11px] text-stone-400">
            {stats?.totalTransactions || 0} completed checkouts
          </span>
        </div>
      </div>

      {/* Admin Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/admin/users"
          className="group bg-white p-6 rounded-3xl border border-stone-200 hover:border-rose-300 hover:shadow-lg transition space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-serif text-stone-900 group-hover:text-rose-600 transition-colors">
            Manage Registered Users
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Search couples and vendors, filter by account type, inspect user profiles, and toggle account blocks.
          </p>
          <span className="text-xs font-bold text-rose-600 flex items-center gap-1 pt-1">
            <span>Open User Management</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <Link
          href="/dashboard/admin/services"
          className="group bg-white p-6 rounded-3xl border border-stone-200 hover:border-rose-300 hover:shadow-lg transition space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-serif text-stone-900 group-hover:text-rose-600 transition-colors">
            Review Submitted Services
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Review incoming vendor packages, approve listings for public catalog display, reject low-quality entries, or delete inappropriate services.
          </p>
          <span className="text-xs font-bold text-amber-600 flex items-center gap-1 pt-1">
            <span>Moderate Services ({stats?.pendingServices || 0} Pending)</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <Link
          href="/dashboard/admin/transactions"
          className="group bg-white p-6 rounded-3xl border border-stone-200 hover:border-rose-300 hover:shadow-lg transition space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-serif text-stone-900 group-hover:text-rose-600 transition-colors">
            Financial & Stripe Audit
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Inspect real-time Stripe Checkout sessions, vendor premium subscription transactions, and verified webhook receipts.
          </p>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 pt-1">
            <span>View All Transactions</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>
    </div>
  );
}
