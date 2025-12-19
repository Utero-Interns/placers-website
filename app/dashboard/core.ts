
import { store, User, Seller, Transaction } from '../lib/store';

type TabName = 'Overview' | 'Transactions' | 'Upgrade' | 'SellerCenter';
type SellerTabName = 'Overview' | 'Billboards' | 'Transactions';

export class UserDashboard {
  private root: HTMLElement;
  private user: User;
  private activeTab: TabName = 'Overview';
  private activeSellerTab: SellerTabName = 'Overview';

  constructor(rootId: string, user: User) {
    const root = document.getElementById(rootId);
    if (!root) throw new Error(`Root element #${rootId} not found`);
    this.root = root;
    this.user = user;
    this.init();
  }

  private init() {
    this.renderLayout();
    this.renderContent();
  }

  private renderLayout() {
    this.root.innerHTML = `
      <div class="dashboard-container">
        <header class="dashboard-header">
          <div class="header-content">
            <h1 class="logo">PLACERS</h1>
            <div class="user-menu">
              <span class="welcome-text">Welcome, ${this.user.username}</span>
              <button class="btn btn-outline btn-sm logout-btn">Logout</button>
            </div>
          </div>
        </header>
        
        <div class="dashboard-body">
          <nav class="dashboard-nav">
            <button class="nav-tab ${this.activeTab === 'Overview' ? 'active' : ''}" data-tab="Overview">Overview</button>
            <button class="nav-tab ${this.activeTab === 'Transactions' ? 'active' : ''}" data-tab="Transactions">Transactions</button>
            ${this.user.level === 'BUYER' ?
        `<button class="nav-tab ${this.activeTab === 'Upgrade' ? 'active' : ''}" data-tab="Upgrade">Upgrade to Seller</button>` :
        `<button class="nav-tab ${this.activeTab === 'SellerCenter' ? 'active' : ''}" data-tab="SellerCenter">Seller Center</button>`
      }
          </nav>
          
          <main id="dashboard-content" class="dashboard-content">
            <!-- Content injected here -->
          </main>
        </div>
      </div>
      <div id="modal-root" class="modal-overlay"></div>
    `;

    // Listeners
    this.root.querySelectorAll('.nav-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = (e.target as HTMLElement).getAttribute('data-tab') as TabName;
        this.setActiveTab(tab);
      });
    });

    this.root.querySelector('.logout-btn')?.addEventListener('click', () => {
      store.logout();
      window.location.href = '/auth/login';
    });
  }

  private setActiveTab(tab: TabName) {
    this.activeTab = tab;
    this.root.querySelectorAll('.nav-tab').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });
    this.renderContent();
  }

  private renderContent() {
    const container = this.root.querySelector('#dashboard-content');
    if (!container) return;

    container.innerHTML = '';

    switch (this.activeTab) {
      case 'Overview':
        this.renderOverview(container);
        break;
      case 'Transactions':
        this.renderTransactions(container);
        break;
      case 'Upgrade':
        this.renderUpgrade(container);
        break;
      case 'SellerCenter':
        this.renderSellerCenter(container);
        break;
    }
  }

  private renderOverview(container: Element) {
    // Mock stats
    const stats = [
      { label: 'Total Orders', value: '12' },
      { label: 'Active Rentals', value: '2' },
      { label: 'Total Spend', value: 'Rp 150.000.000' },
    ];

    container.innerHTML = `
      <div class="stats-grid mb-8">
        ${stats.map(stat => `
          <div class="stat-card">
            <div class="stat-label">${stat.label}</div>
            <div class="stat-value">${stat.value}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="section-header">
        <h2>Recent Transactions</h2>
        <button class="btn-link" id="view-all-trx">View All</button>
      </div>
      <div class="table-container">
        ${this.renderTransactionTable(store.data.transactions.filter(t => t.buyerId === this.user.id).slice(0, 5))}
      </div>
    `;

    container.querySelector('#view-all-trx')?.addEventListener('click', () => this.setActiveTab('Transactions'));
  }

  private renderTransactions(container: Element) {
    const transactions = store.data.transactions.filter(t => t.buyerId === this.user.id);

    container.innerHTML = `
      <div class="section-header">
        <h2>My Transactions</h2>
      </div>
      <div class="table-controls mb-4">
        <input type="text" class="search-input" placeholder="Search Transaction ID...">
        <select class="form-control" style="width:auto">
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>
      <div class="table-container">
        ${this.renderTransactionTable(transactions)}
      </div>
    `;
  }

  private renderTransactionTable(transactions: Transaction[]) {
    if (transactions.length === 0) return '<div class="p-4 text-center text-slate-500">No transactions found</div>';

    return `
      <table class="w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Billboard</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${transactions.map(t => {
      const billboard = store.data.billboards.find(b => b.id === t.billboardId);
      return `
              <tr>
                <td>${t.id}</td>
                <td>${billboard?.location || 'Unknown'}</td>
                <td>Rp ${t.totalPrice.toLocaleString()}</td>
                <td><span class="badge badge-${this.getStatusColor(t.status)}">${t.status}</span></td>
                <td>${new Date(t.createdAt).toLocaleDateString()}</td>
                <td><button class="btn btn-sm btn-outline">Details</button></td>
              </tr>
            `;
    }).join('')}
        </tbody>
      </table>
    `;
  }

  private renderUpgrade(container: Element) {
    container.innerHTML = `
      <div class="upgrade-hero">
        <h2 class="text-2xl font-bold mb-4">Become a Seller on Placers</h2>
        <p class="mb-6 text-slate-600">Unlock the potential of your billboard assets. Join thousands of sellers and reach premium buyers.</p>
        <div class="benefits-grid mb-8">
          <div class="benefit-item">📈 Track Revenue</div>
          <div class="benefit-item">🏢 Manage Inventory</div>
          <div class="benefit-item">🤝 Direct Deals</div>
        </div>
        <button class="btn btn-primary btn-lg" id="start-upgrade-btn">Register as Seller</button>
      </div>
    `;

    container.querySelector('#start-upgrade-btn')?.addEventListener('click', () => {
      this.openSellerRegistrationModal();
    });
  }

  private openSellerRegistrationModal() {
    const modalRoot = this.root.querySelector('#modal-root');
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="modal open">
        <div class="modal-header">
          <h3 class="modal-title">Seller Registration</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <form id="seller-form" class="space-y-4">
            <div>
              <label class="form-label">Full Name</label>
              <input type="text" name="fullname" class="form-control" required>
            </div>
            <div>
              <label class="form-label">Company Name</label>
              <input type="text" name="companyName" class="form-control" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">KTP Number</label>
                <input type="text" name="ktp" class="form-control" required>
              </div>
              <div>
                <label class="form-label">NPWP Number</label>
                <input type="text" name="npwp" class="form-control" required>
              </div>
            </div>
            <div>
              <label class="form-label">KTP Address</label>
              <textarea name="ktpAddress" class="form-control" rows="2" required></textarea>
            </div>
            <div>
              <label class="form-label">Office Address</label>
              <textarea name="officeAddress" class="form-control" rows="2" required></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline close-modal">Cancel</button>
          <button class="btn btn-primary" id="submit-seller">Register</button>
        </div>
      </div>
    `;

    modalRoot.classList.add('open');

    // Close handlers
    const close = () => {
      modalRoot.classList.remove('open');
      modalRoot.innerHTML = '';
    };
    modalRoot.querySelectorAll('.modal-close, .close-modal').forEach(b => b.addEventListener('click', close));

    // Submit handler
    modalRoot.querySelector('#submit-seller')?.addEventListener('click', () => {
      const form = modalRoot.querySelector('#seller-form') as HTMLFormElement;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      const result = store.upgradeToSeller(payload);
      if (result.success) {
        alert('Congratulations! You are now a seller.');
        close();
        // Refresh dashboard to show Seller Center
        window.location.reload();
      } else {
        alert('Error: ' + result.message);
      }
    });
  }

  private renderSellerCenter(container: Element) {
    const seller = store.getSellerProfile(this.user.id);
    if (!seller) return;

    container.innerHTML = `
      <div class="seller-layout">
        <aside class="seller-sidebar">
          <div class="seller-profile">
            <div class="font-bold">${seller.companyName}</div>
            <div class="text-sm text-slate-500">${seller.fullname}</div>
          </div>
          <nav class="seller-nav">
            <button class="seller-nav-item ${this.activeSellerTab === 'Overview' ? 'active' : ''}" data-stab="Overview">Dashboard</button>
            <button class="seller-nav-item ${this.activeSellerTab === 'Billboards' ? 'active' : ''}" data-stab="Billboards">My Billboards</button>
            <button class="seller-nav-item ${this.activeSellerTab === 'Transactions' ? 'active' : ''}" data-stab="Transactions">Sales</button>
          </nav>
        </aside>
        <div class="seller-content">
          <!-- Sub-content injected here -->
        </div>
      </div>
    `;

    const contentArea = container.querySelector('.seller-content');
    this.renderSellerSubContent(contentArea!, seller);

    // Sub-nav listeners
    container.querySelectorAll('.seller-nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeSellerTab = (e.target as HTMLElement).getAttribute('data-stab') as SellerTabName;
        this.renderSellerCenter(container); // Re-render full seller center to update active state
      });
    });
  }

  private renderSellerSubContent(container: Element, seller: Seller) {
    if (this.activeSellerTab === 'Overview') {
      const myBillboards = store.data.billboards.filter(b => b.ownerId === seller.id);
      const mySales = store.data.transactions.filter(t => t.sellerId === seller.id);
      const revenue = mySales.reduce((acc, t) => acc + (t.status === 'PAID' || t.status === 'COMPLETED' ? t.totalPrice : 0), 0);

      container.innerHTML = `
        <h2 class="mb-4 text-xl font-bold">Seller Dashboard</h2>
        <div class="stats-grid mb-8">
          <div class="stat-card">
            <div class="stat-label">Total Revenue</div>
            <div class="stat-value">Rp ${revenue.toLocaleString()}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Active Billboards</div>
            <div class="stat-value">${myBillboards.length}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Sales</div>
            <div class="stat-value">${mySales.length}</div>
          </div>
        </div>
      `;
    } else if (this.activeSellerTab === 'Billboards') {
      const myBillboards = store.data.billboards.filter(b => b.ownerId === seller.id);
      container.innerHTML = `
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">My Billboards</h2>
          <button class="btn btn-primary btn-sm">+ Add Billboard</button>
        </div>
        <table class="w-full">
          <thead>
            <tr>
              <th>Location</th>
              <th>City</th>
              <th>Status</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${myBillboards.map(b => `
              <tr>
                <td>${b.location}</td>
                <td>${b.cityName}</td>
                <td><span class="badge ${b.status === 'Available' ? 'badge-success' : 'badge-danger'}">${b.status}</span></td>
                <td>Rp ${b.rentPrice.toLocaleString()}</td>
                <td><button class="btn btn-sm btn-outline">Edit</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (this.activeSellerTab === 'Transactions') {
      const mySales = store.data.transactions.filter(t => t.sellerId === seller.id);
      container.innerHTML = `
        <h2 class="text-xl font-bold mb-4">Sales History</h2>
        ${this.renderTransactionTable(mySales)}
      `;
    }
  }

  private getStatusColor(status: string) {
    switch (status) {
      case 'PAID': case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'danger';
      default: return 'neutral';
    }
  }
}
