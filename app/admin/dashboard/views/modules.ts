/* eslint-disable @typescript-eslint/no-explicit-any */
import { ModuleName, ModuleConfig } from '../types';
import { generateTableHTML, getFilteredAndSortedData, getPaginatedData, getStatusBadgeClass } from './shared';
// We might need specific view functions for actions if we want to decouple further, 
// but for now we call back into dashboard methods.

export function renderModule(dashboard: any, container: Element) {
    const config = getModuleConfig(dashboard);
    const filteredData = getFilteredAndSortedData(config.data, dashboard.state.searchQuery, dashboard.state.filters, dashboard.state.sortColumn, dashboard.state.sortDirection);
    const paginatedData = getPaginatedData(filteredData, dashboard.state.currentPage, dashboard.state.itemsPerPage);

    container.innerHTML = `
      <div class="table-container">
        <div class="table-controls">
          <input type="text" class="search-input" placeholder="Search..." value="${dashboard.state.searchQuery}">
          <div class="filters">
            ${config.filters.map(f => `
              <select class="form-control filter-select" style="width: auto; display: inline-block;" data-key="${String(f.key)}">
                <option value="">All ${f.label}</option>
                ${f.options.map(o => `<option value="${o}" ${dashboard.state.filters[String(f.key)] === o ? 'selected' : ''}>${o}</option>`).join('')}
              </select>
            `).join('')}
          </div>
          ${!['Sellers', 'Billboards', 'Media', 'Transactions'].includes(dashboard.state.activeTab) ? '<button class="btn btn-primary add-new-btn">Add New</button>' : ''}
        </div>
        ${generateTableHTML(paginatedData, config.columns, dashboard.state.sortColumn, dashboard.state.sortDirection)}
        <div class="pagination">
          <div class="pagination-info">
            Showing ${(dashboard.state.currentPage - 1) * dashboard.state.itemsPerPage + 1} to ${Math.min(dashboard.state.currentPage * dashboard.state.itemsPerPage, filteredData.length)} of ${filteredData.length} entries
          </div>
          <div class="pagination-controls">
            <button class="btn btn-outline btn-sm prev-page" ${dashboard.state.currentPage === 1 ? 'disabled' : ''}>Previous</button>
            <button class="btn btn-outline btn-sm next-page" ${dashboard.state.currentPage * dashboard.state.itemsPerPage >= filteredData.length ? 'disabled' : ''}>Next</button>
          </div>
        </div>
      </div>
    `;

    // Attach listeners
    const searchInput = container.querySelector('.search-input');
    searchInput?.addEventListener('input', (e: Event) => {
        dashboard.state.searchQuery = (e.target as HTMLInputElement).value;
        dashboard.state.currentPage = 1;
        updateModuleData(dashboard, container);
    });

    container.querySelectorAll('.filter-select').forEach(select => {
        select.addEventListener('change', (e: Event) => {
            const key = select.getAttribute('data-key');
            if (key) {
                dashboard.state.filters[key] = (e.target as HTMLSelectElement).value;
                dashboard.state.currentPage = 1;
                updateModuleData(dashboard, container);
            }
        });
    });

    container.querySelector('.prev-page')?.addEventListener('click', () => {
        if (dashboard.state.currentPage > 1) {
            dashboard.state.currentPage--;
            updateModuleData(dashboard, container);
        }
    });

    container.querySelector('.next-page')?.addEventListener('click', () => {
        const config = getModuleConfig(dashboard);
        const filteredData = getFilteredAndSortedData(config.data, dashboard.state.searchQuery, dashboard.state.filters, dashboard.state.sortColumn, dashboard.state.sortDirection);
        if (dashboard.state.currentPage * dashboard.state.itemsPerPage < filteredData.length) {
            dashboard.state.currentPage++;
            updateModuleData(dashboard, container);
        }
    });

    container.querySelector('.add-new-btn')?.addEventListener('click', () => {
        if (dashboard.state.activeTab === 'Categories') {
            dashboard.handleAddCategory();
        } else if (dashboard.state.activeTab === 'Add-ons') {
            dashboard.openModal('Add New Add-on');
        } else if (dashboard.state.activeTab === 'Cities') {
            dashboard.handleAddCity();
        } else {
            dashboard.openModal('Add New ' + dashboard.state.activeTab.slice(0, -1)); // Simple singularization
        }
    });

    attachTableListeners(dashboard, container);
}

