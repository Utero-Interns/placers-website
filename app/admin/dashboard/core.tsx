import React, { useState, useEffect, useRef, useCallback } from 'react';
import { store } from '../../lib/store';
import { getImageUrl } from '../../lib/utils';
import { DashboardState, ModuleName, ModuleConfig, ApiData, ColumnConfig } from './types';
import { adminService } from './services';
// getLayoutHTML is now directly in JSX
// getSidebarNavHTML is now directly in JSX
import { getDashboardOverviewHTML } from './views/overview';
import { getProfileFormHTML } from './views/profile';
import { getModuleContainerHTML, getModuleControlsHTML, getPaginationHTML } from './views/modules';
import { generateTableHTML, getStatusBadgeClass } from './views/shared';

// Helper function to convert HTML string to a React node (for modal body, etc.)
const htmlToReact = (html: string) => <div dangerouslySetInnerHTML={{ __html: html }} />;

// Placeholder Components (will be replaced with actual implementations later)
const DashboardOverview: React.FC<{
    apiData: ApiData;
    storeData: typeof store.data; // Renamed to avoid confusion with apiData
    getUserName: (id: string) => string;
}> = ({ apiData, storeData, getUserName }) => {
    const stats = [
        { label: 'Total Users', value: apiData.users.length || storeData.users.length, change: '+12%' },
        { label: 'Active Sellers', value: apiData.sellers.length || storeData.sellers.length, change: '+5%' },
        { label: 'Total Billboards', value: apiData.billboards.length || storeData.data.billboards.length, change: '+8%' },
        { label: 'Total Revenue', value: 'Rp 2.5B', change: '+25%' },
    ];
    const recentTransactions = (apiData.transactions.length ? apiData.transactions : storeData.transactions).slice(0, 5);

    return htmlToReact(getDashboardOverviewHTML(
        stats,
        generateTableHTML(
            recentTransactions,
            [
                { key: 'id', label: 'ID' },
                { key: 'buyerId', label: 'Buyer', render: (v: string, row: any) => getUserName(v || row.user?.id) },
                { key: 'totalPrice', label: 'Amount', render: (v: number) => `Rp ${v.toLocaleString()}` },
                { key: 'status', label: 'Status', render: (v: string) => `<span className="badge ${getStatusBadgeClass(v)}">${v}</span>` },
                { key: 'createdAt', label: 'Date', render: (v: string) => new Date(v).toLocaleDateString() },
            ],
            null,
            'asc'
        )
    ));
};

const MediaGallery: React.FC<{
    apiData: ApiData;
    state: DashboardState;
    setState: React.Dispatch<React.SetStateAction<DashboardState>>;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    openConfirmModal: (title: string, message: string, onConfirm: () => Promise<void> | void) => void;
}> = ({ apiData, state, setState, showToast, openConfirmModal }) => {
    return <div>Media Gallery Content Here (Placeholder)</div>;
};

const MyProfile: React.FC<{
    apiData: ApiData;
    setApiData: React.Dispatch<React.SetStateAction<ApiData>>;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}> = ({ apiData, setApiData, showToast }) => {
    return <div>My Profile Content Here (Placeholder)</div>;
};

const ModuleRenderer: React.FC<{
    apiData: ApiData;
    state: DashboardState;
    setState: React.Dispatch<React.SetStateAction<DashboardState>>;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    openModal: (title: string, bodyContent: string | React.ReactNode, onConfirm?: (() => Promise<void> | void) | null, confirmText?: string, isConfirmDestructive?: boolean, maxWidth?: string) => void;
    openConfirmModal: (title: string, message: string, onConfirm: () => Promise<void> | void) => void;
}> = ({ apiData, state, setState, showToast, openModal, openConfirmModal }) => {
    return <div>{state.activeTab} Module Content Here (Placeholder)</div>;
};


