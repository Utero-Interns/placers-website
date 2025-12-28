/* eslint-disable @typescript-eslint/no-explicit-any */

import { store } from '../../lib/store';
import { getImageUrl } from '../../lib/utils';

type ModuleName = 'Dashboard' | 'Users' | 'Sellers' | 'Billboards' | 'Transactions' | 'Recycle Bin' | 'Categories' | 'Designs' | 'Add-ons' | 'Cities' | 'Media' | 'My Profile';

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

export class AdminDashboard {
    private root: HTMLElement;
    private state: DashboardState;
    private data: typeof store.data; // Keep for other modules
    private apiData: {
        users: any[];
        sellers: any[];
        billboards: any[];
        transactions: any[];
        categories: any[];
        designs: any[];
        addons: any[];
        cities: any[];
        provinces: any[];
        media: any[];
        recycleBin: any[];
        notifications: any[];
        unreadNotificationsCount: number;
        currentUser: any | null;
        stats: any | null;
    };
    private currentModalAction: (() => Promise<void>) | null = null;
    private selectedDesignFiles: File[] = [];

    constructor(rootId: string) {
        const root = document.getElementById(rootId);
        if (!root) throw new Error(`Root element #${rootId} not found`);
        this.root = root;
        this.data = store.data;
        this.apiData = {
            users: [],
            sellers: [],
            billboards: [],
            transactions: [],
            categories: [],
            designs: [],
            addons: [],

            cities: [],
            provinces: [],
            media: [],
            recycleBin: [],
            notifications: [],
            unreadNotificationsCount: 0,
            currentUser: null,
            stats: null
        };
        this.selectedDesignFiles = [];
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

        this.init();
    }

