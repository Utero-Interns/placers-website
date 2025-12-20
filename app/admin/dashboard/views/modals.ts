/* eslint-disable @typescript-eslint/no-explicit-any */
import { getImageUrl } from '../../lib/utils';
import { getStatusBadgeClass } from './shared';

// --- Helper: Searchable Dropdown ---
export function setupSearchableDropdown(
    container: HTMLElement,
    items: any[],
    placeholder: string,
    onSelect: (id: string) => void
) {
    // Implementation placeholder - to be refined if needed, or simple select
    // For now using a simple implementation compatible with standard HTML structure
    // If complex logic is needed, we can expand.
    // Assuming container is empty.
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control';
    input.placeholder = placeholder;
    input.style.width = '100%';

    const list = document.createElement('ul');
    list.className = 'dropdown-menu'; // Boostrap-like or custom
    list.style.position = 'absolute';
    list.style.top = '100%';
    list.style.left = '0';
    list.style.right = '0';
    list.style.maxHeight = '200px';
    list.style.overflowY = 'auto';
    list.style.display = 'none';
    list.style.zIndex = '1000';
    list.style.backgroundColor = 'white';
    list.style.border = '1px solid #ddd';
    list.style.listStyle = 'none';
    list.style.padding = '0';
    list.style.margin = '0';

    const renderList = (filter: string) => {
        list.innerHTML = '';
        const filtered = items.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()));
        if (filtered.length === 0) {
            const li = document.createElement('li');
            li.style.padding = '8px';
            li.style.color = '#999';
            li.textContent = 'No results found';
            list.appendChild(li);
        } else {
            filtered.forEach(item => {
                const li = document.createElement('li');
                li.style.padding = '8px';
                li.style.cursor = 'pointer';
                li.textContent = item.name;
                li.addEventListener('mouseenter', () => li.style.backgroundColor = '#f1f1f1');
                li.addEventListener('mouseleave', () => li.style.backgroundColor = 'white');
                li.addEventListener('click', () => {
                    input.value = item.name;
                    onSelect(item.id);
                    list.style.display = 'none';
                });
                list.appendChild(li);
            });
        }
    };

    input.addEventListener('focus', () => {
        renderList('');
        list.style.display = 'block';
    });

    input.addEventListener('input', () => {
        renderList(input.value);
        list.style.display = 'block';
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target as Node)) {
            list.style.display = 'none';
        }
    });

    wrapper.appendChild(input);
    wrapper.appendChild(list);
    container.appendChild(wrapper);
}

