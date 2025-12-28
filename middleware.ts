import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define protected routes and their required roles/logic
    const isAdminRoute = pathname.startsWith('/admin');
    const isSellerRoute = pathname.startsWith('/seller/dashboard'); // Only protect dashboard, /seller might be landing
    const isBuyerRoute =
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/booking') ||
        pathname.startsWith('/bookmark') ||
        pathname.startsWith('/history') ||
        pathname.startsWith('/profile') ||
        pathname.startsWith('/payment') ||
        pathname.startsWith('/order-history');

    // Combine checks to see if auth is needed
    if (isAdminRoute || isSellerRoute || isBuyerRoute) {

        // 1. Initial Cookie Check (Fail fast)
        // We look for common session cookies. Adjust if you know the specific cookie name.
        const cookieHeader = request.headers.get('cookie');
        if (!cookieHeader) {
            console.log('[Middleware] No cookie found for protected route, redirecting to login.');
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }

        try {
            // 2. Verify Session with Backend
            // console.log('[Middleware] Verifying session with backend for path:', pathname);
            const authResponse = await fetch('http://utero.viewdns.net:3100/auth/me', {
                method: 'GET',
                headers: {
                    'Cookie': cookieHeader,
                    'Content-Type': 'application/json',
                },
            });

            if (!authResponse.ok) {
                console.warn(`[Middleware] Session invalid (${authResponse.status}), redirecting to login`);
                const url = request.nextUrl.clone();
                url.pathname = '/login';
                return NextResponse.redirect(url);
            }

            const userData = await authResponse.json();
            const userLevel = userData.user?.level || userData.data?.level; // Adapt based on API response structure

            // 3. Role-Based Access Control

            // ADMIN Route Protection
            if (isAdminRoute) {
                if (userLevel !== 'ADMIN') {
                    // Redirect non-admins to their respective dashboards
                    const url = request.nextUrl.clone();
                    if (userLevel === 'SELLER') url.pathname = '/seller/dashboard';
                    else url.pathname = '/dashboard';
                    return NextResponse.redirect(url);
                }
            }

            // SELLER Route Protection
            // "for buyer, cant access the seller's features"
            if (isSellerRoute) {
                if (userLevel !== 'SELLER' && userLevel !== 'ADMIN') { // Assuming Admin might need access, if not remove ADMIN check
                    // Buyer trying to access Seller route -> redirect to Buyer dashboard
                    const url = request.nextUrl.clone();
                    url.pathname = '/dashboard';
                    return NextResponse.redirect(url);
                }
            }

            // BUYER/Common Protected Route Protection
            // "for seller, cant access the admin's features" -> Handled by Admin check above
            // "for guest..." -> Handled by auth check above
            // Usually Sellers can access Buyer features (e.g. Profile), so we don't block Sellers from /dashboard or /profile.
            // If we strictly want to keep them separate:
            // if (isBuyerRoute && userLevel === 'SELLER') { ... } 

            // However, typically "Buyer features" like Profile are shared. 
            // The prompt says "for seller, cant access the admin's features". 
            // It doesn't explicitly say Seller can't access Buyer features.
            // So we allow authenticated users (Buyer/Seller/Admin) to access standard protected routes unless specific logic forbids it.

        } catch (error) {
            console.error('[Middleware] Auth check failed:', error);
            // Fail safe -> Redirect to login
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/seller/dashboard/:path*', // More specific than /seller/:path* to verify
        '/dashboard/:path*',
        '/booking/:path*',
        '/bookmark/:path*',
        '/history/:path*',
        '/profile/:path*',
        '/payment/:path*',
        '/order-history/:path*'
    ],
};
