export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white gap-x-8">
        {/* Left Side - Image */}
        <div className="w-1/3 hidden items-center justify-center md:flex">
          <img src="/auth-illust.png" alt="auth-illustration" className="max-w-full h-auto" />
        </div>

        {/* Right Side - Form Box */}
        <div className="w-[90%] md:w-1/3 flex items-center justify-center">
            {children}
        </div>
    </div>
    
  );
}
