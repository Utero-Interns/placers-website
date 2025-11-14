'use client';

import React, { useState } from 'react';
import PaymentDetails from '@/components/payment/PaymentDetails';
import PaymentMethods from '@/components/payment/PaymentMethods';
import ConfirmationModal from '@/components/payment/ConfirmationModal';
import FootBar from '@/components/footer/FootBar';
import NavBar from '@/components/NavBar';

const Payment: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectMethod = (id: string) => {
    setSelectedMethod(id);
  };

  const handleOpenModal = () => {
    if (selectedMethod) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmPayment = () => {
    console.log('Payment confirmed for method:', selectedMethod);
    setIsModalOpen(false);
    setSelectedMethod(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900 flex flex-col">
  {/* Navbar */}
  <NavBar />

  {/* Main content */}
  <main className="flex-1 flex items-center justify-center p-4 sm:p-6 2xl:p-8">
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-8">
      <PaymentDetails />
      <PaymentMethods
        selectedMethod={selectedMethod}
        onSelectMethod={handleSelectMethod}
        onConfirm={handleOpenModal}
      />
    </div>
  </main>

  {/* Footer */}
  <FootBar />

  {/* Modal (best placed at root level) */}
  <ConfirmationModal
    isOpen={isModalOpen}
    onClose={handleCloseModal}
    onConfirm={handleConfirmPayment}
  />
</div>

  );
};

export default Payment;