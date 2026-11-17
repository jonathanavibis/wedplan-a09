'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard, { ServiceItem } from '@/components/ServiceCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import {
  Camera,
  Castle,
  Flower2,
  UtensilsCrossed,
  Sparkles,
  Shirt,
  ShieldCheck,
  CalendarCheck2,
  BadgeCheck,
  Star,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
} from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Photography & Videography',
    icon: Camera,
    count: 'Cinematic Memories',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    color: 'from-pink-500/80 to-rose-600/80',
  },
  {
    name: 'Wedding Venues',
    icon: Castle,
    count: 'Luxury Estates & Barns',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
    color: 'from-amber-500/80 to-rose-600/80',
  },
  {
    name: 'Decoration & Florist',
    icon: Flower2,
    count: 'Floral Installations',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
    color: 'from-emerald-500/80 to-teal-600/80',
  },
  {
    name: 'Catering Services',
    icon: UtensilsCrossed,
    count: 'Gourmet Banquets',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80',
    color: 'from-orange-500/80 to-amber-600/80',
  },
  {
    name: 'Makeup & Styling',
    icon: Sparkles,
    count: 'Bridal Glamour',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
    color: 'from-purple-500/80 to-pink-600/80',
  },
  {
    name: 'Wedding Fashion',
    icon: Shirt,
    count: 'Couture Gowns & Suits',
    image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=600&q=80',
    color: 'from-rose-500/80 to-stone-700/80',
  },
];

