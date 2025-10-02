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
      setBillboards(data);
      setLoading(false);
    });
  }, []);

  return (
    <section
      id="gallery"
      className="flex flex-col items-center justify-center 
             bg-white w-full 
             px-6 md:px-12 2xl:px-20 
             py-14 md:py-18 lg:py-20"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
        {/* Tag */}
        <SectionTag
          text="OUR GALLERY"
          bgColor="var(--color-primary)"
          textColor="white"
        />

        {/* Heading & Description */}
        <div className="flex flex-col items-center text-center mt-2 md:mt-4 space-y-2">
          <h1
            className="text-black font-bold leading-snug
               text-xl sm:text-2xl md:text-3xl lg:text-4xl"
          >
            Showcase Placers
          </h1>

          <p
            className="text-black text-sm sm:text-base md:text-lg leading-relaxed"
          >
            Jelajahi titik-titik billboard strategis terbaik dari Placers untuk mendukung promosi bisnis Anda.
          </p>
        </div>

        {/* Gallery Cards */}
        {/* Gallery Cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
             gap-6 mt-10 w-full"
        >
          {loading ? (
            <p className="col-span-full text-center text-gray-500">
              Loading billboards...
            </p>
          ) : (
            billboards.map((b) => (
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
                sellerImage="/seller-placeholder.png"
                sellerName={b.owner?.fullname || "Unknown"}
                id={b.id}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}