export interface User {
    id: string;
    username?: string;
    email: string;
    phone?: string;
    level: 'BUYER' | 'SELLER' | 'ADMIN';
    profilePicture?: string;
}

export interface AuthResponse {
    status: boolean;
    message: string;
    statusCode?: number;
    user?: User;
}

// Use local proxy to handle cookies correctly
// using local proxy to handle cookies correctly (Solution for localhost)
const API_BASE_URL = '/api/proxy/auth';

export const authService = {
    async login(identifier: string, password: string): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, password }),
                credentials: 'include', // Important for cookies if backend sets them
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Login error:', error);
            return {
                status: false,
                message: 'Terjadi kesalahan saat login',
            };
        }
    },

    async register(data: any): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const dataRes = await response.json();
            return dataRes;
        } catch (error) {
            console.error('Register error:', error);
            return {
                status: false,
                message: 'Terjadi kesalahan saat registrasi',
            };
        }
    },

    async getProfile(): Promise<{ user?: User; error?: string }> {
        try {
            // Note: We might need to manually handle tokens if cookies aren't automatically sent or if it's server-side
            // But assuming client-side call or proxy
            const response = await fetch(`${API_BASE_URL}/me`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                return { error: 'Failed to fetch profile' };
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return { error: 'Network error' };
        }
    },

    async logout(): Promise<void> {
        try {
            await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST', // or GET depending on backend
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
};
