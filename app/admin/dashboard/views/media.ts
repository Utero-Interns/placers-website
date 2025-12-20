/* eslint-disable @typescript-eslint/no-explicit-any */
import { getImageUrl } from '../../lib/utils';
import { getFilteredAndSortedData, getPaginatedData } from './shared';

export function renderMediaGallery(dashboard: any, container: Element) {
    const filteredData = getFilteredAndSortedData(dashboard.apiData.media, dashboard.state.searchQuery, dashboard.state.filters, dashboard.state.sortColumn, dashboard.state.sortDirection);
    const paginatedData = getPaginatedData(filteredData, dashboard.state.currentPage, dashboard.state.itemsPerPage);

    container.innerHTML = `
        <div class="media-gallery-container" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div class="table-controls">
                <input type="text" class="search-input" placeholder="Search media..." value="${dashboard.state.searchQuery}">
                
                <div class="filters">
                     <select class="form-control filter-select" style="width: auto; display: inline-block;" data-key="type">
                        <option value="">All Types</option>
                        <option value="billboard" ${dashboard.state.filters['type'] === 'billboard' ? 'selected' : ''}>Billboard</option>
                         <option value="design" ${dashboard.state.filters['type'] === 'design' ? 'selected' : ''}>Design</option>
                    </select>
                </div>
            </div>

            ${paginatedData.length === 0 ? `
                <div style="text-align: center; padding: 4rem; color: var(--text-secondary); background: var(--white); border-radius: 12px; border: 1px dashed var(--border-color);">
                    <div style="margin-bottom: 1rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5;"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    </div>
                    <p>No media files found</p>
                </div>
            ` : `
                <div class="media-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem;">
                    ${paginatedData.map((item: any) => {
        const src = getImageUrl(item.url);

        return `
                        <div class="media-card" style="background: var(--white); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; transition: all 0.2s; position: relative; group;">
                            <div style="aspect-ratio: 1; overflow: hidden; background: #f8fafc; position: relative;">
                                <img src="${src}" alt="Media" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" loading="lazy" onerror="this.src='https://placehold.co/200x200?text=Error'" />
                                
                                <div class="media-overlay" style="position: absolute; inset: 0; background: rgba(0,0,0,0.0); display: flex; align-items: center; justify-content: center; opacity: 0; transition: all 0.2s;">
                                    <div style="display: flex; gap: 0.5rem;">
                                        <a href="${src}" target="_blank" class="btn-icon" style="background: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; text-decoration: none; color: var(--slate-dark); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                        </a>
                                        <button class="btn-icon action-delete-media" data-id="${item.id}" style="background: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; color: var(--primary-red); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div style="padding: 1rem;">
                                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                                    <span class="badge" style="font-size: 0.7rem; background: #e0f2fe; color: #0369a1; padding: 0.2rem 0.5rem; border-radius: 4px;">${item.type || 'Unknown'}</span>
                                </div>
                                <div style="font-size: 0.75rem; color: var(--text-secondary);">
                                    Uploaded ${new Date(item.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    `;
    }).join('')}
                </div>
            `}

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

    // Ensure style exists (using the same logic as extracted)
    if (!document.getElementById('media-gallery-styles')) {
        const style = document.createElement('style');
        style.id = 'media-gallery-styles';
        style.textContent = `
            .media-card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
            .media-card:hover .media-overlay { opacity: 1 !important; background: rgba(0,0,0,0.3) !important; }
        `;
        document.head.appendChild(style);
    }

    attachMediaGalleryListeners(dashboard, container);
}

function attachMediaGalleryListeners(dashboard: any, container: Element) {
    // Search
    const searchInput = container.querySelector('.search-input');
    searchInput?.addEventListener('input', (e: Event) => {
        dashboard.state.searchQuery = (e.target as HTMLInputElement).value;
        dashboard.state.currentPage = 1;
        renderMediaGallery(dashboard, container); // Re-render whole gallery
    });

    // Filters
    container.querySelectorAll('.filter-select').forEach(select => {
        select.addEventListener('change', (e: Event) => {
            const key = select.getAttribute('data-key');
            if (key) {
                dashboard.state.filters[key] = (e.target as HTMLSelectElement).value;
                dashboard.state.currentPage = 1;
                renderMediaGallery(dashboard, container);
            }
        });
    });

    // Pagination
    container.querySelector('.prev-page')?.addEventListener('click', () => {
        if (dashboard.state.currentPage > 1) {
            dashboard.state.currentPage--;
            renderMediaGallery(dashboard, container);
        }
    });

    container.querySelector('.next-page')?.addEventListener('click', () => {
        const filteredData = getFilteredAndSortedData(dashboard.apiData.media, dashboard.state.searchQuery, dashboard.state.filters, dashboard.state.sortColumn, dashboard.state.sortDirection);
        if (dashboard.state.currentPage * dashboard.state.itemsPerPage < filteredData.length) {
            dashboard.state.currentPage++;
            renderMediaGallery(dashboard, container);
        }
    });

    // Delete Action
    container.querySelectorAll('.action-delete-media').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = (e.currentTarget as HTMLElement).dataset.id;
            if (id) {
                dashboard.openConfirmModal(
                    'Delete Media',
                    `Are you sure you want to delete this media item?`,
                    async () => {
                        try {
                            const res = await fetch(`/api/proxy/image/${id}`, {
                                method: 'DELETE',
                                credentials: 'include'
                            });
                            if (res.ok) {
                                dashboard.apiData.media = dashboard.apiData.media.filter((m: any) => m.id !== id);
                                renderMediaGallery(dashboard, container); // Re-render
                                dashboard.showToast('Media deleted', 'success');
                                dashboard.closeModal();
                            } else {
                                const json = await res.json().catch(() => ({}));
                                dashboard.showToast(json.message || 'Failed to delete media', 'error');
                            }
                        } catch (e) {
                            console.error('Failed to delete media', e);
                            dashboard.showToast('Failed to delete media', 'error');
                        }
                    }
                );
            }
        });
    });
}
