/* eslint-disable @typescript-eslint/no-explicit-any */

import { store } from '../../lib/store';
import { authService } from '../../lib/auth';

function getImageUrl(path: string | null): string {
    if (!path) return 'https://placehold.co/600x400?text=No+Image';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `http://utero.viewdns.net:3100/${cleanPath}`;
}


type ModuleName = 'Dashboard' | 'My Billboards' | 'My Transactions' | 'My Profile' | 'History';

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
    };
    private currentModalAction: (() => Promise<void>) | null = null;

    constructor(rootId: string) {
        const root = document.getElementById(rootId);
        if (!root) throw new Error(`Root element #${rootId} not found`);
        this.root = root;
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
            unseenNotifications: 0
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

        this.init();
    }

    private async init() {
        await this.fetchCurrentUser();
        this.renderLayout();
        this.attachGlobalListeners();
        this.loadGoogleMapsScript().catch(console.error);

        // Fetch initial data
        await Promise.all([
            this.fetchMyBillboards(),
            this.fetchMyTransactions(),
            this.fetchMyProfile(),
            this.fetchProvinces(), // Needed for forms
            this.fetchCategories()
        ]);

        this.renderContent();
    }

    // Helper for confirmation modals
    private openConfirmModal(title: string, message: string, onConfirm: () => Promise<void>) {
        this.openModal(title, `<p>${message}</p>`, onConfirm);
    }

    private async fetchCurrentUser() {
        try {
            const res = await fetch('/api/proxy/auth/me', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                this.apiData.currentUser = data.user || data.data || data;
            }
        } catch (e) {
            console.error('Failed to fetch current user', e);
        }
    }

    private async fetchMyBillboards() {
        try {
            const res = await fetch('/api/proxy/billboard/myBillboards', { credentials: 'include' });
            const json = await res.json();
            if (json.status && json.data) {
                this.apiData.billboards = json.data;
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
            }
        } catch (e) {
            console.error('Failed to fetch history', e);
        }
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

        this.root.innerHTML = `
            <div class="admin-container">
                <aside class="sidebar">
                    <div class="sidebar-header">
                        SELLER DASHBOARD
                    </div>
                    <nav class="sidebar-nav">
                        <!-- Nav items injected here -->
                    </nav>
                    <div class="sidebar-footer">
                        <div class="user-profile-section">
                            <div class="user-avatar">
                                ${username.charAt(0).toUpperCase()}
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

        // Listeners
        this.root.querySelector('.logout-btn-sidebar')?.addEventListener('click', () => {
            authService.logout().then(() => window.location.href = '/login');
        });

        const modalOverlay = this.root.querySelector('.modal-overlay');
        this.root.querySelectorAll('.modal-close, .close-modal').forEach(btn =>
            btn.addEventListener('click', () => this.closeModal())
        );

        this.root.querySelector('.confirm-modal')?.addEventListener('click', () => {
            if (this.currentModalAction) this.currentModalAction();
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
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
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
            { name: 'My Billboards', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/></svg>' },
            { name: 'My Transactions', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>' },
            { name: 'My Profile', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
            { name: 'History', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
        ];

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
        this.state.currentPage = 1;

        this.renderSidebarNav();
        this.root.querySelector('.page-title')!.textContent = tab;

        if (tab === 'My Billboards') await this.fetchMyBillboards();
        else if (tab === 'My Transactions') await this.fetchMyTransactions();
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
        } else {
            this.renderModule(container);
        }
    }

    private renderDashboardOverview(container: Element) {
        const stats = [
            { label: 'My Billboards', value: this.apiData.billboards.length },
            { label: 'My Sales', value: this.apiData.transactions.length },
        ];

        container.innerHTML = `
            <div class="stats-grid">
                ${stats.map(stat => `
                    <div class="stat-card">
                        <div class="stat-label">${stat.label}</div>
                        <div class="stat-value">${stat.value}</div>
                    </div>
                `).join('')}
            </div>
            
             <div class="table-container" style="margin-top: 2rem;">
                <div class="table-controls">
                    <h3>Recent Billboards</h3>
                </div>
                ${this.generateTableHTML(this.apiData.billboards.slice(0, 5), [
            { key: 'location', label: 'Location' },
            { key: 'status', label: 'Status' },
            { key: 'rentPrice', label: 'Price', render: (v: any) => `Rp ${v.toLocaleString()}` }
        ])}
            </div>
        `;
    }

    private renderMyProfile(container: Element) {
        const p = this.apiData.profile || {};
        const c = this.apiData.currentUser || {};

        container.innerHTML = `
            <div style="padding: 0; width: 100%;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.5rem;">
                    <h3>My Profile</h3>
                    <button class="btn btn-outline" style="border-color: #fee2e2; color: #b91c1c; background:white;" id="delete-profile-btn">
                        Delete Profile & Move to Buyer
                    </button>
                </div>

                <div style="display: grid; grid-template-columns: 3fr 2fr; gap: 1.5rem; align-items: start;">
                    
                    <!-- Section 1: Business Details (Seller Profile) - LEFT -->
                    <div class="card" style="background: #fff; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9;">
                             <h4 style="margin:0; color: var(--text-primary); font-size: 1.1rem;">Business Details</h4>
                             <span class="badge badge-info">Seller</span>
                        </div>
                        
                        <form id="seller-business-form">
                            <div class="form-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div class="form-group">
                                    <label class="form-label">Full Name</label>
                                    <input type="text" class="form-control" name="fullname" value="${p.fullname || ''}" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Company Name</label>
                                    <input type="text" class="form-control" name="companyName" value="${p.companyName || ''}">
                                </div>
                            </div>
                            
                            <div class="form-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div class="form-group">
                                    <label class="form-label">KTP</label>
                                    <input type="text" class="form-control" name="ktp" value="${p.ktp || ''}">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">NPWP</label>
                                    <input type="text" class="form-control" name="npwp" value="${p.npwp || ''}">
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">KTP Address</label>
                                <textarea class="form-control" name="ktpAddress" rows="2">${p.ktpAddress || ''}</textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Office Address</label>
                                <textarea class="form-control" name="officeAddress" rows="2">${p.officeAddress || ''}</textarea>
                            </div>
                            
                            <div style="margin-top: 2rem; display:flex; justify-content: flex-end;">
                                <button type="submit" class="btn btn-primary">Save Business Details</button>
                            </div>
                        </form>
                    </div>

                    <!-- Section 2: User Account (Base User) - RIGHT -->
                    <div class="card" style="background: #fff; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                         <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9;">
                             <h4 style="margin:0; color: var(--text-primary); font-size: 1.1rem;">User Account</h4>
                             <span class="badge" style="background:#f1f5f9; color:#64748b;">Login Info</span>
                        </div>

                         <form id="user-profile-form">
                            <div style="display:flex; flex-direction:column; align-items:center; margin-bottom: 1.5rem; text-align:center;">
                                <div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; background: #f8fafc; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); margin-bottom: 1rem; position: relative;">
                                    <img id="profile-preview-img" src="${c.image ? getImageUrl(c.image) : `https://ui-avatars.com/api/?name=${c.username || 'User'}&background=random`}" style="width:100%; height:100%; object-fit:cover;">
                                </div>
                                <label for="profile-image-input" style="cursor:pointer; font-size:0.875rem; color:var(--primary-color); font-weight:500;">Change Picture</label>
                                <input type="file" name="file" id="profile-image-input" style="display:none;">
                            </div>

                            <div class="form-group">
                                <label class="form-label">Username</label>
                                <input type="text" class="form-control" name="username" value="${c.username || ''}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" name="email" value="${c.email || ''}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Phone</label>
                                <input type="text" class="form-control" name="phone" value="${c.phone || ''}">
                            </div>
                            
                            <div style="border-top: 1px dashed #e2e8f0; margin: 1.5rem 0; padding-top: 1.5rem;">
                                <div class="form-group">
                                    <label class="form-label">New Password</label>
                                    <input type="password" class="form-control" name="password" placeholder="Leave blank to keep current">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Confirm Password</label>
                                    <input type="password" class="form-control" name="confirmPassword" placeholder="Confirm new password">
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary" style="width:100%;">Update Account</button>
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

        userForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const rawFormData = new FormData(e.target as HTMLFormElement);

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
                    this.showToast('User account updated!', 'success');
                    this.fetchCurrentUser(); // Refresh
                } else {
                    let msg = json.message || 'Update failed';
                    if (Array.isArray(msg)) msg = msg.join(', ');
                    this.showToast(msg, 'error');
                }
            } catch (err) {
                console.error(err);
                this.showToast('Error updating user account', 'error');
            }
        });


        // --- Listener: Seller Business (PATCH JSON) ---
        const sellerForm = container.querySelector('#seller-business-form');
        sellerForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
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
                    this.showToast('Business details updated!', 'success');
                    this.fetchMyProfile();
                } else {
                    let msg = 'Failed to update profile';
                    if (json.message) {
                        if (typeof json.message === 'string') {
                            msg = json.message;
                        } else if (typeof json.message === 'object') {
                            msg = Object.values(json.message).join(', ');
                        }
                    }
                    this.showToast(msg, 'error');
                }
            } catch (err) {
                console.error(err);
                this.showToast('Error updating business details', 'error');
            }
        });

        container.querySelector('#delete-profile-btn')?.addEventListener('click', () => {
            this.openConfirmModal('Delete Seller Profile', 'Are you sure you want to delete your seller profile? You will be reverted to a BUYER account and logged out.', async () => {
                if (this.apiData.profile && this.apiData.profile.id) {
                    try {
                        const res = await fetch(`/api/proxy/seller/${this.apiData.profile.id}`, {
                            method: 'DELETE',
                            credentials: 'include'
                        });
                        if (res.ok) {
                            await authService.logout();
                            window.location.href = '/login';
                        } else {
                            this.showToast('Failed to delete profile', 'error');
                        }
                    } catch (err) {
                        this.showToast('Error deleting profile', 'error');
                    }
                } else {
                    this.showToast('Profile ID not found', 'error');
                }
            });
        });
    }

    private renderModule(container: Element) {
        let config: ModuleConfig<any>;
        if (this.state.activeTab === 'My Billboards') {
            config = {
                data: this.apiData.billboards,
                columns: [
                    { key: 'location', label: 'Location' },
                    { key: 'status', label: 'Status' },
                    { key: 'rentPrice', label: 'Rent Price', render: (v) => `Rp ${v.toLocaleString()}` },
                    { key: 'sellPrice', label: 'Sell Price', render: (v) => `Rp ${v.toLocaleString()}` },
                    {
                        key: 'actions', label: 'Actions', render: (v, row) => `
                        <div style="display:flex; gap:0.5rem;">
                            <button class="btn btn-sm btn-outline action-view-billboard" data-id="${row.id}">View</button>
                            ${row.status === 'Available' ? `<button class="btn btn-sm btn-primary action-edit" data-id="${row.id}">Edit</button>` : ''}
                            <button class="btn btn-sm btn-outline action-delete" style="color:red; border-color:red;" data-id="${row.id}">Delete</button>
                        </div>
                     `}
                ],
                filters: []
            };
        } else if (this.state.activeTab === 'My Transactions') {
            config = {
                data: this.apiData.transactions, // assuming transactions are sales
                columns: [
                    { key: 'id', label: 'ID' },
                    { key: 'totalPrice', label: 'Total', render: (v) => `Rp ${v.toLocaleString()}` },
                    { key: 'status', label: 'Status' },
                    { key: 'createdAt', label: 'Date', render: (v) => new Date(v).toLocaleDateString() },
                    {
                        key: 'actions', label: 'Actions', render: (v, row) => `
                        <button class="btn btn-sm btn-outline action-view-transaction" data-id="${row.billboardId || row.id}">View Detail</button>
                     `}
                ],
                filters: []
            };
        } else if (this.state.activeTab === 'History') {
            config = {
                data: this.apiData.history,
                columns: [
                    { key: 'createdAt', label: 'Date', render: (v) => new Date(v).toLocaleDateString() },
                    { key: 'transactionId', label: 'Transaction ID', render: (v) => v ? v.slice(0, 8) + '...' : '-' },
                    {
                        key: 'pricing', label: 'Details', render: (v, row) => {
                            const bbName = row.pricing?.billboard ? `${row.pricing.billboard.cityName}, ${row.pricing.billboard.size}` : 'Unknown Billboard';
                            return `<div>${bbName}</div>`;
                        }
                    },
                    {
                        key: 'pricing', label: 'Amount', render: (v, row) => {
                            const amt = row.pricing?.prices?.total || 0;
                            return `Rp ${amt.toLocaleString()}`;
                        }
                    },
                    {
                        key: 'transaction', label: 'Status', render: (v, row) => {
                            // The api response shows transaction status inside the nested transaction object
                            const status = row.transaction?.status || 'UNKNOWN';
                            const color = status === 'PAID' ? 'green' : status === 'PENDING' ? 'orange' : 'red';
                            return `<span class="badge" style="background:${color}; color:white;">${status}</span>`;
                        }
                    },
                    {
                        key: 'actions', label: 'Actions', render: (v, row) => `
                        <button class="btn btn-sm btn-outline action-view-history" data-id="${row.id}">View Detail</button>
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
                    <h3 style="margin:0;">${this.state.activeTab}</h3>
                    ${this.state.activeTab === 'My Billboards' ? '<button class="btn btn-primary add-new-btn">Create Billboard</button>' : ''}
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
            const [billboardRes, provincesRes] = await Promise.all([
                fetch(`/api/proxy/billboard/detail/${id}`),
                fetch(`/api/proxy/billboard/detail/${id}`),
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
        let images: string[] = [];
        if (Array.isArray(billboard.image)) images = billboard.image.map((img: any) => img.url || img);
        else if (billboard.image) images = [billboard.image];

        return `
            <form id="${prefix}-billboard-form">
                <style>
                    .custom-select-container { position: relative; }
                    .custom-select-trigger { padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px; cursor: pointer; background: #fff; display: flex; justify-content: space-between; align-items: center; }
                    .custom-options-container { position: absolute; top: 100%; left: 0; right: 0; background: #fff; border: 1px solid var(--border-color); border-radius: 4px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); z-index: 50; display: none; max-height: 200px; overflow-y: auto; margin-top: 4px; }
                    .custom-options-container.open { display: block; }
                    .custom-search-input { width: 100%; padding: 0.5rem; border: none; border-bottom: 1px solid var(--border-color); outline: none; }
                    .custom-option { padding: 0.5rem; cursor: pointer; transition: background 0.1s; }
                    .custom-option:hover { background: #f1f5f9; }
                    .image-manager-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 0.5rem; margin-top: 0.5rem; }
                    .image-item { position: relative; aspect-ratio: 1; border-radius: 4px; overflow: hidden; border: 1px solid #ddd; }
                    .image-item img { width: 100%; height: 100%; object-fit: cover; }
                    .image-item .remove-btn { position: absolute; top: 2px; right: 2px; width: 20px; height: 20px; background: rgba(255,255,255,0.9); border-radius: 50%; color: red; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid #ddd; }
                </style>

                <div class="form-group" style="margin-bottom: 1rem;">
                    <label class="form-label">Category</label>
                    <select id="${prefix}-categoryId" name="categoryId" class="form-control" required>
                        <option value="" disabled ${!billboard.categoryId ? 'selected' : ''}>Select Category</option>
                        ${this.apiData.categories.map(c => `<option value="${c.id}" ${billboard.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                </div>

                <div class="form-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Orientation</label>
                        <select id="${prefix}-orientation" name="orientation" class="form-control">
                            <option value="Vertical" ${billboard.orientation === 'Vertical' ? 'selected' : ''}>Vertical</option>
                            <option value="Horizontal" ${billboard.orientation === 'Horizontal' ? 'selected' : ''}>Horizontal</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Display Type</label>
                         <select id="${prefix}-display" name="display" class="form-control">
                            <option value="OneSide" ${billboard.display === 'OneSide' ? 'selected' : ''}>One Side</option>
                            <option value="TwoSides" ${billboard.display === 'TwoSides' ? 'selected' : ''}>Two Sides</option>
                            <option value="ThreeSides" ${billboard.display === 'ThreeSides' ? 'selected' : ''}>Three Sides</option>
                            <option value="FourSides" ${billboard.display === 'FourSides' ? 'selected' : ''}>Four Sides</option>
                        </select>
                    </div>
                </div>

                <div class="form-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Lighting</label>
                        <select id="${prefix}-lighting" name="lighting" class="form-control">
                            <option value="Frontlite" ${billboard.lighting === 'Frontlite' ? 'selected' : ''}>Frontlite</option>
                            <option value="Backlite" ${billboard.lighting === 'Backlite' ? 'selected' : ''}>Backlite</option>
                            <option value="None" ${billboard.lighting === 'None' ? 'selected' : ''}>None</option>
                        </select>
                    </div>
                     <div class="form-group">
                        <label class="form-label">Land Ownership</label>
                        <select id="${prefix}-landOwnership" name="landOwnership" class="form-control">
                            <option value="State" ${billboard.landOwnership === 'State' ? 'selected' : ''}>State</option>
                            <option value="Private" ${billboard.landOwnership === 'Private' ? 'selected' : ''}>Private</option>
                        </select>
                    </div>
                </div>

                <div class="form-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Tax</label>
                         <select id="${prefix}-tax" name="tax" class="form-control">
                            <option value="PPN" ${billboard.tax === 'PPN' ? 'selected' : ''}>PPN</option>
                            <option value="PPH" ${billboard.tax === 'PPH' ? 'selected' : ''}>PPH</option>
                            <option value="NoPPN" ${billboard.tax === 'NoPPN' ? 'selected' : ''}>No PPN</option>
                            <option value="NoPPH" ${billboard.tax === 'NoPPH' ? 'selected' : ''}>No PPH</option>
                            <option value="NotIncludePPNYet" ${billboard.tax === 'NotIncludePPNYet' ? 'selected' : ''}>Not Include PPN Yet</option>
                            <option value="NotIncludePPHYet" ${billboard.tax === 'NotIncludePPHYet' ? 'selected' : ''}>Not Include PPH Yet</option>
                        </select>
                    </div>
                    <div class="form-group">
                         <label class="form-label">Service Price</label>
                         <input type="number" id="${prefix}-servicePrice" name="servicePrice" class="form-control" value="${billboard.servicePrice || 0}" />
                    </div>
                </div>

                <div class="form-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                         <label class="form-label">Mode</label>
                        <select id="${prefix}-mode" name="mode" class="form-control">
                            <option value="" ${!billboard.mode ? 'selected' : ''} disabled>Select Mode</option>
                            <option value="Rent" ${billboard.mode === 'Rent' ? 'selected' : ''}>Rent</option>
                            <option value="Buy" ${billboard.mode === 'Buy' ? 'selected' : ''}>Buy</option>
                        </select>
                    </div>
                     <div class="form-group">
                        <label class="form-label">Status</label>
                        <select id="${prefix}-status" name="status" class="form-control">
                            <option value="Available" ${billboard.status === 'Available' ? 'selected' : ''}>Available</option>
                            <option value="NotAvailable" ${billboard.status === 'NotAvailable' ? 'selected' : ''}>Not Available</option>
                        </select>
                    </div>
                </div>

                <div class="form-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                         <label class="form-label">Rent Price</label>
                         <input type="number" id="${prefix}-rentPrice" name="rentPrice" class="form-control" value="${billboard.rentPrice || 0}" />
                    </div>
                    <div class="form-group">
                         <label class="form-label">Sell Price</label>
                         <input type="number" id="${prefix}-sellPrice" name="sellPrice" class="form-control" value="${billboard.sellPrice || 0}" />
                    </div>
                </div>

                <div class="form-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group" id="province-container">
                        <label class="form-label">Province</label>
                        <input type="hidden" id="${prefix}-provinceId" name="provinceId" value="${billboard.provinceId || ''}">
                        <div class="custom-select-container">
                            <div class="custom-select-trigger" id="province-trigger">
                                ${billboard.provinceName || (billboard.provinceId ? (this.apiData.provinces.find((p: any) => p.id === billboard.provinceId)?.name || 'Select Province') : 'Select Province')}
                            </div>
                            <div class="custom-options-container">
                                <input type="text" class="custom-search-input" placeholder="Search...">
                                <div class="custom-options-list"></div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group" id="city-container">
                        <label class="form-label">City</label>
                        <input type="hidden" id="${prefix}-cityId" name="cityId" value="${billboard.cityId || ''}">
                        <div class="custom-select-container">
                            <div class="custom-select-trigger" id="city-trigger">
                                ${billboard.cityName || (billboard.cityId ? (this.apiData.cities.find((c: any) => c.id === billboard.cityId)?.name || 'Select City') : 'Select City')}
                            </div>
                            <div class="custom-options-container">
                                <input type="text" class="custom-search-input" placeholder="Search...">
                                <div class="custom-options-list"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Location Name</label>
                        <input type="text" id="${prefix}-location" name="location" class="form-control" value="${billboard.location || ''}" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Size</label>
                        <select id="${prefix}-size-select" class="form-control" style="margin-bottom: 0.5rem;">
                            <option value="">Select Size</option>
                            <option value="4x6m">4x6m</option>
                            <option value="4x8m">4x8m</option>
                            <option value="5x10m">5x10m</option>
                            <option value="6x12m">6x12m</option>
                            <option value="8x16m">8x16m</option>
                            <option value="10x5m">10x5m</option>
                            <option value="20x10m">20x10m</option>
                            <option value="Custom">Custom</option>
                        </select>
                        <input type="text" id="${prefix}-size" name="size" class="form-control" value="${billboard.size || ''}" placeholder="Enter custom size (e.g. 3x3m)" style="display: none;" />
                    </div>
                </div>

                 <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea id="${prefix}-description" name="description" class="form-control" rows="2">${billboard.description || ''}</textarea>
                </div>

                <!-- Image Management -->
                <div class="form-group">
                    <label class="form-label">Images <span style="color:red">*</span></label>
                    <div id="image-manager-container" class="image-manager-grid">
                        <!-- Existing images rendered here -->
                    </div>
                    
                    <div class="upload-zone-mini" id="${prefix}-upload-zone" style="margin-top: 0.5rem; padding: 1rem; border: 2px dashed #e2e8f0; border-radius: 8px; text-align: center; cursor: pointer;">
                        <input type="file" id="${prefix}-images-input" multiple accept="image/*" style="display:none;">
                        <div style="font-size: 0.8rem; color: var(--text-secondary);">Click to add more images</div>
                    </div>
                </div>

                <!-- Hidden Inputs for Map -->
                <input type="hidden" id="${prefix}-formattedAddress" name="formattedAddress" value="${billboard.formattedAddress || ''}" />
                <input type="hidden" id="${prefix}-latitude" name="latitude" value="${billboard.latitude || ''}" />
                <input type="hidden" id="${prefix}-longitude" name="longitude" value="${billboard.longitude || ''}" />

                <div class="form-group">
                    <label class="form-label">Map Location</label>
                    <input type="text" id="${prefix}-gmap-search" class="form-control" placeholder="Search location" style="margin-bottom:0.5rem; font-size:0.9rem;">
                    <div id="${prefix}-gmap-canvas" style="width: 100%; height: 300px; background: #e2e8f0; border-radius: 4px;"></div>
                </div>
            </form>
        `;
    }

    private attachBillboardFormListeners(prefix: string, billboard: any = {}) {
        const form = document.querySelector(`#${prefix}-billboard-form`) as HTMLElement;
        if (!form) return;

        // -- Dropdowns --
        this.setupSearchableDropdown(
            form.querySelector('#province-container') as HTMLElement,
            this.apiData.provinces,
            'Select Province',
            async (id) => {
                (form.querySelector(`#${prefix}-provinceId`) as HTMLInputElement).value = id;
                // Reset city
                (form.querySelector(`#${prefix}-cityId`) as HTMLInputElement).value = '';
                (form.querySelector('#city-trigger') as HTMLElement).textContent = 'Select City';
                // Fetch cities
                const cities = await this.fetchCities(id);
                this.apiData.cities = cities; // update local cache
                this.setupSearchableDropdown(
                    form.querySelector('#city-container') as HTMLElement,
                    cities,
                    'Select City',
                    (cityId) => (form.querySelector(`#${prefix}-cityId`) as HTMLInputElement).value = cityId
                );
            }
        );

        // Init City Dropdown (with existing provinces cities if loaded)
        // We might need to Refetch cities if province is set but cities empty?
        // We did that in openEditBillboardModal
        const currentProv = (form.querySelector(`#${prefix}-provinceId`) as HTMLInputElement).value;
        const currentCities = this.apiData.cities.filter((c: any) => c.provinceId === currentProv);

        this.setupSearchableDropdown(
            form.querySelector('#city-container') as HTMLElement,
            currentCities.length ? currentCities : this.apiData.cities,
            'Select City',
            (cityId) => (form.querySelector(`#${prefix}-cityId`) as HTMLInputElement).value = cityId
        );

        // -- Image Management --
        this.setupImageManager(form, prefix, billboard);

        // -- Price Logic --
        const modeSelect = form.querySelector(`#${prefix}-mode`) as HTMLSelectElement;
        const rentInput = form.querySelector(`#${prefix}-rentPrice`) as HTMLInputElement;
        const sellInput = form.querySelector(`#${prefix}-sellPrice`) as HTMLInputElement;

        const updatePriceFields = () => {
            if (modeSelect.value === 'Rent') {
                rentInput.disabled = false;
                sellInput.disabled = true;
                sellInput.value = '0';
            } else if (modeSelect.value === 'Buy') {
                rentInput.disabled = true;
                sellInput.disabled = false;
                rentInput.value = '0';
            } else {
                // Default / Select Mode
                rentInput.disabled = true;
                sellInput.disabled = true;
            }
        };
        modeSelect.addEventListener('change', updatePriceFields);
        updatePriceFields(); // Initialize state
        // -- Size Logic --
        const sizeSelect = form.querySelector(`#${prefix}-size-select`) as HTMLSelectElement;
        const sizeInput = form.querySelector(`#${prefix}-size`) as HTMLInputElement;

        // Initial State for Size
        if (sizeInput.value) {
            const val = sizeInput.value;
            // Check if matches preset
            const match = Array.from(sizeSelect.options).find(opt => opt.value === val);
            if (match) {
                sizeSelect.value = val;
                sizeInput.style.display = 'none';
            } else {
                sizeSelect.value = 'Custom';
                sizeInput.style.display = 'block';
            }
        }

        sizeSelect.addEventListener('change', () => {
            if (sizeSelect.value === 'Custom') {
                sizeInput.style.display = 'block';
                sizeInput.value = ''; // Clear for custom entry? Or keep previous? Let's clear to avoid confusion.
                sizeInput.focus();
            } else {
                sizeInput.style.display = 'none';
                sizeInput.value = sizeSelect.value;
            }
        });

        sizeInput.addEventListener('input', () => {
            // If custom is selected, the input value is what matters. 
            // The form submission grabs 'name="size"', which is on the input.
            // so correct.
        });

    }


    private setupImageManager(form: HTMLElement, prefix: string, billboard: any) {
        // Normalize initial images
        let currentImages: (string | File)[] = [];
        if (Array.isArray(billboard.image)) currentImages = billboard.image.map((img: any) => img.url || img);
        else if (billboard.image) currentImages = [billboard.image];

        const container = form.querySelector('#image-manager-container') as HTMLElement;
        const uploadZone = form.querySelector(`#${prefix}-upload-zone`) as HTMLElement;
        const input = form.querySelector(`#${prefix}-images-input`) as HTMLInputElement;

        const render = () => {
            container.innerHTML = '';
            currentImages.forEach((img, idx) => {
                const url = img instanceof File ? URL.createObjectURL(img) : getImageUrl(img);
                const div = document.createElement('div');
                div.className = 'image-item';
                div.innerHTML = `<img src="${url}"><div class="remove-btn">&times;</div>`;
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
    }

    private setupSearchableDropdown(container: HTMLElement, data: any[], placeholder: string, onSelect: (id: string) => void) {
        const trigger = container.querySelector('.custom-select-trigger') as HTMLElement;
        const optionsContainer = container.querySelector('.custom-options-container') as HTMLElement;
        const list = container.querySelector('.custom-options-list') as HTMLElement;
        const search = container.querySelector('.custom-search-input') as HTMLInputElement;

        // Clone to remove old listeners if re-initializing
        const newTrigger = trigger.cloneNode(true) as HTMLElement;
        trigger.parentNode?.replaceChild(newTrigger, trigger);

        const renderOpts = (items: any[]) => {
            list.innerHTML = items.length ? items.map(i => `<div class="custom-option" data-id="${i.id}">${i.name}</div>`).join('') : '<div style="padding:0.5rem;color:#999">No results</div>';
            list.querySelectorAll('.custom-option').forEach(el => {
                el.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const name = el.textContent;
                    newTrigger.textContent = name; // Update the NEW trigger
                    onSelect((el as HTMLElement).dataset.id!);
                    optionsContainer.classList.remove('open');
                });
            });
        };

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

        newTrigger.addEventListener('click', toggle);

        search.addEventListener('click', e => e.stopPropagation());
        search.addEventListener('input', () => {
            const val = search.value.toLowerCase();
            renderOpts(data.filter(d => d.name.toLowerCase().includes(val)));
        });

        // Close when clicking outside - handled by global click listener conceptually or stick simple
        document.addEventListener('click', () => optionsContainer.classList.remove('open'));
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
            this.updateBillboardMapInputs(prefix, place.geometry.location, place.formatted_address);

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

    private updateBillboardMapInputs(prefix: string, latLng: any, address?: string) {
        const form = document.getElementById(`${prefix}-billboard-form`);
        if (!form) return;
        (form.querySelector(`#${prefix}-latitude`) as HTMLInputElement).value = String(typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat);
        (form.querySelector(`#${prefix}-longitude`) as HTMLInputElement).value = String(typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng);

        if (address) {
            (form.querySelector(`#${prefix}-formattedAddress`) as HTMLInputElement).value = address;
        } else {
            // Geocode?
            const geocoder = new (window as any).google.maps.Geocoder();
            geocoder.geocode({ location: latLng }, (results: any, status: any) => {
                if (status === 'OK' && results[0]) {
                    (form.querySelector(`#${prefix}-formattedAddress`) as HTMLInputElement).value = results[0].formatted_address;
                    (form.querySelector(`#${prefix}-gmap-search`) as HTMLInputElement).value = results[0].formatted_address;
                }
            });
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

        // Append images
        formData.delete('images'); // Clear input files
        filesToUpload.forEach(f => formData.append('images', f));

        // -- DEBUG: Log GMap Data & Payload --
        console.group('Billboard Submission Payload');
        console.log('FormData Contents:');
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
                this.showToast('Billboard created successfully', 'success');
                this.closeModal();
                this.fetchMyBillboards();
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
        const data: any = Object.fromEntries(formData.entries());

        // Process images
        const currentImages: (string | File)[] = (form as any).__currentImages || [];
        const filesToUpload: File[] = [];
        const existingImageUrls: string[] = [];  // Not really standard here, backend usually deletes all and replaces if we send list, OR we send diff.
        // Assuming backend handles "files" for new images. But what about existing?
        // Admin code re-hydrates existing images to Files if possible, effectively re-uploading everything or handling it.
        // Step 100 code: "Convert all images to Files... It's a URL... Fetch it and convert to Blob -> File"
        // This is heavy but ensures "files" array is complete.
        // Let's copy that strategy for robustness.

        this.showToast('Processing images...', 'info');

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
        const newFormData = new FormData();
        // Append fields
        for (const [k, v] of formData.entries()) {
            if (k !== 'images') newFormData.append(k, v);
        }
        // Append images
        allFiles.forEach(f => newFormData.append('images', f)); // Uses 'images' to match backend expectation

        try {
            const res = await fetch(`/api/proxy/billboard/${id}`, {
                method: 'PATCH',
                body: newFormData,
                credentials: 'include'
            });
            const json = await res.json();
            if (json.status) {
                this.showToast('Updated successfully', 'success');
                this.fetchMyBillboards();
                this.closeModal();
            } else {
                this.showToast(json.message || 'Update failed', 'error');
            }
        } catch (e) {
            this.showToast('Error updating', 'error');
        }
    }


    private handleDeleteBillboard(id: string) {
        this.openConfirmModal('Delete Billboard', 'Are you sure?', async () => {
            try {
                const res = await fetch(`/api/proxy/billboard/${id}`, { method: 'DELETE', credentials: 'include' });
                if (res.ok) {
                    this.showToast('Deleted', 'success');
                    this.fetchMyBillboards();
                    this.closeModal();
                } else {
                    this.showToast('Failed to delete', 'error');
                }
            } catch (e) { this.showToast('Error', 'error'); }
        });
    }

    private openViewBillboardModal(id: string) {
        this.openModal('Loading Billboard Details...', '<div class="loading-spinner">Loading...</div>');

        // Increase modal width for better card layout
        const modal = this.root.querySelector('.modal') as HTMLElement;
        if (modal) modal.style.maxWidth = '1000px';

        const body = this.root.querySelector('.modal-body');
        const confirmBtn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
        if (confirmBtn) confirmBtn.style.display = 'none';

        fetch(`/api/proxy/billboard/detail/${id}`)
            .then(res => res.json())
            .then(json => {
                if (json.status && json.data) {
                    const titleEl = this.root.querySelector('.modal-title');
                    if (titleEl) titleEl.textContent = 'Billboard Details';

                    if (body) {
                        body.innerHTML = this.renderBillboardDetailView(json.data);
                        // Initialize map after render
                        setTimeout(() => this.initViewOnlyMap(json.data), 100);
                        this.setupBillboardCarousel(body, json.data);
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

    private setupBillboardCarousel(container: Element, billboard: any) {
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
            .catch(err => {
                this.root.querySelector('.modal-body')!.innerHTML = '<p>Error loading details.</p>';
            });
    }

    private renderViewTransactionDetails(t: any) {
        if (!t) return 'No details available.';
        const formatRp = (v: any) => 'Rp ' + (Number(v) || 0).toLocaleString();
        const formatDate = (v: any) => v ? new Date(v).toLocaleDateString() : '-';

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
