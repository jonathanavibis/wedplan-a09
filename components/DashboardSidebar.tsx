'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Layers,
  PlusCircle,
  CalendarCheck,
  CreditCard,
  Settings,
  Users,
  CheckSquare,
  Receipt,
  Heart,
  LogOut,
  Sparkles,
} from 'lucide-react';

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  // Role-based menu navigation items
  const getNavItems = () => {
    if (user.role === 'Admin') {
      return [
        { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
        { name: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
        { name: 'Manage Services', href: '/dashboard/admin/services', icon: CheckSquare },
        { name: 'Transactions', href: '/dashboard/admin/transactions', icon: Receipt },
        { name: 'Profile Settings', href: '/dashboard/profile', icon: Settings },
      ];
    } else if (user.role === 'Vendor') {
      return [
        { name: 'Overview', href: '/dashboard/vendor', icon: LayoutDashboard },
        { name: 'My Services', href: '/dashboard/vendor/services', icon: Layers },
        { name: 'Add Service', href: '/dashboard/vendor/add-service', icon: PlusCircle },
        { name: 'Booking Requests', href: '/dashboard/vendor/bookings', icon: CalendarCheck },
        { name: 'Subscription', href: '/dashboard/vendor/subscription', icon: CreditCard },
        { name: 'Profile Settings', href: '/dashboard/profile', icon: Settings },
      ];
    } else {
      // Customer
      return [
        { name: 'Overview', href: '/dashboard/customer', icon: LayoutDashboard },
        { name: 'My Bookings', href: '/dashboard/customer/bookings', icon: CalendarCheck },
        { name: 'Profile Settings', href: '/dashboard/profile', icon: Settings },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white border-r border-rose-100 flex flex-col shrink-0 min-h-[calc(100vh-80px)]">
      {/* User Mini Profile Header */}
      <div className="p-6 border-b border-stone-100 flex items-center gap-3">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-rose-200"
          />
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-lg">
            {user.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-bold text-stone-900 text-sm truncate">{user.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
              {user.role}
            </span>
            {user.role === 'Vendor' && user.subscriptionPlan === 'premium' && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                ★
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-rose-50 text-rose-600 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-rose-600 hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600' : 'text-stone-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Vendor Premium Promo Banner inside sidebar */}
        {user.role === 'Vendor' && user.subscriptionPlan !== 'premium' && (
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-200/70 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto shadow-xs">
              <Sparkles className="w-4 h-4 fill-white" />
            </div>
            <p className="text-xs font-bold text-stone-900">Publish Unlimited Services</p>
            <p className="text-[11px] text-stone-600">Upgrade to Premium for $49 to unlock unlimited active listings.</p>
            <Link
              href="/dashboard/vendor/subscription"
              className="inline-block w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition"
            >
              Upgrade Now
            </Link>
          </div>
        )}
      </nav>

      {/* Sign Out Action at Bottom */}
      <div className="p-4 border-t border-stone-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium text-stone-600 hover:text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut className="w-4 h-4 text-stone-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
