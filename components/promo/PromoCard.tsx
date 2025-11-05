import React from "react";

interface PromoCardProps {
  title: string;
  description: string;
  period: string;
}

export default function PromoCard({ title, description, period }: PromoCardProps) {
  return (
    <div className="border border-gray-300 rounded-lg p-5 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-base text-black">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <p className="text-sm text-gray-500 mt-2">{period}</p>
      </div>
      <div className="flex justify-end mt-4">
        <button className="bg-[var(--color-primary)] text-white text-sm px-4 py-2 rounded-md hover:bg-red-700 transition">
          Gunakan Promo
        </button>
      </div>
    </div>
  );
}