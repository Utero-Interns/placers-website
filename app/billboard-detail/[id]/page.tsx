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
import { toast } from 'sonner';

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
          fetchBookmarks(),
        ]);
        setBillboardData(data);
        setIsBookmarked(bookmarks.some(b => b.id === id));
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

    const prevState = isBookmarked;
    setIsBookmarked(!isBookmarked); // Optimistic update

    try {
      const success = isBookmarked
        ? await removeBookmark(id)
        : await addBookmark(id);

      if (!success) {
        throw new Error('Bookmark operation failed');
      }

      toast.success(isBookmarked ? 'Bookmark dihapus' : 'Ditambahkan ke bookmark');
    } catch (error) {
      // Revert state on failure
      setIsBookmarked(prevState);
      toast.error('Gagal mengubah bookmark. Silakan coba lagi.');
      console.error('Bookmark error:', error);
    }
  };

  if (loading) return <LoadingScreen />;
  if (!billboardData)
    return <div className="flex justify-center items-center min-h-screen">Billboard not found</div>;

  const { data: billboard, averageRating } = billboardData;
  const isAvailable = billboard.status === 'Available';

  const images =
    billboard.image?.length > 0
      ? billboard.image.map(img => ({
          url: `/api/uploads/${img.url.replace(/^uploads\//, '')}`,
        }))
      : [{ url: '/billboard-placeholder.png' }];

  const fullLocation = `${billboard.location}, ${billboard.cityName}, ${billboard.provinceName}`;
  const sellerImageUrl = billboard.owner.user.profilePicture
    ? `/api/uploads/${billboard.owner.user.profilePicture.replace(/^uploads\//, '')}`
    : '/default-avatar.png';

  const ratings: Rating[] = billboard.transaction
    .map(tx => tx.rating)
    .filter((r): r is Rating => !!r);

  return (
    <div className="bg-[#FCFCFC] min-h-screen flex flex-col">
      <NavBar />

      {/* ⬇️ SAMA PERSIS DENGAN HOMEPAGE */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <BillboardImage
            images={images}
            imageAlt={billboard.category.name}
            sellerImage={sellerImageUrl}
            sellerId={billboard.owner.id}
            sellerName={billboard.owner.companyName}
            isAvailable={isAvailable}
          />

          <div className="p-6 md:p-8 space-y-8">
            <BillboardHeader
              title={billboard.category.name}
              location={fullLocation}
              onShare={() => setShareModalOpen(true)}
              isBookmarked={isBookmarked}
              onToggleBookmark={handleToggleBookmark}
            />

            <BillboardSpecs
              size={billboard.size}
              orientation={billboard.orientation}
              display={billboard.display}
            />

            <BillboardPriceCTA
              rating={averageRating}
              price={billboard.rentPrice}
              isAvailable={isAvailable}
              billboardId={billboard.id}
            />

            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Informasi Tambahan
              </h2>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700">
                <div className="sm:col-span-2">
                  <dt className="font-semibold text-gray-900">Deskripsi</dt>
                  <dd className="mt-1 text-gray-600 leading-relaxed whitespace-pre-line break-words">
                    {billboard.description?.trim() || 'Tidak ada deskripsi tersedia'}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-gray-900">Alamat</dt>
                  <dd>{billboard.location}</dd>
                </div>

                <div>
                  <dt className="font-semibold text-gray-900">Kota</dt>
                  <dd>{billboard.cityName}</dd>
                </div>

                <div>
                  <dt className="font-semibold text-gray-900">Provinsi</dt>
                  <dd>{billboard.provinceName}</dd>
                </div>

                <div>
                  <dt className="font-semibold text-gray-900">Kepemilikan Tanah</dt>
                  <dd>{billboard.landOwnership}</dd>
                </div>

                <div>
                  <dt className="font-semibold text-gray-900">Harga Jasa</dt>
                  <dd>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(Number(billboard.servicePrice))}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-gray-900">Pajak</dt>
                  <dd>{billboard.tax}</dd>
                </div>
              </dl>
            </div>

            <BillboardReviews averageRating={averageRating} ratings={ratings} />
          </div>
        </div>
      </main>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setShareModalOpen(false)}
        url={typeof window !== 'undefined' ? window.location.href : ''}
      />

      <FootBar />
    </div>
  );
};

export default BillboardPage;