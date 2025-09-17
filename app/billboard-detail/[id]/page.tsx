'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchBillboardById } from '@/services/billboardService';
import type { BillboardApiResponse } from '@/types';

import LoadingScreen from '@/components/LoadingScreen';
import BillboardImage from '@/components/billboard-detail/BillboardImage';
import BillboardHeader from '@/components/billboard-detail/BillboardHeader';
import BillboardSpecs from '@/components/billboard-detail/BillboardSpecs';
import BillboardPriceCTA from '@/components/billboard-detail/BillboardPriceCTA';
import ShareModal from '@/components/billboard-detail/ShareModal';
import NavBar from '@/components/NavBar';
import FootBar from '@/components/footer/FootBar';

const BillboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [billboardData, setBillboardData] = useState<BillboardApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await fetchBillboardById(id);
        setBillboardData(data);
      } catch (err) {
        console.error('Failed to fetch billboard:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (!billboardData) return <div className="flex justify-center items-center min-h-screen">Billboard not found</div>;

  const { data: billboard, averageRating } = billboardData;
  const isAvailable = billboard.status === 'Available';
  const mainImageUrl = billboard.image[0]?.url || '/billboard-placeholder.png';
  const fullLocation = `${billboard.location}, ${billboard.cityName}, ${billboard.provinceName}`;
  const sellerImageUrl = 'https://i.pravatar.cc/40?u=merchant';

  return (
    <div className="bg-white min-h-screen flex flex-col">
        <NavBar />
        <div className="min-h-screen bg-white p-2 sm:p-4 lg:p-6 flex justify-center">
        <main className="bg-white rounded-2xl shadow-xl max-w-6xl w-full overflow-hidden">
            <BillboardImage
            imageSrc={mainImageUrl}
            imageAlt={billboard.category.name}
            sellerImage={sellerImageUrl}
            sellerName={billboard.owner.companyName}
            isAvailable={isAvailable}
            />

            <div className="p-6 md:p-10 space-y-10">
            <BillboardHeader title={billboard.category.name} location={fullLocation} onShare={() => setShareModalOpen(true)} />
            <BillboardSpecs size={billboard.size} orientation={billboard.orientation} display={billboard.display} />
            <BillboardPriceCTA rating={averageRating} price={billboard.rentPrice} isAvailable={isAvailable} />

            <div className="pt-6 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Informasi Tambahan</h2>
                <p className="text-gray-600 leading-relaxed">{billboard.tax}</p>
            </div>
            </div>
        </main>
        <ShareModal isOpen={isShareModalOpen} onClose={() => setShareModalOpen(false)} url={typeof window !== 'undefined' ? window.location.href : ''} />
        </div>
        <FootBar />
    </div>
    
  );
};

export default BillboardPage;
