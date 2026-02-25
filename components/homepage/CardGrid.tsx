import React from "react";
import BillboardCard from "../BillboardCard";
import { Billboard } from "../../types";
import { SearchX } from "lucide-react";

type CardGridProps = {
  billboards: Billboard[];
};

const CardGrid: React.FC<CardGridProps> = ({ billboards }) => {
  // Empty state
  if (billboards.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border-2 border-dashed border-gray-200">
        <SearchX className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak Ada Billboard Ditemukan</h3>
        <p className="text-gray-500 text-center max-w-md">
          Tidak ada billboard yang sesuai dengan filter Anda. Coba ubah kriteria pencarian atau reset filter untuk melihat semua billboard.
        </p>
      </div>
    );
  }
  
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {
        
        billboards.map((b) => {
          const imageUrl =
            b.image?.length > 0
              ? `/api/uploads/${b.image[0].url.replace(/^uploads\//, "")}`
              : "/billboard-placeholder.png";
          
          const sellerImageUrl = b.owner?.user?.profilePicture
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
