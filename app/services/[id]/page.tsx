'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
  MapPin,
  Tag,
  Sparkles,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Heart,
  ChevronLeft,
  Share2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Requirement: Private Route - Service Details redirects to Sign In if unauthenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Please sign in to view wedding service details.');
      router.replace(`/login?redirect=/services/${id}`);
    }
  }, [authLoading, isAuthenticated, id, router]);

  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [message, setMessage] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    async function loadService() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.services.getById(id);
        if (data.success && data.service) {
          setService(data.service);
        } else {
          setError(data.message || 'Service not found.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load wedding service details.');
      } finally {
        setLoading(false);
      }
    }
    loadService();
  }, [id]);

  const handleOpenBooking = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to submit a booking request.');
      router.push(`/login?redirect=/services/${id}`);
      return;
    }

    if (user?.role === 'Admin') {
      toast.error('Administrators cannot submit customer booking requests.');
      return;
    }

    if (user?._id === service?.vendorId?._id) {
      toast.error('You cannot book your own wedding service.');
      return;
    }

    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventDate || !eventLocation) {
      toast.error('Please specify both an event date and event location.');
      return;
    }

    setBookingSubmitting(true);
    try {
      const data = await api.bookings.create({
        serviceId: service._id,
        eventDate,
        eventLocation,
        message,
      });

      if (data.success) {
        toast.success('Booking request sent to vendor successfully! 💍');
        setShowBookingModal(false);
        router.push('/dashboard/customer');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit booking request.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner text="Retrieving wedding service portfolio..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500 mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Service Not Available</h2>
          <p className="text-stone-600 text-sm mb-6">{error || 'This service listing could not be found.'}</p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 text-white font-semibold text-sm hover:bg-rose-700 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Browse Services</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const images = service.images && service.images.length > 0 ? service.images : ['/placeholder.jpg'];
  const vendor = service.vendorId;
  const isPremiumVendor = vendor?.subscriptionPlan === 'premium';

  return (
    <div className="flex flex-col min-h-screen bg-[#fffbf9]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-rose-600 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Services</span>
          </Link>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>

        {/* ==================== GALLERY & OVERVIEW ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Featured Image */}
            <div className="relative h-[380px] sm:h-[480px] w-full rounded-3xl overflow-hidden shadow-md bg-stone-100">
              <img
                src={images[activeImageIndex]}
                alt={service.serviceName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-stone-800 shadow-sm flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-rose-500" />
                <span>{service.category}</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition ${
                      activeImageIndex === idx ? 'border-rose-500 scale-105' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Key Details & Booking Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-6">
              {/* Category & Status */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                  {service.category}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Approved & Available</span>
                </span>
              </div>

              {/* Title & Location */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-stone-900 leading-tight">
                  {service.serviceName}
                </h1>
                <div className="flex items-center text-sm text-stone-500 gap-1.5 mt-2">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{service.location}</span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase font-semibold text-rose-800">Starting Price</span>
                  <div className="text-3xl font-serif font-bold text-stone-900">
                    {formatCurrency(service.price)}
                  </div>
                </div>
                <span className="text-xs text-stone-500">Per Event Package</span>
              </div>

              {/* Booking CTA Button */}
              <button
                onClick={handleOpenBooking}
                className="w-full py-4 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-base shadow-lg shadow-rose-200 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Request Booking Now</span>
              </button>

              {/* Trust Callout */}
              <div className="pt-2 border-t border-stone-100 space-y-2 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Verified vendor with background check</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Guaranteed response within 48 business hours</span>
                </div>
              </div>
            </div>

            {/* Vendor Profile Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex items-center gap-4">
              {vendor?.image ? (
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-rose-100"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl">
                  {vendor?.name?.charAt(0) || 'V'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-stone-900 text-base truncate">
                    {vendor?.businessName || vendor?.name}
                  </h4>
                  {isPremiumVendor && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      ★ Premium
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 truncate">{vendor?.name} (Host)</p>
                <p className="text-xs text-rose-600 font-medium mt-1">WedPlan Certified Professional</p>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== DESCRIPTION & SPECIFICATIONS ==================== */}
        <div className="bg-white rounded-3xl p-8 border border-stone-200/70 shadow-xs mb-16 space-y-6">
          <h2 className="text-2xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-4">
            Service Description & Inclusions
          </h2>
          <div className="prose prose-rose max-w-none text-stone-700 text-base leading-relaxed whitespace-pre-line">
            {service.description}
          </div>
        </div>
      </main>

      {/* ==================== BOOKING MODAL ==================== */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-rose-100 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">Request Wedding Booking</h3>
                <p className="text-xs text-stone-500 mt-0.5">{service.serviceName}</p>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Event Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Event Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              {/* Event Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Event Location <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brooklyn Botanic Garden, Brooklyn, NY"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              {/* Message to Vendor */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Message / Special Requests (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell the vendor about your wedding theme, guest count, or specific requests..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-3 rounded-full border border-stone-200 text-stone-700 font-semibold text-sm hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingSubmitting}
                  className="flex-1 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md shadow-rose-200 transition disabled:opacity-50"
                >
                  {bookingSubmitting ? 'Sending Request...' : 'Confirm Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
