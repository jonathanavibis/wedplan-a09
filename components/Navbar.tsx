'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Heart, Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Settings, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine dashboard URL based on role
  const getDashboardHref = () => {
    if (!user) return '/dashboard/customer';
    if (user.role === 'Admin') return '/dashboard/admin';
    if (user.role === 'Vendor') return '/dashboard/vendor';
    return '/dashboard/customer';
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Browse Services', href: '/services' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white stroke-none" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold tracking-tight text-stone-900 group-hover:text-rose-600 transition-colors">
                Wed<span className="text-rose-500 font-sans font-extrabold">Plan</span>
              </span>
              <span className="block text-[10px] tracking-widest uppercase font-semibold text-rose-400 -mt-1">
                Luxury Wedding Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-rose-50 text-rose-600 font-semibold'
                      : 'text-stone-600 hover:text-rose-600 hover:bg-stone-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-full text-sm font-medium text-stone-700 hover:text-rose-600 hover:bg-rose-50/60 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-sm shadow-rose-200 transition transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-full border border-stone-200 hover:border-rose-300 hover:bg-rose-50/40 transition focus:outline-hidden"
                >
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-rose-200"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-stone-800 leading-tight truncate max-w-[120px]">
                      {user?.name}
                    </p>
                    <span className="text-[10px] text-rose-600 font-medium capitalize bg-rose-50 px-1.5 py-0.5 rounded-md">
                      {user?.role}
                      {user?.subscriptionPlan === 'premium' && ' ★'}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-stone-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-sm font-bold text-stone-900 truncate">{user?.name}</p>
                      <p className="text-xs text-stone-500 truncate">{user?.email}</p>
                      {user?.role === 'Vendor' && (
                        <div className="mt-1 flex items-center gap-1.5">
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                              user.subscriptionPlan === 'premium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {user.subscriptionPlan === 'premium' ? '👑 Premium Vendor' : 'Free Tier'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="py-1">
                      <Link
                        href={getDashboardHref()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-rose-50 hover:text-rose-600 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-stone-400" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href="/dashboard/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-rose-50 hover:text-rose-600 transition"
                      >
                        <Settings className="w-4 h-4 text-stone-400" />
                        <span>Profile Settings</span>
                      </Link>

                      {user?.role === 'Vendor' && user?.subscriptionPlan !== 'premium' && (
                        <Link
                          href="/dashboard/vendor/subscription"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-700 bg-amber-50/60 hover:bg-amber-100 transition font-medium"
                        >
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>Upgrade to Premium</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-stone-100 pt-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-rose-600 hover:bg-stone-100 focus:outline-hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-3 animate-in fade-in duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  pathname === link.href ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-stone-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-stone-100 pt-4">
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold rounded-xl border border-stone-300 text-stone-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-rose-600 text-white shadow-xs"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-stone-50 rounded-xl">
                  {user?.image ? (
                    <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                      {user?.name?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-stone-900 text-sm">{user?.name}</p>
                    <p className="text-xs text-stone-500">{user?.role}</p>
                  </div>
                </div>

                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-stone-700 font-medium hover:bg-stone-50 rounded-lg text-sm"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-stone-700 font-medium hover:bg-stone-50 rounded-lg text-sm"
                >
                  Profile Settings
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-rose-600 font-medium hover:bg-rose-50 rounded-lg text-sm"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
