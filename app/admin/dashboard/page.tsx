
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/lib/auth';
import './styles.css';
import { AdminDashboard } from './core';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await authService.getProfile();

      if (res.error || !res.user) {
        router.push('/login');
        return;
      }

      if (res.user.level !== 'ADMIN') {
        router.push('/dashboard');
        return;
      }

      setIsAuthorized(true);

      // Initialize the Vanilla JS dashboard logic
      setTimeout(() => {
        new AdminDashboard('admin-dashboard-root');
      }, 0);
    };

    checkAuth();
  }, [router]);

  if (!isAuthorized) {
    return <div className="min-h-screen flex items-center justify-center">Loading Admin...</div>;
  }

  return (
    <div id="admin-dashboard-root">
      {/* The AdminDashboard class will inject content here */}
    </div>
  );
}
