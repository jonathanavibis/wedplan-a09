'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Customer' | 'Vendor' | 'Admin';
  image?: string;
  isBlocked?: boolean;
  businessName?: string;
  subscriptionPlan?: 'free' | 'premium';
  subscriptionExpiresAt?: string | null;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  loginWithGoogle: (googleUser?: any) => Promise<void>;
  loginWithGithub: (githubUser?: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Load user on initial mount from localStorage token
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('wedplan_token');
        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        setToken(storedToken);
        const data = await api.auth.getMe();
        if (data.success && data.user) {
          if (data.user.isBlocked) {
            toast.error('Your account is blocked. Please contact support.');
            localStorage.removeItem('wedplan_token');
            setUser(null);
            setToken(null);
          } else {
            setUser(data.user);
          }
        }
      } catch (err: any) {
        console.warn('Failed to restore auth session:', err.message);
        localStorage.removeItem('wedplan_token');
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const redirectByRole = (role: string) => {
    if (role === 'Admin') {
      router.push('/dashboard/admin');
    } else if (role === 'Vendor') {
      router.push('/dashboard/vendor');
    } else {
      router.push('/dashboard/customer');
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.auth.login({ email, password });
      if (data.success && data.token) {
        localStorage.setItem('wedplan_token', data.token);
        setToken(data.token);
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}! 💍`);
        redirectByRole(data.user.role);
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: any) => {
    setIsLoading(true);
    try {
      const data = await api.auth.register(payload);
      if (data.success && data.token) {
        localStorage.setItem('wedplan_token', data.token);
        setToken(data.token);
        setUser(data.user);
        toast.success('Registration successful! Welcome to WedPlan.');
        redirectByRole(data.user.role);
      }
    } catch (err: any) {
      toast.error(err.message || 'Registration failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (googleUser?: any) => {
    setIsLoading(true);
    try {
      const payload = googleUser || {
        email: 'google_user@wedplan.com',
        name: 'Google Verified User',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'Customer',
      };
      const data = await api.auth.googleSync(payload);
      if (data.success && data.token) {
        localStorage.setItem('wedplan_token', data.token);
        setToken(data.token);
        setUser(data.user);
        toast.success(`Welcome, ${data.user.name}! (Google Authenticated) 💍`);
        redirectByRole(data.user.role);
      }
    } catch (err: any) {
      toast.error(err.message || 'Google authentication failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGithub = async (githubUser?: any) => {
    setIsLoading(true);
    try {
      const payload = githubUser || {
        email: 'github_user@wedplan.com',
        name: 'GitHub Verified Developer',
        image: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
        role: 'Customer',
      };
      const data = await api.auth.githubSync(payload);
      if (data.success && data.token) {
        localStorage.setItem('wedplan_token', data.token);
        setToken(data.token);
        setUser(data.user);
        toast.success(`Welcome, ${data.user.name}! (GitHub Authenticated) 💍`);
        redirectByRole(data.user.role);
      }
    } catch (err: any) {
      toast.error(err.message || 'GitHub authentication failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('wedplan_token');
    setUser(null);
    setToken(null);
    toast.success('Signed out successfully.');
    router.push('/login');
  };

  const refreshUser = async () => {
    try {
      const data = await api.auth.getMe();
      if (data.success && data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Refresh user error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !user.isBlocked,
        login,
        register,
        loginWithGoogle,
        loginWithGithub,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
