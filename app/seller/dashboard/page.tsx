'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/lib/auth';
import './styles.css';
import { SellerDashboard } from './core';

export default function SellerDashboardPage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const res = await authService.getProfile();

            if (res.error || !res.user) {
                router.push('/login');
                return;
            }

            // Check if user is SELLER (or ADMIN, but typically strict match)
            // Usually users are just SELLER. If ADMIN can access too, we can adjust.
            // But adhering to strict role separation for now as implied.
            if (res.user.level !== 'SELLER') {
                router.push('/dashboard');
                return;
            }

            setIsAuthorized(true);
        };

        checkAuth();
    }, [router]);

    useEffect(() => {
        if (isAuthorized) {
            const timer = setTimeout(() => {
                new SellerDashboard('seller-dashboard-root');
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isAuthorized]);

    if (!isAuthorized) {
        return <div className="min-h-screen flex items-center justify-center">Loading Seller Dashboard...</div>;
    }

    return (
        <div id="seller-dashboard-root">
            {/* The SellerDashboard class will inject content here */}
        </div>
    );
}
