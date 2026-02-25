import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async signIn({ user, account }) {
            // IMPORTANT: Google OAuth users are NOT currently synced with backend database
            // This means Google-authenticated users will fail middleware checks
            // 
            // TODO: Implement backend sync to register Google users
            // Example implementation:
            /*
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://utero.viewdns.net:3100';
                const response = await fetch(`${apiUrl}/auth/oauth/google`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        googleId: account?.providerAccountId
                    })
                });
                
                if (!response.ok) {
                    console.error('Failed to sync Google user with backend');
                    return false;
                }
                
                // Backend should set HttpOnly cookie in response
                return true;
            } catch (error) {
                console.error('Error syncing Google user:', error);
                return false;
            }
            */
            
            console.warn('⚠️ Google OAuth user not synced with backend - user will fail protected route checks');
            return true;
        },
        async redirect({ baseUrl }) {
            // NOTE: This always redirects to /dashboard regardless of user role
            // Consider implementing role-based redirect after backend sync is added
            return baseUrl + '/dashboard';
        }
    }
});

export { handler as GET, handler as POST };
