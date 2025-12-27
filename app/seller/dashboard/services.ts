/* eslint-disable @typescript-eslint/no-explicit-any */

const apiFetch = async (endpoint: string, options?: RequestInit) => {
    try {
        const headers = new Headers(options?.headers);
        const accessToken = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];

        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }

        const res = await fetch(endpoint, { ...options, headers });
        const json = await res.json();
        return json;
    } catch (e) {
        console.error(`Failed to fetch ${endpoint}`, e);
        return { status: false, message: 'Network error' };
    }
};

export const sellerService = {
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

    async fetchMyBillboards() {
        const json = await apiFetch('/api/proxy/billboard/myBillboards');
        return json.status && json.data ? json.data : [];
    },

    async fetchMyTransactions() {
        const json = await apiFetch('/api/proxy/transaction/mySales');
        return json.status && json.data ? json.data : [];
    },

    async fetchMyProfile() {
        const json = await apiFetch('/api/proxy/seller/me');
        return json.status && json.data ? json.data : null;
    },

    async fetchProvinces() {
        const json = await apiFetch('/api/proxy/province');
        if (json.status && json.data) {
            return json.data.map((p: any) => ({
                ...p,
                id: p.id || p.value || p.province_id,
                name: p.name || p.label || p.value
            }));
        }
        return [];
    },

    async fetchCategories() {
        const json = await apiFetch('/api/proxy/category');
        return json.status && json.data ? json.data : [];
    },

    async fetchHistory() {
        const json = await apiFetch('/api/proxy/history/mine');
        return json.status && json.data ? json.data : [];
    },

    async fetchAllCities() {
        const json = await apiFetch('/api/proxy/city');
        if (json.status && json.data) {
            return json.data.map((c: any) => ({
                ...c,
                id: c.id || c.value || c.city_id,
                name: c.name || c.label || c.value,
                provinceId: c.provinceId || c.province_id
            }));
        }
        return [];
    }
};
