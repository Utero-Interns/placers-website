
'use client';

import { useEffect } from 'react';
import './styles.css';
import { AdminDashboard } from './core';

export default function AdminDashboardPage() {
  useEffect(() => {
    // Initialize the Vanilla JS dashboard logic
    new AdminDashboard('admin-dashboard-root');
  }, []);

  return (
    <div id="admin-dashboard-root">
      {/* The AdminDashboard class will inject content here */}
    </div>
  );
}
