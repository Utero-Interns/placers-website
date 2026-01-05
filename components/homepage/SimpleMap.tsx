"use client";

import { useLanguage } from '@/app/context/LanguageContext';
import { Billboard } from "@/types";
import { Cluster, MarkerClusterer } from "@googlemaps/markerclusterer";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google: typeof google;
  }
}

type Listing = {
  id: string;
  type: string;
  address: string;
  image: string;
  lat: number;
  lng: number;
};

const mapStyle: google.maps.MapTypeStyle[] = [
  { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "all", stylers: [{ visibility: "off" }] },
  {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6B7280" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
];

function toLatLngLiteral(
  pos: google.maps.LatLng | google.maps.LatLngLiteral
): google.maps.LatLngLiteral {
  if (typeof (pos as google.maps.LatLng).lat === "function") {
    const p = pos as google.maps.LatLng;
    return { lat: p.lat(), lng: p.lng() };
  }
  return pos as google.maps.LatLngLiteral;
}

export default function SimpleMap({ billboards }: { billboards: Billboard[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapsReady, setMapsReady] = useState(false);
  const [isMapInitialized, setIsMapInitialized] = useState(false); 
  const [listings, setListings] = useState<Listing[]>([]);
  const { t } = useLanguage();
  
  // Keep track of the map instance and clusterer
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  /* Convert billboards → listings */
  useEffect(() => {
    const mapped = billboards
      .map((b) => {
        const image =
          b.image?.length > 0
            ? `/api/uploads/${b.image[0].url.replace(/^uploads\//, "")}`
            : "/billboard-placeholder.png";

        return {
          id: b.id,
          type: b.category?.name || t('homepage.map.undefined_category'),
          address: b.location,
          image,
          lat: Number(b.latitude),
          lng: Number(b.longitude),
        };
      })
      .filter((l) => !isNaN(l.lat) && !isNaN(l.lng));

    setListings(mapped);
  }, [billboards, t]);

  // Check if Google Maps is loaded
  useEffect(() => {
    if (window.google?.maps) {
      setMapsReady(true);
    } else {
      const interval = setInterval(() => {
        if (window.google?.maps) {
          setMapsReady(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  /* Init Google Map - Run ONLY ONCE */
  useEffect(() => {
    if (!mapsReady || !mapRef.current || googleMapRef.current) return;

    async function initMap() {
      const { Map } =
        (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;

      const map = new Map(mapRef.current!, {
        styles: mapStyle,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        clickableIcons: false,
        center: { lat: -2.5489, lng: 118.0149 }, // Default center (Indonesia roughly)
        zoom: 5,
      });

      googleMapRef.current = map;
      setIsMapInitialized(true); // Signal that map is ready
    }

    initMap();
  }, [mapsReady]);

  /* Update Markers - Run when listings change OR map initializes */
  useEffect(() => {
    // Only proceed if map is initialized and we have listings (or empty listings to clear)
    if (!googleMapRef.current) return;

    async function updateMarkers() {
        const { InfoWindow } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
        const map = googleMapRef.current!;

        // 1. Clear existing markers and clusterer
        if (clustererRef.current) {
            clustererRef.current.clearMarkers();
        }
        markersRef.current.forEach(m => m.setMap(null));
        markersRef.current = [];

        // 2. Create new markers
        const infoWindow = new InfoWindow({ disableAutoPan: false });

        const newMarkers = listings.map((listing) => {
            const marker = new google.maps.Marker({
            position: { lat: listing.lat, lng: listing.lng },
            icon: {
                url: "/artboard.png",
                scaledSize: new google.maps.Size(40, 40),
            },
            });

            marker.addListener("click", () => {
            infoWindow.setContent(popupContent(listing));
            infoWindow.open(map, marker);
            });

            return marker;
        });

        markersRef.current = newMarkers;

        // 3. Re-initialize Clusterer or Add markers to existing one
        if (!clustererRef.current) {
            clustererRef.current = new MarkerClusterer({
                map,
                markers: newMarkers,
                renderer: {
                    render: (cluster: Cluster) => {
                        const position = toLatLngLiteral(cluster.position);

                        return new google.maps.Marker({
                            position,
                            icon: {
                                url:
                                "data:image/svg+xml;charset=UTF-8," +
                                encodeURIComponent(`
                                    <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="22" cy="22" r="18" fill="#CE181E" stroke="white" stroke-width="3" />
                                    <text x="22" y="27" text-anchor="middle" font-size="14" font-weight="600" fill="white" font-family="Inter, Arial, sans-serif">
                                        ${cluster.count}
                                    </text>
                                    </svg>
                                `),
                                scaledSize: new google.maps.Size(44, 44),
                            },
                            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + cluster.count,
                        });
                    },
                },
            });
        } else {
            clustererRef.current.addMarkers(newMarkers);
        }

        // 4. Fit bounds if we have listings
        if (listings.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            newMarkers.forEach((m) => bounds.extend(m.getPosition()!));

            if (listings.length === 1) {
                // If only one marker, center and zoom to a reasonable level
                map.setCenter(newMarkers[0].getPosition()!);
                map.setZoom(15);
            } else {
                // Determine bounds but check if points are too close
                map.fitBounds(bounds);
                
                // Optional: Prevent zooming in too deep if points are very close
                const listener = google.maps.event.addListener(map, "idle", () => { 
                    if (map.getZoom()! > 15) {
                         map.setZoom(15); 
                    }
                    google.maps.event.removeListener(listener); 
                });
            }
        }
        
        // Close info window on map click
        map.addListener("click", () => infoWindow.close());
    }
    
    updateMarkers();
  }, [listings, isMapInitialized]); // 🔥 Add isMapInitialized dependency

  return (
    <>
      <div ref={mapRef} className="w-full h-[500px] rounded-xl" />

    </>
  );
}

/* Pop up content */
function popupContent(listing: Listing) {
  return `
    <a
      href="/billboard-detail/${listing.id}"
      style="
        display:block;
        width:260px;
        height:150px;
        border-radius:14px;
        overflow:hidden;
        font-family:Inter, Arial, sans-serif;
        position:relative;
        text-decoration:none;
      "
    >
      <button
        onclick="event.stopPropagation(); event.preventDefault();
          this.closest('.gm-style-iw').querySelector('button[title=Close]').click();"
        onmouseenter="this.style.backgroundColor='#CE181E'"
        onmouseleave="this.style.backgroundColor='rgba(0,0,0,0.55)'"
        style="
          position:absolute;
          top:8px;
          right:8px;
          z-index:10;
          background:rgba(0,0,0,0.55);
          color:white;
          border:none;
          width:26px;
          height:26px;
          border-radius:999px;
          font-size:14px;
          cursor:pointer;
          transition: background-color 0.2s ease;
        "
      >
        ✕
      </button>

      <div
        style="
          width:100%;
          height:100%;
          background-image:url('${listing.image}');
          background-size:cover;
          background-position:center;
          position:relative;
        "
      >
        <div
          style="
            position:absolute;
            inset:0;
            background:linear-gradient(
              to top,
              rgba(0,0,0,0.65),
              rgba(0,0,0,0),
              rgba(0,0,0,0)
            );
          "
        ></div>

        <div
          style="
            position:absolute;
            bottom:12px;
            left:12px;
            right:12px;
            color:white;
            text-align:left;
          "
        >
          <div
            style="
              font-size:11px;
              font-weight:700;
              letter-spacing:0.06em;
              margin-bottom:6px;
            "
          >
            ${listing.type}
          </div>

          <div
            style="
              font-size:13px;
              font-weight:600;
              line-height:1.35;
            "
          >
            ${listing.address}
          </div>
        </div>
      </div>
    </a>
  `;
}
