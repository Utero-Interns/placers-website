'use client';

import InvoicePage from '@/components/order-history/InvoicePage';
import OrderHistoryPage from '@/components/order-history/OrderHistoryPage';
import { Order } from '@/types';
import { useState } from 'react';

export default function HistoryTab() {
  const [view, setView] = useState<'list' | 'invoice'>('list');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleShowInvoice = (order: Order) => {
    setSelectedOrder(order);
    setView('invoice');
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
    setView('list');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px]">
      {view === 'list' && (
         <div className="p-2">
             <OrderHistoryPage onShowInvoice={handleShowInvoice} />
         </div>
      )}
      {view === 'invoice' && selectedOrder && (
        <InvoicePage order={selectedOrder} onBack={handleBackToList} />
      )}
    </div>
  );
}
