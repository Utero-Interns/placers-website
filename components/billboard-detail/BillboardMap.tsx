'use client';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import React, { useMemo } from 'react';

interface BillboardMapProps {
  latitude: number | string;
  longitude: number | string;
  address?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1rem',
};

const BillboardMap: React.FC<BillboardMapProps> = ({ latitude, longitude, address }) => {
  
  const center = useMemo(() => ({ 
    lat: Number(latitude), 
    lng: Number(longitude) 
  }), [latitude, longitude]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GMAP_API_KEY || '',
  });

  const onLoad = React.useCallback(function callback() {
  }, []);

  const onUnmount = React.useCallback(function callback() {
  }, []);

  if (!isLoaded) return <div className="w-full h-64 bg-gray-200 animate-pulse rounded-2xl" />;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        Titik Lokasi
      </h3>
      <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          <Marker
            position={center}
            title={address}
            icon={{
              url: "/artboard.png",
              scaledSize: new google.maps.Size(40, 40),
            }}
          />
        </GoogleMap>
      </div>
    </div>
  );
};

export default BillboardMap;
