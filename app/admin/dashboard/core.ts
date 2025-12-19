/* eslint-disable @typescript-eslint/no-explicit-any */

import { store } from '../../lib/store';

type ModuleName = 'Dashboard' | 'Users' | 'Sellers' | 'Billboards' | 'Transactions' | 'Categories' | 'Designs' | 'Add-ons' | 'Ratings' | 'Notifications';

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
        currentUser: any | null;
    };

    constructor(rootId: string) {
        const root = document.getElementById(rootId);
        if (!root) throw new Error(`Root element #${rootId} not found`);
        this.root = root;
        this.data = store.data;
        this.apiData = {
            users: [],
            currentUser: null
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

        // Initial fetch for users if that's the active tab or just pre-fetch
        await this.fetchUsers();

        this.renderContent();
    }

    private async fetchCurrentUser() {
        try {
            const res = await fetch('/api/proxy/auth/me', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                this.apiData.currentUser = data.user || data.data || data; // Handle various response structures
            }
        } catch (e) {
            console.error('Failed to fetch current user', e);
        }
    }

    private async fetchUsers() {
        try {
            // Using the proxy or direct URL if configured next.config
            // Assuming we use the direct URL provided in prompt via proxy or absolute if client-side allow
            // The prompt gave: http://utero.viewdns.net:3100/user
            // We should use a proxy to avoid CORS if possible, or try direct.
            // Let's try direct first but wrapped in function
            const res = await fetch('http://utero.viewdns.net:3100/user');
            const json = await res.json();
            if (json.status && json.data) {
                this.apiData.users = json.data;
            }
        } catch (e) {
            console.error('Failed to fetch users', e);
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

        this.root.innerHTML = `
      <div class="admin-container">
        <aside class="sidebar">
          <div class="sidebar-header">
            PLACERS ADMIN
          </div>
          <nav class="sidebar-nav">
            <!-- Nav items injected here -->
          </nav>
        </aside>
        <main class="main-content">
          <header class="top-header">
            <div style="display:flex; align-items:center; gap:1rem;">
              <button class="mobile-toggle">☰</button>
              <h1 class="page-title">Dashboard</h1>
            </div>
            <div class="user-menu" style="display: flex; align-items: center; gap: 1rem;">
              <span class="font-medium">Hello, ${username}</span>
              <button class="btn btn-outline btn-sm">Logout</button>
            </div>
          </header>
          <div id="content-area">
            <!-- Content injected here -->
            <div class="loading-spinner">Loading...</div>
          </div>
        </main>
      </div>
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
        const modalOverlay = this.root.querySelector('.modal-overlay');
        const closeBtns = this.root.querySelectorAll('.modal-close, .close-modal');
        closeBtns.forEach(btn => btn.addEventListener('click', () => this.closeModal()));
        modalOverlay?.addEventListener('click', (e) => {
            if (e.target === modalOverlay) this.closeModal();
        });

        // Logout listener
        const logoutBtn = this.root.querySelector('.user-menu button');
        logoutBtn?.addEventListener('click', async () => {
            // Handle logout
            window.location.href = '/login';
        });
    }

    private renderSidebarNav() {
        const nav = this.root.querySelector('.sidebar-nav');
        if (!nav) return;

        const tabs: ModuleName[] = ['Dashboard', 'Users', 'Sellers', 'Billboards', 'Transactions', 'Categories', 'Designs', 'Add-ons', 'Ratings', 'Notifications'];

        nav.innerHTML = tabs.map(tab => `
      <div class="nav-item ${this.state.activeTab === tab ? 'active' : ''}" data-tab="${tab}">
        ${tab}
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

        if (tab === 'Users' && this.apiData.users.length === 0) {
            await this.fetchUsers();
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
        } else {
            this.renderModule(container);
        }
    }

    private renderDashboardOverview(container: Element) {
        const stats = [
            { label: 'Total Users', value: this.apiData.users.length || this.data.users.length, change: '+12%' },
            { label: 'Active Sellers', value: this.data.sellers.length, change: '+5%' },
            { label: 'Total Billboards', value: this.data.billboards.length, change: '+8%' },
            { label: 'Total Revenue', value: 'Rp 2.5B', change: '+25%' },
        ];

        container.innerHTML = `
      <div class="stats-grid">
        ${stats.map(stat => `
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
          <button class="btn btn-primary add-new-btn">Add New</button>
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
            this.renderContent();
        });

        container.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', (e: Event) => {
                const key = select.getAttribute('data-key');
                if (key) {
                    this.state.filters[key] = (e.target as HTMLSelectElement).value;
                    this.state.currentPage = 1;
                    this.renderContent();
                }
            });
        });

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
                    this.renderContent();
                }
            });
        });

        container.querySelector('.prev-page')?.addEventListener('click', () => {
            if (this.state.currentPage > 1) {
                this.state.currentPage--;
                this.renderContent();
            }
        });

        container.querySelector('.next-page')?.addEventListener('click', () => {
            if (this.state.currentPage * this.state.itemsPerPage < filteredData.length) {
                this.state.currentPage++;
                this.renderContent();
            }
        });

        container.querySelector('.add-new-btn')?.addEventListener('click', () => {
            this.openModal('Add New ' + this.state.activeTab.slice(0, -1)); // Simple singularization
        });

        // Action buttons listeners
        container.querySelectorAll('.action-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLElement).dataset.id;
                if (id) {
                    if (this.state.activeTab === 'Users') {
                        window.location.href = `/admin/users/${id}`;
                    } else {
                        alert(`View ${id} (Implementation pending for this module)`);
                    }
                }
            });
        });

        container.querySelectorAll('.action-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLElement).dataset.id;
                if (id) alert(`Delete ${id} (Implementation pending)`);
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
                            <div class="dropdown">
                                <button class="btn btn-sm btn-outline">Actions</button>
                                <div class="dropdown-content">
                                    <a href="#" class="action-view" data-id="${row.id}">View</a>
                                    <a href="#" class="action-edit" data-id="${row.id}">Edit</a>
                                    <a href="#" class="action-delete" data-id="${row.id}">Delete</a>
                                </div>
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
                    data: this.data.sellers,
                    columns: [
                        { key: 'fullname', label: 'Full Name' },
                        { key: 'companyName', label: 'Company' },
                        { key: 'ktp', label: 'KTP' },
                        { key: 'officeAddress', label: 'Office' },
                        { key: 'createdAt', label: 'Created', render: (v: string) => new Date(v).toLocaleDateString() },
                        { key: 'actions', label: 'Actions', render: () => `<button class="btn btn-sm btn-outline">View</button>` }
                    ],
                    filters: []
                };
            case 'Billboards':
                return {
                    data: this.data.billboards,
                    columns: [
                        { key: 'location', label: 'Location' },
                        { key: 'cityName', label: 'City' },
                        { key: 'status', label: 'Status', render: (v: string) => `<span class="badge ${v === 'Available' ? 'badge-success' : 'badge-danger'}">${v}</span>` },
                        { key: 'mode', label: 'Mode' },
                        { key: 'size', label: 'Size' },
                        { key: 'rentPrice', label: 'Price', render: (v: number) => v > 0 ? `Rp ${v.toLocaleString()}` : '-' },
                        { key: 'view', label: 'Views', render: (v: number) => v.toLocaleString() },
                        { key: 'actions', label: 'Actions', render: () => `<button class="btn btn-sm btn-outline">Edit</button>` }
                    ],
                    filters: [
                        { key: 'status', label: 'Status', options: ['Available', 'NotAvailable'] },
                        { key: 'mode', label: 'Mode', options: ['Rent', 'Buy'] }
                    ]
                };
            case 'Transactions':
                return {
                    data: this.data.transactions,
                    columns: [
                        { key: 'id', label: 'ID' },
                        { key: 'buyerId', label: 'Buyer', render: (v: string) => this.getUserName(v) },
                        { key: 'billboardId', label: 'Billboard', render: (v: string) => this.getBillboardLocation(v) },
                        { key: 'totalPrice', label: 'Amount', render: (v: number) => `Rp ${v.toLocaleString()}` },
                        { key: 'status', label: 'Status', render: (v: string) => `<span class="badge ${this.getStatusBadgeClass(v)}">${v}</span>` },
                        { key: 'createdAt', label: 'Date', render: (v: string) => new Date(v).toLocaleDateString() },
                        { key: 'actions', label: 'Actions', render: () => `<button class="btn btn-sm btn-outline">View</button>` }
                    ],
                    filters: [
                        { key: 'status', label: 'Status', options: ['PENDING', 'PAID', 'COMPLETED', 'CANCELLED'] }
                    ]
                };
            case 'Categories':
                return {
                    data: this.data.categories,
                    columns: [
                        { key: 'name', label: 'Name' },
                        { key: 'createdAt', label: 'Created', render: (v: string) => new Date(v).toLocaleDateString() },
                        { key: 'actions', label: 'Actions', render: () => `<button class="btn btn-sm btn-outline">Edit</button>` }
                    ],
                    filters: []
                };
            case 'Designs':
                return {
                    data: this.data.designs,
                    columns: [
                        { key: 'name', label: 'Name' },
                        { key: 'description', label: 'Description' },
                        { key: 'price', label: 'Price', render: (v: number) => `Rp ${v.toLocaleString()}` },
                        { key: 'createdAt', label: 'Created', render: (v: string) => new Date(v).toLocaleDateString() },
                        { key: 'actions', label: 'Actions', render: () => `<button class="btn btn-sm btn-outline">Edit</button>` }
                    ],
                    filters: []
                };
            case 'Add-ons':
                return {
                    data: this.data.addOns,
                    columns: [
                        { key: 'name', label: 'Name' },
                        { key: 'description', label: 'Description' },
                        { key: 'price', label: 'Price', render: (v: number) => `Rp ${v.toLocaleString()}` },
                        { key: 'createdAt', label: 'Created', render: (v: string) => new Date(v).toLocaleDateString() },
                        { key: 'actions', label: 'Actions', render: () => `<button class="btn btn-sm btn-outline">Edit</button>` }
                    ],
                    filters: []
                };
            case 'Ratings':
                return {
                    data: this.data.ratings,
                    columns: [
                        { key: 'userId', label: 'User', render: (v: string) => this.getUserName(v) },
                        { key: 'transactionId', label: 'Transaction' },
                        { key: 'rating', label: 'Rating', render: (v: number) => '⭐'.repeat(v) },
                        { key: 'comment', label: 'Comment' },
                        { key: 'createdAt', label: 'Date', render: (v: string) => new Date(v).toLocaleDateString() },
                        { key: 'actions', label: 'Actions', render: () => `<button class="btn btn-sm btn-outline">Delete</button>` }
                    ],
                    filters: [
                        { key: 'rating', label: 'Rating', options: ['5', '4', '3', '2', '1'] }
                    ]
                };
            case 'Notifications':
                return {
                    data: this.data.notifications,
                    columns: [
                        { key: 'title', label: 'Title' },
                        { key: 'message', label: 'Message' },
                        { key: 'entity', label: 'Type', render: (v: string) => `<span class="badge badge-neutral">${v}</span>` },
                        { key: 'status', label: 'Status', render: (v: string) => `<span class="badge ${v === 'UNREAD' ? 'badge-warning' : 'badge-success'}">${v}</span>` },
                        { key: 'createdAt', label: 'Date', render: (v: string) => new Date(v).toLocaleDateString() },
                        { key: 'actions', label: 'Actions', render: () => `<button class="btn btn-sm btn-outline">View</button>` }
                    ],
                    filters: [
                        { key: 'status', label: 'Status', options: ['READ', 'UNREAD'] },
                        { key: 'entity', label: 'Type', options: ['TRANSACTION', 'BILLBOARD'] }
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
            result = result.filter(item =>
                Object.values(item as any).some(val =>
                    String(val).toLowerCase().includes(q)
                )
            );
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
                const valA = (a as any)[this.state.sortColumn!];
                const valB = (b as any)[this.state.sortColumn!];
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

    private generateTableHTML<T>(data: T[], columns: ColumnConfig<T>[]) {
        if (data.length === 0) return '<div style="padding: 2rem; text-align: center; color: var(--text-secondary);">No data found</div>';

        return `
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              ${columns.map(col => `
                <th data-col="${String(col.key)}">
                  ${col.label}
                  ${this.state.sortColumn === String(col.key) ? (this.state.sortDirection === 'asc' ? '↑' : '↓') : ''}
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
        const b = this.data.billboards.find(i => i.id === id);
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
        const titleEl = this.root.querySelector('.modal-title');
        const body = this.root.querySelector('.modal-body');

        if (overlay && titleEl && body) {
            titleEl.textContent = title;
            body.innerHTML = '<p>Form placeholder for ' + title + '</p>';
            overlay.classList.add('open');
        }
    }

    private closeModal() {
        const overlay = this.root.querySelector('.modal-overlay');
        overlay?.classList.remove('open');
    }
}
