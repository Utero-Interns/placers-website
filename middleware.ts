import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define protected routes groups
    const isAdminRoute = pathname.startsWith('/admin');
    const isSellerRoute = pathname.startsWith('/seller/dashboard');
    // Buyer routes - standard dashboard and user features
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
        const cookieHeader = request.headers.get('cookie');
        if (!cookieHeader) {
            console.log('[Middleware] No cookie found for protected route, redirecting to login.');
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }

        try {
            // 2. Verify Session with Backend
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://utero.viewdns.net:3100';
            const authResponse = await fetch(`${apiUrl}/auth/me`, {
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
            const userLevel = userData.user?.level || userData.data?.level;

            // 3. Strict Role-Based Access Control

            // --- ADMIN LOGIC ---
            if (userLevel === 'ADMIN') {
                // Admin can ONLY access admin routes
                if (!isAdminRoute) {
                    // If admin tries to go to seller or buyer dashboard, redirect to admin dashboard
                    const url = request.nextUrl.clone();
                    url.pathname = '/admin/dashboard';
                    return NextResponse.redirect(url);
                }
                // Allowed
                return NextResponse.next();
            }

            // --- SELLER LOGIC ---
            if (userLevel === 'SELLER') {
                // Seller can ONLY access seller routes
                if (!isSellerRoute) {
                    // If seller tries to go to admin or buyer dashboard/profile, redirect to seller dashboard
                    const url = request.nextUrl.clone();
                    url.pathname = '/seller/dashboard';
                    return NextResponse.redirect(url);
                }
                // Allowed
                return NextResponse.next();
            }

            // --- BUYER (User) LOGIC ---
            // Assuming anything else is a standard User/Buyer
            // Buyer can ONLY access buyer routes
            if (!isBuyerRoute) {
                // If buyer tries to go to admin or seller dashboard, redirect to buyer dashboard
                // Note: userLevel might be 'USER' or defined otherwise, treating as default fallback
                const url = request.nextUrl.clone();
                url.pathname = '/dashboard';
                return NextResponse.redirect(url);
            }
            // Allowed
            return NextResponse.next();

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
