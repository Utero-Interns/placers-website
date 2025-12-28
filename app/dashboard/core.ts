
import { authService, User } from '../lib/auth';
import { AddOn, Billboard, Seller, User as StoreUser, Transaction } from '../lib/store';

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

// Dashboard-specific DTO for Transaction Sales
interface DashboardTransactionDTO extends Omit<Transaction, 'totalPrice' | 'billboardId' | 'buyerId' | 'sellerId'> {
  totalPrice: string;
  billboard: Billboard;
  buyer: StoreUser;
  addons: { addOn: AddOn }[];
}

interface HistoryActivity {
  action: string;
  createdAt: string;
}

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

  private currentModalAction: (() => Promise<void>) | null = null;

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

    // Modal Listener
    this.root.querySelector('.confirm-modal')?.addEventListener('click', () => {
      if (this.currentModalAction) this.currentModalAction();
    });

    const closeBtns = this.root.querySelectorAll('.modal-close, .close-modal');
    closeBtns.forEach(btn => btn.addEventListener('click', () => this.closeModal()));
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
      }

      this.currentModalAction = async () => {
        await onConfirm();
      };

      overlay.classList.add('open');
    }
  }

  private closeModal() {
    const overlay = this.root.querySelector('.modal-overlay');
    if (overlay) overlay.classList.remove('open');
    this.currentModalAction = null;
  }

  private renderLayout() {
    const profilePicture = (this.user as User).profilePicture;
    const username = this.user.username || 'User';

    this.root.innerHTML = `
      <div class="dashboard-container">
        <aside class="sidebar">
          <div class="sidebar-header">
            <div class="logo">PLACERS</div>
          </div>
          <nav class="sidebar-nav" id="sidebar-nav">
            <!-- Nav items injected here -->
          </nav>

          <div class="sidebar-footer" style="padding: 1rem; border-top: 1px solid #e2e8f0; display: flex; align-items: center; gap: 1rem;">
             <div class="user-avatar" style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #64748b;">
                ${profilePicture
        ? `<img src="/api/proxy/${profilePicture}" style="width: 100%; height: 100%; object-fit: cover;">`
        : username.charAt(0).toUpperCase()}
             </div>
             <div style="flex: 1; overflow: hidden;">
                <div style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${username}</div>
                <div style="font-size: 0.75rem; color: #64748b;">${this.user.level}</div>
             </div>
          </div>
        </aside>

        <main class="main-content">
          <header class="top-header">
            <h1 class="page-title" id="page-title">Dashboard</h1>
            <div class="user-menu">
              <span class="welcome-text">Hi, ${username}</span>
              <button class="btn btn-outline btn-sm logout-btn">Logout</button>
            </div>
          </header>

          <div id="content-area" class="content-area">
            <!-- Content injected here -->
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
  }

  private renderSidebar() {
    const navContainer = this.root.querySelector('#sidebar-nav');
    if (!navContainer) return;

    const role = this.user.level;
    // Strict guard: ADMIN should not see this, only BUYER | SELLER logic applies
    if (role === 'ADMIN') return;

    const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(role));

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
        ]) as [Billboard[], DashboardTransactionDTO[]];

        const activeBillboards = Array.isArray(billboards) ? billboards.length : 0;
        const totalSales = Array.isArray(sales) ? sales.length : 0;
        const revenue = Array.isArray(sales) ? sales.reduce((acc: number, t: DashboardTransactionDTO) => acc + (t.status === 'PAID' ? (parseFloat(t.totalPrice) || 0) : 0), 0) : 0;

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
      const billboards = await this.fetchApi('/billboard/myBillboards') as Billboard[];

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
                                    <td>${b.cityName || '-'}</td>
                                    <td>${b.mode || 'Standard'}</td>
                                    <td>Rp ${(b.rentPrice || b.sellPrice || 0).toLocaleString()}</td>
                                    <td><span class="badge ${b.status === 'Available' ? 'badge-success' : 'badge-neutral'}">${b.status}</span></td>
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

    } catch (error) {
      container.innerHTML = `<div class="p-4 bg-red-50 text-red-600 rounded">Error loading billboards: ${error}</div>`;
    }
  }

  private async renderMySales(container: Element) {
    try {
      const sales = await this.fetchApi('/transaction/mySales') as DashboardTransactionDTO[];

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
                            ${sales.length > 0 ? sales.map((t: DashboardTransactionDTO) => `
                                <tr>
                                    <td class="font-mono text-sm">${t.id.substring(0, 8)}...</td>
                                    <td>${t.billboard?.location || 'Billboard Item'}</td>
                                    <td>Rp ${parseFloat(t.totalPrice || '0').toLocaleString()}</td>
                                    <td>${new Date(t.createdAt).toLocaleDateString()}</td>
                                    <td><span class="badge ${t.status === 'PAID' ? 'badge-success' : 'badge-warning'}">${t.status}</span></td>
                                </tr>
                            `).join('') : '<tr><td colspan="5" class="p-8 text-center text-slate-500">No sales transactions found</td></tr>'}
                        </tbody>
                    </table>
                </div>
            `;
    } catch (error) {
      container.innerHTML = `<div class="p-4 bg-red-50 text-red-600 rounded">Error loading sales: ${error}</div>`;
    }
  }

  private async renderHistory(container: Element) {
    try {
      const history = await this.fetchApi('/history/mine') as HistoryActivity[];

      if (!Array.isArray(history)) throw new Error("Invalid format");

      container.innerHTML = `
                <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in">
                    <h3 class="font-bold mb-4">Activity Log</h3>
                    <ul class="space-y-4">
                        ${history.length > 0 ? history.map((h: HistoryActivity) => `
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
      // Fetch latest user data to ensure we have profilePicture and current info
      const userRes = await this.fetchApi('/user/profile/me');
      const user = userRes.data || {};

      // Attempt to fetch seller data if applicable, but don't fail if not found (e.g. buyer)
      let seller = {};
      if (this.user.level === 'SELLER') {
        try {
          const sellerRes = await this.fetchApi('/seller/me');
          seller = sellerRes || {};
        } catch (e) { console.log('Seller profile not found or error', e); }
      }

      container.innerHTML = `
                <div class="max-w-4xl mx-auto space-y-8 animate-slide-up">
                    
                    <!-- Editable User Account Section -->
                    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                         <h2 class="text-xl font-bold mb-6">User Account</h2>
                         
                         <form id="user-profile-form">
                            <div class="flex flex-col items-center mb-6 text-center">
                                <div class="w-24 h-24 rounded-full overflow-hidden bg-slate-50 border-4 border-white shadow-sm mb-4 relative">
                                    <img id="profile-preview-img" src="${user.profilePicture ? `/api/proxy/${user.profilePicture}` : `https://ui-avatars.com/api/?name=${user.username || 'User'}&background=random`}" class="w-full h-full object-cover">
                                </div>
                                <label for="profile-image-input" class="cursor-pointer text-sm text-blue-600 font-medium hover:text-blue-700">Change Picture</label>
                                <input type="file" name="file" id="profile-image-input" class="hidden" accept="image/*">
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            </div>
                            
                            <div class="border-t border-dashed border-slate-200 my-6 pt-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="form-group">
                                        <label class="form-label">New Password</label>
                                        <input type="password" class="form-control" name="password" placeholder="Leave blank to keep current">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Confirm Password</label>
                                        <input type="password" class="form-control" name="confirmPassword" placeholder="Confirm new password">
                                    </div>
                                </div>
                            </div>

                            <div class="flex justify-end mt-4">
                                <button type="submit" class="btn btn-primary w-full md:w-auto">Update Account</button>
                            </div>
                         </form>
                    </div>

                    <!-- Read-Only Seller Profile (if Seller) -->
                    ${this.user.level === 'SELLER' ? `
                    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                        <h2 class="text-xl font-bold mb-6">Business Details</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-75">
                             <div class="form-group">
                                <label class="form-label">Company Name</label>
                                <input type="text" class="form-control bg-slate-50" value="${(seller as Seller).companyName || ''}" readonly>
                            </div>
                             <div class="form-group">
                                <label class="form-label">Full Name</label>
                                <input type="text" class="form-control bg-slate-50" value="${(seller as Seller).fullname || ''}" readonly>
                            </div>
                            <div class="form-group">
                                <label class="form-label">KTP</label>
                                <input type="text" class="form-control bg-slate-50" value="${(seller as Seller).ktp || ''}" readonly>
                            </div>
                            <div class="form-group col-span-2">
                                 <label class="form-label">Office Address</label>
                                <input type="text" class="form-control bg-slate-50" value="${(seller as Seller).officeAddress || ''}" readonly>
                            </div>
                        </div>
                        <div class="mt-4 text-sm text-slate-500 text-right">
                            To edit business details, please contact support.
                        </div>
                    </div>
                    ` : ''}

                </div>
            `;

      // --- Interaction Logic ---
      const userForm = container.querySelector('#user-profile-form');
      const imgInput = container.querySelector('#profile-image-input') as HTMLInputElement;
      const imgPreview = container.querySelector('#profile-preview-img') as HTMLImageElement;

      // Image Preview
      imgInput?.addEventListener('change', () => {
        if (imgInput.files && imgInput.files[0]) {
          imgPreview.src = URL.createObjectURL(imgInput.files[0]);
        }
      });

      // Form Submit
      userForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const rawFormData = new FormData(e.target as HTMLFormElement);

        // Validation
        const p1 = rawFormData.get('password') as string;
        const p2 = rawFormData.get('confirmPassword') as string;

        if (p1 && p1 !== p2) {
          this.openConfirmModal('Error', 'Passwords do not match', async () => { }, 'error');
          return;
        }

        // Build Payload
        const payload = new FormData();
        const username = rawFormData.get('username') as string;
        const email = rawFormData.get('email') as string;
        const phone = rawFormData.get('phone') as string;

        payload.append('username', username);
        payload.append('email', email);
        payload.append('phone', phone || '');

        if (p1) {
          payload.append('password', p1);
        }

        const fileInput = rawFormData.get('file') as File;
        if (fileInput && fileInput.size > 0) {
          payload.append('file', fileInput);
        }

        // Show generic loading or toast? We'll use a simple alert/toast if available, or just proceed.
        // Since we don't have a showToast helper here easily without adding it, we'll assume the user waits a sec.

        try {
          const res = await fetch('/api/proxy/user/me', {
            method: 'PUT',
            body: payload,
            credentials: 'include'
          });
          const json = await res.json();

          if (res.ok) {
            this.openConfirmModal('Success', 'Profile updated successfully!', async () => {
              window.location.reload();
            }, 'success');
          } else {
            let msg = json.message || 'Update failed';
            if (Array.isArray(msg)) msg = msg.join(', ');
            this.openConfirmModal('Error', msg, async () => {
              window.location.reload();
            }, 'error');
          }
        } catch (err) {
          console.error(err);
          this.openConfirmModal('Error', 'An unexpected error occurred.', async () => {
            window.location.reload();
          }, 'error');
        }
      });

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