export default function HomePage() {
  const [featuredServices, setFeaturedServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await api.services.getFeatured();
        if (data.success && data.services) {
          setFeaturedServices(data.services);
        }
      } catch (err) {
        console.error('Failed to load featured services:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* ==================== HERO BANNER SECTION ==================== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/80 via-white to-white py-20 lg:py-28">
          {/* Subtle wedding decorative circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-amber-100/50 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headline and CTA */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-7 space-y-6 text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 bg-rose-100/80 text-rose-700 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                  <span>The All-In-One Wedding Planning Ecosystem</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-stone-900 tracking-tight leading-[1.15]">
                  Your Dream Wedding,{' '}
                  <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">
                    Beautifully Planned
                  </span>{' '}
                  & Perfectly Executed.
                </h1>

                <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                  Discover, compare, and book verified wedding venues, photographers, florists, and stylists.
                  Connect directly with top wedding vendors and bring your fairytale celebration to life.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link
                    href="/services"
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold text-base shadow-lg shadow-rose-200 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <span>Explore Wedding Services</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/register?role=Vendor"
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-semibold text-base shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <span>Join as a Vendor</span>
                  </Link>
                </div>

                {/* Trust Metrics */}
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-rose-100 max-w-md mx-auto lg:mx-0">
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">500+</p>
                    <p className="text-xs text-stone-500 font-medium">Curated Vendors</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold font-serif text-rose-600">10k+</p>
                    <p className="text-xs text-stone-500 font-medium">Happy Couples</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold font-serif text-amber-600">99.8%</p>
                    <p className="text-xs text-stone-500 font-medium">Satisfaction Rate</p>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Hero Collage */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="lg:col-span-5 relative"
              >
                <div className="relative mx-auto max-w-md">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                    <img
                      src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
                      alt="Dream Wedding Ceremony"
                      className="w-full h-[450px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-sm font-semibold">“WedPlan made finding our dream venue seamless and stress-free!”</p>
                      <p className="text-xs text-rose-200 mt-0.5">— Sophia & Alexander, Married 2026</p>
                    </div>
                  </div>

                  {/* Floating card */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-rose-100 flex items-center gap-3.5 hidden sm:flex"
                  >
                    <div className="w-12 h-12 rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-200">
                      <HeartHandshake className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 font-medium">Verified Bookings</p>
                      <p className="text-sm font-bold text-stone-900">Direct Vendor Messaging</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ==================== DYNAMIC SECTION 1: FEATURED SERVICES ==================== */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                  Handpicked For You
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-2">
                  Featured Wedding Services
                </h2>
                <p className="text-stone-600 text-sm mt-1">
                  Discover top-rated, approved wedding professionals ready to elevate your special day.
                </p>
              </div>

              <Link
                href="/services"
                className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700 transition"
              >
                <span>Browse All Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <LoadingSpinner text="Loading featured wedding services..." />
            ) : featuredServices.length === 0 ? (
              <div className="text-center py-16 bg-rose-50/40 rounded-3xl border border-rose-100 p-8">
                <Sparkles className="w-10 h-10 text-rose-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-stone-800">No Featured Services Yet</h3>
                <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
                  Services will appear here once approved by our editorial team.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredServices.slice(0, 8).map((service, index) => (
                  <motion.div
                    key={service._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ServiceCard service={service} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ==================== DYNAMIC SECTION 2: SERVICE CATEGORIES ==================== */}
        <section className="py-20 bg-stone-50/70 border-y border-stone-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-100/70 px-3 py-1 rounded-full">
                Everything You Need
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-2">
                Explore Wedding Categories
              </h2>
              <p className="text-stone-600 text-sm mt-2">
                Filter and browse through our six core wedding planning specialties.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {CATEGORIES.map((cat, idx) => {
                const IconComponent = cat.icon;
                return (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.06 }}
                  >
                    <Link
                      href={`/services?category=${encodeURIComponent(cat.name)}`}
                      className="group relative h-56 rounded-3xl overflow-hidden block shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-900/40 to-transparent" />

                      <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                        <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 group-hover:bg-rose-500 transition-colors">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-serif font-bold group-hover:text-rose-200 transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-stone-300 mt-0.5">{cat.count}</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== ADDITIONAL SECTION: WHY CHOOSE WEDPLAN? ==================== */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                The WedPlan Difference
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-2">
                Why Couples & Vendors Choose WedPlan
              </h2>
              <p className="text-stone-600 text-sm mt-2">
                We combine industry-leading security with an intuitive, stress-free planning experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-rose-50/50 border border-rose-100 hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center mb-5 shadow-md shadow-rose-200">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-serif text-stone-900 mb-2">
                  100% Verified Vendors
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Every vendor undergoes manual admin review and portfolio verification before any listing is published to customers.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-amber-50/50 border border-amber-100 hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-5 shadow-md shadow-amber-200">
                  <CalendarCheck2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-serif text-stone-900 mb-2">
                  Live Booking State-Machine
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Real-time booking requests, automated duplicate date checks, and instant vendor acceptance notifications ensure total peace of mind.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-emerald-50/50 border border-emerald-100 hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-5 shadow-md shadow-emerald-200">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-serif text-stone-900 mb-2">
                  Stripe Powered Security
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Bank-grade encryption, Stripe test checkout integration, and transparent pricing with no hidden surprises.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== ADDITIONAL SECTION: HOW WEDPLAN WORKS ==================== */}
        <section className="py-20 bg-stone-900 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950/60 border border-rose-800/60 px-3 py-1 rounded-full">
                Simple 3-Step Process
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">
                How WedPlan Works
              </h2>
              <p className="text-stone-400 text-sm mt-2">
                From finding your first florist to saying &quot;I do&quot;, we make the journey effortless.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
              <div className="p-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-rose-500 text-white font-serif font-bold text-xl flex items-center justify-center mx-auto shadow-lg shadow-rose-900/50">
                  1
                </div>
                <h3 className="text-xl font-bold text-white">Discover & Filter</h3>
                <p className="text-sm text-stone-400 leading-relaxed">
                  Search approved services by category, location, and budget. View high-resolution galleries and transparent pricing.
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-rose-500 text-white font-serif font-bold text-xl flex items-center justify-center mx-auto shadow-lg shadow-rose-900/50">
                  2
                </div>
                <h3 className="text-xl font-bold text-white">Request Booking</h3>
                <p className="text-sm text-stone-400 leading-relaxed">
                  Submit a booking request with your event date and location. Vendors review and accept your reservation directly.
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-rose-500 text-white font-serif font-bold text-xl flex items-center justify-center mx-auto shadow-lg shadow-rose-900/50">
                  3
                </div>
                <h3 className="text-xl font-bold text-white">Celebrate In Style</h3>
                <p className="text-sm text-stone-400 leading-relaxed">
                  Relax and enjoy every magical moment knowing your wedding day team is synchronized and confirmed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== ADDITIONAL SECTION: TESTIMONIALS ==================== */}
        <section className="py-20 bg-rose-50/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
                Real Couples, Real Magic
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-2">
                Customer Testimonials
              </h2>
              <p className="text-stone-600 text-sm mt-2">
                Read how WedPlan helped couples bring their dream weddings to life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-xs space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-stone-700 italic leading-relaxed">
                  &quot;Finding our photographer on WedPlan was the best decision we made. We browsed their portfolio,
                  sent a booking request, and had everything confirmed within 24 hours!&quot;
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt="Jessica & Daniel"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Jessica & Daniel</h4>
                    <p className="text-xs text-stone-500">Married in Manhattan, NY</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-xs space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-stone-700 italic leading-relaxed">
                  &quot;As a wedding florist, WedPlan completely transformed my business. The vendor dashboard is clear,
                  and upgrading to Premium gave me unlimited client inquiries!&quot;
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                    alt="Sarah Jenkins"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Sarah Jenkins</h4>
                    <p className="text-xs text-stone-500">Rosewood Studios (Vendor)</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-xs space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-stone-700 italic leading-relaxed">
                  &quot;The Glasshouse Chateau venue we booked was breathtaking. The price transparency and instant booking
                  tracking gave us total confidence.&quot;
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                    alt="Marcus & Chloe"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Marcus & Chloe</h4>
                    <p className="text-xs text-stone-500">Married in Hudson Valley, NY</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== CTA BANNER ==================== */}
        <section className="py-16 bg-gradient-to-r from-rose-600 to-rose-700 text-white">
          <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold">
              Ready to Plan Your Perfect Wedding?
            </h2>
            <p className="text-rose-100 text-base max-w-xl mx-auto">
              Join thousands of happy couples and verified wedding professionals on WedPlan today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/services"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-rose-600 font-bold hover:bg-stone-50 shadow-lg transition transform hover:-translate-y-0.5"
              >
                Start Browsing
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-rose-800/80 hover:bg-rose-800 text-white font-semibold border border-rose-400/40 transition"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
