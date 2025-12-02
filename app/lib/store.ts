
// Mock Data and State Management

export type UserLevel = 'ADMIN' | 'BUYER' | 'SELLER';
export type UserProvider = 'CREDENTIALS' | 'GOOGLE';

export interface User {
    id: string;
    username: string;
    email: string;
    phone?: string;
    password?: string;
    level: UserLevel;
    provider: UserProvider;
    profilePicture?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Seller {
    id: string;
    userId: string;
    fullname: string;
    companyName: string;
    ktp: string;
    npwp: string;
    ktpAddress: string;
    officeAddress: string;
    createdAt: string;
    updatedAt: string;
}

export interface Billboard {
    id: string;
    ownerId: string;
    categoryId: string;
    description: string;
    location: string;
    cityId: string;
    provinceId: string;
    cityName: string;
    provinceName: string;
    status: 'Available' | 'NotAvailable';
    mode: 'Rent' | 'Buy';
    size: string;
    orientation: 'Horizontal' | 'Vertical';
    display: 'Digital' | 'Static';
    lighting: 'Front' | 'Back' | 'None';
    tax: 'Included' | 'Excluded';
    landOwnership: 'Private' | 'Government';
    rentPrice: number;
    sellPrice: number;
    servicePrice: number;
    view: number;
    latitude: number;
    longitude: number;
    gPlaceId: string;
    formattedAddress: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
}

export interface Transaction {
    id: string;
    buyerId: string;
    sellerId: string;
    billboardId: string;
    designId: string | null;
    payment: string;
    status: 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
    totalPrice: number;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface Design {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string[];
    createdAt: string;
    updatedAt: string;
}

export interface AddOn {
    id: string;
    name: string;
    description: string;
    price: number;
    createdAt: string;
    updatedAt: string;
}

export interface Rating {
    id: string;
    transactionId: string;
    userId: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
}

export interface Notification {
    id: string;
    recipientId: string;
    createdById: string;
    entity: 'TRANSACTION' | 'BILLBOARD';
    entityId: string;
    title: string;
    message: string;
    status: 'READ' | 'UNREAD';
    createdAt: string;
    readAt: string | null;
}

// Initial Mock Data (Moved from admin/dashboard/data.ts)
const INITIAL_DATA = {
    users: [
        { id: '1', username: 'johndoe', email: 'john@example.com', phone: '081234567890', password: 'password123', level: 'BUYER', provider: 'GOOGLE', profilePicture: 'https://i.pravatar.cc/150?u=1', createdAt: '2023-01-15T10:00:00Z', updatedAt: '2023-01-15T10:00:00Z' },
        { id: '2', username: 'janesmith', email: 'jane@example.com', phone: '081234567891', password: 'password123', level: 'SELLER', provider: 'CREDENTIALS', profilePicture: 'https://i.pravatar.cc/150?u=2', createdAt: '2023-02-20T14:30:00Z', updatedAt: '2023-02-20T14:30:00Z' },
        { id: '3', username: 'admin_user', email: 'admin1@gmail.com', phone: '081299999999', password: 'admin123', level: 'ADMIN', provider: 'CREDENTIALS', profilePicture: 'https://i.pravatar.cc/150?u=3', createdAt: '2022-12-01T09:00:00Z', updatedAt: '2022-12-01T09:00:00Z' },
        { id: '4', username: 'budi_santoso', email: 'budi@gmail.com', phone: '081345678901', password: 'password123', level: 'BUYER', provider: 'GOOGLE', profilePicture: 'https://i.pravatar.cc/150?u=4', createdAt: '2023-03-10T11:15:00Z', updatedAt: '2023-03-10T11:15:00Z' },
        { id: '5', username: 'siti_aminah', email: 'seller1@utero.id', phone: '081345678902', password: 'seller123', level: 'SELLER', provider: 'CREDENTIALS', profilePicture: 'https://i.pravatar.cc/150?u=5', createdAt: '2023-04-05T16:45:00Z', updatedAt: '2023-04-05T16:45:00Z' },
    ] as User[],
    sellers: [
        { id: '1', userId: '2', fullname: 'Jane Smith', companyName: 'Smith Advertising', ktp: '3171234567890001', npwp: '12.345.678.9-012.000', ktpAddress: 'Jl. Sudirman No. 1, Jakarta', officeAddress: 'Jl. Thamrin No. 10, Jakarta', createdAt: '2023-02-20T14:30:00Z', updatedAt: '2023-02-20T14:30:00Z' },
        { id: '2', userId: '5', fullname: 'Siti Aminah', companyName: 'Aminah Billboard', ktp: '3171234567890002', npwp: '12.345.678.9-012.001', ktpAddress: 'Jl. Gatot Subroto No. 5, Jakarta', officeAddress: 'Jl. Rasuna Said No. 20, Jakarta', createdAt: '2023-04-05T16:45:00Z', updatedAt: '2023-04-05T16:45:00Z' },
    ] as Seller[],
    billboards: [
        { id: '1', ownerId: '1', categoryId: '1', description: 'Strategic LED Billboard at Sudirman Corner', location: 'Sudirman Corner', cityId: '1', provinceId: '1', cityName: 'Jakarta Pusat', provinceName: 'DKI Jakarta', status: 'Available', mode: 'Rent', size: '10x5m', orientation: 'Horizontal', display: 'Digital', lighting: 'Front', tax: 'Included', landOwnership: 'Private', rentPrice: 50000000, sellPrice: 0, servicePrice: 5000000, view: 15000, latitude: -6.2088, longitude: 106.8456, gPlaceId: 'ChIJ...', formattedAddress: 'Jl. Jend. Sudirman, Jakarta', createdAt: '2023-05-01T10:00:00Z', updatedAt: '2023-05-01T10:00:00Z', isDeleted: false },
        { id: '2', ownerId: '2', categoryId: '2', description: 'Large Static Billboard at Bundaran HI', location: 'Bundaran HI', cityId: '1', provinceId: '1', cityName: 'Jakarta Pusat', provinceName: 'DKI Jakarta', status: 'NotAvailable', mode: 'Buy', size: '20x10m', orientation: 'Horizontal', display: 'Static', lighting: 'Back', tax: 'Excluded', landOwnership: 'Government', rentPrice: 0, sellPrice: 2000000000, servicePrice: 0, view: 50000, latitude: -6.1944, longitude: 106.8229, gPlaceId: 'ChIJ...', formattedAddress: 'Bundaran HI, Jakarta', createdAt: '2023-05-10T12:00:00Z', updatedAt: '2023-05-10T12:00:00Z', isDeleted: false },
        { id: '3', ownerId: '1', categoryId: '1', description: 'Vertical Banner near MRT Station', location: 'Blok M MRT', cityId: '2', provinceId: '1', cityName: 'Jakarta Selatan', provinceName: 'DKI Jakarta', status: 'Available', mode: 'Rent', size: '4x8m', orientation: 'Vertical', display: 'Static', lighting: 'None', tax: 'Included', landOwnership: 'Private', rentPrice: 15000000, sellPrice: 0, servicePrice: 1000000, view: 8000, latitude: -6.2444, longitude: 106.8006, gPlaceId: 'ChIJ...', formattedAddress: 'Jl. Panglima Polim, Jakarta', createdAt: '2023-06-01T09:00:00Z', updatedAt: '2023-06-01T09:00:00Z', isDeleted: false },
    ] as Billboard[],
    transactions: [
        { id: 'TRX001', buyerId: '1', sellerId: '1', billboardId: '1', designId: '1', payment: 'Transfer', status: 'PAID', totalPrice: 55500000, startDate: '2023-07-01', endDate: '2023-07-31', createdAt: '2023-06-25T10:00:00Z', updatedAt: '2023-06-25T10:05:00Z' },
        { id: 'TRX002', buyerId: '4', sellerId: '2', billboardId: '2', designId: null, payment: 'Credit Card', status: 'PENDING', totalPrice: 2000000000, startDate: '2023-08-01', endDate: '2099-12-31', createdAt: '2023-07-20T14:00:00Z', updatedAt: '2023-07-20T14:00:00Z' },
        { id: 'TRX003', buyerId: '1', sellerId: '1', billboardId: '3', designId: '2', payment: 'Transfer', status: 'COMPLETED', totalPrice: 16000000, startDate: '2023-06-01', endDate: '2023-06-30', createdAt: '2023-05-25T09:00:00Z', updatedAt: '2023-07-01T10:00:00Z' },
    ] as Transaction[],
    categories: [
        { id: '1', name: 'Commercial', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
        { id: '2', name: 'Residential', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
        { id: '3', name: 'Highway', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
    ] as Category[],
    designs: [
        { id: '1', name: 'Premium Template', description: 'High quality vector design', price: 500000, image: [], createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
        { id: '2', name: 'Basic Template', description: 'Simple and clean design', price: 200000, image: [], createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
    ] as Design[],
    addOns: [
        { id: '1', name: 'LED Enhancement', description: 'Brighter LED modules', price: 1000000, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
        { id: '2', name: 'Maintenance Package', description: 'Weekly cleaning and checkup', price: 500000, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
    ] as AddOn[],
    ratings: [
        { id: '1', transactionId: 'TRX003', userId: '1', rating: 5, comment: 'Excellent service and location!', createdAt: '2023-07-02T10:00:00Z', updatedAt: '2023-07-02T10:00:00Z' },
        { id: '2', transactionId: 'TRX001', userId: '1', rating: 4, comment: 'Good, but slightly delayed response.', createdAt: '2023-08-01T11:00:00Z', updatedAt: '2023-08-01T11:00:00Z' },
    ] as Rating[],
    notifications: [
        { id: '1', recipientId: '1', createdById: '3', entity: 'TRANSACTION', entityId: 'TRX001', title: 'Payment Received', message: 'Your payment for TRX001 has been received.', status: 'UNREAD', createdAt: '2023-06-25T10:05:00Z', readAt: null },
        { id: '2', recipientId: '2', createdById: '3', entity: 'BILLBOARD', entityId: '2', title: 'Billboard Approved', message: 'Your billboard "Bundaran HI" has been approved.', status: 'READ', createdAt: '2023-05-10T12:05:00Z', readAt: '2023-05-10T13:00:00Z' },
    ] as Notification[],
};

// Singleton Store Class
class AppStore {
    data: typeof INITIAL_DATA;
    currentUser: User | null = null;

    constructor() {
        this.data = { ...INITIAL_DATA };
        // Try to load from localStorage if available (optional, but requested in-memory so we can skip)
        // For now, we stick to in-memory as requested.
    }

    // AUTH ACTIONS
    login(identifier: string, password?: string): { success: boolean; user?: User; message?: string } {
        const user = this.data.users.find(u => (u.email === identifier || u.username === identifier));

        if (!user) {
            return { success: false, message: 'User not found' };
        }

        if (user.provider === 'CREDENTIALS' && user.password !== password) {
            return { success: false, message: 'Invalid password' };
        }

        this.currentUser = user;
        return { success: true, user };
    }

    register(payload: Partial<User>): { success: boolean; user?: User; message?: string } {
        if (this.data.users.find(u => u.email === payload.email)) {
            return { success: false, message: 'Email already exists' };
        }
        if (this.data.users.find(u => u.username === payload.username)) {
            return { success: false, message: 'Username already exists' };
        }

        const newUser: User = {
            id: String(this.data.users.length + 1),
            username: payload.username!,
            email: payload.email!,
            phone: payload.phone || '',
            password: payload.password,
            level: 'BUYER',
            provider: 'CREDENTIALS',
            profilePicture: `https://i.pravatar.cc/150?u=${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        this.data.users.push(newUser);
        this.currentUser = newUser; // Auto-login
        return { success: true, user: newUser };
    }

    logout() {
        this.currentUser = null;
    }

    upgradeToSeller(sellerPayload: Partial<Seller>): { success: boolean; message?: string } {
        if (!this.currentUser) return { success: false, message: 'Not logged in' };

        const newSeller: Seller = {
            id: String(this.data.sellers.length + 1),
            userId: this.currentUser.id,
            fullname: sellerPayload.fullname!,
            companyName: sellerPayload.companyName!,
            ktp: sellerPayload.ktp!,
            npwp: sellerPayload.npwp!,
            ktpAddress: sellerPayload.ktpAddress!,
            officeAddress: sellerPayload.officeAddress!,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        this.data.sellers.push(newSeller);

        // Update user level
        this.currentUser.level = 'SELLER';
        const userIndex = this.data.users.findIndex(u => u.id === this.currentUser!.id);
        if (userIndex !== -1) {
            this.data.users[userIndex].level = 'SELLER';
        }

        return { success: true };
    }

    // DATA ACCESS
    getCurrentUser() {
        return this.currentUser;
    }

    getSellerProfile(userId: string) {
        return this.data.sellers.find(s => s.userId === userId);
    }

    // ... other getters can be added as needed
}

// Export a singleton instance
export const store = new AppStore();
