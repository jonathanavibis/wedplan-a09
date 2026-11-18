'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  ArrowRight,
  Heart,
  Sparkles,
  Crown,
  Headphones,
} from 'lucide-react';

export default function CustomerDashboardOverview() {
  const { user } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Guard: Redirect if admin or vendor
  useEffect(() => {
    if (user && user.role !== 'Customer') {
      if (user.role === 'Admin') router.replace('/dashboard/admin');
      else router.replace('/dashboard/vendor');
    }
  }, [user, router]);

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await api.bookings.getCustomerBookings();
        if (data.success) {
          setBookings(data.bookings);
        }
      } catch (err) {
        console.error('Fetch customer bookings error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Retrieving wedding planning itinerary..." />;
  }

  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const acceptedCount = bookings.filter((b) => b.status === 'Accepted').length;
  const rejectedCount = bookings.filter((b) => b.status === 'Rejected').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-rose-500 to-rose-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-rose-200">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest font-bold text-rose-200 bg-white/20 px-2.5 py-0.5 rounded-full">
            Couple Wedding Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">
            Hello, {user?.name}! 💍
          </h1>
          <p className="text-rose-100 text-xs sm:text-sm">
            Track your vendor inquiries, confirmed ceremony dates, and venue reservations in one place.
          </p>
        </div>

        <Link
          href="/services"
          className="px-5 py-3 rounded-2xl bg-white text-rose-600 font-bold text-xs sm:text-sm hover:bg-rose-50 transition shadow-sm flex items-center gap-2 shrink-0 self-start sm:self-center"
        >
          <Search className="w-4 h-4" />
          <span>Explore More Services</span>
        </Link>
      </div>

      {/* VIP Concierge Pass Callout Card */}
      {user?.subscriptionPlan === 'premium' ? (
        <div className="bg-gradient-to-r from-amber-50 via-amber-100/40 to-white rounded-3xl p-5 sm:p-6 border border-amber-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-stone-900 text-base">VIP Concierge Active 💎</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  24/7 Dedicated Support
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Need urgent vendor coordination or contract advice? Your designated wedding concierge is on standby.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/customer/vip"
            className="px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 self-start sm:self-center shadow-xs"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Open VIP Concierge</span>
          </Link>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-amber-500/10 via-rose-50 to-white rounded-3xl p-5 sm:p-6 border border-amber-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-stone-900 text-base">
                  Upgrade to VIP Concierge & Premium Support
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  $29 / Year
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Get a 24/7 personal wedding planner, priority booking queue for top vendors, and exclusive 15% luxury discounts.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/customer/vip"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 self-start sm:self-center shadow-sm"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Learn More & Upgrade</span>
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Requests</span>
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">{totalBookings}</p>
          <span className="text-[11px] text-stone-400">All submitted inquiries</span>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Pending Review</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-amber-600">{pendingCount}</p>
          <span className="text-[11px] text-stone-400">Awaiting vendor confirmation</span>
        </div>

        {/* Accepted */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Accepted & Booked</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-emerald-600">{acceptedCount}</p>
          <span className="text-[11px] text-stone-400">Confirmed by wedding vendors</span>
        </div>

        {/* Rejected / Cancelled */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Declined</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-rose-600">{rejectedCount}</p>
          <span className="text-[11px] text-stone-400">Unavailable or declined</span>
        </div>
      </div>

      {/* Recent Bookings List Preview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900">Recent Booking Inquiries</h2>
            <p className="text-xs text-stone-500">Your latest reservations and vendor updates</p>
          </div>
          <Link
            href="/dashboard/customer/bookings"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <span>View All ({bookings.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <Heart className="w-8 h-8 text-rose-300 mx-auto" />
            <p className="text-stone-500 text-sm">You haven&apos;t booked any wedding services yet.</p>
            <Link
              href="/services"
              className="inline-block px-5 py-2 rounded-full bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 transition"
            >
              Start Exploring Vendors
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 4).map((b) => (
              <div
                key={b._id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={b.serviceId?.images?.[0] || '/placeholder.jpg'}
                    alt="Service"
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-stone-200"
                  />
                  <div>
                    <p className="font-bold text-sm text-stone-900">{b.serviceId?.serviceName}</p>
                    <p className="text-xs text-stone-600">
                      Vendor: <span className="font-medium">{b.vendorId?.businessName || b.vendorId?.name}</span>
                    </p>
                    <p className="text-[11px] text-stone-400">Event Date: {b.eventDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
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
                  <Link
                    href="/dashboard/customer/bookings"
                    className="text-xs font-semibold text-stone-700 hover:text-rose-600"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
