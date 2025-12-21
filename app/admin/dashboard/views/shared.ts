import { ColumnConfig } from '../types';

export const generateTableHTML = <T>(
  data: T[],
  columns: ColumnConfig<T>[],
  sortColumn: string | null,
  sortDirection: 'asc' | 'desc'
): string => {
  if (data.length === 0) return '<div class="data-table-wrapper" style="padding: 2rem; text-align: center; color: var(--text-secondary);">No data found</div>';

  return `
      <div class="data-table-wrapper" style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              ${columns.map(col => `
                <th data-col="${String(col.key)}" style="cursor: pointer;">
                  ${col.label}
                  ${sortColumn === String(col.key) ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
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
};

// You can add other shared render helpers here (e.g. badges, common formatting)
export const getStatusBadgeClass = (status: string) => {
  const s = status ? status.toUpperCase() : '';
  switch (s) {
    case 'ACTIVE': return 'badge-success';
    case 'INACTIVE': return 'badge-neutral';
    case 'PENDING': return 'badge-warning';
    case 'PAID': case 'COMPLETED': return 'badge-success';
    case 'CANCELLED': case 'REJECTED': return 'badge-error';
    default: return 'badge-neutral';
  }
};
