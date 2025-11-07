import React from 'react';
import type { BookingFormData } from '@/types';
import { MapPinIcon } from 'lucide-react';

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
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Informasi dasar pemesan atau penyewa</h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">Nama*</label>
          <input
            type="text"
            id="nama"
            name="nama"
            value={data.nama}
            onChange={handleChange}
            placeholder="Masukkan nama"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="noTelepon" className="block text-sm font-medium text-gray-700 mb-1">No. Telepon*</label>
            <input
              type="tel"
              id="noTelepon"
              name="noTelepon"
              value={data.noTelepon}
              onChange={handleChange}
              placeholder="Masukkan no. telepon"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-1">Alamat*</label>
            <MapPinIcon className="absolute left-3 top-10 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="alamat"
              name="alamat"
              value={data.alamat}
              onChange={handleChange}
              placeholder="Masukkan alamat"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Periode Awal */}
            <div>
                <label
                htmlFor="periodeAwal"
                className="block text-sm font-medium text-gray-700 mb-1"
                >
                Periode Awal
                </label>
                <input
                type="date"
                id="periodeAwal"
                name="periodeAwal"
                value={data.periodeAwal}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-white text-gray-700 cursor-pointer"
                />
            </div>

            {/* Periode Akhir */}
            <div>
                <label
                htmlFor="periodeAkhir"
                className="block text-sm font-medium text-gray-700 mb-1"
                >
                Periode Akhir
                </label>
                <input
                type="date"
                id="periodeAkhir"
                name="periodeAkhir"
                value={data.periodeAkhir}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-white text-gray-700 cursor-pointer"
                />
            </div>
        </div>

      </div>
    </div>
  );
};
