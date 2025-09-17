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
      className="flex items-center justify-center bg-white w-full px-4 sm:px-6 lg:px-8 mt-16 md:mt-24"
    >
      <div className="flex flex-col items-center space-y-2 md:space-y-3 w-11/12">
        <SectionTag
          text="OUR GALLERY"
          bgColor="var(--color-primary)"
          textColor="white"
        />

        <h1 className="text-black text-4xl sm:text-5xl lg:text-6xl font-bold text-center leading-tight">
          Showcase Placers
        </h1>

        <p className="text-black text-lg sm:text-xl lg:text-2xl text-center">
          Jelajahi titik-titik billboard strategis terbaik dari Placers untuk
          mendukung promosi bisnis Anda.
        </p>

        {/* gallery cards container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pt-8 md:pt-10">
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
                sellerImage={"/seller-placeholder.png"} 
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