'use client';

import FootBar from '@/components/footer/FootBar';
import CardGrid from '@/components/homepage/CardGrid';
import Filters from '@/components/homepage/Filters';
import Hero from '@/components/homepage/Hero';
import Pagination from '@/components/homepage/Pagination';
import LoadingScreen from '@/components/LoadingScreen';
import NavBar from '@/components/NavBar';
import { fetchBillboards } from '@/services/billboardService';
import { Billboard } from '@/types';
import React, { useEffect, useState } from 'react';

const ITEMS_PER_PAGE = 8;

const Homepage: React.FC = () => {
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadBillboards = async () => {
      setLoading(true);
      try {
        const data = await fetchBillboards();
        setBillboards(data);
      } catch (error) {
        console.error('Failed to fetch billboards:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBillboards();
  }, []);

  // ===== FILTER =====
  const filteredBillboards = billboards.filter((billboard) => {
    if (status !== 'Semua') {
      const targetStatus = status === 'Tersedia' ? 'Available' : 'Unavailable';
      if (billboard.status?.toLowerCase() !== targetStatus.toLowerCase()) {
        return false;
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        billboard.location?.toLowerCase().includes(query) ||
        billboard.cityName?.toLowerCase().includes(query) ||
        billboard.provinceName?.toLowerCase().includes(query) ||
        billboard.category?.name?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // ===== PAGINATION LOGIC =====
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedBillboards = filteredBillboards.slice(
    startIndex,
    endIndex
  );

  // Reset ke page 1 kalau filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, status]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="bg-[#FCFCFC] min-h-screen">
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        <Hero billboards={filteredBillboards} />

        <div className="mt-8">
          <Filters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            status={status}
            onStatusChange={setStatus}
          />

          {/* 🔥 PAKAI DATA YANG SUDAH DISLICE */}
          <CardGrid billboards={paginatedBillboards} />

          {filteredBillboards.length > 0 && (
            <Pagination
              totalData={filteredBillboards.length}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </main>

      <FootBar />
    </div>
  );
};

export default Homepage;