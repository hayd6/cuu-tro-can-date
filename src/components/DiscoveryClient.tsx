"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";
import FilterBottomSheet from "@/components/FilterBottomSheet";
import { StoreMapData } from "@/components/MapComponent";
import dynamic from "next/dynamic";
import { useAppContext } from "@/context/AppProvider";


// dynamic import must be in a Client Component
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-500 text-sm font-medium">Đang tải bản đồ...</span>
      </div>
    </div>
  ),
});

const MapboxSearchWrapper = dynamic(() => import("@/components/MapboxSearchWrapper"), {
  ssr: false,
});

interface DiscoveryClientProps {
  stores: StoreMapData[];
}

export default function DiscoveryClient({ stores }: DiscoveryClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlQuery = searchParams.get("search") || "";

  const { isSidebarExpanded, currentAddress, setCurrentAddress } = useAppContext();
  const [isStoreListExpanded, setIsStoreListExpanded] = useState(false);


  const [activeChip, setActiveChip] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(() => {
    if (typeof window !== "undefined") {
      const savedLat = localStorage.getItem("user-lat");
      const savedLng = localStorage.getItem("user-lng");
      if (savedLat && savedLng) {
        return { lat: parseFloat(savedLat), lng: parseFloat(savedLng) };
      }
    }
    return { lat: 10.762622, lng: 106.660172 }; // Default: Quận 1 (only if no cached location)
  });
  const [isUrgentOnly, setIsUrgentOnly] = useState(false);

  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);

  // Auto-navigate map to first matching store when search query changes
  // Only move map + highlight marker, do NOT open product panel (selectedPin stays false)
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const q = searchQuery.toLowerCase();
      const match = stores.find((s) =>
        s.name.toLowerCase().includes(q) ||
        s.products.some(p => p.name.toLowerCase().includes(q))
      );
      if (match) {
        setSelectedStoreId(match.id);
        setMapCenter({ lat: match.lat, lng: match.lng });
      }
    } else if (searchQuery.trim().length === 0) {
      setSelectedPin(false);
      setSelectedStoreId(null);
    }
  }, [searchQuery, stores]);

  useEffect(() => {
    if (searchParams.get("filter") === "true") {
      setIsFilterOpen(true);
      const params = new URLSearchParams(window.location.search);
      params.delete("filter");
      router.replace(`/?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);


  
  // Advanced Filter State
  const [filters, setFilters] = useState({
    sort: 'Gần tôi nhất',
    categories: [] as string[],
    prices: [] as string[],
    times: [] as string[]
  });

  const handleGps = () => {
    if ("geolocation" in navigator) {
      setCurrentAddress("Đang xác định vị trí...");
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter({ lat: latitude, lng: longitude });
        localStorage.setItem("user-lat", latitude.toString());
        localStorage.setItem("user-lng", longitude.toString());
        
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data.display_name) {
            setCurrentAddress(data.display_name);
            localStorage.setItem("user-addr", data.display_name);
          } else {
            setCurrentAddress("Vị trí của bạn");
            localStorage.setItem("user-addr", "Vị trí của bạn");
          }
        } catch (error) {
          setCurrentAddress("Vị trí của bạn");
          localStorage.setItem("user-addr", "Vị trí của bạn");
        }
      }, () => {
        setCurrentAddress("Văn phòng 123 Lê Lợi");
        localStorage.setItem("user-addr", "Văn phòng 123 Lê Lợi");
      });
    }
  };

  useEffect(() => {
    handleGps(); // Auto-locate on first load
    const handleResetMap = () => {
      handleGps();
    };
    window.addEventListener("reset-map-location", handleResetMap);
    return () => {
      window.removeEventListener("reset-map-location", handleResetMap);
    };
  }, []);

  const filteredStores = stores.filter((store) => {
    // 0. Urgent Filter
    if (isUrgentOnly) {
      const hasUrgent = store.products.some(p => {
        const hoursLeft = (new Date(p.expiryTime).getTime() - Date.now()) / (1000 * 60 * 60);
        return hoursLeft > 0 && hoursLeft <= 24;
      });
      if (!hasUrgent) return false;
    }

    // 1. Text Search (store name OR product name)
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || store.name.toLowerCase().includes(q) || 
      store.products.some(p => p.name.toLowerCase().includes(q));
    
    // 2. Chip Category & Bottom Sheet Category Filter
    // Combine both: prioritize specifically selected categories if any, else chip
    const activeCategories = filters.categories.length > 0 ? filters.categories : (activeChip !== "Tất cả" ? [activeChip] : []);
    
    let matchesCategory = true;
    if (activeCategories.length > 0) {
      const categoryMapping: Record<string, string> = {
        "Bánh ngọt": "BAKED_GOODS",
        "Bánh mì/Bánh ngọt": "BAKED_GOODS",
        "Đồ ăn mặn": "HOT_FOOD",
        "Cơm hộp/Đồ ăn nóng": "HOT_FOOD",
        "Trái cây & Rau củ": "FRUIT_VEG",
        "Trái cây/Rau củ": "FRUIT_VEG",
        "Đồ chay": "VEGETARIAN",
        "Chay": "VEGETARIAN"
      };

      const mappedTargets = activeCategories.map(c => categoryMapping[c]).filter(Boolean);
      
      if (mappedTargets.length > 0) {
        matchesCategory = store.products.some(p => mappedTargets.includes(p.category));
      }
    }

    // 3. Price Filter (Simplified for demo)
    let matchesPrice = true;
    if (filters.prices.length > 0) {
      // Check if store has any product in price range
      matchesPrice = store.products.some(p => {
        if (filters.prices.includes('Dưới 20.000đ')) return p.discountPrice < 20000;
        if (filters.prices.includes('20.000đ - 50.000đ')) return p.discountPrice >= 20000 && p.discountPrice <= 50000;
        if (filters.prices.includes('50.000đ - 100.000đ')) return p.discountPrice >= 50000 && p.discountPrice <= 100000;
        if (filters.prices.includes('Trên 100.000đ')) return p.discountPrice > 100000;
        return true;
      });
    }

    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    if (filters.sort === 'Đánh giá tốt') return b.rating - a.rating;
    
    // Price sorting (based on min product price at store)
    const minPriceA = a.products.length > 0 ? Math.min(...a.products.map(p => p.discountPrice)) : 1e9;
    const minPriceB = b.products.length > 0 ? Math.min(...b.products.map(p => p.discountPrice)) : 1e9;
    
    if (filters.sort === 'Giá: Thấp đến cao') return minPriceA - minPriceB;
    if (filters.sort === 'Giá: Cao đến thấp') return minPriceB - minPriceA;
    if (filters.sort === 'Sắp hết hạn') {
      const minExpiryA = a.products.length > 0 ? Math.min(...a.products.map(p => new Date(p.expiryTime).getTime())) : 2e12;
      const minExpiryB = b.products.length > 0 ? Math.min(...b.products.map(p => new Date(p.expiryTime).getTime())) : 2e12;
      return minExpiryA - minExpiryB;
    }
    
    return 0;
  });

  const handleSelectStore = (id: string) => {
    const store = stores.find((s) => s.id === id);
    if (store) {
      setSelectedStoreId(id);
      setSelectedPin(true);
      setMapCenter({ lat: store.lat, lng: store.lng });
    }
  };

  const selectedStore = stores.find((s) => s.id === selectedStoreId);

  return (
    <div className="relative w-full h-[calc(100vh-var(--header-height))] flex flex-col overflow-hidden">
      
      {/* Desktop Top Floating Filter Bar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 hidden lg:flex flex-col items-center gap-3 w-full max-w-2xl px-4 pointer-events-none animate-in slide-in-from-top duration-300">
        {/* Filter Chips */}
        <div className="flex gap-2 pointer-events-auto overflow-x-auto hide-scrollbar max-w-full pb-1">
          {["Tất cả", "Bánh mì/Bánh ngọt", "Cơm hộp/Đồ ăn nóng", "Trái cây/Rau củ", "Chay"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveChip(activeChip === cat ? "Tất cả" : cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold shadow-md border transition-all ${
                activeChip === cat
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-white/90 backdrop-blur-md text-on-surface-variant border-outline-variant/20 hover:bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
          <button 
            onClick={() => setIsUrgentOnly(!isUrgentOnly)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border shadow-md transition-all ${
              isUrgentOnly 
                ? "bg-tertiary text-white border-tertiary" 
                : "bg-white/90 backdrop-blur-md text-tertiary border-tertiary/30 hover:bg-white"
            }`}
          >
            Sắp hết hạn
          </button>
        </div>
      </div>

      {/* Desktop Floating Store List */}
      {isStoreListExpanded ? (
        <div className="absolute top-6 left-6 z-40 hidden lg:flex flex-col w-[360px] max-h-[calc(100vh-var(--header-height)-140px)] bg-white/95 backdrop-blur-md rounded-[28px] overflow-hidden shadow-2xl border border-outline-variant/10 animate-in fade-in zoom-in-95 duration-200">



          <div className="p-4 border-b border-outline-variant/10 sticky top-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-on-surface">Cửa hàng cứu trợ</h2>
              <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">{filteredStores.length} quán quanh bạn</p>
            </div>
            <button 
              onClick={() => setIsStoreListExpanded(false)}
              className="w-8 h-8 flex items-center justify-center hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-base">keyboard_arrow_left</span>
            </button>
          </div>
          
          <div className="overflow-y-auto flex-1 divide-y divide-outline-variant/5">
            {filteredStores.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-2">
                <span className="material-symbols-outlined text-3xl text-outline-variant">store_front</span>
                <p className="text-xs font-medium text-on-surface-variant">Không tìm thấy cửa hàng nào phù hợp.</p>
              </div>
            ) : (
              filteredStores.map((store) => (
                <div 
                  key={store.id} 
                  onClick={() => handleSelectStore(store.id)}
                  className={`p-4 hover:bg-primary/5 cursor-pointer transition-all duration-200 ${selectedStoreId === store.id ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className="w-14 h-14 rounded-xl bg-surface-container-high overflow-hidden flex-shrink-0 shadow-sm">
                      <img 
                        src={store.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=200"} 
                        alt={store.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-on-surface truncate group-hover:text-primary transition-colors">{store.name}</h3>
                      <p className="text-[10px] text-on-surface-variant line-clamp-1 mt-0.5">{store.address}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-amber-500 text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="text-[10px] font-bold text-on-surface">{store.rating}</span>
                        </div>
                        <span className="text-[9px] text-primary font-bold uppercase bg-primary/10 px-2 py-0.5 rounded-md">
                          {store.products.length} phần
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsStoreListExpanded(true)}
          className="absolute top-6 left-6 z-40 hidden lg:flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xl border border-outline-variant/10 hover:bg-primary/5 hover:border-primary/20 transition-all animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
        >


          <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>

          <span className="text-xs font-bold text-on-surface">{filteredStores.length} cửa hàng gần bạn</span>
          <span className="material-symbols-outlined text-on-surface-variant text-base">keyboard_arrow_right</span>
        </button>
      )}


      {/* Map Area */}
      <div onClick={() => setSelectedPin(false)} className="relative flex-1 h-full w-full">

        {/* Mobile Background / Desktop Map */}
        <div className="absolute inset-0 z-0">
          <MapComponent
            stores={filteredStores}
            onSelectStore={handleSelectStore}
            centerOverride={mapCenter}
            selectedStoreId={selectedStoreId}
          />
        </div>

        {/* Mobile Top Bar (Floating) */}
        <header className="absolute top-0 left-0 w-full z-10 p-4 space-y-3 pb-8 bg-gradient-to-b from-surface/90 to-transparent pointer-events-none lg:hidden">
          <div className="pointer-events-auto">
            <div className="max-w-md mx-auto w-full space-y-2">
              {/* Address Bar */}
              <button className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-outline-variant/10 w-fit">
                <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                <span suppressHydrationWarning className="text-on-surface font-semibold text-xs truncate max-w-[200px]">{currentAddress}</span>
                <span className="material-symbols-outlined text-on-surface-variant text-[14px]">expand_more</span>
              </button>

              {/* Search Bar */}
              <div className="bg-white/95 backdrop-blur-md shadow-md rounded-2xl flex items-center px-4 py-1 border border-outline-variant/10">
                <span className="material-symbols-outlined text-on-surface-variant mr-3">search</span>
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    placeholder="Tìm quán hoặc món ăn..."
                    className="w-full bg-transparent focus:outline-none text-on-surface py-2 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="h-6 w-[1px] bg-outline-variant/30 mx-3" />
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="pointer-events-auto p-2"
                >
                  <div className="relative">
                    <span className="material-symbols-outlined text-primary">tune</span>
                    {(filters.categories.length > 0 || filters.sort !== 'Gần tôi nhất') && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-white"></span>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 pt-3 pb-2">
              {["Tất cả", "Bánh mì/Bánh ngọt", "Cơm hộp/Đồ ăn nóng", "Trái cây/Rau củ", "Chay"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveChip(activeChip === cat ? "Tất cả" : cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold shadow-sm border transition-colors ${
                    activeChip === cat
                      ? "bg-primary text-on-primary border-primary"
                      : "bg-white/90 backdrop-blur-md text-on-surface-variant border-outline-variant/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button 
                onClick={() => setIsUrgentOnly(!isUrgentOnly)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border shadow-sm transition-all ${
                  isUrgentOnly 
                    ? "bg-tertiary text-white border-tertiary" 
                    : "bg-white/90 backdrop-blur-md text-tertiary border-tertiary/30"
                }`}
              >
                Sắp hết hạn
              </button>
            </div>
          </div>
        </header>

        {/* Floating Action Buttons */}
        <div className={`fixed lg:absolute right-6 z-[30] flex flex-col items-center gap-3 transition-all duration-300 ${selectedPin ? "bottom-[520px] lg:bottom-[450px]" : "bottom-[120px] lg:bottom-6"}`}>


          <Link
            href="/list"
            className="bg-white text-on-surface-variant shadow-lg w-12 h-12 rounded-full flex items-center justify-center border border-outline-variant/20 active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined">list</span>
          </Link>
          <button 
            onClick={handleGps}
            className="bg-primary text-white shadow-lg w-14 h-14 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              my_location
            </span>
          </button>
        </div>

        {/* Store Details (Desktop Floating Card vs Mobile Bottom Sheet) */}
        {selectedPin && selectedStore && (
          <div className="absolute bottom-6 left-6 right-6 z-20 hidden lg:block">
            <div 
              onClick={() => setIsStoreListExpanded(false)}
              className="bg-white/95 backdrop-blur-md rounded-[28px] overflow-hidden shadow-2xl border border-outline-variant/10 p-6 animate-in slide-in-from-bottom duration-300"
            >
              <div className="flex justify-between items-center mb-6" onClick={(e) => e.stopPropagation()}>
                <div>
                  <h3 className="text-xl font-black text-on-surface leading-tight">{selectedStore.name}</h3>
                  <p className="text-xs text-on-surface-variant mt-1">{selectedStore.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedPin(false)}
                    className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
              </div>

              {/* Products Flex Slider */}
              <div 
                className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 pt-1 transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedStore.products.map((product) => (
                  <div key={product.id} className="bg-white/50 backdrop-blur-sm rounded-2xl p-3 flex flex-col relative group border border-outline-variant/10 hover:border-primary/20 shadow-sm hover:shadow-md transition-all duration-300 flex-shrink-0 w-[280px]">

                    {/* Product Card Link (Detail Page) */}
                    <Link href={`/product/${product.id}`} className="absolute inset-0 z-10" aria-label="Xem chi tiết sản phẩm" />

                    {/* Visual Area */}
                    <div className="aspect-[16/9] w-full rounded-xl overflow-hidden mb-3 relative bg-surface-container-high transition-transform group-hover:scale-[1.01] duration-300 pointer-events-none">
                      <img
                        className="w-full h-full object-cover"
                        alt={product.name}
                        src={product.imageUrl || selectedStore.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400"}
                      />
                      <div className="absolute top-2 left-2 bg-tertiary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow">
                        CÒN {product.quantityLeft} PHẦN
                      </div>
                      <div className="absolute top-2 right-2 bg-white text-tertiary text-xs font-black px-1.5 py-0.5 rounded-md shadow border border-tertiary/10">
                        -{product.discountPercent}%
                      </div>
                      
                      {/* Countdown */}
                      {(() => {
                        const diff = new Date(product.expiryTime).getTime() - Date.now();
                        if (diff <= 0) return null;
                        const h = Math.floor(diff / (1000 * 60 * 60));
                        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                        return (
                          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 border border-white/10">
                            <span className="material-symbols-outlined text-[10px] animate-pulse">timer</span>
                            <span>Còn {h > 0 ? `${h}h ` : ""}{m}p</span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Info Area */}
                    <div className="mb-2 pointer-events-none flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-extrabold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-on-surface-variant mt-0.5">
                          <span className="font-medium truncate">{selectedStore.name}</span>
                          <span className="opacity-40">•</span>
                          <div className="flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-yellow-500 text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                              star
                            </span>
                            <span className="font-bold text-on-surface">{selectedStore.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-outline-variant/5">
                      <div className="flex flex-col pointer-events-none">
                        <span className="text-[9px] text-on-surface-variant/60 line-through font-medium leading-none mb-1">
                          {product.originalPrice.toLocaleString('vi-VN')}đ
                        </span>
                        <span className="text-sm font-black text-tertiary leading-none">
                          {product.discountPrice.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <div className="relative z-20 pointer-events-auto">
                        <Link
                          href={`/checkout/${product.id}`}
                          className="bg-primary text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow shadow-primary/20 hover:scale-105 active:scale-95 transition-transform block"
                        >
                          CỨU NGAY
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


        {/* Mobile Store Details Bottom Sheet */}
        <AnimatePresence>
          {selectedPin && selectedStore && (
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-[90px] left-0 w-full z-40 px-4 lg:hidden"
            >
              <div className="bg-white rounded-t-[32px] rounded-b-2xl shadow-xl border border-outline-variant/10">
                <motion.div
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.3}
                  onDragEnd={(_, info) => {
                    if (info.offset.y > 60) setSelectedPin(false);
                  }}
                  className="w-full flex justify-center py-4 cursor-grab active:cursor-grabbing select-none"
                  style={{ touchAction: "none" }}
                >
                  <div className="w-12 h-1.5 bg-outline-variant/30 rounded-full" />
                </motion.div>

                <div className="px-5 pb-6">
                  {selectedStore.products.length === 0 ? (
                    <div className="text-center py-6 text-on-surface-variant text-sm bg-surface-container-low rounded-xl">
                      Cửa hàng chưa có sản phẩm nào.
                    </div>
                  ) : (
                    <div
                      className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar -mx-5 px-5 pb-2 gap-4"
                      style={{ touchAction: "pan-x" }}
                    >
                      {selectedStore.products.map((product) => (
                        <div key={product.id} className="w-[80vw] max-w-[320px] flex-shrink-0 snap-center flex flex-col relative group">
                          {/* Primary Card Link (Detail Page) */}
                          <Link href={`/product/${product.id}`} className="absolute inset-0 z-0" aria-label="Xem chi tiết sản phẩm" />

                          <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden mb-4 relative bg-surface-container-high transition-transform group-hover:scale-[1.02] duration-300 pointer-events-none">
                            <img
                              className="w-full h-full object-cover"
                              alt={product.name}
                              src={product.imageUrl || selectedStore.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400"}
                            />
                            <div className="absolute top-3 left-3 bg-tertiary text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                              CÒN {product.quantityLeft} PHẦN
                            </div>
                            <div className="absolute top-3 right-3 bg-white text-tertiary text-sm font-black px-2 py-1 rounded-lg shadow-md border border-tertiary/20">
                              -{product.discountPercent}%
                            </div>
                            
                            {/* Dynamic Countdown */}
                            {(() => {
                              const diff = new Date(product.expiryTime).getTime() - Date.now();
                              if (diff <= 0) return null;
                              const h = Math.floor(diff / (1000 * 60 * 60));
                              const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                              return (
                                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 border border-white/20">
                                  <span className="material-symbols-outlined text-[12px] animate-pulse">timer</span>
                                  <span>Còn {h > 0 ? `${h}h ` : ""}{m}p</span>
                                </div>
                              );
                            })()}
                          </div>

                          <div className="mb-2 pointer-events-none">
                            <h3 className="text-lg font-black text-on-surface">{product.name}</h3>
                            <div className="flex items-center gap-2 text-on-surface-variant text-sm mt-0.5">
                              <span className="font-semibold text-primary truncate max-w-[150px]">{selectedStore.name}</span>
                              <span className="text-outline-variant">•</span>
                              <div className="flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-yellow-500 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                  star
                                </span>
                                <span className="font-bold text-on-surface">{selectedStore.rating}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex flex-col pointer-events-none">
                              <span className="text-xs text-on-surface-variant/60 line-through font-medium leading-none mb-1">
                                {product.originalPrice.toLocaleString('vi-VN')}đ
                              </span>
                              <span className="text-2xl font-black text-tertiary leading-none">
                                {product.discountPrice.toLocaleString('vi-VN')}đ
                              </span>
                            </div>
                            <div className="relative z-20 pointer-events-auto">
                              <Link
                                href={`/checkout/${product.id}`}
                                className="bg-primary text-white font-black text-sm px-10 py-3.5 rounded-xl shadow-md shadow-primary/30 hover:scale-105 active:scale-95 transition-transform block"
                              >
                                CỨU NGAY
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialSort={filters.sort}
        initialCategories={filters.categories}
        initialPrices={filters.prices}
        initialTimes={filters.times}
        onApply={(newFilters) => setFilters(newFilters)}
      />
    </div>
  );
}
