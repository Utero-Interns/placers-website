import React from 'react';
import type { BookingFormData } from '@/types';

interface DataPemesananStepProps {
  data: BookingFormData;
  updateData: (fields: Partial<BookingFormData>) => void;
}

export const DataPemesananStep: React.FC<DataPemesananStepProps> = ({ data, updateData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Pilih Periode Penyewaan</h2>
      <p className="text-gray-600 text-sm">
        Tentukan periode awal dan akhir untuk penyewaan billboard Anda. Pastikan tanggal yang dipilih masih tersedia.
      </p>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Periode Awal */}
            <div>
                <label
                htmlFor="periodeAwal"
                className="block text-sm font-medium text-gray-700 mb-1"
                >
                Periode Awal*
                </label>
                <input
                type="date"
                id="periodeAwal"
                name="periodeAwal"
                value={data.periodeAwal}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-white text-gray-700 cursor-pointer"
                required
                />
            </div>

            {/* Periode Akhir */}
            <div>
                <label
                htmlFor="periodeAkhir"
                className="block text-sm font-medium text-gray-700 mb-1"
                >
                Periode Akhir*
                </label>
                <input
                type="date"
                id="periodeAkhir"
                name="periodeAkhir"
                value={data.periodeAkhir}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-white text-gray-700 cursor-pointer"
                required
                />
            </div>
        </div>

      </div>
    </div>
  );
};
