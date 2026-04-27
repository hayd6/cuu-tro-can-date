"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import FilterBottomSheet from "@/components/FilterBottomSheet";

type Product = {
  id: string;
  name: string;
  imageUrl: string | null;
  category: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  quantityLeft: number;
  expiryTime: Date;
  store: {
    id: string;
    name: string;
    address: string;
    imageUrl: string | null;
    rating: number;
  };
};

interface ListClientProps {
  initialProducts: Product[];
}

const CATEGORY_MAP: Record<string, string> = {
  BAKED_GOODS: "Bánh mì/Bánh ngọt",
  HOT_FOOD: "Cơm hộp/Đồ ăn nóng",
  FRUIT_VEG: "Trái cây/Rau củ",
  VEGETARIAN: "Chay",
  DRINKS: "Đồ uống",
  OTHER: "Khác",
};

export default function ListClient({ initialProducts }: ListClientProps) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isUrgentOnly, setIsUrgentOnly] = useState(false);
  const [filters, setFilters] = useState({
    sort: 'Gần tôi nhất',
    categories: [] as string[],
    prices: [] as string[],
    times: [] as string[]
  });
  const [currentAddress, setCurrentAddress] = useState("123 Lê Lợi, Quận 1, TP.HCM");

  // Sync from URL search param
  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);

  const handleGps = () => {
    if ("geolocation" in navigator) {
      setCurrentAddress("Đang xác định vị trí...");
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data.display_name) {
            setCurrentAddress(data.display_name);
          } else {
            setCurrentAddress("Vị trí của bạn");
          }
        } catch (error) {
          setCurrentAddress("Vị trí của bạn");
        }
      }, () => {
        setCurrentAddress("Văn phòng 123 Lê Lợi");
      });
    }
  };

  const filteredProducts = initialProducts.filter((item) => {
    // 0. Urgent Filter (Expiring in < 24h)
    if (isUrgentOnly) {
      const hoursLeft = (new Date(item.expiryTime).getTime() - Date.now()) / (1000 * 60 * 60);
      if (hoursLeft > 24 || hoursLeft < 0) return false;
    }

    // 1. Text Search (product name OR store name)
    const q = searchQuery.toLowerCase();
    if (q) {
      const matchesSearch = item.name.toLowerCase().includes(q) || 
        item.store.name.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // 2. Chip Category & Bottom Sheet Category Filter
    const activeCategories = filters.categories.length > 0 ? filters.categories : (activeFilter !== "Tất cả" ? [activeFilter] : []);
    
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
      const itemCategory = item.category; // Enum code from DB
      
      if (mappedTargets.length > 0) {
        matchesCategory = mappedTargets.includes(itemCategory);
      }
    }

    // 3. Price Filter
    let matchesPrice = true;
    if (filters.prices.length > 0) {
      matchesPrice = filters.prices.some(priceRange => {
        if (priceRange === 'Dưới 20.000đ') return item.discountPrice < 20000;
        if (priceRange === '20.000đ - 50.000đ') return item.discountPrice >= 20000 && item.discountPrice <= 50000;
        if (priceRange === '50.000đ - 100.000đ') return item.discountPrice >= 50000 && item.discountPrice <= 100000;
        if (priceRange === 'Trên 100.000đ') return item.discountPrice > 100000;
        return true;
      });
    }

    return matchesCategory && matchesPrice;
  }).sort((a, b) => {
    if (filters.sort === 'Đánh giá tốt') return b.store.rating - a.store.rating;
    if (filters.sort === 'Giá: Thấp đến cao') return a.discountPrice - b.discountPrice;
    if (filters.sort === 'Giá: Cao đến thấp') return b.discountPrice - a.discountPrice;
    if (filters.sort === 'Sắp hết hạn') return new Date(a.expiryTime).getTime() - new Date(b.expiryTime).getTime();
    return 0;
  });

  return (
    <div className="relative w-full min-h-[100dvh] bg-surface pb-32">
      {/* Top Bar (Sticky) - Hidden on Desktop */}
      <header className="sticky top-0 left-0 w-full z-50 p-4 space-y-3 pb-4 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/10 shadow-sm lg:hidden">
        <div className="max-w-md mx-auto w-full space-y-2">
          {/* Address Bar */}
          <button 
            onClick={handleGps}
            className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full w-fit hover:bg-white/80 transition-colors active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
            <span className="text-on-surface font-semibold text-xs truncate max-w-[200px]">{currentAddress}</span>
            <span className="material-symbols-outlined text-on-surface-variant text-[14px]">expand_more</span>
          </button>

          {/* Search Bar */}
          <div className="bg-white/95 shadow-sm rounded-2xl flex items-center px-4 py-3 border border-outline-variant/20">
            <span className="material-symbols-outlined text-on-surface-variant mr-3">search</span>
            <input
              className="bg-transparent border-none outline-none focus:ring-0 text-on-surface font-body flex-1 text-sm p-0 placeholder:text-on-surface-variant/60"
              placeholder="Tìm quán cứu trợ quanh bạn..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="h-6 w-[1px] bg-outline-variant/30 mx-3"></div>
            <button onClick={() => setIsFilterOpen(true)}>
              <span className="material-symbols-outlined text-primary">tune</span>
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 pt-1">
          {["Tất cả", "Bánh mì/Bánh ngọt", "Cơm hộp/Đồ ăn nóng", "Trái cây/Rau củ", "Chay"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(activeFilter === cat ? "Tất cả" : cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold shadow-sm border transition-colors ${
                activeFilter === cat
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/20"
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
                : "bg-white text-tertiary border-tertiary/30"
            }`}
          >
            Sắp hết hạn
          </button>
        </div>
      </header>

      {/* Product List */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between px-1 mb-2">
          <div>
            <h2 className="font-extrabold text-on-surface text-lg md:text-xl lg:text-2xl">Gợi ý cho bạn</h2>
            <p className="text-xs text-on-surface-variant mt-1 hidden lg:block">Các phần ăn đang chờ bạn giải cứu</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Desktop Filter Button */}
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="hidden lg:flex items-center gap-2 bg-surface-container-low border border-outline-variant/20 px-4 py-2 rounded-xl text-sm font-bold text-primary hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-sm">tune</span>
              Bộ lọc
            </button>
            <span className="text-on-surface-variant text-sm font-medium">{filteredProducts.length} kết quả</span>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <span className="material-symbols-outlined text-5xl text-outline-variant">inventory_2</span>
            <p className="text-on-surface-variant font-medium">Không có sản phẩm nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="group bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden hover:shadow-md transition-all relative flex flex-col h-full"
              >
                {/* Primary Card Link (Detail Page) */}
                <Link href={`/product/${item.id}`} className="absolute inset-0 z-0" aria-label="Xem chi tiết sản phẩm" />

                <div className="p-4 relative z-10 pointer-events-none flex flex-col flex-1">
                  {/* Image Section */}
                  <div className="aspect-[21/9] lg:aspect-[16/10] w-full rounded-xl overflow-hidden mb-4 relative bg-surface-container-high flex-shrink-0">

                    <img
                      className="w-full h-full object-cover"
                      alt={item.name}
                      src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400"}
                    />
                    <div className="absolute top-3 left-3 bg-tertiary text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase">
                      CÒN {item.quantityLeft} PHẦN
                    </div>
                    <div className="absolute top-3 right-3 bg-white text-tertiary text-sm font-black px-2 py-1 rounded-lg shadow-md border border-tertiary/20">
                      -{item.discountPercent}%
                    </div>
                  </div>

                  {/* Store & Item Info */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-black text-on-surface line-clamp-1">{item.name}</h3>
                      <div className="flex items-center gap-2 text-on-surface-variant text-base mt-0.5">
                        <span className="font-bold text-primary truncate max-w-[140px] inline-block">{item.store.name}</span>
                        <span className="text-outline-variant">•</span>
                        <div className="flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-yellow-500 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="font-bold text-on-surface">{item.store.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0 ml-2">
                      {(() => {
                        const diff = new Date(item.expiryTime).getTime() - Date.now();
                        if (diff <= 0) return (
                          <div className="flex items-center gap-1 text-slate-400 font-bold text-[10px] uppercase bg-slate-100 px-2 py-1 rounded-md">
                            <span>Hết hạn</span>
                          </div>
                        );
                        
                        const h = Math.floor(diff / (1000 * 60 * 60));
                        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                        
                        return (
                          <div className="flex items-center gap-1 text-tertiary font-bold text-[10px] uppercase bg-tertiary/10 px-2 py-1 rounded-md animate-pulse">
                            <span className="material-symbols-outlined text-[12px]">timer</span>
                            <span>Còn {h > 0 ? `${h}h ` : ""}{m}p</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="flex items-center justify-between mt-auto pt-4">

                    <div className="flex flex-col">
                      <span className="text-xs text-on-surface-variant/60 line-through font-medium leading-none mb-1">
                        {item.originalPrice.toLocaleString("vi-VN")}đ
                      </span>
                      <span className="text-xl font-black text-primary leading-none">
                        {item.discountPrice.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                    {/* CTA Button Block - must be pointer-events-auto to override parent's none */}
                    <div className="pointer-events-auto relative z-20">
                      <Link
                        href={`/checkout/${item.id}`}
                        className="bg-primary text-white font-black text-sm px-8 py-3.5 rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 block"
                      >
                        CỨU NGAY
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Map Toggle Button */}
      <Link
        href="/"
        className="fixed bottom-[110px] lg:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 active:scale-95 transition-transform border border-white/10"
      >
        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
        Bản đồ
      </Link>

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
