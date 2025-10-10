import React from 'react';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  isSubmitting,
  onBack,
  onNext,
  isNextDisabled = false,
}) => {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-end items-center gap-4 mt-8 md:mt-12">
      {currentStep > 0 && (
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 transition-colors"
        >
          Sebelumnya
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={isNextDisabled || isSubmitting}
        className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--color-primary)] rounded-lg shadow-sm hover:bg-[var(--color-primary)]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Submitting...' : isLastStep ? 'Lanjut Pembayaran' : 'Selanjutnya'}
      </button>
    </div>
  );
};