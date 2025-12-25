/* eslint-disable @typescript-eslint/no-explicit-any */

const apiFetch = async (endpoint: string) => {
    try {
        const res = await fetch(endpoint, { credentials: 'include' });
        const json = await res.json();
        return json;
    } catch (e) {
        console.error(`Failed to fetch ${endpoint}`, e);
        return { status: false, message: 'Network error' };
    }
};

export const adminService = {
    async fetchCurrentUser() {
        try {
            const res = await fetch('/api/proxy/auth/me', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                return data.user || data.data || data;
            }
        } catch (e) {
            console.error('Failed to fetch current user', e);
        }
        return null;
    },

    async fetchUsers() {
        const json = await apiFetch('/api/proxy/user');
        return json.status && json.data ? json.data : [];
    },

    async fetchSellers() {
        const json = await apiFetch('/api/proxy/seller/all');
        return json.status && json.data ? json.data : [];
    },

    async fetchProvinces() {
        const json = await apiFetch('/api/proxy/province');
        return json.status && json.data ? json.data : [];
    },

    async fetchBillboards() {
        const json = await apiFetch('/api/proxy/billboard/all');
        return json.status && json.data ? json.data : [];
    },

    async fetchTransactions() {
        const json = await apiFetch('/api/proxy/transaction/all');
        return json.status && json.data ? json.data : [];
    },

    async fetchCategories() {
        const json = await apiFetch('/api/proxy/category');
        return json.status && json.data ? json.data : [];
    },

    async fetchDesigns() {
        const json = await apiFetch('/api/proxy/design');
        return json.status && json.data ? json.data : [];
    },

    async fetchAddons() {
        const json = await apiFetch('/api/proxy/add-on');
        return json.status && json.data ? json.data : [];
    },

    // Add other fetch methods as needed if found later (e.g., fetchCities, fetchMedia)


    async fetchMedia() {
        const json = await apiFetch('/api/proxy/image');
        return json.status && json.data ? json.data : [];
    },

    async fetchNotifications() {
        const json = await apiFetch('/api/proxy/notification/me');
        return json.status && json.data ? json.data : [];
    },

    async fetchUnreadCount() {
        const json = await apiFetch('/api/proxy/notification/unread-count');
        return json.status && typeof json.data === 'number' ? json.data : 0;
    },

    async markAllNotificationsRead() {
        try {
            const res = await fetch('/api/proxy/notification/read-all', {
                method: 'PATCH',
                credentials: 'include'
            });
            return res.ok;
        } catch (e) {
            console.error('Failed to mark all notifications read', e);
            return false;
        }
    },

    async markNotificationRead(id: string) {
        try {
            const res = await fetch(`/api/proxy/notification/${id}/read`, {
                method: 'PATCH',
                credentials: 'include'
            });
            return res.ok;
        } catch (e) {
            console.error('Failed to mark notification read', e);
            return false;
        }
    }
};
