'use client';

import React, { useState, useMemo, useEffect } from "react";
import BillboardCard from "@/components/BillboardCard";
import CategoryTabs from "@/components/seller-profile/CategoryTabs";
import { fetchBillboards } from "@/services/billboardService";
import { Plus } from "lucide-react";
import Image from "next/image";
import type { Billboard } from "@/types";
import NavBar from "@/components/NavBar";
import FootBar from "@/components/footer/FootBar";
import { useParams } from "next/navigation";

const SellerProfile: React.FC = () => {
  const params = useParams();
  const sellerId = params?.id as string;

  const categories = ["Semua", "Billboard", "Baliho", "Videotron", "Roadsign"];

  const [activeCategory, setActiveCategory] = useState("Semua");
  const [allBillboards, setAllBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBillboards = async () => {
      setLoading(true);
      try {
        const data = await fetchBillboards();
        setAllBillboards(data);
      } catch (error) {
        console.error("Failed to fetch billboards:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBillboards();
  }, []);

  // Filter to only this seller's billboards
  const billboards = useMemo(() => {
    if (!sellerId) return allBillboards;
    return allBillboards.filter(b => b.ownerId === sellerId);
  }, [allBillboards, sellerId]);

  // Derive seller info from first billboard's owner
  const sellerName = billboards[0]?.owner?.fullname || billboards[0]?.owner?.companyName || 'Seller';
  const sellerCity = billboards[0]?.cityName || '-';
  const sellerProvince = billboards[0]?.provinceName || '';
  const sellerPicture = billboards[0]?.owner?.user?.profilePicture
    ? `/api/uploads/${billboards[0].owner.user.profilePicture.replace(/^uploads\//, '')}`
    : '/seller-placeholder.png';

  const filteredBillboards = useMemo(() => {
    if (activeCategory === "Semua") return billboards;
    return billboards.filter((billboard) => {
      const billboardCategory = billboard.category?.name?.toLowerCase() || "";
      return billboardCategory === activeCategory.toLowerCase();
    });
  }, [activeCategory, billboards]);

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-5 mt-5">

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Image
              src={sellerPicture}
              alt="Seller"
              width={250}
              height={250}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{sellerName}</h1>
              <p className="text-gray-500">{sellerCity}{sellerProvince ? ` • ${sellerProvince}` : ''}</p>
            </div>
          </div>

          <button className="flex items-center justify-center space-x-2 bg-[var(--color-primary)] hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md w-full sm:w-auto cursor-pointer">
            <Plus className="w-5 h-5" />
            <span>Ikuti</span>
          </button>
        </header>

        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {/* Grid / Loading */}
        <main>
          {loading ? (
            <div className="text-center py-16">Loading...</div>
          ) : filteredBillboards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-8">
              {filteredBillboards.map((billboard) => (
                <BillboardCard
                  key={billboard.id}
                  id={billboard.id}
                  title={billboard.description || "No Title"}
                  type={billboard.category?.name || "Unknown"}
                  size={billboard.size || "-"}
                  orientation={billboard.orientation || "-"}
                  sides={billboard.display || "-"}
                  rating={billboard.averageRating || 0}
                  price={billboard.sellPrice || billboard.rentPrice || "0"}
                  image={billboard.image?.[0]?.url || "/billboard-placeholder.png"}
                  sellerName={billboard.owner?.fullname || "Unknown Seller"}
                  sellerImage={billboard.owner?.user?.profilePicture || "/seller-placeholder.png"}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">No products found in this category.</p>
            </div>
          )}
        </main>
      </div>
      <FootBar />
    </div>
  );
};

export default SellerProfile;
