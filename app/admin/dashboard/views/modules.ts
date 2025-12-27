import { ModuleConfig, ModuleName } from '../types';

export const getModuleControlsHTML = <T>(
    activeTab: ModuleName,
    filters: ModuleConfig<T>['filters'],
    currentFilters: Record<string, string>,
    searchQuery: string
): string => {
    return `
      <div class="table-controls">
        <input type="text" class="search-input" placeholder="Search..." value="${searchQuery}">
        <div class="filters">
          ${filters.map(f => `
            <select class="form-control filter-select" style="width: auto; display: inline-block;" data-key="${String(f.key)}">
              <option value="">All ${f.label}</option>
              ${f.options.map(o => `<option value="${o}" ${currentFilters[String(f.key)] === o ? 'selected' : ''}>${o}</option>`).join('')}
            </select>
          `).join('')}
        </div>
        ${!['Sellers', 'Billboards', 'Media', 'Transactions'].includes(activeTab) ? '<button class="btn btn-primary add-new-btn">Add New</button>' : ''}
      </div>
    `;
};

export const getPaginationHTML = (
    currentPage: number,
    itemsPerPage: number,
    totalItems: number,
    filteredItemsCount: number
): string => {
    return `
        <div class="pagination">
          <div class="pagination-info">
            Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredItemsCount)} of ${filteredItemsCount} entries
          </div>
          <div class="pagination-controls">
            <button class="btn btn-outline btn-sm prev-page" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
            <button class="btn btn-outline btn-sm next-page" ${currentPage * itemsPerPage >= filteredItemsCount ? 'disabled' : ''}>Next</button>
          </div>
        </div>
    `;
};

export const getModuleContainerHTML = (
    controlsHTML: string,
    tableHTML: string,
    paginationHTML: string
): string => {
    return `
      <div class="table-container">
        ${controlsHTML}
        ${tableHTML}
        ${paginationHTML}
      </div>
    `;
};
