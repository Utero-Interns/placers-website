import React, { useState } from 'react';
import { EyeOff, Eye } from 'lucide-react';


interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput: React.FC<PasswordInputProps> = (props) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="relative">
      <input
        {...props}
        type={isVisible ? 'text' : 'password'}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 cursor-pointer"
        aria-label={isVisible ? 'Hide password' : 'Show password'}
      >
        {isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default PasswordInput;
