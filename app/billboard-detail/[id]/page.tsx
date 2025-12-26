'use client';
import { fetchBillboardById } from '@/services/billboardService';
import { addBookmark, fetchBookmarks, removeBookmark } from '@/services/bookmarkService';
import type { BillboardDetailApiResponse, Rating } from '@/types';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import LoadingScreen from '@/components/LoadingScreen';
import NavBar from '@/components/NavBar';
import BillboardHeader from '@/components/billboard-detail/BillboardHeader';
import BillboardImage from '@/components/billboard-detail/BillboardImage';
import BillboardPriceCTA from '@/components/billboard-detail/BillboardPriceCTA';
import BillboardReviews from '@/components/billboard-detail/BillboardReview';
import BillboardSpecs from '@/components/billboard-detail/BillboardSpecs';
import ShareModal from '@/components/billboard-detail/ShareModal';
import FootBar from '@/components/footer/FootBar';

const BillboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [billboardData, setBillboardData] = useState<BillboardDetailApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const [data, bookmarks] = await Promise.all([
            fetchBillboardById(id),
            fetchBookmarks()
        ]);
        setBillboardData(data);
        
        const isBm = bookmarks.some(b => b.id === id);
        setIsBookmarked(isBm);
      } catch (err) {
        console.error('Failed to fetch billboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleToggleBookmark = async () => {
    if (!id) return;
    
    // Optimistic UI update
    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);

    let success;
    if (previousState) {
        success = await removeBookmark(id);
    } else {
        success = await addBookmark(id);
    }

    if (!success) {
        // Revert if API call fails
        setIsBookmarked(previousState);
        alert("Gagal mengubah status bookmark");
    }
  };

  if (loading) return <LoadingScreen />;
  if (!billboardData) return <div className="flex justify-center items-center min-h-screen">Billboard not found</div>;
  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  const { data: billboard, averageRating } = billboardData;
  const isAvailable = billboard.status === 'Available';

  const images = billboard.image?.length > 0
  ? billboard.image.map((img) => ({
      url: `/api/uploads/${img.url.replace(/^uploads\//, "")}`, 
    }))
  : [{ url: '/billboard-placeholder.png' }];

  const fullLocation = `${billboard.location}, ${billboard.cityName}, ${billboard.provinceName}`;
  const sellerImageUrl = billboard.owner.user.profilePicture
    ? `/api/uploads/${billboard.owner.user.profilePicture.replace(/^uploads\//, "")}`
    : '/default-avatar.png';

  const ratings: Rating[] = billboard.transaction
  .map(tx => tx.rating)
  .filter((r): r is Rating => !!r);


  return (
    <div className="bg-white min-h-screen flex flex-col">
        <NavBar />
        <div className="min-h-screen bg-white p-2 sm:p-4 lg:p-6 flex justify-center">
        <main className="bg-white rounded-2xl shadow-xl max-w-11/12 w-full overflow-hidden">
            <BillboardImage
            images={images}
            imageAlt={billboard.category.name}
            sellerImage={sellerImageUrl}
            sellerId={billboard.owner.id}
            sellerName={billboard.owner.companyName}
            isAvailable={isAvailable}
            />

            <div className="p-6 md:p-10 space-y-10">
              <BillboardHeader 
                title={billboard.category.name} 
                location={fullLocation} 
                onShare={() => setShareModalOpen(true)}
                isBookmarked={isBookmarked}
                onToggleBookmark={handleToggleBookmark} 
               />
              <BillboardSpecs size={billboard.size} orientation={billboard.orientation} display={billboard.display} />
              <BillboardPriceCTA rating={averageRating} price={billboard.rentPrice} isAvailable={isAvailable} billboardId={billboard.id} />

              <div className="pt-6 border-t border-gray-200">

                <h2 className="text-2xl font-bold text-gray-800 mb-4">Informasi Tambahan</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
                  {/* Description gets full width */}
                  <div className="sm:col-span-2">
                    <dt className="font-medium text-gray-900">Deskripsi</dt>
                    <dd className="leading-relaxed mt-1 text-gray-600 whitespace-pre-line break-words">
                      {billboard.description?.trim()
                        ? billboard.description
                        : "Tidak ada deskripsi tersedia"}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-medium text-gray-900">Alamat</dt>
                    <dd className="leading-relaxed">{billboard.location}</dd>
                  </div>

                  <div>
                    <dt className="font-medium text-gray-900">Kota</dt>
                    <dd className="leading-relaxed">{billboard.cityName}</dd>
                  </div>

                  <div>
                    <dt className="font-medium text-gray-900">Provinsi</dt>
                    <dd className="leading-relaxed">{billboard.provinceName}</dd>
                  </div>

                  <div>
                    <dt className="font-medium text-gray-900">Kepemilikan Tanah</dt>
                    <dd className="leading-relaxed">{billboard.landOwnership}</dd>
                  </div>

                  <div>
                    <dt className="font-medium text-gray-900">Harga Jasa</dt>
                    <dd className="leading-relaxed">
                      {formatPrice(Number(billboard.servicePrice))}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-medium text-gray-900">Pajak</dt>
                    <dd className="leading-relaxed">{billboard.tax}</dd>
                  </div>
                </dl>
              </div>

              {/* Reviews */}
                <BillboardReviews averageRating={averageRating} ratings={ratings} />

            </div>
        </main>
        <ShareModal isOpen={isShareModalOpen} onClose={() => setShareModalOpen(false)} url={typeof window !== 'undefined' ? window.location.href : ''} />
        </div>
        <FootBar />
    </div>
    
  );
};

export default BillboardPage;
