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

const Homepage: React.FC = () => {

  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('Semua');

  const [currentPage, setCurrentPage] = React.useState(1);

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

  if (loading) {
    return (
      <LoadingScreen />
    );
  }

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
          <CardGrid billboards={filteredBillboards} />
          {filteredBillboards.length > 0 && (
            <Pagination
              totalData={filteredBillboards.length}
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
