'use client';

interface AuthSubmitButtonProps {
  isLogin: boolean;
  onClick?: () => void;
}

export default function AuthSubmitButton({ isLogin, onClick }: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      onClick={onClick}
      className="bg-red-600 text-white rounded-md py-2 font-semibold hover:bg-red-700 transition cursor-pointer w-full"
    >
      {isLogin ? 'Masuk' : 'Daftar'}
    </button>
  );
}
