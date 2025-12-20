/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdminApiData } from './types';

// Helper to determine API Base URL - using proxy for consistency
const API_BASE = '/api/proxy';

export const AdminService = {
    // --- Fetch Data ---

    async fetchCurrentUser(): Promise<any | null> {
        try {
            const res = await fetch(`${API_BASE}/auth/me`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                return data.user || data.data || data;
            }
        } catch (e) {
            console.error('Failed to fetch current user', e);
        }
        return null;
    },

    async fetchUsers(): Promise<any[]> {
        try {
            const res = await fetch(`${API_BASE}/user`, { credentials: 'include' });
            const json = await res.json();
            if (json.status && json.data) return json.data;
        } catch (e) {
            console.error('Failed to fetch users', e);
        }
        return [];
    },

    async fetchSellers(): Promise<any[]> {
        try {
            const res = await fetch(`${API_BASE}/seller/all`, { credentials: 'include' });
            const json = await res.json();
            if (json.status && json.data) return json.data;
        } catch (e) {
            console.error('Failed to fetch sellers', e);
        }
        return [];
    },

    async fetchProvinces(): Promise<any[]> {
        try {
            const res = await fetch(`${API_BASE}/province`, { credentials: 'include' });
            const json = await res.json();
            if (json.status && json.data) return json.data;
        } catch (e) {
            console.error('Failed to fetch provinces', e);
        }
        return [];
    },

    async fetchBillboards(): Promise<any[]> {
        try {
            const res = await fetch(`${API_BASE}/billboard/all`, { credentials: 'include' });
            const json = await res.json();
            if (json.status && json.data) return json.data;
        } catch (e) {
            console.error('Failed to fetch billboards', e);
        }
        return [];
    },

    async fetchTransactions(): Promise<any[]> {
        try {
            const res = await fetch(`${API_BASE}/transaction/all`, { credentials: 'include' });
            const json = await res.json();
            if (json.status && json.data) return json.data;
        } catch (e) {
            console.error('Failed to fetch transactions', e);
        }
        return [];
    },

    async fetchCategories(): Promise<any[]> {
        try {
            const res = await fetch(`${API_BASE}/category`, { credentials: 'include' });
            const json = await res.json();
            if (json.status && json.data) return json.data;
        } catch (e) {
            console.error('Failed to fetch categories', e);
        }
        return [];
    },

    async fetchDesigns(): Promise<any[]> {
        try {
            const res = await fetch(`${API_BASE}/design`, { credentials: 'include' });
            const json = await res.json();
            if (json.status && json.data) return json.data;
        } catch (e) {
            console.error('Failed to fetch designs', e);
        }
        return [];
    },

    async fetchAddons(): Promise<any[]> {
        try {
            const res = await fetch(`${API_BASE}/add-on`, { credentials: 'include' });
            const json = await res.json();
            if (json.status && json.data) return json.data;
        } catch (e) {
            console.error('Failed to fetch add-ons', e);
        }
        return [];
    },

    async fetchCities(): Promise<any[]> {
        try {
            const res = await fetch(`${API_BASE}/city`, { credentials: 'include' });
            const json = await res.json();
            if (json.status && json.data) return json.data;
        } catch (e) {
            console.error('Failed to fetch cities', e);
        }
        return [];
    },

    async fetchMedia(): Promise<any[]> {
        try {
            const res = await fetch(`${API_BASE}/image`, { credentials: 'include' });
            const json = await res.json();
            if (json.status && json.data) return json.data;
        } catch (e) {
            console.error('Failed to fetch media', e);
        }
        return [];
    },

    async fetchNotifications(): Promise<any[]> {
        try {
            const res = await fetch(`${API_BASE}/notification/me`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                return Array.isArray(data) ? data : (data.data || []);
            }
        } catch (e) {
            console.error('Failed to fetch notifications', e);
        }
        return [];
    },

    async fetchUnreadCount(): Promise<number> {
        try {
            const res = await fetch(`${API_BASE}/notification/me/unread-count`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                return data.count || data.data || 0;
            }
        } catch (e) {
            console.error('Failed to fetch unread count', e);
        }
        return 0;
    },

    // --- Details ---

    async getSellerDetail(id: string): Promise<any | null> {
        try {
            const res = await fetch(`${API_BASE}/seller/detail/${id}`);
            const json = await res.json();
            if (json.status && json.data) return json.data;
        } catch (e) {
            console.error('Error loading seller details', e);
        }
        return null;
    },

    async getDesignDetail(id: string): Promise<any | null> {
        try {
            const res = await fetch(`${API_BASE}/design/${id}`);
            const json = await res.json();
            if (json.status && json.data) return json.data;
        } catch (e) {
            console.error('Error loading design details', e);
        }
        return null;
    },

    async getTransactionDetail(id: string): Promise<any | null> {
        try {
            const res = await fetch(`${API_BASE}/transaction/detail/${id}`);
            const json = await res.json();
            if (json.status && json.data) return json.data;
        } catch (e) {
            console.error('Error loading transaction details', e);
        }
        return null;
    },

    async getBillboardDetail(id: string): Promise<any | null> {
        try {
            const res = await fetch(`${API_BASE}/billboard/detail/${id}`);
            const json = await res.json();
            if (json.status && json.data) return json.data;
        } catch (e) {
            console.error('Error loading billboard details', e);
        }
        return null;
    },

    async getAddonDetail(id: string): Promise<any | null> {
        try {
            const res = await fetch(`${API_BASE}/add-on/${id}`);
            const json = await res.json();
            if (json.status && json.data) return json.data;
        } catch (e) {
            console.error('Error loading add-on details', e);
        }
        return null;
    },

    // --- Mutations ---

    // Notifications
    async markAllNotificationsRead(): Promise<boolean> {
        try {
            const res = await fetch(`${API_BASE}/notification/read-all`, {
                method: 'PATCH',
                credentials: 'include'
            });
            return res.ok;
        } catch (e) {
            console.error('Failed to mark all notifications read', e);
            return false;
        }
    },

    async markNotificationRead(id: string): Promise<boolean> {
        try {
            const res = await fetch(`${API_BASE}/notification/${id}/read`, {
                method: 'PATCH',
                credentials: 'include'
            });
            return res.ok;
        } catch (e) {
            console.error('Failed to mark notification read', e);
            return false;
        }
    },

    // Users
    async createUser(data: any): Promise<{ status: boolean; message?: string }> {
        try {
            const res = await fetch(`${API_BASE}/user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (e) {
            console.error('Error creating user:', e);
            return { status: false, message: 'An error occurred' };
        }
    },

    async updateUser(id: string, data: any): Promise<{ status: boolean; message?: string }> {
        try {
            const res = await fetch(`${API_BASE}/user/id/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (e) {
            console.error('Error updating user:', e);
            return { status: false, message: 'An error occurred' };
        }
    },

    async deleteUser(id: string): Promise<{ status: boolean; message?: string }> {
        try {
            const res = await fetch(`${API_BASE}/user/${id}`, { method: 'DELETE' });
            return await res.json();
        } catch (e) {
            console.error('Error deleting user:', e);
            return { status: false, message: 'An error occurred' };
        }
    },

    // Sellers
    async deleteSeller(id: string): Promise<{ status: boolean; message?: string }> {
        try {
            const res = await fetch(`${API_BASE}/seller/${id}`, { method: 'DELETE' });
            return await res.json();
        } catch (e) {
            console.error('Error deleting seller:', e);
            return { status: false, message: 'An error occurred' };
        }
    },

    // Designs
    async createDesign(formData: FormData): Promise<{ status: boolean; message?: string }> {
        try {
            const res = await fetch(`${API_BASE}/design`, {
                method: 'POST',
                // Content-Type header excluded for FormData
                body: formData
            });
            return await res.json();
        } catch (e) {
            console.error('Error creating design:', e);
            return { status: false, message: 'An error occurred' };
        }
    },

    async updateDesign(id: string, formData: FormData): Promise<{ status: boolean; message?: string }> {
        try {
            const res = await fetch(`${API_BASE}/design/${id}`, {
                method: 'PATCH',
                body: formData
            });
            return await res.json();
        } catch (e) {
            console.error('Error updating design:', e);
            return { status: false, message: 'An error occurred' };
        }
    },

    async deleteDesign(id: string): Promise<{ status: boolean; message?: string }> {
        try {
            const res = await fetch(`${API_BASE}/design/${id}`, { method: 'DELETE' });
            return await res.json();
        } catch (e) {
            console.error('Error deleting design:', e);
            return { status: false, message: 'An error occurred' };
        }
    },

    // Transactions
    async updateTransactionStatus(id: string, status: string): Promise<{ status: boolean; message?: string }> {
        try {
            const res = await fetch(`${API_BASE}/transaction/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            return await res.json();
        } catch (e) {
            console.error('Error updating transaction:', e);
            return { status: false, message: 'An error occurred' };
        }
    },

    async deleteTransaction(id: string): Promise<{ status: boolean; message?: string }> {
        try {
            const res = await fetch(`${API_BASE}/transaction/${id}`, { method: 'DELETE' });
            return await res.json();
        } catch (e) {
            console.error('Error deleting transaction:', e);
            return { status: false, message: 'An error occurred' };
        }
    },

    // Billboards
    async deleteBillboard(id: string): Promise<{ status: boolean; message?: string }> {
        try {
            const res = await fetch(`${API_BASE}/billboard/${id}`, { method: 'DELETE' });
            return await res.json();
        } catch (e) {
            console.error('Error deleting billboard:', e);
            return { status: false, message: 'An error occurred' };
        }
    },

    async updateBillboard(id: string, data: any): Promise<{ status: boolean; message?: string }> {
        try {
            const res = await fetch(`${API_BASE}/billboard/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (e) {
            console.error('Error updating billboard:', e);
            return { status: false, message: 'An error occurred' };
        }
    },

    // Categories
    async createCategory(data: any): Promise<{ status: boolean; message?: string }> {
        try {
            const res = await fetch(`${API_BASE}/category`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (e) {
            console.error('Error creating category:', e);
            return { status: false, message: 'An error occurred' };
        }
    },

    async updateCategory(id: string, data: any): Promise<{ status: boolean; message?: string }> {
        try {
            const res = await fetch(`${API_BASE}/category/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (e) {
            console.error('Error updating category:', e);
            return { status: false, message: 'An error occurred' };
        }
    },

    async deleteCategory(id: string): Promise<{ status: boolean; message?: string }> {
        try {
            const res = await fetch(`${API_BASE}/category/${id}`, { method: 'DELETE' });
            return await res.json();
        } catch (e) {
            console.error('Error deleting category:', e);
            return { status: false, message: 'An error occurred' };
        }
    },

    // Add-ons
    async createAddon(data: any): Promise<{ status: boolean; message?: string }> {
        try {
            const res = await fetch(`${API_BASE}/add-on`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (e) {
            console.error('Error creating add-on:', e);
            return { status: false, message: 'An error occurred' };
        }
    },

    async updateAddon(id: string, data: any): Promise<{ status: boolean; message?: string }> {
        try {
            const res = await fetch(`${API_BASE}/add-on/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (e) {
            console.error('Error updating add-on:', e);
            return { status: false, message: 'An error occurred' };
        }
    },

    async deleteAddon(id: string): Promise<{ status: boolean; message?: string }> {
        try {
            const res = await fetch(`${API_BASE}/add-on/${id}`, { method: 'DELETE' });
            return await res.json();
        } catch (e) {
            console.error('Error deleting add-on:', e);
            return { status: false, message: 'An error occurred' };
        }
    },

    // Cities
    async createCity(data: any): Promise<{ status: boolean; message?: string }> {
        try {
            const res = await fetch(`${API_BASE}/city`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (e) {
            console.error('Error creating city:', e);
            return { status: false, message: 'An error occurred' };
        }
    },

    async updateCity(id: string, data: any): Promise<{ status: boolean; message?: string }> {
        try {
            const res = await fetch(`${API_BASE}/city/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (e) {
            console.error('Error updating city:', e);
            return { status: false, message: 'An error occurred' };
        }
    },

    async deleteCity(id: string): Promise<{ status: boolean; message?: string }> {
        try {
            const res = await fetch(`${API_BASE}/city/${id}`, { method: 'DELETE' });
            return await res.json();
        } catch (e) {
            console.error('Error deleting city:', e);
            return { status: false, message: 'An error occurred' };
        }
    },

    // Media
    async deleteMedia(id: string): Promise<{ status: boolean; message?: string }> {
        try {
            const res = await fetch(`${API_BASE}/image/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) return { status: true };
            const json = await res.json().catch(() => ({}));
            return { status: false, message: json.message };
        } catch (e) {
            console.error('Failed to delete media', e);
            return { status: false, message: 'An error occurred' };
        }
    }
};
