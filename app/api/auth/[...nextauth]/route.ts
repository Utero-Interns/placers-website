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
        async signIn({ user, account, profile }) {
            // Here you can handle backend syncing if needed in the future
            return true;
        },
        async redirect({ url, baseUrl }) {
            return baseUrl + '/dashboard';
        }
    }
});

export { handler as GET, handler as POST };
