import type { BookingFormData } from '../types';

export const submitBooking = (data: BookingFormData): Promise<{ success: boolean; message: string; data: BookingFormData }> => {
  console.log('Submitting booking data:', data);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Your booking has been successfully submitted!',
        data: data,
      });
    }, 1500); 
  });
};
