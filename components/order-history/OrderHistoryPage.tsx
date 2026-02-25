import { getOrders, HistoryItem } from '@/services/orderHistoryService';
import { Order, OrderStatus } from '@/types';
import { authService, User } from '@/app/lib/auth';
import { Calendar, ChevronLeft, ChevronRight, HistoryIcon, MapPin, Search, SquareDashed } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import OrderDetailModal from './OrderDetailModal';
import StatusBadge from './StatusBadge';

const mapToOrder = (item: HistoryItem, currentUser: User | null): Order => {
  const transaction = item.transaction;
  const billboard = transaction.billboard;
  const design = transaction.design;
  const pricing = item.pricing;

  // Derive status based on dates if COMPLETED/PAID
  let status = OrderStatus.Upcoming; // Default
  if (transaction.status === 'COMPLETED') {
    status = OrderStatus.Completed;
  } else if (transaction.status === 'PAID') {
    const now = new Date();
    const start = new Date(transaction.startDate);
    const end = transaction.endDate ? new Date(transaction.endDate) : null;
    
    if (now < start) {
      status = OrderStatus.Upcoming;
    } else if (end && now > end) {
      status = OrderStatus.Completed;
    } else {
      status = OrderStatus.Ongoing;
    }
  } else if (transaction.status === 'PENDING') {
      status = OrderStatus.Upcoming;
  } else if (transaction.status === 'CANCELLED' || transaction.status === 'REJECTED' || transaction.status === 'EXPIRED') {
       // Map negative statuses to completed for now, or consider adding a Cancelled status to frontend enum
       status = OrderStatus.Completed; 
  }

  // Construct Items and Details
  const orderItems = [];
  const serviceDetails: string[] = [];
  const adminDetails: string[] = [];

  // Admin Details from Billboard
  const detailedBillboard = pricing.billboard;
  if (detailedBillboard) {
      if (detailedBillboard.tax) adminDetails.push(`Pajak: ${detailedBillboard.tax}`);
      if (detailedBillboard.landOwnership) adminDetails.push(`Lahan: ${detailedBillboard.landOwnership}`);
      if (detailedBillboard.lighting) adminDetails.push(`Penerangan: ${detailedBillboard.lighting}`);
  }

  // 1. Base Item (Billboard Rent/Buy)
  let basePrice = 0;
  if (pricing.prices?.base) {
      basePrice = pricing.prices.base;
  } else if (pricing.prices?.sellPrice) {
      basePrice = pricing.prices.sellPrice;
  } else if (pricing.prices?.rentPrice) {
      basePrice = pricing.prices.rentPrice;
  } else {
       const total = parseFloat(transaction.totalPrice);
       const addOnTotal = pricing.prices?.addOnTotal || 0;
       basePrice = total - addOnTotal;
  }

  orderItems.push({
      description: `Sewa Billboard ${billboard.cityName}`,
      category: 'Billboard',
      duration: '1 Bulan', 
      unitPrice: basePrice,
      total: basePrice
  });

  // 2. Add-ons
  if (pricing.addOns) {
      if (Array.isArray(pricing.addOns) && pricing.addOns.length > 0) {
          const firstAddOn = pricing.addOns[0];
          if (typeof firstAddOn === 'object' && firstAddOn !== null && 'price' in firstAddOn) {
               (pricing.addOns as {name: string, price: number}[]).forEach(addon => {
                   serviceDetails.push(addon.name); // Add to service details
                   orderItems.push({
                       description: addon.name,
                       category: 'Add-On',
                       duration: '-',
                       unitPrice: addon.price,
                       total: addon.price
                   });
               });
          } else if (typeof firstAddOn === 'string') {
               (pricing.addOns as string[]).forEach(addonName => {
                   serviceDetails.push(addonName); // Add to service details
                   let price = 0;
                   if (addonName === 'Design Service' && pricing.prices?.designPrice) {
                        price = Number(pricing.prices.designPrice);
                   } else if (addonName === 'Installation' && pricing.prices?.servicePrice) {
                        // price unknown or bundled
                   }
                   
                   orderItems.push({
                       description: addonName,
                       category: 'Add-On',
                       duration: '-',
                       unitPrice: price,
                       total: price
                   });
               });
          }
      }
  }

  return {
    id: item.id,
    invoiceNumber: item.transactionId.substring(0, 8).toUpperCase(),
    orderDate: new Date(transaction.createdAt).toLocaleDateString('id-ID'),
    invoiceDate: new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    category: design?.name || 'Billboard',
    location: `${billboard.cityName}, ${billboard.provinceName}`,
    totalCost: parseFloat(transaction.totalPrice),
    paymentStatus: 'Lunas', 
    status: status,
    transactionStatus: transaction.status, // Add raw transaction status
    seller: 'Placers Vendor',
    specifications: `${billboard.size}, ${billboard.cityName}`,
    adminDetails: adminDetails, 
    serviceDetails: serviceDetails, 
    billTo: { name: currentUser?.username || 'User', email: currentUser?.email || '-', phone: '-' }, 
    sellerInfo: { name: 'Placers Vendor', address: '-', phone: '-' }, 
    items: orderItems,
    subtotal: parseFloat(transaction.totalPrice),
    pph: 0,
    ppn: 0,
    serviceFee: 0,
    jobFee: 0,
    promo: 0,
    notes: '-',
  };
};

