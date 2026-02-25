import React from 'react';

type TransactionStatus = 
  | 'PENDING' 
  | 'PAID' 
  | 'EXPIRED' 
  | 'REJECTED' 
  | 'CANCELLED' 
  | 'COMPLETED';

interface StatusBadgeProps {
  status: TransactionStatus | string;
}

const statusConfig: Record<TransactionStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Menunggu',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  PAID: {
    label: 'Dibayar',
    className: 'bg-green-100 text-green-800 border-green-200'
  },
  EXPIRED: {
    label: 'Kedaluwarsa',
    className: 'bg-gray-100 text-gray-800 border-gray-200'
  },
  REJECTED: {
    label: 'Ditolak',
    className: 'bg-red-100 text-red-800 border-red-200'
  },
  CANCELLED: {
    label: 'Dibatalkan',
    className: 'bg-red-100 text-red-800 border-red-200'
  },
  COMPLETED: {
    label: 'Selesai',
    className: 'bg-blue-100 text-blue-800 border-blue-200'
  }
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status as TransactionStatus] || {
    label: status,
    className: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
}
