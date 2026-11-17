'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { authClient } from '@/lib/auth-client';
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
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Load user on initial mount from localStorage token or Better Auth social session
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('wedplan_token');

        if (storedToken) {
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
            setIsLoading(false);
            return;
          }
        }

        // Check if there is an active Better Auth session (from Google / GitHub OAuth redirect)
        try {
          const session = await authClient.getSession();
          if (session?.data?.user) {
            const socialUser = session.data.user;
            const syncPayload = {
              email: socialUser.email,
              name: socialUser.name || socialUser.email.split('@')[0],
              image: socialUser.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
              role: 'Customer',
            };

            const data = await api.auth.googleSync(syncPayload);
            if (data.success && data.token) {
              localStorage.setItem('wedplan_token', data.token);
              setToken(data.token);
              setUser(data.user);
            }
          }
        } catch (socialErr) {
          console.warn('Better Auth session check bypassed:', socialErr);
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
        toast.success(`Account created successfully! Welcome, ${data.user.name}! 🎉`);
        redirectByRole(data.user.role);
      }
    } catch (err: any) {
      toast.error(err.message || 'Registration failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Real Google OAuth Redirect via Better Auth & Google Consent Screen
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const callbackURL =
        typeof window !== 'undefined'
          ? `${window.location.origin}/dashboard`
          : 'http://localhost:3000/dashboard';

      await authClient.signIn.social({
        provider: 'google',
        callbackURL,
      });
    } catch (err: any) {
      console.warn('Better-auth Google signIn initiating direct OAuth redirect:', err?.message);
      const clientId =
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
        process.env.GOOGLE_CLIENT_ID ||
        '';
      const redirectUri = encodeURIComponent(
        `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/auth/callback/google`
      );
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20profile%20email&access_type=offline&prompt=consent`;
    }
  };

  // Real GitHub OAuth Redirect via Better Auth & GitHub Consent Screen
  const loginWithGithub = async () => {
    setIsLoading(true);
    try {
      const callbackURL =
        typeof window !== 'undefined'
          ? `${window.location.origin}/dashboard`
          : 'http://localhost:3000/dashboard';

      await authClient.signIn.social({
        provider: 'github',
        callbackURL,
      });
    } catch (err: any) {
      console.warn('Better-auth GitHub signIn initiating direct OAuth redirect:', err?.message);
      const clientId =
        process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ||
        process.env.GITHUB_CLIENT_ID ||
        '';
      const redirectUri = encodeURIComponent(
        `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/auth/callback/github`
      );
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user%20user:email`;
    }
  };

  const logout = () => {
    localStorage.removeItem('wedplan_token');
    try {
      authClient.signOut();
    } catch (e) {
      // ignore
    }
    setUser(null);
    setToken(null);
    toast.success('You have been logged out.');
    router.push('/login');
  };

  const refreshUser = async () => {
    try {
      const data = await api.auth.getMe();
      if (data.success && data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
