'use client';

import React from 'react';

interface AuthFormProps {
  children: React.ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

export default function AuthForm({ children, className = '', onSubmit }: AuthFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-col gap-4 p-8 bg-white rounded-lg shadow-md w-full max-w-md ${className}`}
    >
      {children}
    </form>
  );
}
