
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, User } from '@/app/lib/auth';
import { UserDashboard } from './core';
import './styles.css';

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // 1. Check Authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Fetch profile from API
        const res = await authService.getProfile();

        if (res.error || (!res.user && !res.data)) {
          // Not logged in or error
          console.log("Auth failed or no user data", res);
          router.push('/login');
          return;
        }

        const userData = res.user || res.data;

        if (userData?.level === 'ADMIN') {
          router.push('/admin/dashboard');
          return;
        }

        // Valid BUYER or SELLER
        setUser(userData || null);
        setIsAuthorized(true);
      } catch (err) {
        console.error("Auth check failed", err);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  // 2. Initialize Dashboard (Runs only after isAuthorized is true and DOM is rendered)
  useEffect(() => {
    if (isAuthorized && user) {
      // Use a small timeout to ensure DOM is fully ready, although useEffect usually runs after render
      const timer = setTimeout(() => {
        // Prevent double initialization if possible or just init
        // For Vanilla JS classes that attach to DOM, simple init is usually fine if idempotent or single run
        if (document.getElementById('user-dashboard-root')) {
          new UserDashboard('user-dashboard-root', user);
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isAuthorized, user]);

  if (!isAuthorized) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>; // Simple loading state
  }

  return (
    <div id="user-dashboard-root">
      {/* Dashboard content injected here */}
    </div>
  );
}
