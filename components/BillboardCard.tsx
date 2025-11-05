import { Location } from "iconsax-react";
import { SidebarOpen, Grid2X2, Rotate3D, Star } from "lucide-react";
import BillboardTag from "./BillboardTag";
import { formatPrice } from "@/utils/formatPrice";

type BillboardCardProps = {
  image: string;
  type: string;
  title: string;
  size: string;
  orientation: string;
  sides: string;
  rating: number;
  // orders: string;
  price: string;
  sellerImage: string;
  sellerName: string;
  id: string;
};

const BillboardCard = ({
  image,
  type,
  title,
  size,
  orientation,
  sides,
  rating,
  // orders,
  price,
  sellerImage,
  sellerName,
  id,
}: BillboardCardProps) => {

  return (
    <div
      className="w-full h-full rounded-[15px] border border-gray-300 
         overflow-hidden flex flex-col transition-shadow duration-300 ease-in-out 
         hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={image}
          alt="Billboard"
          className="w-full aspect-video object-cover"
          onError={(e) => (e.currentTarget.src = "/billboard-placeholder.png")}
        />
      </div>

      {/* Content */}
      <div className="px-4 py-5 flex flex-col flex-1 space-y-3">
        {/* Type */}
        <h1 className="font-bold text-lg md:text-xl text-black uppercase tracking-wide">
          {type}
        </h1>

        {/* Location */}
        <div className="flex items-start space-x-2">
          <Location
            variant="Bold"
            color="var(--color-primary)"
            size={18}
            className="flex-shrink-0 mt-0.5"
          />
          <span className="text-black text-sm md:text-base font-medium leading-snug">
            {title}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <BillboardTag text={size} Icon={Grid2X2} />
          <BillboardTag text={orientation} Icon={Rotate3D} />
          <BillboardTag text={sides} Icon={SidebarOpen} />
        </div>

        {/* Rating + Orders */}
        <div className="flex items-center space-x-2">
          <Star className="fill-[var(--color-star)] text-[var(--color-star)] w-4 h-4" />
          <h1 className="font-medium text-sm md:text-base text-black">{rating}</h1>
          <span className="text-xs md:text-sm text-gray-600">• 17 Pesanan</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline">
          <h1 className="font-medium text-base md:text-lg text-black mr-1">Mulai Dari Rp.</h1>
          <span className="font-bold text-xl md:text-2xl text-black">{formatPrice(Number(price))}</span>
        </div>

          {/* Seller */}
          <div className="flex items-center space-x-2">
            <img
              src={sellerImage}
              alt="Seller Picture"
              className="h-8 w-8 md:h-9 md:w-9 rounded-full object-cover"
              onError={(e) => (e.currentTarget.src = "/seller-placeholder.png")}
            />
            <h1 className="font-medium text-sm md:text-base text-black truncate">
              {sellerName}
            </h1>
          </div>

          {/* Detail button */}
          <a
            href={`/billboard-detail/${id}`}
            className="block w-full bg-[var(--color-primary)] text-white 
           text-sm md:text-base py-2 px-4 rounded-[10px] 
           font-medium text-center"
          >
            Detail
          </a>
        </div>
      </div>
    </div>
  );
};

export default BillboardCard;