'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  CreditCard,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Receipt,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function VendorSubscriptionPage() {
  const { user, refreshUser } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

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

  const handleUpgradeToPremium = async () => {
    setUpgrading(true);
    try {
      const data = await api.transactions.createCheckoutSession();
      if (data.success && data.url) {
        toast.success('Redirecting to Stripe Checkout...');
        window.location.href = data.url;
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to initialize Stripe checkout session.');
      setUpgrading(false);
    }
  };

  const isPremium = user?.subscriptionPlan === 'premium';

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-serif font-bold text-stone-900">Subscription & Membership</h1>
        <p className="text-xs text-stone-500 mt-1">
          Scale your wedding business with unlimited service listings and premium marketplace exposure.
        </p>
      </div>

      {/* Plan Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Plan Card */}
        <div
          className={`bg-white rounded-3xl p-8 border ${
            !isPremium ? 'border-stone-400 ring-2 ring-stone-200' : 'border-stone-200'
          } shadow-xs space-y-6 flex flex-col justify-between`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-stone-500 tracking-wider">Standard</span>
              {!isPremium && (
                <span className="text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-full">
                  Current Plan
                </span>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-serif font-bold text-stone-900">Free Tier</h3>
              <p className="text-3xl font-bold text-stone-900 mt-2">
                $0 <span className="text-xs font-normal text-stone-500">/ forever</span>
              </p>
            </div>

            <ul className="space-y-3 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Maximum 3 active published services</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Basic vendor dashboard analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Standard booking request notifications</span>
              </li>
            </ul>
          </div>

          <button
            disabled
            className="w-full py-3 rounded-2xl border border-stone-200 text-stone-400 font-semibold text-xs cursor-not-allowed bg-stone-50"
          >
            Included by Default
          </button>
        </div>

        {/* Premium Plan Card */}
        <div
          className={`bg-gradient-to-b from-amber-50/50 via-white to-white rounded-3xl p-8 border-2 ${
            isPremium ? 'border-amber-400 ring-4 ring-amber-100' : 'border-rose-400 ring-2 ring-rose-100'
          } shadow-xl space-y-6 flex flex-col justify-between relative overflow-hidden`}
        >
          {/* Badge */}
          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3 fill-white" />
            <span>Recommended</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-amber-700 tracking-wider">Professional</span>
              {isPremium && (
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                  Active Subscription
                </span>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-serif font-bold text-stone-900">Premium Vendor</h3>
              <p className="text-3xl font-bold text-stone-900 mt-2">
                $49 <span className="text-xs font-normal text-stone-500">/ year (one-time test checkout)</span>
              </p>
            </div>

            <ul className="space-y-3 text-xs text-stone-700 pt-2 border-t border-rose-100">
              <li className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span><strong>Unlimited</strong> active wedding services published</span>
              </li>
              <li className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Featured placement on homepage & search top rankings</span>
              </li>
              <li className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Verified Golden Premium Vendor badge</span>
              </li>
              <li className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Priority direct messaging from couples</span>
              </li>
            </ul>
          </div>

          <div>
            {isPremium ? (
              <div className="w-full py-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs text-center flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>
                  Premium Active {user?.subscriptionExpiresAt ? `(Renews ${formatDate(user.subscriptionExpiresAt)})` : ''}
                </span>
              </div>
            ) : (
              <button
                onClick={handleUpgradeToPremium}
                disabled={upgrading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-200 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{upgrading ? 'Connecting to Stripe...' : 'Upgrade to Premium Now'}</span>
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
          guarantee that Premium access is immediately and accurately activated.
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
