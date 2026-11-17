'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  Users,
  Search,
  Filter,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  Ban,
  Building,
  User as UserIcon,
} from 'lucide-react';

export default function AdminManageUsersPage() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const params: Record<string, any> = {};
      if (searchTerm) params.search = searchTerm;
      if (roleFilter && roleFilter !== 'All') params.role = roleFilter;

      const data = await api.users.getAdminAll(params);
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleBlock = async (user: any) => {
    if (user._id === currentAdmin?._id) {
      toast.error('Security alert: You cannot block your own admin account!');
      return;
    }

    const action = user.isBlocked ? 'unblock' : 'block';
    if (!window.confirm(`Are you sure you want to ${action} ${user.name} (${user.email})?`)) {
      return;
    }

    setTogglingId(user._id);
    try {
      const res = await api.users.toggleBlock(user._id);
      if (res.success) {
        toast.success(res.message);
        fetchUsers();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle block status.');
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving registered user database..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">Manage Registered Users</h1>
          <p className="text-xs text-stone-500 mt-1">
            Search, filter by role, inspect account credentials, and moderate platform access.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or studio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-stone-200 text-xs focus:outline-hidden focus:border-rose-500"
          />
        </form>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <Filter className="w-4 h-4 text-stone-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 focus:outline-hidden"
          >
            <option value="All">All Roles</option>
            <option value="Customer">Customers</option>
            <option value="Vendor">Vendors</option>
            <option value="Admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 text-stone-700 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-4 px-6">User / Account</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Studio / Business</th>
                <th className="py-4 px-4">Plan</th>
                <th className="py-4 px-4">Joined Date</th>
                <th className="py-4 px-4">Access Status</th>
                <th className="py-4 px-6 text-right">Moderation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map((u) => {
                const isSelf = u._id === currentAdmin?._id;
                return (
                  <tr key={u._id} className="hover:bg-rose-50/20 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {u.image ? (
                          <img
                            src={u.image}
                            alt={u.name}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-stone-200 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-sm shrink-0">
                            {u.name?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-stone-900 text-sm truncate flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isSelf && (
                              <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-normal">
                                (You)
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-stone-400 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          u.role === 'Admin'
                            ? 'bg-rose-100 text-rose-800'
                            : u.role === 'Vendor'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {u.role === 'Admin' ? <Shield className="w-3 h-3" /> : u.role === 'Vendor' ? <Building className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                        <span>{u.role}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 font-medium text-stone-800 truncate max-w-[140px]">
                      {u.businessName || '—'}
                    </td>

                    <td className="py-4 px-4">
                      {u.role === 'Vendor' ? (
                        <span
                          className={`capitalize font-bold text-[10px] px-2 py-0.5 rounded-md ${
                            u.subscriptionPlan === 'premium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {u.subscriptionPlan === 'premium' ? '★ Premium' : 'Free'}
                        </span>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-stone-500">{formatDate(u.createdAt)}</td>

                    <td className="py-4 px-4">
                      {u.isBlocked ? (
                        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <Ban className="w-3 h-3" />
                          <span>Blocked</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <CheckCircle className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      {isSelf ? (
                        <span className="text-[11px] text-stone-400 italic">Self Account</span>
                      ) : (
                        <button
                          onClick={() => handleToggleBlock(u)}
                          disabled={togglingId === u._id}
                          className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition disabled:opacity-50 ${
                            u.isBlocked
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          }`}
                        >
                          {u.isBlocked ? 'Unblock User' : 'Block User'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
