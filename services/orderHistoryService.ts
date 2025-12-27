
export interface HistoryQueryParams {
  take?: number;
  cursor?: string;
  search?: string;
  status?: string;
  city?: string;
  province?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface BackendTransaction {
  id: string;
  status: string; // PENDING | PAID | EXPIRED | REJECTED | CANCELLED | COMPLETED
  totalPrice: string;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  billboard: {
    id: string;
    cityName: string;
    provinceName: string;
    size: string;
  };
  design: {
    id: string;
    name: string;
  } | null;
}

export interface PricingAddOn {
  id: string;
  name: string;
  price: number;
}

export interface DetailedBillboard {
  id: string;
  tax?: string;
  size: string;
  display?: string;
  cityName: string;
  lighting?: string;
  description?: string;
  orientation?: string;
  provinceName: string;
  landOwnership?: string;
}

export interface HistoryPricing {
  mode?: string;
  addOns?: PricingAddOn[] | string[];
  period?: {
    startDate: string;
    endDate: string;
  };
  prices?: {
    base?: number;
    total?: number | string;
    rentPrice?: number | null;
    sellPrice?: number | null;
    addOnTotal?: number;
    designPrice?: number | string | null;
    servicePrice?: number | string | null;
  };
  billboard?: DetailedBillboard;
}

export interface HistoryItem {
  id: string;
  transactionId: string;
  pricing: HistoryPricing;
  createdAt: string;
  transaction: BackendTransaction;
}

export interface HistoryApiResponse {
  status: boolean;
  message: string;
  data: HistoryItem[];
  meta: {
    take: number;
    nextCursor: string | null;
  };
}

export const getOrders = async (params?: HistoryQueryParams): Promise<HistoryApiResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params) {
    if (params.take) searchParams.append('take', params.take.toString());
    if (params.cursor) searchParams.append('cursor', params.cursor);
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    if (params.city) searchParams.append('city', params.city);
    if (params.province) searchParams.append('province', params.province);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortDir) searchParams.append('sortDir', params.sortDir);
  }

  const response = await fetch(`/api/history?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.statusText}`);
  }

  return response.json();
};
