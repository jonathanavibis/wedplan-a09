'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  CalendarCheck,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Ban,
  Eye,
} from 'lucide-react';

export default function CustomerBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = async () => {
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
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id: string, serviceTitle: string) => {
    if (!window.confirm(`Are you sure you want to cancel your booking request for "${serviceTitle}"?`)) {
      return;
    }

    setCancellingId(id);
    try {
      const res = await api.bookings.cancelBooking(id);
      if (res.success) {
        toast.success('Booking request cancelled.');
        fetchBookings();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel booking request.');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving your wedding bookings..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">My Wedding Bookings</h1>
          <p className="text-xs text-stone-500 mt-1">
            Track your reservations, vendor confirmations, and schedule.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition"
        >
          <span>Find More Services</span>
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-xs max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold font-serif text-stone-900 mb-1">No Bookings Yet</h3>
          <p className="text-xs text-stone-500 mb-6">
            Explore our curated catalog of photographers, venues, caterers, and decorators to request your first booking!
          </p>
          <Link
            href="/services"
            className="px-6 py-2.5 rounded-full bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 transition"
          >
            Browse Wedding Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((booking) => {
            const isPending = booking.status === 'Pending';
            return (
              <div
                key={booking._id}
                className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4 hover:border-rose-200 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  {/* Service & Vendor Header */}
                  <div className="flex items-center gap-3">
                    <img
                      src={booking.serviceId?.images?.[0] || '/placeholder.jpg'}
                      alt="Service"
                      className="w-14 h-14 rounded-2xl object-cover ring-1 ring-stone-200"
                    />
                    <div>
                      <h3 className="font-bold text-stone-900 text-base">
                        {booking.serviceId?.serviceName || 'Wedding Service'}
                      </h3>
                      <p className="text-xs text-stone-600">
                        Vendor:{' '}
                        <span className="font-semibold text-rose-600">
                          {booking.vendorId?.businessName || booking.vendorId?.name}
                        </span>{' '}
                        ({booking.vendorId?.email})
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'Accepted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : booking.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : booking.status === 'Cancelled'
                          ? 'bg-stone-100 text-stone-600 border border-stone-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {booking.status === 'Accepted' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                      {booking.status === 'Rejected' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                      {booking.status === 'Pending' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                      {booking.status === 'Cancelled' && <Ban className="w-3.5 h-3.5 text-stone-400" />}
                      <span>{booking.status}</span>
                    </span>
                  </div>
                </div>

                {/* Event Schedule & Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-stone-50/70 p-4 rounded-2xl border border-stone-100">
                  <div className="flex items-center gap-2 text-stone-700">
                    <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Event Date</span>
                      <strong className="text-stone-900">{booking.eventDate}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-stone-700">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Location</span>
                      <strong className="text-stone-900 truncate block max-w-[200px]">
                        {booking.eventLocation}
                      </strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Requested On</span>
                    <strong className="text-stone-900">{formatDate(booking.createdAt)}</strong>
                  </div>
                </div>

                {/* Optional Message */}
                {booking.message && (
                  <div className="text-xs text-stone-600 italic bg-white p-3 rounded-xl border border-stone-100">
                    Your note: &ldquo;{booking.message}&rdquo;
                  </div>
                )}

                {/* Action Toolbar */}
                <div className="pt-2 flex items-center justify-between gap-3 border-t border-stone-100">
                  <Link
                    href={`/services/${booking.serviceId?._id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:underline"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Service Page</span>
                  </Link>

                  {/* Rule: Can only cancel if Pending */}
                  {isPending ? (
                    <button
                      onClick={() =>
                        handleCancelBooking(booking._id, booking.serviceId?.serviceName || 'service')
                      }
                      disabled={cancellingId === booking._id}
                      className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-rose-50 hover:text-rose-700 font-semibold text-xs transition disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>{cancellingId === booking._id ? 'Cancelling...' : 'Cancel Request'}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-stone-400 italic">
                      {booking.status === 'Cancelled'
                        ? 'Request was cancelled by you.'
                        : `Reservation finalized (${booking.status}).`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
