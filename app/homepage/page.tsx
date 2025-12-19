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
import LoadingScreen from '@/components/LoadingScreen';

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
      <LoadingScreen />
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <Hero billboards={billboards}/>
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
