'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { authService } from '@/app/lib/auth';
import './styles.css';
import { SellerDashboard } from './core';

export default function SellerDashboardPage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        const checkAuth = async () => {
            const res = await authService.getProfile();

            if (res.error || !res.user) {
                router.push('/login');
                return;
            }

            // Check if user is SELLER (or ADMIN, but typically strict match)
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
                new SellerDashboard('seller-dashboard-root', t);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isAuthorized, t]);

    if (!isAuthorized) {
        return <div className="min-h-screen flex items-center justify-center">Loading Seller Dashboard...</div>;
    }

    return (
        <div id="seller-dashboard-root">
            {/* The SellerDashboard class will inject content here */}
        </div>
    );
}