// --- Helper for Confirm Modal ---
export function openConfirmModal(dashboard: any, title: string, message: string, onConfirm: () => Promise<void> | void) {
    dashboard.openModal(title);
    const body = dashboard.root.querySelector('.modal-body');
    if (body) {
        body.innerHTML = `<p class="confirm-message">${message}</p>`;
    }
    dashboard.currentModalAction = async () => {
        const btn = dashboard.root.querySelector('.confirm-modal') as HTMLButtonElement;
        const originalText = btn.textContent;
        btn.textContent = 'Processing...';
        btn.disabled = true;
        try {
            await onConfirm();
        } catch (e) {
            console.error(e);
            dashboard.showToast('Error processing request', 'error');
        } finally {
            if (btn) {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        }
    };
}

// --- USER MODALS ---

export function handleAddUser(dashboard: any) {
    dashboard.openModal('Add New User');
    const body = dashboard.root.querySelector('.modal-body');
    if (body) {
        body.innerHTML = renderAddUserForm();
        // Setup password toggles
        body.querySelectorAll('.toggle-password').forEach((btn: Element) => {
            btn.addEventListener('click', (e: Event) => {
                const targetId = (e.currentTarget as HTMLElement).dataset.target;
                if (targetId) {
                    const input = body.querySelector(`#${targetId}`) as HTMLInputElement;
                    if (input) {
                        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                        input.setAttribute('type', type);
                    }
                }
            });
        });
    }
    dashboard.currentModalAction = async () => handleAddUserSubmit(dashboard);
}

function renderAddUserForm() {
    return `
        <form id="add-user-form">
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label" for="username">Username <span style="color:red">*</span></label>
                    <input type="text" id="username" name="username" class="form-control" placeholder="johndoe" required />
                </div>
                <div class="form-group">
                    <label class="form-label" for="email">Email <span style="color:red">*</span></label>
                    <input type="email" id="email" name="email" class="form-control" placeholder="john@example.com" required />
                </div>
            </div>
            <div class="form-group">
                <label class="form-label" for="phone">Phone <span style="color:red">*</span></label>
                <input type="tel" id="phone" name="phone" class="form-control" placeholder="08123456789" required />
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label" for="password">Password <span style="color:red">*</span></label>
                    <div style="position: relative;">
                        <input type="password" id="password" name="password" class="form-control" placeholder="******" required style="padding-right: 2.5rem;" />
                        <button type="button" class="toggle-password" data-target="password" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-secondary);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="confirmPassword">Confirm Password <span style="color:red">*</span></label>
                    <div style="position: relative;">
                        <input type="password" id="confirmPassword" name="confirmPassword" class="form-control" placeholder="******" required style="padding-right: 2.5rem;" />
                        <button type="button" class="toggle-password" data-target="confirmPassword" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-secondary);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label" for="level">Level <span style="color:red">*</span></label>
                <select id="level" name="level" class="form-control" required>
                    <option value="" disabled selected>Select User Level</option>
                    <option value="BUYER">BUYER</option>
                    <option value="SELLER">SELLER</option>
                    <option value="ADMIN">ADMIN</option>
                </select>
            </div>
        </form>
    `;
}

export async function handleAddUserSubmit(dashboard: any) {
    const form = dashboard.root.querySelector('#add-user-form') as HTMLFormElement;
    if (!form) return;

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);
    const data: any = Object.fromEntries(formData.entries());

    if (data.password !== data.confirmPassword) {
        dashboard.showToast("Passwords do not match", 'error');
        const confirmInput = form.querySelector('#confirmPassword') as HTMLInputElement;
        if (confirmInput) {
            confirmInput.focus();
            confirmInput.style.borderColor = 'var(--primary-red)';
        }
        return;
    }

    const btn = dashboard.root.querySelector('.confirm-modal') as HTMLButtonElement;
    btn.textContent = 'Saving...'; btn.disabled = true;

    try {
        const res = await fetch('/api/proxy/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const json = await res.json();
        if (json.status) {
            dashboard.showToast('User created successfully', 'success');
            dashboard.closeModal();
            await dashboard.fetchUsers();
            if (dashboard.state.activeTab === 'Users') dashboard.updateCurrentModule();
        } else {
            dashboard.showToast(json.message || 'Failed to create user', 'error');
        }
    } catch (e) {
        console.error(e);
        dashboard.showToast('Error creating user', 'error');
    } finally {
        if (btn) {
            btn.textContent = 'Save';
            btn.disabled = false;
        }
    }
}

export function openViewUserModal(dashboard: any, id: string) {
    const user = dashboard.apiData.users.find((u: any) => u.id === id);
    if (!user) return;
    dashboard.openModal('User Details');
    const body = dashboard.root.querySelector('.modal-body');
    const confirmBtn = dashboard.root.querySelector('.confirm-modal') as HTMLButtonElement;
    if (body) body.innerHTML = renderViewUserDetails(user);
    if (confirmBtn) confirmBtn.style.display = 'none';
}

function renderViewUserDetails(user: any) {
    return `
        <div class="user-details-card" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
                 <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    ${user.profilePicture
            ? `<img src="${getImageUrl(user.profilePicture)}" alt="${user.username}" style="width: 100%; height: 100%; object-fit: cover;" />`
            : `<span style="font-size: 1.5rem; font-weight: 600; color: var(--text-secondary);">${user.username.charAt(0).toUpperCase()}</span>`
        }
                </div>
                <div>
                    <h4 style="margin: 0; font-size: 1.25rem;">${user.username}</h4>
                    <span class="badge badge-info" style="margin-top: 0.25rem;">${user.level}</span>
                </div>
            </div>
            <div class="details-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="detail-item"><label>Email</label><div>${user.email || '-'}</div></div>
                <div class="detail-item"><label>Phone</label><div>${user.phone || '-'}</div></div>
                <div class="detail-item"><label>Provider</label><div>${user.provider || 'CREDENTIALS'}</div></div>
                <div class="detail-item"><label>Created At</label><div>${new Date(user.createdAt).toLocaleDateString()}</div></div>
            </div>
        </div>
    `;
}

export function openEditUserModal(dashboard: any, id: string) {
    const user = dashboard.apiData.users.find((u: any) => u.id === id);
    if (!user) return;
    dashboard.openModal('Edit User');
    const body = dashboard.root.querySelector('.modal-body');
    if (body) {
        body.innerHTML = `
        <form id="edit-user-form">
            <div class="form-grid">
                <div class="form-group"><label>Username</label><input type="text" id="username" name="username" class="form-control" value="${user.username}" required /></div>
                <div class="form-group"><label>Email</label><input type="email" id="email" name="email" class="form-control" value="${user.email}" required /></div>
            </div>
            <div class="form-group"><label>Phone</label><input type="tel" id="phone" name="phone" class="form-control" value="${user.phone}" required /></div>
            <div style="margin: 1rem 0; padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
                 <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem;">Leave password blank to keep unchanged</p>
                 <div class="form-grid">
                    <div class="form-group">
                        <label>New Password</label>
                        <div style="position: relative;">
                            <input type="password" id="password" name="password" class="form-control" placeholder="******" style="padding-right: 2.5rem;" />
                             <button type="button" class="toggle-password" data-target="password" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-secondary);">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                        </div>
                    </div>
                 </div>
            </div>
            <div class="form-group">
                <label>Level</label>
                <select id="level" name="level" class="form-control" required>
                    <option value="BUYER" ${user.level === 'BUYER' ? 'selected' : ''}>BUYER</option>
                    <option value="SELLER" ${user.level === 'SELLER' ? 'selected' : ''}>SELLER</option>
                    <option value="ADMIN" ${user.level === 'ADMIN' ? 'selected' : ''}>ADMIN</option>
                </select>
            </div>
        </form>
        `;
        body.querySelectorAll('.toggle-password').forEach((btn: Element) => {
            btn.addEventListener('click', (e: Event) => {
                const targetId = (e.currentTarget as HTMLElement).dataset.target;
                if (targetId) {
                    const input = body.querySelector(`#${targetId}`) as HTMLInputElement;
                    if (input) input.setAttribute('type', input.getAttribute('type') === 'password' ? 'text' : 'password');
                }
            });
        });
    }
    dashboard.currentModalAction = async () => {
        const form = dashboard.root.querySelector('#edit-user-form') as HTMLFormElement;
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const data: any = Object.fromEntries(new FormData(form).entries());
        if (!data.password) delete data.password;

        const btn = dashboard.root.querySelector('.confirm-modal') as HTMLButtonElement;
        btn.textContent = 'Updating...'; btn.disabled = true;
        try {
            const res = await fetch(`/api/proxy/user/id/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            if (json.status) {
                dashboard.showToast('User updated', 'success');
                dashboard.closeModal();
                await dashboard.fetchUsers();
                if (dashboard.state.activeTab === 'Users') dashboard.updateCurrentModule();
            } else dashboard.showToast(json.message, 'error');
        } catch (e) { dashboard.showToast('Error', 'error'); }
        finally { btn.textContent = 'Save'; btn.disabled = false; }
    };
}

export function handleDeleteUser(dashboard: any, id: string) {
    if (dashboard.apiData.currentUser && dashboard.apiData.currentUser.id === id) {
        dashboard.showToast('Cannot delete your own account', 'error'); return;
    }
    openConfirmModal(dashboard, 'Delete User', 'Cannot be undone.', async () => {
        try {
            const res = await fetch(`/api/proxy/user/${id}`, { method: 'DELETE' });
            const json = await res.json();
            if (json.status) {
                dashboard.showToast('User deleted', 'success');
                dashboard.closeModal();
                await dashboard.fetchUsers();
                if (dashboard.state.activeTab === 'Users') dashboard.updateCurrentModule();
            } else dashboard.showToast(json.message, 'error');
        } catch (e) { dashboard.showToast('Error', 'error'); }
    });
}

// --- SELLER MODALS ---

export function openViewSellerModal(dashboard: any, id: string) {
    dashboard.openModal('Loading Seller Details...');
    const body = dashboard.root.querySelector('.modal-body');
    if (body) body.innerHTML = '<div class="loading-spinner">Loading...</div>';

    const confirmBtn = dashboard.root.querySelector('.confirm-modal') as HTMLButtonElement;
    if (confirmBtn) confirmBtn.style.display = 'none';

    fetch(`/api/proxy/seller/detail/${id}`)
        .then(res => res.json())
        .then(json => {
            if (json.status && json.data) {
                const titleEl = dashboard.root.querySelector('.modal-title');
                if (titleEl) titleEl.textContent = 'Seller Details';

                if (body) {
                    body.innerHTML = renderViewSellerDetails(json.data);
                }
            } else {
                dashboard.showToast('Failed to load seller details', 'error');
                dashboard.closeModal();
            }
        })
        .catch(e => {
            console.error(e);
            dashboard.showToast('Error loading details', 'error');
            dashboard.closeModal();
        });
}

function renderViewSellerDetails(seller: any) {
    return `
        <div class="user-details-card" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
                 <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    ${seller.photo
            ? `<img src="${getImageUrl(seller.photo)}" alt="${seller.fullname}" style="width: 100%; height: 100%; object-fit: cover;" />`
            : `<span style="font-size: 1.5rem; font-weight: 600; color: var(--text-secondary);">${seller.fullname ? seller.fullname.charAt(0).toUpperCase() : '?'}</span>`
        }
                </div>
                <div>
                    <h4 style="margin: 0; font-size: 1.25rem;">${seller.fullname}</h4>
                    <span class="badge badge-info" style="margin-top: 0.25rem;">SELLER</span>
                </div>
            </div>
            
            <div class="details-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="detail-item">
                    <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">NIK</label>
                    <div style="font-weight: 500;">${seller.nik || '-'}</div>
                </div>
                 <div class="detail-item">
                    <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">KTP</label>
                    <div style="font-weight: 500;">${seller.ktp || '-'}</div>
                </div>
                <div class="detail-item">
                    <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Company Name</label>
                    <div style="font-weight: 500;">${seller.companyName || '-'}</div>
                </div>
                 <div class="detail-item">
                    <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Company Email</label>
                    <div style="font-weight: 500;">${seller.companyEmail || '-'}</div>
                </div>
                <div class="detail-item" style="grid-column: span 2;">
                    <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Office Address</label>
                    <div style="font-weight: 500;">${seller.officeAddress || '-'}</div>
                </div>
                 <div class="detail-item">
                    <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">User ID</label>
                    <div style="font-weight: 500;">${seller.userId || '-'}</div>
                </div>
                 <div class="detail-item">
                    <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Created At</label>
                    <div style="font-weight: 500;">${seller.createdAt ? new Date(seller.createdAt).toLocaleDateString() : '-'}</div>
                </div>
            </div>
        </div>
    `;
}

export function handleDeleteSeller(dashboard: any, id: string) {
    openConfirmModal(dashboard,
        'Delete Seller',
        'Are you sure you want to delete this seller? This action cannot be undone.',
        async () => {
            try {
                const res = await fetch(`/api/proxy/seller/${id}`, {
                    method: 'DELETE'
                });

                const json = await res.json();

                if (json.status) {
                    dashboard.showToast('Seller deleted successfully', 'success');
                    dashboard.closeModal();
                    await dashboard.fetchSellers();
                    if (dashboard.state.activeTab === 'Sellers') {
                        const container = dashboard.root.querySelector('#content-area');
                        if (container) dashboard.updateModuleData(container);
                    }
                } else {
                    dashboard.showToast(json.message || 'Failed to delete seller', 'error');
                }
            } catch (e) {
                console.error('Error deleting seller:', e);
                dashboard.showToast('An error occurred while deleting the seller', 'error');
            }
        }
    );
}

// --- DESIGN MODALS ---

export function handleDeleteDesign(dashboard: any, id: string) {
    openConfirmModal(dashboard,
        'Delete Design',
        'Are you sure you want to delete this design? This action cannot be undone.',
        async () => {
            try {
                const res = await fetch(`/api/proxy/design/${id}`, {
                    method: 'DELETE'
                });

                const json = await res.json();

                if (json.status) {
                    dashboard.showToast('Design deleted successfully', 'success');
                    dashboard.closeModal();
                    await dashboard.fetchDesigns();
                    if (dashboard.state.activeTab === 'Designs') {
                        const container = dashboard.root.querySelector('#content-area');
                        if (container) dashboard.updateModuleData(container);
                    }
                } else {
                    dashboard.showToast(json.message || 'Failed to delete design', 'error');
                }
            } catch (e) {
                console.error('Error deleting design:', e);
                dashboard.showToast('An error occurred while deleting the design', 'error');
            }
        }
    );
}

export function openViewDesignModal(dashboard: any, id: string) {
    dashboard.openModal('Loading Design Details...');
    const modal = dashboard.root.querySelector('.modal') as HTMLElement;
    if (modal) modal.style.maxWidth = '800px';

    const body = dashboard.root.querySelector('.modal-body');
    if (body) body.innerHTML = '<div class="loading-spinner">Loading...</div>';

    const confirmBtn = dashboard.root.querySelector('.confirm-modal') as HTMLButtonElement;
    if (confirmBtn) confirmBtn.style.display = 'none';

    fetch(`/api/proxy/design/${id}`)
        .then(res => res.json())
        .then(json => {
            if (json.status && json.data) {
                const titleEl = dashboard.root.querySelector('.modal-title');
                if (titleEl) titleEl.textContent = json.data.name || 'Design Details';

                if (body) {
                    body.innerHTML = renderViewDesignDetails(json.data);
                    setupDesignCarousel(body, json.data);
                }
            } else {
                dashboard.showToast('Failed to load design details', 'error');
                dashboard.closeModal();
            }
        })
        .catch(e => {
            console.error(e);
            dashboard.showToast('Error loading details', 'error');
            dashboard.closeModal();
        });
}

function renderViewDesignDetails(design: any) {
    let images: string[] = [];
    if (Array.isArray(design.image)) {
        images = design.image.map((img: any) => img.url || '');
    } else if (Array.isArray(design.images)) {
        images = design.images;
    }

    const mainImage = images.length > 0 ? images[0] : null;

    return `
        <div class="design-details-container" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <!-- Image Carousel Section -->
            <div class="design-carousel" style="background: var(--white); border-radius: 12px; overflow: hidden; border: 1px solid var(--border-color);">
                <div class="main-image-container" style="width: 100%; height: 400px; background: #f8fafc; display: flex; align-items: center; justify-content: center; position: relative;">
                    ${mainImage
            ? `<img id="carousel-main-image" src="${getImageUrl(mainImage)}" alt="${design.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />`
            : `<div style="color: var(--text-secondary); display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5;"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                            <span>No Image Available</span>
                           </div>`
        }
                </div>
                ${images.length > 1 ? `
                    <div class="thumbnail-track" style="display: flex; gap: 0.75rem; padding: 1rem; overflow-x: auto; background: var(--white); border-top: 1px solid var(--border-color);">
                        ${images.map((img, index) => `
                            <div class="carousel-thumbnail ${index === 0 ? 'active' : ''}" data-src="${getImageUrl(img)}" data-index="${index}" 
                                 style="width: 80px; height: 80px; border-radius: 8px; overflow: hidden; cursor: pointer; border: 2px solid ${index === 0 ? 'var(--primary-red)' : 'transparent'}; flex-shrink: 0; transition: all 0.2s;">
                                <img src="${getImageUrl(img)}" style="width: 100%; height: 100%; object-fit: cover;" />
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>

            <!-- Info Section -->
            <div style="background: var(--white); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <div>
                        <h3 style="margin: 0; font-size: 1.5rem; color: var(--slate-dark);">${design.name}</h3>
                        <div style="margin-top: 0.5rem; font-size: 1.25rem; font-weight: 700; color: var(--primary-red);">
                            Rp ${Number(design.price).toLocaleString()}
                        </div>
                    </div>
                    <span class="badge badge-success" style="font-size: 0.875rem;">Active</span>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem;">Description</label>
                    <p style="margin: 0; color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem;">
                        ${design.description || 'No description provided.'}
                    </p>
                </div>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                     <div>
                        <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Created At</label>
                        <div style="font-weight: 500;">${new Date(design.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                        <label style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Last Updated</label>
                        <div style="font-weight: 500;">${new Date(design.updatedAt).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function setupDesignCarousel(container: Element, design: any) {
    const thumbnails = container.querySelectorAll('.carousel-thumbnail');
    const mainImage = container.querySelector('#carousel-main-image') as HTMLImageElement;

    if (!mainImage || thumbnails.length === 0) return;

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbnails.forEach(t => {
                (t as HTMLElement).style.borderColor = 'transparent';
                t.classList.remove('active');
            });
            (thumb as HTMLElement).style.borderColor = 'var(--primary-red)';
            thumb.classList.add('active');

            const src = (thumb as HTMLElement).dataset.src;
            if (src) {
                mainImage.style.opacity = '0.5';
                setTimeout(() => {
                    mainImage.src = src;
                    mainImage.style.opacity = '1';
                }, 150);
            }
        });
    });
}

// Add Design
export function handleAddDesign(dashboard: any) {
    dashboard.openModal('Add New Design');
    const body = dashboard.root.querySelector('.modal-body');
    if (body) {
        body.innerHTML = renderAddDesignForm();
        setupAddDesignForm(dashboard, body);
    }
    dashboard.currentModalAction = async () => handleAddDesignSubmit(dashboard);
}

function renderAddDesignForm() {
    return `
        <form id="add-design-form">
            <div class="form-group">
                <label class="form-label" for="name">Design Name <span style="color:red">*</span></label>
                <input type="text" id="name" name="name" class="form-control" placeholder="e.g. Modern Minimalist Banner" required />
            </div>
            <div class="form-group">
                <label class="form-label" for="description">Description <span style="color:red">*</span></label>
                <textarea id="description" name="description" class="form-control" rows="4" placeholder="Describe the design details..." required></textarea>
            </div>
            <div class="form-group">
                <label class="form-label" for="price">Price (Rp) <span style="color:red">*</span></label>
                <input type="number" id="price" name="price" class="form-control" placeholder="0" required />
            </div>
            <div class="form-group">
                <label class="form-label">Images <span style="color:red">*</span></label>
                <div class="upload-zone" id="upload-zone">
                    <input type="file" id="images" name="images" multiple accept="image/*" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;" />
                    <div class="upload-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
                    </div>
                    <div class="upload-text">Click or drag images here</div>
                    <div class="upload-subtext">Supports JPG, PNG (Max 5MB)</div>
                </div>
            </div>
            <div id="file-preview" class="file-preview" style="margin-top: 1rem;"></div>
        </form>
    `;
}

function setupAddDesignForm(dashboard: any, container: Element) {
    const dropZone = container.querySelector('#upload-zone');
    const fileInput = container.querySelector('#images') as HTMLInputElement;
    const preview = container.querySelector('#file-preview');

    if (!dropZone || !fileInput || !preview) return;

    dashboard.selectedDesignFiles = [];
    updateFilePreview(dashboard, preview);

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('dragover');
        }, false);
    });

    dropZone.addEventListener('drop', (e: any) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFilesSelection(dashboard, files, preview);
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files) {
            handleFilesSelection(dashboard, fileInput.files, preview);
            fileInput.value = '';
        }
    });
}

