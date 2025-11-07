import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center">
        <Image
          src="/logo-placers-red.png"
          alt="App Logo"
          className="w-40 h-40 animate-bounce mb-6"
        />
      </div>
    </div>
  );
}