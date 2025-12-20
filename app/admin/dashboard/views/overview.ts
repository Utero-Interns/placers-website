/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateTableHTML, getStatusBadgeClass } from './shared';

export function renderDashboardOverview(dashboard: any, container: Element) {
    // Stats calculation
    const stats = [
        { label: 'Total Users', value: dashboard.apiData.users.length || dashboard.data.users.length, change: '+12%' },
        { label: 'Active Sellers', value: dashboard.apiData.sellers.length || dashboard.data.sellers.length, change: '+5%' },
        { label: 'Total Billboards', value: dashboard.apiData.billboards.length || dashboard.data.billboards.length, change: '+8%' },
        { label: 'Total Revenue', value: 'Rp 2.5B', change: '+25%' },
    ];

    // Helper to get user name
    const getUserName = (id: string) => {
        const user = dashboard.data.users.find((u: any) => u.id === id) || (dashboard.apiData.users || []).find((u: any) => u.id === id);
        return user ? user.username : id;
    };

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
        ${generateTableHTML(dashboard.data.transactions.slice(0, 5), [
        { key: 'id', label: 'ID' },
        { key: 'buyerId', label: 'Buyer', render: (v: string) => getUserName(v) },
        { key: 'totalPrice', label: 'Amount', render: (v: number) => `Rp ${v.toLocaleString()}` },
        { key: 'status', label: 'Status', render: (v: string) => `<span class="badge ${getStatusBadgeClass(v)}">${v}</span>` },
        { key: 'createdAt', label: 'Date', render: (v: string) => new Date(v).toLocaleDateString() },
    ])}
      </div>
    `;
}
