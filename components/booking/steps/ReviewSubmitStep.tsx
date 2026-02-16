import { AddOnApiResponse, AddOnItem, BookingFormData } from '@/types';
import React, { useEffect, useState } from 'react';

interface ReviewSubmitStepProps {
  data: BookingFormData;
}

const ReviewSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">{title}</h3>
    <div className="space-y-2 text-sm text-gray-600">
      {children}
    </div>
  </div>
);

const ReviewItem: React.FC<{ label: string; value: string | number | React.ReactNode }> = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row">
    <p className="font-medium text-gray-500 w-full sm:w-1/3">{label}:</p>
    <p className="w-full sm:w-2/3">{value || '-'}</p>
  </div>
);


export const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({ data }) => {
  const [fetchedAddOns, setFetchedAddOns] = useState<AddOnItem[]>([]);

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
      }
    };

    fetchAddOns();
  }, []);

  const getSelectedAddOnNames = () => {
      if (!data.customAddOns) return [];
      
      const selectedIds = Object.entries(data.customAddOns)
        .filter(([isSelected]) => isSelected)
        .map(([id]) => id);
      
      return selectedIds.map(id => {
          const addon = fetchedAddOns.find(item => item.id === id);
          return addon ? addon.name : null;
      }).filter(Boolean);
  };

  const dynamicAddOns = getSelectedAddOnNames();

  const addOnServices = [
    ...dynamicAddOns,
    data.augmentedReality > 0 && `Augmented Reality (AR) x${data.augmentedReality}`,
    data.trafficDataReporting > 0 && `Traffic Data Reporting x${data.trafficDataReporting}`,
  ].filter(Boolean);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Periksa kembali detail pesanan sebelum Anda melakukan pembayaran.</h2>
      <div className="space-y-6">
        <ReviewSection title="Detail Pesanan">
          <ReviewItem label="Periode Sewa" value={`${data.periodeAwal} - ${data.periodeAkhir}`} />
          <div className="pt-2">
            <p className="font-medium text-gray-500">Detail:</p>
            <ul className="list-disc list-inside pl-2 text-gray-600">
              <li>Billboard, Jalan abcd</li>
              <li>Spesifikasi: a, b, c, d</li>
            </ul>
          </div>
        </ReviewSection>

        <ReviewSection title="Pilihan Layanan Tambahan">
          {addOnServices.length > 0 ? (
              <ul className="space-y-1">
                  {addOnServices.map((service, index) => (
                      <li key={index} className="flex items-start">
                         <span className="text-[var(--color-primary)] font-bold mr-2">•</span>
                         <span>{service}</span>
                      </li>
                  ))}
              </ul>
          ) : <p>-</p>}
           <div className="mt-4 pt-4 border-t border-gray-100">
               <ReviewItem label="Catatan" value={data.catatan} />
           </div>
        </ReviewSection>
      </div>
    </div>
  );
};