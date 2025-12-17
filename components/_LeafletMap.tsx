"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

import type { Map as LeafMap } from 'leaflet';

export default function LeafletMap() {
  type LeafletMapWithId = LeafMap & {
    _leaflet_id?: number;
  };

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Prevent duplicate map initialization
    if ((mapRef.current as unknown as LeafletMapWithId)?._leaflet_id) return;

    // 📍 Alun-Alun Malang
    const center: [number, number] = [-7.9813, 112.6304];

    const map = L.map(mapRef.current).setView(center, 16);

    // OSM tile layer
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO',
      }
    ).addTo(map);

    // Street name layer
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
      { maxZoom: 19 }
    ).addTo(map);

    // Custom pin icon  
    const pinIcon = L.icon({
      iconUrl: "/artboard.png",
      iconSize: [40, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -35],
    });

    // Marker cluster group
    const clusterGroup = L.markerClusterGroup({
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();

          return L.divIcon({
            html: `
              <div class="cluster-custom" style="
                background:#CE181E;
                color:white;
                border-radius:9999px;
                border: solid;
                border-color: white;
                width:40px;
                height:40px;
                display:flex;
                align-items:center;
                justify-content:center;
                font-weight:600;
                box-shadow:0 4px 10px rgba(0,0,0,0.3);
              ">
                ${count}
              </div>
            `,
            className: "",
            iconSize: L.point(40, 40),
          });
        },
      });


    // Example markers around Alun-Alun
    const locations: [number, number][] = [
      [-7.9813, 112.6304], // center
      [-7.9810, 112.6310],
      [-7.9820, 112.6315],
      [-7.9805, 112.6298],
    ];

    locations.forEach((loc, i) => {
      const marker = L.marker(loc, { icon: pinIcon }).bindPopup(
        `Billboard ${i + 1}`
      );
      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);

    // Cleanup
    return () => {
      map.remove();
    };
  }, []);

  return <div ref={mapRef} className="w-full h-[500px]" />;
}
