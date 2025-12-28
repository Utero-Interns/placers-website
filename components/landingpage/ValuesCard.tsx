import { ArrowUpRight } from "lucide-react";

type ValuesCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
};

export default function ValuesCard({ icon: Icon, title, description }: ValuesCardProps) {
  return (
    <div
      className="group w-full bg-white/10 backdrop-blur-sm
       rounded-2xl flex flex-col justify-between
       p-5 transition-all duration-300
       hover:bg-white/20 hover:shadow-xl hover:scale-[1.02]
       sm:p-6 xl:p-8
       min-h-[220px] md:min-h-[260px]
       gap-y-4 overflow-hidden"
    >
      {/* icon + arrow */}
      <div className="flex justify-between items-start">
        <Icon
          className="text-white w-10 h-10 
               md:w-12 md:h-12 
               2xl:w-14 2xl:h-14"
        />
        <ArrowUpRight
          className="text-white/80 group-hover:text-white
               w-6 h-6 md:w-7 md:h-7 2xl:w-8 2xl:h-8
               transition-colors duration-200"
        />
      </div>

      {/* content */}
      <div className="space-y-2 w-full">
        <h2
          className="text-white font-bold leading-snug
               text-sm md:text-xl 2xl:text-2xl"
        >
          {title}
        </h2>
        <p
          className="text-white/80 leading-relaxed
               text-xs md:text-sm 2xl:text-base break-words whitespace-normal"
        >
          {description}
        </p>
      </div>
    </div>
  );
}