function handleFilesSelection(dashboard: any, fileList: FileList, previewElement: Element) {
    const newFiles = Array.from(fileList);
    for (const file of newFiles) {
        if (dashboard.selectedDesignFiles.length >= 10) {
            dashboard.showToast('Max 10 images allowed', 'error');
            break;
        }
        if (file.size > 5 * 1024 * 1024) {
            dashboard.showToast('File too large (max 5MB)', 'error');
            continue;
        }
        dashboard.selectedDesignFiles.push(file);
    }
    updateFilePreview(dashboard, previewElement);
}

function updateFilePreview(dashboard: any, previewElement: Element) {
    previewElement.innerHTML = '';
    if (dashboard.selectedDesignFiles.length === 0) return;

    const list = document.createElement('div');
    list.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 1rem;';

    dashboard.selectedDesignFiles.forEach((file: File, index: number) => {
        const url = URL.createObjectURL(file);
        const item = document.createElement('div');
        item.style.cssText = 'position: relative; border: 1px solid var(--border-color); border-radius: 4px; padding: 0.5rem;';

        item.innerHTML = `
            <div style="aspect-ratio: 1; border-radius: 4px; overflow: hidden; background: #f1f5f9; margin-bottom: 0.5rem;">
                <img src="${url}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div style="font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${file.name}</div>
            <button type="button" class="btn-remove-file" data-index="${index}" style="position: absolute; top: -8px; right: -8px; background: white; border: 1px solid var(--border-color); color: #ef4444; cursor: pointer; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
        `;
        list.appendChild(item);
    });

    previewElement.appendChild(list);

    previewElement.querySelectorAll('.btn-remove-file').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt((e.currentTarget as HTMLElement).dataset.index || '-1');
            if (idx > -1) {
                dashboard.selectedDesignFiles.splice(idx, 1);
                updateFilePreview(dashboard, previewElement);
            }
        });
    });
}

