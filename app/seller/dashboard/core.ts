/* eslint-disable @typescript-eslint/no-explicit-any */

// import { store } from '../../lib/store';
import { authService } from '../../lib/auth';
import * as XLSX from 'xlsx';

function getImageUrl(path: string | null): string {
    if (!path) return 'https://placehold.co/600x400?text=No+Image';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `/api/proxy/${cleanPath}`;
}


type ModuleName = 'Dashboard' | 'My Billboards' | 'My Transactions' | 'My Profile' | 'History' | 'My Wallet';

interface DashboardState {
    activeTab: ModuleName;
    searchQuery: string;
    sortColumn: string | null;
    sortDirection: 'asc' | 'desc';
    filters: Record<string, string>;
    currentPage: number;
    itemsPerPage: number;
    isSidebarOpen: boolean;
}

interface ColumnConfig<T> {
    key: keyof T | 'actions';
    label: string;
    render?: (value: any, row: T) => string;
}

interface ModuleConfig<T> {
    data: T[];
    columns: ColumnConfig<T>[];
    filters: { key: keyof T; label: string; options: string[] }[];
}

export class SellerDashboard {
    private root: HTMLElement;
    private state: DashboardState;
    private apiData: {
        billboards: any[];
        transactions: any[];
        profile: any | null;
        currentUser: any | null;
        provinces: any[];
        cities: any[];
        categories: any[];
        history: any[];
        allCities: any[]; // Cache for all cities
        unseenNotifications: number;
        notifications: any[];
        stats: any | null;
    };
    private currentModalAction: (() => Promise<void>) | null = null;
    private selectedDesignFiles: File[] = [];
    private t: (key: string) => string;

    constructor(rootId: string, t: (key: string) => string) {
        const root = document.getElementById(rootId);
        if (!root) throw new Error(`Root element #${rootId} not found`);
        this.root = root;
        this.t = t;
        this.apiData = {
            billboards: [],
            transactions: [],
            profile: null,
            currentUser: null,
            provinces: [],
            cities: [],
            categories: [],
            history: [],
            allCities: [], // Cache for all cities
            unseenNotifications: 0,
            notifications: [],
            stats: null
        };
        this.state = {
            activeTab: 'Dashboard',
            searchQuery: '',
            sortColumn: null,
            sortDirection: 'asc',
            filters: {},
            currentPage: 1,
            itemsPerPage: 10,
            isSidebarOpen: false
        };

        // Check for stored active tab (e.g. after reload)
        const storedTab = localStorage.getItem('seller_dashboard_active_tab') as ModuleName | null;
        if (storedTab) {
            this.state.activeTab = storedTab;
            // Clear it so it doesn't persist on subsequent normal reloads
            localStorage.removeItem('seller_dashboard_active_tab');
        }

        this.init();
    }

    private async init() {
        await this.fetchCurrentUser();
        this.renderLayout();
        this.attachGlobalListeners();
        this.loadGoogleMapsScript().catch(console.error);

        // Fetch initial data
        await Promise.all([
            this.fetchDashboardStats(),
            this.fetchMyBillboards(),
            this.fetchMyTransactions(),
            this.fetchMyProfile(),
            this.fetchProvinces(), // Needed for forms
            this.fetchCategories()
        ]);

        this.fetchUnreadCount();
        this.attachFloatingNotificationListener();

        this.renderContent();
    }

    private clearFieldErrors(form: HTMLElement) {
        form.querySelectorAll('.field-error-msg').forEach(el => el.remove());
        form.querySelectorAll('.form-control').forEach(el => {
            (el as HTMLElement).style.borderColor = '';
        });
    }

    private displayFieldErrors(form: HTMLElement, errors: Record<string, string>) {
        this.clearFieldErrors(form); // Clear old errors first
        Object.entries(errors).forEach(([field, message]) => {
            const input = form.querySelector(`[name="${field}"]`) as HTMLElement;
            if (input) {
                input.style.borderColor = '#dc2626';

                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error-msg';
                errorDiv.textContent = message;
                errorDiv.style.color = '#dc2626';
                errorDiv.style.fontSize = '0.875rem';
                errorDiv.style.marginTop = '0.25rem';

                // Insert after the input
                input.insertAdjacentElement('afterend', errorDiv);
            }
        });
    }

    // Helper for confirmation modals
    private openConfirmModal(title: string, message: string, onConfirm: () => Promise<void>, type: 'success' | 'error' | 'warning' = 'warning') {
        const overlay = this.root.querySelector('.modal-overlay');
        const titleEl = this.root.querySelector('.modal-title');
        const body = this.root.querySelector('.modal-body');
        const confirmBtn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;

        if (overlay && titleEl && body && confirmBtn) {
            titleEl.textContent = title;

            let iconColor = '#dc2626';
            let iconBg = '#fee2e2';
            let iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';

            if (type === 'success') {
                iconColor = '#16a34a'; // Green
                iconBg = '#dcfce7';
                iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
            } else if (type === 'error') {
                iconColor = '#dc2626'; // Red
                iconBg = '#fee2e2';
                iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
            }

            body.innerHTML = `
                <div class="modal-confirm-icon" style="background-color: ${iconBg}; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: ${iconColor};">
                    ${iconSvg}
                </div>
                <div class="modal-confirm-title" style="text-align: center; font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">${title}</div>
                <div class="modal-confirm-text" style="text-align: center; color: var(--text-secondary); margin-bottom: 1.5rem;">${message}</div>
            `;

            // Update confirm button style
            confirmBtn.className = 'btn btn-primary confirm-modal'; // Reset
            confirmBtn.textContent = 'Confirm';
            confirmBtn.style.backgroundColor = '';
            confirmBtn.style.borderColor = '';

            if (type === 'error') {
                confirmBtn.textContent = 'OK';
                confirmBtn.className = 'btn btn-danger confirm-modal';
            } else if (type === 'success') {
                confirmBtn.textContent = 'OK';
                confirmBtn.className = 'btn btn-success confirm-modal';
                confirmBtn.style.backgroundColor = '#16a34a';
                confirmBtn.style.borderColor = '#16a34a';
            } else if (type === 'warning') {
                confirmBtn.textContent = 'Delete';
                confirmBtn.className = 'btn btn-danger confirm-modal';
                confirmBtn.style.backgroundColor = '#dc2626';
                confirmBtn.style.borderColor = '#dc2626';
            }

            this.currentModalAction = async () => {
                await onConfirm();
            };

            overlay.classList.add('open');
        }
    }

    private async fetchCurrentUser() {
        try {
            const res = await fetch('/api/proxy/user/profile/me', { credentials: 'include' });
            if (res.ok) {
                const json = await res.json();
                this.apiData.currentUser = json.data;
            }
        } catch (e) {
            console.error('Failed to fetch current user', e);
        }
    }

    private async fetchDashboardStats() {
        try {
            const res = await fetch('/api/proxy/dashboard/stats', {
                credentials: 'include'
            });
            const json = await res.json();
            if (json && json.stats) {
                this.apiData.stats = json.stats;
            }
        } catch (e) {
            console.error('Failed to fetch dashboard stats', e);
        }
    }

    private async fetchMyBillboards() {
        try {
            const res = await fetch('/api/proxy/billboard/myBillboards', { credentials: 'include' });
            const json = await res.json();
            if (json.status && json.data) {
                this.apiData.billboards = json.data;
            } else if (json.data) {
                this.apiData.billboards = json.data;
            } else if (Array.isArray(json)) {
                this.apiData.billboards = json;
            }
        } catch (e) {
            console.error('Failed to fetch billboards', e);
        }
    }

    private async fetchMyTransactions() {
        try {
            const res = await fetch('/api/proxy/transaction/mySales', { credentials: 'include' });
            const json = await res.json();
            if (json.status && json.data) {
                this.apiData.transactions = json.data;
            } else if (json.data) {
                this.apiData.transactions = json.data;
            } else if (Array.isArray(json)) {
                this.apiData.transactions = json;
            }
        } catch (e) {
            console.error('Failed to fetch transactions', e);
        }
    }

    private async fetchMyProfile() {
        try {
            const res = await fetch('/api/proxy/seller/me', { credentials: 'include' });
            const json = await res.json();
            if (json.status && json.data) {
                this.apiData.profile = json.data;
            }
        } catch (e) {
            console.error('Failed to fetch profile', e);
        }
    }

    private async fetchProvinces() {
        try {
            const res = await fetch('/api/proxy/province', { credentials: 'include' });
            const json = await res.json();
            if (json.status && json.data) {
                // Normalize data: ensure id and name
                this.apiData.provinces = json.data.map((p: any) => ({
                    ...p,
                    id: p.id || p.value || p.province_id,
                    name: p.name || p.label || p.value
                }));
            }
        } catch (e) {
            console.error('Failed to fetch provinces', e);
        }
    }

    private async fetchCategories() {
        try {
            const res = await fetch('/api/proxy/category', { credentials: 'include' });
            const json = await res.json();
            if (json.status && json.data) {
                this.apiData.categories = json.data;
            }
        } catch (e) {
            console.error('Failed to fetch categories', e);
        }
    }

    private async fetchCities(provinceId: string) {
        try {
            // Check cache first
            if (this.apiData.allCities && this.apiData.allCities.length > 0) {
                return this.apiData.allCities.filter((c: any) => c.provinceId === provinceId);
            }

            // Fetch all cities if not cached
            // Endpoint: GET /api/proxy/city (returns all cities)
            const res = await fetch('/api/proxy/city', { credentials: 'include' });
            const json = await res.json();

            if (json.status && json.data) {
                // Normalize data
                this.apiData.allCities = json.data.map((c: any) => ({
                    ...c,
                    id: c.id || c.value || c.city_id,
                    name: c.name || c.label || c.value,
                    provinceId: c.provinceId || c.province_id
                }));
                // Filter
                return this.apiData.allCities.filter((c: any) => c.provinceId === provinceId);
            }
            return [];
        } catch (e) {
            console.error('Failed to fetch cities', e);
            return [];
        }
    }

    private async fetchHistory() {
        try {
            const res = await fetch('/api/proxy/history/mine', { credentials: 'include' });
            const json = await res.json();
            if (json.status && json.data) {
                this.apiData.history = json.data;
            } else if (json.data) {
                this.apiData.history = json.data;
            } else if (Array.isArray(json)) {
                this.apiData.history = json;
            }
        } catch (e) {
            console.error('Failed to fetch history', e);
        }
    }

    private async fetchUnreadCount() {
        try {
            const res = await fetch('/api/proxy/notification/seller/unread-count', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                this.apiData.unseenNotifications = data.count || data.data || 0;
                this.updateNotificationBadge();
            }
        } catch (e) {
            console.error('Failed to fetch unread count', e);
        }
    }

    private updateNotificationBadge() {
        const badge = this.root.querySelector('.notif-badge') as HTMLElement;
        const btn = this.root.querySelector('.floating-notif-btn') as HTMLElement;

        if (badge && btn) {
            const count = this.apiData.unseenNotifications;
            badge.textContent = count.toString();
            badge.style.display = count > 0 ? 'flex' : 'none';

            if (count > 0) {
                btn.classList.add('ringing');
            } else {
                btn.classList.remove('ringing');
            }
        }
    }

    private async fetchNotifications() {
        try {
            const res = await fetch('/api/proxy/notification/seller', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                this.apiData.notifications = Array.isArray(data) ? data : (data.data || []);
            }
        } catch (e) {
            console.error('Failed to fetch notifications', e);
            this.showToast('Failed to load notifications', 'error');
        }
    }

