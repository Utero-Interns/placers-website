
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '../lib/store';
import { UserDashboard } from './core';
import './styles.css';

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user = store.getCurrentUser();
    
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (user.level === 'ADMIN') {
      router.push('/admin/dashboard');
      return;
    }

    setIsAuthorized(true);
    
    // Initialize dashboard logic after render
    setTimeout(() => {
      new UserDashboard('user-dashboard-root', user);
    }, 0);
  }, [router]);

  if (!isAuthorized) {
    return null; // Or a loading spinner
  }

  return (
    <div id="user-dashboard-root">
      {/* Dashboard content injected here */}
    </div>
  );
}
