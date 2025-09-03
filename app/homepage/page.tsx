'use client';

import React, { useEffect, useState } from 'react';
import Hero from '@/components/homepage/Hero';
import Filters from '@/components/homepage/Filters';
import CardGrid from '@/components/homepage/CardGrid';
import Pagination from '@/components/homepage/Pagination';
import { Billboard } from '@/types';
import { fetchBillboards } from '@/services/billboardService';
import NavBar from '@/components/NavBar';
import FootBar from '@/components/footer/FootBar';

const Homepage: React.FC = () => {
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    // Splashscreen
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-primary)]">
        <div className="flex flex-col items-center">
          <img
            src="/logo-placers-white.png"
            alt="App Logo"
            className="w-40 h-40 animate-bounce mb-6"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <Hero />
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mt-8">
          <Filters />
          <CardGrid billboards={billboards} />
          <Pagination />
        </div>
      </main>
      <FootBar />
    </div>   
  );
};

export default Homepage;
