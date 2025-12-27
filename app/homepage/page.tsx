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
      // Adjust this based on your actual data structure. 
      // If billboard.status is strictly "Available" / "Unavailable":
      // const matchesStatus = isAvailable ? billboard.status === 'Available' : billboard.status === 'Unavailable';
      
      // If billboard.status is loose or matches UI text:
      // For now assuming the standard 'Available' / 'Unavailable' map to the UI choice.
      // Or if the API returns "Tersedia", use that.
      // Let's assume standard English for backend based on types.ts ("Available" | "Unavailable")
      
      const targetStatus = isAvailable ? 'Available' : 'Unavailable';
      // Case insensitive check just in case
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
      // const matchesName = billboard.name?.toLowerCase().includes(query); // Billboard doesn't seem to have a name property in types.ts?

      return matchesAddress || matchesType;
    }

    return true;
  });

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
        <Hero billboards={filteredBillboards}/>
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mt-8">
          <Filters 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            status={status}
            onStatusChange={setStatus}
          />
          <CardGrid billboards={filteredBillboards} />
          <Pagination />
        </div>
      </main>
      <FootBar />
    </div>   
  );
};

export default Homepage;
