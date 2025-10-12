import React from "react";
import BillboardCard from "../BillboardCard";
import { Billboard } from "../../types";

type CardGridProps = {
  billboards: Billboard[];
};

const CardGrid: React.FC<CardGridProps> = ({ billboards }) => {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {
        
        billboards.map((b) => {
          const imageUrl =
            b.image?.length > 0
              ? `/api/uploads/${b.image[0].url.replace(/^uploads\//, "")}`
              : "/billboard-placeholder.png";
          
          const sellerImageUrl = b.owner.user.profilePicture
              ? `/api/uploads/${b.owner.user.profilePicture.replace(/^uploads\//, "")}`
              : '/seller-placeholder.png';

          return (
            <BillboardCard
              key={b.id}
              image={imageUrl}
              type={b.category?.name || "Billboard"}
              title={b.location}
              size={b.size}
              orientation={b.orientation}
              sides={b.display}
              rating={b.averageRating}
              price={b.rentPrice}
              sellerImage={sellerImageUrl}
              sellerName={b.owner?.fullname || "Unknown"}
              id={b.id}
            />
          );
        })

      }
    </div>
  );
};

export default CardGrid;
