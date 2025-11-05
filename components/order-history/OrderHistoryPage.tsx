import React, { useState, useMemo, useEffect } from 'react';
import { getOrders } from '@/services/orderHistoryService';
import { Order, OrderStatus } from '@/types';
import OrderDetailModal from './OrderDetailModal';
import { MapPin, Calendar, ChevronRight, Search, ChevronLeft, HistoryIcon, SquareDashed } from 'lucide-react';

interface OrderHistoryPageProps {
  onShowInvoice: (order: Order) => void;
}

const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ onShowInvoice }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderStatus | 'Semua'>('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const data = await getOrders();
      setOrders(data);
      setIsLoading(false);
    };
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    let currentOrders = orders;
    if (activeTab !== 'Semua') {
      currentOrders = currentOrders.filter((order) => order.status === activeTab);
    }
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      currentOrders = currentOrders.filter(order =>
        order.id.toLowerCase().includes(lowercasedFilter) ||
        order.category.toLowerCase().includes(lowercasedFilter) ||
        order.location.toLowerCase().includes(lowercasedFilter)
      );
    }
    return currentOrders;
  }, [activeTab, searchTerm, orders]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredOrders.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredOrders, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

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

  const getStatusChip = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Upcoming:
        return <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">Akan Datang</span>;
      case OrderStatus.Ongoing:
        return <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Berjalan</span>;
      case OrderStatus.Completed:
        return <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">Selesai</span>;
      default:
        return null;
    }
  };

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
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/80 bg-gray-50"
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
                      className="bg-gray-100 border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/80"
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
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
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
          <p className="text-gray-600 text-lg">Loading your orders...</p>
        </div>
      ) : paginatedOrders.length > 0 ? (
        <div className="space-y-4">
          {paginatedOrders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-3">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-800 text-lg">{order.id}</span>
                    {getStatusChip(order.status)}
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
                  <button onClick={() => handleOpenModal(order)} className="w-full sm:w-auto text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 rounded-lg px-4 py-2 font-semibold">
                    Lihat Detail
                  </button>
                  <button onClick={() => onShowInvoice(order)} className="w-full sm:w-auto text-sm flex items-center justify-center gap-1.5 bg-[var(--color-primary)] text-white hover:bg-red-700 rounded-lg px-4 py-2 font-semibold">
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
                className="px-3 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-gray-600 hover:bg-gray-100 font-medium"
            >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Previous</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-md ${
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
                className="px-3 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-gray-600 hover:bg-gray-100 font-medium"
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