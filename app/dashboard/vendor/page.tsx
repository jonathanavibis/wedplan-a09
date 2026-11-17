'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  Layers,
  CheckCircle,
  Clock,
  CheckCheck,
  CreditCard,
  PlusCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function VendorDashboardOverview() {
  const { user } = useAuth();
  const router = useRouter();

  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Guard: Only vendors allowed
  useEffect(() => {
    if (user && user.role !== 'Vendor') {
      if (user.role === 'Admin') router.replace('/dashboard/admin');
      else router.replace('/dashboard/customer');
    }
  }, [user, router]);

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesRes, bookingsRes] = await Promise.all([
          api.services.getVendorServices(),
          api.bookings.getVendorRequests(),
        ]);

        if (servicesRes.success) setServices(servicesRes.services);
        if (bookingsRes.success) setBookings(bookingsRes.bookings);
      } catch (err) {
        console.error('Failed to load vendor overview data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading vendor analytics & metrics..." />;
  }

  const totalServices = services.length;
  const activeServices = services.filter((s) => s.isActive).length;
  const pendingRequests = bookings.filter((b) => b.status === 'Pending').length;
  const acceptedBookings = bookings.filter((b) => b.status === 'Accepted').length;
  const isPremium = user?.subscriptionPlan === 'premium';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-rose-500 to-rose-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-rose-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-bold text-rose-200 bg-white/20 px-2.5 py-0.5 rounded-full">
              Vendor Control Center
            </span>
            {isPremium && (
              <span className="text-xs font-bold text-amber-200 bg-amber-900/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-amber-300" />
                <span>Premium Vendor</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-rose-100 text-xs sm:text-sm">
            {user?.businessName ? `${user.businessName} • ` : ''}Manage your published wedding packages, customer inquiries, and subscriptions.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/dashboard/vendor/add-service"
            className="px-5 py-3 rounded-2xl bg-white text-rose-600 font-bold text-xs sm:text-sm hover:bg-rose-50 transition shadow-sm flex items-center gap-2 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish New Service</span>
          </Link>
        </div>
      </div>

      {/* KPI Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Services */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Services</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">{totalServices}</p>
          <span className="text-[11px] text-stone-400">All submitted listings</span>
        </div>

        {/* Active Services */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Active Services</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">{activeServices}</p>
          <span className="text-[11px] text-stone-400">
            {isPremium ? 'Unlimited tier' : `${3 - activeServices} slots remaining`}
          </span>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Pending Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-amber-600">{pendingRequests}</p>
          <span className="text-[11px] text-stone-400">Awaiting your response</span>
        </div>

        {/* Accepted Bookings */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Accepted</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">{acceptedBookings}</p>
          <span className="text-[11px] text-stone-400">Confirmed weddings</span>
        </div>

        {/* Current Plan */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Subscription</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-serif font-bold capitalize text-stone-900">
            {user?.subscriptionPlan === 'premium' ? '👑 Premium' : 'Free Tier'}
          </p>
          <Link
            href="/dashboard/vendor/subscription"
            className="text-[11px] text-rose-600 font-semibold hover:underline block"
          >
            {user?.subscriptionPlan === 'premium' ? 'Manage Plan →' : 'Upgrade ($49) →'}
          </Link>
        </div>
      </div>

      {/* Recent Booking Requests Preview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900">Recent Customer Booking Inquiries</h2>
            <p className="text-xs text-stone-500">Incoming requests for your wedding packages</p>
          </div>
          <Link
            href="/dashboard/vendor/bookings"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <span>View All ({bookings.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <p className="text-stone-500 text-sm py-6 text-center">No customer booking requests yet.</p>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 4).map((b) => (
              <div
                key={b._id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-stone-900">{b.customerId?.name || 'Customer'}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : b.status === 'Cancelled'
                          ? 'bg-stone-200 text-stone-600'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 font-medium">{b.serviceId?.serviceName}</p>
                  <p className="text-[11px] text-stone-500">Event Date: {b.eventDate} • Location: {b.eventLocation}</p>
                </div>

                <Link
                  href="/dashboard/vendor/bookings"
                  className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-white self-start sm:self-center transition"
                >
                  Manage Request
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
