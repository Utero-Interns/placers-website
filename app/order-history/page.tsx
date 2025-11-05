'use client'; 

import React, { useState } from 'react';
import { Order } from '@/types';
import OrderHistoryPage from '@/components/order-history/OrderHistoryPage';
import InvoicePage from '@/components/order-history/InvoicePage';

const App: React.FC = () => {
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
    <div className="bg-gray-50 min-h-screen font-sans">
      {view === 'list' && <OrderHistoryPage onShowInvoice={handleShowInvoice} />}
      {view === 'invoice' && selectedOrder && (
        <InvoicePage order={selectedOrder} onBack={handleBackToList} />
      )}
    </div>
  );
};

export default App;