async function handleAddDesignSubmit(dashboard: any) {
    const form = dashboard.root.querySelector('#add-design-form') as HTMLFormElement;
    if (!form) return;
    if (!form.checkValidity()) { form.reportValidity(); return; }

    if (!dashboard.selectedDesignFiles || dashboard.selectedDesignFiles.length === 0) {
        dashboard.showToast('Please upload at least one image', 'error');
        return;
    }

    const formData = new FormData(form);
    formData.delete('images');
    dashboard.selectedDesignFiles.forEach((file: File) => {
        formData.append('images', file);
    });

    const btn = dashboard.root.querySelector('.confirm-modal') as HTMLButtonElement;
    const originalText = btn.textContent;
    btn.textContent = 'Saving...'; btn.disabled = true;

    try {
        const res = await fetch('/api/proxy/design', {
            method: 'POST',
            body: formData
        });
        const json = await res.json();
        if (json.status) {
            dashboard.showToast('Design created successfully', 'success');
            dashboard.closeModal();
            await dashboard.fetchDesigns();
            if (dashboard.state.activeTab === 'Designs') {
                const container = dashboard.root.querySelector('#content-area');
                if (container) dashboard.updateModuleData(container);
            }
        } else {
            dashboard.showToast(json.message || 'Failed to create design', 'error');
        }
    } catch (e) {
        console.error(e);
        dashboard.showToast('Error creating design', 'error');
    } finally {
        if (btn) {
            btn.textContent = 'Save';
            btn.disabled = false;
        }
    }
}

