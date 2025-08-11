import React from "react";

interface BillboardTagProps {
  text: string;
  Icon: React.ComponentType<{ color: string; size: number }>;
}

const BillboardTag: React.FC<BillboardTagProps> = ({ text, Icon }) => {
  return (
    <div className="flex items-center space-x-2 bg-[var(--color-gray2)]/10 rounded-full px-6 py-1.5 w-fit">
      <Icon color="var(--color-primary)" size={24} />
      <span className="text-[var(--color-secondary)]/80 text-lg font-medium">{text}</span>
    </div>
  );
};

export default BillboardTag;
