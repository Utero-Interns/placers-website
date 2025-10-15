import React from 'react';
import { Wallet } from 'lucide-react';

type PaymentMethod = {
  id: string;
  name: string;
  type: string;
}

interface PaymentMethodsProps {
  selectedMethod: string | null;
  onSelectMethod: (id: string) => void;
  onConfirm: () => void;
}

const paymentMethodsData: PaymentMethod[] = [
  { id: 'bca_va_1', name: 'BCA', type: 'Virtual Account' },
  { id: 'bca_va_2', name: 'BCA', type: 'Virtual Account' },
  { id: 'bca_va_3', name: 'BCA', type: 'Virtual Account' },
  { id: 'bca_va_4', name: 'BCA', type: 'Virtual Account' },
];

const BcaLogo: React.FC = () => (
    <div className="flex items-center gap-2">
        <div className="w-10 h-6 bg-blue-600 rounded-sm flex items-center justify-center text-white font-bold text-xs italic">
            BCA
        </div>
    </div>
);

interface PaymentMethodItemProps {
    method: PaymentMethod;
    isSelected: boolean;
    onSelect: () => void;
}

const PaymentMethodItem: React.FC<PaymentMethodItemProps> = ({ method, isSelected, onSelect }) => {
    return (
        <div
            onClick={onSelect}
            className={`flex justify-between items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)] bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
        >
            <div className="flex items-center gap-4">
                <BcaLogo />
                <div>
                    <p className="font-semibold text-gray-800">{method.name}</p>
                    <p className="text-sm text-gray-500">{method.type}</p>
                </div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
                ${isSelected ? 'border-[var(--color-primary)] bg-white' : 'border-gray-300 bg-white'}"
            >
                {isSelected && <div className="w-2.5 h-2.5 bg-[var(--color-primary)] rounded-full"></div>}
            </div>
        </div>
    );
};


const PaymentMethods: React.FC<PaymentMethodsProps> = ({ selectedMethod, onSelectMethod, onConfirm }) => {
  const isButtonEnabled = selectedMethod !== null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex-1 w-full">
      <div className="flex items-center gap-3 mb-6">
        <Wallet className="text-gray-700" size={28} />
        <h2 className="text-xl font-bold text-gray-800">Metode Pembayaran</h2>
      </div>

      <div className="space-y-4">
        {paymentMethodsData.map((method) => (
          <PaymentMethodItem
            key={method.id}
            method={method}
            isSelected={selectedMethod === method.id}
            onSelect={() => onSelectMethod(method.id)}
          />
        ))}
      </div>

      <div className="mt-8 text-xs text-gray-500">
        Dengan menekan tombol berikut, Anda menyetujui <a href="#" className="text-[var(--color-primary)] font-medium hover:underline">Syarat dan Ketentuan</a> serta <a href="#" className="text-[var(--color-primary)] font-medium hover:underline">Kebijakan Privasi</a>.
      </div>
      
      <button
        onClick={onConfirm}
        disabled={!isButtonEnabled}
        className={`w-full mt-4 py-3 rounded-lg text-white font-bold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${
          isButtonEnabled
            ? 'bg-[var(--color-primary)] hover:bg-red-700 focus:ring-[var(--color-primary)]'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        Lakukan Pembayaran
      </button>
    </div>
  );
};

export default PaymentMethods;
