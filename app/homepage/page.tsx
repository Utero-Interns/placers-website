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
  
  // Advanced filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [selectedOrientations, setSelectedOrientations] = useState<string[]>([]);
  const [selectedDisplays, setSelectedDisplays] = useState<string[]>([]);

  useEffect(() => {
    const loadBillboards = async () => {
      setLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams();
        
        // Add search query
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        // Add status filter
        if (status !== 'Semua') {
          const statusValue = status === 'Tersedia' ? 'Available' : 'Unavailable';
          params.append('status', statusValue);
        }
        
        // Add category filter (can be multiple)
        selectedCategories.forEach(cat => params.append('categoryId', cat));
        
        // Add province filter
        selectedProvinces.forEach(prov => params.append('provinceId', prov));
        
        // Add orientation filter
        selectedOrientations.forEach(ori => params.append('orientation', ori));
        
        // Add display filter
        selectedDisplays.forEach(disp => params.append('display', disp));
        
        const data = await fetchBillboards(params.toString());
        setBillboards(data);
      } catch (error) {
        console.error('Failed to fetch billboards:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBillboards();
  }, [searchQuery, status, selectedCategories, selectedProvinces, selectedOrientations, selectedDisplays]);

  // ===== PAGINATION LOGIC =====
  // Filtering now done on backend, so billboards is already filtered
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedBillboards = billboards.slice(
    startIndex,
    endIndex
  );

  // Reset ke page 1 kalau filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, status, selectedCategories, selectedProvinces, selectedOrientations, selectedDisplays]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="bg-[#FCFCFC] min-h-screen">
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        <Hero billboards={billboards} />

        <div className="mt-8">
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

          {/* 🔥 PAKAI DATA YANG SUDAH DISLICE */}
          <CardGrid billboards={paginatedBillboards} />

          {billboards.length > 0 && (
            <Pagination
              totalData={billboards.length}
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