'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  CalendarCheck,
  Calendar,
  MapPin,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  User,
  AlertCircle,
} from 'lucide-react';

export default function VendorBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const data = await api.bookings.getVendorRequests();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Fetch vendor bookings error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'Accepted' | 'Rejected') => {
    setProcessingId(id);
    try {
      const res = await api.bookings.updateStatus(id, status);
      if (res.success) {
        toast.success(`Booking request marked as ${status}!`);
        fetchBookings();
      }
    } catch (err: any) {
      toast.error(err.message || `Failed to update status to ${status}.`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving booking requests..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-stone-900">Customer Booking Requests</h1>
        <p className="text-xs text-stone-500 mt-1">
          Review, accept, or reject incoming wedding reservation requests from engaged couples.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-xs max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold font-serif text-stone-900 mb-1">No Booking Inquiries Yet</h3>
          <p className="text-xs text-stone-500">
            When couples request to book your wedding services, their inquiries will appear here for your review.
          </p>
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
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {booking.customerId?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 text-sm">{booking.customerId?.name}</p>
                      <p className="text-xs text-stone-500">{booking.customerId?.email}</p>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
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
                      <span>{booking.status}</span>
                    </span>
                  </div>
                </div>

                {/* Service Details & Event Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <p className="font-bold text-stone-800 text-sm">
                      {booking.serviceId?.serviceName || 'Wedding Service'}
                    </p>
                    <p className="text-stone-500">
                      Category: <span className="font-medium text-stone-700">{booking.serviceId?.category}</span>
                    </p>
                    <p className="text-stone-500">
                      Package Price:{' '}
                      <span className="font-bold text-rose-600">
                        {formatCurrency(booking.serviceId?.price || 0)}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-2 bg-stone-50/80 p-3.5 rounded-2xl border border-stone-100">
                    <div className="flex items-center gap-2 text-stone-700">
                      <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Event Date: <strong>{booking.eventDate}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-700">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Location: <strong>{booking.eventLocation}</strong></span>
                    </div>
                    {booking.message && (
                      <div className="flex items-start gap-2 text-stone-600 pt-1 border-t border-stone-200/60 mt-1">
                        <MessageSquare className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                        <p className="italic">&ldquo;{booking.message}&rdquo;</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions: Accept or Reject (Only for Pending) */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100">
                  <span className="text-[11px] text-stone-400">
                    Request Received: {new Date(booking.createdAt).toLocaleDateString()}
                  </span>

                  {isPending ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleUpdateStatus(booking._id, 'Accepted')}
                        disabled={processingId === booking._id}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Accept Request</span>
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(booking._id, 'Rejected')}
                        disabled={processingId === booking._id}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white border border-stone-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject Request</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-stone-400 italic">
                      Status is finalized ({booking.status}).
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
