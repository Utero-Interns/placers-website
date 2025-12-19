"use client";

import { fetchBillboards } from "@/services/billboardService";
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
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
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

export default function GoogleMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await fetchBillboards();
      const mappedListings: Listing[] = data
        .map((b: Billboard) => {
          const billboardImageUrl =
            b.image?.length > 0
              ? `/api/uploads/${b.image[0].url.replace(/^uploads\//, "")}`
              : "/billboard-placeholder.png";

          return {
            id: b.id,
            type: b.category?.name || "Undefined",
            address: b.location,
            image: billboardImageUrl,
            lat: Number(b.latitude),
            lng: Number(b.longitude),
          };
        })
        .filter((l) => !isNaN(l.lat) && !isNaN(l.lng));

      setListings(mappedListings);
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!mapRef.current || !window.google || listings.length === 0) return;

    async function initMap() {
      const { Map, InfoWindow } = (await google.maps.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;

      const map = new Map(mapRef.current!, {
        styles: mapStyle,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        clickableIcons: false,
      });

      const infoWindow = new InfoWindow({ disableAutoPan: false });

      const markers: google.maps.Marker[] = listings.map((listing) => {
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

      const bounds = new google.maps.LatLngBounds();
      markers.forEach((marker) => bounds.extend(marker.getPosition()!));
      map.fitBounds(bounds);

      // Create the cluster renderer
      const clusterRenderer = {
        render: (cluster: Cluster) => {
          const count = cluster.count;
          const position = cluster.position;
          
          const positionLiteral: google.maps.LatLngLiteral = {
            lat: (typeof position.lat === 'function' ? position.lat() : position.lat) as number,
            lng: (typeof position.lng === 'function' ? position.lng() : position.lng) as number,
          };

          return new google.maps.Marker({
            position: positionLiteral,
            icon: {
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                  <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22" cy="22" r="18" fill="#CE181E" stroke="white" stroke-width="3" />
                    <text x="22" y="27" text-anchor="middle" font-size="14" font-weight="600" fill="white" font-family="Inter, Arial, sans-serif">
                      ${count}
                    </text>
                  </svg>
                `),
              scaledSize: new google.maps.Size(44, 44),
            },
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
          });
        },
      };

      new MarkerClusterer({
        map,
        markers,
        renderer: clusterRenderer,
      });

      map.addListener("click", () => infoWindow.close());
    }

    initMap();
  }, [listings]);

  return <div ref={mapRef} className="w-full h-[500px] rounded-xl" />;
}

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