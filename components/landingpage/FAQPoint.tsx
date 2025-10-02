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
      className={`flex flex-col transition-all duration-300 ${
        expanded
          ? "bg-gradient-to-r from-[#680C0F] to-[var(--color-primary)]"
          : "bg-white"
      } border border-gray-300 rounded-[15px] py-4 px-6 md:py-5 md:px-7`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onClick}
      >
        <p
          className={`text-base md:text-lg font-semibold ${
            expanded ? "text-white" : "text-black"
          }`}
        >
          {question}
        </p>
        {expanded ? (
          <CircleMinus className="w-7 h-7 md:w-9 md:h-9 text-white hover:text-[var(--color-gray2)] transition-colors" />
        ) : (
          <CirclePlus className="w-7 h-7 md:w-9 md:h-9 text-black hover:text-[var(--color-gray2)] transition-colors" />
        )}
      </div>

      {/* Answer */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          expanded ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <p
          className={`text-sm md:text-base ${
            expanded ? "text-white" : "text-transparent"
          }`}
        >
          {answer}
        </p>
      </div>
    </div>
  );
}