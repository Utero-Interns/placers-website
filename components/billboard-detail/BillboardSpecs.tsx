import { GridIcon, CompassIcon, MonitorIcon } from 'lucide-react';
import React from 'react';

interface Specs {
  size: string;
  orientation: string;
  display: string;
}

const BillboardSpecs: React.FC<Specs> = ({ size, orientation, display }) => {
  const specifications = [
    { label: 'Ukuran', value: size, icon: GridIcon },
    { label: 'Orientasi', value: orientation, icon: CompassIcon },
    { label: 'Tampilan', value: display, icon: MonitorIcon },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-500 uppercase tracking-wider mb-4">Spesifikasi</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6 md:gap-8">
        {specifications.map((spec) => (
          <div key={spec.label} className="flex items-center space-x-3">
            <spec.icon className="w-10 h-10 text-[var(--color-primary)] flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800 text-lg">{spec.label}</p>
              <p className="text-gray-500 text-lg">{spec.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillboardSpecs;
