'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { MapPin, Sparkles, Tag, ArrowRight } from 'lucide-react';

export interface ServiceItem {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: string;
  isActive: boolean;
  vendorId?: {
    _id: string;
    name: string;
    email: string;
    image?: string;
    businessName?: string;
    subscriptionPlan?: string;
  };
}

export default function ServiceCard({ service }: { service: ServiceItem }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push(`/login?redirect=/services/${service._id}`);
    } else {
      router.push(`/services/${service._id}`);
    }
  };

  const mainImage =
    service.images && service.images.length > 0
      ? service.images[0]
      : 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';

  const vendorName = service.vendorId?.businessName || service.vendorId?.name || 'Verified Vendor';
  const isPremiumVendor = service.vendorId?.subscriptionPlan === 'premium';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-rose-100/80 shadow-xs hover:shadow-xl hover:border-rose-200 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Image Thumbnail & Badges */}
      <div className="relative h-60 w-full overflow-hidden bg-stone-100">
        <img
          src={mainImage}
          alt={service.serviceName}
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-stone-800 shadow-sm flex items-center gap-1.5">
          <Tag className="w-3 h-3 text-rose-500" />
          <span>{service.category}</span>
        </div>

        {/* Premium Vendor Badge */}
        {isPremiumVendor && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 fill-white" />
            <span>Featured</span>
          </div>
        )}

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 bg-rose-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-md">
          {formatCurrency(service.price)}
          <span className="text-[10px] font-normal opacity-90 ml-1">starting</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Location */}
          <div className="flex items-center text-xs text-stone-500 gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{service.location}</span>
          </div>

          {/* Service Title */}
          <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-rose-600 transition-colors line-clamp-1">
            {service.serviceName}
          </h3>

          {/* Service Description preview */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Vendor Info & Action */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          {/* Vendor preview */}
          <div className="flex items-center gap-2.5 min-w-0">
            {service.vendorId?.image ? (
              <img
                src={service.vendorId.image}
                alt={vendorName}
                className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-rose-200"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">
                {vendorName.charAt(0)}
              </div>
            )}
            <span className="text-xs font-medium text-stone-700 truncate">
              {vendorName}
            </span>
          </div>

          {/* Details CTA button */}
          <button
            onClick={handleCardClick}
            className="shrink-0 flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 group/btn bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