    private async init() {
        await this.fetchCurrentUser();
        this.renderLayout();
        this.attachGlobalListeners();
        // Start loading GMaps but don't await blocking UI
        this.loadGoogleMapsScript().catch(console.error);

        // Initial fetch for users if that's the active tab or just pre-fetch
        await this.fetchUsers();
        await this.fetchDashboardStats();
        this.fetchUnreadCount();

        this.renderContent();
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

    private async fetchUsers() {
        try {
            // Use the proxy to ensure cookies are passed correctly
            const res = await fetch('/api/proxy/user', {
                credentials: 'include'
            });
            const json = await res.json();
            if (json.status && json.data) {
                this.apiData.users = json.data;
            }
        } catch (e) {
            console.error('Failed to fetch users', e);
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

    private async fetchSellers() {
        try {
            // Endpoint: GET http://utero.viewdns.net:3100/seller/all -> /api/proxy/seller/all
            const res = await fetch('/api/proxy/seller/all', {
                credentials: 'include'
            });
            const json = await res.json();
            if (json.status && json.data) {
                this.apiData.sellers = json.data;
            }
        } catch (e) {
            console.error('Failed to fetch sellers', e);
        }
    }

    private async fetchProvinces() {
        try {
            const res = await fetch('/api/proxy/province', {
                credentials: 'include'
            });
            const json = await res.json();
            if (json.status && json.data) {
                this.apiData.provinces = json.data;
            }
        } catch (e) {
            console.error('Failed to fetch provinces', e);
        }
    }

    private async fetchBillboards() {
        try {
            // Endpoint: GET http://utero.viewdns.net:3100/billboard/all -> /api/proxy/billboard/all
            const res = await fetch('/api/proxy/billboard/all', {
                credentials: 'include'
            });
            const json = await res.json();
            // The API returns { status: true, data: [...] } based on user provided info
            if (json.status && json.data) {
                this.apiData.billboards = json.data;
            }
        } catch (e) {
            console.error('Failed to fetch billboards', e);
        }
    }

    private async fetchTransactions() {
        try {
            // Endpoint: GET http://utero.viewdns.net:3100/transaction/all -> /api/proxy/transaction/all
            const res = await fetch('/api/proxy/transaction/all', {
                credentials: 'include'
            });
            const json = await res.json();
            if (json.status && json.data) {
                this.apiData.transactions = json.data;
            }
        } catch (e) {
            console.error('Failed to fetch transactions', e);
        }
    }

    private async fetchCategories() {
        try {
            // Endpoint: GET http://utero.viewdns.net:3100/category -> /api/proxy/category
            const res = await fetch('/api/proxy/category', {
                credentials: 'include'
            });
            const json = await res.json();
            if (json.status && json.data) {
                this.apiData.categories = json.data;
            }
        } catch (e) {
            console.error('Failed to fetch categories', e);
        }
    }

    private async fetchDesigns() {
        try {
            // Endpoint: GET http://utero.viewdns.net:3100/design -> /api/proxy/design
            const res = await fetch('/api/proxy/design', {
                credentials: 'include'
            });
            const json = await res.json();
            if (json.status && json.data) {
                this.apiData.designs = json.data;
            }
        } catch (e) {
            console.error('Failed to fetch designs', e);
        }
    }

    private async fetchAddons() {
        try {
            const res = await fetch('/api/proxy/add-on', {
                credentials: 'include'
            });
            const json = await res.json();
            if (json.status && json.data) {
                this.apiData.addons = json.data;
            }
        } catch (e) {
            console.error('Failed to fetch add-ons', e);
        }
    }

    private async fetchRecycleBin() {
        try {
            // Endpoint: GET http://utero.viewdns.net:3100/billboard/recycle-bin
            const res = await fetch('/api/proxy/billboard/recycle-bin', {
                credentials: 'include'
            });
            const json = await res.json();
            console.log('Recycle Bin API Response:', json);
            if (json.status && json.data) {
                this.apiData.recycleBin = json.data;
            } else if (Array.isArray(json)) {
                this.apiData.recycleBin = json;
            } else if (json.data && Array.isArray(json.data)) {
                // Fallback if status is missing but data is there
                this.apiData.recycleBin = json.data;
            }
        } catch (e) {
            console.error('Failed to fetch recycle bin', e);
        }
    }

    private async handleRestoreBillboard(id: string) {
        try {
            const res = await fetch(`/api/proxy/billboard/${id}/restore`, {
                method: 'POST',
                credentials: 'include'
            });
            if (res.ok) {
                this.showToast('Billboard restored successfully', 'success');
                await this.fetchRecycleBin();
                this.updateModuleData(this.root.querySelector('#content-area')!);
            } else {
                const json = await res.json();
                this.showToast(json.message || 'Failed to restore billboard', 'error');
            }
        } catch (e) {
            console.error('Failed to restore billboard', e);
            this.showToast('Failed to restore billboard', 'error');
        }
    }

    private async handlePurgeBillboard(id: string) {
        this.openConfirmModal(
            'Delete Permanently',
            'Are you sure you want to delete this billboard permanently? This action CANNOT be undone.',
            async () => {
                try {
                    const res = await fetch(`/api/proxy/billboard/${id}/purge?confirm=true`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });
                    if (res.ok) {
                        this.showToast('Billboard deleted permanently', 'success');
                        this.closeModal();
                        await this.fetchRecycleBin();
                        this.updateModuleData(this.root.querySelector('#content-area')!);
                    } else {
                        const json = await res.json();
                        this.showToast(json.message || 'Failed to delete billboard', 'error');
                        this.closeModal();
                    }
                } catch (e) {
                    console.error('Failed to purge billboard', e);
                    this.showToast('Failed to delete billboard', 'error');
                }
            }
        );
    }

    private handleBulkDeleteTransactionsPrompt() {
        // Create modal content for status selection
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="form-group">
                <label class="form-label">Select Status to Delete</label>
                <select id="bulk-delete-status" class="form-control">
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="EXPIRED">Expired</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="COMPLETED">Completed</option>
                </select>
                <p class="text-muted" style="margin-top: 0.5rem; font-size: 0.875rem; color: #666;">
                    Warning: This will permanently delete all transactions with the selected status.
                </p>
            </div>
        `;

        this.openConfirmModal(
            'Bulk Delete Transactions',
            content.outerHTML, // Use the outerHTML as the message content
            async () => {
                const select = document.querySelector('#bulk-delete-status') as HTMLSelectElement;
                if (select && select.value) {
                    await this.handleBulkDeleteTransactions(select.value);
                }
            },
            'warning'
        );
    }

    private async handleBulkDeleteTransactions(status: string) {
        try {
            this.showToast(`Deleting all ${status} transactions...`, 'info');

            const res = await fetch('/api/proxy/transaction', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status }),
                credentials: 'include'
            });

            const json = await res.json();

            if (res.ok && json.status) {
                this.showToast(json.message || `Successfully deleted ${json.deleted?.transactions || 0} transactions`, 'success');
                this.closeModal();
                await this.fetchTransactions();
                this.updateModuleData(this.root.querySelector('#content-area')!);
            } else {
                this.showToast(json.message || 'Failed to bulk delete transactions', 'error');
            }
        } catch (e) {
            console.error('Failed to bulk delete transactions', e);
            this.showToast('Failed to execute bulk delete', 'error');
        }
    }

    private attachGlobalListeners() {
        // Mobile toggle
        document.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.closest('.mobile-toggle')) {
                this.toggleSidebar();
            }
            // Close sidebar when clicking outside on mobile
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
        const username = this.apiData.currentUser?.username || 'Admin';
        const profilePicture = this.apiData.currentUser?.profilePicture;

        this.root.innerHTML = `
      <div class="admin-container">
        <aside class="sidebar">
          <div class="sidebar-header">
            PLACERS ADMIN
          </div>
          <nav class="sidebar-nav">
            <!-- Nav items injected here -->
          </nav>
          <div class="sidebar-footer">
            <div class="user-profile-section">
              <div class="user-avatar" style="overflow: hidden; display: flex; align-items: center; justify-content: center;">
                ${profilePicture
                ? `<img src="/api/proxy/${profilePicture}" style="width: 100%; height: 100%; object-fit: cover;">`
                : username.charAt(0).toUpperCase()}
              </div>
              <div class="user-info">
                 <span class="user-name">${username}</span>
                 <span class="user-role">Administrator</span>
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
              <button class="mobile-toggle">â˜°</button>
              <h1 class="page-title">Dashboard</h1>
            </div>
          </header>
          <div id="content-area">
            <!-- Content injected here -->
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
        this.renderSidebarNav();

        // Modal listeners
        // const modalOverlay = this.root.querySelector('.modal-overlay');
        const closeBtns = this.root.querySelectorAll('.modal-close, .close-modal');
        closeBtns.forEach(btn => btn.addEventListener('click', () => this.closeModal()));

        // Removed overlay click listener to prevent closing when clicking outside
        // modalOverlay?.addEventListener('click', (e) => {
        //     if (e.target === modalOverlay) this.closeModal();
        // });

        this.root.querySelector('.confirm-modal')?.addEventListener('click', () => {
            if (this.currentModalAction) this.currentModalAction();
        });

        // Logout listener
        const logoutBtn = this.root.querySelector('.logout-btn-sidebar');
        logoutBtn?.addEventListener('click', async () => {
            // Handle logout
            await fetch('/api/proxy/auth/logout', { method: 'POST' }); // Ensure proper logout call if needed or just redirect
            window.location.href = '/login';
        });

        this.attachFloatingNotificationListener();
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
        const nav = this.root.querySelector('.sidebar-nav');
        if (!nav) return;

        const tabs: { name: ModuleName; icon: string }[] = [
            { name: 'Dashboard', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>' },
            { name: 'Users', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
            { name: 'Sellers', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21 21 3"/><path d="M3 3l18 18"/></svg>' }, // Placeholder icon, will replace with shop icon
            { name: 'Billboards', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/></svg>' },
            { name: 'Transactions', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>' },
            { name: 'Recycle Bin', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>' },
            { name: 'Categories', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M14 14h7v7h-7z"/><path d="M3 14h7v7H3z"/></svg>' },
            { name: 'Designs', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>' },
            { name: 'Add-ons', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>' },
            { name: 'Media', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>' },
            { name: 'My Profile', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' }
        ];

        // Fix Sellers icon specifically
        tabs[2].icon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';

        nav.innerHTML = tabs.map(tab => `
      <div class="nav-item ${this.state.activeTab === tab.name ? 'active' : ''}" data-tab="${tab.name}">
        <span class="nav-icon">${tab.icon}</span>
        <span class="nav-text">${tab.name}</span>
      </div>
    `).join('');

        nav.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const tab = item.getAttribute('data-tab') as ModuleName;
                this.setActiveTab(tab);
            });
        });
    }

    private async setActiveTab(tab: ModuleName) {
        this.state.activeTab = tab;
        this.state.searchQuery = '';
        this.state.sortColumn = null;
        this.state.filters = {};
        this.state.currentPage = 1;

        // Update UI
        this.renderSidebarNav();
        this.root.querySelector('.page-title')!.textContent = tab;

        if (tab === 'Dashboard') {
            await this.fetchDashboardStats();
        } else if (tab === 'Users' && this.apiData.users.length === 0) {
            await this.fetchUsers();
        } else if (tab === 'Sellers' && this.apiData.sellers.length === 0) {
            await this.fetchSellers();
        } else if (tab === 'Billboards' && this.apiData.billboards.length === 0) {
            await this.fetchBillboards();
        } else if (tab === 'Transactions' && this.apiData.transactions.length === 0) {
            await this.fetchTransactions();
        } else if (tab === 'Categories' && this.apiData.categories.length === 0) {
            await this.fetchCategories();
        } else if (tab === 'Designs' && this.apiData.designs.length === 0) {
            await this.fetchDesigns();
        } else if (tab === 'Cities' && this.apiData.cities.length === 0) {
            await this.fetchCities();
        } else if (tab === 'Media' && this.apiData.media.length === 0) {
            await this.fetchMedia();
        } else if (tab === 'Add-ons' && this.apiData.addons.length === 0) {
            await this.fetchAddons();
        } else if (tab === 'Recycle Bin') {
            await this.fetchRecycleBin(); // Always fetch fresh data for Recycle Bin
        }

        this.renderContent();

        // Close sidebar on mobile after selection
        if (window.innerWidth <= 1024) {
            this.toggleSidebar(false);
        }
    }

    private renderContent() {
        const container = this.root.querySelector('#content-area');
        if (!container) return;

        if (this.state.activeTab === 'Dashboard') {
            this.renderDashboardOverview(container);
        } else if (this.state.activeTab === 'Media') {
            this.renderMediaGallery(container);
        } else if (this.state.activeTab === 'My Profile') {
            this.renderMyProfile(container);
        } else {
            this.renderModule(container);
        }
    }

    private renderMyProfile(container: Element) {
        const user = this.apiData.currentUser || {};
        container.innerHTML = `
            <div class="table-container" style="padding: 2rem; max-width: 600px;">
                <h3 style="margin-bottom: 2rem;">My Profile</h3>
                
                <form id="admin-profile-form">
                    <div style="display:flex; align-items:center; gap: 1rem; margin-bottom: 2rem;">
                        <div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; background: var(--primary-red); color: white; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; position: relative;">
                            ${user.profilePicture
                ? `<img id="admin-profile-preview" src="/api/proxy/${user.profilePicture}" style="width:100%; height:100%; object-fit:cover;">`
                : `<span id="admin-profile-initial">${(user.username || 'A').charAt(0).toUpperCase()}</span>`
            }
                        </div>
                        <div style="flex:1;">
                            <label class="form-label">Profile Picture</label>
                            <input type="file" name="file" id="admin-profile-input" class="form-control">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Username</label>
                        <input type="text" class="form-control" name="username" value="${user.username || ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" name="email" value="${user.email || ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Phone</label>
                        <input type="text" class="form-control" name="phone" value="${user.phone || ''}">
                    </div>
                    
                    <div class="form-group" style="margin-top:2rem;">
                    <label class="form-label">Change Password <span style="font-weight:normal; color:#666;">(Leave blank to keep current)</span></label>
                    <div style="position: relative;">
                        <input type="password" class="form-control" name="password" placeholder="New Password" style="padding-right: 40px;">
                        <button type="button" class="toggle-password" data-target="password" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #666;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Confirm Password</label>
                    <div style="position: relative;">
                        <input type="password" class="form-control" name="confirmPassword" placeholder="Confirm New Password" style="padding-right: 40px;">
                        <button type="button" class="toggle-password" data-target="confirmPassword" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #666;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                    </div>
                </div>

                <div class="form-group">
                     <label class="form-label">Role</label>
                     <input type="text" class="form-control" value="${user.level || 'ADMIN'}" disabled style="background:#eee;">
                </div>

                <button type="submit" class="btn btn-primary" style="width:100%; margin-top:1rem;">Update Profile</button>
            </form>
        </div>
    `;

        const form = container.querySelector('#admin-profile-form');
        const imgInput = container.querySelector('#admin-profile-input') as HTMLInputElement;

        // Password visibility toggle logic
        container.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.currentTarget as HTMLButtonElement;
                const targetName = button.getAttribute('data-target');
                const input = container.querySelector(`input[name="${targetName}"]`) as HTMLInputElement;

                if (input.type === 'password') {
                    input.type = 'text';
                    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`;
                } else {
                    input.type = 'password';
                    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`;
                }
            });
        });

        // Preview handling
        imgInput?.addEventListener('change', () => {
            if (imgInput.files && imgInput.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const folder = container.querySelector('.table-container div:first-child div:first-child');
                    if (folder) {
                        folder.innerHTML = `<img src="${e.target?.result}" style="width:100%; height:100%; object-fit:cover;">`;
                    }
                };
                reader.readAsDataURL(imgInput.files[0]);
            }
        });

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);

            // Handle password fields - remove if empty to avoid validation error
            const password = formData.get('password') as string;
            if (!password || password.trim() === '') {
                formData.delete('password');
                formData.delete('confirmPassword');
            }

            // Ensure level is included and matches enum
            if (!formData.has('level')) {
                // Default to ADMIN if not present, but should ideally come from user data
                formData.append('level', this.apiData.currentUser?.level || 'ADMIN');
            }

            this.showToast('Updating profile...', 'info');

            try {
                const res = await fetch('/api/proxy/user/me', {
                    method: 'PUT',
                    body: formData,
                    credentials: 'include'
                });

                const json = await res.json();

                if (res.ok) {
                    this.openConfirmModal('Success', 'Profile updated successfully', async () => {
                        window.location.reload();
                    }, 'success');
                } else {
                    this.openConfirmModal('Error', json.message || 'Update failed', async () => {
                        window.location.reload();
                    }, 'error');
                }
            } catch (err) {
                console.error(err);
                this.openConfirmModal('Error', 'Error updating profile', async () => {
                    window.location.reload();
                }, 'error');
            }
        });
    }

    private renderDashboardOverview(container: Element) {
        const stats = this.apiData.stats || {};
        const displayStats = [
            { label: 'Total Users', value: stats.totalUsers ?? (this.apiData.users.length || 0), change: '+12%' },
            { label: 'Total Billboards', value: stats.totalBillboards ?? (this.apiData.billboards.length || 0), change: '+8%' },
            { label: 'Active Billboards', value: stats.activeBillboards ?? 0, change: '+5%' },
            { label: 'Total Transactions', value: stats.totalTransactions ?? (this.apiData.transactions.length || 0), change: '+25%' },
        ];

        container.innerHTML = `
      <div class="stats-grid">
        ${displayStats.map(stat => `
          <div class="stat-card">
            <div class="stat-label">${stat.label}</div>
            <div class="stat-value">${stat.value}</div>
            <div style="color: var(--success-green); font-size: 0.875rem; margin-top: 0.5rem;">
              ${stat.change} from last month
            </div>
          </div>
        `).join('')}
      </div>
      <div class="table-container">
        <div class="table-controls">
          <h3>Recent Transactions</h3>
        </div>
        ${this.generateTableHTML(this.data.transactions.slice(0, 5), [
            { key: 'id', label: 'ID' },
            { key: 'buyerId', label: 'Buyer', render: (v: string) => this.getUserName(v) },
            { key: 'totalPrice', label: 'Amount', render: (v: number) => `Rp ${v.toLocaleString()}` },
            { key: 'status', label: 'Status', render: (v: string) => `<span class="badge ${this.getStatusBadgeClass(v)}">${v}</span>` },
            { key: 'createdAt', label: 'Date', render: (v: string) => new Date(v).toLocaleDateString() },
        ])}
      </div>
    `;
    }

    private renderModule(container: Element) {
        // We need to cast to any here because getModuleConfig returns different types
        // and TS struggles with the union of all possible ModuleConfigs
        const config = this.getModuleConfig() as ModuleConfig<any>;
        const filteredData = this.getFilteredAndSortedData(config.data);
        const paginatedData = this.getPaginatedData(filteredData);

        container.innerHTML = `
      <div class="table-container">
        <div class="table-controls">
          <input type="text" class="search-input" placeholder="Search..." value="${this.state.searchQuery}">
          <div class="filters">
            ${config.filters.map(f => `
              <select class="form-control filter-select" style="width: auto; display: inline-block;" data-key="${String(f.key)}">
                <option value="">All ${f.label}</option>
                ${f.options.map(o => `<option value="${o}" ${this.state.filters[String(f.key)] === o ? 'selected' : ''}>${o}</option>`).join('')}
              </select>
            `).join('')}
          </div>
          ${!['Sellers', 'Billboards', 'Media', 'Transactions', 'Recycle Bin'].includes(this.state.activeTab) ? '<button class="btn btn-primary add-new-btn">Add New</button>' : ''}
          ${this.state.activeTab === 'Transactions' ? `
            <button class="btn btn-danger bulk-delete-btn" style="display: flex; align-items: center; gap: 0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                Bulk Delete
            </button>
          ` : ''}
        </div>
        ${this.generateTableHTML(paginatedData, config.columns)}
        <div class="pagination">
          <div class="pagination-info">
            Showing ${(this.state.currentPage - 1) * this.state.itemsPerPage + 1} to ${Math.min(this.state.currentPage * this.state.itemsPerPage, filteredData.length)} of ${filteredData.length} entries
          </div>
          <div class="pagination-controls">
            <button class="btn btn-outline btn-sm prev-page" ${this.state.currentPage === 1 ? 'disabled' : ''}>Previous</button>
            <button class="btn btn-outline btn-sm next-page" ${this.state.currentPage * this.state.itemsPerPage >= filteredData.length ? 'disabled' : ''}>Next</button>
          </div>
        </div>
      </div>
    `;

        // Attach listeners
        const searchInput = container.querySelector('.search-input');
        searchInput?.addEventListener('input', (e: Event) => {
            this.state.searchQuery = (e.target as HTMLInputElement).value;
            this.state.currentPage = 1;
            this.updateModuleData(container);
        });

        container.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', (e: Event) => {
                const key = select.getAttribute('data-key');
                if (key) {
                    this.state.filters[key] = (e.target as HTMLSelectElement).value;
                    this.state.currentPage = 1;
                    this.updateModuleData(container);
                }
            });
        });

        container.querySelector('.prev-page')?.addEventListener('click', () => {
            if (this.state.currentPage > 1) {
                this.state.currentPage--;
                this.updateModuleData(container);
            }
        });

        container.querySelector('.next-page')?.addEventListener('click', () => {
            const config = this.getModuleConfig() as ModuleConfig<any>;
            const filteredData = this.getFilteredAndSortedData(config.data);
            if (this.state.currentPage * this.state.itemsPerPage < filteredData.length) {
                this.state.currentPage++;
                this.updateModuleData(container);
            }
        });

        container.querySelector('.add-new-btn')?.addEventListener('click', () => {
            if (this.state.activeTab === 'Categories') {
                this.handleAddCategory();
            } else if (this.state.activeTab === 'Add-ons') {
                this.openModal('Add New Add-on');
            } else if (this.state.activeTab === 'Cities') {
                this.handleAddCity();
            } else {
                this.openModal('Add New ' + this.state.activeTab.slice(0, -1)); // Simple singularization
            }
        });

        container.querySelector('.bulk-delete-btn')?.addEventListener('click', () => {
            this.handleBulkDeleteTransactionsPrompt();
        });

        this.attachTableListeners(container);
    }

    private updateModuleData(container: Element) {
        const config = this.getModuleConfig() as ModuleConfig<any>;
        const filteredData = this.getFilteredAndSortedData(config.data);
        const paginatedData = this.getPaginatedData(filteredData);

        // Update Table
        const tableWrapper = container.querySelector('.data-table-wrapper');
        if (tableWrapper) {
            tableWrapper.outerHTML = this.generateTableHTML(paginatedData, config.columns);
        }

        // Re-attach table listeners because table DOM was replaced
        this.attachTableListeners(container);

        // Update Pagination
        const paginationInfo = container.querySelector('.pagination-info');
        if (paginationInfo) {
            paginationInfo.textContent = `Showing ${(this.state.currentPage - 1) * this.state.itemsPerPage + 1} to ${Math.min(this.state.currentPage * this.state.itemsPerPage, filteredData.length)} of ${filteredData.length} entries`;
        }

        const prevBtn = container.querySelector('.prev-page') as HTMLButtonElement;
        if (prevBtn) {
            prevBtn.disabled = this.state.currentPage === 1;
        }

        const nextBtn = container.querySelector('.next-page') as HTMLButtonElement;
        if (nextBtn) {
            nextBtn.disabled = this.state.currentPage * this.state.itemsPerPage >= filteredData.length;
        }
    }

    private attachTableListeners(container: Element) {
        container.querySelectorAll('th').forEach(th => {
            th.addEventListener('click', () => {
                const col = th.getAttribute('data-col');
                if (col) {
                    if (this.state.sortColumn === col) {
                        this.state.sortDirection = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
                    } else {
                        this.state.sortColumn = col;
                        this.state.sortDirection = 'asc';
                    }
                    this.updateModuleData(container);
                }
            });
        });

        // Action buttons listeners
        container.querySelectorAll('.action-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLElement).dataset.id;
                if (id) {
                    if (this.state.activeTab === 'Users') {
                        this.openViewUserModal(id);
                    } else if (this.state.activeTab === 'Sellers') {
                        this.openViewSellerModal(id);
                    } else if (this.state.activeTab === 'Transactions') {
                        this.openViewTransactionModal(id);
                    } else if (this.state.activeTab === 'Designs') {
                        // For designs we can just open a simple view modal or link to page.
                        // Let's use the modal since we have openViewDesignModal envisioned
                        this.openViewDesignModal(id);
                    } else if (this.state.activeTab === 'Billboards') {
                        this.openViewBillboardModal(id);
                    } else if (this.state.activeTab === 'Add-ons') {
                        this.openViewAddonModal(id);
                    } else {
                        this.showToast(`View ${id} (Implementation pending for this module)`, 'info');
                    }
                }
            });
        });

        container.querySelectorAll('.action-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLElement).dataset.id;
                if (id) {
                    if (this.state.activeTab === 'Users') {
                        this.openEditUserModal(id);
                    } else if (this.state.activeTab === 'Billboards') {
                        this.openEditBillboardModal(id);
                    } else if (this.state.activeTab === 'Transactions') {
                        this.openEditTransactionModal(id);
                    } else if (this.state.activeTab === 'Categories') {
                        this.openEditCategoryModal(id);
                    } else if (this.state.activeTab === 'Designs') {
                        this.openEditDesignModal(id);
                    } else if (this.state.activeTab === 'Add-ons') {
                        this.openEditAddonModal(id);
                    } else if (this.state.activeTab === 'Cities') {
                        this.openEditCityModal(id);
                    } else {
                        this.showToast(`Edit ${id} (Implementation pending)`, 'info');
                    }
                }
            });
        });

        container.querySelectorAll('.action-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLElement).dataset.id;
                if (id) {
                    if (this.state.activeTab === 'Users') {
                        this.handleDeleteUser(id);
                    } else if (this.state.activeTab === 'Sellers') {
                        this.handleDeleteSeller(id);
                    } else if (this.state.activeTab === 'Billboards') {
                        this.handleDeleteBillboard(id);
                    } else if (this.state.activeTab === 'Transactions') {
                        this.handleDeleteTransaction(id);
                    } else if (this.state.activeTab === 'Categories') {
                        this.handleDeleteCategory(id);
                    } else if (this.state.activeTab === 'Designs') {
                        this.handleDeleteDesign(id);
                    } else if (this.state.activeTab === 'Add-ons') {
                        this.handleDeleteAddon(id);
                    } else if (this.state.activeTab === 'Cities') {
                        this.handleDeleteCity(id);
                    } else if (this.state.activeTab === 'Media') {
                        this.openConfirmModal(
                            'Delete Media',
                            `Are you sure you want to delete media ${id}?`,
                            async () => {
                                try {
                                    const res = await fetch(`/api/proxy/image/${id}`, {
                                        method: 'DELETE',
                                        credentials: 'include'
                                    });
                                    // The ID returned by some APIs might be wrapped, but if status is ok assume deleted
                                    if (res.ok) {
                                        this.apiData.media = this.apiData.media.filter(m => m.id !== id);
                                        this.updateModuleData(this.root.querySelector('#content-area')!);
                                        this.showToast('Media deleted', 'success');
                                        this.closeModal();
                                    } else {
                                        const json = await res.json().catch(() => ({}));
                                        this.showToast(json.message || 'Failed to delete media', 'error');
                                    }
                                } catch (e) {
                                    console.error('Failed to delete media', e);
                                    this.showToast('Failed to delete media', 'error');
                                }
                            }
                        );
                    } else {
                        this.openConfirmModal(
                            'Delete Item',
                            'Are you sure you want to delete this item? This action cannot be undone.',
                            async () => {
                                this.showToast(`Deleted ${id} successfully`, 'success');
                                this.closeModal();
                            }
                        );
                    }
                }
            });
        });

        // Restore listeners
        container.querySelectorAll('.action-restore').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLElement).dataset.id;
                if (id) {
                    this.handleRestoreBillboard(id);
                }
            });
        });

        // Purge listeners
        container.querySelectorAll('.action-purge').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLElement).dataset.id;
                if (id) {
                    this.handlePurgeBillboard(id);
                }
            });
        });
    }


    private getFilteredAndSortedData(data: any[]) {
        if (!data) return [];
        let result = [...data];

        // Search
        if (this.state.searchQuery) {
            const q = this.state.searchQuery.toLowerCase();
            const deepSearch = (obj: any, depth = 0): boolean => {
                if (depth > 3) return false;
                if (obj === null || obj === undefined) return false;
                if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
                    return String(obj).toLowerCase().includes(q);
                }
                if (typeof obj === 'object') {
                    return Object.values(obj).some(val => deepSearch(val, depth + 1));
                }
                return false;
            };
            result = result.filter(item => deepSearch(item));
        }

        // Filters
        if (this.state.filters) {
            Object.keys(this.state.filters).forEach(key => {
                const val = this.state.filters[key];
                if (val && val !== '') {
                    result = result.filter(item => String((item as any)[key]) === val);
                }
            });
        }

        // Sort
        if (this.state.sortColumn) {
            result.sort((a, b) => {
                let valA = a[this.state.sortColumn!];
                let valB = b[this.state.sortColumn!];

                if (typeof valA === 'string') valA = valA.toLowerCase();
                if (typeof valB === 'string') valB = valB.toLowerCase();

                if (valA < valB) return this.state.sortDirection === 'asc' ? -1 : 1;
                if (valA > valB) return this.state.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }

    private getPaginatedData(data: any[]) {
        const start = (this.state.currentPage - 1) * this.state.itemsPerPage;
        return data.slice(start, start + this.state.itemsPerPage);
    }

    private getModuleConfig() {
        switch (this.state.activeTab) {
            case 'Users':
                return {
                    data: this.apiData.users,
                    columns: [
                        { key: 'username', label: 'Username' },
                        { key: 'email', label: 'Email' },
                        { key: 'phone', label: 'Phone' },
                        { key: 'level', label: 'Level', render: (v: string) => `<span class="badge badge-info">${v}</span>` },
                        { key: 'provider', label: 'Provider' },
                        { key: 'createdAt', label: 'Created', render: (v: string) => new Date(v).toLocaleDateString() },
                        {
                            key: 'actions', label: 'Actions', render: (v: any, row: any) => `
                            <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                                <button class="action-btn view action-view" data-id="${row.id}" title="View Details" 
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #e0f2fe; color: #0369a1; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                                <button class="action-btn edit action-edit" data-id="${row.id}" title="Edit User"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fef3c7; color: #b45309; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                                </button>
                                <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete User"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                </button>
                            </div>
                        ` }
                    ],
                    filters: [
                        { key: 'level', label: 'Level', options: ['ADMIN', 'BUYER', 'SELLER'] },
                        { key: 'provider', label: 'Provider', options: ['GOOGLE', 'CREDENTIALS'] }
                    ]
                };
            case 'Sellers':
                return {
                    data: this.apiData.sellers,
                    columns: [
                        { key: 'fullname', label: 'Full Name' },
                        { key: 'companyName', label: 'Company' },
                        { key: 'ktp', label: 'KTP' },
                        { key: 'officeAddress', label: 'Office' },
                        { key: 'createdAt', label: 'Created', render: (v: string) => new Date(v).toLocaleDateString() },
                        {
                            key: 'actions', label: 'Actions', render: (v: any, row: any) => `
                            <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                                <button class="action-btn view action-view" data-id="${row.id}" title="View Details" 
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #e0f2fe; color: #0369a1; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                                <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete Seller"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                </button>
                            </div>
                        ` }
                    ],
                    filters: []
                };
            case 'Billboards':
                return {
                    data: this.apiData.billboards,
                    columns: [
                        { key: 'location', label: 'Location' },
                        { key: 'cityName', label: 'City', render: (v: string, row: any) => v || row.city?.name || '-' },
                        { key: 'status', label: 'Status', render: (v: string) => `<span class="badge ${v === 'Available' ? 'badge-success' : 'badge-danger'}">${v}</span>` },
                        { key: 'mode', label: 'Mode' },
                        { key: 'size', label: 'Size' },
                        { key: 'rentPrice', label: 'Rent Price', render: (v: number) => v > 0 ? `Rp ${parseFloat(String(v)).toLocaleString()}` : '-' },
                        { key: 'sellPrice', label: 'Sell Price', render: (v: number) => v > 0 ? `Rp ${parseFloat(String(v)).toLocaleString()}` : '-' },
                        {
                            key: 'actions', label: 'Actions', render: (v: any, row: any) => `
                            <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                                <button class="action-btn view action-view" data-id="${row.id}" title="View Details" 
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #e0f2fe; color: #0369a1; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                            </div>
                        ` }
                    ],
                    filters: [
                        { key: 'status', label: 'Status', options: ['Available', 'NotAvailable'] },
                        { key: 'mode', label: 'Mode', options: ['Rent', 'Buy'] }
                    ]
                };
            case 'Transactions':
                return {
                    // Use real data
                    data: this.apiData.transactions,
                    columns: [
                        { key: 'id', label: 'ID' },
                        { key: 'user', label: 'Buyer', render: (v: any) => v?.username || 'Unknown' },
                        { key: 'billboard', label: 'Billboard', render: (v: any) => v?.location || 'Unknown Location' },
                        { key: 'totalPrice', label: 'Amount', render: (v: number) => `Rp ${v ? v.toLocaleString() : '0'}` },
                        { key: 'status', label: 'Status', render: (v: string) => `<span class="badge ${this.getStatusBadgeClass(v)}">${v}</span>` },
                        { key: 'createdAt', label: 'Date', render: (v: string) => v ? new Date(v).toLocaleDateString() : '-' },
                        {
                            key: 'actions', label: 'Actions', render: (v: any, row: any) => `
                            <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                                <button class="action-btn view action-view" data-id="${row.id}" title="View Details" 
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #e0f2fe; color: #0369a1; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                                <button class="action-btn edit action-edit" data-id="${row.id}" title="Update Status"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fef3c7; color: #b45309; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                                </button>
                            </div>
                        ` }
                    ],
                    filters: [
                        { key: 'status', label: 'Status', options: ['PENDING', 'PAID', 'COMPLETED', 'CANCELLED', 'REJECTED'] }
                    ]
                };
            case 'Recycle Bin':
                return {
                    data: this.apiData.recycleBin,
                    columns: [
                        { key: 'location', label: 'Location' },
                        { key: 'owner', label: 'Owner', render: (v: any, row: any) => row.owner?.fullname || row.owner?.companyName || '-' },
                        { key: 'deletedBy', label: 'Deleted By', render: (v: any, row: any) => row.deletedBy?.username || '-' },
                        { key: 'mode', label: 'Mode' },
                        { key: 'status', label: 'Status', render: (v: string) => `<span class="badge ${v === 'Available' ? 'badge-success' : 'badge-danger'}">${v}</span>` },
                        { key: 'deletedAt', label: 'Deleted At', render: (v: string) => v ? new Date(v).toLocaleDateString() : '-' },
                        {
                            key: 'actions', label: 'Actions', render: (v: any, row: any) => `
                            <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                                <button class="action-btn view action-restore" data-id="${row.id}" title="Restore" 
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #dcfce7; color: #166534; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74-2.74L3 12"/><path d="M3 3v9h9"/></svg>
                                </button>
                                <button class="action-btn delete action-purge" data-id="${row.id}" title="Delete Permanently"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                </button>
                            </div>
                        ` }
                    ],
                    filters: []
                };
            case 'Categories':
                return {
                    data: this.apiData.categories,
                    columns: [
                        { key: 'name', label: 'Name' },
                        { key: 'createdAt', label: 'Created', render: (v: string) => new Date(v).toLocaleDateString() },
                        {
                            key: 'actions', label: 'Actions', render: (v: any, row: any) => `
                            <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                                <button class="action-btn edit action-edit" data-id="${row.id}" title="Edit Category"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fef3c7; color: #b45309; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                                </button>
                                <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete Category"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                </button>
                            </div>
                        ` }
                    ],
                    filters: []
                };
            case 'Cities':
                return {
                    data: this.apiData.cities,
                    columns: [
                        { key: 'name', label: 'Name' },
                        { key: 'provinceId', label: 'Province ID' },
                        { key: 'createdAt', label: 'Created', render: (v: string) => new Date(v).toLocaleDateString() },
                        {
                            key: 'actions', label: 'Actions', render: (v: any, row: any) => `
                            <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                                <button class="action-btn edit action-edit" data-id="${row.id}" title="Edit City"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fef3c7; color: #b45309; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                                </button>
                                <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete City"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                </button>
                            </div>
                        ` }
                    ],
                    filters: []
                };
            case 'Designs':
                return {
                    data: this.apiData.designs,
                    columns: [
                        { key: 'name', label: 'Name' },
                        { key: 'description', label: 'Description' },
                        { key: 'price', label: 'Price', render: (v: number) => `Rp ${v.toLocaleString()}` },
                        { key: 'createdAt', label: 'Created', render: (v: string) => new Date(v).toLocaleDateString() },
                        {
                            key: 'actions', label: 'Actions', render: (v: any, row: any) => `
                            <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                                <button class="action-btn view action-view" data-id="${row.id}" title="View Details" 
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #e0f2fe; color: #0369a1; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                                <button class="action-btn edit action-edit" data-id="${row.id}" title="Edit Design"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fef3c7; color: #b45309; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                                </button>
                                <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete Design"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                </button>
                            </div>
                        ` }
                    ],
                    filters: []
                };
            case 'Add-ons':
                return {
                    data: this.apiData.addons,
                    columns: [
                        { key: 'name', label: 'Name' },
                        { key: 'description', label: 'Description' },
                        { key: 'price', label: 'Price', render: (v: number) => `Rp ${v.toLocaleString()}` },
                        { key: 'createdAt', label: 'Created', render: (v: string) => new Date(v).toLocaleDateString() },
                        {
                            key: 'actions', label: 'Actions', render: (v: any, row: any) => `
                            <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                                <button class="action-btn view action-view" data-id="${row.id}" title="View Details" 
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #e0f2fe; color: #0369a1; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                                <button class="action-btn edit action-edit" data-id="${row.id}" title="Edit Add-on"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fef3c7; color: #b45309; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                                </button>
                                <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete Add-on"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                </button>
                            </div>
                        ` }
                    ],
                    filters: []
                };

            case 'Cities':
                return {
                    data: this.apiData.cities,
                    columns: [
                        { key: 'name', label: 'Name' },
                        { key: 'province', label: 'Province' },
                        { key: 'country', label: 'Country' },
                        { key: 'createdAt', label: 'Created', render: (v: string) => new Date(v).toLocaleDateString() },
                        {
                            key: 'actions', label: 'Actions', render: (v: any, row: any) => `
                            <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                                <button class="action-btn edit action-edit" data-id="${row.id}" title="Edit City"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fef3c7; color: #b45309; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                                </button>
                                <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete City"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                </button>
                            </div>
                        ` }
                    ],
                    filters: []
                };
            case 'Media':
                return {
                    data: this.apiData.media,
                    columns: [
                        {
                            key: 'url',
                            label: 'Preview',
                            render: (v: string) => `<div style="width: 50px; height: 50px; border-radius: 6px; overflow: hidden; background: #f1f5f9;"><img src="${getImageUrl(v)}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://placehold.co/50?text=Wait'" /></div>`
                        },
                        { key: 'type', label: 'Type', render: (v: string) => `<span class="badge badge-info">${v}</span>` },
                        { key: 'createdAt', label: 'Uploaded', render: (v: string) => new Date(v).toLocaleDateString() },
                        {
                            key: 'actions', label: 'Actions', render: (v: any, row: any) => `
                            <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                                <button class="action-btn view action-view" data-id="${row.id}" title="View Media" 
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #e0f2fe; color: #0369a1; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                                <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete Media"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                </button>
                            </div>
                        ` }
                    ],
                    filters: [
                        { key: 'type', label: 'Type', options: ['design', 'billboard', 'image/png'] }
                    ]
                };
            default:
                return { data: [], columns: [], filters: [] };
        }
    }

    private attachFloatingNotificationListener() {
        const notifBtn = this.root.querySelector('.floating-notif-btn');
        notifBtn?.addEventListener('click', async () => {
            this.openModal('Notifications');
            const modalBody = this.root.querySelector('.modal-body');
            if (modalBody) {
                modalBody.innerHTML = '<div class="loading-spinner">Loading...</div>';

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

    private async fetchUnreadCount() {
        try {
            const res = await fetch('/api/proxy/notification/me/unread-count', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                this.apiData.unreadNotificationsCount = data.count || data.data || 0;
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
            const count = this.apiData.unreadNotificationsCount;
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
            const res = await fetch('/api/proxy/notification/me', { credentials: 'include' });
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
            const res = await fetch('/api/proxy/notification/read-all', {
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
            const res = await fetch(`/api/proxy/notification/${id}/read`, {
                method: 'PATCH',
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to mark read');
        } catch (e) {
            console.error('Failed to mark notification read', e);
        }
    }

    private async fetchCities() {
        try {
            const res = await fetch('/api/proxy/city', {
                credentials: 'include'
            });
            const json = await res.json();
            if (json.status && json.data) {
                this.apiData.cities = json.data;
            }
        } catch (e) {
            console.error('Failed to fetch cities', e);
        }
    }

    private async fetchMedia() {
        try {
            const res = await fetch('/api/proxy/image', {
                credentials: 'include'
            });
            const json = await res.json();
            if (json.status && json.data) {
                this.apiData.media = json.data;
            }
        } catch (e) {
            console.error('Failed to fetch media', e);
        }
    }

    private renderMediaGallery(container: Element) {
        const filteredData = this.getFilteredAndSortedData(this.apiData.media);
        // Pagination for media grid? Let's use same pagination logic
        const paginatedData = this.getPaginatedData(filteredData);

        container.innerHTML = `
            <div class="media-gallery-container" style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div class="table-controls">
                    <input type="text" class="search-input" placeholder="Search media..." value="${this.state.searchQuery}">
                    
                    <div class="filters">
                         <select class="form-control filter-select" style="width: auto; display: inline-block;" data-key="type">
                            <option value="">All Types</option>
                            <option value="billboard" ${this.state.filters['type'] === 'billboard' ? 'selected' : ''}>Billboard</option>
                             <option value="design" ${this.state.filters['type'] === 'design' ? 'selected' : ''}>Design</option>
                        </select>
                    </div>
                </div>

                ${paginatedData.length === 0 ? `
                    <div style="text-align: center; padding: 4rem; color: var(--text-secondary); background: var(--white); border-radius: 12px; border: 1px dashed var(--border-color);">
                        <div style="margin-bottom: 1rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5;"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        </div>
                        <p>No media files found</p>
                    </div>
                ` : `
                    <div class="media-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem;">
                        ${paginatedData.map((item: any) => {
            const src = getImageUrl(item.url);

            return `
                            <div class="media-card" style="background: var(--white); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; transition: all 0.2s; position: relative; group;">
                                <div style="aspect-ratio: 1; overflow: hidden; background: #f8fafc; position: relative;">
                                    <img src="${src}" alt="Media" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" loading="lazy" onerror="this.src='https://placehold.co/200x200?text=Error'" />
                                    
                                    <div class="media-overlay" style="position: absolute; inset: 0; background: rgba(0,0,0,0.0); display: flex; align-items: center; justify-content: center; opacity: 0; transition: all 0.2s;">
                                        <div style="display: flex; gap: 0.5rem;">
                                            <a href="${src}" target="_blank" class="btn-icon" style="background: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; text-decoration: none; color: var(--slate-dark); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                                                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                            </a>
                                            <button class="btn-icon action-delete-media" data-id="${item.id}" style="background: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; color: var(--primary-red); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                                                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div style="padding: 1rem;">
                                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                                        <span class="badge" style="font-size: 0.7rem; background: #e0f2fe; color: #0369a1; padding: 0.2rem 0.5rem; border-radius: 4px;">${item.type || 'Unknown'}</span>
                                    </div>
                                    <div style="font-size: 0.75rem; color: var(--text-secondary);">
                                        Uploaded ${new Date(item.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        `;
        }).join('')}
                    </div>
                `}

                <div class="pagination">
                  <div class="pagination-info">
                    Showing ${(this.state.currentPage - 1) * this.state.itemsPerPage + 1} to ${Math.min(this.state.currentPage * this.state.itemsPerPage, filteredData.length)} of ${filteredData.length} entries
                  </div>
                  <div class="pagination-controls">
                    <button class="btn btn-outline btn-sm prev-page" ${this.state.currentPage === 1 ? 'disabled' : ''}>Previous</button>
                    <button class="btn btn-outline btn-sm next-page" ${this.state.currentPage * this.state.itemsPerPage >= filteredData.length ? 'disabled' : ''}>Next</button>
                  </div>
                </div>
            </div>
        `;

        // Add hover effect listeners manually if needed, or rely on CSS :hover
        // We'll rely on CSS injection or inline styles for simplicity here.
        // Let's add a style block for the hover effect if not present
        if (!document.getElementById('media-gallery-styles')) {
            const style = document.createElement('style');
            style.id = 'media-gallery-styles';
            style.textContent = `
                .media-card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
                .media-card:hover .media-overlay { opacity: 1 !important; background: rgba(0,0,0,0.3) !important; }
            `;
            document.head.appendChild(style);
        }

        this.attachMediaGalleryListeners(container);
    }

    private attachMediaGalleryListeners(container: Element) {
        // Search
        const searchInput = container.querySelector('.search-input');
        searchInput?.addEventListener('input', (e: Event) => {
            this.state.searchQuery = (e.target as HTMLInputElement).value;
            this.state.currentPage = 1;
            this.renderMediaGallery(container); // Re-render whole gallery
        });

        // Filters
        container.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', (e: Event) => {
                const key = select.getAttribute('data-key');
                if (key) {
                    this.state.filters[key] = (e.target as HTMLSelectElement).value;
                    this.state.currentPage = 1;
                    this.renderMediaGallery(container);
                }
            });
        });

        // Pagination
        container.querySelector('.prev-page')?.addEventListener('click', () => {
            if (this.state.currentPage > 1) {
                this.state.currentPage--;
                this.renderMediaGallery(container);
            }
        });

        container.querySelector('.next-page')?.addEventListener('click', () => {
            const filteredData = this.getFilteredAndSortedData(this.apiData.media);
            if (this.state.currentPage * this.state.itemsPerPage < filteredData.length) {
                this.state.currentPage++;
                this.renderMediaGallery(container);
            }
        });

        // Delete Action
        container.querySelectorAll('.action-delete-media').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLElement).dataset.id;
                if (id) {
                    this.openConfirmModal(
                        'Delete Media',
                        `Are you sure you want to delete this media item?`,
                        async () => {
                            try {
                                const res = await fetch(`/api/proxy/image/${id}`, {
                                    method: 'DELETE',
                                    credentials: 'include'
                                });
                                if (res.ok) {
                                    this.apiData.media = this.apiData.media.filter(m => m.id !== id);
                                    this.renderMediaGallery(container); // Re-render
                                    this.showToast('Media deleted', 'success');
                                    this.closeModal();
                                } else {
                                    const json = await res.json().catch(() => ({}));
                                    this.showToast(json.message || 'Failed to delete media', 'error');
                                }
                            } catch (e) {
                                console.error('Failed to delete media', e);
                                this.showToast('Failed to delete media', 'error');
                            }
                        }
                    );
                }

            });
        });
    }



    private generateTableHTML<T>(data: T[], columns: ColumnConfig<T>[]) {
        if (data.length === 0) return '<div class="data-table-wrapper" style="padding: 2rem; text-align: center; color: var(--text-secondary);">No data found</div>';

        return `
      <div class="data-table-wrapper" style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              ${columns.map(col => `
                <th data-col="${String(col.key)}">
                  ${col.label}
                  ${this.state.sortColumn === String(col.key) ? (this.state.sortDirection === 'asc' ? 'â†‘' : 'â†“') : ''}
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${columns.map(col => `
                  <td>${col.render ? col.render((row as any)[col.key], row) : (row as any)[col.key]}</td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    }

    // Helpers
    private getUserName(id: string) {
        // Fallback to static data if not in apiData, or better logic
        // For transactions, we might still reference this.data.users which is the mock data 
        // unless we replace that too. For now let's check both or just static since mock transactions assume mock users.
        const user = this.data.users.find(u => u.id === id) || this.apiData.users.find(u => u.id === id);
        return user ? user.username : id;
    }

    private getBillboardLocation(id: string) {
        const b = this.apiData.billboards.find(i => i.id === id) || this.data.billboards.find(i => i.id === id);
        return b ? b.location : id;
    }

    private getStatusBadgeClass(status: string) {
        switch (status) {
            case 'PAID': case 'COMPLETED': return 'badge-success';
            case 'PENDING': return 'badge-warning';
            case 'CANCELLED': case 'REJECTED': return 'badge-danger';
            default: return 'badge-neutral';
        }
    }


    // Error Modal
    private openErrorModal(title: string, message: string) {
        this.openModal(title);

        const header = this.root.querySelector('.modal-header');
        if (header) {
            header.classList.add('error');
            const titleEl = header.querySelector('.modal-title');
            if (titleEl) {
                // Add icon
                titleEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem; color: var(--primary-red);"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg> ${title}`;
            }
        }

        const body = this.root.querySelector('.modal-body');
        if (body) {
            body.innerHTML = `
                <div class="error-modal-content">
                    <div class="error-message" style="font-size: 1.1rem; color: var(--slate-dark); margin-bottom: 1.5rem;">
                        ${message}
                    </div>
                </div>
            `;
        }

        const footer = this.root.querySelector('.modal-footer');
        if (footer) {
            footer.innerHTML = `
                <button class="btn btn-primary" id="error-dismiss-btn" style="background-color: var(--primary-red); border-color: var(--primary-red);">Dismiss</button>
            `;
            const dismissBtn = footer.querySelector('#error-dismiss-btn');
            if (dismissBtn) dismissBtn.addEventListener('click', () => this.closeModal());
        }
    }

    // Modal
    private ensureModalFooter() {
        const footer = this.root.querySelector('.modal-footer');
        if (!footer) return;

        // If confirm button is missing (e.g. replaced by error modal), restore standard footer
        if (!footer.querySelector('.confirm-modal')) {
            footer.innerHTML = `
                <button class="btn btn-outline close-modal">Cancel</button>
                <button class="btn btn-primary confirm-modal">Save</button>
            `;

            // Re-attach listeners since we replaced innerHTML
            footer.querySelector('.close-modal')?.addEventListener('click', () => this.closeModal());
            footer.querySelector('.confirm-modal')?.addEventListener('click', () => {
                if (this.currentModalAction) this.currentModalAction();
            });
        }
    }

    private openModal(title: string) {
        this.ensureModalFooter();

        const overlay = this.root.querySelector('.modal-overlay');
        const modal = this.root.querySelector('.modal') as HTMLElement;
        const titleEl = this.root.querySelector('.modal-title');
        const body = this.root.querySelector('.modal-body');

        if (overlay && titleEl && body) {
            titleEl.textContent = title;

            // Reset modal width to default (defined in CSS)
            if (modal) modal.style.maxWidth = '';

            if (title.includes('Add New User')) {
                body.innerHTML = this.renderAddUserForm();
                this.currentModalAction = () => this.handleAddUserSubmit();

                // Attach visibility toggle listeners
                body.querySelectorAll('.toggle-password').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const targetId = (e.currentTarget as HTMLElement).dataset.target;
                        if (targetId) {
                            const input = body.querySelector(`#${targetId}`) as HTMLInputElement;
                            if (input) {
                                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                                input.setAttribute('type', type);
                                // Optional: Toggle icon styling based on state if desired, for now just simple toggle
                            }
                        }
                    });
                });
            } else if (title.includes('Add New Design')) {
                body.innerHTML = this.renderAddDesignForm();
                this.setupAddDesignForm();
                this.currentModalAction = () => this.handleAddDesignSubmit();
            } else if (title.includes('Add New Add-on')) {
                body.innerHTML = this.renderAddAddonForm();
                this.currentModalAction = () => this.handleAddAddonSubmit();
            } else {
                body.innerHTML = '<p>Form placeholder for ' + title + '</p>';
                this.currentModalAction = null;
            }

            overlay.classList.add('open');

            // Reset button to default state
            const confirmBtn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            if (confirmBtn) {
                confirmBtn.textContent = 'Save';
                confirmBtn.className = 'btn btn-primary confirm-modal';
                confirmBtn.style.backgroundColor = ''; // Reset inline style
                confirmBtn.style.display = ''; // Reset display
                confirmBtn.disabled = false;
            }
        }
    }

    private closeModal() {
        const overlay = this.root.querySelector('.modal-overlay');
        overlay?.classList.remove('open');
        this.currentModalAction = null;
    }

    private showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
        const container = this.root.querySelector('.toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        let iconHtml = '';
        if (type === 'success') iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
        else if (type === 'error') iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
        else iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

        toast.innerHTML = `
            <div class="toast-icon">${iconHtml}</div>
            <div class="toast-message">${message}</div>
        `;

        container.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('hiding');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000);
    }

    private openConfirmModal(title: string, message: string, onConfirm: () => Promise<void> | void, type: 'success' | 'error' | 'warning' = 'warning') {
        this.ensureModalFooter();

        const overlay = this.root.querySelector('.modal-overlay');
        const titleEl = this.root.querySelector('.modal-title');
        const body = this.root.querySelector('.modal-body');
        const confirmBtn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
        const footer = this.root.querySelector('.modal-footer');

        if (footer) {
            // Clean up any extra buttons (like custom delete buttons added by other modals)
            const extraButtons = footer.querySelectorAll('button:not(.confirm-modal):not(.close-modal)');
            extraButtons.forEach(btn => btn.remove());
        }

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
            }

            this.currentModalAction = async () => {
                await onConfirm();
            };

            overlay.classList.add('open');
        }
    }
    private renderAddUserForm() {
        return `
            <form id="add-user-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="username">Username <span style="color:red">*</span></label>
                        <input type="text" id="username" name="username" class="form-control" placeholder="johndoe" required />
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="email">Email <span style="color:red">*</span></label>
                        <input type="email" id="email" name="email" class="form-control" placeholder="john@example.com" required />
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="phone">Phone <span style="color:red">*</span></label>
                    <input type="tel" id="phone" name="phone" class="form-control" placeholder="08123456789" required />
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="password">Password <span style="color:red">*</span></label>
                        <div style="position: relative;">
                            <input type="password" id="password" name="password" class="form-control" placeholder="******" required style="padding-right: 2.5rem;" />
                            <button type="button" class="toggle-password" data-target="password" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-secondary);">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="confirmPassword">Confirm Password <span style="color:red">*</span></label>
                        <div style="position: relative;">
                            <input type="password" id="confirmPassword" name="confirmPassword" class="form-control" placeholder="******" required style="padding-right: 2.5rem;" />
                            <button type="button" class="toggle-password" data-target="confirmPassword" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-secondary);">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="level">Level <span style="color:red">*</span></label>
                    <select id="level" name="level" class="form-control" required>
                        <option value="" disabled selected>Select User Level</option>
                        <option value="BUYER">BUYER</option>
                        <option value="SELLER">SELLER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>
            </form>
        `;
    }

    private async handleAddUserSubmit() {
        const form = this.root.querySelector('#add-user-form') as HTMLFormElement;
        if (!form) return;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Basic validation
        if (data.password !== data.confirmPassword) {
            this.showToast("Passwords do not match", 'error');
            const confirmInput = form.querySelector('#confirmPassword') as HTMLInputElement;
            if (confirmInput) {
                confirmInput.focus();
                confirmInput.style.borderColor = 'var(--primary-red)';
            }
            return;
        }

        try {
            const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            const originalText = btn.textContent;
            btn.textContent = 'Saving...';
            btn.disabled = true;

            const res = await fetch('/api/proxy/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const json = await res.json();

            if (json.status) {
                this.showToast('User created successfully', 'success');
                this.closeModal();
                await this.fetchUsers();
                if (this.state.activeTab === 'Users') {
                    const container = this.root.querySelector('#content-area');
                    if (container) this.updateModuleData(container);
                } else {
                    this.setActiveTab('Users');
                }
            } else {
                this.showToast(json.message || 'Failed to create user', 'error');
                if (json.message) this.openErrorModal('Creation Failed', json.message);
            }

            btn.textContent = originalText;
            btn.disabled = false;
        } catch (e) {
            console.error('Error creating user:', e);
            this.openErrorModal('Error', 'An error occurred while creating the user');
            const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            if (btn) {
                btn.textContent = 'Save';
                btn.disabled = false;
            }
        }
    }

    // --- User Actions ---

    private openViewUserModal(id: string) {
        const user = this.apiData.users.find(u => u.id === id);
        if (!user) {
            this.showToast('User data not found', 'error');
            return;
        }

        this.openModal('User Details');
        const body = this.root.querySelector('.modal-body');
        const confirmBtn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;

        if (body) {
            body.innerHTML = this.renderViewUserDetails(user);
        }

        // Hide save button for view only
        if (confirmBtn) {
            confirmBtn.style.display = 'none';
        }

        // Add Delete Button functionality
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.textContent = 'Delete User';
        deleteBtn.style.marginRight = 'auto'; // Push to left
        deleteBtn.onclick = () => this.handleDeleteUser(id);

        const footer = this.root.querySelector('.modal-footer');
        // Remove existing delete/extra buttons if any
        const existingDelete = footer?.querySelector('.btn-danger');
        if (existingDelete) existingDelete.remove();

        if (footer) {
            footer.insertBefore(deleteBtn, footer.firstChild);
        }

    }

    private renderViewUserDetails(user: any) {
        return `
            <div class="user-details-card" style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div style="display: flex; align-items: center; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
                     <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        ${user.profilePicture
                ? `<img src="${getImageUrl(user.profilePicture)}" alt="${user.username}" style="width: 100%; height: 100%; object-fit: cover;" />`
                : `<span style="font-size: 1.5rem; font-weight: 600; color: var(--text-secondary);">${user.username.charAt(0).toUpperCase()}</span>`
            }
                    </div>
                    <div>
                        <h4 style="margin: 0; font-size: 1.25rem;">${user.username}</h4>
                        <span class="badge badge-info" style="margin-top: 0.25rem;">${user.level}</span>
                    </div>
                </div>
                
                <div class="details-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="detail-item">
                        <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Email</label>
                        <div style="font-weight: 500;">${user.email || '-'}</div>
                    </div>
                    <div class="detail-item">
                        <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Phone</label>
                        <div style="font-weight: 500;">${user.phone || '-'}</div>
                    </div>
                    <div class="detail-item">
                        <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Provider</label>
                        <div style="font-weight: 500;">${user.provider || 'CREDENTIALS'}</div>
                    </div>
                     <div class="detail-item">
                        <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Created At</label>
                        <div style="font-weight: 500;">${new Date(user.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        `;
    }

    private openEditUserModal(id: string) {
        const user = this.apiData.users.find(u => u.id === id);
        if (!user) {
            this.showToast('User data not found', 'error');
            return;
        }

        this.openModal('Edit User');
        const body = this.root.querySelector('.modal-body');

        if (body) {
            body.innerHTML = this.renderEditUserForm(user);

            // Password toggle logic inclusion
            body.querySelectorAll('.toggle-password').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const targetId = (e.currentTarget as HTMLElement).dataset.target;
                    if (targetId) {
                        const input = body.querySelector(`#${targetId}`) as HTMLInputElement;
                        if (input) {
                            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                            input.setAttribute('type', type);
                        }
                    }
                });
            });
        }

        this.currentModalAction = () => this.handleEditUserSubmit(id);
    }

    private renderEditUserForm(user: any) {
        return `
            <form id="edit-user-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="username">Username</label>
                        <input type="text" id="username" name="username" class="form-control" value="${user.username}" required />
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="email">Email</label>
                        <input type="email" id="email" name="email" class="form-control" value="${user.email}" required />
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="phone">Phone</label>
                    <input type="tel" id="phone" name="phone" class="form-control" value="${user.phone}" required />
                </div>
                
                <div style="margin: 1rem 0; padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
                    <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: var(--text-secondary);">Leave password blank to keep unchanged</p>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label" for="password">New Password</label>
                            <div style="position: relative;">
                                <input type="password" id="password" name="password" class="form-control" placeholder="******" style="padding-right: 2.5rem;" />
                                <button type="button" class="toggle-password" data-target="password" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-secondary);">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="level">Level</label>
                    <select id="level" name="level" class="form-control" required>
                        <option value="BUYER" ${user.level === 'BUYER' ? 'selected' : ''}>BUYER</option>
                        <option value="SELLER" ${user.level === 'SELLER' ? 'selected' : ''}>SELLER</option>
                        <option value="ADMIN" ${user.level === 'ADMIN' ? 'selected' : ''}>ADMIN</option>
                    </select>
                </div>
            </form>
        `;
    }

    private async handleEditUserSubmit(id: string) {
        const form = this.root.querySelector('#edit-user-form') as HTMLFormElement;
        if (!form) return;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const data: any = Object.fromEntries(formData.entries());

        // Clean up empty password
        if (!data.password) {
            delete data.password;
        }

        try {
            const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            const originalText = btn.textContent;
            btn.textContent = 'Updating...';
            btn.disabled = true;

            // Use proxy to avoid CORS/Auth issues. 
            // Endpoint: PUT http://utero.viewdns.net:3100/user/id/{id} -> /api/proxy/user/id/{id}
            const res = await fetch(`/api/proxy/user/id/${id}`, {
                method: 'PUT', // Change to PUT as requested
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const json = await res.json();

            if (json.status) {
                this.showToast('User updated successfully', 'success');
                this.closeModal();
                await this.fetchUsers();
                if (this.state.activeTab === 'Users') {
                    const container = this.root.querySelector('#content-area');
                    if (container) this.updateModuleData(container);
                }
            } else {
                this.showToast(json.message || 'Failed to update user', 'error');
                if (json.message) this.openErrorModal('Update Failed', json.message);
            }

            btn.textContent = originalText;
            btn.disabled = false;
        } catch (e) {
            console.error('Error updating user:', e);
            this.openErrorModal('Error', 'An error occurred while updating the user');
            const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            if (btn) {
                btn.textContent = 'Save';
                btn.disabled = false;
            }
        }
    }

    private handleDeleteUser(id: string) {
        if (this.apiData.currentUser && this.apiData.currentUser.id === id) {
            this.showToast('You cannot delete your own account', 'error');
            return;
        }

        this.openConfirmModal(
            'Delete User',
            'Are you sure you want to delete this user? This action cannot be undone.',
            async () => {
                try {
                    // Endpoint: DELETE http://utero.viewdns.net:3100/user/{id} -> /api/proxy/user/{id}
                    const res = await fetch(`/api/proxy/user/${id}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });

                    const json = await res.json();

                    if (json.status) {
                        this.showToast('User deleted successfully', 'success');
                        this.closeModal();
                        await this.fetchUsers();
                        if (this.state.activeTab === 'Users') {
                            const container = this.root.querySelector('#content-area');
                            if (container) this.updateModuleData(container);
                        }
                    } else {
                        this.showToast(json.message || 'Failed to delete user', 'error');
                        if (json.message) this.openErrorModal('Delete Failed', json.message);
                    }
                } catch (e) {
                    console.error('Error deleting user:', e);
                    this.openErrorModal('Error', 'An error occurred while deleting the user');
                }
            }
        );
    }
    private openViewSellerModal(id: string) {
        this.openModal('Loading Seller Details...');
        const body = this.root.querySelector('.modal-body');
        if (body) body.innerHTML = '<div class="loading-spinner">Loading...</div>';

        const confirmBtn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
        if (confirmBtn) confirmBtn.style.display = 'none';

        // Add Delete Button functionality
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.textContent = 'Delete Seller';
        deleteBtn.style.marginRight = 'auto'; // Push to left
        deleteBtn.onclick = () => this.handleDeleteSeller(id);

        const footer = this.root.querySelector('.modal-footer');
        // Remove existing delete/extra buttons if any
        const existingDelete = footer?.querySelector('.btn-danger');
        if (existingDelete) existingDelete.remove();

        if (footer) {
            footer.insertBefore(deleteBtn, footer.firstChild);
        }

        fetch(`/api/proxy/seller/detail/${id}`)

            .then(res => res.json())
            .then(json => {
                if (json.status && json.data) {
                    const titleEl = this.root.querySelector('.modal-title');
                    if (titleEl) titleEl.textContent = 'Seller Details';

                    if (body) {
                        body.innerHTML = this.renderViewSellerDetails(json.data);
                    }
                } else {
                    this.showToast('Failed to load seller details', 'error');
                    this.closeModal();
                }
            })
            .catch(e => {
                console.error(e);
                this.showToast('Error loading details', 'error');
                this.closeModal();
            });
    }

    private renderViewSellerDetails(seller: any) {
        const user = seller.user || {};
        const profilePic = user.profilePicture ? getImageUrl(user.profilePicture) : null;
        const initial = user.username ? user.username.charAt(0).toUpperCase() : (seller.fullname ? seller.fullname.charAt(0).toUpperCase() : '?');

        return `
            <div class="user-details-card" style="display: flex; flex-direction: column; gap: 1.5rem;">
                <!-- Header with Profile, Name, Role -->
                <div style="display: flex; align-items: center; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
                     <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        ${profilePic
                ? `<img src="${profilePic}" alt="${seller.fullname}" style="width: 100%; height: 100%; object-fit: cover;" />`
                : `<span style="font-size: 1.5rem; font-weight: 600; color: var(--text-secondary);">${initial}</span>`
            }
                    </div>
                    <div>
                        <h4 style="margin: 0; font-size: 1.25rem;">${seller.fullname || user.username || 'Unknown Name'}</h4>
                        <div style="display: flex; gap: 0.5rem; margin-top: 0.25rem;">
                             <span class="badge badge-info">SELLER</span>
                             ${seller.companyName ? `<span class="badge badge-neutral" style="font-weight: 500;">${seller.companyName}</span>` : ''}
                        </div>
                    </div>
                </div>
                
                <!-- Personal & Account Info -->
                <div class="details-section">
                    <h5 style="margin: 0 0 1rem; font-size: 0.95rem; color: var(--slate-dark); border-left: 3px solid var(--primary-color); padding-left: 0.5rem;">Account Information</h5>
                    <div class="details-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="detail-item">
                            <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Username</label>
                            <div style="font-weight: 500;">${user.username || '-'}</div>
                        </div>
                         <div class="detail-item">
                            <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Email</label>
                            <div style="font-weight: 500;">${user.email || '-'}</div>
                        </div>
                         <div class="detail-item">
                            <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Phone</label>
                            <div style="font-weight: 500;">${user.phone || '-'}</div>
                        </div>
                         <div class="detail-item">
                            <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Joined Date</label>
                            <div style="font-weight: 500;">${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</div>
                        </div>
                    </div>
                </div>

                <!-- Business Info -->
                <div class="details-section">
                    <h5 style="margin: 0 0 1rem; font-size: 0.95rem; color: var(--slate-dark); border-left: 3px solid #f59e0b; padding-left: 0.5rem;">Business Details</h5>
                    <div class="details-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="detail-item">
                            <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Company Name</label>
                            <div style="font-weight: 500;">${seller.companyName || '-'}</div>
                        </div>
                        <div class="detail-item">
                            <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">NPWP</label>
                            <div style="font-weight: 500;">${seller.npwp || '-'}</div>
                        </div>
                        <div class="detail-item">
                            <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">KTP Number</label>
                            <div style="font-weight: 500;">${seller.ktp || '-'}</div>
                        </div>
                         <div class="detail-item">
                            <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Last Details Update</label>
                            <div style="font-weight: 500;">${seller.updatedAt ? new Date(seller.updatedAt).toLocaleDateString() : '-'}</div>
                        </div>
                        <div class="detail-item" style="grid-column: span 2;">
                            <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Office Address</label>
                            <div style="font-weight: 500; line-height: 1.4;">${seller.officeAddress || '-'}</div>
                        </div>
                         <div class="detail-item" style="grid-column: span 2;">
                            <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">KTP Address</label>
                            <div style="font-weight: 500; line-height: 1.4;">${seller.ktpAddress || '-'}</div>
                        </div>
                    </div>
                </div>

                <div style="font-size: 0.7rem; color: var(--text-light); text-align: right; margin-top: 0.5rem;">
                    User ID: ${user.id || seller.userId || '-'} | Seller ID: ${seller.id}
                </div>
            </div>
        `;
    }

    private handleDeleteSeller(id: string) {
        this.openConfirmModal(
            'Delete Seller',
            'Are you sure you want to delete this seller? This action cannot be undone.',
            async () => {
                try {
                    const res = await fetch(`/api/proxy/seller/${id}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });

                    const json = await res.json();

                    if (json.status) {
                        this.showToast('Seller deleted successfully', 'success');
                        this.closeModal();
                        await this.fetchSellers();
                        if (this.state.activeTab === 'Sellers') {
                            const container = this.root.querySelector('#content-area');
                            if (container) this.updateModuleData(container);
                        }
                    } else {
                        this.showToast(json.message || 'Failed to delete seller', 'error');
                        if (json.message) this.openErrorModal('Delete Failed', json.message);
                    }
                } catch (e) {
                    console.error('Error deleting seller:', e);
                    this.openErrorModal('Error', 'An error occurred while deleting the seller');
                }
            }
        );
    }

    private handleDeleteDesign(id: string) {
        this.openConfirmModal(
            'Delete Design',
            'Are you sure you want to delete this design? This action cannot be undone.',
            async () => {
                try {
                    // Endpoint: DELETE http://utero.viewdns.net:3100/design/{id} -> /api/proxy/design/{id}
                    const res = await fetch(`/api/proxy/design/${id}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });

                    const json = await res.json();

                    if (json.status) {
                        this.showToast('Design deleted successfully', 'success');
                        this.closeModal();
                        await this.fetchDesigns();
                        if (this.state.activeTab === 'Designs') {
                            const container = this.root.querySelector('#content-area');
                            if (container) this.updateModuleData(container);
                        }
                    } else {
                        this.showToast(json.message || 'Failed to delete design', 'error');
                        if (json.message) this.openErrorModal('Delete Failed', json.message);
                    }
                } catch (e) {
                    console.error('Error deleting design:', e);
                    this.openErrorModal('Error', 'An error occurred while deleting the design');
                }
            }
        );
    }

    private openViewDesignModal(id: string) {
        this.openModal('Loading Design Details...');
        const modal = this.root.querySelector('.modal') as HTMLElement;
        if (modal) modal.style.maxWidth = '800px';

        const body = this.root.querySelector('.modal-body');
        if (body) body.innerHTML = '<div class="loading-spinner">Loading...</div>';

        const confirmBtn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
        if (confirmBtn) confirmBtn.style.display = 'none';

        // Add Delete Button functionality
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.textContent = 'Delete Design';
        deleteBtn.style.marginRight = 'auto'; // Push to left
        deleteBtn.onclick = () => this.handleDeleteDesign(id);

        const footer = this.root.querySelector('.modal-footer');
        // Remove existing delete/extra buttons if any
        const existingDelete = footer?.querySelector('.btn-danger');
        if (existingDelete) existingDelete.remove();

        if (footer) {
            footer.insertBefore(deleteBtn, footer.firstChild);
        }

        fetch(`/api/proxy/design/${id}`)

            .then(res => res.json())
            .then(json => {
                if (json.status && json.data) {
                    const titleEl = this.root.querySelector('.modal-title');
                    if (titleEl) titleEl.textContent = json.data.name || 'Design Details';

                    if (body) {
                        body.innerHTML = this.renderViewDesignDetails(json.data);
                        this.setupDesignCarousel(body);
                    }
                } else {
                    this.showToast('Failed to load design details', 'error');
                    this.closeModal();
                }
            })
            .catch(e => {
                console.error(e);
                this.showToast('Error loading details', 'error');
                this.closeModal();
            });
    }

    private renderViewDesignDetails(design: any) {
        // Handle images: API returns 'image' array of objects { url: string, ... }
        // We also support 'images' array of strings just in case
        let images: string[] = [];
        if (Array.isArray(design.image)) {
            images = design.image.map((img: any) => img.url || '');
        } else if (Array.isArray(design.images)) {
            images = design.images;
        }

        const mainImage = images.length > 0 ? images[0] : null;

        return `
            <div class="design-details-container" style="display: flex; flex-direction: column; gap: 1.5rem;">
                <!-- Image Carousel Section -->
                <div class="design-carousel" style="background: var(--white); border-radius: 12px; overflow: hidden; border: 1px solid var(--border-color);">
                    <div class="main-image-container" style="width: 100%; height: 400px; background: #f8fafc; display: flex; align-items: center; justify-content: center; position: relative;">
                        ${mainImage
                ? `<img id="carousel-main-image" src="${getImageUrl(mainImage)}" alt="${design.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />`
                : `<div style="color: var(--text-secondary); display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5;"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                                <span>No Image Available</span>
                               </div>`
            }
                    </div>
                    ${images.length > 1 ? `
                        <div class="thumbnail-track" style="display: flex; gap: 0.75rem; padding: 1rem; overflow-x: auto; background: var(--white); border-top: 1px solid var(--border-color);">
                            ${images.map((img, index) => `
                                <div class="carousel-thumbnail ${index === 0 ? 'active' : ''}" data-src="${getImageUrl(img)}" data-index="${index}" 
                                     style="width: 80px; height: 80px; border-radius: 8px; overflow: hidden; cursor: pointer; border: 2px solid ${index === 0 ? 'var(--primary-red)' : 'transparent'}; flex-shrink: 0; transition: all 0.2s;">
                                    <img src="${getImageUrl(img)}" style="width: 100%; height: 100%; object-fit: cover;" />
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>

                <!-- Info Section -->
                <div style="background: var(--white); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                        <div>
                            <h3 style="margin: 0; font-size: 1.5rem; color: var(--slate-dark);">${design.name}</h3>
                            <div style="margin-top: 0.5rem; font-size: 1.25rem; font-weight: 700; color: var(--primary-red);">
                                Rp ${Number(design.price).toLocaleString()}
                            </div>
                        </div>
                        <span class="badge badge-success" style="font-size: 0.875rem;">Active</span>
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem;">Description</label>
                        <p style="margin: 0; color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem;">
                            ${design.description || 'No description provided.'}
                        </p>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                         <div>
                            <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Created At</label>
                            <div style="font-weight: 500;">${new Date(design.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Last Updated</label>
                            <div style="font-weight: 500;">${new Date(design.updatedAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    private setupDesignCarousel(container: Element) {
        const thumbnails = container.querySelectorAll('.carousel-thumbnail');
        const mainImage = container.querySelector('#carousel-main-image') as HTMLImageElement;

        if (!mainImage || thumbnails.length === 0) return;

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Update styling
                thumbnails.forEach(t => {
                    (t as HTMLElement).style.borderColor = 'transparent';
                    t.classList.remove('active');
                });
                (thumb as HTMLElement).style.borderColor = 'var(--primary-red)';
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

    // --- Design Actions ---

    private renderAddDesignForm() {
        return `
            <form id="add-design-form">
                <div class="form-group">
                    <label class="form-label" for="name">Design Name <span style="color:red">*</span></label>
                    <input type="text" id="name" name="name" class="form-control" placeholder="e.g. Modern Minimalist Banner" required />
                </div>
                <div class="form-group">
                    <label class="form-label" for="description">Description <span style="color:red">*</span></label>
                    <textarea id="description" name="description" class="form-control" rows="4" placeholder="Describe the design details..." required></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label" for="price">Price (Rp) <span style="color:red">*</span></label>
                    <input type="number" id="price" name="price" class="form-control" placeholder="0" required />
                </div>
                <div class="form-group">
                    <label class="form-label">Images <span style="color:red">*</span></label>
                    <div class="upload-zone" id="upload-zone">
                        <input type="file" id="images" name="images" multiple accept="image/*" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;" />
                        <div class="upload-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
                        </div>
                        <div class="upload-text">Click or drag images here</div>
                        <div class="upload-subtext">Supports JPG, PNG (Max 5MB)</div>
                    </div>
                </div>
                <div id="file-preview" class="file-preview" style="margin-top: 1rem;"></div>
            </form>
        `;
    }

    private setupAddDesignForm() {
        const dropZone = this.root.querySelector('#upload-zone');
        const fileInput = this.root.querySelector('#images') as HTMLInputElement;
        const preview = this.root.querySelector('#file-preview');

        if (!dropZone || !fileInput || !preview) return;

        // Reset selected files when opening form
        this.selectedDesignFiles = [];
        this.updateFilePreview(preview);

        // Drag/Drop visual feedback
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.remove('dragover');
            }, false);
        });

        // Handle File Drop
        dropZone.addEventListener('drop', (e: any) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            this.handleFilesSelection(files, preview);
        });

        // Handle Input Change
        fileInput.addEventListener('change', () => {
            if (fileInput.files) {
                this.handleFilesSelection(fileInput.files, preview);
                // Reset value to allow selecting the same file again if needed (though unlikely with multi)
                fileInput.value = '';
            }
        });
    }

    private handleFilesSelection(fileList: FileList, previewElement: Element) {
        const newFiles = Array.from(fileList);
        // let hasError = false;

        for (const file of newFiles) {
            // Validate Max 10 Files Total
            if (this.selectedDesignFiles.length >= 10) {
                this.showToast('Maximum 10 images allowed', 'error');
                // hasError = true;
                break;
            }

            // Validate Size (5MB = 5 * 1024 * 1024 bytes)
            if (file.size > 5 * 1024 * 1024) {
                this.showToast(`File ${file.name} is too large (Max 5MB)`, 'error');
                // hasError = true;
                continue;
            }

            this.selectedDesignFiles.push(file);
        }

        this.updateFilePreview(previewElement);
    }

    private updateFilePreview(previewElement: Element) {
        previewElement.innerHTML = '';
        if (this.selectedDesignFiles.length === 0) return;

        const list = document.createElement('div');
        list.style.display = 'grid';
        list.style.gridTemplateColumns = 'repeat(auto-fill, minmax(100px, 1fr))';
        list.style.gap = '1rem';

        this.selectedDesignFiles.forEach((file, index) => {
            const url = URL.createObjectURL(file);
            const item = document.createElement('div');
            item.className = 'file-preview-item';
            item.style.flexDirection = 'column';
            item.style.alignItems = 'stretch';
            item.style.padding = '0.5rem';
            item.style.position = 'relative';

            item.innerHTML = `
                <div style="aspect-ratio: 1; border-radius: 4px; overflow: hidden; background: #f1f5f9; margin-bottom: 0.5rem;">
                    <img src="${url}" style="width: 100%; height: 100%; object-fit: cover;" alt="${file.name}" />
                </div>
                <div style="font-size: 0.75rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0.25rem;">
                    ${file.name}
                </div>
                <div style="font-size: 0.7rem; color: var(--text-secondary);">
                    ${(file.size / (1024 * 1024)).toFixed(2)} MB
                </div>
                <button type="button" class="btn-remove-file" data-index="${index}" title="Remove image"
                    style="position: absolute; top: -8px; right: -8px; background: white; border: 1px solid var(--border-color); color: #ef4444; cursor: pointer; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); z-index: 10;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            `;
            list.appendChild(item);
        });

        previewElement.appendChild(list);

        // Attach listeners to remove buttons
        previewElement.querySelectorAll('.btn-remove-file').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt((e.currentTarget as HTMLElement).dataset.index || '-1');
                if (index > -1) {
                    this.selectedDesignFiles.splice(index, 1);
                    this.updateFilePreview(previewElement);
                }
            });
        });
    }

    private async handleAddDesignSubmit() {
        const form = this.root.querySelector('#add-design-form') as HTMLFormElement;
        if (!form) return;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if (this.selectedDesignFiles.length === 0) {
            this.showToast('Please upload at least one image', 'error');
            return;
        }

        const formData = new FormData(form);
        // Remove the 'images' field from FormData (it might contain the last selected file from input) and append our array
        formData.delete('images');

        this.selectedDesignFiles.forEach(file => {
            formData.append('images', file);
        });

        try {
            const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            const originalText = btn.textContent;
            btn.textContent = 'Saving...';

            btn.disabled = true;

            const res = await fetch('/api/proxy/design', {
                method: 'POST',
                // Don't set Content-Type header when sending FormData, let browser set it with boundary
                body: formData
            });

            const json = await res.json();

            if (json.status) {
                this.showToast('Design created successfully', 'success');
                this.closeModal();
                await this.fetchDesigns();
                if (this.state.activeTab === 'Designs') {
                    const container = this.root.querySelector('#content-area');
                    if (container) this.updateModuleData(container);
                }
            } else {
                this.showToast(json.message || 'Failed to create design', 'error');
            }

            btn.textContent = originalText;
            btn.disabled = false;
        } catch (e) {
            console.error('Error creating design:', e);
            this.showToast('An error occurred while creating the design', 'error');
            const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            if (btn) {
                btn.textContent = 'Save';
                btn.disabled = false;
            }
        }
    }

    private openEditDesignModal(id: string) {
        const design = (this.apiData.designs || []).find((d: any) => d.id === id);
        if (!design) {
            this.showToast('Design not found', 'error');
            return;
        }

        this.openModal('Edit Design');
        const body = this.root.querySelector('.modal-body');

        // Add Delete Button functionality
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.textContent = 'Delete Design';
        deleteBtn.style.marginRight = 'auto'; // Push to left
        deleteBtn.onclick = () => this.handleDeleteDesign(id);

        const footer = this.root.querySelector('.modal-footer');
        // Remove existing delete/extra buttons if any
        const existingDelete = footer?.querySelector('.btn-danger');
        if (existingDelete) existingDelete.remove();

        if (footer) {
            footer.insertBefore(deleteBtn, footer.firstChild);
        }


        if (body) {
            body.innerHTML = this.renderEditDesignForm(design);
            // Pass initial images (normalize array)
            const initialImages = Array.isArray(design.images) ? design.images : (Array.isArray(design.image) ? design.image : []);
            this.setupEditDesignForm(body, initialImages);
        }

        this.currentModalAction = () => this.handleEditDesignSubmit(id);
    }

    private renderEditDesignForm(design: any) {
        return `
            <form id="edit-design-form">
                <style>
                    .image-manager-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 1rem; margin-top: 0.5rem; }
                    .image-item { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color); background: #f8fafc; }
                    .image-item img { width: 100%; height: 100%; object-fit: cover; }
                    .image-item .remove-btn { position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; border-radius: 50%; background: rgba(239, 68, 68, 0.9); border: none; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s; }
                    .image-item .remove-btn:hover { transform: scale(1.1); }
                    .add-image-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px dashed var(--border-color); border-radius: 8px; cursor: pointer; transition: all 0.2s; color: var(--text-secondary); aspect-ratio: 1; }
                    .add-image-btn:hover { border-color: var(--primary-color); background: #eff6ff; color: var(--primary-color); }
                </style>
                <div class="form-group">
                    <label class="form-label" for="name">Name <span style="color:red">*</span></label>
                    <input type="text" id="name" name="name" class="form-control" value="${design.name}" required />
                </div>
                <div class="form-group">
                    <label class="form-label" for="description">Description <span style="color:red">*</span></label>
                    <textarea id="description" name="description" class="form-control" rows="3" required>${design.description}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label" for="price">Price (Rp) <span style="color:red">*</span></label>
                    <input type="number" id="price" name="price" class="form-control" value="${design.price}" required />
                </div>
                
                <div class="form-group">
                    <label class="form-label">Images</label>
                    <div id="image-manager-container" class="image-manager-grid">
                        <!-- Images will be rendered here by setupEditDesignForm -->
                        <label class="add-image-btn" for="new-image-input">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                            <span style="font-size: 0.75rem; margin-top: 0.25rem;">Add</span>
                        </label>
                    </div>
                    <input type="file" id="new-image-input" multiple accept="image/*" style="display: none;" />
                    <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem;">Drag to reorder (coming soon). Click X to remove.</p>
                </div>
            </form>
        `;
    }

    private setupEditDesignForm(container: Element, initialImages: any[]) {
        // State to hold current images (mixed strings and Files)
        let currentImages: (string | File)[] = [];

        // Normalize initial images
        if (Array.isArray(initialImages)) {
            currentImages = initialImages.map(img => img.url || img);
        }

        const grid = container.querySelector('#image-manager-container');
        const addButton = container.querySelector('.add-image-btn');
        const input = container.querySelector('#new-image-input') as HTMLInputElement;

        // Function to render the grid
        const renderGrid = () => {
            // Remove existing image items (keep the add button)
            const items = grid?.querySelectorAll('.image-item');
            items?.forEach(el => el.remove());

            currentImages.forEach((img, index) => {
                const div = document.createElement('div');
                div.className = 'image-item';

                const src = img instanceof File ? URL.createObjectURL(img) : getImageUrl(img);

                div.innerHTML = `
                    <img src="${src}" />
                    <button type="button" class="remove-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                `;

                // Remove handler
                div.querySelector('.remove-btn')?.addEventListener('click', () => {
                    currentImages.splice(index, 1);
                    renderGrid();
                });

                // Insert before add button
                if (addButton) {
                    grid?.insertBefore(div, addButton);
                }
            });

            // Store state on the form element so submit handler can access it
            const form = container.querySelector('#edit-design-form') as any;
            if (form) form.__currentImages = currentImages;
        };

        // File input handler
        input?.addEventListener('change', () => {
            if (input.files && input.files.length > 0) {
                Array.from(input.files).forEach(file => {
                    currentImages.push(file);
                });
                renderGrid();
                input.value = ''; // Reset for distinct future changes
            }
        });

        // Initial render
        renderGrid();
    }

    private async handleEditDesignSubmit(id: string) {
        const form = this.root.querySelector('#edit-design-form') as any;
        if (!form) return;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
        const originalText = btn.textContent;
        btn.textContent = 'Processing Images...';
        btn.disabled = true;

        try {
            const formData = new FormData();
            formData.append('name', form.querySelector('#name').value);
            formData.append('description', form.querySelector('#description').value);
            // Ensure price is a number string if backend expects valid number parsing
            formData.append('price', String(Number(form.querySelector('#price').value)));

            // Access the current images state
            const currentImages: (string | File)[] = form.__currentImages || [];

            // Convert all images to Files
            const imagePromises = currentImages.map(async (img, index) => {
                if (img instanceof File) {
                    return img;
                } else {
                    // It's a URL (string). Fetch it and convert to Blob -> File
                    try {
                        // Use getImageUrl to ensure we have the correct proxy path
                        const url = getImageUrl(img);
                        const response = await fetch(url);
                        const blob = await response.blob();
                        // Guess mimetype or default to png/jpg based on url or common sense
                        const mimeType = blob.type || 'image/jpeg';
                        const ext = mimeType.split('/')[1] || 'jpg';
                        const filename = `existing-image-${index}.${ext}`;
                        return new File([blob], filename, { type: mimeType });
                    } catch (err) {
                        console.error('Failed to rehydrate image:', img, err);
                        return null;
                    }
                }
            });

            const files = await Promise.all(imagePromises);

            // Append valid files to formData
            files.forEach((file) => {
                if (file) {
                    formData.append('images', file);
                }
            });

            btn.textContent = 'Updating...';

            const res = await fetch(`/api/proxy/design/${id}`, {
                method: 'PATCH',
                body: formData,
                credentials: 'include'
            });

            const json = await res.json();

            if (json.status) {
                this.showToast('Design updated successfully', 'success');
                this.closeModal();
                await this.fetchDesigns();
                if (this.state.activeTab === 'Designs') {
                    const container = this.root.querySelector('#content-area');
                    if (container) this.updateModuleData(container);
                }
            } else {
                this.showToast(json.message || 'Failed to update design', 'error');
                if (json.message) this.openErrorModal('Update Failed', json.message);
            }
        } catch (e) {
            console.error('Error updating design:', e);
            this.openErrorModal('Error', 'An error occurred while updating the design');
        } finally {
            if (btn) {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        }
    }


    private openViewTransactionModal(id: string) {
        this.openModal('Loading Transaction Details...');

        // Use a wider modal for transaction details to accommodate the comprehensive data
        const modal = this.root.querySelector('.modal') as HTMLElement;
        if (modal) modal.style.maxWidth = '850px';

        const body = this.root.querySelector('.modal-body');
        if (body) body.innerHTML = '<div class="loading-spinner">Loading...</div>';

        const confirmBtn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
        if (confirmBtn) confirmBtn.style.display = 'none'; // View only

        // Add Delete Button functionality
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.textContent = 'Delete Transaction';
        deleteBtn.style.marginRight = 'auto'; // Push to left
        deleteBtn.onclick = () => this.handleDeleteTransaction(id);

        const footer = this.root.querySelector('.modal-footer');
        const existingDelete = footer?.querySelector('.btn-danger');
        if (existingDelete) existingDelete.remove();

        if (footer) {
            footer.insertBefore(deleteBtn, footer.firstChild);
        }


        // Endpoint: GET http://utero.viewdns.net:3100/transaction/detail/{id} -> /api/proxy/transaction/detail/{id}
        fetch(`/api/proxy/transaction/detail/${id}`)
            .then(res => res.json())
            .then(json => {
                if (json.status && json.data) {
                    const titleEl = this.root.querySelector('.modal-title');
                    if (titleEl) titleEl.textContent = 'Transaction Details';

                    if (body) {
                        body.innerHTML = this.renderViewTransactionDetails(json.data);
                    }
                } else {
                    this.showToast('Failed to load transaction details', 'error');
                    this.closeModal();
                }
            })
            .catch(e => {
                console.error(e);
                this.showToast('Error loading details', 'error');
                this.closeModal();
            });
    }

    private renderViewTransactionDetails(transaction: any) {
        const buyer = transaction.buyer || transaction.user || {};
        const seller = transaction.seller || {};
        const billboard = transaction.billboard || {};
        const addons = transaction.addons || [];
        const history = (transaction.transactionHistory && transaction.transactionHistory.length > 0) ? transaction.transactionHistory[0] : null;
        const pricing = history ? history.pricing : null;

        const formatRp = (val: any) => 'Rp ' + (Number(val) || 0).toLocaleString();
        const formatDate = (dateStr: string) => dateStr ? new Date(dateStr).toLocaleDateString() : '-';

        return `
            <div class="transaction-details-container" style="display: flex; flex-direction: column; gap: 1.5rem;">
                
                <!-- Status Header -->
                <div style="background: linear-gradient(to right, #f8fafc, #ffffff); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                    <div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Transaction ID</div>
                        <h4 style="margin: 0; font-size: 1.25rem; color: var(--slate-dark); letter-spacing: -0.025em; font-family: monospace;">#${transaction.id.split('-')[0]}...</h4>
                        <div style="margin-top: 0.75rem;">
                            <span class="badge ${this.getStatusBadgeClass(transaction.status)}" style="padding: 0.35rem 0.75rem; font-size: 0.875rem;">${transaction.status}</span>
                        </div>
                    </div>
                    <div style="text-align: right;">
                         <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Total Amount</div>
                         <div style="font-size: 1.75rem; font-weight: 700; color: var(--primary-red); letter-spacing: -0.025em;">${formatRp(transaction.totalPrice)}</div>
                    </div>
                </div>
                
                <!-- Parties Involved -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <!-- Buyer Card -->
                    <div style="background: var(--white); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.25rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #f1f5f9;">
                             <div style="background: #eff6ff; color: #3b82f6; padding: 6px; border-radius: 6px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                             </div>
                             <h5 style="margin: 0; font-size: 0.95rem; color: var(--slate-dark);">Buyer</h5>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            <div>
                                <label style="display: block; font-size: 0.75rem; color: var(--text-secondary);">Name</label>
                                <div style="font-weight: 600; font-size: 0.95rem;">${buyer.username || 'Unknown'}</div>
                            </div>
                            <div>
                                <label style="display: block; font-size: 0.75rem; color: var(--text-secondary);">Contact</label>
                                <div style="font-size: 0.9rem;">${buyer.email || '-'}</div>
                                <div style="font-size: 0.9rem;">${buyer.phone || '-'}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Seller Card -->
                    <div style="background: var(--white); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.25rem;">
                         <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #f1f5f9;">
                             <div style="background: #fdf2f8; color: #db2777; padding: 6px; border-radius: 6px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                             </div>
                             <h5 style="margin: 0; font-size: 0.95rem; color: var(--slate-dark);">Seller</h5>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            <div>
                                <label style="display: block; font-size: 0.75rem; color: var(--text-secondary);">Company / Name</label>
                                <div style="font-weight: 600; font-size: 0.95rem;">${seller.companyName || seller.fullname || 'Unknown'}</div>
                            </div>
                             <div>
                                <label style="display: block; font-size: 0.75rem; color: var(--text-secondary);">Office Address</label>
                                <div style="font-size: 0.85rem; line-height: 1.4;">${seller.officeAddress || '-'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Billboard Details (Detailed) -->
                <div style="background: var(--white); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.75rem;">
                            <div style="background: #fff7ed; color: #ea580c; padding: 6px; border-radius: 6px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                            </div>
                            <h5 style="margin: 0; font-size: 1rem; color: var(--slate-dark);">Billboard Specification</h5>
                    </div>
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
                        <div>
                             <div style="margin-bottom: 1rem;">
                                <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Location</label>
                                <div style="font-weight: 600; color: var(--text-primary); font-size: 1rem; line-height: 1.4;">${billboard.location || 'Unknown Location'}</div>
                                <div style="font-size: 0.875rem; color: var(--text-secondary);">${billboard.cityName || ''}, ${billboard.provinceName || ''}</div>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                                <div><label style="font-size: 0.75rem; color: var(--text-secondary);">Type</label><div style="font-weight: 500;">${billboard.type || '-'}</div></div>
                                <div><label style="font-size: 0.75rem; color: var(--text-secondary);">Size</label><div style="font-weight: 500;">${billboard.size || '-'}</div></div>
                                <div><label style="font-size: 0.75rem; color: var(--text-secondary);">Lighting</label><div style="font-weight: 500;">${billboard.lighting || '-'}</div></div>
                                <div><label style="font-size: 0.75rem; color: var(--text-secondary);">Orientation</label><div style="font-weight: 500;">${billboard.orientation || '-'}</div></div>
                            </div>
                        </div>
                        <div style="background: #f8fafc; padding: 1rem; border-radius: 8px;">
                             <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Info</label>
                             <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                 <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                                    <span style="color: var(--text-secondary);">Display</span>
                                    <span style="font-weight: 500;">${billboard.display || '-'}</span>
                                 </div>
                                 <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                                    <span style="color: var(--text-secondary);">Ownership</span>
                                    <span style="font-weight: 500;">${billboard.landOwnership || '-'}</span>
                                 </div>
                                  <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                                    <span style="color: var(--text-secondary);">Tax</span>
                                    <span class="badge badge-neutral">${billboard.tax || '-'}</span>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>

                <!-- Logistics & Pricing Breakdown -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    
                    <!-- Addons -->
                    <div style="background: var(--white); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.25rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #f1f5f9;">
                             <div style="background: #f0fdf4; color: #16a34a; padding: 6px; border-radius: 6px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                             </div>
                             <h5 style="margin: 0; font-size: 0.95rem; color: var(--slate-dark);">Services & Addons</h5>
                        </div>
                        ${addons.length > 0 ? `
                            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem;">
                                ${addons.map((item: any) => `
                                    <li style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.5rem; border-bottom: 1px dashed var(--border-color);">
                                        <div>
                                            <div style="font-weight: 500; font-size: 0.9rem;">${item.addOn?.name || 'Item'}</div>
                                            <div style="font-size: 0.75rem; color: var(--text-secondary);">${item.addOn?.description || ''}</div>
                                        </div>
                                        <div style="font-weight: 600; font-size: 0.9rem;">${formatRp(item.addOn?.price)}</div>
                                    </li>
                                `).join('')}
                            </ul>
                        ` : '<div style="color: var(--text-secondary); font-size: 0.875rem; font-style: italic;">No additional services</div>'}
                    </div>

                    <!-- Pricing Summary -->
                    <div style="background: #f8fafc; border: 1px solid var(--border-color); border-radius: 12px; padding: 1.25rem;">
                         <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #e2e8f0;">
                             <h5 style="margin: 0; font-size: 0.95rem; color: var(--slate-dark);">Payment Summary</h5>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                                <span style="color: var(--text-secondary);">Rent Price</span>
                                <span>${pricing ? formatRp(pricing.rentOrSell) : formatRp(billboard.rentPrice)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                                <span style="color: var(--text-secondary);">Service Fee</span>
                                <span>${pricing ? formatRp(pricing.servicePrice) : formatRp(billboard.servicePrice)}</span>
                            </div>
                            ${pricing && pricing.designPrice != '0' ? `
                                <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                                    <span style="color: var(--text-secondary);">Design</span>
                                    <span>${formatRp(pricing.designPrice)}</span>
                                </div>
                            ` : ''}
                            ${addons.length > 0 ? `
                                <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                                    <span style="color: var(--text-secondary);">Add-ons Total</span>
                                    <span>${formatRp(addons.reduce((sum: number, item: any) => sum + (Number(item.addOn?.price) || 0), 0))}</span>
                                </div>
                            ` : ''}
                            <div style="margin-top: 0.5rem; padding-top: 0.75rem; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-weight: 600; color: var(--slate-dark);">Total Paid</span>
                                <span style="font-weight: 700; color: var(--primary-red); font-size: 1.1rem;">${formatRp(transaction.totalPrice)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                 <!-- Timeline Footer -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 0.5rem;">
                     <div style="text-align: center;">
                        <div style="font-size: 0.75rem; color: var(--text-secondary);">Period</div>
                        <div style="font-weight: 500; font-size: 0.85rem;">${formatDate(transaction.startDate)} - ${formatDate(transaction.endDate)}</div>
                     </div>
                     <div style="text-align: center;">
                        <div style="font-size: 0.75rem; color: var(--text-secondary);">Rented Mode</div>
                         <div style="font-weight: 500; font-size: 0.85rem;">${billboard.mode || '-'}</div>
                     </div>
                      <div style="text-align: center;">
                        <div style="font-size: 0.75rem; color: var(--text-secondary);">Created At</div>
                         <div style="font-weight: 500; font-size: 0.85rem;">${formatDate(transaction.createdAt)}</div>
                     </div>
                </div>

            </div>
        `;
    }

    private openEditTransactionModal(id: string) {
        // We can just utilize a simple status update form
        // We'll need the current status. For now, fetch detail first to be safe, or find in list.
        const transaction = (this.apiData.transactions || []).find((t: any) => t.id === id);

        if (!transaction) {
            this.showToast('Transaction not found in local data', 'error');
            return;
        }

        this.openModal('Update Transaction Status');
        const body = this.root.querySelector('.modal-body');

        if (body) {
            body.innerHTML = `
                <form id="update-transaction-form">
                    <div class="form-group">
                        <label class="form-label" for="status">Status</label>
                         <select id="status" name="status" class="form-control" required>
                            <option value="PENDING" ${transaction.status === 'PENDING' ? 'selected' : ''}>PENDING</option>
                            <option value="PAID" ${transaction.status === 'PAID' ? 'selected' : ''}>PAID</option>
                            <option value="COMPLETED" ${transaction.status === 'COMPLETED' ? 'selected' : ''}>COMPLETED</option>
                            <option value="CANCELLED" ${transaction.status === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
                            <option value="REJECTED" ${transaction.status === 'REJECTED' ? 'selected' : ''}>REJECTED</option>
                        </select>
                    </div>
                     <div class="form-group" style="margin-top: 1rem;">
                        <p style="font-size: 0.875rem; color: var(--text-secondary);">
                            Currently updating transaction <strong>#${id}</strong>
                        </p>
                    </div>
                </form>
            `;
        }

        this.currentModalAction = () => this.handleUpdateTransactionStatus(id);
    }

    private async handleUpdateTransactionStatus(id: string) {
        const form = this.root.querySelector('#update-transaction-form') as HTMLFormElement;
        const statusSelect = form.querySelector('#status') as HTMLSelectElement;
        const newStatus = statusSelect.value;

        try {
            const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            const originalText = btn.textContent;
            btn.textContent = 'Updating...';
            btn.disabled = true;

            // Endpoint: PATCH http://utero.viewdnst:3100/transaction/{id} -> /api/proxy/transaction/{id}
            // Note: User provided 'utero.viewdnst:3100' which is likely a typo for viewdns.net.
            // Using proxy handles the partial path.

            const res = await fetch(`/api/proxy/transaction/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus }),
                credentials: 'include'
            });

            const json = await res.json();

            if (json.status) {
                this.showToast('Transaction status updated', 'success');
                this.closeModal();
                await this.fetchTransactions(); // Refresh list
                if (this.state.activeTab === 'Transactions') {
                    const container = this.root.querySelector('#content-area');
                    if (container) this.updateModuleData(container);
                }
            } else {
                this.showToast(json.message || 'Failed to update status', 'error');
                if (json.message) this.openErrorModal('Update Failed', json.message);
            }
            btn.textContent = originalText;
            btn.disabled = false;

        } catch (e) {
            console.error('Error updating transaction:', e);
            this.openErrorModal('Error', 'An error occurred while updating status');
            const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            if (btn) {
                btn.textContent = 'Save';
                btn.disabled = false;
            }
        }
    }

    private handleDeleteTransaction(id: string) {
        this.openConfirmModal(
            'Delete Transaction',
            'Are you sure you want to delete this transaction? This action cannot be undone.',
            async () => {
                try {
                    // Endpoint: DELETE http://utero.viewdns:3100/transaction/{id} -> /api/proxy/transaction/{id}
                    const res = await fetch(`/api/proxy/transaction/${id}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });

                    const json = await res.json();

                    if (json.status) {
                        this.showToast('Transaction deleted successfully', 'success');
                        this.closeModal();
                        await this.fetchTransactions();
                        if (this.state.activeTab === 'Transactions') {
                            const container = this.root.querySelector('#content-area');
                            if (container) this.updateModuleData(container);
                        }
                    } else {
                        this.showToast(json.message || 'Failed to delete transaction', 'error');
                        if (json.message) this.openErrorModal('Delete Failed', json.message);
                    }
                } catch (e) {
                    console.error('Error deleting transaction:', e);
                    this.openErrorModal('Error', 'An error occurred while deleting the transaction');
                }
            }
        );
    }

    // --- Billboard Actions ---

    private handleDeleteBillboard(id: string) {
        this.openConfirmModal(
            'Delete Billboard',
            'Are you sure you want to delete this billboard? This action cannot be undone.',
            async () => {
                try {
                    // Endpoint: DELETE http://utero.viewdns.net/billboard/{id} -> /api/proxy/billboard/{id}
                    const res = await fetch(`/api/proxy/billboard/${id}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });

                    if (res.status === 409) {
                        this.openErrorModal('Delete Failed', 'Cannot delete: Billboard has active transactions or dependencies.');
                        return;
                    }

                    const json = await res.json();

                    if (json.status) {
                        this.showToast('Billboard deleted successfully', 'success');
                        this.closeModal();
                        await this.fetchBillboards();
                        if (this.state.activeTab === 'Billboards') {
                            const container = this.root.querySelector('#content-area');
                            if (container) this.updateModuleData(container);
                        }
                    } else {
                        this.showToast(json.message || 'Failed to delete billboard', 'error');
                        if (json.message) this.openErrorModal('Delete Failed', json.message);
                    }
                } catch (e) {
                    console.error('Error deleting billboard:', e);
                    this.openErrorModal('Error', 'An error occurred while deleting the billboard');
                }
            }
        );
    }

    private openViewBillboardModal(id: string) {
        this.openModal('Loading Billboard Details...');

        // Increase modal width for better card layout
        const modal = this.root.querySelector('.modal') as HTMLElement;
        if (modal) modal.style.maxWidth = '1000px';

        const body = this.root.querySelector('.modal-body');
        if (body) body.innerHTML = '<div class="loading-spinner">Loading...</div>';

        const confirmBtn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
        if (confirmBtn) confirmBtn.style.display = 'none';




        // Endpoint: GET http://utero.viewdns.net:3100/billboard/detail/{id} -> /api/proxy/billboard/detail/{id}
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
                    this.showToast('Failed to load billboard details', 'error');
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

        const formatDate = (date: string) => date ? new Date(date).toLocaleDateString() : '-';

        const owner = billboard.owner || {};
        const user = owner.user || {};
        const category = billboard.category || {};
        const city = billboard.city || {};
        const province = city.province || {};

        return `
            <div class="billboard-details-container" style="display: flex; flex-direction: column; gap: 1.5rem;">
                <!-- Header / Cover with Carousel -->
                <div style="position: relative; border-radius: 12px; overflow: hidden; background: #f1f5f9; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    
                    <div class="billboard-carousel-wrapper">
                         <div class="main-image-view" style="height: 400px; position: relative; background: #0f172a; display: flex; align-items: center; justify-content: center;">
                             <img id="billboard-main-image" src="${mainImage}" alt="${billboard.location}" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.src='https://placehold.co/600x400?text=No+Image'"/>
                             
                             <div style="position: absolute; top: 1rem; right: 1rem; display: flex; gap: 0.5rem; z-index: 10;">
                                  <span class="badge ${billboard.status === 'Available' ? 'badge-success' : 'badge-danger'}" style="padding: 0.5rem 1rem; font-size: 0.875rem; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${billboard.status}</span>
                                  <span class="badge badge-info" style="padding: 0.5rem 1rem; font-size: 0.875rem; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${billboard.mode}</span>
                             </div>
                         </div>
                         ${images.length > 1 ? `
                            <div class="thumbnail-track" style="display: flex; gap: 0.75rem; padding: 1rem; overflow-x: auto; background: var(--white); border-bottom: 1px solid var(--border-color);">
                                ${images.map((img, index) => `
                                    <div class="carousel-thumbnail ${index === 0 ? 'active' : ''}" data-src="${getImageUrl(img)}" data-index="${index}" 
                                         style="width: 80px; height: 60px; border-radius: 6px; overflow: hidden; cursor: pointer; border: 2px solid ${index === 0 ? 'var(--primary-item)' : 'transparent'}; flex-shrink: 0; opacity: ${index === 0 ? '1' : '0.6'}; transition: all 0.2s;">
                                        <img src="${getImageUrl(img)}" style="width: 100%; height: 100%; object-fit: cover;" />
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>

                    <div style="padding: 1.5rem; background: var(--white);">
                         <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div>
                                <div style="font-size: 0.875rem; color: var(--primary-item); font-weight: 600; margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.05em;">${category.name || 'Billboard'}</div>
                                <h3 style="margin: 0 0 0.5rem 0; font-size: 1.5rem; font-weight: 700; color: var(--slate-dark);">${billboard.location}</h3>
                                <p style="margin: 0; color: var(--text-secondary); display: flex; align-items: center; gap: 0.5rem;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                    ${billboard.cityName || city.name || ''}, ${billboard.provinceName || province.name || ''}
                                </p>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Views</div>
                                <div style="display: flex; align-items: center; gap: 0.25rem; justify-content: flex-end; font-weight: 600;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                    ${billboard.view || 0}
                                </div>
                            </div>
                         </div>
                    </div>
                </div>

                <!-- Grid Layout for Info -->
                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;">
                    
                    <!-- Left Column -->
                    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                        
                        <!-- Description -->
                        <div class="panel" style="background: var(--white); padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-color);">
                            <h5 style="margin: 0 0 1rem 0; font-size: 1rem; color: var(--slate-dark); padding-bottom: 0.5rem; border-bottom: 1px solid #f1f5f9;">Description</h5>
                            <p style="margin: 0; color: var(--text-secondary); line-height: 1.6;">${billboard.description || 'No description provided.'}</p>
                        </div>

                         <!-- Specifications -->
                        <div class="panel" style="background: var(--white); padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-color);">
                            <h5 style="margin: 0 0 1rem 0; font-size: 1rem; color: var(--slate-dark); padding-bottom: 0.5rem; border-bottom: 1px solid #f1f5f9;">Specifications</h5>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                                <div><label style="font-size: 0.75rem; color: var(--text-secondary);">Size</label><div style="font-weight: 500;">${billboard.size || '-'}</div></div>
                                <div><label style="font-size: 0.75rem; color: var(--text-secondary);">Orientation</label><div style="font-weight: 500;">${billboard.orientation || '-'}</div></div>
                                <div><label style="font-size: 0.75rem; color: var(--text-secondary);">Lighting</label><div style="font-weight: 500;">${billboard.lighting || '-'}</div></div>
                                <div><label style="font-size: 0.75rem; color: var(--text-secondary);">Display</label><div style="font-weight: 500;">${billboard.display || '-'}</div></div>
                                <div><label style="font-size: 0.75rem; color: var(--text-secondary);">Land Ownership</label><div style="font-weight: 500;">${billboard.landOwnership || '-'}</div></div>
                                <div><label style="font-size: 0.75rem; color: var(--text-secondary);">Tax</label><div style="font-weight: 500;">${billboard.tax || '-'}</div></div>
                            </div>
                        </div>

                        <!-- Map -->
                        <div class="panel" style="background: var(--white); padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-color);">
                             <h5 style="margin: 0 0 1rem 0; font-size: 1rem; color: var(--slate-dark); padding-bottom: 0.5rem; border-bottom: 1px solid #f1f5f9;">Location Map</h5>
                             <div id="view-billboard-map" style="width: 100%; height: 300px; border-radius: 8px; background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: var(--text-secondary);">Map Loading...</div>
                             <div style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-secondary);">
                                <span style="font-weight: 500;">Address:</span> ${billboard.formattedAddress || '-'}
                             </div>
                        </div>
                    </div>

                    <!-- Right Column -->
                    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                        
                        <!-- Pricing -->
                         <div class="panel" style="background: var(--white); padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-color);">
                            <h5 style="margin: 0 0 1rem 0; font-size: 1rem; color: var(--slate-dark); padding-bottom: 0.5rem; border-bottom: 1px solid #f1f5f9;">Pricing</h5>
                            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="color: var(--text-secondary); font-size: 0.9rem;">Sell Price</span>
                                    <span style="font-weight: 600; color: var(--primary-blue); font-size: 1rem;">${formatPrice(billboard.sellPrice)}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="color: var(--text-secondary); font-size: 0.9rem;">Rent Price</span>
                                    <span style="font-weight: 600; color: var(--success-green); font-size: 1rem;">${formatPrice(billboard.rentPrice)}</span>
                                </div>
                                 <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="color: var(--text-secondary); font-size: 0.9rem;">Service Price</span>
                                    <span style="font-weight: 500;">${formatPrice(billboard.servicePrice)}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Owner Info -->
                        <div class="panel" style="background: var(--white); padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-color);">
                            <h5 style="margin: 0 0 1rem 0; font-size: 1rem; color: var(--slate-dark); padding-bottom: 0.5rem; border-bottom: 1px solid #f1f5f9;">Owner Details</h5>
                            
                            <div style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem;">
                                <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--bg-secondary); overflow: hidden; flex-shrink: 0;">
                                    ${user.profilePicture
                ? `<img src="${getImageUrl(user.profilePicture)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'"/>`
                : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: 600; color: var(--text-secondary);">${owner.fullname ? owner.fullname.charAt(0) : '?'}</div>`
            }
                                </div>
                                <div>
                                    <div style="font-weight: 600; font-size: 0.95rem;">${owner.fullname || 'Unknown'}</div>
                                    <div style="font-size: 0.8rem; color: var(--text-secondary);">${owner.companyName || '-'}</div>
                                </div>
                            </div>

                            <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem;">
                                <div style="display: flex; gap: 0.5rem; align-items: center;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-secondary);"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                    <span style="color: var(--text-primary);">${user.email || '-'}</span>
                                </div>
                                <div style="display: flex; gap: 0.5rem; align-items: center;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-secondary);"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                    <span style="color: var(--text-primary);">${user.phone || '-'}</span>
                                </div>
                            </div>
                        </div>

                         <!-- Meta -->
                        <div class="panel" style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px dashed var(--border-color);">
                            <div style="font-size: 0.75rem; color: var(--text-secondary);">ID: ${billboard.id}</div>
                            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">Created: ${formatDate(billboard.createdAt)}</div>
                            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">Updated: ${formatDate(billboard.updatedAt)}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    private setupBillboardCarousel(container: Element) {
        const thumbnails = container.querySelectorAll('.carousel-thumbnail');
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
                (thumb as HTMLElement).style.borderColor = 'var(--primary-item)';
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

    private async openEditBillboardModal(id: string) {
        this.openModal('Loading Billboard Details...');
        const body = this.root.querySelector('.modal-body');
        if (body) body.innerHTML = '<div class="loading-spinner">Loading...</div>';

        const confirmBtn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
        if (confirmBtn) confirmBtn.style.display = 'none';



        try {
            // Fetch required data in parallel

            const [detailsRes] = await Promise.all([
                fetch(`/api/proxy/billboard/detail/${id}`, { credentials: 'include' }),
                this.apiData.provinces.length === 0 ? this.fetchProvinces() : Promise.resolve(),
                this.apiData.cities.length === 0 ? this.fetchCities() : Promise.resolve()
            ]);

            const detailsJson = await detailsRes.json();

            if (detailsJson.status && detailsJson.data) {
                const titleEl = this.root.querySelector('.modal-title');
                if (titleEl) titleEl.textContent = 'Edit Billboard';

                if (body) {
                    body.innerHTML = this.renderEditBillboardForm(detailsJson.data);
                    this.initMapForBillboard(detailsJson.data);
                    this.attachEditBillboardListeners();
                }

                if (confirmBtn) {
                    confirmBtn.style.display = '';
                    confirmBtn.textContent = 'Save Changes';
                    this.currentModalAction = () => this.handleEditBillboardSubmit(id);
                }
            } else {
                this.showToast('Failed to load billboard details', 'error');
                this.closeModal();
            }
        } catch (e) {
            console.error(e);
            this.showToast('Error loading details', 'error');
            this.closeModal();
        }
    }

    private renderEditBillboardForm(billboard: any) {
        return `
            <form id="edit-billboard-form">
                <style>
                    /* Inline style for quick iteration, ideally move to CSS */
                </style>
                <div class="form-grid">
                    <div class="form-group">
                         <label class="form-label" for="mode">Mode</label>
                        <select id="mode" name="mode" class="form-control">
                            <option value="Rent" ${billboard.mode === 'Rent' ? 'selected' : ''}>Rent</option>
                            <option value="Buy" ${billboard.mode === 'Buy' ? 'selected' : ''}>Buy</option>
                            <option value="Both" ${billboard.mode === 'Both' ? 'selected' : ''}>Both</option>
                        </select>
                    </div>
                     <div class="form-group">
                        <label class="form-label" for="status">Status</label>
                        <select id="status" name="status" class="form-control">
                            <option value="Available" ${billboard.status === 'Available' ? 'selected' : ''}>Available</option>
                            <option value="NotAvailable" ${billboard.status === 'NotAvailable' ? 'selected' : ''}>Not Available</option>
                        </select>
                    </div>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                         <label class="form-label" for="rentPrice">Rent Price</label>
                         <input type="number" id="rentPrice" name="rentPrice" class="form-control" value="${billboard.rentPrice || 0}" />
                    </div>
                    <div class="form-group">
                         <label class="form-label" for="sellPrice">Sell Price</label>
                         <input type="number" id="sellPrice" name="sellPrice" class="form-control" value="${billboard.sellPrice || 0}" />
                    </div>
                </div>

                <div class="form-grid">
                    <div class="form-group" id="province-container">
                        <label class="form-label">Province</label>
                        <input type="hidden" id="provinceId" name="provinceId" value="${billboard.provinceId || ''}">
                        <div class="custom-select-container">
                            <div class="custom-select-trigger" id="province-trigger">
                                ${billboard.provinceName || (billboard.provinceId ? (this.apiData.provinces.find((p: any) => p.id === billboard.provinceId)?.name || 'Select Province') : 'Select Province')}
                            </div>
                            <div class="custom-options-container">
                                <input type="text" class="custom-search-input" placeholder="Search province...">
                                <div class="custom-options-list"></div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group" id="city-container">
                        <label class="form-label">City</label>
                        <input type="hidden" id="cityId" name="cityId" value="${billboard.cityId || ''}">
                        <div class="custom-select-container">
                            <div class="custom-select-trigger" id="city-trigger">
                                ${billboard.cityName || (billboard.cityId ? (this.apiData.cities.find((c: any) => c.id === billboard.cityId)?.name || 'Select City') : 'Select City')}
                            </div>
                            <div class="custom-options-container">
                                <input type="text" class="custom-search-input" placeholder="Search city...">
                                <div class="custom-options-list"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="location">Location Name</label>
                        <input type="text" id="location" name="location" class="form-control" value="${billboard.location || ''}" />
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="size">Size</label>
                        <input type="text" id="size" name="size" class="form-control" value="${billboard.size || ''}" />
                    </div>
                </div>

                 <div class="form-group">
                    <label class="form-label" for="description">Description</label>
                    <textarea id="description" name="description" class="form-control" rows="3">${billboard.description || ''}</textarea>
                </div>

                <!-- Hidden fields for Map Data -->
                <input type="hidden" id="gPlaceId" name="gPlaceId" value="${billboard.gPlaceId || ''}" />
                <input type="hidden" id="formattedAddress" name="formattedAddress" value="${billboard.formattedAddress || ''}" />
                <input type="hidden" id="latitude" name="latitude" value="${billboard.latitude || ''}" />
                <input type="hidden" id="longitude" name="longitude" value="${billboard.longitude || ''}" />
                <input type="hidden" id="addressComponents" name="addressComponents" value='${billboard.addressComponents ? JSON.stringify(billboard.addressComponents) : ''}' />
                <input type="hidden" id="mapViewport" name="mapViewport" value='${billboard.mapViewport ? JSON.stringify(billboard.mapViewport) : ''}' />

                <div class="form-group">
                    <label class="form-label">Location Helper (Map)</label>
                    <div id="billboard-map" style="width: 100%; height: 300px; background: #e2e8f0; border-radius: 0.375rem; display: flex; align-items: center; justify-content: center; color: var(--text-secondary);">
                        Map Loading...
                    </div>
                    <small style="display: block; margin-top: 0.5rem; color: var(--text-secondary);">
                        Search location above or click on map to set coordinates.
                    </small>
                </div>
            </form>
        `;
    }

    private attachEditBillboardListeners() {
        const form = this.root.querySelector('#edit-billboard-form') as HTMLFormElement;
        if (!form) return;

        const modeSelect = form.querySelector('#mode') as HTMLSelectElement;
        const rentInput = form.querySelector('#rentPrice') as HTMLInputElement;
        const sellInput = form.querySelector('#sellPrice') as HTMLInputElement;

        const provinceIdInput = form.querySelector('#provinceId') as HTMLInputElement;
        const cityIdInput = form.querySelector('#cityId') as HTMLInputElement;
        const cityTrigger = form.querySelector('#city-trigger') as HTMLElement;

        const updatePriceFields = () => {
            const mode = modeSelect.value;
            if (mode === 'Rent') {
                rentInput.disabled = false;
                sellInput.disabled = true;
                sellInput.value = '0';
            } else if (mode === 'Buy') {
                rentInput.disabled = true;
                sellInput.disabled = false;
                rentInput.value = '0';
            } else {
                rentInput.disabled = false;
                sellInput.disabled = false;
            }
        };

        // Initial state
        updatePriceFields();

        modeSelect.addEventListener('change', updatePriceFields);

        // -- Setup Custom Dropdowns --

        // Setup Province
        this.setupSearchableDropdown(
            form.querySelector('#province-container') as HTMLElement,
            this.apiData.provinces,
            'Select Province',
            (selectedId) => {
                provinceIdInput.value = selectedId;

                // Clear city
                cityIdInput.value = '';
                cityTrigger.textContent = 'Select City';

                // Re-setup City Dropdown with filtered options
                const cities = this.apiData.cities || [];
                const filteredCities = cities.filter((c: any) => c.provinceId === selectedId);

                this.setupSearchableDropdown(
                    form.querySelector('#city-container') as HTMLElement,
                    filteredCities,
                    'Select City',
                    (cityId) => {
                        cityIdInput.value = cityId;
                    }
                );
            }
        );

        // Initial Setup City (if province selected)
        const initialProvId = provinceIdInput.value;
        let initialCities = this.apiData.cities || [];
        if (initialProvId) {
            initialCities = initialCities.filter((c: any) => c.provinceId === initialProvId);
        }

        this.setupSearchableDropdown(
            form.querySelector('#city-container') as HTMLElement,
            initialCities,
            'Select City',
            (cityId) => {
                cityIdInput.value = cityId;
            }
        );
    }

    private setupSearchableDropdown(
        container: HTMLElement,
        data: any[],
        placeholder: string,
        onSelect: (id: string) => void
    ) {
        const trigger = container.querySelector('.custom-select-trigger') as HTMLElement;
        const optionsContainer = container.querySelector('.custom-options-container') as HTMLElement;
        const searchInput = container.querySelector('.custom-search-input') as HTMLInputElement;
        const optionsList = container.querySelector('.custom-options-list') as HTMLElement;

        if (!trigger || !optionsContainer || !searchInput || !optionsList) return;

        // Render options
        const renderOptions = (items: any[]) => {
            optionsList.innerHTML = items.length ? items.map(item => `
                <div class="custom-option" data-value="${item.id}">
                    ${item.name}
                </div>
            `).join('') : '<div class="custom-option" style="color: #999; cursor: default;">No results found</div>';

            // Click listener for options
            optionsList.querySelectorAll('.custom-option').forEach(opt => {
                opt.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const target = e.currentTarget as HTMLElement;
                    if (target.dataset.value) { // Ignore 'no results'
                        const val = target.dataset.value;
                        const label = target.textContent?.trim() || '';

                        // Re-query trigger because we replaced it in the DOM
                        const currentTrigger = container.querySelector('.custom-select-trigger') as HTMLElement;
                        if (currentTrigger) currentTrigger.textContent = label;

                        onSelect(val);

                        optionsContainer.classList.remove('open');
                    }
                });
            });
        };

        renderOptions(data);

        // Toggle open
        // Remove old listener if any? Not easily possible with anonymous func, but replacing innerHTML of list helps.
        // Trigger listener needs to be deduped or handled carefully. 
        // A simple way is to use a flag or clone node, but here we can just assume one init per modal open.
        // Wait, attachEditBillboardListeners is called once per modal open.

        // IMPORTANT: If we call setup multiple times (like on province change), we might stack listeners on Trigger.
        // Solution: specific class or cloneNode to nuke listeners.
        const newTrigger = trigger.cloneNode(true) as HTMLElement;
        trigger.parentNode?.replaceChild(newTrigger, trigger);

        // Re-select trigger
        const activeTrigger = container.querySelector('.custom-select-trigger') as HTMLElement;

        activeTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close others?
            document.querySelectorAll('.custom-options-container.open').forEach(el => {
                if (el !== optionsContainer) el.classList.remove('open');
            });

            optionsContainer.classList.toggle('open');
            if (optionsContainer.classList.contains('open')) {
                searchInput.value = '';
                renderOptions(data); // Reset filter
                searchInput.focus();
            }
        });

        // Search filter
        const newSearch = searchInput.cloneNode(true) as HTMLInputElement;
        searchInput.parentNode?.replaceChild(newSearch, searchInput);
        const activeSearch = container.querySelector('.custom-search-input') as HTMLInputElement;

        activeSearch.addEventListener('input', (e) => {
            const term = (e.target as HTMLInputElement).value.toLowerCase();
            const filtered = data.filter(item => item.name.toLowerCase().includes(term));
            renderOptions(filtered);
        });

        activeSearch.addEventListener('click', (e) => e.stopPropagation());

        // Close on click outside
        // This adds a global listener every time setup is called. We should be careful.
        // Better: One global listener in `init` that closes all .open containers if click is outside.
        // I will add that global listener in `init` or `attachGlobalListeners` instead of here.
        // But for now, let's just leave it relying on the global click that closes things, or add a specific one.

        // Let's rely on a global listener we'll add in attachGlobalListeners or similar.
        // Just in case, let's add a document listener that checks.
    }


    private async initMapForBillboard(data: any) {
        const mapElement = document.getElementById("billboard-map");
        if (!mapElement) return;

        // Ensure Maps loaded
        try {
            await this.loadGoogleMapsScript();
        } catch (e) {
            console.error('Failed to load GMaps', e);
            mapElement.innerHTML = '<div style="color: red; padding: 1rem;">Failed to load Google Maps API.</div>';
            return;
        }

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
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false
        });

        const marker = new (window as any).google.maps.Marker({
            position: location,
            map: map,
            draggable: true,
            animation: (window as any).google.maps.Animation.DROP
        });

        // Autocomplete
        const input = document.getElementById("location") as HTMLInputElement;
        const hiddenAddress = document.getElementById("formattedAddress") as HTMLInputElement;
        const hiddenLat = document.getElementById("latitude") as HTMLInputElement;
        const hiddenLng = document.getElementById("longitude") as HTMLInputElement;
        const hiddenPlaceId = document.getElementById("gPlaceId") as HTMLInputElement;

        if (input && (window as any).google.maps.places) {
            const autocomplete = new (window as any).google.maps.places.Autocomplete(input);
            autocomplete.bindTo("bounds", map);

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();

                if (!place.geometry || !place.geometry.location) {
                    this.showToast("No details available for input: '" + place.name + "'", 'error');
                    return;
                }

                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(17);
                }

                marker.setPosition(place.geometry.location);

                // Update hidden fields
                if (hiddenLat) hiddenLat.value = place.geometry.location.lat();
                if (hiddenLng) hiddenLng.value = place.geometry.location.lng();
                if (hiddenAddress) hiddenAddress.value = place.formatted_address || input.value;
                if (hiddenPlaceId) hiddenPlaceId.value = place.place_id || '';

                // Attempt to auto-fill City/Province from address_components
                if (place.address_components) {
                    const provinceSearch = document.getElementById('provinceSearch') as HTMLInputElement;
                    const citySearch = document.getElementById('citySearch') as HTMLInputElement;

                    // 1. Find Administrative Levels
                    let foundProvName = '';
                    let foundCityName = '';

                    for (const comp of place.address_components) {
                        if (comp.types.includes('administrative_area_level_1')) {
                            foundProvName = comp.long_name; // e.g., "East Java"
                        }
                        if (comp.types.includes('administrative_area_level_2')) {
                            foundCityName = comp.long_name; // e.g., "Surabaya"
                        }
                    }

                    // 2. Fuzzy/Smart match with our API data
                    // Note: Google Maps often uses English ("East Java"), API might use Indonesian ("JAWA TIMUR")
                    // This is complex. We'll try basic inclusion or exact match for now, or just fill the text.
                    // If we fill the text, the 'input' listener might not match ID if exact string differs.

                    if (foundProvName) {
                        const provinces = this.apiData.provinces || [];
                        // Try exact match first
                        let matchedProv = provinces.find((p: any) => p.name.toLowerCase() === foundProvName.toLowerCase());

                        // Try "Jawa Timur" vs "East Java" - simplistic hardcoding or 'includes'
                        if (!matchedProv) {
                            // Try contains
                            matchedProv = provinces.find((p: any) =>
                                p.name.toLowerCase().includes(foundProvName.toLowerCase()) ||
                                foundProvName.toLowerCase().includes(p.name.toLowerCase())
                            );
                        }

                        // Specific manual mapping for Indonesia if needed
                        if (!matchedProv && foundProvName === 'East Java') matchedProv = provinces.find((p: any) => p.name === 'JAWA TIMUR');
                        if (!matchedProv && foundProvName === 'West Java') matchedProv = provinces.find((p: any) => p.name === 'JAWA BARAT');
                        if (!matchedProv && foundProvName === 'Central Java') matchedProv = provinces.find((p: any) => p.name === 'JAWA TENGAH');
                        if (!matchedProv && foundProvName === 'Special Region of Yogyakarta') matchedProv = provinces.find((p: any) => p.name === 'DI YOGYAKARTA');
                        if (!matchedProv && foundProvName === 'Jakarta') matchedProv = provinces.find((p: any) => p.name.includes('DKI'));

                        if (matchedProv) {
                            provinceSearch.value = matchedProv.name;
                            // Trigger input event to update ID and City filters
                            provinceSearch.dispatchEvent(new Event('input'));

                            // Wait slightly for city filter to apply? No, it's synchronous in our listener.

                            // Now City
                            if (foundCityName) {
                                // Cities list is now filtered in the listener? 
                                // Actually listener updates the city <datalist>. We need to re-fetch full list or filtered list to match.

                                const cities = this.apiData.cities || []; // Use full list for matching logic just in case
                                const relevantCities = cities.filter((c: any) => c.provinceId === matchedProv.id);

                                // "Surabaya" vs "KOTA SURABAYA"
                                let matchedCity = relevantCities.find((c: any) => c.name.toLowerCase() === foundCityName.toLowerCase());
                                if (!matchedCity) {
                                    matchedCity = relevantCities.find((c: any) => c.name.toLowerCase().includes(foundCityName.toLowerCase()));
                                }

                                if (matchedCity) {
                                    citySearch.value = matchedCity.name;
                                    citySearch.dispatchEvent(new Event('input'));
                                }
                            }
                        }
                    }
                }
            });
        } else if (input) {
            console.warn('Google Maps Places library not loaded');
        }

        // Marker Drag End
        marker.addListener("dragend", () => {
            const pos = marker.getPosition();
            if (pos) {
                if (hiddenLat) hiddenLat.value = pos.lat();
                if (hiddenLng) hiddenLng.value = pos.lng();
                map.panTo(pos);

                // Reverse Geocoding to get address from new lat/lng?
                // For now just update lat/lng. User can type address if needed.
            }
        });

        // Click on Map
        map.addListener("click", (e: any) => {
            const pos = e.latLng;
            marker.setPosition(pos);
            if (hiddenLat) hiddenLat.value = pos.lat();
            if (hiddenLng) hiddenLng.value = pos.lng();
            map.panTo(pos);
        });
    }

    private async handleEditBillboardSubmit(id: string) {
        const form = this.root.querySelector('#edit-billboard-form') as HTMLFormElement;
        if (!form) return;

        const formData = new FormData(form);
        // We need to construct the JSON body carefully
        // The API likely expects a JSON body, not FormData, unless there are files.
        // The prompt mentioned "body (image 1)" for update. If we are updating images, we might need FormData.
        // For now, let's assume JSON for the fields we are editing.

        const data: any = Object.fromEntries(formData.entries());

        // Parse JSON strings back to objects if they were touched/set
        try {
            if (typeof data.addressComponents === 'string' && data.addressComponents) {
                data.addressComponents = JSON.parse(data.addressComponents);
            }
            if (typeof data.mapViewport === 'string' && data.mapViewport) {
                data.mapViewport = JSON.parse(data.mapViewport);
            }
        } catch (e) {
            console.error('Error parsing map data JSON', e);
        }

        // Convert types
        if (data.rentPrice) data.rentPrice = Number(data.rentPrice);
        if (data.sellPrice) data.sellPrice = Number(data.sellPrice);
        if (data.latitude) data.latitude = Number(data.latitude);
        if (data.longitude) data.longitude = Number(data.longitude);

        try {
            const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            const originalText = btn.textContent;
            btn.textContent = 'Updating...';
            btn.disabled = true;

            // PATCH http://utero.viewdns.net:3100/billboard/{id}
            const res = await fetch(`/api/proxy/billboard/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            const json = await res.json();

            if (json.status) {
                this.showToast('Billboard updated successfully', 'success');
                this.closeModal();
                await this.fetchBillboards();
                if (this.state.activeTab === 'Billboards') {
                    const container = this.root.querySelector('#content-area');
                    if (container) this.updateModuleData(container);
                }
            } else {
                this.showToast(json.message || 'Failed to update billboard', 'error');
                if (json.message) this.openErrorModal('Update Failed', json.message);
            }

            btn.textContent = originalText;
            btn.disabled = false;
        } catch (e) {
            console.error('Error updating billboard:', e);
            this.openErrorModal('Error', 'An error occurred while updating the billboard');
        }
    }

    // --- Category Actions ---

    private handleAddCategory() {
        this.openModal('Add New Category');
        const body = this.root.querySelector('.modal-body');
        if (body) {
            body.innerHTML = this.renderAddCategoryForm();
        }
        this.currentModalAction = () => this.handleAddCategorySubmit();
    }

    private renderAddCategoryForm() {
        return `
            <form id="add-category-form">
                <div class="form-group">
                    <label class="form-label" for="name">Category Name <span style="color:red">*</span></label>
                    <input type="text" id="name" name="name" class="form-control" placeholder="e.g. Commercial" required />
                </div>
            </form>
        `;
    }

    private async handleAddCategorySubmit() {
        const form = this.root.querySelector('#add-category-form') as HTMLFormElement;
        if (!form) return;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            const originalText = btn.textContent;
            btn.textContent = 'Saving...';
            btn.disabled = true;

            // Endpoint: POST http://utero.viewdns.net:3100/category -> /api/proxy/category
            const res = await fetch('/api/proxy/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            const json = await res.json();

            if (json.status) {
                this.showToast('Category created successfully', 'success');
                this.closeModal();
                await this.fetchCategories();
                if (this.state.activeTab === 'Categories') {
                    const container = this.root.querySelector('#content-area');
                    if (container) this.updateModuleData(container);
                }
            } else {
                this.showToast(json.message || 'Failed to create category', 'error');
                if (json.message) this.openErrorModal('Creation Failed', json.message);
            }

            btn.textContent = originalText;
            btn.disabled = false;
        } catch (e) {
            console.error('Error creating category:', e);
            this.openErrorModal('Error', 'An error occurred while creating the category');
            const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            if (btn) {
                btn.textContent = 'Save';
                btn.disabled = false;
            }
        }
    }

    private openEditCategoryModal(id: string) {
        const category = this.apiData.categories.find(c => c.id === id);
        if (!category) {
            this.showToast('Category not found', 'error');
            return;
        }

        this.openModal('Edit Category');
        const body = this.root.querySelector('.modal-body');

        // Add Delete Button functionality
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.textContent = 'Delete Category';
        deleteBtn.style.marginRight = 'auto'; // Push to left
        deleteBtn.onclick = () => this.handleDeleteCategory(id);

        const footer = this.root.querySelector('.modal-footer');
        // Remove existing delete/extra buttons if any
        const existingDelete = footer?.querySelector('.btn-danger');
        if (existingDelete) existingDelete.remove();

        if (footer) {
            footer.insertBefore(deleteBtn, footer.firstChild);
        }

        if (body) {
            body.innerHTML = this.renderEditCategoryForm(category);
        }

        this.currentModalAction = () => this.handleEditCategorySubmit(id);
    }

    private renderEditCategoryForm(category: any) {
        return `
            <form id="edit-category-form">
                <div class="form-group">
                    <label class="form-label" for="name">Category Name <span style="color:red">*</span></label>
                    <input type="text" id="name" name="name" class="form-control" value="${category.name}" required />
                </div>
            </form>
        `;
    }

    private async handleEditCategorySubmit(id: string) {
        const form = this.root.querySelector('#edit-category-form') as HTMLFormElement;
        if (!form) return;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            const originalText = btn.textContent;
            btn.textContent = 'Updating...';
            btn.disabled = true;

            // Endpoint: PATCH http://utero.viewdns.net:3100/category/{id} -> /api/proxy/category/{id}
            const res = await fetch(`/api/proxy/category/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            const json = await res.json();

            if (json.status) {
                this.showToast('Category updated successfully', 'success');
                this.closeModal();
                await this.fetchCategories();
                if (this.state.activeTab === 'Categories') {
                    const container = this.root.querySelector('#content-area');
                    if (container) this.updateModuleData(container);
                }
            } else {
                this.showToast(json.message || 'Failed to update category', 'error');
                if (json.message) this.openErrorModal('Update Failed', json.message);
            }

            btn.textContent = originalText;
            btn.disabled = false;
        } catch (e) {
            console.error('Error updating category:', e);
            this.openErrorModal('Error', 'An error occurred while updating the category');
            const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            if (btn) {
                btn.textContent = 'Save';
                btn.disabled = false;
            }
        }
    }

    private handleDeleteCategory(id: string) {
        this.openConfirmModal(
            'Delete Category',
            'Are you sure you want to delete this category? This action cannot be undone.',
            async () => {
                try {
                    // Endpoint: DELETE http://utero.viewdns.net:3100/category/{id} -> /api/proxy/category/{id}
                    const res = await fetch(`/api/proxy/category/${id}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });

                    const json = await res.json();

                    if (json.status) {
                        this.showToast('Category deleted successfully', 'success');
                        this.closeModal();
                        await this.fetchCategories();
                        if (this.state.activeTab === 'Categories') {
                            const container = this.root.querySelector('#content-area');
                            if (container) this.updateModuleData(container);
                        }
                    } else {
                        this.showToast(json.message || 'Failed to delete category', 'error');
                        if (json.message) this.openErrorModal('Delete Failed', json.message);
                    }
                } catch (e) {
                    console.error('Error deleting category:', e);
                    this.openErrorModal('Error', 'An error occurred while deleting the category');
                }
            }
        );
    }

    // --- Add-on Actions ---

    private renderAddAddonForm() {
        return `
            <form id="add-addon-form">
                <div class="form-group">
                    <label class="form-label" for="name">Name <span style="color:red">*</span></label>
                    <input type="text" id="name" name="name" class="form-control" placeholder="Add-on Name" required />
                </div>
                <div class="form-group">
                    <label class="form-label" for="description">Description <span style="color:red">*</span></label>
                    <textarea id="description" name="description" class="form-control" rows="3" placeholder="Description of the add-on" required></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label" for="price">Price <span style="color:red">*</span></label>
                    <div style="position: relative;">
                        <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-secondary);">Rp</span>
                        <input type="number" id="price" name="price" class="form-control" style="padding-left: 2.5rem;" placeholder="0" required min="0" />
                    </div>
                </div>
            </form>
        `;
    }

    private async handleAddAddonSubmit() {
        const form = this.root.querySelector('#add-addon-form') as HTMLFormElement;
        if (!form) return;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const data: any = Object.fromEntries(formData.entries());
        data.price = Number(data.price); // Convert to number

        try {
            const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            const originalText = btn.textContent;
            btn.textContent = 'Saving...';
            btn.disabled = true;

            const res = await fetch('/api/proxy/add-on', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            const json = await res.json();

            if (json.status) {
                this.showToast('Add-on created successfully', 'success');
                this.closeModal();
                await this.fetchAddons();
                if (this.state.activeTab === 'Add-ons') {
                    const container = this.root.querySelector('#content-area');
                    if (container) this.updateModuleData(container);
                }
            } else {
                this.showToast(json.message || 'Failed to create add-on', 'error');
                if (json.message) this.openErrorModal('Creation Failed', json.message);
            }

            btn.textContent = originalText;
            btn.disabled = false;
        } catch (e) {
            console.error('Error creating add-on:', e);
            this.openErrorModal('Error', 'An error occurred while creating the add-on');
            const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            if (btn) {
                btn.textContent = 'Save';
                btn.disabled = false;
            }
        }
    }

    private openViewAddonModal(id: string) {
        this.openModal('Loading Add-on Details...');
        const body = this.root.querySelector('.modal-body');
        if (body) body.innerHTML = '<div class="loading-spinner">Loading...</div>';

        const confirmBtn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
        if (confirmBtn) confirmBtn.style.display = 'none';

        // Add Delete Button functionality
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.textContent = 'Delete Add-on';
        deleteBtn.style.marginRight = 'auto'; // Push to left
        deleteBtn.onclick = () => this.handleDeleteAddon(id);

        const footer = this.root.querySelector('.modal-footer');
        // Remove existing delete/extra buttons if any
        const existingDelete = footer?.querySelector('.btn-danger');
        if (existingDelete) existingDelete.remove();

        if (footer) {
            footer.insertBefore(deleteBtn, footer.firstChild);
        }


        fetch(`/api/proxy/add-on/${id}`, { credentials: 'include' })
            .then(res => res.json())
            .then(json => {
                if (json.status && json.data) {
                    const titleEl = this.root.querySelector('.modal-title');
                    if (titleEl) titleEl.textContent = 'Add-on Details';

                    if (body) {
                        body.innerHTML = this.renderViewAddonDetails(json.data);
                    }
                } else {
                    this.showToast('Failed to load add-on details', 'error');
                    this.closeModal();
                }
            })
            .catch(e => {
                console.error(e);
                this.showToast('Error loading details', 'error');
                this.closeModal();
            });
    }

    private renderViewAddonDetails(addon: any) {
        return `
            <div class="user-details-card" style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div style="padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
                     <h4 style="margin: 0; font-size: 1.25rem;">${addon.name}</h4>
                     <p style="margin: 0.5rem 0 0; color: var(--text-secondary);">${addon.description}</p>
                </div>
                
                <div class="details-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="detail-item">
                        <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Price</label>
                        <div style="font-weight: 500; font-size: 1.1rem; color: var(--primary-color);">Rp ${addon.price ? addon.price.toLocaleString() : '0'}</div>
                    </div>
                     <div class="detail-item">
                        <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Created At</label>
                        <div style="font-weight: 500;">${new Date(addon.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        `;
    }

    private openEditAddonModal(id: string) {
        const addon = this.apiData.addons.find(a => a.id === id);
        if (!addon) {
            this.showToast('Add-on data not found locally', 'info');
            // Optionally fetch if not found
            return;
        }

        this.openModal('Edit Add-on');
        const body = this.root.querySelector('.modal-body');

        // Add Delete Button functionality
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.textContent = 'Delete Add-on';
        deleteBtn.style.marginRight = 'auto'; // Push to left
        deleteBtn.onclick = () => this.handleDeleteAddon(id);

        const footer = this.root.querySelector('.modal-footer');
        // Remove existing delete/extra buttons if any
        const existingDelete = footer?.querySelector('.btn-danger');
        if (existingDelete) existingDelete.remove();

        if (footer) {
            footer.insertBefore(deleteBtn, footer.firstChild);
        }


        if (body) {
            body.innerHTML = this.renderEditAddonForm(addon);
        }

        this.currentModalAction = () => this.handleEditAddonSubmit(id);
    }

    private renderEditAddonForm(addon: any) {
        return `
            <form id="edit-addon-form">
                <div class="form-group">
                    <label class="form-label" for="name">Name <span style="color:red">*</span></label>
                    <input type="text" id="name" name="name" class="form-control" value="${addon.name}" required />
                </div>
                <div class="form-group">
                    <label class="form-label" for="description">Description <span style="color:red">*</span></label>
                    <textarea id="description" name="description" class="form-control" rows="3" required>${addon.description}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label" for="price">Price <span style="color:red">*</span></label>
                    <div style="position: relative;">
                        <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-secondary);">Rp</span>
                        <input type="number" id="price" name="price" class="form-control" value="${addon.price}" style="padding-left: 2.5rem;" required min="0" />
                    </div>
                </div>
            </form>
        `;
    }

    private async handleEditAddonSubmit(id: string) {
        const form = this.root.querySelector('#edit-addon-form') as HTMLFormElement;
        if (!form) return;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const data: any = Object.fromEntries(formData.entries());
        data.price = Number(data.price);

        try {
            const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            const originalText = btn.textContent;
            btn.textContent = 'Updating...';
            btn.disabled = true;

            const res = await fetch(`/api/proxy/add-on/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            const json = await res.json();

            if (json.status) {
                this.showToast('Add-on updated successfully', 'success');
                this.closeModal();
                await this.fetchAddons();
                if (this.state.activeTab === 'Add-ons') {
                    const container = this.root.querySelector('#content-area');
                    if (container) this.updateModuleData(container);
                }
            } else {
                this.showToast(json.message || 'Failed to update add-on', 'error');
                if (json.message) this.openErrorModal('Update Failed', json.message);
            }

            btn.textContent = originalText;
            btn.disabled = false;
        } catch (e) {
            console.error('Error updating add-on:', e);
            this.openErrorModal('Error', 'An error occurred while updating the add-on');
            const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            if (btn) {
                btn.textContent = 'Save';
                btn.disabled = false;
            }
        }
    }

    private handleDeleteAddon(id: string) {
        this.openConfirmModal(
            'Delete Add-on',
            'Are you sure you want to delete this add-on? This action cannot be undone.',
            async () => {
                try {
                    const res = await fetch(`/api/proxy/add-on/${id}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });

                    const json = await res.json();

                    if (json.status) {
                        this.showToast('Add-on deleted successfully', 'success');
                        this.closeModal();
                        await this.fetchAddons();
                        if (this.state.activeTab === 'Add-ons') {
                            const container = this.root.querySelector('#content-area');
                            if (container) this.updateModuleData(container);
                        }
                    } else {
                        let errorMessage = json.message || 'Failed to delete add-on';
                        if (typeof json.message === 'object' && json.message !== null && json.message.error) {
                            errorMessage = json.message.error;
                        }
                        this.showToast(errorMessage, 'error');
                        this.openErrorModal('Delete Failed', errorMessage);
                    }
                } catch (e) {
                    console.error('Error deleting add-on:', e);
                    this.openErrorModal('Error', 'An error occurred while deleting the add-on');
                }
            }
        );
    }

    // --- Cities Actions ---

    private handleAddCity() {
        this.openModal('Add New City');
        const body = this.root.querySelector('.modal-body');
        if (body) {
            body.innerHTML = this.renderAddCityForm();
        }
        this.currentModalAction = () => this.handleAddCitySubmit();
    }

    private renderAddCityForm() {
        return `
            <form id="add-city-form">
                <div class="form-group">
                    <label class="form-label" for="name">Name <span style="color:red">*</span></label>
                    <input type="text" id="name" name="name" class="form-control" placeholder="City Name" required />
                </div>
                <div class="form-group">
                    <label class="form-label" for="provinceId">Province ID <span style="color:red">*</span></label>
                    <input type="text" id="provinceId" name="provinceId" class="form-control" placeholder="Province ID" required />
                </div>
            </form>
        `;
    }

    private async handleAddCitySubmit() {
        const form = this.root.querySelector('#add-city-form') as HTMLFormElement;
        if (!form) return;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            const originalText = btn.textContent;
            btn.textContent = 'Saving...';
            btn.disabled = true;

            const res = await fetch('/api/proxy/city', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            const json = await res.json();

            if (json.status) {
                this.showToast('City created successfully', 'success');
                this.closeModal();
                await this.fetchCities();
                if (this.state.activeTab === 'Cities') {
                    const container = this.root.querySelector('#content-area');
                    if (container) this.updateModuleData(container);
                }
            } else {
                this.showToast(json.message || 'Failed to create city', 'error');
                if (json.message) this.openErrorModal('Creation Failed', json.message);
            }

            btn.textContent = originalText;
            btn.disabled = false;
        } catch (e) {
            console.error('Error creating city:', e);
            this.openErrorModal('Error', 'An error occurred while creating the city');
            const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            if (btn) {
                btn.textContent = 'Save';
                btn.disabled = false;
            }
        }
    }

    private openEditCityModal(id: string) {
        const city = this.apiData.cities.find(c => c.id === id);
        if (!city) {
            this.showToast('City data not found locally', 'info');
            return;
        }

        this.openModal('Edit City');
        const body = this.root.querySelector('.modal-body');

        // Add Delete Button functionality
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.textContent = 'Delete City';
        deleteBtn.style.marginRight = 'auto'; // Push to left
        deleteBtn.onclick = () => this.handleDeleteCity(id);

        const footer = this.root.querySelector('.modal-footer');
        // Remove existing delete/extra buttons if any
        const existingDelete = footer?.querySelector('.btn-danger');
        if (existingDelete) existingDelete.remove();

        if (footer) {
            footer.insertBefore(deleteBtn, footer.firstChild);
        }


        if (body) {
            body.innerHTML = this.renderEditCityForm(city);
        }

        this.currentModalAction = () => this.handleEditCitySubmit(id);
    }

    private renderEditCityForm(city: any) {
        return `
            <form id="edit-city-form">
                <div class="form-group">
                    <label class="form-label" for="name">Name <span style="color:red">*</span></label>
                    <input type="text" id="name" name="name" class="form-control" value="${city.name}" required />
                </div>
                <div class="form-group">
                    <label class="form-label" for="provinceId">Province ID <span style="color:red">*</span></label>
                    <input type="text" id="provinceId" name="provinceId" class="form-control" value="${city.provinceId}" required />
                </div>
            </form>
        `;
    }

    private async handleEditCitySubmit(id: string) {
        const form = this.root.querySelector('#edit-city-form') as HTMLFormElement;
        if (!form) return;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            const originalText = btn.textContent;
            btn.textContent = 'Updating...';
            btn.disabled = true;

            const res = await fetch(`/api/proxy/city/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            const json = await res.json();

            if (json.status) {
                this.showToast('City updated successfully', 'success');
                this.closeModal();
                await this.fetchCities();
                if (this.state.activeTab === 'Cities') {
                    const container = this.root.querySelector('#content-area');
                    if (container) this.updateModuleData(container);
                }
            } else {
                this.showToast(json.message || 'Failed to update city', 'error');
                if (json.message) this.openErrorModal('Update Failed', json.message);
            }

            btn.textContent = originalText;
            btn.disabled = false;
        } catch (e) {
            console.error('Error updating city:', e);
            this.openErrorModal('Error', 'An error occurred while updating the city');
            const btn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            if (btn) {
                btn.textContent = 'Save';
                btn.disabled = false;
            }
        }
    }

    private handleDeleteCity(id: string) {
        this.openConfirmModal(
            'Delete City',
            'Are you sure you want to delete this city? This action cannot be undone.',
            async () => {
                try {
                    const res = await fetch(`/api/proxy/city/${id}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });

                    const json = await res.json();

                    if (json.status) {
                        this.showToast('City deleted successfully', 'success');
                        this.closeModal();
                        await this.fetchCities();
                        if (this.state.activeTab === 'Cities') {
                            const container = this.root.querySelector('#content-area');
                            if (container) this.updateModuleData(container);
                        }
                    } else {
                        this.showToast(json.message || 'Failed to delete city', 'error');
                        if (json.message) this.openErrorModal('Delete Failed', json.message);
                    }
                } catch (e) {
                    console.error('Error deleting city:', e);
                    this.openErrorModal('Error', 'An error occurred while deleting the city');
                }
            }
        );
    }

}
