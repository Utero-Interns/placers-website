/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateTableHTML } from '../../admin/dashboard/views/shared';

export const getDashboardOverviewHTML = (
    stats: { label: string; value: number }[],
    recentBillboards: any[]
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
    `;
};
