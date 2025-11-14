import React from 'react';
import { Order } from '@/types';
import { ArrowLeft, Printer } from 'lucide-react';
import Image from 'next/image';

interface InvoicePageProps {
  order: Order;
  onBack: () => void;
}

const InvoicePage: React.FC<InvoicePageProps> = ({ order, onBack }) => {

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 2xl:max-w-4xl">
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium print:hidden cursor-pointer">
          <ArrowLeft size={20} />
          Kembali ke Riwayat Pesanan
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12" id="invoice-content">
        {/* Header */}
        <header className="flex justify-between items-start mb-10">
          <Image src="/placers-logo-text-red.png" width={500} height={500} className="h-16 w-auto" alt="Placers Logo" />
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">INVOICE</h1>
            <p className="text-sm text-gray-500">#{order.invoiceNumber}</p>
          </div>
        </header>

        {/* Invoice Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 text-sm">
          <div>
            <h3 className="font-semibold text-gray-500 uppercase tracking-wider mb-2">Tanggal Order</h3>
            <p className="text-gray-700">{order.orderDate}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-500 uppercase tracking-wider mb-2">Tanggal Invoice</h3>
            <p className="text-gray-700">{order.invoiceDate}</p>
          </div>
           <div>
            <h3 className="font-semibold text-gray-500 uppercase tracking-wider mb-2">Order ID</h3>
            <p className="text-gray-700">{order.id}</p>
          </div>
        </div>

        {/* Billing Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10 text-sm">
          <div>
            <h3 className="font-semibold text-gray-500 uppercase tracking-wider mb-2">Ditagihkan kepada</h3>
            <p className="font-bold text-gray-800">{order.billTo.name}</p>
            <p className="text-gray-600">{order.billTo.email}</p>
            <p className="text-gray-600">{order.billTo.phone}</p>
          </div>
          <div className="sm:text-right">
            <h3 className="font-semibold text-gray-500 uppercase tracking-wider mb-2">Penjual</h3>
            <p className="font-bold text-gray-800">{order.sellerInfo.name}</p>
            <p className="text-gray-600">{order.sellerInfo.address}</p>
            <p className="text-gray-600">{order.sellerInfo.phone}</p>
          </div>
        </div>

        {/* Items Table - Responsive */}
        <div className="mb-10">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Deskripsi</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Kategori</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wider">Durasi</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wider">Harga Satuan</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 text-gray-800">{item.description}</td>
                      <td className="px-4 py-4 text-gray-600">{item.category}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-gray-600">{item.duration}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-gray-600">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-right font-medium text-gray-800">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Rincian Item</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="mb-3">
                    <p className="font-semibold text-gray-800 break-words">{item.description}</p>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-gray-500 pr-2">Kategori</span>
                      <span className="text-right">{item.category || '-'}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-gray-500 pr-2">Durasi</span>
                      <span className="text-right">{item.duration || '-'}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-gray-500 pr-2">Harga Satuan</span>
                      <span className="text-right">{formatCurrency(item.unitPrice)}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 my-3"></div>
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatCurrency(item.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="flex justify-end mb-10">
          <div className="w-full max-w-sm text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-800 font-medium">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">PPN (Pajak Pertambahan Nilai)</span>
              <span className="text-gray-800 font-medium">{formatCurrency(order.ppn)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">PPH (Pajak Penghasilan)</span>
              <span className="text-gray-800 font-medium">{formatCurrency(order.pph)}</span>
            </div>
             <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Biaya Layanan</span>
              <span className="text-gray-800 font-medium">{formatCurrency(order.serviceFee)}</span>
            </div>
             <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Biaya Pekerjaan</span>
              <span className="text-gray-800 font-medium">{formatCurrency(order.jobFee)}</span>
            </div>
            {order.promo > 0 && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Promo</span>
                <span className="text-[var(--color-primary)] font-medium">-{formatCurrency(order.promo)}</span>
              </div>
            )}
            <div className="flex justify-between py-3 mt-2 bg-gray-100 px-4 rounded-lg">
              <span className="font-bold text-gray-900 text-base">Total Biaya</span>
              <span className="font-bold text-[var(--color-primary)] text-base">{formatCurrency(order.totalCost)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="mb-10 text-sm">
            <h3 className="font-semibold text-gray-500 uppercase tracking-wider mb-2">Catatan</h3>
            <p className="text-gray-600 italic bg-gray-50 p-3 rounded-lg">{order.notes}</p>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-gray-500 pt-8 border-t">
          <p>Terima kasih telah melakukan transaksi di placers.</p>
          <p>Jika ada pertanyaan, silakan hubungi kami di support@placers.com</p>
        </footer>
      </div>

      <div className="mt-8 flex justify-end print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[var(--color-primary)] text-white hover:bg-red-700 rounded-lg px-5 py-2.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
        >
          <Printer size={18} />
          Cetak / Unduh
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;