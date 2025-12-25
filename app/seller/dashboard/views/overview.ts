/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateTableHTML, getStatusBadgeClass } from '../../../admin/dashboard/views/shared';

export const getDashboardOverviewHTML = (
    stats: { label: string; value: string | number }[],
    recentBillboards: any[],
    recentTransactions: any[]
): string => {
    return `
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
            ${generateTableHTML(recentBillboards, [
        { key: 'location', label: 'Location' },
        { key: 'status', label: 'Status' },
        { key: 'rentPrice', label: 'Price', render: (v: any) => `Rp ${v.toLocaleString()}` }
    ], null, 'asc')}
        </div>

        <div class="table-container" style="margin-top: 2rem;">
            <div class="table-controls">
                <h3>Recent Transactions</h3>
            </div>
            ${generateTableHTML(recentTransactions, [
        { key: 'id', label: 'ID' },
        { key: 'billboard', label: 'Billboard', render: (v: any) => v?.location || 'N/A' },
        { key: 'totalPrice', label: 'Amount', render: (v: number) => `Rp ${v.toLocaleString()}` },
        { key: 'status', label: 'Status', render: (v: string) => `<span class="badge ${getStatusBadgeClass(v)}">${v}</span>` },
        { key: 'createdAt', label: 'Date', render: (v: string) => new Date(v).toLocaleDateString() },
    ], null, 'asc')}
        </div>
    `;
};
