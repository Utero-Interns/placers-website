
export const MockData = {
    users: [
        { id: '1', username: 'johndoe', email: 'john@example.com', phone: '081234567890', level: 'BUYER', provider: 'GOOGLE', profilePicture: 'https://i.pravatar.cc/150?u=1', createdAt: '2023-01-15T10:00:00Z', updatedAt: '2023-01-15T10:00:00Z' },
        { id: '2', username: 'janesmith', email: 'jane@example.com', phone: '081234567891', level: 'SELLER', provider: 'CREDENTIALS', profilePicture: 'https://i.pravatar.cc/150?u=2', createdAt: '2023-02-20T14:30:00Z', updatedAt: '2023-02-20T14:30:00Z' },
        { id: '3', username: 'admin_user', email: 'admin@placers.com', phone: '081299999999', level: 'ADMIN', provider: 'CREDENTIALS', profilePicture: 'https://i.pravatar.cc/150?u=3', createdAt: '2022-12-01T09:00:00Z', updatedAt: '2022-12-01T09:00:00Z' },
        { id: '4', username: 'budi_santoso', email: 'budi@gmail.com', phone: '081345678901', level: 'BUYER', provider: 'GOOGLE', profilePicture: 'https://i.pravatar.cc/150?u=4', createdAt: '2023-03-10T11:15:00Z', updatedAt: '2023-03-10T11:15:00Z' },
        { id: '5', username: 'siti_aminah', email: 'siti@yahoo.com', phone: '081345678902', level: 'SELLER', provider: 'CREDENTIALS', profilePicture: 'https://i.pravatar.cc/150?u=5', createdAt: '2023-04-05T16:45:00Z', updatedAt: '2023-04-05T16:45:00Z' },
    ],
    sellers: [
        { id: '1', userId: '2', fullname: 'Jane Smith', companyName: 'Smith Advertising', ktp: '3171234567890001', npwp: '12.345.678.9-012.000', ktpAddress: 'Jl. Sudirman No. 1, Jakarta', officeAddress: 'Jl. Thamrin No. 10, Jakarta', createdAt: '2023-02-20T14:30:00Z', updatedAt: '2023-02-20T14:30:00Z' },
        { id: '2', userId: '5', fullname: 'Siti Aminah', companyName: 'Aminah Billboard', ktp: '3171234567890002', npwp: '12.345.678.9-012.001', ktpAddress: 'Jl. Gatot Subroto No. 5, Jakarta', officeAddress: 'Jl. Rasuna Said No. 20, Jakarta', createdAt: '2023-04-05T16:45:00Z', updatedAt: '2023-04-05T16:45:00Z' },
    ],
    billboards: [
        { id: '1', ownerId: '1', categoryId: '1', description: 'Strategic LED Billboard at Sudirman Corner', location: 'Sudirman Corner', cityId: '1', provinceId: '1', cityName: 'Jakarta Pusat', provinceName: 'DKI Jakarta', status: 'Available', mode: 'Rent', size: '10x5m', orientation: 'Horizontal', display: 'Digital', lighting: 'Front', tax: 'Included', landOwnership: 'Private', rentPrice: 50000000, sellPrice: 0, servicePrice: 5000000, view: 15000, latitude: -6.2088, longitude: 106.8456, gPlaceId: 'ChIJ...', formattedAddress: 'Jl. Jend. Sudirman, Jakarta', createdAt: '2023-05-01T10:00:00Z', updatedAt: '2023-05-01T10:00:00Z', isDeleted: false },
        { id: '2', ownerId: '2', categoryId: '2', description: 'Large Static Billboard at Bundaran HI', location: 'Bundaran HI', cityId: '1', provinceId: '1', cityName: 'Jakarta Pusat', provinceName: 'DKI Jakarta', status: 'NotAvailable', mode: 'Buy', size: '20x10m', orientation: 'Horizontal', display: 'Static', lighting: 'Back', tax: 'Excluded', landOwnership: 'Government', rentPrice: 0, sellPrice: 2000000000, servicePrice: 0, view: 50000, latitude: -6.1944, longitude: 106.8229, gPlaceId: 'ChIJ...', formattedAddress: 'Bundaran HI, Jakarta', createdAt: '2023-05-10T12:00:00Z', updatedAt: '2023-05-10T12:00:00Z', isDeleted: false },
        { id: '3', ownerId: '1', categoryId: '1', description: 'Vertical Banner near MRT Station', location: 'Blok M MRT', cityId: '2', provinceId: '1', cityName: 'Jakarta Selatan', provinceName: 'DKI Jakarta', status: 'Available', mode: 'Rent', size: '4x8m', orientation: 'Vertical', display: 'Static', lighting: 'None', tax: 'Included', landOwnership: 'Private', rentPrice: 15000000, sellPrice: 0, servicePrice: 1000000, view: 8000, latitude: -6.2444, longitude: 106.8006, gPlaceId: 'ChIJ...', formattedAddress: 'Jl. Panglima Polim, Jakarta', createdAt: '2023-06-01T09:00:00Z', updatedAt: '2023-06-01T09:00:00Z', isDeleted: false },
    ],
    transactions: [
        { id: 'TRX001', buyerId: '1', sellerId: '1', billboardId: '1', designId: '1', payment: 'Transfer', status: 'PAID', totalPrice: 55500000, startDate: '2023-07-01', endDate: '2023-07-31', createdAt: '2023-06-25T10:00:00Z', updatedAt: '2023-06-25T10:05:00Z' },
        { id: 'TRX002', buyerId: '4', sellerId: '2', billboardId: '2', designId: null, payment: 'Credit Card', status: 'PENDING', totalPrice: 2000000000, startDate: '2023-08-01', endDate: '2099-12-31', createdAt: '2023-07-20T14:00:00Z', updatedAt: '2023-07-20T14:00:00Z' },
        { id: 'TRX003', buyerId: '1', sellerId: '1', billboardId: '3', designId: '2', payment: 'Transfer', status: 'COMPLETED', totalPrice: 16000000, startDate: '2023-06-01', endDate: '2023-06-30', createdAt: '2023-05-25T09:00:00Z', updatedAt: '2023-07-01T10:00:00Z' },
    ],
    categories: [
        { id: '1', name: 'Commercial', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
        { id: '2', name: 'Residential', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
        { id: '3', name: 'Highway', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
    ],
    designs: [
        { id: '1', name: 'Premium Template', description: 'High quality vector design', price: 500000, image: [], createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
        { id: '2', name: 'Basic Template', description: 'Simple and clean design', price: 200000, image: [], createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
    ],
    addOns: [
        { id: '1', name: 'LED Enhancement', description: 'Brighter LED modules', price: 1000000, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
        { id: '2', name: 'Maintenance Package', description: 'Weekly cleaning and checkup', price: 500000, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
    ],
    ratings: [
        { id: '1', transactionId: 'TRX003', userId: '1', rating: 5, comment: 'Excellent service and location!', createdAt: '2023-07-02T10:00:00Z', updatedAt: '2023-07-02T10:00:00Z' },
        { id: '2', transactionId: 'TRX001', userId: '1', rating: 4, comment: 'Good, but slightly delayed response.', createdAt: '2023-08-01T11:00:00Z', updatedAt: '2023-08-01T11:00:00Z' },
    ],
    notifications: [
        { id: '1', recipientId: '1', createdById: '3', entity: 'TRANSACTION', entityId: 'TRX001', title: 'Payment Received', message: 'Your payment for TRX001 has been received.', status: 'UNREAD', createdAt: '2023-06-25T10:05:00Z', readAt: null },
        { id: '2', recipientId: '2', createdById: '3', entity: 'BILLBOARD', entityId: '2', title: 'Billboard Approved', message: 'Your billboard "Bundaran HI" has been approved.', status: 'READ', createdAt: '2023-05-10T12:05:00Z', readAt: '2023-05-10T13:00:00Z' },
    ],
    cities: [
        { id: '1', name: 'Jakarta Pusat', province: 'DKI Jakarta', country: 'Indonesia', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
        { id: '2', name: 'Jakarta Selatan', province: 'DKI Jakarta', country: 'Indonesia', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
        { id: '3', name: 'Bandung', province: 'Jawa Barat', country: 'Indonesia', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
    ],
    media: [
        { id: '1', name: 'Billboard Image 1', type: 'IMAGE', url: 'https://example.com/image1.jpg', size: '2.5MB', createdAt: '2023-05-01T10:00:00Z' },
        { id: '2', name: 'Contract PDF', type: 'DOCUMENT', url: 'https://example.com/contract.pdf', size: '500KB', createdAt: '2023-05-10T12:00:00Z' },
        { id: '3', name: 'Location Video', type: 'VIDEO', url: 'https://example.com/video.mp4', size: '15MB', createdAt: '2023-06-01T09:00:00Z' },
    ],
};
