import { authService, User } from '../lib/auth';

interface Billboard {
    location: string;
    city: string;
    type: string;
    price: number;
    status: string;
}

interface Transaction {
    id: string;
    billboard: {
        location: string;
    };
    totalPrice: number;
    createdAt: string;
    status: string;
}

interface HistoryItem {
    action: string;
    createdAt: string;
}


// Use strict proxy path for all business logic
const API_PREFIX = '/api/proxy';

// Navigation Items
type NavItem = {
  id: string;
  label: string;
  icon: string;
  roles: ('BUYER' | 'SELLER')[];
};

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', roles: ['BUYER', 'SELLER'] },
  { id: 'billboards', label: 'My Billboards', icon: '🏙️', roles: ['SELLER'] },
  { id: 'sales', label: 'My Sales', icon: '💰', roles: ['SELLER'] },
  { id: 'history', label: 'History', icon: '📜', roles: ['SELLER'] },
  { id: 'settings', label: 'Profile', icon: '⚙️', roles: ['SELLER'] }, // Mapped to /seller/me
  { id: 'upgrade', label: 'Upgrade to Seller', icon: '🚀', roles: ['BUYER'] },
];

export class UserDashboard {
  private root: HTMLElement;
  private user: User;
  private activeTab: string = 'dashboard';

  constructor(rootId: string, user: User) {
    const root = document.getElementById(rootId);
    if (!root) throw new Error(`Root element #${rootId} not found`);
    this.root = root;
    this.user = user;
    this.init();
  }

  private init() {
    this.renderLayout();
    this.renderSidebar();
    this.attachGlobalListeners();
    this.navigateTo('dashboard');
  }

  private attachGlobalListeners() {
    // Logout
    this.root.querySelector('.logout-btn')?.addEventListener('click', async () => {
      await authService.logout();
      window.location.href = '/login';
    });

    // Mobile toggle could go here
  }

  private renderLayout() {
    this.root.innerHTML = `
      <div class="dashboard-container">
        <aside class="sidebar">
          <div class="sidebar-header">
            <div class="logo">PLACERS</div>
          </div>
          <nav class="sidebar-nav" id="sidebar-nav">
            <!-- Nav items injected here -->
          </nav>
        </aside>

        <main class="main-content">
          <header class="top-header">
            <h1 class="page-title" id="page-title">Dashboard</h1>
            <div class="user-menu">
              <span class="welcome-text">Hi, ${this.user.username}</span>
              <button class="btn btn-outline btn-sm logout-btn">Logout</button>
            </div>
          </header>

          <div id="content-area" class="content-area">
            <!-- Content injected here -->
          </div>
        </main>
      </div>
      <div id="modal-root" class="modal-overlay"></div>
    `;
  }

  private renderSidebar() {
    const navContainer = this.root.querySelector('#sidebar-nav');
    if (!navContainer) return;

    const role = this.user.level;
    const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(role as 'BUYER' | 'SELLER'));

    navContainer.innerHTML = visibleItems.map(item => `
        <div class="nav-item ${this.activeTab === item.id ? 'active' : ''}" data-tab="${item.id}">
          <span class="nav-icon">${item.icon}</span>
          <span class="nav-label">${item.label}</span>
        </div>
      `).join('');

