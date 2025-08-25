import { ArrowUpRight } from "lucide-react";

type ValuesCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
};

export default function ValuesCard({ icon: Icon, title, description }: ValuesCardProps) {
  return (
    <div className="bg-white/15 rounded-[15px] flex flex-col justify-between
                   p-6 space-y-6 min-h-[300px]
                   md:p-8 md:space-y-8
                   xl:p-10 xl:space-y-10 
                   2xl:py-14 2xl:px-11 2xl:space-y-11 2xl:min-h-[390px] 2xl:w-fit">
      <div className="flex justify-between items-start">
        <Icon className="text-white 
                       w-12 h-12 
                       md:w-16 md:h-16 
                       2xl:w-20 2xl:h-20" />
        <ArrowUpRight className="text-white 
                               w-8 h-8 
                               md:w-10 md:h-10 
                               2xl:w-11 2xl:h-11" />
      </div>

      <div className="space-y-1.5 w-full xl:w-5/6 2xl:w-4/5">
        <h1 className="text-white font-bold
                       text-xl
                       md:text-2xl
                       2xl:text-3xl">{title}</h1>
        <p className="text-white
                      text-base
                      md:text-lg
                      2xl:text-xl">{description}</p>
      </div>
    </div>
  );
}