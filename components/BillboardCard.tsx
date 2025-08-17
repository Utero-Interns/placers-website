import { Location } from "iconsax-react";
import { Star } from "lucide-react";
import BillboardTag from "./BillboardTag";

type BillboardTagType = {
  text: string;
  Icon: React.ComponentType<any>;
};

type BillboardCardProps = {
  image: string;
  sellerImage: string;
  rating: string;
  orders: string;
  title: string;
  tags: BillboardTagType[];
  sellerName: string;
  price: string;
  detailHref: string;
};

const BillboardCard = ({
  image,
  sellerImage,
  rating,
  orders,
  title,
  tags,
  sellerName,
  price,
  detailHref,
}: BillboardCardProps) => {

  return (
    <div className="w-full h-full rounded-[15px] border-[0.5px] border-[var(--color-gray2)] overflow-hidden shadow-[0_4px_10px_var(--color-gray2)] flex flex-col">
      <div className="relative">
        <img
          src={image}
          alt="Billboard"
          className="w-full aspect-video object-cover" // Changed from fixed height to aspect-ratio
        />
        <h1 className="absolute bottom-2 left-4 font-bold text-xl md:text-2xl">
          BILLBOARD
        </h1>
      </div>

      <div className="px-4 py-5 flex flex-col flex-1 space-y-3">
        
        {/* Title */}
        <div className="flex items-start space-x-2">
          <Location variant="Bold" color="var(--color-primary)" size={24} className="flex-shrink-0 mt-0.5" />
          <span className="text-black text-lg md:text-xl font-medium">{title}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {tags.map(({ text, Icon }, i) => (
            <BillboardTag key={i} text={text} Icon={Icon} />
          ))}
        </div>

        {/* Star */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Star className="fill-[var(--color-browngold)] text-[var(--color-browngold)] w-5 h-5"/>
            <h1 className="font-medium text-base md:text-lg text-black">{rating}</h1>
          </div>
            
            <div
              className="w-1.5 h-1.5 rounded-full bg-black"
            ></div>
            <h1 className="font-medium text-base md:text-lg text-black">{orders} Pesanan</h1>
        </div>

        {/* Price */}
        <div className="flex items-baseline">
          <h1 className="font-medium text-base md:text-lg text-black mr-1">Mulai Dari Rp.</h1>
          <span className="font-bold text-xl md:text-2xl text-black">{price}</span>
        </div>

        {/* Seller */}
        <div className="flex items-center space-x-2">
          <img src={sellerImage} alt="Seller Picture"
              className="h-10 w-10 rounded-full object-cover"
          />
          <h1 className="font-medium text-base md:text-lg text-black truncate">{sellerName}</h1>
        </div>

        {/* Detail button */}
        <div className="mt-auto pt-4">
          <a
            href={detailHref}
            className="block w-full bg-[var(--color-primary)] text-white text-lg md:text-xl py-2 px-4 rounded-[10px] font-medium text-center transition-transform duration-200 hover:scale-105 active:scale-100"
          >
            Detail
          </a>
        </div>
      </div>
    </div>
  );
};

export default BillboardCard;