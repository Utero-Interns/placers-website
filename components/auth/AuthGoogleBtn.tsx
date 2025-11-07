'use client';

import Image from "next/image";

type AuthGoogleButtonProps = {
  onClick?: () => void;
};

export default function AuthGoogleButton({ onClick }: AuthGoogleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="z-10 flex items-center justify-center gap-2 border-2 border-black rounded-md py-2 text-[#747474] bg-white cursor-pointer hover:border-red-600"
    >

      <Image 
        src="/google-logo.png" 
        alt="google logo"
        className="w-5 h-5"
      />
      Google

    </button>
  );
}
