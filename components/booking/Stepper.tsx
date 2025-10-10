import React from 'react';
import type { Step } from '@/types';

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  const itemWidthPercent = 100 / steps.length;
  const lineMarginPercent = itemWidthPercent / 2;
  const lineWidthPercent = 100 - itemWidthPercent;

  const progressPercentage = currentStep > 0 ? (currentStep / (steps.length - 1)) * lineWidthPercent : 0;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative">
        {/* Connector Line */}
        <div
          className="absolute top-6 md:top-8 h-0.5 bg-gray-300"
          style={{ left: `${lineMarginPercent}%`, width: `${lineWidthPercent}%` }}
        ></div>
        <div
          className="absolute top-6 md:top-8 h-0.5 bg-[var(--color-primary)] transition-all duration-500"
          style={{ left: `${lineMarginPercent}%`, width: `${progressPercentage}%` }}
        ></div>

        {/* Steps */}
        <div className="relative flex items-start">
          {steps.map((step, index) => {
            const isActive = index <= currentStep;
            return (
              <div key={step.name} className="flex-1 flex flex-col items-center z-10 text-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  <step.icon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <p
                  className={`mt-2 text-xs sm:text-sm transition-colors duration-300 ${
                    isActive ? 'text-[var(--color-primary)] font-semibold' : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
