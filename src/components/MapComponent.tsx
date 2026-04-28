"use client";

import { useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";

// Fix Leaflet default marker icons broken in Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom SVG marker factory
function createStoreIcon(isUrgent: boolean) {
  const color = isUrgent ? "#D32F2F" : "#059669";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
        <linearGradient id="gradUrgent" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FF5252" />
          <stop offset="100%" stop-color="#D32F2F" />
        </linearGradient>
        <linearGradient id="gradNormal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#10B981" />
          <stop offset="100%" stop-color="#059669" />
        </linearGradient>
      </defs>
      <path d="M20 2C10.059 2 2 10.059 2 20C2 31.5 20 50 20 50S38 31.5 38 20C38 10.059 29.941 2 20 2Z" 
            fill="url(#${isUrgent ? "gradUrgent" : "gradNormal"})" 
            stroke="white" 
            stroke-width="2.5" 
            filter="url(#shadow)"/>
      <circle cx="20" cy="19" r="10" fill="white" />
      <path d="M20 12.5l-6 4.5v1.5h12v-1.5l-6-4.5zm-5 7.5v6h2v-6h-2zm4 0v6h2v-6h-2zm4 0v6h2v-6h-2zm-7 7.5h10v1.5h-10v-1.5z" 
            fill="${color}"/>
    </svg>`;

  return L.divIcon({
    html: svg,
    className: isUrgent ? "urgent-marker-blink" : "",
    iconSize: [40, 52],
    iconAnchor: [20, 52],
    popupAnchor: [0, -54],
  });
}

// Current location blue dot icon
const userLocationIcon = L.divIcon({
  html: `
    <div style="
      width: 18px; height: 18px;
      background: #4285F4;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 4px rgba(66,133,244,0.25), 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
  className: "",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// Component to fly to new center when mapCenter changes
function FlyToCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { duration: 1.2 });
  }, [center, map]);
  return null;
}

// Component to auto-open a marker popup when selectedStoreId changes
function AutoOpenPopup({ selectedStoreId, markerRefs }: { selectedStoreId?: string | null; markerRefs: React.MutableRefObject<Record<string, L.Marker>> }) {
  const map = useMap();
  useEffect(() => {
    if (selectedStoreId && markerRefs.current[selectedStoreId]) {
      // Small delay to ensure flyTo has started
      setTimeout(() => {
        markerRefs.current[selectedStoreId]?.openPopup();
      }, 400);
    }
  }, [selectedStoreId, map, markerRefs]);
  return null;
}

export interface StoreMapData {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  imageUrl: string | null;
  rating: number;
  products: {
    id: string;
    name: string;
    originalPrice: number;
    discountPrice: number;
    discountPercent: number;
    quantityLeft: number;
    expiryTime: Date;
    imageUrl: string | null;
    category: string;
  }[];
}

interface MapComponentProps {
  stores: StoreMapData[];
  onSelectStore: (storeId: string) => void;
  centerOverride?: { lat: number; lng: number };
  selectedStoreId?: string | null;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const TILE_URL = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`;
const DEFAULT_CENTER: [number, number] = [10.762622, 106.660172];

export default function MapComponent({ stores, onSelectStore, centerOverride, selectedStoreId }: MapComponentProps) {
  const center: [number, number] = centerOverride
    ? [centerOverride.lat, centerOverride.lng]
    : DEFAULT_CENTER;
  const markerRefs = useRef<Record<string, L.Marker>>({});

  return (
    <MapContainer
      center={center}
      zoom={14}
      zoomControl={false}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "100%" }}
      className="z-0"
    >
      {/* Mapbox Tile Layer */}
      <TileLayer
        url={TILE_URL}
        attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
        tileSize={256}
        zoomOffset={0}
      />

      {/* Fly to center when prop changes */}
      <FlyToCenter center={center} />
      {/* Auto-open popup for search result */}
      <AutoOpenPopup selectedStoreId={selectedStoreId} markerRefs={markerRefs} />

      {/* Blinking Animation Styles & Clusters */}
      <style>{`
        @keyframes blinkMarker {
          0% { opacity: 1; filter: brightness(1); }
          50% { opacity: 0.8; filter: brightness(1.2); }
          100% { opacity: 1; filter: brightness(1); }
        }
        .urgent-marker-blink {
          animation: blinkMarker 1.5s infinite ease-in-out;
          transform-origin: bottom center;
        }
        .custom-marker-cluster {
          background: rgba(16, 185, 129, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cluster-custom-icon {
          background: #10B981;
          color: white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        }
      `}</style>

      {/* Store Markers from real DB with Clustering */}
      <MarkerClusterGroup 
        chunkedLoading 
        maxClusterRadius={50}
        iconCreateFunction={(cluster: any) => {
          return L.divIcon({
            html: `<div class="cluster-custom-icon">${cluster.getChildCount()}</div>`,
            className: 'custom-marker-cluster',
            iconSize: L.point(40, 40, true),
          });
        }}
      >
        {stores.map((store) => {
          const topProduct = store.products[0];
          // Sắp hết hạn trong vòng 24 giờ
          const isUrgent = topProduct
            ? new Date(topProduct.expiryTime).getTime() - Date.now() < 24 * 60 * 60 * 1000
            : false;

          return (
            <Marker
              key={store.id}
              position={[store.lat, store.lng]}
              icon={createStoreIcon(isUrgent)}
              ref={(ref) => {
                if (ref) markerRefs.current[store.id] = ref;
              }}
              eventHandlers={{
                click: () => onSelectStore(store.id),
              }}
            >
              <Popup>
                <div className="text-sm font-semibold">{store.name}</div>
                <div className="text-xs text-gray-500">{store.address}</div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
