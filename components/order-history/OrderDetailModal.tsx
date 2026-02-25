
import React, { useEffect, useState } from 'react';
import { Order } from '@/types';
import { X } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface FullTransactionDetail {
  seller: { fullname: string; companyName: string; officeAddress: string; user: { phone: string } } | null;
  buyer: { username: string; email: string; phone: string } | null;
  addons: { addOn: { name: string; price: string } }[];
  billboard: { description: string | null; location: string; size: string; lighting: string; tax: string; landOwnership: string } | null;
}

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => void;
  order: Order | null;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ isOpen, onClose, onPrint, order }) => {
  const [detail, setDetail] = useState<FullTransactionDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Fetch full transaction detail when modal opens
  useEffect(() => {
    if (!isOpen || !order) return;
    setDetail(null);
    setLoadingDetail(true);
    fetch(`/api/proxy/transaction/detail/${order.id}`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(json => setDetail(json?.data ?? null))
      .catch(() => setDetail(null))
      .finally(() => setLoadingDetail(false));
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  // Compose admin details: prefer live data, fall back to mapped order
  const adminDetails: string[] = detail?.billboard
    ? [
        detail.billboard.lighting && `Penerangan: ${detail.billboard.lighting}`,
        detail.billboard.tax && `Pajak: ${detail.billboard.tax}`,
        detail.billboard.landOwnership && `Lahan: ${detail.billboard.landOwnership}`,
      ].filter(Boolean) as string[]
    : order.adminDetails;

  const serviceDetails: string[] = detail?.addons?.length
    ? detail.addons.map(a => a.addOn.name)
    : order.serviceDetails;

  const sellerName = detail?.seller
    ? detail.seller.fullname || detail.seller.companyName || 'Placers Vendor'
    : order.sellerInfo.name;
  const sellerAddress = detail?.seller?.officeAddress || order.sellerInfo.address || '-';
  const sellerPhone = detail?.seller?.user?.phone || order.sellerInfo.phone || '-';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-800">Detail Pesanan</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{order.category}</h3>
                <StatusBadge status={order.transactionStatus || 'PENDING'} />
              </div>
              <p className="text-sm text-gray-500">Lokasi: {order.location}</p>
              <p className="text-sm text-gray-500">Spesifikasi: {order.specifications}</p>
            </div>
            <button onClick={onPrint} className="w-full sm:w-auto text-sm bg-white text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-red-50 rounded-lg px-4 py-2 font-semibold cursor-pointer">
              Cetak Nota
            </button>
          </div>

          {loadingDetail ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-pulse">
              {[0, 1].map(i => (
                <div key={i} className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Rincian Administratif</h4>
                {adminDetails.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {adminDetails.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                ) : <p className="text-sm text-gray-400">-</p>}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Layanan Tambahan</h4>
                {serviceDetails.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {serviceDetails.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                ) : <p className="text-sm text-gray-400">Tidak ada</p>}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Info Penjual</h4>
                <p className="text-sm text-gray-700 font-medium">{sellerName}</p>
                <p className="text-sm text-gray-500">{sellerAddress}</p>
                <p className="text-sm text-gray-500">{sellerPhone}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Info Pembeli</h4>
                <p className="text-sm text-gray-700 font-medium">{order.billTo.name}</p>
                <p className="text-sm text-gray-500">{order.billTo.email}</p>
                <p className="text-sm text-gray-500">{order.billTo.phone}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button onClick={onClose} className="text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 rounded-lg px-6 py-2.5 font-semibold cursor-pointer">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
