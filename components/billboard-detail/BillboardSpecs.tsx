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
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Spesifikasi</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {specifications.map((spec) => (
          <div key={spec.label} className="flex items-center space-x-2">
            <spec.icon className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-400">{spec.label}</p>
              <p className="font-medium text-gray-800 text-sm">{spec.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillboardSpecs;
