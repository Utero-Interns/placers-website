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
             p-6 transition-all duration-300
             hover:bg-white/20 hover:shadow-xl hover:scale-[1.02]
             sm:p-8 xl:p-10 2xl:p-12
             aspect-[16/9] min-h-[300px]"
    >
      {/* icon + arrow */}
      <div className="flex justify-between items-start">
        <Icon
          className="text-white w-12 h-12 
                     md:w-14 md:h-14 
                     2xl:w-16 2xl:h-16"
        />
        <ArrowUpRight
          className="text-white/80 group-hover:text-white
                     w-7 h-7 md:w-9 md:h-9 2xl:w-10 2xl:h-10
                     transition-colors duration-200"
        />
      </div>

      {/* content */}
      <div className="mt-6 space-y-3 w-full xl:w-5/6 2xl:w-4/5">
        <h2
          className="text-white font-bold leading-snug
                     text-xl md:text-2xl 2xl:text-3xl"
        >
          {title}
        </h2>
        <p
          className="text-white/80 leading-relaxed
                     text-xs md:text-sm 2xl:text-base"
        >
          {description}
        </p>
      </div>
    </div>
  );
}