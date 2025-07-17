'use client';

import React from 'react';

interface AuthEmailInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AuthEmailInput({ value, onChange }: AuthEmailInputProps) {
  return (
    <input
      type="text"
      placeholder="Nomor Hp atau Email"
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-[#747474]"
      required
    />
  );
}
