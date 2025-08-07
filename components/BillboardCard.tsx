import { Location } from "iconsax-react";
import BillboardTag from "./BillboardTag";

type BillboardTagType = {
  text: string;
  Icon: React.ComponentType<any>;
};

type BillboardCardProps = {
  image: string;
  status: string;
  title: string;
  tags: BillboardTagType[];
  detailHref: string;
};

const BillboardCard = ({
  image,
  status,
  title,
  tags,
  detailHref,
}: BillboardCardProps) => {

  const isAvailable = status === "Tersedia";
  const statusColor = isAvailable
    ? "var(--color-success)"
    : "var(--color-gray2)";
  const statusBg = isAvailable
    ? "bg-[var(--color-success)]/20"
    : "bg-[var(--color-gray2)]/20";

  return (
    <div className="w-[418px] h-[570px] rounded-[15px] border-[0.5px] border-[var(--color-gray2)] overflow-hidden shadow-[0_4px_10px_var(--color-gray2)]">
      <div className="relative">
        <img
          src={image}
          alt="Billboard"
          className="w-full h-[233px] object-cover"
        />
        <h1 className="absolute bottom-0 left-7 font-bold text-2xl">
          BILLBOARD
        </h1>
      </div>

      <div className="px-4 py-5 space-y-2">
        {/* Status tag */}
        <div className="flex justify-end">
          <div
            className={`flex items-center space-x-2 w-fit py-0.5 px-4 rounded-[10px] ${statusBg}`}
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: statusColor }}
            ></div>
            <span style={{ color: statusColor }}>{status}</span>
          </div>
        </div>

        {/* Title */}
        <div className="flex space-x-2">
          <Location variant="Bold" color="var(--color-primary)" size={24} />
          <span className="text-black text-xl font-medium">{title}</span>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <h1 className="text-[var(--color-secondary)]/80 font-semibold text-lg">
            Kriteria
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            {tags.map(({ text, Icon }, i) => (
              <BillboardTag key={i} text={text} Icon={Icon} />
            ))}
          </div>
        </div>

        {/* Detail button */}
        <div className="mt-5">
          <a
            href={detailHref}
            className="bg-[var(--color-primary)] text-[20px] py-1.5 px-40 rounded-[10px] font-medium"
          >
            Detail
          </a>
        </div>
      </div>
    </div>
  );
};

export default BillboardCard;
