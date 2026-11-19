'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  Layers,
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
} from 'lucide-react';

export default function VendorMyServicesPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingService, setEditingService] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    serviceName: '',
    category: '',
    price: '',
    location: '',
    description: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchVendorServices = async () => {
    try {
      const data = await api.services.getVendorServices();
      if (data.success) {
        setServices(data.services);
      }
    } catch (err) {
      console.error('Fetch vendor services error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorServices();
  }, []);

  const handleToggleActive = async (service: any) => {
    try {
      const updatedStatus = !service.isActive;
      const res = await api.services.update(service._id, { isActive: updatedStatus });
      if (res.success) {
        toast.success(`Service listing is now ${updatedStatus ? 'Active' : 'Inactive'}.`);
        fetchVendorServices();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update service availability.');
    }
  };

  const handleDeleteService = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await api.services.delete(id);
      if (res.success) {
        toast.success('Service deleted successfully.');
        setServices(services.filter((s) => s._id !== id));
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete service.');
    }
  };

  const handleOpenEdit = (service: any) => {
    setEditingService(service);
    setEditForm({
      serviceName: service.serviceName,
      category: service.category,
      price: String(service.price),
      location: service.location,
      description: service.description,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setSavingEdit(true);
    try {
      const res = await api.services.update(editingService._id, {
        serviceName: editForm.serviceName,
        category: editForm.category,
        price: Number(editForm.price),
        location: editForm.location,
        description: editForm.description,
      });

      if (res.success) {
        toast.success('Service updated successfully!');
        setEditingService(null);
        fetchVendorServices();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save changes.');
    } finally {
      setSavingEdit(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving your wedding listings..." />;
  }

  const isPremium = user?.subscriptionPlan === 'premium';
  const activeCount = services.filter((s) => s.isActive).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">My Wedding Services</h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your published packages, pricing, availability, and review statuses.
          </p>
        </div>

        <Link
          href="/dashboard/vendor/add-service"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Service</span>
        </Link>
      </div>

      {/* Free Plan Alert Banner */}
      {!isPremium && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-900">
              <span className="font-bold">Free Plan Limit:</span> You are currently using{' '}
              <span className="font-bold">{activeCount} / 3</span> active services. Upgrade to Premium for unlimited
              listings!
            </p>
          </div>
          <Link
            href="/dashboard/vendor/subscription"
            className="text-xs font-bold text-amber-800 hover:underline shrink-0"
          >
            Upgrade →
          </Link>
        </div>
      )}

      {/* Services Table / Cards */}
      {services.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-xs max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold font-serif text-stone-900 mb-1">No Services Published Yet</h3>
          <p className="text-xs text-stone-500 mb-6">
            Get started by adding your first wedding service package for couples to discover.
          </p>
          <Link
            href="/dashboard/vendor/add-service"
            className="px-6 py-2.5 rounded-full bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 transition"
          >
            Create Your First Service
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-stone-700 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-4 px-6">Service</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Location</th>
                  <th className="py-4 px-4">Approval Status</th>
                  <th className="py-4 px-4">Active</th>
                  <th className="py-4 px-6 text-right">Actions</th>
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
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80';
                          }}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 ring-1 ring-stone-200"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-stone-900 text-sm truncate max-w-xs">{item.serviceName}</p>
                          <p className="text-[11px] text-stone-400">Created: {new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium">{item.category}</td>
                    <td className="py-4 px-4 font-bold text-stone-900">{formatCurrency(item.price)}</td>
                    <td className="py-4 px-4 truncate max-w-[120px]">{item.location}</td>
                    <td className="py-4 px-4">
                      {item.status === 'Approved' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-bold">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Approved</span>
                        </span>
                      ) : item.status === 'Pending' ? (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-[11px] font-bold">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Pending Review</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full text-[11px] font-bold">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Rejected</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleActive(item)}
                        title={item.isActive ? 'Active (Click to disable)' : 'Inactive (Click to activate)'}
                        className="flex items-center gap-1 font-semibold text-xs transition"
                      >
                        {item.isActive ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <ToggleRight className="w-6 h-6" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="text-stone-400 flex items-center gap-1">
                            <ToggleLeft className="w-6 h-6" />
                            <span>Hidden</span>
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.status === 'Approved' && (
                          <Link
                            href={`/services/${item._id}`}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition"
                            title="View Public Page"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="Edit Service"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(item._id, item.serviceName)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Service"
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
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-rose-100 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-serif font-bold text-stone-900">Update Service Details</h3>
              <button onClick={() => setEditingService(null)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={editForm.serviceName}
                  onChange={(e) => setEditForm({ ...editForm, serviceName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  required
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 transition"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
