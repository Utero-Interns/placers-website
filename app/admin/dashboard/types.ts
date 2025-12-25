/* eslint-disable @typescript-eslint/no-explicit-any */

export type ModuleName = 'Dashboard' | 'Users' | 'Sellers' | 'Billboards' | 'Transactions' | 'Categories' | 'Designs' | 'Add-ons' | 'Media' | 'My Profile';

export interface DashboardState {
    activeTab: ModuleName;
    searchQuery: string;
    sortColumn: string | null;
    sortDirection: 'asc' | 'desc';
    filters: Record<string, string>;
    currentPage: number;
    itemsPerPage: number;
    isSidebarOpen: boolean;
}

export interface ColumnConfig<T> {
    key: keyof T | 'actions';
    label: string;
    render?: (value: any, row: T) => string;
}

export interface ModuleConfig<T> {
    data: T[];
    columns: ColumnConfig<T>[];
    filters: { key: keyof T; label: string; options: string[] }[];
}

export interface ApiData {
    users: any[];
    sellers: any[];
    billboards: any[];
    transactions: any[];
    categories: any[];
    designs: any[];
    addons: any[];
    provinces: any[];
    media: any[];
    notifications: any[];
    unreadNotificationsCount: number;
    currentUser: any | null;
}
