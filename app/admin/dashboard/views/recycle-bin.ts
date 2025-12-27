/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateTableHTML } from './shared';

export const getRecycleBinHTML = (data: any[]): string => {
    const columns = [
        { key: 'location', label: 'Location' },
        { key: 'deletedAt', label: 'Deleted At', render: (v: string) => new Date(v).toLocaleDateString() },
        {
            key: 'actions', label: 'Actions', render: (_v: any, row: any) => `
            <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                <button class="btn btn-sm btn-outline action-restore" data-id="${row.id}">Restore</button>
                <button class="btn btn-sm btn-danger action-purge" data-id="${row.id}">Delete Permanently</button>
            </div>
        ` }
    ];

    const tableHTML = generateTableHTML(data, columns, null, 'asc');

    return `
        <div class="table-container">
            <div class="table-controls">
                <h3 style="margin:0;">Recycle Bin</h3>
            </div>
            ${tableHTML}
        </div>
    `;
};
