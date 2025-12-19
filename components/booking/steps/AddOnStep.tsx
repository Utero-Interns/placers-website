import type { BookingFormData } from '@/types';
import { CheckIcon } from 'lucide-react';
import React from 'react';

interface AddOnStepProps {
  data: BookingFormData;
  updateData: (fields: Partial<BookingFormData>) => void;
}

const CustomCheckbox: React.FC<{
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ id, name, label, checked, onChange }) => (
  <div className="flex items-center">
    <input
      id={id}
      name={name}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="hidden"
    />
    <label htmlFor={id} className="flex items-center cursor-pointer">
      <div className={`w-5 h-5 flex justify-center items-center border-2 rounded-sm transition-all duration-200 ${checked ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-gray-400'}`}>
        {checked && <CheckIcon className="w-4 h-4 text-white" />}
      </div>
      <span className="ml-3 text-gray-700">{label}</span>
    </label>
  </div>
);

const QuantityInput: React.FC<{
  label: string;
  price: string;
  value: number;
  onUpdate: (value: number) => void;
}> = ({ label, price, value, onUpdate }) => {
  const handleDecrement = () => onUpdate(Math.max(0, value - 1));
  const handleIncrement = () => onUpdate(value + 1);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <p className="text-sm text-gray-500 mb-2">Rp {price}</p>
      <div className="flex items-center border border-gray-300 rounded-lg w-32">
        <button type="button" onClick={handleDecrement} className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-l-lg cursor-pointer">-</button>
        <input type="text" readOnly value={value} className="w-full text-center bg-white border-l border-r border-gray-300 text-gray-700 outline-none" />
        <button type="button" onClick={handleIncrement} className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-r-lg cursor-pointer">+</button>
      </div>
    </div>
  );
};


import { AddOnApiResponse, AddOnItem } from '@/types';
import { useEffect, useState } from 'react';

export const AddOnStep: React.FC<AddOnStepProps> = ({ data, updateData }) => {
  const [fetchedAddOns, setFetchedAddOns] = useState<AddOnItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAddOns = async () => {
      try {
        const response = await fetch('/api/add-on');
        const result: AddOnApiResponse = await response.json();
        if (result.status && Array.isArray(result.data)) {
          setFetchedAddOns(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch add-ons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddOns();
  }, []);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ [e.target.name]: e.target.checked });
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateData({ [e.target.name]: e.target.value });
  };

  const handleCustomAddOnObjChange = (id: string, checked: boolean) => {
    const currentCustom = data.customAddOns || {};
    updateData({
      customAddOns: {
        ...currentCustom,
        [id]: checked
      }
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Opsi layanan tambahan untuk meningkatkan penyewaan</h2>
      
      <div className="space-y-6">
        {/* Dynamic Add-Ons Section */}
        {!loading && (
          <div className="space-y-4">
             {fetchedAddOns.length > 0 ? (
                fetchedAddOns.map((addOn) => (
                    <div key={addOn.id} className="flex items-center gap-8">
                        <CustomCheckbox 
                            id={addOn.id} 
                            name={`addon_${addOn.id}`} 
                            label={addOn.name} 
                            checked={!!data.customAddOns?.[addOn.id]} 
                            onChange={(e) => handleCustomAddOnObjChange(addOn.id, e.target.checked)} 
                        />
                        <div className="text-sm text-gray-500">
                            <span className="block font-medium">Rp {parseInt(addOn.price).toLocaleString('id-ID')}</span>
                            <span className="text-xs">{addOn.description}</span>
                        </div>
                    </div>
                ))
             ) : (
                <p className="text-gray-500">Tidak ada layanan tambahan tersedia saat ini.</p>
             )}
          </div>
        )}
        
        {/* Static Quantity Inputs */}
        <div className="pt-4 border-t border-gray-200">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <QuantityInput label="Augmented Reality (AR)" price="5.000.000" value={data.augmentedReality} onUpdate={(val) => updateData({ augmentedReality: val })} />
                <QuantityInput label="Traffic Data Reporting" price="3.000.000" value={data.trafficDataReporting} onUpdate={(val) => updateData({ trafficDataReporting: val })} />
             </div>
        </div>
        
        {/* Notes Section */}
        <div>
          <label htmlFor="catatan" className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
          <textarea
            id="catatan"
            name="catatan"
            rows={4}
            value={data.catatan}
            onChange={handleTextChange}
            placeholder="Tambahkan catatan jika ada"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition"
          ></textarea>
        </div>
      </div>
    </div>
  );
};