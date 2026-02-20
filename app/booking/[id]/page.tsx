'use client';

import NavBar from '@/components/NavBar';
import { NavigationButtons } from '@/components/booking/NavigationButtons';
import { Stepper } from '@/components/booking/Stepper';
import { AddOnStep } from '@/components/booking/steps/AddOnStep';
import { DataPemesananStep } from '@/components/booking/steps/DataPemesananStep';
import { IncludeStep } from '@/components/booking/steps/IncludeStep';
import { ReviewSubmitStep } from '@/components/booking/steps/ReviewSubmitStep';
import FootBar from '@/components/footer/FootBar';
import { submitBooking } from '@/services/bookingService';
import type { BookingFormData, Step } from '@/types';
import { PackageCheckIcon, PuzzleIcon, SendIcon, UserIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

const steps: Step[] = [
  { name: 'Data Pemesanan', icon: UserIcon },
  { name: 'Add-On', icon: PuzzleIcon },
  { name: 'Include', icon: PackageCheckIcon },
  { name: 'Review & Submit', icon: SendIcon },
];

const initialFormData: BookingFormData = {
  periodeAwal: '',
  periodeAkhir: '',
  catatan: '',
};

function Booking() {
  const params = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ success: boolean; message: string } | null>(null);

  const updateData = useCallback((fields: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  }, []);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSubmitting(true);
      setSubmissionResult(null);
      try {
        const billboardId = params?.id as string;
        const result = await submitBooking(formData, billboardId);
        setSubmissionResult(result);
        
        if (result.success) {
          toast.success('Booking berhasil dibuat!');
        } else {
          // Handle failed submission with specific error message
          toast.error(result.message || 'Terjadi kesalahan, silakan coba lagi');
        }
      } catch (error: unknown) {
        console.error('Booking submission error:', error);
        
        // Parse backend error message if available
        let errorMessage = 'Terjadi kesalahan, silakan coba lagi';
        
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          // Provide user-friendly messages for common errors
          if (err.message.includes('401') || err.message.includes('unauthorized')) {
            errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
          } else if (err.message.includes('400') || err.message.includes('validation')) {
            errorMessage = 'Data yang Anda masukkan tidak valid. Periksa kembali formulir.';
          } else if (err.message.includes('404')) {
            errorMessage = 'Billboard tidak ditemukan. Mungkin sudah tidak tersedia.';
          } else if (err.message.includes('409') || err.message.includes('conflict')) {
            errorMessage = 'Periode yang Anda pilih sudah dibooking. Pilih tanggal lain.';
          } else if (err.message.includes('network') || err.message.includes('fetch')) {
            errorMessage = 'Koneksi bermasalah. Periksa internet Anda dan coba lagi.';
          }
        }
        
        toast.error(errorMessage);
        setSubmissionResult({ success: false, message: errorMessage });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isNextDisabled = useMemo(() => {
    if (currentStep === 0) {
      return !formData.periodeAwal || !formData.periodeAkhir;
    }
    return false;
  }, [currentStep, formData]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <DataPemesananStep data={formData} updateData={updateData} />;
      case 1:
        return <AddOnStep data={formData} updateData={updateData} />;
      case 2:
        return <IncludeStep />;
      case 3:
        return <ReviewSubmitStep data={formData} />;
      default:
        return null;
    }
  };

  if (submissionResult?.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Booking Submitted!</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">{submissionResult.message}</p>
          </div>
          <div className="mt-4">
            <button
              onClick={() => {
                setSubmissionResult(null);
                setCurrentStep(0);
                setFormData(initialFormData);
              }}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--color-primary)] rounded-lg shadow-sm hover:bg-[var(--color-primary)]/80"
            >
              Create New Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      <NavBar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2">Lengkapi Form dibawah ini</h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto">
            Ikuti langkah-langkah berikut untuk menyelesaikan proses pemesanan titik iklan Anda.
          </p>
        </header>

        <main>
          <Stepper steps={steps} currentStep={currentStep} />

          <div className="mt-12 md:mt-16 max-w-11/12 mx-auto bg-gray-50 p-6 sm:p-8 md:p-12 rounded-xl shadow-sm border border-gray-200">
            {renderStepContent()}
            <NavigationButtons
              currentStep={currentStep}
              totalSteps={steps.length}
              isSubmitting={isSubmitting}
              onBack={handleBack}
              onNext={handleNext}
              isNextDisabled={isNextDisabled}
            />
            {submissionResult && !submissionResult.success && (
              <p className="text-sm text-[var(--color-primary)] mt-4 text-right">{submissionResult.message}</p>
            )}
          </div>
        </main>
      </div>
      <FootBar />
    </div>
  );
}

export default Booking;
