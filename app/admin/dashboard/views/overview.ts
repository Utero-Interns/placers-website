export interface StatItem {
    label: string;
    value: string | number;
    change: string;
}

export const getDashboardOverviewHTML = (stats: StatItem[], recentTransactionsHTML: string): string => {
    return `
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
        ${recentTransactionsHTML}
      </div>
    `;
};
