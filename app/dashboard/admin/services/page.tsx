'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  Layers,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Photography & Videography',
  'Wedding Venues',
  'Decoration & Florist',
  'Catering Services',
  'Makeup & Styling',
  'Wedding Fashion',
];

export default function AdminManageServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      const params: Record<string, any> = {};
      if (searchTerm) params.search = searchTerm;
      if (categoryFilter && categoryFilter !== 'All') params.category = categoryFilter;
      if (statusFilter && statusFilter !== 'All') params.status = statusFilter;

      const data = await api.services.getAdminAll(params);
      if (data.success) {
        setServices(data.services);
      }
    } catch (err) {
      console.error('Fetch admin services error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [categoryFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices();
  };

  const handleUpdateStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    setActionLoadingId(id);
    try {
      const res = await api.services.updateStatusAdmin(id, { status });
      if (res.success) {
        toast.success(`Service status updated to ${status}!`);
        fetchServices();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update service status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteService = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return;
    }

    setActionLoadingId(id);
    try {
      const res = await api.services.delete(id);
      if (res.success) {
        toast.success('Service removed from platform.');
        fetchServices();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete service.');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving all vendor service submissions..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-stone-900">Manage Wedding Services</h1>
        <p className="text-xs text-stone-500 mt-1">
          Review pending submissions, approve high-quality listings, reject non-compliant packages, or moderate catalog entries.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-stone-200 text-xs focus:outline-hidden focus:border-rose-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-semibold">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 focus:outline-hidden"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Services List Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 text-stone-700 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-4 px-6">Service Package</th>
                <th className="py-4 px-4">Vendor</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Location</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {services.map((item) => (
                <tr key={item._id} className="hover:bg-rose-50/20 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.images?.[0] || '/placeholder.jpg'}
                        alt={item.serviceName}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 ring-1 ring-stone-200"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-stone-900 text-sm truncate max-w-xs">{item.serviceName}</p>
                        <p className="text-[11px] text-stone-400">Created: {formatDate(item.createdAt)}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-medium text-stone-800">
                    <p className="font-semibold">{item.vendorId?.businessName || item.vendorId?.name || 'Vendor'}</p>
                    <p className="text-[10px] text-stone-400">{item.vendorId?.email}</p>
                  </td>

                  <td className="py-4 px-4">{item.category}</td>
                  <td className="py-4 px-4 font-bold text-stone-900">{formatCurrency(item.price)}</td>
                  <td className="py-4 px-4 truncate max-w-[120px]">{item.location}</td>

                  <td className="py-4 px-4">
                    {item.status === 'Approved' ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-bold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approved</span>
                      </span>
                    ) : item.status === 'Pending' ? (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-[11px] font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full text-[11px] font-bold">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Rejected</span>
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/services/${item._id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {item.status !== 'Approved' && (
                        <button
                          onClick={() => handleUpdateStatus(item._id, 'Approved')}
                          disabled={actionLoadingId === item._id}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-2xs"
                        >
                          Approve
                        </button>
                      )}

                      {item.status !== 'Rejected' && (
                        <button
                          onClick={() => handleUpdateStatus(item._id, 'Rejected')}
                          disabled={actionLoadingId === item._id}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition"
                        >
                          Reject
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteService(item._id, item.serviceName)}
                        disabled={actionLoadingId === item._id}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Inappropriate Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
