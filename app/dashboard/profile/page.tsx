'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { uploadImageToImgBB } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Building,
  Lock,
  Upload,
  Shield,
  Sparkles,
  CheckCircle2,
  Key,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';

export default function ProfileSettingsPage() {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(user?.image || '');
  const [saving, setSaving] = useState(false);

  // Change Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

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
        toast.loading('Uploading and optimizing avatar...', { id: 'img-upload' });
        try {
          finalImageUrl = await uploadImageToImgBB(newImageFile);
          toast.success('Avatar uploaded successfully!', { id: 'img-upload' });
        } catch {
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

      const res = await api.auth.updateProfile(payload);
      if (res.success) {
        toast.success('Profile details updated successfully! ✨');
        await refreshUser();
        setNewImageFile(null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast.error(
        'New password must be at least 6 characters and contain at least one uppercase and one lowercase letter.'
      );
      return;
    }

    if (newPassword === oldPassword) {
      toast.error('New password must be different from your old password.');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await api.auth.changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        toast.success('Password changed successfully! 🎉');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordModal(false);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password. Please check your old password.');
    } finally {
      setChangingPassword(false);
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
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                }}
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

          {/* Password & Security Section with "Change Password" Button */}
          <div className="bg-stone-50/80 border border-stone-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <Lock className="w-4 h-4 text-rose-600" />
                <span>Account Password</span>
              </div>
              <p className="text-xs text-stone-500">
                Keep your account secure by updating your password regularly.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="py-2 px-4 rounded-xl bg-white hover:bg-rose-50 border border-stone-200 hover:border-rose-300 text-stone-800 hover:text-rose-700 font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-rose-500" />
              <span>Change Password</span>
            </button>
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

      {/* Change Password Popup Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 relative space-y-6 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-xs">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-900">Change Password</h3>
                  <p className="text-xs text-stone-500">Update your account credentials</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setOldPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Old Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Old Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 chars (A-Z, a-z)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  At least 6 characters with uppercase and lowercase letters.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="flex-1 py-3 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex-1 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition disabled:opacity-50 cursor-pointer"
                >
                  {changingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
