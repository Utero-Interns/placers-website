import React from 'react';
import { ReceiptText } from 'lucide-react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

interface DetailRowProps {
    label: string;
    value: number;
    isDiscount?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, isDiscount = false }) => (
  <div className="flex justify-between items-center text-sm">
    <p className="text-gray-500">{label}</p>
    <p className={`font-medium ${isDiscount ? 'text-red-500' : 'text-gray-800'}`}>
      {isDiscount ? `-` : ''}{formatCurrency(value)}
    </p>
  </div>
);

interface SectionTitleProps {
    children: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => (
    <h3 className="font-semibold text-gray-800 mt-6 mb-3">{children}</h3>
);

const PaymentDetails: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex-1 w-full lg:max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <ReceiptText className="text-gray-700" size={28} />
        <h2 className="text-xl font-bold text-gray-800">Rincian Pembayaran</h2>
      </div>
      
      <div className="space-y-3">
        <DetailRow label="Biaya Sewa" value={100000000} />

        <SectionTitle>Subtotal Produk Tambahan</SectionTitle>
        <DetailRow label="Pengawasan Media" value={0} />
        <DetailRow label="Asuransi" value={0} />
        <DetailRow label="Maintenance Media" value={0} />
        <DetailRow label="RMM (Remote Monitoring & Management)" value={0} />
        <DetailRow label="Augmented Reality (AR)" value={0} />
        <DetailRow label="Traffic Data Reporting" value={0} />

        <SectionTitle>Subtotal Administratif</SectionTitle>
        <DetailRow label="Penerangan" value={0} />
        <DetailRow label="Lahan" value={0} />
        <DetailRow label="Pajak PPN" value={0} />
        <DetailRow label="Pajak PPH" value={0} />

        <SectionTitle>Biaya Layanan</SectionTitle>
        <DetailRow label="Biaya Jasa" value={0} />
        <DetailRow label="Diskon" value={0} isDiscount={true} />
      </div>

      <hr className="my-6 border-gray-200" />

      <div className="flex justify-between items-center">
        <p className="text-lg font-bold text-gray-800">Total Bayar</p>
        <p className="text-lg font-bold text-gray-800">{formatCurrency(100000000)}</p>
      </div>
    </div>
  );
};

export default PaymentDetails;