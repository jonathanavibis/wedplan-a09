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
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);
  const [callbackRequested, setCallbackRequested] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('yearly');

  const currentPlan = (user?.subscriptionPlan || 'starter').toLowerCase();
  const isVip = currentPlan === 'vip';
  const isPremium = currentPlan === 'premium';
  const isStarter = !isVip && !isPremium;

  const handleUpgrade = async (plan: 'premium' | 'vip') => {
    setUpgradingPlan(plan);
    try {
      const data = await api.transactions.createCheckoutSession({ plan, interval: billingInterval });
      if (data.success && data.url) {
        toast.success(`Redirecting to secure Stripe Checkout for ${plan.toUpperCase()} (${billingInterval})...`);
        window.location.href = data.url;
      } else {
        toast.error(data.message || 'Could not initiate checkout session.');
        setUpgradingPlan(null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to initialize Stripe checkout.');
      setUpgradingPlan(null);
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
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-2">
            <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            <span>Bride & Groom Luxury Experience</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Subscription Plans & VIP Concierge
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Choose the perfect support tier for your dream wedding. Upgrade to get dedicated planners, priority booking queues, and exclusive partner perks.
          </p>
        </div>

        {(isVip || isPremium) && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-2xl shadow-sm text-xs font-bold self-start md:self-center">
            <Sparkles className="w-4 h-4 fill-white" />
            <span>{isVip ? 'VIP Concierge Member' : 'Premium Member'}</span>
          </div>
        )}
      </div>

      {/* If VIP Member: Show Active Concierge Dashboard */}
      {isVip && (
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
            <div className="p-4 rounded-2xl bg-white border border-amber-200/70 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                <PhoneCall className="w-4 h-4 text-amber-600" />
                <span>Dedicated Hotline</span>
              </div>
              <p className="text-xs text-stone-500">Direct VIP line to senior planners</p>
              <p className="text-sm font-mono font-bold text-amber-900">+1 (800) 933-PLAN</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-amber-200/70 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Instant Chat</span>
              </div>
              <p className="text-xs text-stone-500">Live planner messaging on WhatsApp</p>
              <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                Online &bull; Avg 2m response
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-amber-200/70 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                <Mail className="w-4 h-4 text-rose-600" />
                <span>Contract Audit Email</span>
              </div>
              <p className="text-xs text-stone-500">Send vendor quotes for verification</p>
              <p className="text-xs font-mono font-bold text-stone-700">vip-contracts@wedplan.com</p>
            </div>
          </div>

          {/* Request Instant Callback */}
          <div className="p-5 rounded-2xl bg-amber-100/50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Request Immediate Phone Call
              </h4>
              <p className="text-xs text-amber-800">
                Need urgent advice on venue or budget? Have a planner call you in 15 minutes.
              </p>
            </div>

            {callbackRequested ? (
              <div className="flex items-center gap-2 text-emerald-800 bg-emerald-100 px-4 py-2 rounded-xl text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Call scheduled! Expect a ring shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleRequestCallback} className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-amber-300 text-xs bg-white text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow-xs whitespace-nowrap cursor-pointer"
                >
                  Call Me
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 3-Tier Customer Pricing Comparison */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-serif font-bold text-stone-900">
            {isVip ? 'Compare Customer Membership Plans' : 'Choose Your Wedding Planning Plan'}
          </h2>

          {/* Monthly / Yearly Billing Toggle */}
          <div className="bg-stone-200/80 p-1.5 rounded-full inline-flex items-center gap-1.5 border border-stone-300/80 shadow-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setBillingInterval('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                billingInterval === 'monthly'
                  ? 'bg-rose-600 text-white shadow-md scale-102'
                  : 'text-stone-600 hover:text-stone-900 bg-transparent'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingInterval('yearly')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingInterval === 'yearly'
                  ? 'bg-rose-600 text-white shadow-md scale-102'
                  : 'text-stone-600 hover:text-stone-900 bg-transparent'
              }`}
            >
              <span>Yearly</span>
              <span
                className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                  billingInterval === 'yearly' ? 'bg-white text-rose-600 shadow-2xs' : 'bg-rose-100 text-rose-700'
                }`}
              >
                Save 50%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Tier 1: Basic Starter */}
          <div
            className={`bg-white rounded-3xl p-6 sm:p-7 border ${
              isStarter ? 'border-stone-400 ring-2 ring-stone-200' : 'border-stone-200'
            } shadow-xs space-y-6 flex flex-col justify-between`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-black text-stone-400 tracking-wider">
                  Tier 1 &bull; Explorer
                </span>
                {isStarter && (
                  <span className="text-[10px] font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-full">
                    Current Plan
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">Basic Starter</h3>
                <p className="text-3xl font-bold text-stone-900 mt-2">
                  $0 <span className="text-xs font-normal text-stone-400">/ forever</span>
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  For couples browsing vendors and exploring wedding inspiration.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-stone-600 pt-3 border-t border-stone-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Unlimited vendor search & portfolio browsing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Submit standard booking inquiries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Personal dashboard itinerary tracker</span>
                </li>
                <li className="flex items-center gap-2 text-stone-400 line-through">
                  <span>Priority booking response queue</span>
                </li>
                <li className="flex items-center gap-2 text-stone-400 line-through">
                  <span>24/7 Personal Concierge Planner</span>
                </li>
              </ul>
            </div>

            <button
              disabled
              className="w-full py-3 rounded-2xl border border-stone-200 text-stone-400 font-semibold text-xs cursor-not-allowed bg-stone-50 text-center"
            >
              {isStarter ? 'Active Default Plan' : 'Free Tier'}
            </button>
          </div>

          {/* Tier 2: Premium (Popular) */}
          <div
            className={`bg-gradient-to-b from-rose-50/40 via-white to-white rounded-3xl p-6 sm:p-7 border-2 ${
              isPremium
                ? 'border-rose-500 ring-4 ring-rose-100'
                : 'border-rose-300 hover:border-rose-400'
            } shadow-xl space-y-6 flex flex-col justify-between relative overflow-hidden`}
          >
            {/* Most Popular Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-rose-600 to-rose-700 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-white" />
              <span>Popular</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-black text-rose-600 tracking-wider">
                  Tier 2 &bull; Smart Couple
                </span>
                {isPremium && (
                  <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
                    Active Subscription
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">Premium (Popular)</h3>
                <p className="text-3xl font-bold text-rose-600 mt-2">
                  {billingInterval === 'monthly' ? '$5' : '$29'}
                  <span className="text-xs font-normal text-stone-500">
                    {billingInterval === 'monthly' ? ' / month' : ' / year'}
                  </span>
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  {billingInterval === 'monthly'
                    ? 'Billed monthly ($60/yr)'
                    : 'Only $2.42/mo (Save 50% vs monthly)'}
                </p>

                {/* Inline Billing Switcher on Customer Premium Card */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-xl mt-3 border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setBillingInterval('monthly')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      billingInterval === 'monthly'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Monthly ($5)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingInterval('yearly')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      billingInterval === 'yearly'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Yearly ($29)
                  </button>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-stone-700 pt-3 border-t border-rose-100">
                <li className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                  <span><strong>Priority Booking Queue</strong> (front of vendor inbox)</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Personalized Wedding Budget & Timeline Planner</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Verified Couple Badge for instant vendor trust</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Exclusive Partner Discounts (Save up to $500)</span>
                </li>
                <li className="flex items-center gap-2 text-stone-400 line-through">
                  <span>24/7 Dedicated Hotline & Phone Calls</span>
                </li>
              </ul>
            </div>

            <div>
              {isPremium ? (
                <div className="w-full py-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs text-center flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Active Premium Pass</span>
                </div>
              ) : (
                <button
                  onClick={() => handleUpgrade('premium')}
                  disabled={upgradingPlan !== null}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs shadow-md shadow-rose-200 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <span>
                    {upgradingPlan === 'premium'
                      ? 'Connecting to Stripe...'
                      : `Upgrade to Premium (${billingInterval === 'monthly' ? '$5/mo' : '$29/yr'})`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Tier 3: VIP Concierge */}
          <div
            className={`bg-gradient-to-b from-amber-50/60 via-white to-white rounded-3xl p-6 sm:p-7 border-2 ${
              isVip
                ? 'border-amber-400 ring-4 ring-amber-100'
                : 'border-amber-300 hover:border-amber-400'
            } shadow-xl space-y-6 flex flex-col justify-between relative overflow-hidden`}
          >
            {/* VIP Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
              <Crown className="w-3 h-3 fill-white" />
              <span>VIP Concierge</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-black text-amber-700 tracking-wider">
                  Tier 3 &bull; Red Carpet
                </span>
                {isVip && (
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                    Active Subscription
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">VIP Concierge</h3>
                <p className="text-3xl font-bold text-amber-600 mt-2">
                  {billingInterval === 'monthly' ? '$12' : '$79'}
                  <span className="text-xs font-normal text-stone-500">
                    {billingInterval === 'monthly' ? ' / month' : ' / year'}
                  </span>
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  {billingInterval === 'monthly'
                    ? 'Billed monthly ($144/yr)'
                    : 'Only $6.58/mo (Save over 45% vs monthly)'}
                </p>

                {/* Inline Billing Switcher on Customer VIP Card */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-xl mt-3 border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setBillingInterval('monthly')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      billingInterval === 'monthly'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Monthly ($12)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingInterval('yearly')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      billingInterval === 'yearly'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Yearly ($79)
                  </button>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-stone-700 pt-3 border-t border-amber-100">
                <li className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>All Premium perks</strong> included</span>
                </li>
                <li className="flex items-center gap-2 font-semibold">
                  <Headphones className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>24/7 Personal Planner Hotline</strong> (Phone & WhatsApp)</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <FileCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Contract & Quote Review before you pay deposits</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Emergency Vendor Backup Guarantee</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Crown className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Gold VIP Badge + 15% luxury partner discounts</span>
                </li>
              </ul>
            </div>

            <div>
              {isVip ? (
                <div className="w-full py-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs text-center flex items-center justify-center gap-2">
                  <Crown className="w-4 h-4" />
                  <span>Active VIP Concierge Pass</span>
                </div>
              ) : (
                <button
                  onClick={() => handleUpgrade('vip')}
                  disabled={upgradingPlan !== null}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-amber-200 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <span>
                    {upgradingPlan === 'vip'
                      ? 'Connecting to Stripe...'
                      : `Upgrade to VIP Concierge (${billingInterval === 'monthly' ? '$12/mo' : '$79/yr'})`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Breakdown Grid */}
      <div className="space-y-4 pt-4 border-t border-stone-100">
        <h2 className="text-xl font-serif font-bold text-stone-900">Why Couples Choose WedPlan Subscriptions</h2>

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
              Top wedding vendors receive dozens of inquiries daily. Your requests carry a glowing badge and priority notification.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Exclusive Luxury Discounts</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Unlock negotiated rates and perks, saving an average of $650 across venue, photography, and catering packages.
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
