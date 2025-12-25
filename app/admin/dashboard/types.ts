/* eslint-disable @typescript-eslint/no-explicit-any */

export type ModuleName = 'Dashboard' | 'Users' | 'Sellers' | 'Billboards' | 'Transactions' | 'Categories' | 'Designs' | 'Add-ons' | 'Media' | 'My Profile' | 'Recycle Bin';

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
    filters: { key: string | number; label: string; options: string[] }[];
}

export interface CurrentUser {
    id: string;
    username: string;
    email: string;
    phone?: string;
    level: 'ADMIN' | 'BUYER' | 'SELLER';
    provider: 'GOOGLE' | 'CREDENTIALS';
    profilePicture?: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
}
export interface ApiData {
    users: CurrentUser[];
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
    currentUser: CurrentUser | null;
    recycleBin: any[];
}
