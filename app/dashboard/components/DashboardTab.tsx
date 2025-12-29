'use client';

import { User } from '@/app/lib/auth';
import { useEffect, useState } from 'react';

interface DashboardTabProps {
  user: User;
}

export default function DashboardTab({ user }: DashboardTabProps) {
  const [stats, setStats] = useState<{ revenue: number; billboards: number; sales: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (user.level === 'SELLER') {
        try {
          const [billboardsRes, salesRes] = await Promise.all([
            fetch('/api/proxy/billboard/myBillboards').then(r => r.json()),
            fetch('/api/proxy/transaction/mySales').then(r => r.json())
          ]);

          const billboards = Array.isArray(billboardsRes) ? billboardsRes : [];
          const sales = Array.isArray(salesRes) ? salesRes : [];
          
          const revenue = sales.reduce((acc: number, t: { status: string; totalPrice: string | number }) => acc + (t.status === 'PAID' ? Number(t.totalPrice) : 0), 0);
          
          setStats({
            billboards: billboards.length,
            sales: sales.length,
            revenue
          });
        } catch (error) {
          console.error("Failed to fetch stats", error);
        }
      }
      setLoading(false);
    };

    fetchStats();
  }, [user]);

  if (loading) return <div className="p-8 text-center animate-pulse">Loading data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
        <span className="text-sm text-gray-500">Welcome back, {user.username}</span>
      </div>

      {user.level === 'SELLER' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-red-600">
            <div className="text-gray-500 text-sm mb-2">Total Revenue</div>
            <div className="text-3xl font-bold text-gray-800">Rp {stats?.revenue?.toLocaleString() || 0}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-red-600">
            <div className="text-gray-500 text-sm mb-2">Active Billboards</div>
            <div className="text-3xl font-bold text-gray-800">{stats?.billboards || 0}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-red-600">
             <div className="text-gray-500 text-sm mb-2">Total Sales</div>
             <div className="text-3xl font-bold text-gray-800">{stats?.sales || 0}</div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Account Status: Buyer</h3>
          <p className="text-gray-600">You can browse billboards, make bookings, and track your history.</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
          <h3 className="text-blue-800 font-semibold">Welcome to your Dashboard</h3>
          <p className="text-blue-600 text-sm mt-1">Select an item from the sidebar to manage your activities.</p>
      </div>
    </div>
  );
}
