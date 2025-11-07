import React from "react";

interface BillboardTagProps {
  text: string;
  Icon: React.ComponentType<{ color: string; size: number }>;
}

const BillboardTag: React.FC<BillboardTagProps> = ({ text, Icon }) => {
  return (
    <div className="flex items-center space-x-1.5 bg-[var(--color-gray2)]/10 
                    rounded-full px-3 py-0.5 md:px-4 md:py-1 w-fit">
      <Icon color="var(--color-primary)" size={16} />
      <span className="text-[var(--color-secondary)]/80 text-xs md:text-sm font-medium">
        {text}
      </span>
    </div>
  );
};

export default BillboardTag;