// Edit Design
export function openEditDesignModal(dashboard: any, id: string) {
    const design = (dashboard.apiData.designs || []).find((d: any) => d.id === id);
    if (!design) {
        dashboard.showToast('Design not found', 'error');
        return;
    }

    dashboard.openModal('Edit Design');
    const body = dashboard.root.querySelector('.modal-body');

    if (body) {
        body.innerHTML = renderEditDesignForm(design);
        const initialImages = Array.isArray(design.images) ? design.images : (Array.isArray(design.image) ? design.image : []);
        setupEditDesignForm(body, initialImages);
    }

    dashboard.currentModalAction = () => handleEditDesignSubmit(dashboard, id);
}

function renderEditDesignForm(design: any) {
    return `
        <form id="edit-design-form">
            <style>
                .image-manager-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 1rem; margin-top: 0.5rem; }
                .image-item { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color); background: #f8fafc; }
                .image-item img { width: 100%; height: 100%; object-fit: cover; }
                .image-item .remove-btn { position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; border-radius: 50%; background: rgba(239, 68, 68, 0.9); border: none; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s; }
                .image-item .remove-btn:hover { transform: scale(1.1); }
                .add-image-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px dashed var(--border-color); border-radius: 8px; cursor: pointer; transition: all 0.2s; color: var(--text-secondary); aspect-ratio: 1; }
                .add-image-btn:hover { border-color: var(--primary-color); background: #eff6ff; color: var(--primary-color); }
            </style>
            <div class="form-group">
                <label class="form-label" for="name">Name <span style="color:red">*</span></label>
                <input type="text" id="name" name="name" class="form-control" value="${design.name}" required />
            </div>
            <div class="form-group">
                <label class="form-label" for="description">Description <span style="color:red">*</span></label>
                <textarea id="description" name="description" class="form-control" rows="3" required>${design.description}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label" for="price">Price (Rp) <span style="color:red">*</span></label>
                <input type="number" id="price" name="price" class="form-control" value="${design.price}" required />
            </div>
            
            <div class="form-group">
                <label class="form-label">Images</label>
                <div id="image-manager-container" class="image-manager-grid">
                    <label class="add-image-btn" for="new-image-input">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        <span style="font-size: 0.75rem; margin-top: 0.25rem;">Add</span>
                    </label>
                </div>
                <input type="file" id="new-image-input" multiple accept="image/*" style="display: none;" />
            </div>
        </form>
    `;
}

