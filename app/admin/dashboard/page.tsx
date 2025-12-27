
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/lib/auth';
import './styles.css';
import { AdminDashboard } from './core'; // Import the class

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null); // Ref for the mount point

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
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    let adminDashboardInstance: AdminDashboard | undefined;
    if (isAuthorized && dashboardRef.current) {
      // Create a unique ID for the root element
      const rootId = 'admin-dashboard-root';
      // Ensure the root element exists and is empty
      if (dashboardRef.current.id !== rootId) {
        dashboardRef.current.id = rootId;
      }
      dashboardRef.current.innerHTML = ''; // Clear previous content

      // Instantiate the AdminDashboard class
      adminDashboardInstance = new AdminDashboard(rootId);
    }

    // Cleanup function
    return () => {
      // If there's an instance, perform any necessary cleanup
      // (e.g., removing event listeners if not handled internally by the class)
      // For now, no explicit destroy method, so just nullify.
      adminDashboardInstance = undefined;
    };
  }, [isAuthorized]); // Re-run when authorization changes

  if (!isAuthorized) {
    return <div className="min-h-screen flex items-center justify-center">Loading Admin...</div>;
  }

  return (
    <div ref={dashboardRef} className="admin-dashboard-container">
      {/* The AdminDashboard class will render its content into this div */}
    </div>
  );
}
