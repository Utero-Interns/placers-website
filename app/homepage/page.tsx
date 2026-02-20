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

        if (searchQuery) {
          params.append('search', searchQuery);
        }

        if (status !== 'Semua') {
          const statusValue = status === 'Tersedia' ? 'Available' : 'Unavailable';
          params.append('status', statusValue);
        }

        selectedCategories.forEach(cat => params.append('categoryId', cat));
        selectedProvinces.forEach(prov => params.append('provinceId', prov));
        selectedOrientations.forEach(ori => params.append('orientation', ori));
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

  // ===== PAGINATION =====
  // Filtering done on backend; billboards is already filtered
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedBillboards = billboards.slice(startIndex, endIndex);

  // Reset page when filters change
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
          {/* FILTER + UPGRADE BUTTON */}
          <div className="flex items-center gap-3">
            {/* FILTER */}
            <div className="flex-1">
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
            </div>

            {/* UPGRADE SMARTSCUCO */}
            <a
              href="https://smartsuco.utero.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                whitespace-nowrap
                px-4 py-2
                text-sm font-medium text-white
                rounded-lg
                bg-gradient-to-r from-[#680C0F] to-[var(--color-primary)]
                hover:opacity-90
                transition
                shadow-sm
              "
            >
              Upgrade SmartScuco
            </a>
          </div>

          {/* CARD GRID */}
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
