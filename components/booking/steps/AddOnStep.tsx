import type { AddOnItem, BookingFormData } from '@/types';
import { CheckIcon } from 'lucide-react';
import React from 'react';

interface AddOnStepProps {
  data: BookingFormData;
  updateData: (fields: Partial<BookingFormData>) => void;
  addOns: AddOnItem[];
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





export const AddOnStep: React.FC<AddOnStepProps> = ({ data, updateData, addOns }) => {
  
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
        <div className="space-y-4">
             {addOns.length > 0 ? (
                addOns.map((addOn) => (
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