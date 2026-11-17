'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { uploadImageToImgBB } from '@/lib/utils';
import toast from 'react-hot-toast';
import { PlusCircle, Upload, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'Photography & Videography',
  'Wedding Venues',
  'Decoration & Florist',
  'Catering Services',
  'Makeup & Styling',
  'Wedding Fashion',
];

export default function VendorAddServicePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName || !category || !price || !location || !description) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (imageFiles.length === 0) {
      toast.error('Please upload at least one image using ImgBB.');
      return;
    }

    setSubmitting(true);
    setUploadProgress('Uploading service images to ImgBB...');

    try {
      // Upload all images to ImgBB
      const uploadedUrls: string[] = [];
      for (const file of imageFiles) {
        const url = await uploadImageToImgBB(file);
        uploadedUrls.push(url);
      }

      setUploadProgress('Saving service listing...');

      const response = await api.services.create({
        serviceName,
        category,
        price: Number(price),
        location,
        description,
        images: uploadedUrls,
      });

      if (response.success) {
        toast.success('Service submitted! Awaiting administrator approval.');
        router.push('/dashboard/vendor/services');
      }
    } catch (err: any) {
      console.error('Add service error:', err);
      if (err.data?.code === 'SUBSCRIPTION_LIMIT_REACHED') {
        toast.error('Free plan limit reached (max 3 active services). Please upgrade to Premium!');
        router.push('/dashboard/vendor/subscription');
      } else {
        toast.error(err.message || 'Failed to submit service.');
      }
    } finally {
      setSubmitting(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-bold text-stone-900">Add New Wedding Service</h1>
        <p className="text-xs text-stone-500">
          Create an enticing package for engaged couples. Listings are submitted with &quot;Pending&quot; status for admin review.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Service Name / Package Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Luxury Full-Day Cinematic Wedding Photography"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm bg-white focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Starting Price ($ USD) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 2400"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Event Location / City <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Manhattan, NY or Hudson Valley, NY"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
            />
          </div>

          {/* Image Upload (ImgBB) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Portfolio Images (Uploaded via ImgBB) <span className="text-rose-500">*</span>
            </label>
            <div className="border-2 border-dashed border-rose-200 hover:border-rose-400 rounded-2xl p-6 text-center bg-rose-50/20 transition">
              <Upload className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <p className="text-xs text-stone-700 font-semibold mb-1">
                Choose images to upload to ImgBB
              </p>
              <p className="text-[11px] text-stone-500 mb-4">
                Supports JPG, PNG, WEBP (multiple files allowed)
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                required
                onChange={handleFileChange}
                className="text-xs text-stone-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-rose-500 file:text-white hover:file:bg-rose-600 cursor-pointer"
              />
            </div>

            {/* Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {imagePreviews.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Preview ${i + 1}`}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 ring-2 ring-rose-200"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Detailed Description & Package Inclusions <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={5}
              required
              placeholder="Describe your wedding service package, hours of coverage, equipment used, and what makes your work extraordinary..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
            />
          </div>

          {/* Notice */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3 text-xs text-stone-600">
            <AlertCircle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <p>
              By publishing, you confirm that you own the rights to the photos and will abide by WedPlan&apos;s quality
              standards. The service will be reviewed by an administrator before appearing publicly.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{submitting ? (uploadProgress || 'Submitting...') : 'Publish Wedding Service'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
