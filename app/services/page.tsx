'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard, { ServiceItem } from '@/components/ServiceCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { api } from '@/lib/api';
import { Search, Filter, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Photography & Videography',
  'Wedding Venues',
  'Decoration & Florist',
  'Catering Services',
  'Makeup & Styling',
  'Wedding Fashion',
];

function BrowseServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [locationFilter, setLocationFilter] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  // Fetch approved services from backend
  const fetchServices = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (locationFilter) params.location = locationFilter;
      if (sortOption) params.sort = sortOption;

      const data = await api.services.getApproved(params);
      if (data.success && data.services) {
        setServices(data.services);
      }
    } catch (err) {
      console.error('Fetch services error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, sortOption]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setLocationFilter('');
    setSortOption('newest');
    router.push('/services');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fffbf9]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3.5 py-1 rounded-full border border-rose-100">
            Exclusive Wedding Directory
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-stone-900 mt-3 tracking-tight">
            Discover Wedding Services
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            Browse through hundreds of certified wedding vendors, exquisite venues, and artistic visionaries.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-rose-100 mb-10 space-y-4">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search services by title or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition"
              />
            </div>

            {/* Location Input */}
            <div className="md:col-span-4 relative">
              <input
                type="text"
                placeholder="Filter by city or location (e.g. New York)..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition"
              />
            </div>

            {/* Search Submit Button */}
            <div className="md:col-span-3 flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-4 rounded-2xl text-sm transition shadow-sm shadow-rose-200 flex items-center justify-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>

              <button
                type="button"
                onClick={handleResetFilters}
                title="Reset Filters"
                className="p-3 rounded-2xl border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-rose-600 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Category Filter Pills & Sort Dropdown */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 border-t border-stone-100">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 lg:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-rose-50 hover:text-rose-600'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Price Sorting Selector */}
            <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-stone-500" />
              <label htmlFor="sort" className="text-xs font-medium text-stone-500">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-rose-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Service Listing Section */}
        {loading ? (
          <LoadingSpinner text="Searching wedding catalog..." />
        ) : services.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-rose-100 max-w-xl mx-auto my-12 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-serif text-stone-900 mb-2">No Matching Services Found</h3>
            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              We couldn&apos;t find any approved services matching your criteria. Try adjusting your search query,
              clearing filters, or selecting another category.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Showing <span className="text-stone-900 font-bold">{services.length}</span> verified services
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function BrowseServicesPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading wedding services..." />}>
      <BrowseServicesContent />
    </Suspense>
  );
}