export const AdminDashboard: React.FC = () => {
    const rootRef = useRef<HTMLDivElement>(null);
    const toastContainerRef = useRef<HTMLDivElement>(null);

    const [state, setState] = useState<DashboardState>({
        activeTab: 'Dashboard',
        searchQuery: '',
        sortColumn: null,
        sortDirection: 'asc',
        filters: {},
        currentPage: 1,
        itemsPerPage: 10,
        isSidebarOpen: false
    });
    const [apiData, setApiData] = useState<ApiData>({
        users: [],
        sellers: [],
        billboards: [],
        transactions: [],
        categories: [],
        designs: [],
        addons: [],
        cities: [],
        provinces: [],
        media: [],
        notifications: [],
        unreadNotificationsCount: 0,
        currentUser: null,
    });

    const [modal, setModal] = useState<{
        isOpen: boolean;
        title: string;
        bodyContent: string | React.ReactNode;
        confirmText: string;
        onConfirm: (() => Promise<void> | void) | null;
        isConfirmDestructive: boolean;
        maxWidth?: string;
    }>({
        isOpen: false,
        title: '',
        bodyContent: '',
        confirmText: 'Save',
        onConfirm: null,
        isConfirmDestructive: false,
    });

    const [selectedDesignFiles, setSelectedDesignFiles] = useState<File[]>([]);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
        if (!toastContainerRef.current) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        let iconHtml = '';
        if (type === 'success') iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
        else if (type === 'error') iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
        else iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

        toast.innerHTML = `
            <div class="toast-icon">${iconHtml}</div>
            <div class="toast-message">${message}</div>
        `;

        toastContainerRef.current.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hiding');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000);
    }, []);

    const closeModal = useCallback(() => {
        setModal(prev => ({ ...prev, isOpen: false, onConfirm: null }));
    }, []);

    const openModal = useCallback((title: string, bodyContent: string | React.ReactNode, onConfirm: (() => Promise<void> | void) | null = null, confirmText: string = 'Save', isConfirmDestructive: boolean = false, maxWidth?: string) => {
        setModal({
            isOpen: true,
            title,
            bodyContent,
            confirmText,
            onConfirm,
            isConfirmDestructive,
            maxWidth,
        });
    }, []);

    const openConfirmModal = useCallback((title: string, message: string, onConfirm: () => Promise<void> | void) => {
        openModal(
            title,
            <div className="modal-confirm-content" style={{ textAlign: 'center' }}>
                <div className="modal-confirm-icon" style={{ backgroundColor: '#fee2e2', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#dc2626' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <div className="modal-confirm-title" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{title}</div>     
                <div className="modal-confirm-text" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{message}</div>
            </div>,
            onConfirm,
            'Confirm',
            true
        );
    }, [openModal]);

    const toggleSidebar = useCallback((force?: boolean) => {
        setState(prev => ({ ...prev, isSidebarOpen: force !== undefined ? force : !prev.isSidebarOpen }));
    }, []);

    const updateNotificationBadge = useCallback(async () => {
        const count = await adminService.fetchUnreadCount();
        setApiData(prev => ({ ...prev, unreadNotificationsCount: count }));
    }, []);

    const setActiveTab = useCallback(async (tab: ModuleName) => {
        setState(prev => ({
            ...prev,
            activeTab: tab,
            searchQuery: '',
            sortColumn: null,
            filters: {},
            currentPage: 1,
        }));

        // Fetch data based on tab
        if (tab === 'Users' && apiData.users.length === 0) {
            const users = await adminService.fetchUsers();
            setApiData(prev => ({ ...prev, users }));
        } else if (tab === 'Sellers' && apiData.sellers.length === 0) {
            const sellers = await adminService.fetchSellers();
            setApiData(prev => ({ ...prev, sellers }));
        } else if (tab === 'Billboards' && apiData.billboards.length === 0) {
            const billboards = await adminService.fetchBillboards();
            setApiData(prev => ({ ...prev, billboards }));
        } else if (tab === 'Transactions' && apiData.transactions.length === 0) {
            const transactions = await adminService.fetchTransactions();
            setApiData(prev => ({ ...prev, transactions }));
        } else if (tab === 'Categories' && apiData.categories.length === 0) {
            const categories = await adminService.fetchCategories();
            setApiData(prev => ({ ...prev, categories }));
        } else if (tab === 'Designs' && apiData.designs.length === 0) {
            const designs = await adminService.fetchDesigns();
            setApiData(prev => ({ ...prev, designs }));
        } else if (tab === 'Cities' && apiData.cities.length === 0) {
            const cities = await adminService.fetchCities();
            setApiData(prev => ({ ...prev, cities }));
        } else if (tab === 'Media' && apiData.media.length === 0) {
            const media = await adminService.fetchMedia();
            setApiData(prev => ({ ...prev, media }));
        } else if (tab === 'Add-ons' && apiData.addons.length === 0) {
            const addons = await adminService.fetchAddons();
            setApiData(prev => ({ ...prev, addons }));
        }

        if (window.innerWidth <= 1024) {
            toggleSidebar(false);
        }
    }, [apiData.users, apiData.sellers, apiData.billboards, apiData.transactions, apiData.categories, apiData.designs, apiData.addons, apiData.cities, apiData.media, toggleSidebar, adminService, setApiData]); // Added adminService to dependencies

    // Google Maps Script Loading
    const googleMapsPromise = useRef<Promise<void> | null>(null);
    const loadGoogleMapsScript = useCallback((): Promise<void> => {
        if (googleMapsPromise.current) return googleMapsPromise.current;

        googleMapsPromise.current = new Promise((resolve, reject) => {
            if ((window as any).google && (window as any).google.maps) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = (e) => reject(e);
            document.head.appendChild(script);
        });
        return googleMapsPromise.current;
    }, []);

    // Initial data fetch and Google Maps script loading
    useEffect(() => {
        const init = async () => {
            const currentUser = await adminService.fetchCurrentUser();
            setApiData(prev => ({ ...prev, currentUser }));

            const users = await adminService.fetchUsers();
            const unreadNotificationsCount = await adminService.fetchUnreadCount();
            setApiData(prev => ({ ...prev, users, unreadNotificationsCount }));

            loadGoogleMapsScript().catch(console.error); // Start loading maps
        };
        init();
    }, [loadGoogleMapsScript, adminService, setApiData]);

    // This useEffect replaces the class's attachGlobalListeners for general global clicks
    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.mobile-toggle')) {
                toggleSidebar();
            }
            // Close sidebar when clicking outside on mobile
            if (state.isSidebarOpen && rootRef.current && !rootRef.current.querySelector('.sidebar')?.contains(target) && !target.closest('.mobile-toggle')) {
                toggleSidebar(false);
            }
        };

        document.addEventListener('click', handleGlobalClick);

        return () => {
            document.removeEventListener('click', handleGlobalClick);
        };
    }, [state.isSidebarOpen, toggleSidebar]);

    // Effect to update notification badge
    useEffect(() => {
        if (apiData.currentUser) {
            updateNotificationBadge();
        }
    }, [apiData.currentUser, updateNotificationBadge]);


    // Placeholder functions for module content
    const getUserName = useCallback((id: string) => {
        const user = apiData.users.find(u => u.id === id) || store.data.users.find(u => u.id === id);
        return user ? user.username : id;
    }, [apiData.users]);


    const renderSidebarNav = useCallback(() => {
        const tabs: { name: ModuleName; icon: string }[] = [
            { name: 'Dashboard', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>' },
            { name: 'Users', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
            { name: 'Sellers', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' },
            { name: 'Billboards', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/></svg>' },
            { name: 'Transactions', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>' },
            { name: 'Categories', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M14 14h7v7h-7z"/><path d="M3 14h7v7H3z"/></svg>' },
            { name: 'Designs', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>' },
            { name: 'Add-ons', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>' },
            { name: 'Cities', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M8 9v2"/><path d="M8 13v2"/><path d="M8 17v2"/><path d="M16 9v2"/><path d="M16 13v2"/><path d="M16 17v2"/></svg>' },
            { name: 'Media', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>' },
            { name: 'My Profile', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' }
        ];

        // Fix Sellers icon specifically
        tabs[2].icon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';

        return (
            <nav className="sidebar-nav">
                {tabs.map(tab => (
                    <div
                        key={tab.name}
                        className={`nav-item ${state.activeTab === tab.name ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.name)}
                    >
                        <span className="nav-icon" dangerouslySetInnerHTML={{ __html: tab.icon }}></span>
                        <span className="nav-text">{tab.name}</span>
                    </div>
                ))}
            </nav>
        );
    }, [state.activeTab, setActiveTab]);
    
    // Conditional rendering for the main content area
    const mainContent = (() => {
        // Show loading spinner while initial data is being fetched or when switching tabs
        if (!apiData.currentUser) {
            return <div className="loading-spinner" style={{padding: '2rem'}}>Loading dashboard...</div>;
        }

        switch (state.activeTab) {
            case 'Dashboard':
                return (
                    <DashboardOverview
                        apiData={apiData}
                        storeData={store.data}
                        getUserName={getUserName}
                    />
                );
            case 'Media':
                return (
                    <MediaGallery
                        apiData={apiData}
                        state={state}
                        setState={setState}
                        showToast={showToast}
                        openConfirmModal={openConfirmModal}
                    />
                );
            case 'My Profile':
                return (
                    <MyProfile
                        apiData={apiData}
                        setApiData={setApiData}
                        showToast={showToast}
                    />
                );
            default:
                return (
                    <ModuleRenderer
                        apiData={apiData}
                        state={state}
                        setState={setState}
                        showToast={showToast}
                        openModal={openModal}
                        openConfirmModal={openConfirmModal}
                    />
                );
        }
    })();

    const username = apiData.currentUser?.username || 'Admin';

    return (
        <div ref={rootRef} className={`admin-container ${state.isSidebarOpen ? 'sidebar-open' : ''}`}>
            <aside className="sidebar">
                <div className="sidebar-header">
                    PLACERS ADMIN
                </div>
                {renderSidebarNav()}
                <div className="sidebar-footer">
                    <div className="user-profile-section">
                        <div className="user-avatar">
                            {username.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                            <span className="user-name">{username}</span>
                            <span className="user-role">Administrator</span>
                        </div>
                    </div>
                    <button className="logout-btn-sidebar" onClick={async () => {
                        await fetch('/api/proxy/auth/logout', { method: 'POST' });
                        window.location.href = '/login';
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                        Logout
                    </button>
                </div>
            </aside>
            <main className="main-content">
                <header className="top-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button className="mobile-toggle" onClick={() => toggleSidebar()}>
                            <span dangerouslySetInnerHTML={{ __html: '&#9776;' }}></span>
                        </button>
                        <h1 className="page-title">{state.activeTab}</h1>
                    </div>
                </header>
                <div id="content-area">
                    {mainContent}
                </div>

                <button className="floating-notif-btn" title="Notifications" onClick={() => openModal('Notifications', 'Notification list will go here', undefined, 'Close', false)}>
                    <div className="notif-badge" style={{ display: apiData.unreadNotificationsCount > 0 ? 'flex' : 'none' }}>{apiData.unreadNotificationsCount}</div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                </button>
            </main>

            <div ref={toastContainerRef} className="toast-container"></div>

            {modal.isOpen && (
                <div className="modal-overlay open">
                    <div className="modal" style={modal.maxWidth ? { maxWidth: modal.maxWidth } : {}}>
                        <div className="modal-header">
                            <h3 className="modal-title">{modal.title}</h3>
                            <button className="modal-close" onClick={closeModal}>&times;</button>
                        </div>
                        <div className="modal-body">
                            {typeof modal.bodyContent === 'string' ? htmlToReact(modal.bodyContent) : modal.bodyContent}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline close-modal" onClick={closeModal}>Cancel</button>
                            {modal.onConfirm && (
                                <button
                                    className={`btn ${modal.isConfirmDestructive ? 'btn-danger' : 'btn-primary'} confirm-modal`}
                                    onClick={() => {
                                        modal.onConfirm && modal.onConfirm();
                                    }}
                                >
                                    {modal.confirmText}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}