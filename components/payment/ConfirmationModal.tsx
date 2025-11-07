import React from 'react';
import { X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
          <X size={24} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Melakukan Pembayaran</h2>
        <p className="text-gray-600 mb-8">Apakah Anda yakin untuk melakukan pembayaran ini?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors cursor-pointer"
          >
            Tidak
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-md bg-[var(--color-primary)] text-white font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors cursor-pointer"
          >
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
