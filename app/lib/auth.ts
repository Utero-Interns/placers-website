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
    data?: User;
}

// Use local proxy to handle cookies correctly
// using local proxy to handle cookies correctly (Solution for localhost)
const API_BASE_URL = '/api/proxy/auth';

export interface RegisterData {
    username: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword?: string;
}

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

    async register(data: RegisterData): Promise<AuthResponse> {
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

    async getProfile(): Promise<{ user?: User; data?: User; error?: string }> {
        try {
            console.log('Fetching profile from', `${API_BASE_URL}/me`);
            const response = await fetch(`${API_BASE_URL}/me`, {
                method: 'GET',
                credentials: 'include',
            });

            console.log('Profile response status:', response.status);

            if (!response.ok) {
                console.error('Profile fetch failed:', response.statusText);
                return { error: 'Failed to fetch profile: ' + response.statusText };
            }

            const data = await response.json();
            console.log('Profile data:', data);
            return data;
        } catch (error) {
            console.error('Profile network error:', error);
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
