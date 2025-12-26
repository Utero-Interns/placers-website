
export const getLayoutHTML = (username: string) => `
      <div class="admin-container">
        <aside class="sidebar">
          <div class="sidebar-header">
            PLACERS ADMIN
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
                 <span class="user-role">Administrator</span>
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
              <button class="mobile-toggle">Γÿ░</button>
              <h1 class="page-title">Dashboard</h1>
            </div>
          </header>
          <div id="content-area">
            <!-- Content injected here -->
             <div class="loading-spinner">Loading...</div>
           </div>

           <!-- Floating Notification Button -->
           <button class="floating-notif-btn" title="Notifications">
             <div class="notif-badge" style="display: none;">0</div>
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
           </button>
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
