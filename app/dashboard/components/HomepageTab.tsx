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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const loadBillboards = async () => {
      setLoading(true);
      try {
        const data = await fetchBillboards();
        setBillboards(data);
      } catch (error) {
        console.error("Failed to fetch billboards:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBillboards();
  }, []);

  // Filter logic
  const filteredBillboards = billboards.filter(billboard => {
    // 1. Status Filter
    if (status !== 'Semua') {
      const isAvailable = status === 'Tersedia';
      const targetStatus = isAvailable ? 'Available' : 'Unavailable';
      // Case insensitive check
      if (billboard.status?.toLowerCase() !== targetStatus.toLowerCase()) {
        return false;
      }
    }

    // 2. Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesAddress = billboard.location?.toLowerCase().includes(query) || 
                             billboard.cityName?.toLowerCase().includes(query) ||
                             billboard.provinceName?.toLowerCase().includes(query);
      const matchesType = billboard.category?.name?.toLowerCase().includes(query);

      return matchesAddress || matchesType;
    }

    return true;
  });

  // Paginate filtered billboards
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBillboards = filteredBillboards.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, status]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading billboards...</div>;
  }

  return (
    <div className="space-y-8">
      <Hero billboards={filteredBillboards}/>
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <Filters 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            status={status}
            onStatusChange={setStatus}
            selectedCategories={[]}
            onCategoriesChange={() => {}}
            selectedProvinces={[]}
            onProvincesChange={() => {}}
            selectedOrientations={[]}
            onOrientationsChange={() => {}}
            selectedDisplays={[]}
            onDisplaysChange={() => {}}
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
