'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function DashboardIndexPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'Admin') {
        router.replace('/dashboard/admin');
      } else if (user.role === 'Vendor') {
        router.replace('/dashboard/vendor');
      } else {
        router.replace('/dashboard/customer');
      }
    }
  }, [user, isLoading, router]);

  return <LoadingSpinner text="Redirecting to your role dashboard..." />;
}
