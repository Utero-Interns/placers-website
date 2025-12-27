import type { BookingFormData } from '../types';

export const submitBooking = async (data: BookingFormData, billboardId: string): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const addOnIds = data.customAddOns 
        ? Object.entries(data.customAddOns)
            .filter(([_, isSelected]) => isSelected)
            .map(([id]) => id)
        : [];
      
    const payload = {
        billboardId,
        addOnIds,
        designId: data.designId || null, // Ensure null if undefined
        startDate: data.periodeAwal,
        endDate: data.periodeAkhir
    };
    
    const response = await fetch('/api/transaction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!result.status) {
        throw new Error(result.message || 'Transaction submission failed');
    }

    return {
        success: true,
        message: result.message || 'Transaction created successfully',
        data: result.data
    };

  } catch (error: any) {
      console.error('Submit booking error:', error);
      return {
          success: false,
          message: error.message || 'An error occurred during submission',
      };
  }
};