function setupEditDesignForm(container: Element, initialImages: any[]) {
    let currentImages: (string | File)[] = [];
    if (Array.isArray(initialImages)) {
        currentImages = initialImages.map(img => img.url || img);
    }

    const grid = container.querySelector('#image-manager-container');
    const addButton = container.querySelector('.add-image-btn');
    const input = container.querySelector('#new-image-input') as HTMLInputElement;

    const renderGrid = () => {
        const items = grid?.querySelectorAll('.image-item');
        items?.forEach(el => el.remove());

        currentImages.forEach((img, index) => {
            const div = document.createElement('div');
            div.className = 'image-item';
            const src = img instanceof File ? URL.createObjectURL(img) : getImageUrl(img);

            div.innerHTML = `
                <img src="${src}" />
                <button type="button" class="remove-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            `;

            div.querySelector('.remove-btn')?.addEventListener('click', () => {
                currentImages.splice(index, 1);
                renderGrid();
            });

            if (addButton) {
                grid?.insertBefore(div, addButton);
            }
        });

        const form = container.querySelector('#edit-design-form') as any;
        if (form) form.__currentImages = currentImages;
    };

    input?.addEventListener('change', () => {
        if (input.files && input.files.length > 0) {
            Array.from(input.files).forEach(file => {
                currentImages.push(file);
            });
            renderGrid();
            input.value = '';
        }
    });

    renderGrid();
}

