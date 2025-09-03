import React from "react";
import BillboardCard from "../BillboardCard";
import { Billboard } from "../../types";

type CardGridProps = {
  billboards: Billboard[];
};

const CardGrid: React.FC<CardGridProps> = ({ billboards }) => {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {billboards.map((billboard) => (
        <BillboardCard
          key={billboard.id}
            image={billboard.image}
            type={billboard.type}
            title={billboard.title}
            size={billboard.size}
            orientation={billboard.orientation}
            sides={billboard.sides}   
            rating={billboard.rating}
            orders={billboard.orders.length.toString()}
            price={billboard.price.toLocaleString()} 
            sellerImage={billboard.sellerImage}
            sellerName={billboard.sellerName}
            detailHref={`/billboard/${billboard.id}`}
        />
      ))}
    </div>
  );
};

export default CardGrid;