interface OrderHistoryPageProps {
  onShowInvoice: (order: Order) => void;
}

const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ onShowInvoice }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    authService.getProfile().then(res => {
      if (res.user) setCurrentUser(res.user);
      else if (res.data) setCurrentUser(res.data);
    });
  }, []);
  const [activeTab, setActiveTab] = useState<OrderStatus | 'Semua'>('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [pageCursors, setPageCursors] = useState<{[key: number]: string}>({});
  const [hasNextPage, setHasNextPage] = useState(false);

  // Derive the cursor for the current page outside useEffect to keep dependencies stable
  const cursor = useMemo(() => {
      if (currentPage === 1) return undefined;
      return pageCursors[currentPage];
  }, [currentPage, pageCursors]);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await getOrders({
            take: rowsPerPage,
            cursor: cursor,
            search: searchTerm,
            status: activeTab === 'Semua' ? undefined : activeTab,
        });
        
        const mappedOrders = response.data.map(item => mapToOrder(item, currentUser));
        setOrders(mappedOrders);
        
        if (response.meta.nextCursor) {
            setPageCursors(prev => {
                if (prev[currentPage + 1] === response.meta.nextCursor) return prev;
                return { ...prev, [currentPage + 1]: response.meta.nextCursor! };
            });
            setHasNextPage(true);
        } else {
            setHasNextPage(false);
        }

      } catch (error) {
        console.error("Failed to fetch orders", error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [cursor, activeTab, searchTerm, rowsPerPage, currentPage]); 

  // Reset cursors when filters change
  useEffect(() => {
      setPageCursors({});
      setCurrentPage(1);
  }, [activeTab, searchTerm, rowsPerPage]);

  const paginatedOrders = orders;
  const totalPages = hasNextPage ? currentPage + 1 : currentPage;

  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handlePrintFromModal = () => {
    if (selectedOrder) {
      onShowInvoice(selectedOrder);
      handleCloseModal();
    }
  };

  const tabs: (OrderStatus | 'Semua')[] = ['Semua', OrderStatus.Upcoming, OrderStatus.Ongoing, OrderStatus.Completed];

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <HistoryIcon className="w-8 h-8 text-[var(--color-primary)]" />
          <h1 className="text-3xl font-bold text-gray-800">Riwayat Pesanan</h1>
        </div>
      </header>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative w-full sm:w-auto sm:max-w-xs flex-grow sm:flex-grow-0">
                  <input
                      type="text"
                      placeholder="Cari..."
                      value={searchTerm}
                      onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                      }}
                      className="pl-10 pr-4 py-2 w-full text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/80 bg-gray-50"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Tampilkan</span>
                  <select
                      value={rowsPerPage}
                      onChange={(e) => {
                          setRowsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                      }}
                      className="bg-gray-100 border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/80 cursor-pointer"
                      aria-label="Rows per page"
                  >
                      <option value={3}>3</option>
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                  </select>
                  <span>baris</span>
              </div>
          </div>
        <div className="border-b border-gray-200 mt-4">
          <nav className="-mb-px flex flex-wrap gap-x-6 gap-y-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer
                  ${
                    activeTab === tab
                      ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab === 'Semua' ? 'Semua Pesanan' : tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16 px-6 bg-white rounded-lg border border-gray-200">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mb-4"></div>
            <p className="text-gray-600 text-lg">Memuat riwayat pesanan...</p>
          </div>
        </div>
      ) : paginatedOrders.length > 0 ? (
        <div className="space-y-4">
          {paginatedOrders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-3">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-800 text-lg">{order.id}</span>
                    <StatusBadge status={order.transactionStatus || 'PENDING'} />
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>Dipesan pada {order.orderDate}</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 my-4"></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{order.category}</h3>
                  <div className="flex items-start gap-2 mt-1 text-sm text-gray-500">
                    <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{order.location}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 sm:px-5 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 rounded-b-lg">
                 <div className="text-sm">
                  <span className="text-gray-600">Total Biaya: </span>
                  <span className="font-bold text-gray-900">{formatCurrency(order.totalCost)}</span>
                 </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button onClick={() => handleOpenModal(order)} className="w-full sm:w-auto text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 rounded-lg px-4 py-2 font-semibold cursor-pointer">
                    Lihat Detail
                  </button>
                  <button onClick={() => onShowInvoice(order)} className="w-full sm:w-auto text-sm flex items-center justify-center gap-1.5 bg-[var(--color-primary)] text-white hover:bg-red-700 rounded-lg px-4 py-2 font-semibold cursor-pointer">
                    Lihat Nota <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-lg border border-dashed">
            <div className="flex justify-center mb-4">
                <SquareDashed />
            </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Tidak Ada Pesanan Ditemukan</h3>
          <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian Anda.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-1 sm:gap-2">
            <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-gray-600 hover:bg-gray-100 font-medium cursor-pointer"
            >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Previous</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-md cursor-pointer ${
                        currentPage === page
                            ? 'bg-[var(--color-primary)] text-white shadow-sm'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                    } font-medium text-sm transition-colors`}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-gray-600 hover:bg-gray-100 font-medium cursor-pointer"
            >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} />
            </button>
        </div>
      )}

      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPrint={handlePrintFromModal}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrderHistoryPage;