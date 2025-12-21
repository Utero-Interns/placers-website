export type ModuleName = 'Dashboard' | 'My Billboards' | 'My Transactions' | 'My Profile' | 'History';

export const getLayoutHTML = (username: string) => `
            <div class="admin-container">
                <aside class="sidebar">
                    <div class="sidebar-header">
                        SELLER DASHBOARD
                    </div>
                    <nav class="sidebar-nav">
                        <!-- Nav items injected here -->
                    </nav>
                    <div class="sidebar-footer">
                        <div class="user-profile-section">
                            <div class="user-avatar">
                                ${username.charAt(0).toUpperCase()}
                            </div>
                            <div class="user-info">
                                <span class="user-name">${username}</span>
                                <span class="user-role">Seller</span>
                            </div>
                        </div>
                        <button class="logout-btn-sidebar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                            Logout
                        </button>
                    </div>
                </aside>
                <main class="main-content">
                    <header class="top-header">
                        <div style="display:flex; align-items:center; gap:1rem;">
                            <button class="mobile-toggle">☰</button>
                            <h1 class="page-title">Dashboard</h1>
                        </div>
                    </header>
                    <div id="content-area">
                        <div class="loading-spinner">Loading...</div>
                    </div>
                </main>
            </div>
            <div class="toast-container"></div>
            <div id="modal-root" class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">Modal Title</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body"></div>
                    <div class="modal-footer">
                        <button class="btn btn-outline close-modal">Cancel</button>
                        <button class="btn btn-primary confirm-modal">Save</button>
                    </div>
                </div>
            </div>
`;

export const getSidebarNavHTML = (activeTab: ModuleName) => {
    const tabs: { name: ModuleName; icon: string }[] = [
        { name: 'Dashboard', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>' },
        { name: 'My Billboards', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/></svg>' },
        { name: 'My Transactions', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>' },
        { name: 'My Profile', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
        { name: 'History', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
    ];

    return tabs.map(tab => `
            <div class="nav-item ${activeTab === tab.name ? 'active' : ''}" data-tab="${tab.name}">
                <span class="nav-icon">${tab.icon}</span>
                <span class="nav-text">${tab.name}</span>
            </div>
        `).join('');
};
