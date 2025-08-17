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
    <div className="w-[418px] h-fit rounded-[15px] border-[0.5px] border-[var(--color-gray2)] overflow-hidden shadow-[0_4px_10px_var(--color-gray2)] flex flex-col">
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

      <div className="px-4 py-5 flex flex-col flex-1 space-y-3">
        
        {/* Title */}
        <div className="flex space-x-2">
          <Location variant="Bold" color="var(--color-primary)" size={24} />
          <span className="text-black text-xl font-medium truncate">{title}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {tags.map(({ text, Icon }, i) => (
            <BillboardTag key={i} text={text} Icon={Icon} />
          ))}
        </div>

        {/* Star */}
        <div className="flex items-center space-x-1">
          <div className="flex items-center space-x-0.5">
            <Star className="fill-[var(--color-browngold)] text-[var(--color-browngold)]"/>
            <h1 className="font-medium text-lg text-black">{rating}</h1>
          </div>
            
            <div
              className="w-1.5 h-1.5 rounded-full bg-black"
            ></div>
            <h1 className="font-medium text-lg text-black">{orders} Pesanan</h1>
        </div>

        {/* Price */}
        <div className="flex items-center">
          <h1 className="font-medium text-lg text-black">Mulai Dari Rp. </h1>
          <span className="font-bold text-2xl text-black">{price}</span>
        </div>

        {/* Seller */}
        <div className="flex items-center">
          <img src={sellerImage} alt="Seller Picture"
              className="h-10 w-10 rounded-full"
          />
          <h1 className="font-medium text-lg text-black">{sellerName}</h1>
        </div>

        {/* Detail button */}
        <div className="mt-auto pt-5">
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
