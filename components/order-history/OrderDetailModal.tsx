
import React, { useEffect } from 'react';
import { Order } from '@/types';
import { X } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => void;
  order: Order | null;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ isOpen, onClose, onPrint, order }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl transform transition-all" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Detail Pesanan</h2>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                    <X size={24} />
                </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{order.category} - {order.seller}</h3>
                        <StatusBadge status={order.transactionStatus || 'PENDING'} />
                    </div>
                    <p className="text-sm text-gray-500">Spesifikasi: {order.specifications}</p>
                </div>
                <button onClick={onPrint} className="w-full sm:w-auto text-sm bg-white text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-red-50 rounded-lg px-4 py-2 font-semibold cursor-pointer">
                    Cetak Nota
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Rincian Administratif</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {order.adminDetails.map((detail, index) => <li key={index}>{detail}</li>)}
                    </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Rincian Layanan Tambahan</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {order.serviceDetails.map((detail, index) => <li key={index}>{detail}</li>)}
                    </ul>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button onClick={onClose} className="text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 rounded-lg px-6 py-2.5 font-semibold cursor-pointer">
                    Tutup
                </button>
                <button className="text-sm bg-[var(--color-primary)] text-white hover:bg-red-700 rounded-lg px-6 py-2.5 font-semibold cursor-pointer">
                    Laporan Pemasangan
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