export function updateModuleData(dashboard: any, container: Element) {
    const config = getModuleConfig(dashboard);
    const filteredData = getFilteredAndSortedData(config.data, dashboard.state.searchQuery, dashboard.state.filters, dashboard.state.sortColumn, dashboard.state.sortDirection);
    const paginatedData = getPaginatedData(filteredData, dashboard.state.currentPage, dashboard.state.itemsPerPage);

    // Update Table
    const tableWrapper = container.querySelector('.data-table-wrapper');
    if (tableWrapper) {
        tableWrapper.outerHTML = generateTableHTML(paginatedData, config.columns, dashboard.state.sortColumn, dashboard.state.sortDirection);
    }

    // Re-attach table listeners because table DOM was replaced
    attachTableListeners(dashboard, container);

    // Update Pagination
    const paginationInfo = container.querySelector('.pagination-info');
    if (paginationInfo) {
        paginationInfo.textContent = `Showing ${(dashboard.state.currentPage - 1) * dashboard.state.itemsPerPage + 1} to ${Math.min(dashboard.state.currentPage * dashboard.state.itemsPerPage, filteredData.length)} of ${filteredData.length} entries`;
    }

    const prevBtn = container.querySelector('.prev-page') as HTMLButtonElement;
    if (prevBtn) {
        prevBtn.disabled = dashboard.state.currentPage === 1;
    }

    const nextBtn = container.querySelector('.next-page') as HTMLButtonElement;
    if (nextBtn) {
        nextBtn.disabled = dashboard.state.currentPage * dashboard.state.itemsPerPage >= filteredData.length;
    }
}

export function attachTableListeners(dashboard: any, container: Element) {
    container.querySelectorAll('th').forEach((th: Element) => {
        th.addEventListener('click', () => {
            const col = th.getAttribute('data-col');
            if (col) {
                if (dashboard.state.sortColumn === col) {
                    dashboard.state.sortDirection = dashboard.state.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    dashboard.state.sortColumn = col;
                    dashboard.state.sortDirection = 'asc';
                }
                updateModuleData(dashboard, container);
            }
        });
    });

    // Action buttons listeners
    container.querySelectorAll('.action-view').forEach((btn: Element) => {
        btn.addEventListener('click', (e: Event) => {
            const id = (e.currentTarget as HTMLElement).dataset.id;
            if (id) {
                if (dashboard.state.activeTab === 'Users') {
                    dashboard.openViewUserModal(id);
                } else if (dashboard.state.activeTab === 'Sellers') {
                    dashboard.openViewSellerModal(id);
                } else if (dashboard.state.activeTab === 'Transactions') {
                    dashboard.openViewTransactionModal(id);
                } else if (dashboard.state.activeTab === 'Designs') {
                    dashboard.openViewDesignModal(id);
                } else if (dashboard.state.activeTab === 'Billboards') {
                    dashboard.openViewBillboardModal(id);
                } else if (dashboard.state.activeTab === 'Add-ons') {
                    dashboard.openViewAddonModal(id);
                } else {
                    dashboard.showToast(`View ${id} (Implementation pending for this module)`, 'info');
                }
            }
        });
    });

    container.querySelectorAll('.action-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = (e.currentTarget as HTMLElement).dataset.id;
            if (id) {
                if (dashboard.state.activeTab === 'Users') {
                    dashboard.openEditUserModal(id);
                } else if (dashboard.state.activeTab === 'Billboards') {
                    dashboard.openEditBillboardModal(id);
                } else if (dashboard.state.activeTab === 'Transactions') {
                    dashboard.openEditTransactionModal(id);
                } else if (dashboard.state.activeTab === 'Categories') {
                    dashboard.openEditCategoryModal(id);
                } else if (dashboard.state.activeTab === 'Designs') {
                    dashboard.openEditDesignModal(id);
                } else if (dashboard.state.activeTab === 'Add-ons') {
                    dashboard.openEditAddonModal(id);
                } else if (dashboard.state.activeTab === 'Cities') {
                    dashboard.openEditCityModal(id);
                } else {
                    dashboard.showToast(`Edit ${id} (Implementation pending)`, 'info');
                }
            }
        });
    });

    container.querySelectorAll('.action-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = (e.currentTarget as HTMLElement).dataset.id;
            if (id) {
                if (dashboard.state.activeTab === 'Users') {
                    dashboard.handleDeleteUser(id);
                } else if (dashboard.state.activeTab === 'Sellers') {
                    dashboard.handleDeleteSeller(id);
                } else if (dashboard.state.activeTab === 'Billboards') {
                    dashboard.handleDeleteBillboard(id);
                } else if (dashboard.state.activeTab === 'Transactions') {
                    dashboard.handleDeleteTransaction(id);
                } else if (dashboard.state.activeTab === 'Categories') {
                    dashboard.handleDeleteCategory(id);
                } else if (dashboard.state.activeTab === 'Designs') {
                    dashboard.handleDeleteDesign(id);
                } else if (dashboard.state.activeTab === 'Add-ons') {
                    dashboard.handleDeleteAddon(id);
                } else if (dashboard.state.activeTab === 'Cities') {
                    dashboard.handleDeleteCity(id);
                } else {
                    dashboard.openConfirmModal(
                        'Delete Item',
                        'Are you sure you want to delete this item? This action cannot be undone.',
                        async () => {
                            dashboard.showToast(`Deleted ${id} successfully`, 'success');
                            dashboard.closeModal();
                        }
                    );
                }
            }
        });
    });
}

