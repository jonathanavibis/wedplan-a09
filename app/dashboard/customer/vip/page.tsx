'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
  Crown,
  Sparkles,
  Headphones,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Tag,
  FileCheck,
  Calendar,
  MessageCircle,
  PhoneCall,
  Mail,
  ArrowRight,
} from 'lucide-react';

export default function CustomerVipPassPage() {
  const { user } = useAuth();
  const [upgrading, setUpgrading] = useState(false);
  const [callbackRequested, setCallbackRequested] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');

  const isVip = user?.subscriptionPlan === 'premium';

  const handleUpgradeToVip = async () => {
    setUpgrading(true);
    try {
      const data = await api.transactions.createCheckoutSession();
      if (data.success && data.url) {
        toast.success('Redirecting to secure Stripe Checkout...');
        window.location.href = data.url;
      } else {
        toast.error(data.message || 'Could not initiate checkout session.');
        setUpgrading(false);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to initialize Stripe checkout.');
      setUpgrading(false);
    }
  };

  const handleRequestCallback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput) {
      toast.error('Please enter your phone number.');
      return;
    }
    setCallbackRequested(true);
    toast.success('💍 VIP Concierge call scheduled! An expert planner will call you within 15 minutes.');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-2">
            <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            <span>Bride & Groom Luxury Experience</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">VIP Concierge & Premium Support</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Experience stress-free wedding planning with dedicated personal planners, priority booking queues, and luxury vendor perks.
          </p>
        </div>

        {isVip && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-2xl shadow-sm text-xs font-bold self-start md:self-center">
            <Sparkles className="w-4 h-4 fill-white" />
            <span>VIP Active Member</span>
          </div>
        )}
      </div>

      {/* Main Status & Plan Showcase */}
      {isVip ? (
        /* ==================== ACTIVE VIP MEMBER DASHBOARD ==================== */
        <div className="bg-gradient-to-br from-amber-50 via-white to-rose-50/40 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/60 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md">
                <Crown className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
                  <span>VIP Concierge Pass Active</span>
                  <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Active
                  </span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Member since activation &bull; Renewal date:{' '}
                  <span className="font-semibold text-stone-700">
                    {user?.subscriptionExpiresAt ? formatDate(user.subscriptionExpiresAt) : '1 Year Access'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-900 bg-amber-100/90 font-bold px-3 py-1.5 rounded-xl border border-amber-200">
                24/7 Dedicated Support
              </span>
            </div>
          </div>

          {/* Concierge Hotline Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Headphones className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">Direct VIP Planner</h3>
              <p className="text-xs text-stone-500">Your designated senior planner is Sarah Jenkins.</p>
              <a
                href="mailto:concierge@wedplan.luxury"
                className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700"
              >
                <span>Email Concierge</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <PhoneCall className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">Priority Hotline</h3>
              <p className="text-xs text-stone-500">Immediate telephone assistance for booking urgencies.</p>
              <span className="text-xs font-mono font-bold text-stone-800">+1 (800) WED-LUXE</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">Fast-Track Responses</h3>
              <p className="text-xs text-stone-500">Vendor responses guaranteed within 4 business hours.</p>
              <span className="text-xs font-bold text-emerald-700">Priority Dispatch Active</span>
            </div>
          </div>

          {/* Request Instant Concierge Call Form */}
          <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-2xs">
            <h3 className="text-sm font-bold text-stone-900 mb-1 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-amber-600" />
              <span>Need help right now? Request an Instant Planner Callback</span>
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Enter your contact number and our VIP wedding planner team will contact you to assist with vendor recommendations or date scheduling.
            </p>

            {callbackRequested ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Request received! An expert planner will call {phoneInput} shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleRequestCallback} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="tel"
                  placeholder="Enter your phone number (e.g. +1 555-0199)"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition"
                >
                  Request Callback
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* ==================== VIP PLAN UPGRADE CARD ==================== */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan Pricing & Purchase Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-amber-50/70 via-white to-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-white text-[11px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider shadow-xs">
              Couple Exclusive
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-amber-500 fill-amber-500" />
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  WedPlan VIP Concierge Pass
                </h2>
              </div>
              <p className="text-xs text-stone-600 max-w-xl leading-relaxed">
                Enjoy red-carpet planning treatment. From vendor negotiations and schedule coordination to emergency support on your big day, our certified planners are at your service.
              </p>
            </div>

            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-4xl font-serif font-bold text-stone-900">$29</span>
              <span className="text-xs text-stone-500 font-medium">/ full year access (one-time fee)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700 pt-2 border-t border-amber-100">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>24/7 Dedicated Concierge:</strong> Chat or call with licensed wedding planners anytime.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Priority Booking:</strong> Requests pushed to the front of vendor queues with VIP badge.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Contract & Quote Review:</strong> We verify quotes so you never pay hidden fees.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>15% Partner Discounts:</strong> Exclusive coupons on venues, photographers, and dresses.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Custom Master Checklist:</strong> Tailored budget projection and planning timeline.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Money-Back Guarantee:</strong> 100% satisfaction guarantee within 14 days.
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleUpgradeToVip}
                disabled={upgrading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-amber-200 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>{upgrading ? 'Connecting to Stripe...' : 'Upgrade to VIP ($29 USD)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Encrypted 256-bit Stripe Checkout</span>
              </div>
            </div>
          </div>

          {/* Standard Free Experience Comparison */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-stone-500 tracking-wider">Standard Couple</span>
                <span className="text-[11px] font-bold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full">
                  Current
                </span>
              </div>

              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">Free Tier</h3>
                <p className="text-2xl font-bold text-stone-900 mt-1">$0</p>
              </div>

              <ul className="space-y-3 text-xs text-stone-500 border-t border-stone-100 pt-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-stone-400" />
                  <span>Standard search & browse</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-stone-400" />
                  <span>Standard booking queue</span>
                </li>
                <li className="flex items-center gap-2 text-stone-400 line-through">
                  <span>24/7 Concierge Hotline</span>
                </li>
                <li className="flex items-center gap-2 text-stone-400 line-through">
                  <span>Contract & Quote Review</span>
                </li>
                <li className="flex items-center gap-2 text-stone-400 line-through">
                  <span>Exclusive VIP Partner Discounts</span>
                </li>
              </ul>
            </div>

            <p className="text-[11px] text-stone-400 text-center">
              Upgrade anytime when you are ready to book vendors.
            </p>
          </div>
        </div>
      )}

      {/* Feature Breakdown Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-stone-900">Why Couples Choose VIP Concierge</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">24/7 Dedicated Support</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Have a question about a vendor or contract at midnight? Your VIP concierge team is on standby around the clock.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Priority Vendor Response</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Top wedding vendors receive dozens of inquiries daily. Your requests carry a glowing VIP Badge and priority notification.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Exclusive Luxury Discounts</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Unlock negotiated rates and VIP perks, saving an average of $650 across venue, photography, and catering packages.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Contract & Dispute Shield</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Never sign blind. We review vendor terms and cancellation clauses before you place your deposit to protect your money.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Automated Planning Milestones</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Personalized checklist that schedules invitations, tastings, fittings, and rehearsal dates automatically.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Verified Couple Badge</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Show vendors that you are a serious, verified wedding couple, building instant trust and faster bookings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
