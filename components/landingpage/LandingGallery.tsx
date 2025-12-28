"use client";

import { useEffect, useState } from "react";
import BillboardCard from "../BillboardCard";
import SectionTag from "./SectionTag";
import { Billboard } from "@/types";
import { fetchBillboards } from "@/services/billboardService";

export default function LandingGallery() {
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillboards().then((data) => {
      setBillboards(data.slice(0, 8));
      setLoading(false);
    });
  }, []);

  return (
    <section
      id="gallery"
      className="flex flex-col items-center justify-center 
             bg-[#FCFCFC] w-full 
             px-4 md:px-6
             py-8 md:py-10 lg:py-12"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
        {/* Tag */}
        <SectionTag
          text="OUR GALLERY"
          bgColor="var(--color-primary)"
          textColor="white"
        />

        {/* Heading & Description */}
        <div className="flex flex-col items-center text-center mt-2 md:mt-3 space-y-1">
          <h1
            className="text-black font-bold leading-snug
               text-xl sm:text-2xl md:text-3xl lg:text-3xl"
          >
            Showcase Placers
          </h1>

          <p
            className="text-black text-xs sm:text-sm md:text-base leading-relaxed"
          >
            Jelajahi titik-titik billboard strategis terbaik dari Placers untuk mendukung promosi bisnis Anda.
          </p>
        </div>

        {/* Gallery Cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
             gap-6 mt-8 w-full"
        >
          {loading ? (
            <p className="col-span-full text-center text-gray-500 text-sm">
              Loading billboards...
            </p>
          ) : (
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
          )}
        </div>
      </div>
    </section>
  );
}