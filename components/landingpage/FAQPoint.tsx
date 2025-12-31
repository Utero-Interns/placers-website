import { CircleMinus, CirclePlus } from "lucide-react";

type FAQAccess = "default" | "upgrade";

type FAQPointProps = {
  question: string;
  answer: string;
  expanded: boolean;
  access: FAQAccess;
  onClick: () => void;
};

export default function FAQPoint({
  question,
  answer,
  expanded,
  access,
  onClick,
}: FAQPointProps) {
  const isUpgrade = access === "upgrade";

  return (
    <div
      className={`flex flex-col transition-all duration-300 ${
        expanded
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
          className={`flex items-center gap-2 text-sm md:text-base font-semibold ${
            expanded ? "text-white" : "text-black"
          }`}
        >
          {question}

          {isUpgrade && (
            <span
              className={`text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full border ${
                expanded
                  ? "bg-white/20 text-white border-white/40"
                  : "bg-red-50 text-[var(--color-primary)] border-red-200"
              }`}
            >
              Upgrade
            </span>
          )}
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
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          expanded ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <p
          className={`text-xs md:text-sm ${
            expanded ? "text-white/90" : "text-transparent"
          }`}
        >
          {answer}
        </p>

        {isUpgrade && expanded && (
          <p className="mt-2 text-[10px] text-white/80">
            *Fitur ini tersedia setelah upgrade paket.
          </p>
        )}
      </div>
    </div>
  );
}