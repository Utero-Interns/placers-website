'use client';

import React, { useEffect, useState } from 'react';
import PaymentMethods from '@/components/payment/PaymentMethods';
import ConfirmationModal from '@/components/payment/ConfirmationModal';
import FootBar from '@/components/footer/FootBar';
import NavBar from '@/components/NavBar';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ReceiptText } from 'lucide-react';

interface TransactionDetail {
  id: string;
  status: string;
  totalPrice: string;
  startDate: string;
  endDate: string | null;
  billboard: {
    description: string | null;
    location: string;
    cityName: string;
    size: string;
    rentPrice: string;
    sellPrice: string | null;
  };
  addOns?: { name: string; price: string }[];
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const Payment: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const transactionId = params?.id as string;

  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [loadingTx, setLoadingTx] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (!transactionId) return;
    const fetchTransaction = async () => {
      try {
        const res = await fetch(`/api/proxy/transaction/detail/${transactionId}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setTransaction(json.data ?? null);
      } catch (err) {
        console.error('Failed to fetch transaction:', err);
        toast.error('Gagal memuat detail transaksi.');
      } finally {
        setLoadingTx(false);
      }
    };
    fetchTransaction();
  }, [transactionId]);

  const handleConfirmPayment = async () => {
    // There is no buyer-facing payment endpoint on the backend yet.
    // We record the user's intent and inform them to await admin verification.
    setIsConfirming(true);
    try {
      toast.success('Pesanan dikonfirmasi! Silakan transfer sesuai nominal dan tunggu verifikasi admin.');
      setIsModalOpen(false);
      router.push('/order-history');
    } finally {
      setIsConfirming(false);
    }
  };

  const totalPrice = transaction ? parseFloat(transaction.totalPrice) : 0;

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900 flex flex-col">
      <NavBar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 2xl:p-8">
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-8">

          {/* Payment Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex-1 w-full lg:max-w-md">
            <div className="flex items-center gap-3 mb-6">
              <ReceiptText className="text-gray-700" size={28} />
              <h2 className="text-xl font-bold text-gray-800">Rincian Pembayaran</h2>
            </div>

            {loadingTx ? (
              <div className="animate-pulse space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full" />
                ))}
              </div>
            ) : transaction ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Billboard</span>
                  <span className="font-medium text-gray-800 text-right max-w-[60%]">
                    {transaction.billboard.description || transaction.billboard.location}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Kota</span>
                  <span className="font-medium text-gray-800">{transaction.billboard.cityName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ukuran</span>
                  <span className="font-medium text-gray-800">{transaction.billboard.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Periode</span>
                  <span className="font-medium text-gray-800">
                    {new Date(transaction.startDate).toLocaleDateString('id-ID')}
                    {transaction.endDate ? ` – ${new Date(transaction.endDate).toLocaleDateString('id-ID')}` : ''}
                  </span>
                </div>
                {transaction.addOns && transaction.addOns.length > 0 && (
                  <>
                    <hr className="border-gray-100 my-2" />
                    <p className="font-semibold text-gray-600">Add-On</p>
                    {transaction.addOns.map((a, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-gray-500">{a.name}</span>
                        <span className="font-medium text-gray-800">{formatCurrency(parseFloat(a.price))}</span>
                      </div>
                    ))}
                  </>
                )}
                <hr className="border-gray-200 my-4" />
                <div className="flex justify-between text-base">
                  <span className="font-bold text-gray-800">Total Bayar</span>
                  <span className="font-bold text-gray-800">{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Detail transaksi tidak ditemukan.</p>
            )}
          </div>

          <PaymentMethods
            selectedMethod={selectedMethod}
            onSelectMethod={setSelectedMethod}
            onConfirm={() => selectedMethod && setIsModalOpen(true)}
          />
        </div>
      </main>

      <FootBar />

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmPayment}
        isLoading={isConfirming}
      />
    </div>
  );
};

export default Payment;
