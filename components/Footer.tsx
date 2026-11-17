import React from 'react';
import Link from 'next/link';
import { Heart, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-auto border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Logo & Description */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-900/50">
                <Heart className="w-5 h-5 fill-white stroke-none" />
              </div>
              <span className="text-2xl font-serif font-bold text-white tracking-tight">
                Wed<span className="text-rose-400 font-sans font-extrabold">Plan</span>
              </span>
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              WedPlan is the world&apos;s premier luxury wedding marketplace connecting couples with top-tier,
              verified wedding venues, photographers, florists, caterers, and bridal designers. Plan your dream wedding
              with absolute confidence.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors text-stone-400"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors text-stone-400"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors text-stone-400"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors text-stone-400"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Explore WedPlan</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-rose-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-rose-400 transition-colors">
                  Browse All Services
                </Link>
              </li>
              <li>
                <Link href="/services?category=Wedding+Venues" className="hover:text-rose-400 transition-colors">
                  Wedding Venues
                </Link>
              </li>
              <li>
                <Link href="/services?category=Photography+%26+Videography" className="hover:text-rose-400 transition-colors">
                  Photographers
                </Link>
              </li>
              <li>
                <Link href="/services?category=Catering+Services" className="hover:text-rose-400 transition-colors">
                  Catering & Bars
                </Link>
              </li>
            </ul>
          </div>

          {/* For Vendors & Customers */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Vendors & Couples</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/register" className="hover:text-rose-400 transition-colors">
                  Join as a Vendor
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-rose-400 transition-colors">
                  Sign In to Dashboard
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-rose-400 transition-colors">
                  Vendor Directory
                </Link>
              </li>
              <li>
                <span className="text-xs inline-block bg-rose-950 text-rose-300 border border-rose-800/60 px-2 py-0.5 rounded-full font-medium">
                  Stripe Test Checkout
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Contact Us</h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span>5th Avenue, Suite 1200, Manhattan, New York, NY 10018</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                <span>+1 (800) 459-WEDS</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                <span>concierge@wedplan.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} WedPlan Inc. All rights reserved. Created for Assignment 9.</p>
          <div className="flex space-x-6">
            <span className="hover:text-stone-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-stone-400 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
