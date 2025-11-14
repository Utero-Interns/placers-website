'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Stepper } from '@/components/booking/Stepper';
import { DataPemesananStep } from '@/components/booking/steps/DataPemesananStep';
import { AddOnStep } from '@/components/booking/steps/AddOnStep';
import { IncludeStep } from '@/components/booking/steps/IncludeStep';
import { ReviewSubmitStep } from '@/components/booking/steps/ReviewSubmitStep';
import { NavigationButtons } from '@/components/booking/NavigationButtons';
import { submitBooking } from '@/services/bookingService';
import type { BookingFormData, Step } from '@/types';
import { UserIcon, PuzzleIcon, PackageCheckIcon, SendIcon } from 'lucide-react';
import NavBar from '@/components/NavBar';
import FootBar from '@/components/footer/FootBar';

const steps: Step[] = [
  { name: 'Data Pemesanan', icon: UserIcon },
  { name: 'Add-On', icon: PuzzleIcon },
  { name: 'Include', icon: PackageCheckIcon },
  { name: 'Review & Submit', icon: SendIcon },
];

const initialFormData: BookingFormData = {
  nama: '',
  noTelepon: '',
  alamat: '',
  periodeAwal: '',
  periodeAkhir: '',
  penerangan: 'Pilih jenis penerangan',
  lahan: 'Pilih lahan',
  pajakPPN: 'Pilih status PPN',
  pajakPPH: 'Pilih status PPH',
  pengawasanMedia: true,
  asuransi: true,
  nomorAsuransi: '',
  maintenanceMedia: false,
  rmm: false,
  augmentedReality: 0,
  trafficDataReporting: 0,
  catatan: '',
};

function Booking() {
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
        const result = await submitBooking(formData);
        setSubmissionResult(result);
      } catch {
        setSubmissionResult({ success: false, message: 'An error occurred during submission.' });
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
      return !formData.nama || !formData.noTelepon || !formData.alamat;
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
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
