import { ArrowUpRight } from "lucide-react";

type ValuesCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
};

export default function ValuesCard({ icon: Icon, title, description }: ValuesCardProps) {
  return (
    <div className="bg-white/15 py-14 px-11 h-[390px] w-[560px] rounded-[15px] space-y-11">
      <div className="flex justify-between items-center">
        <Icon className="text-white w-20 h-20 mb-4" />
        <ArrowUpRight className="text-white w-11 h-11 mb-4" />
      </div>

      <div className="space-y-1.5 w-4/5">
        <h1 className="text-white text-3xl font-bold">{title}</h1>
        <p className="text-white text-xl">{description}</p>
      </div>
    </div>
  );
}
