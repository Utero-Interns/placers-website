import React from "react";
import BillboardCard from "../BillboardCard";
import { Billboard } from "../../types";

type CardGridProps = {
  billboards: Billboard[];
};

const CardGrid: React.FC<CardGridProps> = ({ billboards }) => {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {billboards.map((b) => (
        <BillboardCard
          key={b.id}
          image={b.image[0]?.url || "/billboard-placeholder.png"}
          type={b.category?.name || "Billboard"}
          title={b.location}
          size={b.size}
          orientation={b.orientation}
          sides={b.display}
          rating={b.averageRating}
          price={b.rentPrice}
          sellerImage={"/seller-placeholder.png"}
          sellerName={b.owner?.fullname || "Unknown"}
          id={b.id}
        />
      ))}
    </div>
  );
};

export default CardGrid;
