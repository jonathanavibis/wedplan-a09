'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Receipt,
  ArrowRight,
  Crown,
  Layers,
  Zap,
} from 'lucide-react';

export default function VendorSubscriptionPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await api.transactions.getVendorTransactions();
        if (res.success) {
          setTransactions(res.transactions);
        }
      } catch (err) {
        console.error('Fetch vendor transactions error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  const handleUpgrade = async (plan: 'premium' | 'vip') => {
    setUpgradingPlan(plan);
    try {
      const data = await api.transactions.createCheckoutSession({ plan });
      if (data.success && data.url) {
        toast.success(`Redirecting to Stripe Checkout for ${plan.toUpperCase()}...`);
        window.location.href = data.url;
      } else {
        toast.error(data.message || 'Failed to start checkout session.');
        setUpgradingPlan(null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to initialize Stripe checkout session.');
      setUpgradingPlan(null);
    }
  };

  const currentPlan = (user?.subscriptionPlan || 'starter').toLowerCase();
  const isVip = currentPlan === 'vip';
  const isPremium = currentPlan === 'premium';
  const isStarter = !isPremium && !isVip;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
          Subscription & Vendor Memberships
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Select the optimal plan to scale your wedding business with increased visibility and unlimited listings.
        </p>
      </div>

      {/* 3-Tier Plan Comparison Cards */}
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
                Tier 1 &bull; Entry
              </span>
              {isStarter && (
                <span className="text-[10px] font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-full">
                  Current Active Plan
                </span>
              )}
            </div>

            <div>
              <h3 className="text-xl font-serif font-bold text-stone-900">Basic Starter</h3>
              <p className="text-3xl font-bold text-stone-900 mt-2">
                $0 <span className="text-xs font-normal text-stone-400">/ forever</span>
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Perfect for newly onboarded wedding vendors testing the platform.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-stone-600 pt-3 border-t border-stone-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Up to 3 active published services</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Standard vendor storefront profile</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Booking request notifications</span>
              </li>
              <li className="flex items-center gap-2 text-stone-400 line-through">
                <span>Featured homepage ranking</span>
              </li>
              <li className="flex items-center gap-2 text-stone-400 line-through">
                <span>Verified golden badge</span>
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
                Tier 2 &bull; Growth
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
                $49 <span className="text-xs font-normal text-stone-500">/ year</span>
              </p>
              <p className="text-xs text-stone-500 mt-1">
                The most popular choice for growing studios wanting maximum inquiries.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-stone-700 pt-3 border-t border-rose-100">
              <li className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                <span><strong>Unlimited</strong> active published services</span>
              </li>
              <li className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Featured placement in search & categories</span>
              </li>
              <li className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Verified Golden Vendor Badge</span>
              </li>
              <li className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Direct inquiry messaging queue</span>
              </li>
              <li className="flex items-center gap-2 text-stone-400 line-through">
                <span>#1 Sponsored category billboard</span>
              </li>
            </ul>
          </div>

          <div>
            {isPremium ? (
              <div className="w-full py-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs text-center flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>
                  Active {user?.subscriptionExpiresAt ? `(Renews ${formatDate(user.subscriptionExpiresAt)})` : ''}
                </span>
              </div>
            ) : (
              <button
                onClick={() => handleUpgrade('premium')}
                disabled={upgradingPlan !== null}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs shadow-md shadow-rose-200 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{upgradingPlan === 'premium' ? 'Connecting to Stripe...' : 'Upgrade to Premium ($49)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tier 3: VIP Elite */}
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
            <span>VIP Elite</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-black text-amber-700 tracking-wider">
                Tier 3 &bull; Luxury Partner
              </span>
              {isVip && (
                <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                  Active Subscription
                </span>
              )}
            </div>

            <div>
              <h3 className="text-xl font-serif font-bold text-stone-900">VIP Elite Partner</h3>
              <p className="text-3xl font-bold text-amber-600 mt-2">
                $99 <span className="text-xs font-normal text-stone-500">/ year</span>
              </p>
              <p className="text-xs text-stone-500 mt-1">
                For established luxury brands demanding the highest visibility.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-stone-700 pt-3 border-t border-amber-100">
              <li className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span><strong>All Premium perks</strong> included</span>
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <Crown className="w-4 h-4 text-amber-600 shrink-0" />
                <span><strong>#1 Sponsored placement</strong> on category pages</span>
              </li>
              <li className="flex items-center gap-2 font-medium">
                <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Dedicated 24/7 Account Manager & Priority Tech</span>
              </li>
              <li className="flex items-center gap-2 font-medium">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Custom luxury branding banner on listings</span>
              </li>
              <li className="flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>0% booking fee & direct client phone connect</span>
              </li>
            </ul>
          </div>

          <div>
            {isVip ? (
              <div className="w-full py-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs text-center flex items-center justify-center gap-2">
                <Crown className="w-4 h-4" />
                <span>
                  VIP Active {user?.subscriptionExpiresAt ? `(Renews ${formatDate(user.subscriptionExpiresAt)})` : ''}
                </span>
              </div>
            ) : (
              <button
                onClick={() => handleUpgrade('vip')}
                disabled={upgradingPlan !== null}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-amber-200 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{upgradingPlan === 'vip' ? 'Connecting to Stripe...' : 'Upgrade to VIP Elite ($99)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payment Security Assurance */}
      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 flex items-center gap-3 text-xs text-stone-600">
        <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
        <p>
          Transactions are securely processed through Stripe Checkout Test Mode. Webhooks and server-side verification
          guarantee that Premium or VIP Elite status is immediately activated on your vendor profile.
        </p>
      </div>

      {/* Transaction History Ledger */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900">Transaction History</h2>
            <p className="text-xs text-stone-500">Your billing statements and payment receipts</p>
          </div>
          <Receipt className="w-5 h-5 text-stone-400" />
        </div>

        {transactions.length === 0 ? (
          <p className="text-stone-500 text-xs py-4 text-center">No payment transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-stone-700 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Stripe Session ID</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td className="py-3 px-4">{formatDate(tx.createdAt)}</td>
                    <td className="py-3 px-4 font-bold uppercase">{tx.plan}</td>
                    <td className="py-3 px-4 font-bold text-stone-900">{formatCurrency(tx.amount)}</td>
                    <td className="py-3 px-4 font-mono text-[10px] text-stone-400 truncate max-w-[160px]">
                      {tx.stripeSessionId}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
