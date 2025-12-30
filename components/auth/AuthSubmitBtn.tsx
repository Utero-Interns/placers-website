'use client';

interface AuthSubmitButtonProps {
  isLogin?: boolean;
  text?: string;
  onClick?: () => void;
}

export default function AuthSubmitButton({ isLogin, text, onClick }: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      onClick={onClick}
      className="bg-red-600 text-white rounded-md py-2 font-semibold hover:bg-red-700 transition cursor-pointer w-full"
    >
      {text || (isLogin !== undefined ? (isLogin ? 'Masuk' : 'Daftar') : 'Submit')}
    </button>
  );
}
