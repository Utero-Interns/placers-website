import { useLanguage } from '@/app/context/LanguageContext';
import { formatPrice } from "@/utils/formatPrice";
import { Location } from "iconsax-react";
import { Grid2X2, Rotate3D, SidebarOpen, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import BillboardTag from "./BillboardTag";

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
  const { t } = useLanguage();
  const [billboardSrc, setBillboardSrc] = useState(image);
  const [sellerSrc, setSellerSrc] = useState(sellerImage);

  return (
    <div className="w-full h-full rounded-xl border border-gray-300 overflow-hidden shadow-sm flex flex-col bg-white">
      {/* Billboard image */}
      <div className="relative w-full aspect-video">
        <Image
          src={billboardSrc}
          alt="Billboard"
          fill
          className="object-cover"
          onError={() => {
            if (billboardSrc !== "/billboard-placeholder.png") {
              setBillboardSrc("/billboard-placeholder.png");
            }
          }}
        />
      </div>

      <div className="p-4 flex flex-col flex-1 space-y-3">
        <h1 className="font-bold text-lg md:text-xl text-black leading-tight">
          {type}
        </h1>

        {/* Title */}
        <div className="flex items-start space-x-2">
          <Location
            variant="Bold"
            color="var(--color-primary)"
            size={20}
            className="flex-shrink-0 mt-0.5"
          />
          <span className="text-black text-sm md:text-base font-medium line-clamp-1">
            {title}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          <BillboardTag text={size} Icon={Grid2X2} />
          <BillboardTag text={orientation} Icon={Rotate3D} />
          <BillboardTag text={sides} Icon={SidebarOpen} />
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1.5">
          <Star className="fill-[var(--color-star)] text-[var(--color-star)] w-4 h-4" />
          <span className="font-medium text-sm md:text-base text-black">
            {rating}
          </span>
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <span className="text-[10px] md:text-xs text-gray-500">Mulai Dari</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs md:text-sm font-medium text-black">Rp.</span>
            <span className="font-bold text-lg md:text-xl text-black">
              {formatPrice(Number(price))}
            </span>
          </div>
        </div>

        {/* Seller */}
        <div className="flex items-center space-x-2 pt-1">
          <Image
            src={sellerSrc}
            alt="Seller Picture"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
            onError={() => {
              if (sellerSrc !== "/seller-placeholder.png") {
                setSellerSrc("/seller-placeholder.png");
              }
            }}
          />
          <span className="font-medium text-sm md:text-base text-black truncate">
            {sellerName}
          </span>
        </div>

        {/* Detail button */}
        <div className="mt-auto pt-3">
          <a
            href={`/billboard-detail/${id}`}
            className="block w-full bg-[var(--color-primary)] text-white text-sm md:text-base py-2 px-4 rounded-lg font-semibold text-center transition-colors hover:bg-opacity-90"
          >
            {t('homepage.billboard_card.detail')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default BillboardCard;
