import type React from 'react';
import type { UserRating } from './user';

export interface Rating {
  id: string;
  transactionId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  user: UserRating;
}

export interface Transaction {
  id: string;
  buyerId: string;
  sellerId: string;
  billboardId: string;
  designId: string;
  payment: string;
  status: string;
  totalPrice: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  rating?: Rating; 
}

// booking form
export interface BookingFormData {
  // Step 1: Data Pemesanan - Periode sewa
  periodeAwal: string;
  periodeAkhir: string;

  // Step 2: Add-On
  catatan: string;
  customAddOns?: Record<string, boolean>;
  designId?: string | null;
}

export type StepName =
  | 'Data Pemesanan'
  | 'Add-On'
  | 'Include'
  | 'Review & Submit';

export interface Step {
  name: StepName;
  icon: React.ComponentType<{ className?: string }>;
}

// Order History
export enum OrderStatus {
  Upcoming = 'Upcoming',
  Completed = 'Completed',
  Ongoing = 'Ongoing',
}

export interface OrderItem {
  description: string;
  category: string;
  duration: string;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  orderDate: string;
  invoiceDate: string;
  category: string;
  location: string;
  totalCost: number;
  paymentStatus: 'Lunas';
  status: OrderStatus;
  seller: string;
  specifications: string;
  adminDetails: string[];
  serviceDetails: string[];
  billTo: {
    name: string;
    email: string;
    phone: string;
  };
  sellerInfo: {
    name: string;
    address: string;
    phone: string;
  };
  items: OrderItem[];
  subtotal: number;
  pph: number;
  ppn: number;
  serviceFee: number;
  jobFee: number;
  promo: number;
  notes: string;
}
