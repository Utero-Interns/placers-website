'use client'; 

import React, { useState } from 'react';
import { Order } from '@/types';
import OrderHistoryPage from '@/components/order-history/OrderHistoryPage';
import InvoicePage from '@/components/order-history/InvoicePage';
import NavBar from '@/components/NavBar';
import FootBar from '@/components/footer/FootBar';

const OrderHistory: React.FC = () => {
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
    <div className="bg-[#FCFCFC] min-h-screen font-sans">
      <NavBar />
      <main>
        {view === 'list' && <OrderHistoryPage onShowInvoice={handleShowInvoice} />}
        {view === 'invoice' && selectedOrder && (
          <InvoicePage order={selectedOrder} onBack={handleBackToList} />
        )}
      </main>
      <FootBar />
    </div>
  );
};

export default OrderHistory;
