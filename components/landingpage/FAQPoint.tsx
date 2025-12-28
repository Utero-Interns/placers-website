import { CircleMinus, CirclePlus } from "lucide-react";

type FAQPointProps = {
  question: string;
  answer: string;
  expanded: boolean;
  onClick: () => void;
};

export default function FAQPoint({ question, answer, expanded, onClick }: FAQPointProps) {
  return (
    <div
      className={`flex flex-col transition-all duration-300 ${expanded
          ? "bg-gradient-to-r from-[#680C0F] to-[var(--color-primary)]"
          : "bg-[#FCFCFC]"
        } border border-gray-300 rounded-[15px] py-3 px-4 md:py-4 md:px-6`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer gap-4"
        onClick={onClick}
      >
        <p
          className={`text-sm md:text-base font-semibold ${expanded ? "text-white" : "text-black"
            }`}
        >
          {question}
        </p>
        <div className="shrink-0">
          {expanded ? (
            <CircleMinus className="w-5 h-5 md:w-6 md:h-6 text-white hover:text-[var(--color-gray2)] transition-colors" />
          ) : (
            <CirclePlus className="w-5 h-5 md:w-6 md:h-6 text-black hover:text-[var(--color-gray2)] transition-colors" />
          )}
        </div>
      </div>

      {/* Answer */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
          }`}
      >
        <p
          className={`text-xs md:text-sm ${expanded ? "text-white/90" : "text-transparent"
            }`}
        >
          {answer}
        </p>
      </div>
    </div>
  );
}