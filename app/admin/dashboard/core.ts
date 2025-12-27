/* eslint-disable @typescript-eslint/no-explicit-any */

import { store } from '../../lib/store';
import { getImageUrl } from '../../lib/utils';
import { DashboardState, ModuleName, ModuleConfig, ApiData, ColumnConfig } from './types';
import { adminService } from './services';
import { getLayoutHTML, getSidebarNavHTML } from './views/layout';
import { getDashboardOverviewHTML } from './views/overview';
import { getProfileFormHTML } from './views/profile';
import { getModuleContainerHTML, getModuleControlsHTML, getPaginationHTML } from './views/modules';
import { generateTableHTML, getStatusBadgeClass } from './views/shared';

export class AdminDashboard {
    private root: HTMLElement;
    private state: DashboardState;
    private data: typeof store.data; // Keep for other modules
    private apiData: ApiData;
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
            notifications: [],
            unreadNotificationsCount: 0,
            currentUser: null,
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
        this.apiData.currentUser = await adminService.fetchCurrentUser();
        this.renderLayout();
        this.attachGlobalListeners();
        this.loadGoogleMapsScript().catch(console.error);

        this.apiData.users = await adminService.fetchUsers();
        this.apiData.unreadNotificationsCount = await adminService.fetchUnreadCount();

