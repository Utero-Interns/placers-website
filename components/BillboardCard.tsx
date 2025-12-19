import { useState } from "react";
import { Location } from "iconsax-react";
import { SidebarOpen, Grid2X2, Rotate3D, Star } from "lucide-react";
import BillboardTag from "./BillboardTag";
import { formatPrice } from "@/utils/formatPrice";
import Image from "next/image";

type BillboardCardProps = {
  image: string;
  type: string;
  title: string;
  size: string;
  orientation: string;
  sides: string;
  rating: number;
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
  price,
  sellerImage,
  sellerName,
  id,
}: BillboardCardProps) => {
  // ✅ State-based fallbacks
  const [billboardSrc, setBillboardSrc] = useState(image);
  const [sellerSrc, setSellerSrc] = useState(sellerImage);

  return (
    <div className="w-full h-full rounded-[15px] border-[0.5px] border-[var(--color-gray2)] overflow-hidden shadow-[0_4px_10px_var(--color-gray2)] flex flex-col">
      {/* Billboard image */}
      <div className="relative">
        <Image
          src={billboardSrc}
          alt="Billboard"
          width={500}
          height={500}
          className="w-full aspect-video object-cover"
          onError={() => {
            if (billboardSrc !== "/billboard-placeholder.png") {
              setBillboardSrc("/billboard-placeholder.png");
            }
          }}
        />
      </div>

      <div className="px-4 py-5 flex flex-col flex-1 space-y-3">
        <h1 className="font-bold text-xl md:text-2xl text-black">
          {type}
        </h1>

        {/* Title */}
        <div className="flex items-start space-x-2">
          <Location
            variant="Bold"
            color="var(--color-primary)"
            size={24}
            className="flex-shrink-0 mt-0.5"
          />
          <span className="text-black text-lg md:text-xl font-medium truncate">
            {title}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <BillboardTag text={size} Icon={Grid2X2} />
          <BillboardTag text={orientation} Icon={Rotate3D} />
          <BillboardTag text={sides} Icon={SidebarOpen} />
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Star className="fill-[var(--color-star)] text-[var(--color-star)] w-5 h-5" />
            <h1 className="font-medium text-base md:text-lg text-black">
              {rating}
            </h1>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline">
          <h1 className="font-medium text-base md:text-lg text-black mr-1">
            Mulai Dari Rp.
          </h1>
          <span className="font-bold text-xl md:text-2xl text-black">
            {formatPrice(Number(price))}
          </span>
        </div>

        {/* Seller */}
        <div className="flex items-center space-x-2">
          <Image
            src={sellerSrc}
            alt="Seller Picture"
            width={250}
            height={250}
            className="h-10 w-10 rounded-full object-cover"
            onError={() => {
              if (sellerSrc !== "/seller-placeholder.png") {
                setSellerSrc("/seller-placeholder.png");
              }
            }}
          />
          <h1 className="font-medium text-base md:text-lg text-black truncate">
            {sellerName}
          </h1>
        </div>

        {/* Detail button */}
        <div className="mt-auto pt-4">
          <a
            href={`/billboard-detail/${id}`}
            className="block w-full bg-[var(--color-primary)] text-white text-lg md:text-xl py-2 px-4 rounded-[10px] font-medium text-center hover:text-[var(--color-primary)] hover:bg-gray-200"
          >
            Detail
          </a>
        </div>
      </div>
    </div>
  );
};

export default BillboardCard;
