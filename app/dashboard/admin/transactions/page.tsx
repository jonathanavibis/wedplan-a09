'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  Receipt,
  CheckCircle,
  CreditCard,
  Building,
  DollarSign,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await api.transactions.getAdminAll();
        if (res.success) {
          setTransactions(res.transactions);
        }
      } catch (err) {
        console.error('Fetch admin transactions error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Auditing platform financial ledger..." />;
  }

  const totalVolume = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">Platform Financial Ledger</h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time audit log of Stripe Checkout Sessions, vendor subscriptions, and transactions.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            $
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Gross Volume</p>
            <p className="text-lg font-serif font-bold text-stone-900">{formatCurrency(totalVolume)}</p>
          </div>
        </div>
      </div>

      {/* Security Rule Notice */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-3 text-xs text-stone-600">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <p>
          <strong>Security Protocol:</strong> Payment records are immutable and verified through Stripe Webhooks.
          Admins cannot manually alter payment records to mark unsuccessful payments as successful.
        </p>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {transactions.length === 0 ? (
          <p className="text-stone-500 text-xs py-10 text-center">No platform transactions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-stone-700 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-4 px-6">Vendor / Studio</th>
                  <th className="py-4 px-4">Plan Subscribed</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4">Stripe Session ID</th>
                  <th className="py-4 px-4">Payment Status</th>
                  <th className="py-4 px-6 text-right">Transaction Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-rose-50/20 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                          <Building className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-stone-900 text-sm truncate">
                            {tx.vendorId?.businessName || tx.vendorId?.name || 'Vendor'}
                          </p>
                          <p className="text-[11px] text-stone-400 truncate">{tx.vendorId?.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-bold text-[11px] uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                        ★ {tx.plan}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-bold text-stone-900 text-sm">
                      {formatCurrency(tx.amount)}
                    </td>

                    <td className="py-4 px-4 font-mono text-[11px] text-stone-400 truncate max-w-[180px]">
                      {tx.stripeSessionId || 'N/A'}
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-bold">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="capitalize">{tx.status}</span>
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right text-stone-500">
                      {formatDate(tx.createdAt)}
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