function getModuleConfig(dashboard: any): ModuleConfig<any> {
    switch (dashboard.state.activeTab) {
        case 'Users':
            return {
                data: dashboard.apiData.users,
                columns: [
                    { key: 'username', label: 'Username' },
                    { key: 'email', label: 'Email' },
                    { key: 'phone', label: 'Phone' },
                    { key: 'level', label: 'Level', render: (v: string) => `<span class="badge badge-info">${v}</span>` },
                    { key: 'provider', label: 'Provider' },
                    { key: 'createdAt', label: 'Created', render: (v: string) => new Date(v).toLocaleDateString() },
                    {
                        key: 'actions', label: 'Actions', render: (v: any, row: any) => `
                        <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                            <button class="action-btn view action-view" data-id="${row.id}" title="View Details" 
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #e0f2fe; color: #0369a1; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                            <button class="action-btn edit action-edit" data-id="${row.id}" title="Edit User"
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fef3c7; color: #b45309; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                            </button>
                            <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete User"
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
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
                data: dashboard.apiData.sellers,
                columns: [
                    { key: 'fullname', label: 'Full Name' },
                    { key: 'companyName', label: 'Company' },
                    { key: 'ktp', label: 'KTP' },
                    { key: 'officeAddress', label: 'Office' },
                    { key: 'createdAt', label: 'Created', render: (v: string) => new Date(v).toLocaleDateString() },
                    {
                        key: 'actions', label: 'Actions', render: (v: any, row: any) => `
                        <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                            <button class="action-btn view action-view" data-id="${row.id}" title="View Details" 
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #e0f2fe; color: #0369a1; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                            <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete Seller"
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                        </div>
                    ` }
                ],
                filters: []
            };
        case 'Billboards':
            return {
                data: dashboard.apiData.billboards,
                columns: [
                    { key: 'location', label: 'Location' },
                    { key: 'cityName', label: 'City', render: (v: string, row: any) => v || row.city?.name || '-' },
                    { key: 'status', label: 'Status', render: (v: string) => `<span class="badge ${v === 'Available' ? 'badge-success' : 'badge-danger'}">${v}</span>` },
                    { key: 'mode', label: 'Mode' },
                    { key: 'size', label: 'Size' },
                    { key: 'rentPrice', label: 'Rent Price', render: (v: number) => v > 0 ? `Rp ${parseFloat(String(v)).toLocaleString()}` : '-' },
                    { key: 'sellPrice', label: 'Sell Price', render: (v: number) => v > 0 ? `Rp ${parseFloat(String(v)).toLocaleString()}` : '-' },
                    {
                        key: 'actions', label: 'Actions', render: (v: any, row: any) => `
                        <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                            <button class="action-btn view action-view" data-id="${row.id}" title="View Details" 
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #e0f2fe; color: #0369a1; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                            <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete Billboard"
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                        </div>
                    ` }
                ],
                filters: [
                    { key: 'status', label: 'Status', options: ['Available', 'NotAvailable'] },
                    { key: 'mode', label: 'Mode', options: ['Rent', 'Buy'] }
                ]
            };
        case 'Transactions':
            return {
                data: dashboard.apiData.transactions,
                columns: [
                    { key: 'id', label: 'ID' },
                    { key: 'user', label: 'Buyer', render: (v: any) => v?.username || 'Unknown' },
                    { key: 'billboard', label: 'Billboard', render: (v: any) => v?.location || 'Unknown Location' },
                    { key: 'totalPrice', label: 'Amount', render: (v: number) => `Rp ${v ? v.toLocaleString() : '0'}` },
                    { key: 'status', label: 'Status', render: (v: string) => `<span class="badge ${getStatusBadgeClass(v)}">${v}</span>` },
                    { key: 'createdAt', label: 'Date', render: (v: string) => v ? new Date(v).toLocaleDateString() : '-' },
                    {
                        key: 'actions', label: 'Actions', render: (v: any, row: any) => `
                        <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                            <button class="action-btn view action-view" data-id="${row.id}" title="View Details" 
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #e0f2fe; color: #0369a1; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                            <button class="action-btn edit action-edit" data-id="${row.id}" title="Update Status"
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fef3c7; color: #b45309; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                            </button>
                            <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete Transaction"
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                        </div>
                    ` }
                ],
                filters: [
                    { key: 'status', label: 'Status', options: ['PENDING', 'PAID', 'COMPLETED', 'CANCELLED', 'REJECTED'] }
                ]
            };
        case 'Categories':
            return {
                data: dashboard.apiData.categories,
                columns: [
                    { key: 'name', label: 'Name' },
                    { key: 'createdAt', label: 'Created', render: (v: string) => new Date(v).toLocaleDateString() },
                    {
                        key: 'actions', label: 'Actions', render: (v: any, row: any) => `
                        <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                            <button class="action-btn edit action-edit" data-id="${row.id}" title="Edit Category"
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fef3c7; color: #b45309; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                            </button>
                            <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete Category"
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                        </div>
                    ` }
                ],
                filters: []
            };
        case 'Designs':
            return {
                data: dashboard.apiData.designs,
                columns: [
                    { key: 'name', label: 'Name' },
                    { key: 'description', label: 'Description' },
                    { key: 'price', label: 'Price', render: (v: number) => `Rp ${v.toLocaleString()}` },
                    { key: 'createdAt', label: 'Created', render: (v: string) => new Date(v).toLocaleDateString() },
                    {
                        key: 'actions', label: 'Actions', render: (v: any, row: any) => `
                        <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                            <button class="action-btn view action-view" data-id="${row.id}" title="View Details" 
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #e0f2fe; color: #0369a1; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                            <button class="action-btn edit action-edit" data-id="${row.id}" title="Edit Design"
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fef3c7; color: #b45309; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                            </button>
                            <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete Design"
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                        </div>
                    ` }
                ],
                filters: []
            };
        case 'Add-ons':
            return {
                data: dashboard.apiData.addons,
                columns: [
                    { key: 'name', label: 'Name' },
                    { key: 'description', label: 'Description' },
                    { key: 'price', label: 'Price', render: (v: number) => `Rp ${v.toLocaleString()}` },
                    { key: 'createdAt', label: 'Created', render: (v: string) => new Date(v).toLocaleDateString() },
                    {
                        key: 'actions', label: 'Actions', render: (v: any, row: any) => `
                        <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                            <button class="action-btn view action-view" data-id="${row.id}" title="View Details" 
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #e0f2fe; color: #0369a1; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                            <button class="action-btn edit action-edit" data-id="${row.id}" title="Edit Add-on"
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fef3c7; color: #b45309; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                            </button>
                            <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete Add-on"
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                        </div>
                    ` }
                ],
                filters: []
            };

        case 'Cities':
            return {
                data: dashboard.apiData.cities,
                columns: [
                    { key: 'name', label: 'Name' },
                    { key: 'provinceId', label: 'Province ID' }, // Simplified default since city fetch fix is pending or specific
                    { key: 'createdAt', label: 'Created', render: (v: string) => new Date(v).toLocaleDateString() },
                    {
                        key: 'actions', label: 'Actions', render: (v: any, row: any) => `
                        <div class="action-buttons" style="display: flex; gap: 0.5rem;">
                            <button class="action-btn edit action-edit" data-id="${row.id}" title="Edit City"
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fef3c7; color: #b45309; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                            </button>
                            <button class="action-btn delete action-delete" data-id="${row.id}" title="Delete City"
                                style="width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background-color: #fee2e2; color: #b91c1c; cursor: pointer; transition: all 0.2s;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                        </div>
                    ` }
                ],
                filters: []
            };
        case 'Media':
            // Media has its own renderer but module config might be used for consistency?
            // Actually renderModule switches to renderMediaGallery for Media tab in core.ts
            // But we included Media logic here for completeness if fallback is needed,
            // though renderContent calls renderMediaGallery directly.
            // We can leave empty or default.
            return { data: [], columns: [], filters: [] };
        default:
            return { data: [], columns: [], filters: [] };
    }
}