    // Attach Click Listeners
    navContainer.querySelectorAll('.nav-item').forEach(el => {
      el.addEventListener('click', () => {
        const tab = el.getAttribute('data-tab');
        if (tab) this.navigateTo(tab);
      });
    });
  }

  private navigateTo(tabId: string) {
    this.activeTab = tabId;

    // Update Sidebar UI
    this.root.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-tab') === tabId);
    });

    // Update Header Title
    const titleEl = this.root.querySelector('#page-title');
    const activeItem = NAV_ITEMS.find(i => i.id === tabId);
    if (titleEl && activeItem) titleEl.textContent = activeItem.label;

    // Render Content
    this.renderContent(tabId);
  }

  private async renderContent(tabId: string) {
    const container = this.root.querySelector('#content-area');
    if (!container) return;

    // Show loading state
    container.innerHTML = '<div class="p-8 text-center animate-pulse">Loading data...</div>';

    switch (tabId) {
      case 'dashboard':
        await this.renderDashboardOverview(container);
        break;
      case 'billboards':
        await this.renderMyBillboards(container);
        break;
      case 'sales':
        await this.renderMySales(container);
        break;
      case 'history':
        await this.renderHistory(container);
        break;
      case 'settings':
        await this.renderProfile(container);
        break;
      case 'upgrade':
        this.renderUpgrade(container);
        break;
      default:
        container.innerHTML = '<div>Page not found</div>';
    }
  }

  // --- MODULE RENDERERS ---

  private async renderDashboardOverview(container: Element) {
    // Fetch stats if Seller
    let statsHtml = '';

    if (this.user.level === 'SELLER') {
      // We can parallelize these fetches
      try {
        const [billboards, sales] = await Promise.all([
          this.fetchApi('/billboard/myBillboards'),
          this.fetchApi('/transaction/mySales')
        ]);

        const activeBillboards = Array.isArray(billboards) ? billboards.length : 0;
        const totalSales = Array.isArray(sales) ? sales.length : 0;
        const revenue = Array.isArray(sales) ? sales.reduce((acc: number, t: Transaction) => acc + (t.status === 'PAID' ? t.totalPrice : 0), 0) : 0;

        statsHtml = `
                    <div class="stats-grid animate-fade-in">
                        <div class="stat-card">
                            <div class="stat-label">Total Revenue</div>
                            <div class="stat-value">Rp ${revenue.toLocaleString()}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Active Billboards</div>
                            <div class="stat-value">${activeBillboards}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Total Sales</div>
                            <div class="stat-value">${totalSales}</div>
                        </div>
                    </div>
                `;
      } catch (e) {
        console.error(e);
        statsHtml = '<div class="text-red-500">Failed to load stats</div>';
      }
    } else {
      // Buyer Stats
      statsHtml = `
                <div class="stats-grid animate-fade-in">
                    <div class="stat-card">
                        <div class="stat-label">Account Status</div>
                        <div class="stat-value">Buyer</div>
                    </div>
                </div>
            `;
    }

    container.innerHTML = `
            ${statsHtml}
            <div class="section-header mt-8">
                <h2>Welcome to Placers</h2>
            </div>
            <p class="text-slate-500">Use the sidebar to manage your activities.</p>
        `;
  }

  private async renderMyBillboards(container: Element) {
    try {
      const billboards = await this.fetchApi('/billboard/myBillboards');

      if (!Array.isArray(billboards)) throw new Error("Invalid format");

      container.innerHTML = `
                <div class="flex justify-between items-center mb-6 animate-slide-up">
                    <div class="relative">
                        <input type="text" placeholder="Search billboards..." class="search-input">
                    </div>
                    <button class="btn btn-primary" id="create-billboard-btn">+ Create New</button>
                </div>

                <div class="table-container animate-fade-in">
                    <table class="w-full">
                        <thead>
                            <tr>
                                <th>Location</th>
                                <th>City</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${billboards.length > 0 ? billboards.map((b: Billboard) => `
                                <tr>
                                    <td class="font-medium">${b.location}</td>
                                    <td>${b.city || '-'}</td>
                                    <td>${b.type || 'Standard'}</td>
                                    <td>Rp ${b.price?.toLocaleString() || 0}</td>
                                    <td><span class="badge ${b.status === 'Active' ? 'badge-success' : 'badge-neutral'}">${b.status}</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline">Edit</button>
                                    </td>
                                </tr>
                            `).join('') : '<tr><td colspan="6" class="p-8 text-center text-slate-500">No billboards found</td></tr>'}
                        </tbody>
                    </table>
                </div>
            `;

      // Listeners
      container.querySelector('#create-billboard-btn')?.addEventListener('click', () => {
        alert('Create Billboard Modal placeholder');
      });

    } catch {
      container.innerHTML = `<div class="p-4 bg-red-50 text-red-600 rounded">Error loading billboards</div>`;
    }
  }

  private async renderMySales(container: Element) {
    try {
      const sales = await this.fetchApi('/transaction/mySales');

      if (!Array.isArray(sales)) throw new Error("Invalid format");

      container.innerHTML = `
                <div class="table-container animate-fade-in">
                    <table class="w-full">
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Detail</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sales.length > 0 ? sales.map((t: Transaction) => `
                                <tr>
                                    <td class="font-mono text-sm">${t.id.substring(0, 8)}...</td>
                                    <td>${t.billboard?.location || 'Billboard Item'}</td>
                                    <td>Rp ${t.totalPrice?.toLocaleString()}</td>
                                    <td>${new Date(t.createdAt).toLocaleDateString()}</td>
                                    <td><span class="badge ${t.status === 'PAID' ? 'badge-success' : 'badge-warning'}">${t.status}</span></td>
                                </tr>
                            `).join('') : '<tr><td colspan="5" class="p-8 text-center text-slate-500">No sales transactions found</td></tr>'}
                        </tbody>
                    </table>
                </div>
            `;
    } catch {
      container.innerHTML = `<div class="p-4 bg-red-50 text-red-600 rounded">Error loading sales</div>`;
    }
  }

  private async renderHistory(container: Element) {
    try {
      const history = await this.fetchApi('/history/mine');

      if (!Array.isArray(history)) throw new Error("Invalid format");

      container.innerHTML = `
                <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in">
                    <h3 class="font-bold mb-4">Activity Log</h3>
                    <ul class="space-y-4">
                        ${history.length > 0 ? history.map((h: HistoryItem) => `
                            <li class="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0">
                                <div class="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                                <div>
                                    <p class="text-sm font-medium text-slate-800">${h.action || 'Updated item'}</p>
                                    <div class="text-xs text-slate-500">${new Date(h.createdAt).toLocaleString()}</div>
                                </div>
                            </li>
                        `).join('') : '<li class="text-slate-500 text-sm">No activity recorded</li>'}
                    </ul>
                </div>
            `;
    } catch {
      container.innerHTML = `<div class="text-red-500">Error loading history</div>`;
    }
  }

  private async renderProfile(container: Element) {
    try {
      const seller = await this.fetchApi('/seller/me');

      container.innerHTML = `
                <div class="max-w-2xl bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-slide-up">
                    <h2 class="text-xl font-bold mb-6">Seller Profile</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="form-group">
                            <label class="form-label">Company Name</label>
                            <input type="text" class="form-control" value="${seller.companyName || ''}" readonly>
                        </div>
                         <div class="form-group">
                            <label class="form-label">Full Name</label>
                            <input type="text" class="form-control" value="${seller.fullname || ''}" readonly>
                        </div>
                        <div class="form-group">
                            <label class="form-label">KTP</label>
                            <input type="text" class="form-control" value="${seller.ktp || ''}" readonly>
                        </div>
                        <div class="form-group col-span-2">
                             <label class="form-label">Office Address</label>
                            <input type="text" class="form-control" value="${seller.officeAddress || ''}" readonly>
                        </div>
                    </div>

                    <div class="mt-8 flex justify-end">
                        <button class="btn btn-outline mr-2">Change Password</button>
                        <button class="btn btn-primary">Edit Profile</button>
                    </div>
                </div>
            `;
    } catch {
      container.innerHTML = `<div class="text-red-500">Error loading profile data</div>`;
    }
  }

  private renderUpgrade(container: Element) {
    container.innerHTML = `
            <div class="upgrade-hero animate-slide-up">
                <h2 class="text-2xl font-bold mb-4 text-slate-800">Start Selling on Placers</h2>
                <p class="mb-8 text-slate-600 max-w-lg mx-auto">
                    Transform your billboard assets into revenue. Join our network of premium sellers and reach thousands of advertisers.
                </p>
                <button id="start-upgrade-btn" class="btn btn-primary btn-lg shadow-lg hover:translate-y-[-2px] transition-transform">
                    Register as Seller
                </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 animate-fade-in">
                <div class="p-6 bg-white rounded-xl shadow-sm border border-slate-100 text-center">
                    <div class="text-4xl mb-4">📈</div>
                    <h3 class="font-bold mb-2">Track Performance</h3>
                    <p class="text-sm text-slate-500">Real-time analytics for your assets</p>
                </div>
                 <div class="p-6 bg-white rounded-xl shadow-sm border border-slate-100 text-center">
                    <div class="text-4xl mb-4">🤝</div>
                    <h3 class="font-bold mb-2">Direct Deals</h3>
                    <p class="text-sm text-slate-500">Connect directly with buyers</p>
                </div>
                 <div class="p-6 bg-white rounded-xl shadow-sm border border-slate-100 text-center">
                    <div class="text-4xl mb-4">🛡️</div>
                    <h3 class="font-bold mb-2">Secure Payments</h3>
                    <p class="text-sm text-slate-500">Guaranteed transactions</p>
                </div>
            </div>
        `;

    container.querySelector('#start-upgrade-btn')?.addEventListener('click', () => {
      // Redirect to the existing registration page
      window.location.href = '/seller/register';
    });
  }

  // --- Helpers ---

  private async fetchApi(endpoint: string) {
    const res = await fetch(`${API_PREFIX}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  }
}