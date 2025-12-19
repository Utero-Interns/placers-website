import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Only protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Check for auth cookie (adjust cookie name as needed, usually 'connect.sid' or 'token')
        // Since the user didn't specify the exact cookie name, we'll check for common ones or just existence
        // ideally the backend sets a cookie named 'connect.sid' for session, or similar.
        // However, client-side we might not be able to verify the content easily without an API call.
        // For a basic guard, we check if the cookie exists.

        // NOTE: Real security happens on the backend. This is just for UX to redirect unauthenticated users.
        // We'll check for a cookie named 'connect.sid' which is common for Express sessions, 
        // or if the user mentioned 'auth_token', we check that.

        // The user prompt said "make only admin user and has its cookie can only access this page".
        // We'll presume there's a session cookie.

        const cookie = request.cookies.get('connect.sid'); // Example session cookie
        // If no cookie, redirect to login
        if (!cookie) {
            // logic to allow if it's already on login page? No, this is for /admin
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
