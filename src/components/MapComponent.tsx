"use client";

import { useEffect } from "react";
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
  const color = isUrgent ? "#E53935" : "#008C49";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <defs>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.25)"/>
        </filter>
      </defs>
      <path d="M18 2C10.268 2 4 8.268 4 16c0 11 14 26 14 26S32 27 32 16C32 8.268 25.732 2 18 2z"
        fill="${color}" stroke="white" stroke-width="2" filter="url(#shadow)"/>
      <circle cx="18" cy="16" r="6" fill="white" fill-opacity="0.9"/>
    </svg>`;

  return L.divIcon({
    html: svg,
    className: isUrgent ? "urgent-marker-blink" : "",
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -46],
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
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const TILE_URL = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`;
const DEFAULT_CENTER: [number, number] = [10.762622, 106.660172];

export default function MapComponent({ stores, onSelectStore, centerOverride }: MapComponentProps) {
  const center: [number, number] = centerOverride
    ? [centerOverride.lat, centerOverride.lng]
    : DEFAULT_CENTER;

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

      {/* Blinking Animation Styles */}
      <style>{`
        @keyframes blinkMarker {
          0% { opacity: 1; filter: brightness(1); }
          50% { opacity: 0.8; filter: brightness(1.3); transform: scale(1.05) translateY(-2px); }
          100% { opacity: 1; filter: brightness(1); }
        }
        .urgent-marker-blink {
          animation: blinkMarker 1.2s infinite ease-in-out;
          transform-origin: bottom center;
        }
      `}</style>

      {/* Store Markers from real DB with Clustering */}
      <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
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
