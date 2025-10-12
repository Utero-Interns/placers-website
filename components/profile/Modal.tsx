import React from 'react';
import { X as CloseIcon } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 transform transition-all">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              aria-label="Close modal"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
