import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /admin routes for now
    if (pathname.startsWith('/admin')) {
        // We'll check for ANY common auth cookie for now to be safe
        // connect.sid is standard, but some frameworks use others.
        // We can just check if *any* cookie exists implies session if we want to be very loose,
        // but better to check for specific ones if known.
        // Since we don't know the exact cookie name from the backend (NestJS usually use connect.sid or JWT in Authorization header),
        // we will check `connect.sid` as primary.

        // Strict session verification: Call backend to validate session
        try {
            // We must pass the cookie header to the backend
            const cookieHeader = request.headers.get('cookie');
            console.log('[Middleware] Verifying session with backend...');

            const authResponse = await fetch('http://utero.viewdns.net:3100/auth/me', {
                method: 'GET',
                headers: {
                    'Cookie': cookieHeader || '',
                    'Content-Type': 'application/json',
                },
            });

            console.log('[Middleware] Backend response:', authResponse.status);

            if (!authResponse.ok) {
                console.warn('[Middleware] Session invalid, redirecting to login');
                const url = request.nextUrl.clone();
                url.pathname = '/login';
                // Optional: Check if we should clear the invalid cookie?
                const res = NextResponse.redirect(url);
                // res.cookies.delete('connect.sid'); // Might be aggressive if it's just a temporary error
                return res;
            }

            // Optional: Check if user is admin if the endpoint returns user data
            // const userData = await authResponse.json();
            // if (pathname.startsWith('/admin') && userData.level !== 'ADMIN') { ... }

        } catch (error) {
            console.error('[Middleware] Auth check failed:', error);
            // On error (e.g. backend down), might be safer to fail closed (redirect) or open
            // Failing closed for admin:
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/dashboard/:path*'], // Added dashboard to matcher to ensure consistent behavior if we decide to protect it too
};