async function handleEditDesignSubmit(dashboard: any, id: string) {
    const form = dashboard.root.querySelector('#edit-design-form') as any;
    if (!form) return;
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const btn = dashboard.root.querySelector('.confirm-modal') as HTMLButtonElement;
    const originalText = btn.textContent;
    btn.textContent = 'Processing Images...'; btn.disabled = true;

    try {
        const formData = new FormData();
        formData.append('name', form.querySelector('#name').value);
        formData.append('description', form.querySelector('#description').value);
        formData.append('price', String(Number(form.querySelector('#price').value)));

        const currentImages: (string | File)[] = form.__currentImages || [];

        const imagePromises = currentImages.map(async (img, index) => {
            if (img instanceof File) {
                return img;
            } else {
                try {
                    const url = getImageUrl(img);
                    const response = await fetch(url);
                    const blob = await response.blob();
                    const mimeType = blob.type || 'image/jpeg';
                    const ext = mimeType.split('/')[1] || 'jpg';
                    const filename = `existing-image-${index}.${ext}`;
                    return new File([blob], filename, { type: mimeType });
                } catch (err) {
                    console.error('Failed to rehydrate image:', img, err);
                    return null;
                }
            }
        });

        const files = await Promise.all(imagePromises);
        files.forEach((file) => {
            if (file) formData.append('images', file);
        });

        btn.textContent = 'Updating...';

        const res = await fetch(`/api/proxy/design/${id}`, {
            method: 'PATCH',
            body: formData
        });

        const json = await res.json();

        if (json.status) {
            dashboard.showToast('Design updated successfully', 'success');
            dashboard.closeModal();
            await dashboard.fetchDesigns();
            if (dashboard.state.activeTab === 'Designs') {
                const container = dashboard.root.querySelector('#content-area');
                if (container) dashboard.updateModuleData(container);
            }
        } else {
            dashboard.showToast(json.message || 'Failed to update design', 'error');
        }
    } catch (e) {
        console.error(e);
        dashboard.showToast('Error updating design', 'error');
    } finally {
        if (btn) {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }
}
