'use client';

import CardGrid from '@/components/homepage/CardGrid';
import Filters from '@/components/homepage/Filters';
import Hero from '@/components/homepage/Hero';
import Pagination from '@/components/homepage/Pagination';
import { fetchBillboards } from '@/services/billboardService';
import { Billboard } from '@/types';
import { useEffect, useState } from 'react';

export default function HomepageTab() {
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('Semua');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [selectedOrientations, setSelectedOrientations] = useState<string[]>([]);
  const [selectedDisplays, setSelectedDisplays] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const loadBillboards = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (status !== 'Semua') params.append('status', status === 'Tersedia' ? 'Available' : 'Unavailable');
        if (selectedProvinces.length > 0) params.append('province', selectedProvinces[0]);
        if (selectedOrientations.length > 0) params.append('orientation', selectedOrientations[0]);
        if (selectedDisplays.length > 0) params.append('display', selectedDisplays[0]);

        let data = await fetchBillboards(params.toString());

        // Client-side category filter (backend has no category name filter)
        if (selectedCategories.length > 0) {
          data = data.filter(b =>
            selectedCategories.some(cat => b.category?.name?.toLowerCase() === cat.toLowerCase())
          );
        }
        setBillboards(data);
      } catch (error) {
        console.error("Failed to fetch billboards:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBillboards();
  }, [searchQuery, status, selectedCategories, selectedProvinces, selectedOrientations, selectedDisplays]);

  const filteredBillboards = billboards; // filtering now done server-side + in useEffect

  // Paginate filtered billboards
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBillboards = filteredBillboards.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, status, selectedCategories, selectedProvinces, selectedOrientations, selectedDisplays]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading billboards...</div>;
  }

  return (
    <div className="space-y-8">
      <Hero billboards={filteredBillboards} />
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <Filters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          status={status}
          onStatusChange={setStatus}
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
          selectedProvinces={selectedProvinces}
          onProvincesChange={setSelectedProvinces}
          selectedOrientations={selectedOrientations}
          onOrientationsChange={setSelectedOrientations}
          selectedDisplays={selectedDisplays}
          onDisplaysChange={setSelectedDisplays}
        />
        <CardGrid billboards={paginatedBillboards} />
        <Pagination
          totalData={filteredBillboards.length}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}