    private async markAllNotificationsRead() {
        try {
            const res = await fetch('/api/proxy/notification/seller/read-all', {
                method: 'PATCH',
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to mark all read');
        } catch (e) {
            console.error('Failed to mark all notifications read', e);
            this.showToast('Failed to mark all as read', 'error');
        }
    }

    private async markNotificationRead(id: string) {
        try {
            const res = await fetch(`/api/proxy/notification/seller/${id}/read`, {
                method: 'PATCH',
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to mark read');
        } catch (e) {
            console.error('Failed to mark notification read', e);
        }
    }

    private attachFloatingNotificationListener() {
        const notifBtn = this.root.querySelector('.floating-notif-btn');
        notifBtn?.addEventListener('click', async () => {
            this.openModal('Notifications', '<div class="loading-spinner">Loading...</div>');
            const modalBody = this.root.querySelector('.modal-body');

            if (modalBody) {
                await this.fetchNotifications();
                const notifications = this.apiData.notifications;

                if (notifications.length === 0) {
                    modalBody.innerHTML = '<div style="text-align:center; padding: 2rem; color: #64748b;">No notifications</div>';
                } else {
                    modalBody.innerHTML = `
                        <div style="display: flex; justify-content: flex-end; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0; margin-bottom: 0.5rem;">
                                <button id="mark-all-read" style="background: none; border: none; color: var(--primary-red); font-weight: 500; cursor: pointer; font-size: 0.875rem;">Mark All as Read</button>
                        </div>
                        <div class="notifications-list">
                            ${notifications.map((n: any) => `
                                <div class="notification-item" data-id="${n.id}" style="padding: 1rem; border-bottom: 1px solid #e2e8f0; ${n.status === 'UNREAD' ? 'background: #f0f9ff;' : 'background: transparent;'}; cursor: pointer;">
                                    <div style="font-weight: 600; margin-bottom: 0.25rem;">${n.title}</div>
                                    <div style="font-size: 0.875rem; color: #475569; margin-bottom: 0.5rem;">${n.message}</div>
                                    <div style="font-size: 0.75rem; color: #94a3b8;">${new Date(n.createdAt).toLocaleString()}</div>
                                </div>
                            `).join('')}
                        </div>
                        `;

                    // Attach Mark All Read listener
                    modalBody.querySelector('#mark-all-read')?.addEventListener('click', async () => {
                        await this.markAllNotificationsRead();
                        // Update UI
                        modalBody.querySelectorAll('.notification-item').forEach(item => {
                            (item as HTMLElement).style.background = 'transparent';
                        });
                        this.fetchUnreadCount();
                        this.showToast('All notifications marked as read', 'success');
                    });

                    // Attach click listeners to mark as read
                    modalBody.querySelectorAll('.notification-item').forEach(item => {
                        item.addEventListener('click', async (e) => {
                            const target = e.currentTarget as HTMLElement;
                            const id = target.dataset.id;
                            if (id) {
                                await this.markNotificationRead(id);
                                // Update UI to show read
                                if (target) target.style.background = 'transparent';
                                this.fetchUnreadCount(); // Update badge
                            }
                        });
                    });
                }
                // Hide confirm button in modal for this view
                const confirmBtn = this.root.querySelector('.confirm-modal') as HTMLElement;
                if (confirmBtn) confirmBtn.style.display = 'none';
            }
        });
    }

    private attachGlobalListeners() {
        document.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.closest('.mobile-toggle')) {
                this.toggleSidebar();
            }
            if (this.state.isSidebarOpen && !target.closest('.sidebar') && !target.closest('.mobile-toggle')) {
                this.toggleSidebar(false);
            }
        });
    }

    private toggleSidebar(force?: boolean) {
        this.state.isSidebarOpen = force !== undefined ? force : !this.state.isSidebarOpen;
        const sidebar = this.root.querySelector('.sidebar');
        if (sidebar) {
            if (this.state.isSidebarOpen) sidebar.classList.add('open');
            else sidebar.classList.remove('open');
        }
    }

    private renderLayout() {
        const username = this.apiData.currentUser?.username || 'Seller';
        const profilePicture = this.apiData.currentUser?.profilePicture;

        this.root.innerHTML = `
            <div class="admin-container">
                <aside class="sidebar">
                    <div class="sidebar-header">
                        <h2>${this.t('seller.sidebar.title')}</h2>
                    </div>
                    <ul class="sidebar-nav">
                        <li class="nav-item ${this.state.activeTab === 'Dashboard' ? 'active' : ''}" data-tab="Dashboard">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                            <span>${this.t('seller.sidebar.dashboard')}</span>
                        </li>
                        <li class="nav-item ${this.state.activeTab === 'My Billboards' ? 'active' : ''}" data-tab="My Billboards">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-presentation"><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>
                            <span>${this.t('seller.sidebar.my_billboards')}</span>
                        </li>
                        <li class="nav-item ${this.state.activeTab === 'My Transactions' ? 'active' : ''}" data-tab="My Transactions">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                            <span>${this.t('seller.sidebar.my_transactions')}</span>
                        </li>
                         <li class="nav-item ${this.state.activeTab === 'My Wallet' ? 'active' : ''}" data-tab="My Wallet">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wallet"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
                            <span>${this.t('seller.sidebar.my_wallet')}</span>
                        </li>
                        <li class="nav-item ${this.state.activeTab === 'My Profile' ? 'active' : ''}" data-tab="My Profile">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            <span>${this.t('seller.sidebar.my_profile')}</span>
                        </li>
                         <li class="nav-item ${this.state.activeTab === 'History' ? 'active' : ''}" data-tab="History">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-history"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
                            <span>${this.t('seller.sidebar.history')}</span>
                        </li>

                    </ul>
                    <div class="sidebar-footer">
                        <div class="user-profile-section">
                            <div class="user-avatar" style="overflow: hidden; display: flex; align-items: center; justify-content: center;">
                                ${profilePicture
                ? `<img src="/api/proxy/${profilePicture}" style="width: 100%; height: 100%; object-fit: cover;">`
                : username.charAt(0).toUpperCase()}
                            </div>
                            <div class="user-info">
                                <span class="user-name">${username}</span>
                                <span class="user-role">Seller</span>
                            </div>
                        </div>
                        <button class="logout-btn-sidebar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                            Logout
                        </button>
                    </div>
                </aside>
                <main class="main-content">
                    <header class="top-header">
                        <div style="display:flex; align-items:center; gap:1rem;">
                            <button class="mobile-toggle">☰</button>
                            <h1 class="page-title">Dashboard</h1>
                        </div>
                    </header>
                    <div id="content-area">
                        <div class="loading-spinner">Loading...</div>
                    </div>

                    <!-- Floating Notification Button -->
                    <button class="floating-notif-btn" title="Notifications">
                        <div class="notif-badge" style="display: none;">0</div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                    </button>
                </main>
            </div>
            <div class="toast-container"></div>
            <div id="modal-root" class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">Modal Title</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body"></div>
                    <div class="modal-footer">
                        <button class="btn btn-outline close-modal">Cancel</button>
                        <button class="btn btn-primary confirm-modal">Save</button>
                    </div>
                </div>
            </div>
        `;

        // The provided diff replaces renderSidebarNav content directly into renderLayout.
        // So, the call to this.renderSidebarNav() is no longer needed here.
        // this.renderSidebarNav();

        // Listeners
        this.root.querySelector('.logout-btn-sidebar')?.addEventListener('click', () => {
            authService.logout().then(() => window.location.href = '/login');
        });

        // const modalOverlay = this.root.querySelector('.modal-overlay');
        this.root.querySelectorAll('.modal-close, .close-modal').forEach(btn =>
            btn.addEventListener('click', () => this.closeModal())
        );

        this.root.querySelector('.confirm-modal')?.addEventListener('click', () => {
            if (this.currentModalAction) this.currentModalAction();
        });

        // Re-attach sidebar nav listeners since the HTML was re-rendered
        this.root.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const tab = item.getAttribute('data-tab') as ModuleName;
                this.setActiveTab(tab);
            });
        });
    }

    private googleMapsPromise: Promise<void> | null = null;
    private loadGoogleMapsScript(): Promise<void> {
        if (this.googleMapsPromise) return this.googleMapsPromise;
        this.googleMapsPromise = new Promise((resolve, reject) => {
            if ((window as any).google && (window as any).google.maps) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GMAP_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = (e) => reject(e);
            document.head.appendChild(script);
        });
        return this.googleMapsPromise;
    }

    private renderSidebarNav() {
        // This method is no longer needed as its content was moved to renderLayout
        // and the structure was changed from <nav> to <ul>.
        // The original instruction implies replacing the content of renderSidebarNav,
        // but the diff shows it being injected into renderLayout.
        // To maintain the original structure of calling renderSidebarNav,
        // I will keep this method but make it empty, as its content is now in renderLayout.
        // If the user intended to completely remove this method, that would be a different instruction.
    }

    private async setActiveTab(tab: ModuleName) {
        this.state.activeTab = tab;
        this.state.searchQuery = '';
        this.state.currentPage = 1;

        // Re-render sidebar nav to update active state
        // Since renderSidebarNav is now empty, we need to manually update the active class
        this.root.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
            if (item.getAttribute('data-tab') === tab) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        this.root.querySelector('.page-title')!.textContent = tab;

        if (tab === 'Dashboard') await this.fetchDashboardStats();
        else if (tab === 'My Billboards') await this.fetchMyBillboards();
        else if (tab === 'My Transactions') await this.fetchMyTransactions();
        else if (tab === 'My Wallet') { /* No specific fetch needed yet, or fetch wallet balance */ }
        else if (tab === 'My Profile') await this.fetchMyProfile();
        else if (tab === 'History') await this.fetchHistory();

        this.renderContent();

        if (window.innerWidth <= 1024) {
            this.toggleSidebar(false);
        }
    }

    private renderContent() {
        const container = this.root.querySelector('#content-area');
        if (!container) return;

        if (this.state.activeTab === 'Dashboard') {
            this.renderDashboardOverview(container);
        } else if (this.state.activeTab === 'My Profile') {
            this.renderMyProfile(container);
        } else if (this.state.activeTab === 'My Wallet') {
            this.renderWallet(container);
        } else {
            this.renderModule(container);
        }
    }

    private renderDashboardOverview(container: Element) {
        const stats = this.apiData.stats || {};
        const recentBillboards = this.apiData.billboards.slice(0, 5);

        const myBillboards = stats.myBillboards ?? (this.apiData.billboards.length || 0);
        const activeListings = stats.activeListings ?? 0;
        const rentedOrSold = stats.rentedOrSold ?? 0;
        const totalRevenue = stats.myRevenue ? Number(stats.myRevenue) : 0;

        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card" style="border-left: 4px solid #6366f1;">
                    <div class="stat-value">${myBillboards}</div>
                    <div class="stat-label">${this.t('seller.dashboard.my_billboards')}</div>
                </div>
                <div class="stat-card" style="border-left: 4px solid #3b82f6;">
                    <div class="stat-value">${activeListings}</div>
                    <div class="stat-label">${this.t('seller.dashboard.active_listings')}</div>
                </div>
                <div class="stat-card" style="border-left: 4px solid #f59e0b;">
                    <div class="stat-value">${rentedOrSold}</div>
                    <div class="stat-label">${this.t('seller.dashboard.rented_sold')}</div>
                </div>
                <div class="stat-card" style="border-left: 4px solid #10b981;">
                    <div class="stat-value">Rp ${totalRevenue.toLocaleString()}</div>
                    <div class="stat-label">${this.t('seller.dashboard.my_revenue')}</div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="table-container" style="margin-top:2rem;">
                <div style="padding: 1.5rem; border-bottom: 1px solid var(--border-color);">
                    <h3 style="margin:0; font-size: 1.25rem; font-weight: 700; color: var(--slate-dark);">${this.t('seller.dashboard.recent_billboards')}</h3>
                </div>
                ${this.generateTableHTML(recentBillboards, [
            { key: 'location', label: this.t('seller.form.location_name') },
            { key: 'status', label: this.t('seller.form.status') },
            {
                key: 'rentPrice',
                label: this.t('seller.form.price'),
                render: (_v: any, row: any) => {
                    const price = row.rentPrice || row.sellPrice;
                    return price ? `Rp ${Number(price).toLocaleString()}` : '-';
                }
            }
        ])}
            </div>
        `;
    }

    private renderWallet(container: Element) {
        // Placeholder Wallet UI
        const balance = this.apiData.profile?.walletBalance || 0;
        container.innerHTML = `
            <div style="background: #f1f5f9; padding: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 style="margin:0; color: var(--slate-dark);">${this.t('seller.wallet.title')}</h2>
                </div>

                <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border-radius: 16px; padding: 2.5rem; margin-bottom: 2rem; box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);">
                    <div style="font-size: 1.1rem; margin-bottom: 0.5rem; opacity: 0.9;">${this.t('seller.wallet.total_balance')}</div>
                    <div style="font-size: 3rem; font-weight: 700; margin-bottom: 2rem; letter-spacing: -0.02em;">Rp ${balance.toLocaleString()}</div>
                    <div style="display: flex; gap: 1rem;">
                        <button class="btn" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(4px); transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                            <span style="margin-right:0.5rem;">+</span> ${this.t('seller.wallet.top_up')}
                        </button>
                        <button class="btn" style="background: white; color: #2563eb; border: none; font-weight: 600; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                            <span style="margin-right:0.5rem;">↓</span> ${this.t('seller.wallet.withdraw')}
                        </button>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
                    <div class="card" style="background: white; padding: 2rem; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        <h3 style="margin:0 0 1.5rem 0; color: var(--slate-dark); font-size: 1.25rem;">${this.t('seller.wallet.wallet_info')}</h3>
                        <p style="color: var(--text-secondary); line-height: 1.7; font-size: 1.05rem;">
                            ${this.t('seller.wallet.wallet_desc')}
                        </p>
                    </div>
                     <div class="card" style="background: white; padding: 2rem; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                            <h3 style="margin:0; color: var(--slate-dark); font-size: 1.25rem;">${this.t('seller.wallet.payment_account')}</h3>
                             <span class="badge" style="background: #fee2e2; color: #b91c1c;">${this.t('seller.wallet.not_connected')}</span>
                        </div>
                        <button class="btn btn-outline" style="width:100%; justify-content:center; border-style:dashed;">+ Connect Bank</button>
                    </div>
                </div>
            </div>
        `;
    }

    private renderMyProfile(container: Element) {
        const p = this.apiData.profile || {};
        const c = this.apiData.currentUser || {};

        container.innerHTML = `
            <div style="padding: 0; width: 100%;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.5rem;">
                    <h3>${this.t('seller.profile.title')}</h3>
                    <button class="btn btn-outline" style="border-color: #fee2e2; color: #b91c1c; background:white;" id="delete-profile-btn">
                        ${this.t('seller.profile.delete_profile')}
                    </button>
                </div>

                <div style="display: grid; grid-template-columns: 3fr 2fr; gap: 1.5rem; align-items: start;">
                    
                    <!-- Section 1: Business Details (Seller Profile) - LEFT -->
                    <div class="card" style="background: #fff; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9;">
                             <h4 style="margin:0; color: var(--text-primary); font-size: 1.1rem;">${this.t('seller.profile.business_details')}</h4>
                             <span class="badge badge-info">Seller</span>
                        </div>
                        
                        <form id="seller-business-form">
                            <div class="form-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div class="form-group">
                                    <label class="form-label">${this.t('seller.form.full_name')}</label>
                                    <input type="text" class="form-control" name="fullname" value="${p.fullname || ''}" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">${this.t('seller.form.company_name')}</label>
                                    <input type="text" class="form-control" name="companyName" value="${p.companyName || ''}">
                                </div>
                            </div>

                            <div class="form-group" style="margin-bottom: 1rem;">
                                <label class="form-label">${this.t('seller.form.position')}</label>
                                <input type="text" class="form-control" name="position" value="${p.position || ''}" placeholder="e.g. Manager, Owner">
                            </div>
                            
                            <div class="form-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div class="form-group">
                                    <label class="form-label">${this.t('seller.form.ktp')}</label>
                                    <input type="text" class="form-control" name="ktp" value="${p.ktp || ''}">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">${this.t('seller.form.npwp')}</label>
                                    <input type="text" class="form-control" name="npwp" value="${p.npwp || ''}">
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">${this.t('seller.form.ktp_address')}</label>
                                <textarea class="form-control" name="ktpAddress" rows="2">${p.ktpAddress || ''}</textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label">${this.t('seller.form.office_address')}</label>
                                <textarea class="form-control" name="officeAddress" rows="2">${p.officeAddress || ''}</textarea>
                            </div>
                            
                            <div style="margin-top: 2rem; display:flex; justify-content: flex-end;">
                                <button type="submit" class="btn btn-primary">${this.t('seller.profile.update_business')}</button>
                            </div>
                        </form>
                    </div>

                    <!-- Section 2: User Account (Base User) - RIGHT -->
                    <div class="card" style="background: #fff; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                         <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9;">
                             <h4 style="margin:0; color: var(--text-primary); font-size: 1.1rem;">${this.t('seller.profile.user_account')}</h4>
                             <span class="badge" style="background:#f1f5f9; color:#64748b;">${this.t('seller.profile.login_info')}</span>
                        </div>

                         <form id="user-profile-form">
                            <div style="display:flex; flex-direction:column; align-items:center; margin-bottom: 1.5rem; text-align:center;">
                                <div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; background: #f8fafc; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); margin-bottom: 1rem; position: relative;">
                                    <img id="profile-preview-img" src="${c.profilePicture ? `/api/proxy/${c.profilePicture}` : `https://ui-avatars.com/api/?name=${c.username || 'User'}&background=random`}" style="width:100%; height:100%; object-fit:cover;">
                                </div>
                                <label for="profile-image-input" style="cursor:pointer; font-size:0.875rem; color:var(--primary-color); font-weight:500;">${this.t('seller.profile.change_picture')}</label>
                                <input type="file" name="file" id="profile-image-input" style="display:none;">
                            </div>

                            <div class="form-group">
                                <label class="form-label">${this.t('seller.form.username')}</label>
                                <input type="text" class="form-control" name="username" value="${c.username || ''}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">${this.t('seller.form.email')}</label>
                                <input type="email" class="form-control" name="email" value="${c.email || ''}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">${this.t('seller.form.phone')}</label>
                                <input type="text" class="form-control" name="phone" value="${c.phone || ''}">
                            </div>
                            
                            <div style="border-top: 1px dashed #e2e8f0; margin: 1.5rem 0; padding-top: 1.5rem;">
                                <div class="form-group">
                                    <label class="form-label">${this.t('seller.form.new_password')}</label>
                                    <div style="position: relative;">
                                        <input type="password" class="form-control" name="password" placeholder="${this.t('seller.form.leave_blank')}" style="padding-right: 2.5rem;">
                                        <button type="button" class="toggle-password" data-target="password" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #64748b; padding: 0.25rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">${this.t('seller.form.confirm_password')}</label>
                                    <div style="position: relative;">
                                        <input type="password" class="form-control" name="confirmPassword" placeholder="${this.t('seller.form.confirm_password')}" style="padding-right: 2.5rem;">
                                        <button type="button" class="toggle-password" data-target="confirmPassword" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #64748b; padding: 0.25rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary" style="width:100%;">${this.t('seller.profile.update_account')}</button>
                         </form>
                    </div>

                </div>
            </div>
        `;

        // --- Listener: User Account (PUT FormData) ---
        const userForm = container.querySelector('#user-profile-form');
        const imgInput = container.querySelector('#profile-image-input') as HTMLInputElement;
        const imgPreview = container.querySelector('#profile-preview-img') as HTMLImageElement;

        // Preview Image
        imgInput?.addEventListener('change', () => {
            if (imgInput.files && imgInput.files[0]) {
                imgPreview.src = URL.createObjectURL(imgInput.files[0]);
            }
        });

        // Toggle Password Visibility
        container.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetName = btn.getAttribute('data-target');
                const input = container.querySelector(`input[name="${targetName}"]`) as HTMLInputElement;
                if (input) {
                    if (input.type === 'password') {
                        input.type = 'text';
                        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>';
                    } else {
                        input.type = 'password';
                        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>';
                    }
                }
            });
        });

        userForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            this.clearFieldErrors(form);

            const rawFormData = new FormData(form);

            // Validation
            const p1 = rawFormData.get('password') as string;
            const p2 = rawFormData.get('confirmPassword') as string;

            if (p1 && p1 !== p2) {
                this.showToast('Passwords do not match', 'error');
                return;
            }

            // Construct clean FormData
            const payload = new FormData();

            // Append fields manually to ensure exclude/include logic
            const username = rawFormData.get('username') as string;
            const email = rawFormData.get('email') as string;
            const phone = rawFormData.get('phone') as string;

            payload.append('username', username);
            payload.append('email', email);
            payload.append('phone', phone || '');

            if (p1) {
                payload.append('password', p1);
            }

            // File handling
            const fileInput = rawFormData.get('file') as File;
            if (fileInput && fileInput.size > 0) {
                payload.append('file', fileInput);
            }

            this.showToast('Updating user account...', 'info');

            try {
                const res = await fetch('/api/proxy/user/me', {
                    method: 'PUT',
                    body: payload,
                    credentials: 'include'
                });
                const json = await res.json();
                if (res.ok) {
                    this.openConfirmModal('Success', 'User account updated!', async () => {
                        this.closeModal();
                        await this.fetchCurrentUser();
                        await this.fetchMyProfile();
                        this.renderContent();
                    }, 'success');
                } else {
                    // Check if message is an object (field-specific errors)
                    if (json.message && typeof json.message === 'object' && !Array.isArray(json.message)) {
                        this.displayFieldErrors(form, json.message);
                        this.showToast('Please check the form for errors', 'error');
                    } else {
                        // Fallback generic error
                        let msg = json.message || 'Update failed';
                        if (Array.isArray(msg)) msg = msg.join(', ');
                        this.openConfirmModal('Error', msg, async () => {
                            this.closeModal();
                        }, 'error');
                    }
                }
            } catch (err) {
                console.error(err);
                this.openConfirmModal('Error', 'Error updating user account', async () => {
                    this.closeModal();
                }, 'error');
            }
        });


        // --- Listener: Seller Business (PATCH JSON) ---
        const sellerForm = container.querySelector('#seller-business-form');
        sellerForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            this.clearFieldErrors(form);

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            this.showToast('Updating business details...', 'info');

            try {
                const res = await fetch('/api/proxy/seller/me', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                    credentials: 'include'
                });

                const json = await res.json();

                if (res.ok) {
                    this.openConfirmModal('Success', 'Business details updated!', async () => {
                        this.closeModal();
                        await this.fetchCurrentUser();
                        await this.fetchMyProfile();
                        this.renderContent();
                    }, 'success');
                } else {
                    // Check if message is an object (field-specific errors)
                    if (json.message && typeof json.message === 'object' && !Array.isArray(json.message)) {
                        this.displayFieldErrors(form, json.message);
                        this.showToast('Please check the form for errors', 'error');
                    } else {
                        // Generic fallback
                        let msg = 'Failed to update profile';
                        if (json.message) {
                            if (typeof json.message === 'string') {
                                msg = json.message;
                            } else if (Array.isArray(json.message)) {
                                msg = json.message.join(', ');
                            }
                        }
                        this.openConfirmModal('Error', msg, async () => {
                            this.closeModal();
                        }, 'error');
                    }
                }
            } catch (err) {
                console.error(err);
                this.openConfirmModal('Error', 'Error updating business details', async () => {
                    this.closeModal();
                }, 'error');
            }
        });

        container.querySelector('#delete-profile-btn')?.addEventListener('click', () => {
            this.handleDeleteProfile();
        });
    }

    private handleDeleteProfile() {
        this.openModal(
            'Delete Profile',
            `
            <div style="text-align: center; padding: 2rem 1rem;">
                <p style="margin-bottom: 2rem; color: #64748b; font-size: 1.1rem; line-height: 1.6;">
                    To delete your seller profile and revert to a buyer account,<br>please contact our admin.
                </p>
                <a href="https://wa.me/+62817270898" target="_blank" 
                   style="display: inline-flex; align-items: center; gap: 0.5rem; background-color: #25D366; color: white; padding: 0.75rem 1.5rem; border-radius: 50px; text-decoration: none; font-weight: 600; transition: opacity 0.2s; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="0" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Contact Admin on WhatsApp
                </a>
            </div>
            `
        );
    }

    private renderModule(container: Element) {
        let config: ModuleConfig<any>;
        if (this.state.activeTab === 'My Billboards') {
            config = {
                data: this.apiData.billboards,
                columns: [
                    { key: 'location', label: this.t('seller.table.location') },
                    { key: 'status', label: this.t('seller.table.status') },
                    { key: 'rentPrice', label: this.t('seller.table.rent_price'), render: (v) => v ? `Rp ${Number(v).toLocaleString()}` : '-' },
                    { key: 'sellPrice', label: this.t('seller.table.sell_price'), render: (v) => v ? `Rp ${Number(v).toLocaleString()}` : '-' },
                    {
                        key: 'actions', label: this.t('seller.table.actions'), render: (v, row) => `
                        <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                            <button class="action-view-billboard" data-id="${row.id}" title="${this.t('seller.common.view_detail')}"
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #e0f2fe; color: #0369a1; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                            ${row.status === 'Available' ? `
                            <button class="action-edit" data-id="${row.id}" title="${this.t('seller.modal.edit_billboard')}"
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fef3c7; color: #b45309; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                            </button>` : ''}
                            <button class="action-delete" data-id="${row.id}" title="${this.t('seller.modal.delete_billboard')}"
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                        </div>
                     `}
                ],
                filters: []
            };
        } else if (this.state.activeTab === 'My Transactions') {
            config = {
                data: this.apiData.transactions, // assuming transactions are sales
                columns: [
                    { key: 'id', label: this.t('seller.table.id'), render: (v) => v ? v.substring(0, 8).toUpperCase() : '-' },
                    { key: 'totalPrice', label: this.t('seller.table.total'), render: (v) => `Rp ${Number(v).toLocaleString()}` },
                    { key: 'status', label: this.t('seller.table.status') },
                    { key: 'createdAt', label: this.t('seller.table.date'), render: (v) => new Date(v).toLocaleDateString() },
                    {
                        key: 'actions', label: this.t('seller.table.actions'), render: (v, row) => `
                        <button class="btn btn-sm btn-outline action-view-transaction" data-id="${row.billboardId || row.id}">${this.t('seller.common.view_detail')}</button>
                     `}
                ],
                filters: []
            };
        } else if (this.state.activeTab === 'History') {
            config = {
                data: this.apiData.history,
                columns: [
                    { key: 'createdAt', label: this.t('seller.table.date'), render: (v) => new Date(v).toLocaleDateString() },
                    { key: 'transactionId', label: this.t('seller.table.transaction_id'), render: (v) => v ? v.slice(0, 8) + '...' : '-' },
                    {
                        key: 'pricing', label: this.t('seller.table.details'), render: (v, row) => {
                            const bbName = row.pricing?.billboard ? `${row.pricing.billboard.cityName}, ${row.pricing.billboard.size}` : 'Unknown Billboard';
                            return `<div>${bbName}</div>`;
                        }
                    },
                    {
                        key: 'pricing', label: this.t('seller.table.amount'), render: (v, row) => {
                            const amt = row.pricing?.prices?.total || 0;
                            return `Rp ${Number(amt).toLocaleString()}`;
                        }
                    },
                    {
                        key: 'transaction', label: this.t('seller.table.status'), render: (v, row) => {
                            // The api response shows transaction status inside the nested transaction object
                            const status = row.transaction?.status || 'UNKNOWN';
                            const color = status === 'PAID' ? 'green' : status === 'PENDING' ? 'orange' : 'red';
                            return `<span class="badge" style="background:${color}; color:white;">${status}</span>`;
                        }
                    },
                    {
                        key: 'actions', label: this.t('seller.table.actions'), render: (v, row) => `
                        <button class="btn btn-sm btn-outline action-view-history" data-id="${row.id}">${this.t('seller.common.view_detail')}</button>
                     `}
                ],
                filters: []
            };
        } else {
            return;
        }

        // Filtering and Pagination Logic
        const filteredData = config.data; // Add filtering logic if needed
        const paginatedData = filteredData; // Add pagination logic if needed

        container.innerHTML = `
            <div class="table-container">
                <div class="table-controls">
                    <h3 style="margin:0;">${this.state.activeTab === 'My Billboards' ? this.t('seller.dashboard.my_billboards') : this.t('seller.sidebar.' + this.state.activeTab.toLowerCase().replace(' ', '_')) || this.state.activeTab}</h3>
                    <div style="display: flex; gap: 0.5rem;">
                        ${this.state.activeTab === 'My Billboards' ? `<button class="btn btn-primary add-new-btn">${this.t('seller.common.create_billboard')}</button>` : ''}
                        ${(this.state.activeTab === 'My Billboards' || this.state.activeTab === 'My Transactions') ? `<button class="btn btn-outline export-excel-btn">${this.t('seller.common.export_excel')}</button>` : ''}
                    </div>
                </div>
                ${this.generateTableHTML(paginatedData, config.columns)}
            </div>
         `;

        this.attachModuleListeners(container);
    }

    private attachModuleListeners(container: Element) {
        container.querySelector('.add-new-btn')?.addEventListener('click', () => {
            this.openCreateBillboardModal();
        });

        container.querySelector('.export-excel-btn')?.addEventListener('click', () => {
            const data = this.state.activeTab === 'My Billboards' ? this.apiData.billboards : this.apiData.transactions;
            const filename = `${this.state.activeTab.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
            this.exportToExcel(data, filename);
        });

        // Billboards View
        container.querySelectorAll('.action-view-billboard').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLElement).dataset.id;
                if (id) this.openViewBillboardModal(id);
            });
        });

        // Transactions View
        container.querySelectorAll('.action-view-transaction').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLElement).dataset.id;
                if (id) this.openViewTransactionModal(id);
            });
        });

        // History View
        container.querySelectorAll('.action-view-history').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLElement).dataset.id;
                // Reuse transaction modal if compatible or create new
                // For now, logging, or could reuse transaction view if it expects transaction ID
                // The history item has a transactionId. The transaction view likely takes transactionId.
                const historyItem = this.apiData.history.find(h => h.id === id);
                if (historyItem && historyItem.transactionId) {
                    this.openViewTransactionModal(historyItem.transactionId);
                }
            });
        });


        container.querySelectorAll('.action-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLElement).dataset.id;
                if (id) this.openEditBillboardModal(id);
            });
        });

        container.querySelectorAll('.action-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLElement).dataset.id;
                if (id) this.handleDeleteBillboard(id);
            });
        });
    }

    private generateTableHTML(data: any[], columns: ColumnConfig<any>[]) {
        if (!data || data.length === 0) return '<div style="padding:1.5rem;">No data found</div>';

        return `
            <table>
                <thead>
                    <tr>${columns.map(c => `<th>${c.label}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>${columns.map(c => `<td>${c.render ? c.render(row[c.key as string], row) : (row[c.key as string] || '-')}</td>`).join('')}</tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // --- Export Helper ---
    private exportToExcel(data: any[], filename: string) {
        if (!data || data.length === 0) {
            this.showToast('No data to export', 'info');
            return;
        }

        try {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, `${filename}.xlsx`);
            this.showToast('Export successful', 'success');
        } catch (error) {
            console.error('Export error:', error);
            this.showToast('Failed to export data', 'error');
        }
    }

    // --- Billboard Modals ---

    private openCreateBillboardModal() {
        this.openModal('Create New Billboard', this.renderBillboardForm('create'), () => this.handleCreateBillboardSubmit(), 'modal-lg');

        this.attachBillboardFormListeners('create');
        setTimeout(() => this.initBillboardMap('create'), 100);
    }

    private autofillCityProvince(components: any[], prefix: string) {
        const provinceInput = document.getElementById(`${prefix}-provinceId`) as HTMLInputElement;
        const cityInput = document.getElementById(`${prefix}-cityId`) as HTMLInputElement;
        // infoSpan was part of old form, likely removed or needs re-adding if we want feedback.
        // For now, let's trust the toast or basic value update.

        if (!provinceInput || !cityInput) return;

        // Reset
        provinceInput.value = '';
        cityInput.value = '';

        let foundProvName = '';
        let foundCityName = '';

        for (const comp of components) {
            if (comp.types.includes('administrative_area_level_1')) {
                foundProvName = comp.long_name;
            }
            if (comp.types.includes('administrative_area_level_2')) {
                foundCityName = comp.long_name;
            }
        }

        if (foundProvName) {
            const provinces = this.apiData.provinces || [];
            // Try exact match first
            let matchedProv = provinces.find((p: any) => p.name.toLowerCase() === foundProvName.toLowerCase());

            // Try contains if not exact
            if (!matchedProv) {
                matchedProv = provinces.find((p: any) =>
                    p.name.toLowerCase().includes(foundProvName.toLowerCase()) ||
                    foundProvName.toLowerCase().includes(p.name.toLowerCase())
                );
            }

            // Common mappings for Indonesia
            if (!matchedProv && foundProvName === 'East Java') matchedProv = provinces.find((p: any) => p.name === 'JAWA TIMUR');
            if (!matchedProv && foundProvName === 'West Java') matchedProv = provinces.find((p: any) => p.name === 'JAWA BARAT');
            if (!matchedProv && foundProvName === 'Central Java') matchedProv = provinces.find((p: any) => p.name === 'JAWA TENGAH');
            if (!matchedProv && foundProvName === 'Special Region of Yogyakarta') matchedProv = provinces.find((p: any) => p.name === 'DI YOGYAKARTA');
            if (!matchedProv && foundProvName === 'Jakarta') matchedProv = provinces.find((p: any) => p.name.includes('DKI'));

            if (matchedProv) {
                provinceInput.value = matchedProv.id;

                // Update UI trigger text if using custom dropdown
                const provTrigger = document.getElementById('province-trigger'); // This ID might be generic?
                // In renderBillboardForm line 829: `div class="custom-select-trigger" id="province-trigger"`
                // If we have multiple forms or prefixes, ID collision!
                // renderBillboardForm unfortunately uses hardcoded IDs for triggers?
                // Step 215: `<div class="custom-select-trigger" id="province-trigger">` -> YES, ID collision if prefix changes but IDs don't.
                // Actually `renderBillboardForm` is used for `edit` OR `create`. Only one modal open at a time. So ID collision strictly not an issue for "one modal at a time".
                // However, `province-trigger` is fine.
                if (provTrigger) provTrigger.textContent = matchedProv.name;

                // Now fetch cities for this province to find the city ID
                this.fetchCities(matchedProv.id).then(cities => {
                    if (foundCityName) {
                        let matchedCity = cities.find((c: any) => c.name.toLowerCase() === foundCityName.toLowerCase());
                        if (!matchedCity) {
                            matchedCity = cities.find((c: any) => c.name.toLowerCase().includes(foundCityName.toLowerCase()));
                        }

                        if (matchedCity) {
                            cityInput.value = matchedCity.id;
                            const cityTrigger = document.getElementById('city-trigger');
                            if (cityTrigger) cityTrigger.textContent = matchedCity.name;

                            this.showToast(`Location detected: ${matchedCity.name}, ${matchedProv.name}`, 'success');
                        }
                    }
                });
            }
        }
    }

    private async openEditBillboardModal(id: string) {
        this.openModal('Loading Billboard Details...', '<div class="loading-spinner">Loading...</div>');
        const confirmBtn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
        if (confirmBtn) confirmBtn.style.display = 'none';

        try {
            // Fetch necessary data
            const [billboardRes] = await Promise.all([
                fetch(`/api/proxy/billboard/detail/${id}`, { credentials: 'include' }),
                this.apiData.provinces.length === 0 ? this.fetchProvinces().then(() => ({ ok: true })) : Promise.resolve({ ok: true }),
                this.apiData.categories.length === 0 ? this.fetchCategories().then(() => ({ ok: true })) : Promise.resolve({ ok: true })
            ]);

            const billboardJson = await billboardRes.json();

            if (billboardJson.status && billboardJson.data) {
                const billboard = billboardJson.data;
                this.openModal('Edit Billboard', this.renderBillboardForm('edit', billboard), () => this.handleEditBillboardSubmit(id), 'modal-lg');

                // Fetch Cities for this province immediately to populate dropdown
                if (billboard.provinceId && this.apiData.cities.length === 0) {
                    await this.fetchCities(billboard.provinceId);
                }

                this.attachBillboardFormListeners('edit', billboard);

                // Initialize Map
                setTimeout(() => this.initBillboardMap('edit', billboard), 100);

            } else {
                this.showToast('Failed to load billboard data', 'error');
                this.closeModal();
            }
        } catch (e) {
            console.error(e);
            this.showToast('Error loading details', 'error');
            this.closeModal();
        }
    }

    private renderBillboardForm(prefix: string, billboard: any = {}) {
        // Prepare image previews
        // let images: string[] = [];
        // if (Array.isArray(billboard.image)) images = billboard.image.map((img: any) => img.url || img);
        // else if (billboard.image) images = [billboard.image];

        return `
            <form id="${prefix}-billboard-form">
                <style>
                    .custom-select-container { position: relative; }
                    .custom-select-trigger { padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; background: #fff; display: flex; justify-content: space-between; align-items: center; }
                    .custom-options-container { position: absolute; top: 100%; left: 0; right: 0; background: #fff; border: 1px solid var(--border-color); border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); z-index: 50; display: none; max-height: 200px; overflow-y: auto; margin-top: 4px; }
                    .custom-options-container.open { display: block; }
                    .custom-search-input { width: 100%; padding: 0.75rem; border: none; border-bottom: 1px solid var(--border-color); outline: none; }
                    .custom-option { padding: 0.75rem; cursor: pointer; transition: background 0.1s; }
                    .custom-option:hover { background: #f1f5f9; }
                    .image-manager-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 1rem; margin-top: 1rem; }
                    .image-item { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
                    .image-item img { width: 100%; height: 100%; object-fit: cover; }
                    .image-item .remove-btn { position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; background: rgba(255,255,255,0.9); border-radius: 50%; color: #ef4444; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid #e2e8f0; transition: all 0.2s; }
                    .image-item .remove-btn:hover { background: #fee2e2; }
                </style>

                <!-- Section 1: Basic Information -->
                <div class="form-section">
                    <div class="section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        ${this.t('seller.form.category')} & Status
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">${this.t('seller.form.category')}</label>
                            <select id="${prefix}-categoryId" name="categoryId" class="form-control" required>
                                <option value="" disabled ${!billboard.categoryId ? 'selected' : ''}>${this.t('seller.form.select')}</option>
                                ${this.apiData.categories.map((c: any) => `<option value="${c.id}" ${billboard.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">${this.t('seller.form.status')}</label>
                            <select id="${prefix}-status" name="status" class="form-control" required>
                                <option value="Available" ${billboard.status === 'Available' ? 'selected' : ''}>${this.t('seller.form.available')}</option>
                                <option value="NotAvailable" ${billboard.status === 'NotAvailable' ? 'selected' : ''}>${this.t('seller.form.not_available')}</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group" style="margin-top: 1rem;">
                        <label class="form-label">${this.t('seller.form.mode')}</label>
                        <select id="${prefix}-mode" name="mode" class="form-control" required>
                            <option value="" ${!billboard.mode ? 'selected' : ''} disabled>${this.t('seller.form.select')}</option>
                            <option value="Rent" ${billboard.mode === 'Rent' ? 'selected' : ''}>${this.t('seller.form.rent')}</option>
                            <option value="Buy" ${billboard.mode === 'Buy' ? 'selected' : ''}>${this.t('seller.form.buy')}</option>
                        </select>
                    </div>
                </div>

                <!-- Section 2: Location -->
                <div class="form-section">
                     <div class="section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        ${this.t('seller.form.location_details')}
                    </div>

                    <!-- Map Container -->
                    <div class="form-group">
                        <label class="form-label" style="display:flex; justify-content:space-between;">
                            <span>${this.t('seller.form.map_location')}</span>
                            <span style="font-size:0.8rem; font-weight:normal; color:var(--text-secondary);">Drag marker to set exact position</span>
                        </label>
                        <input id="${prefix}-gmap-search" type="text" class="form-control" placeholder="Search location..." style="margin-bottom: 0.5rem;" />
                        <div id="${prefix}-gmap-canvas" style="width: 100%; height: 320px; border-radius: 8px; border: 1px solid var(--border-color);"></div>
                        <input type="hidden" id="${prefix}-latitude" name="latitude" value="${billboard.latitude || ''}">
                        <input type="hidden" id="${prefix}-longitude" name="longitude" value="${billboard.longitude || ''}">
                        <input type="hidden" id="${prefix}-formattedAddress" name="formattedAddress" value="${billboard.formattedAddress || ''}" />
                        <input type="hidden" id="${prefix}-gPlaceId" name="gPlaceId" value="${billboard.gPlaceId || ''}" />
                        <textarea id="${prefix}-addressComponents" name="addressComponents" style="display:none;">${JSON.stringify(billboard.addressComponents || [])}</textarea>
                        <textarea id="${prefix}-mapViewport" name="mapViewport" style="display:none;">${JSON.stringify(billboard.mapViewport || {})}</textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label">${this.t('seller.form.location_name')}</label>
                        <input type="text" id="${prefix}-location" name="location" class="form-control" value="${billboard.location || ''}" required placeholder="Name of the location (e.g. Simpang Lima Billboard)" />
                    </div>

                    <div class="form-grid">
                        <div class="form-group" id="province-container">
                            <label class="form-label">${this.t('seller.form.province')}</label>
                            <input type="hidden" id="${prefix}-provinceId" name="provinceId" value="${billboard.provinceId || ''}">
                            <div class="custom-select-container">
                                <div class="custom-select-trigger" id="province-trigger">
                                    ${billboard.provinceName || (billboard.provinceId ? (this.apiData.provinces.find((p: any) => p.id === billboard.provinceId)?.name || this.t('seller.form.select_province')) : this.t('seller.form.select_province'))}
                                </div>
                                <div class="custom-options-container">
                                    <input type="text" class="custom-search-input" placeholder="${this.t('seller.form.search_province')}">
                                    <div class="custom-options-list"></div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group" id="city-container">
                            <label class="form-label">${this.t('seller.form.city')}</label>
                            <input type="hidden" id="${prefix}-cityId" name="cityId" value="${billboard.cityId || ''}">
                             <div class="custom-select-container">
                                <div class="custom-select-trigger" id="city-trigger">
                                    ${billboard.cityName || (billboard.cityId ? (this.apiData.cities.find((c: any) => c.id === billboard.cityId)?.name || this.t('seller.form.select_city')) : this.t('seller.form.select_city'))}
                                </div>
                                <div class="custom-options-container">
                                    <input type="text" class="custom-search-input" placeholder="${this.t('seller.form.search_city')}">
                                    <div class="custom-options-list"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">${this.t('seller.form.address')}</label>
                        <textarea id="${prefix}-address" name="address" class="form-control" rows="2" required placeholder="Full, detailed street address">${billboard.address || ''}</textarea>
                    </div>
                </div>

                <!-- Section 3: Specifications -->
                <div class="form-section">
                    <div class="section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings-2"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
                        ${this.t('seller.form.specifications')}
                    </div>
                    
                    <div class="form-grid">
                         <div class="form-group">
                            <label class="form-label">${this.t('seller.form.size')}</label>
                            <select id="${prefix}-size-select" class="form-control" style="margin-bottom: 0.5rem;" required>
                                <option value="">${this.t('seller.form.select')}</option>
                                <option value="4x6m">4x6m</option>
                                <option value="4x8m">4x8m</option>
                                <option value="5x10m">5x10m</option>
                                <option value="6x12m">6x12m</option>
                                <option value="8x16m">8x16m</option>
                                <option value="10x5m">10x5m</option>
                                <option value="20x10m">20x10m</option>
                                <option value="Custom">Custom</option>
                            </select>
                            <input type="text" id="${prefix}-size" name="size" class="form-control" value="${billboard.size || ''}" placeholder="e.g. 3x3m" style="display: none;" required />
                        </div>
                         <div class="form-group">
                            <label class="form-label">${this.t('seller.form.orientation')}</label>
                            <select id="${prefix}-orientation" name="orientation" class="form-control" required>
                                <option value="Vertical" ${billboard.orientation === 'Vertical' ? 'selected' : ''}>Vertical</option>
                                <option value="Horizontal" ${billboard.orientation === 'Horizontal' ? 'selected' : ''}>Horizontal</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">${this.t('seller.form.lighting')}</label>
                            <select id="${prefix}-lighting" name="lighting" class="form-control" required>
                                <option value="Frontlite" ${billboard.lighting === 'Frontlite' ? 'selected' : ''}>Frontlite</option>
                                <option value="Backlite" ${billboard.lighting === 'Backlite' ? 'selected' : ''}>Backlite</option>
                                <option value="None" ${billboard.lighting === 'None' ? 'selected' : ''}>None</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">${this.t('seller.form.display_type')}</label>
                             <select id="${prefix}-display" name="display" class="form-control" required>
                                <option value="OneSide" ${billboard.display === 'OneSide' ? 'selected' : ''}>One Side</option>
                                <option value="TwoSides" ${billboard.display === 'TwoSides' ? 'selected' : ''}>Two Sides</option>
                                <option value="ThreeSides" ${billboard.display === 'ThreeSides' ? 'selected' : ''}>Three Sides</option>
                                <option value="FourSides" ${billboard.display === 'FourSides' ? 'selected' : ''}>Four Sides</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">${this.t('seller.form.land_ownership')}</label>
                        <select id="${prefix}-landOwnership" name="landOwnership" class="form-control" required>
                            <option value="State" ${billboard.landOwnership === 'State' ? 'selected' : ''}>State</option>
                            <option value="Private" ${billboard.landOwnership === 'Private' ? 'selected' : ''}>Private</option>
                        </select>
                    </div>

                    <div class="form-group">
                         <label class="form-label">${this.t('seller.form.description')}</label>
                         <textarea id="${prefix}-description" name="description" class="form-control" rows="3" placeholder="${this.t('seller.form.description')}...">${billboard.description || ''}</textarea>
                    </div>
                </div>

                <!-- Section 4: Media -->
                <div class="form-section">
                     <div class="section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        ${this.t('seller.form.images')}
                    </div>

                    <div class="form-group">
                        <div id="image-manager-container" class="image-manager-grid">
                            <!-- Images rendered here -->
                        </div>
                        <div class="upload-zone-mini" id="${prefix}-upload-zone" style="margin-top: 1rem; padding: 2rem; border: 2px dashed var(--border-color); border-radius: 8px; text-align: center; cursor: pointer; background: var(--slate-light); transition: all 0.2s;">
                            <input type="file" id="${prefix}-images-input" multiple accept="image/*" style="display:none;">
                            <div style="font-size: 1rem; color: var(--slate-dark); font-weight: 600;">${this.t('seller.form.click_to_add')}</div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem; line-height: 1.5;">
                                Max 10 files • Max 2MB size<br>
                                Supported: png, jpg, jpeg, webp
                            </div>
                        </div>
                    </div>
                </div>

                 <!-- Section 5: Financials -->
                 <div class="form-section">
                    <div class="section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-banknote"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                        ${this.t('seller.form.pricing')} & SKU
                    </div>
                    
                    <div class="form-grid">
                         <div id="rent-price-container" class="form-group" style="display: none;">
                            <label class="form-label">${this.t('seller.form.rent_price')}</label>
                            <div style="position:relative;">
                                <span style="position:absolute; left:0.75rem; top:50%; transform:translateY(-50%); color:var(--text-secondary); font-weight:600;">Rp</span>
                                <input type="number" id="${prefix}-rentPrice" name="rentPrice" class="form-control" value="${billboard.rentPrice || 0}" style="padding-left: 2.5rem;" />
                            </div>
                        </div>
                        <div id="sell-price-container" class="form-group" style="display: none;">
                            <label class="form-label">${this.t('seller.form.sell_price')}</label>
                           <div style="position:relative;">
                                <span style="position:absolute; left:0.75rem; top:50%; transform:translateY(-50%); color:var(--text-secondary); font-weight:600;">Rp</span>
                                <input type="number" id="${prefix}-sellPrice" name="sellPrice" class="form-control" value="${billboard.sellPrice || 0}" style="padding-left: 2.5rem;" />
                            </div>
                        </div>
                    </div>

                    <div class="form-grid">
                         <div class="form-group">
                            <label class="form-label">${this.t('seller.form.tax')}</label>
                            <select id="${prefix}-tax" name="tax" class="form-control">
                                <option value="IncludePPH" ${billboard.tax === 'IncludePPH' ? 'selected' : ''}>${this.t('seller.form.include_pph')}</option>
                                <option value="NotIncludePPHYet" ${billboard.tax === 'NotIncludePPHYet' ? 'selected' : ''}>${this.t('seller.form.exclude_pph')}</option>
                            </select>
                        </div>
                         <div class="form-group">
                             <label class="form-label">${this.t('seller.form.service_price')}</label>
                             <div style="position:relative;">
                                <span style="position:absolute; left:0.75rem; top:50%; transform:translateY(-50%); color:var(--text-secondary); font-weight:600;">Rp</span>
                                <input type="number" id="${prefix}-servicePrice" name="servicePrice" class="form-control" value="${billboard.servicePrice || 0}" required style="padding-left: 2.5rem;" />
                            </div>
                        </div>
                    </div>

                    <div class="form-group" style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px dashed var(--border-color);">
                        <label class="form-label">${this.t('seller.form.sku')}</label>
                        ${!billboard.id ? `
                            <div style="display: flex; gap: 1.5rem; margin-bottom: 0.75rem;">
                                <label style="cursor:pointer; display:flex; align-items:center; gap:0.5rem; font-weight:500;">
                                    <input type="radio" name="sku-method" value="auto" checked> Generate Automatically
                                </label>
                                <label style="cursor:pointer; display:flex; align-items:center; gap:0.5rem; font-weight:500;">
                                    <input type="radio" name="sku-method" value="manual"> Fill Manually
                                </label>
                            </div>
                        ` : ''}
                        <input type="text" id="${prefix}-sku" name="sku" class="form-control" value="${billboard.sku || ''}" placeholder="Example: BB-2311-XXXX" ${!billboard.id ? 'disabled' : ''}>
                        <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.25rem;">
                            Unique identifier for this billboard. Auto-generated format: BB-YYMM-RAND.
                        </div>
                    </div>
                 </div>
                 
                 <!-- Hidden Submit Button Wrapper (Triggered externally) -->
                 <button type="submit" style="display:none;"></button>
            </form>
        `;
    }

    private attachBillboardFormListeners(prefix: string, billboard: any = {}) {
        const form = document.querySelector(`#${prefix}-billboard-form`) as HTMLElement;
        if (!form) return;

        // -- SKU Logic (Only for create) --
        if (!billboard.id) {
            const skuInput = form.querySelector(`#${prefix}-sku`) as HTMLInputElement;
            const skuRadios = form.querySelectorAll('input[name="sku-method"]');

            const generateSKU = () => {
                const date = new Date();
                const yy = date.getFullYear().toString().slice(-2);
                const mm = (date.getMonth() + 1).toString().padStart(2, '0');
                const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
                return `BB-${yy}${mm}-${random}`;
            };

            const handleSkuChange = () => {
                const selected = (form.querySelector('input[name="sku-method"]:checked') as HTMLInputElement)?.value;
                if (selected === 'auto') {
                    skuInput.value = generateSKU();
                    skuInput.disabled = true;
                } else {
                    skuInput.value = '';
                    skuInput.disabled = false;
                    skuInput.focus();
                }
            };

            skuRadios.forEach(r => r.addEventListener('change', handleSkuChange));
            // Init
            handleSkuChange();
        }


        // -- Price Logic --
        const modeSelect = form.querySelector(`#${prefix}-mode`) as HTMLSelectElement;
        const rentContainer = form.querySelector('#rent-price-container') as HTMLElement;
        const sellContainer = form.querySelector('#sell-price-container') as HTMLElement;

        const updatePriceVisibility = () => {
            const mode = modeSelect.value;
            if (rentContainer) rentContainer.style.display = 'none';
            if (sellContainer) sellContainer.style.display = 'none';

            if (mode === 'Rent') {
                if (rentContainer) rentContainer.style.display = 'block';
                // if (sellInput) sellInput.value = '0'; // Optional: clear other val
            } else if (mode === 'Buy') {
                if (sellContainer) sellContainer.style.display = 'block';
                // if (rentInput) rentInput.value = '0';
            }
        };

        if (modeSelect) {
            modeSelect.addEventListener('change', updatePriceVisibility);
            updatePriceVisibility(); // Init
        }

        // -- Dropdowns --
        const provinceContainer = form.querySelector('#province-container') as HTMLElement;
        if (provinceContainer) {
            this.setupSearchableDropdown(
                provinceContainer,
                this.apiData.provinces,
                this.t('seller.form.select_province'),
                async (id) => {
                    const provInput = form.querySelector(`#${prefix}-provinceId`) as HTMLInputElement;
                    if (provInput) provInput.value = id;

                    // Reset city
                    const cityInput = form.querySelector(`#${prefix}-cityId`) as HTMLInputElement;
                    if (cityInput) cityInput.value = '';
                    const cityTrigger = form.querySelector('#city-trigger') as HTMLElement;
                    if (cityTrigger) cityTrigger.textContent = this.t('seller.form.select_city');

                    // Fetch cities
                    const cities = await this.fetchCities(id);
                    this.apiData.cities = cities; // update local cache

                    const cityContainer = form.querySelector('#city-container') as HTMLElement;
                    if (cityContainer) {
                        const list = cityContainer.querySelector('.custom-options-list');
                        if (list) list.innerHTML = '';

                        this.setupSearchableDropdown(
                            cityContainer,
                            cities,
                            this.t('seller.form.select_city'),
                            (cityId) => {
                                const cInput = form.querySelector(`#${prefix}-cityId`) as HTMLInputElement;
                                if (cInput) cInput.value = cityId;
                            }
                        );
                    }
                }
            );
        }

        const cityContainer = form.querySelector('#city-container') as HTMLElement;
        if (cityContainer) {
            const provId = (form.querySelector(`#${prefix}-provinceId`) as HTMLInputElement)?.value;
            let cities = this.apiData.cities;
            if (provId) {
                cities = cities.filter((c: any) => c.provinceId == provId);
            }

            this.setupSearchableDropdown(
                cityContainer,
                cities,
                this.t('seller.form.select_city'),
                (cityId) => {
                    const cInput = form.querySelector(`#${prefix}-cityId`) as HTMLInputElement;
                    if (cInput) cInput.value = cityId;
                }
            );
        }

        // -- Image Management --
        this.setupImageManager(form, prefix, billboard);
    }

    private setupImageManager(form: HTMLElement, prefix: string, billboard: any) {
        // Normalize initial images
        let currentImages: (string | File)[] = [];
        // Handle various shapes of image data
        if (Array.isArray(billboard.image)) currentImages = billboard.image.map((img: any) => img.url || img);
        else if (Array.isArray(billboard.images)) currentImages = billboard.images.map((img: any) => img.url || img);
        else if (billboard.image) currentImages = [billboard.image.url || billboard.image];

        const container = form.querySelector('#image-manager-container') as HTMLElement;
        const uploadZone = form.querySelector(`#${prefix}-upload-zone`) as HTMLElement;
        const input = form.querySelector(`#${prefix}-images-input`) as HTMLInputElement;

        if (!container || !uploadZone || !input) return;

        const render = () => {
            container.innerHTML = '';
            currentImages.forEach((img, idx) => {
                const url = img instanceof File ? URL.createObjectURL(img) : (typeof img === 'string' ? img : '');
                const div = document.createElement('div');
                div.className = 'image-item';
                div.innerHTML = `<img src="${url}" /><div class="remove-btn">&times;</div>`;
                div.querySelector('.remove-btn')?.addEventListener('click', () => {
                    currentImages.splice(idx, 1);
                    render();
                });
                container.appendChild(div);
            });
            // Store reference for submit
            (form as any).__currentImages = currentImages;
        };

        render();

        uploadZone.addEventListener('click', () => input.click());
        input.addEventListener('change', () => {
            if (input.files) {
                Array.from(input.files).forEach(f => currentImages.push(f));
                render();
                input.value = '';
            }
        });

        // Drag & Drop
        uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.style.borderColor = '#3b82f6'; });
        uploadZone.addEventListener('dragleave', (e) => { e.preventDefault(); uploadZone.style.borderColor = '#e2e8f0'; });
        uploadZone.addEventListener('drop', (e: any) => {
            e.preventDefault();
            uploadZone.style.borderColor = '#e2e8f0';
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                Array.from(e.dataTransfer.files).forEach((f: any) => currentImages.push(f));
                render();
            }
        });
    }

    private setupSearchableDropdown(container: HTMLElement, data: any[], defaultText: string, onSelect: (id: string) => void) {
        const trigger = container.querySelector('.custom-select-trigger') as HTMLElement;
        const optionsContainer = container.querySelector('.custom-options-container') as HTMLElement;
        const search = container.querySelector('.custom-search-input') as HTMLInputElement;
        const optionsList = container.querySelector('.custom-options-list') as HTMLElement;

        if (!trigger || !optionsContainer || !search || !optionsList) return;

        const renderOpts = (items: any[]) => {
            optionsList.innerHTML = items.map(item => `
                <div class="custom-option" data-value="${item.id}">${item.name}</div>
            `).join('');

            optionsList.querySelectorAll('.custom-option').forEach(opt => {
                opt.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const val = (opt as HTMLElement).dataset.value!;
                    const txt = opt.textContent!;
                    trigger.textContent = txt;
                    onSelect(val);
                    optionsContainer.classList.remove('open');
                });
            });
        };

        renderOpts(data);

        const toggle = (e: Event) => {
            e.stopPropagation();
            document.querySelectorAll('.custom-options-container.open').forEach(el => el !== optionsContainer && el.classList.remove('open'));
            optionsContainer.classList.toggle('open');
            if (optionsContainer.classList.contains('open')) {
                search.value = '';
                renderOpts(data);
                search.focus();
            }
        };

        trigger.onclick = toggle;
        search.onclick = (e) => e.stopPropagation();
        search.oninput = () => {
            const val = search.value.toLowerCase();
            renderOpts(data.filter(d => d.name.toLowerCase().includes(val)));
        };
    }

    private initBillboardMap(prefix: string, data: any = {}) {
        const canvas = document.getElementById(`${prefix}-gmap-canvas`);
        if (!canvas || !(window as any).google) return;

        // Default to Surabaya if no data
        const loc = {
            lat: Number(data.latitude) || -7.250445,
            lng: Number(data.longitude) || 112.768845
        };
        const map = new (window as any).google.maps.Map(canvas, { center: loc, zoom: data.latitude ? 17 : 13, disableDefaultUI: false });

        const marker = new (window as any).google.maps.Marker({ position: loc, map: map, draggable: true });

        // Search Box
        const input = document.getElementById(`${prefix}-gmap-search`) as HTMLInputElement;
        const searchBox = new (window as any).google.maps.places.SearchBox(input);

        searchBox.addListener('places_changed', () => {
            const places = searchBox.getPlaces();
            if (!places || places.length === 0) return;
            const place = places[0];
            if (!place.geometry || !place.geometry.location) return;

            map.setCenter(place.geometry.location);
            map.setZoom(17);
            marker.setPosition(place.geometry.location);
            this.updateBillboardMapInputs(prefix, place.geometry.location, place.formatted_address, place);

            // Attempt Autofill for Create
            if (place.address_components && prefix === 'create') {
                this.autofillCityProvince(place.address_components, prefix);
            }
        });

        marker.addListener('dragend', () => {
            const pos = marker.getPosition();
            this.updateBillboardMapInputs(prefix, pos);
        });

        map.addListener('click', (e: any) => {
            marker.setPosition(e.latLng);
            this.updateBillboardMapInputs(prefix, e.latLng);
        });

        // Initial update if editing
        if (data.latitude) {
            this.updateBillboardMapInputs(prefix, loc);
        }
    }

    private updateBillboardMapInputs(prefix: string, latLng: any, address?: string, placeData?: any) {
        const form = document.querySelector(`#${prefix}-billboard-form`) as HTMLElement;
        if (!form) return;

        // Truncate to 7 decimal places to match backend DTO validation
        const lat = typeof latLng.lat === 'function' ? latLng.lat() : Number(latLng.lat);
        const lng = typeof latLng.lng === 'function' ? latLng.lng() : Number(latLng.lng);

        (form.querySelector(`#${prefix}-latitude`) as HTMLInputElement).value = lat.toFixed(7);
        (form.querySelector(`#${prefix}-longitude`) as HTMLInputElement).value = lng.toFixed(7);

        if (address) {
            (form.querySelector(`#${prefix}-formattedAddress`) as HTMLInputElement).value = address;
        } else {
            // Geocode?
            const geocoder = new (window as any).google.maps.Geocoder();
            geocoder.geocode({ location: latLng }, (results: any, status: any) => {
                if (status === 'OK' && results[0]) {
                    (form.querySelector(`#${prefix}-formattedAddress`) as HTMLInputElement).value = results[0].formatted_address;
                    (form.querySelector(`#${prefix}-gmap-search`) as HTMLInputElement).value = results[0].formatted_address;
                    // Note: Reverse geocoding result doesn't give same 'place' object structure with 'address_components' in exact same way always,
                    // but we can try to populate if needed. For now relying on SearchBox for full data.
                }
            });
        }

        if (placeData) {
            (form.querySelector(`#${prefix}-gPlaceId`) as HTMLInputElement).value = placeData.place_id || '';
            const comps = placeData.address_components || [];
            (form.querySelector(`#${prefix}-addressComponents`) as HTMLInputElement).value = JSON.stringify(comps);
            const viewp = placeData.geometry?.viewport ? placeData.geometry.viewport.toJSON() : {};
            (form.querySelector(`#${prefix}-mapViewport`) as HTMLInputElement).value = JSON.stringify(viewp);
        }
    }

    private async handleCreateBillboardSubmit() {
        const form = document.querySelector('#create-billboard-form') as HTMLFormElement;
        if (!form) return;

        const formData = new FormData(form);

        // Ensure numeric fields are present even if disabled
        if (!formData.has('rentPrice')) formData.append('rentPrice', '0');
        if (!formData.has('sellPrice')) formData.append('sellPrice', '0');
        if (!formData.has('servicePrice')) formData.append('servicePrice', '0');

        // -- Manually append SKU if disabled (auto-mode) --
        const skuInput = form.querySelector('[name="sku"]') as HTMLInputElement;
        if (skuInput && !formData.has('sku')) {
            formData.set('sku', skuInput.value);
        }

        // Process images from Image Manager
        const currentImages: (string | File)[] = (form as any).__currentImages || [];
        const filesToUpload = currentImages.filter(img => img instanceof File) as File[];

        if (filesToUpload.length === 0) {
            this.showToast('Please upload at least one image', 'error');
            return;
        }

        // Validate Map
        const lat = formData.get('latitude');
        if (!lat || lat === 'undefined') {
            this.showToast('Please select a location on the map', 'error');
            return;
        }

        // Validate IDs (Category, City, Province)
        // Get values directly from the inputs in the form to ensure latest state
        const categoryInput = form.querySelector('[name="categoryId"]') as HTMLInputElement | HTMLSelectElement;
        const cityInput = form.querySelector('[name="cityId"]') as HTMLInputElement;
        const provInput = form.querySelector('[name="provinceId"]') as HTMLInputElement;

        const categoryId = categoryInput?.value || formData.get('categoryId') as string;
        const cityId = cityInput?.value || formData.get('cityId') as string;
        const provinceId = provInput?.value || formData.get('provinceId') as string;

        console.log('Submission Debug:', { categoryId, cityId, provinceId });

        if (!categoryId) {
            this.showToast('Please select a Category', 'error');
            return;
        }
        if (!provinceId) {
            this.showToast('Please select a Province', 'error');
            return;
        }
        if (!cityId) {
            this.showToast('Please select a City', 'error');
            return;
        }

        // Force update FormData to ensure IDs are sent
        formData.set('categoryId', categoryId);
        formData.set('cityId', cityId);
        formData.set('provinceId', provinceId);

        // Remove sku-method from payload if present (not needed by API)
        formData.delete('sku-method');

        // Append images
        formData.delete('images'); // Clear input files
        filesToUpload.forEach(f => formData.append('images', f));

        // -- DEBUG: Log GMap Data & Payload --
        console.group('Billboard Submission Payload');
        const debugObj: any = {};
        formData.forEach((value, key) => {
            // Parse JSON strings for better readability in console
            if (key === 'addressComponents' || key === 'mapViewport') {
                try { debugObj[key] = JSON.parse(value as string); } catch { debugObj[key] = value; }
            } else {
                debugObj[key] = value;
            }
        });
        console.table(debugObj);
        console.groupEnd();
        // ------------------------------------

        this.showToast('Creating billboard...', 'info');

        try {
            const res = await fetch('/api/proxy/billboard', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const json = await res.json();

            if (res.ok) {
                this.openConfirmModal('Success', this.t('seller.toast.create_success'), async () => {
                    this.closeModal();
                    await this.setActiveTab('My Billboards');
                }, 'success');
            } else {
                console.error('API Error Response:', json);
                if (Array.isArray(json.message)) {
                    console.group('Validation Errors');
                    json.message.forEach((msg: string) => console.error(msg));
                    console.groupEnd();
                    this.showToast('Validation failed. Check console for details.', 'error');
                } else {
                    this.showToast(json.message || 'Failed to create billboard', 'error');
                }
            }
        } catch (e) {
            console.error('Network/Submission Error:', e);
            this.showToast('Error creating billboard', 'error');
        }
    }

    private async handleEditBillboardSubmit(id: string) {
        const form = document.querySelector('#edit-billboard-form') as HTMLFormElement;
        if (!form) return;

        const formData = new FormData(form);
        // const data: any = Object.fromEntries(formData.entries());

        // Process images
        const currentImages: (string | File)[] = (form as any).__currentImages || [];
        // const filesToUpload: File[] = [];
        // const existingImageUrls: string[] = [];  // Not really standard here, backend usually deletes all and replaces if we send list, OR we send diff.
        // Assuming backend handles "files" for new images. But what about existing?
        // Admin code re-hydrates existing images to Files if possible, effectively re-uploading everything or handling it.
        // Step 100 code: "Convert all images to Files... It's a URL... Fetch it and convert to Blob -> File"
        // This is heavy but ensures "files" array is complete.
        // Let's copy that strategy for robustness.

        this.showToast(this.t('seller.toast.process_images'), 'info');

        // Convert URLs back to files to send a complete set (Backend likely replaces 'images' list)
        const allFilesPromise = currentImages.map(async (img, idx) => {
            if (img instanceof File) return img;
            try {
                const url = getImageUrl(img);
                const res = await fetch(url);
                const blob = await res.blob();
                return new File([blob], `existing-${idx}.jpg`, { type: blob.type });
            } catch (e) { console.error('Image rehydrate fail', e); return null; }
        });

        const allFiles = (await Promise.all(allFilesPromise)).filter(f => f !== null) as File[];

        // Re-construct formData
        // Note: DELETE requests to remove files? Or just PUT/PATCH with new list?
        // Admin uses PATCH with FormData containing 'images' field with Files.
        // Re-construct formData
        // Note: DELETE requests to remove files? Or just PUT/PATCH with new list?
        // Admin uses PATCH with FormData containing 'images' field with Files.
        const newFormData = new FormData();

        // Validate IDs
        const categoryId = formData.get('categoryId') as string;
        const cityId = formData.get('cityId') as string;
        const provinceId = formData.get('provinceId') as string;

        if (!categoryId) { this.showToast('Category is required', 'error'); return; }
        if (!cityId) { this.showToast('City is required', 'error'); return; }
        if (!provinceId) { this.showToast('Province is required', 'error'); return; }

        // Ensure optional numeric fields are present
        if (!formData.has('rentPrice')) newFormData.append('rentPrice', '0');
        if (!formData.has('sellPrice')) newFormData.append('sellPrice', '0');
        if (!formData.has('servicePrice')) newFormData.append('servicePrice', '0');

        // Append fields with cleaning
        for (const [k, v] of formData.entries()) {
            if (k === 'images') continue;

            // Handle optional numeric fields - avoid sending empty strings
            // Also if we already appended them above as '0' because they were missing, 
            // this loop handles the case where they ARE present but empty/undefined.
            // So if it IS in formData but empty, we append '0'.
            // To avoid duplicates if we want to be super clean, we could use set, but `append` is safer for everything else.
            // Actually, if we use `set` for prices it might be better? No, `append` is standard here.
            // Let's just append '0' and skip the original 'v'.
            if ((k === 'rentPrice' || k === 'sellPrice' || k === 'servicePrice') && (v === '' || v === 'undefined')) {
                newFormData.append(k, '0');
                continue;
            }
            if ((k === 'latitude' || k === 'longitude') && (v === '' || v === 'undefined' || v === 'NaN')) {
                // Don't append invalid lat/lng
                continue;
            }

            newFormData.append(k, v);
        }
        // Append images
        allFiles.forEach(f => newFormData.append('images', f)); // Uses 'images' to match backend expectation

        // Debug Payload
        console.group('Edit Billboard Submission Payload');
        const debugObj: any = {};
        newFormData.forEach((v, k) => debugObj[k] = v);
        console.table(debugObj);
        console.groupEnd();

        try {
            const res = await fetch(`/api/proxy/billboard/${id}`, {
                method: 'PATCH',
                body: newFormData,
                credentials: 'include'
            });
            const json = await res.json();
            if (json.status) {
                this.showToast(this.t('seller.toast.update_success'), 'success');
                this.fetchMyBillboards();
                this.closeModal();
            } else {
                this.showToast(json.message || 'Update failed', 'error');
            }
        } catch {
            this.showToast('Error updating', 'error');
        }
    }


    private handleDeleteBillboard(id: string) {
        this.openConfirmModal('Delete Billboard', 'Are you sure?', async () => {
            try {
                const res = await fetch(`/api/proxy/billboard/${id}`, { method: 'DELETE', credentials: 'include' });
                if (res.ok) {
                    this.showToast(this.t('seller.toast.delete_success'), 'success');
                    this.fetchMyBillboards();
                    this.closeModal();
                } else {
                    this.showToast('Failed to delete', 'error');
                }
            } catch { this.showToast('Error', 'error'); }
        });
    }

    private openViewBillboardModal(id: string) {
        this.openModal(this.t('seller.common.loading'), `<div class="loading-spinner">${this.t('seller.common.loading')}</div>`);

        // Increase modal width for better card layout
        const modal = this.root.querySelector('.modal') as HTMLElement;
        if (modal) modal.style.maxWidth = '1000px';

        const body = this.root.querySelector('.modal-body');
        const confirmBtn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
        if (confirmBtn) confirmBtn.style.display = 'none';

        fetch(`/api/proxy/billboard/detail/${id}`, { credentials: 'include' })
            .then(res => res.json())
            .then(json => {
                if (json.status && json.data) {
                    const titleEl = this.root.querySelector('.modal-title');
                    if (titleEl) titleEl.textContent = 'Billboard Details';

                    if (body) {
                        body.innerHTML = this.renderBillboardDetailView(json.data);
                        // Initialize map after render
                        setTimeout(() => this.initViewOnlyMap(json.data), 100);
                        this.setupBillboardCarousel(body);
                    }
                } else {
                    this.showToast('Failed to load billboard data', 'error');
                    this.closeModal();
                }
            })
            .catch(e => {
                console.error(e);
                this.showToast('Error loading details', 'error');
                this.closeModal();
            });
    }

    private renderBillboardDetailView(billboard: any) {
        // Normalize images
        let images: string[] = [];
        if (Array.isArray(billboard.image)) {
            images = billboard.image.map((img: any) => img.url || img);
        } else if (billboard.image) {
            images = [billboard.image]; // Fallback if single string
        }

        const mainImage = images.length > 0 ? getImageUrl(images[0]) : getImageUrl(null);

        const formatPrice = (price: any) => {
            const num = Number(price);
            return num > 0 ? `Rp ${num.toLocaleString()}` : '-';
        };

        const owner = billboard.owner || {};
        const user = owner.user || {};
        const category = billboard.category || {};
        const city = billboard.city || {};
        const province = city.province || {};
        const statusClass = (billboard.status || 'Available').toLowerCase();

        return `
            <div class="billboard-detail-container">
                
                <!-- Hero Section: Image & Gallery -->
                <div class="billboard-hero">
                    <div class="billboard-main-image-wrapper">
                        <img id="billboard-main-image" class="billboard-main-image" src="${mainImage}" alt="${billboard.location}" onerror="this.src='https://placehold.co/800x600?text=No+Image'"/>
                        
                        <div class="billboard-status-badge">
                            <span class="status-tag ${statusClass}">${billboard.status || 'Unknown'}</span>
                            <span class="status-tag ${billboard.mode === 'Rent' ? 'rent' : 'sell'}">${billboard.mode || 'Rent'}</span>
                        </div>
                    </div>

                    ${images.length > 1 ? `
                        <div class="billboard-gallery">
                            ${images.map((img, index) => `
                                <div class="gallery-thumb ${index === 0 ? 'active' : ''}" data-src="${getImageUrl(img)}" data-index="${index}">
                                    <img src="${getImageUrl(img)}" alt="View ${index + 1}" />
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>

                <!-- Header Content: Title & Stats -->
                <div class="billboard-header-content">
                    <div class="billboard-title-group">
                        <div style="font-size: 0.875rem; color: var(--primary-red); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
                            ${category.name || 'Billboard'}
                        </div>
                        <h2>${billboard.location}</h2>
                        <div class="billboard-meta">
                            <span class="meta-item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                ${billboard.cityName || city.name || ''}, ${billboard.provinceName || province.name || ''}
                            </span>
                            <span class="meta-item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-maximize"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
                                ${billboard.size || '-'}
                            </span>
                        </div>
                    </div>
                    <div class="billboard-stats">
                        <div class="stat-box">
                            <div class="stat-label">Total Views</div>
                            <div class="stat-number">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:0.25rem; vertical-align: bottom;"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                ${billboard.view || 0}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Content Grid -->
                <div class="billboard-info-grid">
                    
                    <!-- Left Column -->
                    <div class="left-col">
                        
                        <!-- Description -->
                        <div class="info-card">
                            <div class="info-card-header">
                                <h3 class="info-card-title">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-align-left"><line x1="21" x2="3" y1="6" y2="6"/><line x1="21" x2="9" y1="12" y2="12"/><line x1="21" x2="7" y1="18" y2="18"/><line x1="3" x2="3" y1="6" y2="18"/></svg>
                                    ${this.t('seller.form.description')}
                                </h3>
                            </div>
                            <div class="info-card-body">
                                <p class="text-content">${billboard.description || this.t('seller.form.no_description')}</p>
                            </div>
                        </div>

                        <!-- Specifications -->
                        <div class="info-card">
                            <div class="info-card-header">
                                <h3 class="info-card-title">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                                    ${this.t('seller.form.specifications')}
                                </h3>
                            </div>
                            <div class="info-card-body">
                                <div class="specs-grid">
                                    <div class="spec-item"><label>${this.t('seller.form.display_type')}</label><div>${billboard.display || '-'}</div></div>
                                    <div class="spec-item"><label>${this.t('seller.form.lighting')}</label><div>${billboard.lighting || '-'}</div></div>
                                    <div class="spec-item"><label>${this.t('seller.form.size')}</label><div>${billboard.size || '-'}</div></div>
                                    <div class="spec-item"><label>${this.t('seller.form.orientation')}</label><div>${billboard.orientation || '-'}</div></div>
                                    <div class="spec-item"><label>${this.t('seller.form.land_ownership')}</label><div>${billboard.landOwnership || '-'}</div></div>
                                </div>
                            </div>
                        </div>

                        <!-- Location Map -->
                        <div class="info-card">
                            <div class="info-card-header">
                                <h3 class="info-card-title">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg>
                                    ${this.t('seller.form.map_location')}
                                </h3>
                            </div>
                            <div id="view-billboard-map">Map Loading...</div>
                            <div class="info-card-body" style="padding-top: 1rem; padding-bottom: 1rem; border-top: 1px solid #f1f5f9; background: #fafafa;">
                                <div style="display:flex; gap: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                    ${billboard.formattedAddress || billboard.address || '-'}
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Right Column -->
                    <div class="right-col">
                        
                        <!-- Pricing -->
                        <div class="info-card">
                            <div class="info-card-header">
                                <h3 class="info-card-title">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dollar-sign"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                    ${this.t('seller.form.pricing')}
                                </h3>
                            </div>
                            <div class="info-card-body">
                                <div class="price-list">
                                    <div class="price-item">
                                        <span class="price-label">${this.t('seller.form.rent_price')}</span>
                                        <span class="price-value">${formatPrice(billboard.rentPrice)}</span>
                                    </div>
                                    <div class="price-item">
                                        <span class="price-label">${this.t('seller.form.sell_price')}</span>
                                        <span class="price-value">${formatPrice(billboard.sellPrice)}</span>
                                    </div>
                                    <div class="price-item">
                                        <span class="price-label">${this.t('seller.form.service_price')}</span>
                                        <span class="price-value" style="color: var(--text-secondary); font-size: 1rem;">${formatPrice(billboard.servicePrice)}</span>
                                    </div>
                                </div>
                                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed #e2e8f0; text-align: center;">
                                    <span class="badge ${billboard.tax === 'IncludePPH' ? 'badge-success' : 'badge-warning'}">
                                        ${billboard.tax === 'IncludePPH' ? 'Tax Included' : 'Tax Excluded'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Owner Detail -->
                        <div class="info-card">
                             <div class="info-card-header">
                                <h3 class="info-card-title">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    ${this.t('seller.form.owner_details')}
                                </h3>
                             </div>
                             <div class="info-card-body">
                                <div class="owner-profile">
                                    <div class="owner-avatar">
                                        <img src="${user.profilePicture ? `/api/proxy/${user.profilePicture}` : `https://ui-avatars.com/api/?name=${user.username}&background=random`}" style="width:100%; height:100%; object-fit:cover;">
                                    </div>
                                    <div class="owner-info">
                                        <h4>${owner.fullname || 'Unknown Owner'}</h4>
                                        <div class="owner-meta">${owner.companyName || 'Individual Seller'}</div>
                                    </div>
                                </div>
                                <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
                                    <div style="display:flex; align-items:center; gap:0.75rem; color: var(--text-secondary); font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                        ${user.email || '-'}
                                    </div>
                                    <div style="display:flex; align-items:center; gap:0.75rem; color: var(--text-secondary); font-size: 0.9rem;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                        ${user.phone || '-'}
                                    </div>
                                </div>
                             </div>
                        </div>

                    </div>

                </div>
            </div>
        `;
    }

    private setupBillboardCarousel(container: Element) {
        const thumbnails = container.querySelectorAll('.gallery-thumb');
        const mainImage = container.querySelector('#billboard-main-image') as HTMLImageElement;

        if (!mainImage || thumbnails.length === 0) return;

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Update active state
                thumbnails.forEach(t => {
                    (t as HTMLElement).style.borderColor = 'transparent';
                    (t as HTMLElement).style.opacity = '0.6';
                    t.classList.remove('active');
                });
                (thumb as HTMLElement).style.borderColor = 'var(--primary-red)';
                (thumb as HTMLElement).style.opacity = '1';
                thumb.classList.add('active');

                // Update Main Image
                const src = (thumb as HTMLElement).dataset.src;
                if (src) {
                    mainImage.style.opacity = '0.5';
                    setTimeout(() => {
                        mainImage.src = src;
                        mainImage.style.opacity = '1';
                    }, 150);
                }
            });
        });
    }

    private initViewOnlyMap(data: any) {
        const mapElement = document.getElementById("view-billboard-map");
        if (!mapElement) return;

        // Ensure Maps loaded
        this.loadGoogleMapsScript().then(() => {
            if (!(window as any).google || !(window as any).google.maps) {
                mapElement.innerHTML = '<div style="color: red; padding: 1rem;">Google Maps API not initialized.</div>';
                return;
            }

            const defaultLocation = { lat: -6.2088, lng: 106.8456 }; // Jakarta
            const location = (data.latitude && data.longitude)
                ? { lat: Number(data.latitude), lng: Number(data.longitude) }
                : defaultLocation;

            const map = new (window as any).google.maps.Map(mapElement, {
                zoom: 15,
                center: location,
                mapTypeId: 'roadmap',
                disableDefaultUI: true, // simplified view
                zoomControl: true,
            });

            new (window as any).google.maps.Marker({
                position: location,
                map: map,
                title: data.location || 'Billboard Location'
            });
        }).catch(e => {
            console.error('Failed to load GMaps', e);
            mapElement.innerHTML = '<div style="color: red; padding: 1rem;">Failed to load Google Maps API.</div>';
        });
    }

    private openViewTransactionModal(id: string) {
        if (!id || id === 'undefined' || id === 'null') {
            this.showToast('Invalid transaction ID', 'error');
            return;
        }
        // Endpoint: /transaction/mySales/billboard/:billboardId
        // The table row data-id is (row.billboardId || row.id).
        this.openModal('Transaction Detail', '<div class="loading-spinner">Loading...</div>', undefined, 'modal-lg');

        fetch(`/api/proxy/transaction/mySales/billboard/${id}`, { credentials: 'include' })
            .then(res => res.json())
            .then(json => {
                const body = this.root.querySelector('.modal-body');
                if (!body) return;

                if (json.status && json.data) {
                    // data might be a list (?) or a single obj. 
                    // If list, take first or find a match?
                    // User said "Transaction Detail" endpoint.
                    const data = Array.isArray(json.data) ? json.data[0] : json.data;
                    body.innerHTML = this.renderViewTransactionDetails(data);
                } else {
                    body.innerHTML = '<p class="text-red-500">Failed to load details.</p>';
                }
            })
            .catch(() => {
                this.root.querySelector('.modal-body')!.innerHTML = '<p>Error loading details.</p>';
            });
    }

    private renderViewTransactionDetails(t: any) {
        if (!t) return 'No details available.';
        const formatRp = (v: any) => 'Rp ' + (Number(v) || 0).toLocaleString();
        // const formatDate = (v: any) => v ? new Date(v).toLocaleDateString() : '-';

        const buyer = t.buyer || t.user || {};
        const billboard = t.billboard || {};
        const addons = t.addons || [];

        return `
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <!-- Header -->
                <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-size:0.85rem; color:#64748b;">Transaction ID</div>
                        <div style="font-size:1.1rem; font-weight:600;">#${t.id ? t.id.substring(0, 8) : '...'}</div>
                        <span class="badge" style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:4px; font-size:0.8rem;">${t.status}</span>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:0.85rem; color:#64748b;">Total Amount</div>
                        <div style="font-size:1.5rem; font-weight:700; color:#dc2626;">${formatRp(t.totalPrice)}</div>
                    </div>
                </div>

                <!-- Grid: Buyer & Billboard -->
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
                    <!-- Buyer -->
                    <div style="border:1px solid #e2e8f0; border-radius:8px; padding:1rem;">
                        <h5 style="margin:0 0 0.5rem 0; color:#334155; font-size:0.95rem; display:flex; align-items:center; gap:0.5rem;">
                            <span style="width:20px; height:20px; background:#eff6ff; border-radius:50%; display:inline-block;"></span> Buyer
                        </h5>
                        <div style="font-weight:600;">${buyer.username || 'Unknown'}</div>
                        <div style="font-size:0.9rem; color:#64748b;">${buyer.email || '-'}</div>
                        <div style="font-size:0.9rem; color:#64748b;">${buyer.phone || '-'}</div>
                    </div>
                    <!-- Billboard -->
                    <div style="border:1px solid #e2e8f0; border-radius:8px; padding:1rem;">
                        <h5 style="margin:0 0 0.5rem 0; color:#334155; font-size:0.95rem; display:flex; align-items:center; gap:0.5rem;">
                            <span style="width:20px; height:20px; background:#fff7ed; border-radius:50%; display:inline-block;"></span> Billboard
                        </h5>
                        <div style="font-weight:600;">${billboard.location || 'Unknown'}</div>
                        <div style="font-size:0.9rem; color:#64748b;">${billboard.cityName || '-'}, ${billboard.provinceName || '-'}</div>
                        <div style="font-size:0.9rem; margin-top:0.25rem;">
                            <span style="background:#f1f5f9; padding:2px 6px; border-radius:4px;">${billboard.type || '-'}</span>
                            <span style="background:#f1f5f9; padding:2px 6px; border-radius:4px;">${billboard.size || '-'}</span>
                        </div>
                    </div>
                </div>

                <!-- Pricing Breakdown -->
                <div style="border:1px solid #e2e8f0; border-radius:8px; padding:1rem;">
                    <h5 style="margin:0 0 1rem 0; color:#334155; font-size:1rem;">Payment Summary</h5>
                    <div style="display:flex; flex-direction:column; gap:0.5rem;">
                        <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                            <span style="color:#64748b;">Base Price (${billboard.mode})</span>
                            <span>${formatRp(t.pricing?.rentOrSell || billboard.rentPrice || 0)}</span>
                        </div>
                         <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                            <span style="color:#64748b;">Service Fee</span>
                            <span>${formatRp(t.pricing?.servicePrice || billboard.servicePrice || 0)}</span>
                        </div>
                        ${addons.length > 0 ? `
                             <div style="margin:0.5rem 0; border-top:1px dashed #e2e8f0;"></div>
                             <div style="font-size:0.85rem; color:#64748b; margin-bottom:0.25rem;">Add-ons:</div>
                             ${addons.map((a: any) => `
                                <div style="display:flex; justify-content:space-between; font-size:0.9rem; padding-left:0.5rem;">
                                    <span>${a.addOn?.name}</span>
                                    <span>${formatRp(a.addOn?.price)}</span>
                                </div>
                             `).join('')}
                        ` : ''}
                         <div style="margin-top:0.5rem; border-top:1px solid #e2e8f0; padding-top:0.5rem; display:flex; justify-content:space-between; font-weight:600;">
                            <span>Total</span>
                            <span style="color:#dc2626;">${formatRp(t.totalPrice)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }


    // --- Utils ---
    private openModal(title: string, content?: string | null, onConfirm?: () => Promise<void>, sizeClass: string = '') {
        const modal = this.root.querySelector('.modal-overlay');
        if (!modal) return;
        const modalDialog = modal.querySelector('.modal');
        if (modalDialog) {
            modalDialog.classList.remove('modal-lg');
            if (sizeClass) modalDialog.classList.add(sizeClass);
        }
        modal.querySelector('.modal-title')!.textContent = title;
        if (content) modal.querySelector('.modal-body')!.innerHTML = content;

        this.currentModalAction = onConfirm || null;
        const confirmBtn = modal.querySelector('.confirm-modal') as HTMLElement;
        if (onConfirm) confirmBtn.style.display = 'block';
        else confirmBtn.style.display = 'none';

        modal.classList.add('open');
    }


    private closeModal() {
        this.root.querySelector('.modal-overlay')?.classList.remove('open');
        this.currentModalAction = null;
    }

    private showToast(message: string, type: 'success' | 'error' | 'info') {
        const container = this.root.querySelector('.toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        // Styles for toast need to be added to CSS or inline here
        toast.style.cssText = `
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white; padding: 1rem; margin-bottom: 0.5rem; border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1); opacity: 0; transition: opacity 0.3s;
        `;

        container.appendChild(toast);
        setTimeout(() => toast.style.opacity = '1', 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}