        this.renderContent();
    }

    private async fetchCurrentUser() {
        this.apiData.currentUser = await adminService.fetchCurrentUser();
    }

    private async fetchUsers() {
        this.apiData.users = await adminService.fetchUsers();
    }

    private async fetchSellers() {
        this.apiData.sellers = await adminService.fetchSellers();
    }

    private async fetchProvinces() {
        this.apiData.provinces = await adminService.fetchProvinces();
    }

    private async fetchBillboards() {
        this.apiData.billboards = await adminService.fetchBillboards();
    }

    private async fetchTransactions() {
        this.apiData.transactions = await adminService.fetchTransactions();
    }

    private async fetchCategories() {
        this.apiData.categories = await adminService.fetchCategories();
    }

    private async fetchDesigns() {
        this.apiData.designs = await adminService.fetchDesigns();
    }

    private async fetchAddons() {
        this.apiData.addons = await adminService.fetchAddons();
    }

    private async fetchCities() { // Ensure this exists
        this.apiData.cities = await adminService.fetchCities();
    }

    private async fetchMedia() { // Ensure this exists
        this.apiData.media = await adminService.fetchMedia();
    }

    private async fetchNotifications() {
        this.apiData.notifications = await adminService.fetchNotifications();
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
        const username = this.apiData.currentUser?.username || 'Admin';
        this.root.innerHTML = getLayoutHTML(username);

        this.renderSidebarNav();

        const closeBtns = this.root.querySelectorAll('.modal-close, .close-modal');
        closeBtns.forEach(btn => btn.addEventListener('click', () => this.closeModal()));

        this.root.querySelector('.confirm-modal')?.addEventListener('click', () => {
            if (this.currentModalAction) this.currentModalAction();
        });

        const logoutBtn = this.root.querySelector('.logout-btn-sidebar');
        logoutBtn?.addEventListener('click', async () => {
            await fetch('/api/proxy/auth/logout', { method: 'POST' });
            window.location.href = '/login';
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
            { name: 'Users', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
            { name: 'Sellers', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' },
            { name: 'Billboards', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/></svg>' },
            { name: 'Transactions', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>' },
            { name: 'Categories', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M14 14h7v7h-7z"/><path d="M3 14h7v7H3z"/></svg>' },
            { name: 'Designs', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>' },
            { name: 'Add-ons', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>' },
            { name: 'Cities', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M8 9v2"/><path d="M8 13v2"/><path d="M8 17v2"/><path d="M16 9v2"/><path d="M16 13v2"/><path d="M16 17v2"/></svg>' },
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

        this.renderSidebarNav();
        this.root.querySelector('.page-title')!.textContent = tab;

        if (tab === 'Users' && this.apiData.users.length === 0) {
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
        }

        this.renderContent();

        if (window.innerWidth <= 1024) {
            this.toggleSidebar(false);
        }
    }

    private renderContent() {
        const container = this.root.querySelector('#content-area');
        if (!container) return;

        container.innerHTML = '<div class="loading-spinner">Loading...</div>';

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
        container.innerHTML = getProfileFormHTML(this.apiData.currentUser!);

        const form = container.querySelector('#admin-profile-form');
        const imgInput = container.querySelector('#admin-profile-input') as HTMLInputElement;

        imgInput?.addEventListener('change', () => {
            if (imgInput.files && imgInput.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const previewElement = container.querySelector('#admin-profile-preview') || container.querySelector('#admin-profile-initial');
                    if (previewElement && previewElement.parentElement) {
                        previewElement.parentElement.innerHTML = `<img id="admin-profile-preview" src="${e.target?.result}" style="width:100%; height:100%; object-fit:cover;">`;        
                    }
                };
                reader.readAsDataURL(imgInput.files[0]);
            }
        });

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);

            if (!formData.get('password')) {
                formData.delete('password');
                formData.delete('confirmPassword');
            } else if (formData.get('password') !== formData.get('confirmPassword')) {
                this.showToast('Passwords do not match', 'error');
                return;
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
                    this.showToast('Profile updated successfully', 'success');
                    this.fetchCurrentUser();
                } else {
                    this.showToast(json.message || 'Update failed', 'error');
                }
            } catch (err) {
                console.error(err);
                this.showToast('Error updating profile', 'error');
            }
        });
    }

    private renderDashboardOverview(container: Element) {
        const stats = [
            { label: 'Total Users', value: this.apiData.users.length || this.data.users.length, change: '+12%' },
            { label: 'Active Sellers', value: this.apiData.sellers.length || this.data.sellers.length, change: '+5%' },
            { label: 'Total Billboards', value: this.apiData.billboards.length || this.data.billboards.length, change: '+8%' },
            { label: 'Total Revenue', value: 'Rp 2.5B', change: '+25%' },
        ];

        const recentTransactions = (this.apiData.transactions.length ? this.apiData.transactions : this.data.transactions).slice(0, 5);

        container.innerHTML = getDashboardOverviewHTML(stats, generateTableHTML(recentTransactions, [
            { key: 'id', label: 'ID' },
            { key: 'buyerId', label: 'Buyer', render: (v: string) => this.getUserName(v) },
            { key: 'totalPrice', label: 'Amount', render: (v: number) => `Rp ${v.toLocaleString()}` },
            { key: 'status', label: 'Status', render: (v: string) => `<span class="badge ${getStatusBadgeClass(v)}">${v}</span>` },
            { key: 'createdAt', label: 'Date', render: (v: string) => new Date(v).toLocaleDateString() },
        ], null, 'asc'));
    }

    private renderModule(container: Element) {
        const config = this.getModuleConfig() as ModuleConfig<any>;
        if (!config) {
            container.innerHTML = "Module not found.";
            return;
        }
        const filteredData = this.getFilteredAndSortedData(config.data);
        const paginatedData = this.getPaginatedData(filteredData);

        const controlsHTML = getModuleControlsHTML(
            this.state.activeTab as ModuleName,
            config.filters,
            this.state.filters,
            this.state.searchQuery
        );

        const tableHTML = generateTableHTML(
            paginatedData,
            config.columns,
            this.state.sortColumn,
            this.state.sortDirection
        );

        const paginationHTML = getPaginationHTML(
            this.state.currentPage,
            this.state.itemsPerPage,
            config.data.length,
            filteredData.length
        );

        container.innerHTML = getModuleContainerHTML(controlsHTML, tableHTML, paginationHTML);

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

        this.attachTableListeners(container);
        this.attachPaginationListeners(container);
    }

    private updateModuleData(container: Element) {
        const config = this.getModuleConfig() as ModuleConfig<any>;
        const filteredData = this.getFilteredAndSortedData(config.data);
        const paginatedData = this.getPaginatedData(filteredData);

        // Update Table
        const tableWrapper = container.querySelector('.data-table-wrapper');
        if (tableWrapper) {
            tableWrapper.outerHTML = generateTableHTML(
                paginatedData,
                config.columns,
                this.state.sortColumn,
                this.state.sortDirection
            );
        }

        // Update Pagination
        const paginationContainer = container.querySelector('.pagination');
        if (paginationContainer) {
            paginationContainer.outerHTML = getPaginationHTML(
                this.state.currentPage,
                this.state.itemsPerPage,
                config.data.length,
                filteredData.length
            );
        }

        // Re-attach listeners
        this.attachTableListeners(container);
        this.attachPaginationListeners(container);
    }

    private attachPaginationListeners(container: Element) {
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                                <button class="action-btn edit action-edit" data-id="${row.id}" title="Edit User"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fef3c7; color: #b45309; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                                </button>
                                <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete User"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                                <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete Seller"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
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
                        { key: 'status', label: 'Status', render: (v: string) => `<span class="badge ${getStatusBadgeClass(v)}">${v}</span>` },
                        { key: 'mode', label: 'Mode' },
                        { key: 'size', label: 'Size' },
                        { key: 'rentPrice', label: 'Rent Price', render: (v: number) => v > 0 ? `Rp ${parseFloat(String(v)).toLocaleString()}` : '-' },
                        { key: 'sellPrice', label: 'Sell Price', render: (v: number) => v > 0 ? `Rp ${parseFloat(String(v)).toLocaleString()}` : '-' },
                        {
                            key: 'actions', label: 'Actions', render: (v: any, row: any) => `
                            <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                                <button class="action-btn view action-view" data-id="${row.id}" title="View Details" 
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #e0f2fe; color: #0369a1; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                                <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete Billboard"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
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
                    data: this.apiData.transactions,
                    columns: [
                        { key: 'id', label: 'ID' },
                        { key: 'user', label: 'Buyer', render: (v: any) => v?.username || 'Unknown' },
                        { key: 'billboard', label: 'Billboard', render: (v: any) => v?.location || 'Unknown Location' },
                        { key: 'totalPrice', label: 'Amount', render: (v: number) => `Rp ${v ? v.toLocaleString() : '0'}` },
                        { key: 'status', label: 'Status', render: (v: string) => `<span class="badge ${getStatusBadgeClass(v)}">${v}</span>` },
                        { key: 'createdAt', label: 'Date', render: (v: string) => v ? new Date(v).toLocaleDateString() : '-' },
                        {
                            key: 'actions', label: 'Actions', render: (v: any, row: any) => `
                            <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                                <button class="action-btn view action-view" data-id="${row.id}" title="View Details" 
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #e0f2fe; color: #0369a1; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                                <button class="action-btn edit action-edit" data-id="${row.id}" title="Update Status"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fef3c7; color: #b45309; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                                </button>
                                <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete Transaction"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                </button>
                            </div>
                        ` }
                    ],
                    filters: [
                        { key: 'status', label: 'Status', options: ['PENDING', 'PAID', 'COMPLETED', 'CANCELLED', 'REJECTED'] }
                    ]
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                                </button>
                                <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete Category"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                                </button>
                                <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete City"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                                <button class="action-btn edit action-edit" data-id="${row.id}" title="Edit Design"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fef3c7; color: #b45309; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                                </button>
                                <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete Design"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                                <button class="action-btn edit action-edit" data-id="${row.id}" title="Edit Add-on"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fef3c7; color: #b45309; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                                </button>
                                <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete Add-on"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                                </button>
                                <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete City"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                                <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete Media"
                                    style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
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

    private getFilteredAndSortedData<T>(data: T[]) {
        let result = [...data];

        // Search
        if (this.state.searchQuery) {
            const q = this.state.searchQuery.toLowerCase();

            // Helper for deep search
            const deepSearch = (obj: any, depth = 0): boolean => {
                if (depth > 3) return false; // Guard against too deep
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
        Object.keys(this.state.filters).forEach(key => {
            const val = this.state.filters[key];
            if (val) {
                result = result.filter(item => String((item as any)[key]) === val);
            }
        });

        // Sort
        if (this.state.sortColumn) {
            result.sort((a, b) => {
                let valA = (a as any)[this.state.sortColumn!];
                let valB = (b as any)[this.state.sortColumn!];

                if (typeof valA === 'string') valA = valA.toLowerCase();
                if (typeof valB === 'string') valB = valB.toLowerCase();

                if (valA < valB) return this.state.sortDirection === 'asc' ? -1 : 1;
                if (valA > valB) return this.state.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }

    private getPaginatedData<T>(data: T[]) {
        const start = (this.state.currentPage - 1) * this.state.itemsPerPage;
        return data.slice(start, start + this.state.itemsPerPage);
    }


    // Helpers
    private getUserName(id: string) {
        const user = this.apiData.users.find(u => u.id === id) || store.data.users.find(u => u.id === id);
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

    // Modal
    private openModal(title: string) {
        const overlay = this.root.querySelector('.modal-overlay');
        const modal = this.root.querySelector('.modal') as HTMLElement;
        const titleEl = this.root.querySelector('.modal-title');
        const body = this.root.querySelector('.modal-body');

        if (overlay && titleEl && body) {
            titleEl.textContent = title;

            if (modal) modal.style.maxWidth = '';

            if (title.includes('Add New User')) {
                body.innerHTML = this.renderAddUserForm();
                this.currentModalAction = () => this.handleAddUserSubmit();

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

            const confirmBtn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;
            if (confirmBtn) {
                confirmBtn.textContent = 'Save';
                confirmBtn.className = 'btn btn-primary confirm-modal';
                confirmBtn.style.backgroundColor = ''; 
                confirmBtn.style.display = ''; 
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

        setTimeout(() => {
            toast.classList.add('hiding');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000);
    }

    private openConfirmModal(title: string, message: string, onConfirm: () => Promise<void> | void) {
        const overlay = this.root.querySelector('.modal-overlay');
        const titleEl = this.root.querySelector('.modal-title');
        const body = this.root.querySelector('.modal-body');
        const confirmBtn = this.root.querySelector('.confirm-modal') as HTMLButtonElement;

        if (overlay && titleEl && body && confirmBtn) {
            titleEl.textContent = title;
            body.innerHTML = `
                <div class="modal-confirm-icon" style="background-color: #fee2e2; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: #dc2626;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <div class="modal-confirm-title" style="text-align: center; font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">${title}</div>     
                <div class="modal-confirm-text" style="text-align: center; color: var(--text-secondary); margin-bottom: 1.5rem;">${message}</div>
            `;
            
            confirmBtn.className = 'btn btn-primary confirm-modal'; 
            confirmBtn.textContent = 'Confirm';

            this.currentModalAction = async () => {
                await onConfirm();
            };

            overlay.classList.add('open');
        }
    }
}
