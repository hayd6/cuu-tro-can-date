"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (lat: number, lng: number, address?: string) => void;
  initialCenter?: { lat: number; lng: number };
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const TILE_URL = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`;

function LocationMarker({ position, setPosition }: { 
  position: [number, number], 
  setPosition: (pos: [number, number]) => void 
}) {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <Marker 
      position={position} 
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition([pos.lat, pos.lng]);
        },
      }}
    />
  );
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 16);
  }, [center, map]);
  return null;
}

export default function LocationPickerModal({ isOpen, onClose, onSelect, initialCenter }: LocationPickerModalProps) {
  const [position, setPosition] = useState<[number, number]>(
    initialCenter ? [initialCenter.lat, initialCenter.lng] : [10.762622, 106.660172]
  );
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && initialCenter) {
      setPosition([initialCenter.lat, initialCenter.lng]);
    }
  }, [isOpen, initialCenter]);

  // Reverse geocoding when position changes
  useEffect(() => {
    const fetchAddress = async () => {
      if (!MAPBOX_TOKEN) return;
      setLoading(true);
      try {
        const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${position[1]}&latitude=${position[0]}&access_token=${MAPBOX_TOKEN}&language=vi&limit=1`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          setAddress(data.features[0].properties.full_address || data.features[0].properties.name);
        }
      } catch (error) {
        console.error("Reverse geocoding error:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchAddress, 500); // Debounce
    return () => clearTimeout(timer);
  }, [position]);

  const handleConfirm = () => {
    onSelect(position[0], position[1], address);
    onClose();
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col h-[80vh]">
        <div className="p-4 border-b border-surface-container flex items-center justify-between">
          <h2 className="font-bold text-lg">Chọn vị trí trên bản đồ</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 relative">
          <MapContainer center={position} zoom={16} className="w-full h-full">
            <TileLayer url={TILE_URL} />
            <LocationMarker position={position} setPosition={setPosition} />
            <ChangeView center={position} />
          </MapContainer>

          <button 
            onClick={handleCurrentLocation}
            className="absolute bottom-6 right-6 z-[1001] bg-white text-primary p-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
          >
            <span className="material-symbols-outlined">my_location</span>
          </button>
        </div>

        <div className="p-6 bg-surface space-y-4">
          <div className="flex items-start gap-3 bg-surface-container-highest p-4 rounded-2xl">
            <span className="material-symbols-outlined text-primary">location_on</span>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Địa chỉ đã chọn</p>
              <p className="text-sm font-medium line-clamp-2">
                {loading ? "Đang lấy địa chỉ..." : (address || "Chưa xác định vị trí")}
              </p>
            </div>
          </div>

          <button 
            onClick={handleConfirm}
            disabled={loading}
            className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            Xác nhận vị trí
          </button>
        </div>
      </div>
    </div>
  );
}
