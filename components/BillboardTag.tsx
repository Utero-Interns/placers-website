import React from "react";

interface BillboardTagProps {
  text: string;
  Icon: React.ComponentType<{ color: string; size: number }>;
}

const BillboardTag: React.FC<BillboardTagProps> = ({ text, Icon }) => {
  return (
    <div className="flex items-center space-x-1.5 bg-[var(--color-gray2)]/10 rounded-full px-4 py-1 md:px-6 md:py-1.5 w-fit">
      <Icon color="var(--color-primary)" size={20} />
      <span className="text-[var(--color-secondary)]/80 text-sm md:text-lg font-medium">
        {text}
      </span>
    </div>
  );
};

export default BillboardTag;