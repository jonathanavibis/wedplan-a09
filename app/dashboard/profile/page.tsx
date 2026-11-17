'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { uploadImageToImgBB } from '@/lib/utils';
import toast from 'react-hot-toast';
import { User, Mail, Building, Lock, Upload, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ProfileSettingsPage() {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [password, setPassword] = useState('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(user?.image || '');
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalImageUrl = user?.image || '';

      if (newImageFile) {
        toast.loading('Uploading new avatar to ImgBB...', { id: 'img-upload' });
        try {
          finalImageUrl = await uploadImageToImgBB(newImageFile);
          toast.success('Avatar uploaded!', { id: 'img-upload' });
        } catch (uploadErr: any) {
          toast.error('Image upload failed, keeping current avatar.', { id: 'img-upload' });
        }
      }

      const payload: any = {
        name,
        image: finalImageUrl,
      };

      if (user?.role === 'Vendor') {
        payload.businessName = businessName;
      }

      if (password) {
        payload.password = password;
      }

      const res = await api.auth.updateProfile(payload);
      if (res.success) {
        toast.success('Profile details updated successfully! ✨');
        await refreshUser();
        setPassword('');
        setNewImageFile(null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-stone-900">Profile Settings</h1>
        <p className="text-xs text-stone-500 mt-1">
          Manage your personal details, profile avatar, and account security.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xs space-y-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-5 border-b border-stone-100 pb-6">
          <div className="relative">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt={name}
                className="w-20 h-20 rounded-3xl object-cover ring-4 ring-rose-100 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-2xl">
                {name?.charAt(0) || 'U'}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-stone-900">Profile Photo</h3>
            <p className="text-xs text-stone-500">Upload a professional headshot or company logo</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-xs text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer"
            />
          </div>
        </div>

        {/* Read-Only Account Security Metadata */}
        <div className="grid grid-cols-2 gap-4 bg-stone-50/80 p-4 rounded-2xl border border-stone-200/60 text-xs">
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Account Role</span>
            <span className="font-bold text-stone-900 flex items-center gap-1.5 mt-0.5">
              <Shield className="w-3.5 h-3.5 text-rose-500" />
              <span>{user?.role} (Fixed)</span>
            </span>
          </div>

          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Subscription Tier</span>
            <span className="font-bold text-stone-900 flex items-center gap-1.5 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="capitalize">{user?.subscriptionPlan || 'Free'}</span>
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              />
            </div>
          </div>

          {/* Business Name (Vendor only) */}
          {user?.role === 'Vendor' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Business / Studio Name
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
              </div>
            </div>
          )}

          {/* Email Address (Read-only) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Email Address (Account Identifier)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 bg-stone-50 text-stone-500 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          {/* Update Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Change Password (Leave blank to keep unchanged)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="New password (Min 6 chars with uppercase & lowercase)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-200 transition disabled:opacity-50"
            >
              {saving ? 'Saving Profile Updates...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
