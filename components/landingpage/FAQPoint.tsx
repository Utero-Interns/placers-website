import { useState } from "react";
import { CircleMinus, CirclePlus } from "lucide-react";

type FAQPointProps = {
  question: string;
  answer: string;
};

export default function FAQPoint({ question, answer }: FAQPointProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`flex flex-col transition-all duration-300 ${
        expanded
          ? "bg-gradient-to-r from-[#680C0F] to-[var(--color-primary)]"
          : "bg-white"
      } border border-[var(--color-gray1)] rounded-[15px] py-8 px-9`}
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <p
          className={`text-[22px] font-semibold ${
            expanded ? "text-white" : "text-black"
          }`}
        >
          {question}
        </p>
        {expanded ? (
          <CircleMinus className="w-11 h-11 text-white hover:text-[var(--color-gray2)]" />
        ) : (
          <CirclePlus className="w-11 h-11 text-black hover:text-[var(--color-gray2)]" />
        )}
      </div>

      {expanded && (
        <p className="text-[20px] text-white w-3/4 mt-4">
          {answer}
        </p>
      )}
    </div>
  );
}
