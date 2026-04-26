"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialSort?: string;
  initialCategories?: string[];
  initialPrices?: string[];
  initialTimes?: string[];
  onApply: (filters: {
    sort: string;
    categories: string[];
    prices: string[];
    times: string[];
  }) => void;
}

export default function FilterBottomSheet({ 
  isOpen, 
  onClose, 
  onApply,
  initialSort = 'Gần tôi nhất',
  initialCategories = [],
  initialPrices = [],
  initialTimes = []
}: FilterBottomSheetProps) {
  const sortOptions = ['Gần tôi nhất', 'Sắp hết hạn', 'Giá: Thấp đến cao', 'Giá: Cao đến thấp', 'Đánh giá tốt'];
  const categoryOptions = ['Bánh ngọt', 'Đồ ăn mặn', 'Trái cây & Rau củ', 'Đồ chay'];
  const priceOptions = ['Dưới 20.000đ', '20.000đ - 50.000đ', '50.000đ - 100.000đ', 'Trên 100.000đ'];
  const timeOptions = [
    { title: 'Lấy ngay', desc: 'Dưới 30 phút' },
    { title: 'Buổi trưa', desc: '11:00 - 13:00' },
    { title: 'Buổi tối', desc: 'Sau 18:00' }
  ];

  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const [selectedPrices, setSelectedPrices] = useState<string[]>(initialPrices);
  const [selectedTimes, setSelectedTimes] = useState<string[]>(initialTimes);

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) setSelectedCategories(selectedCategories.filter(c => c !== cat));
    else setSelectedCategories([...selectedCategories, cat]);
  };

  const togglePrice = (price: string) => {
    if (selectedPrices.includes(price)) setSelectedPrices(selectedPrices.filter(p => p !== price));
    else setSelectedPrices([...selectedPrices, price]);
  };

  const toggleTime = (time: string) => {
    if (selectedTimes.includes(time)) setSelectedTimes(selectedTimes.filter(t => t !== time));
    else setSelectedTimes([...selectedTimes, time]);
  };

  const clearFilters = () => {
    setSelectedSort('Gần tôi nhất');
    setSelectedCategories([]);
    setSelectedPrices([]);
    setSelectedTimes([]);
  };

  const handleApply = () => {
    onApply({
      sort: selectedSort,
      categories: selectedCategories,
      prices: selectedPrices,
      times: selectedTimes
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-surface text-on-surface h-[90vh] w-full rounded-t-3xl flex flex-col overflow-hidden relative z-10 shadow-2xl"
          >
            {/* TopAppBar */}
            <header className="sticky top-0 w-full z-50 bg-surface/90 backdrop-blur-xl flex justify-between items-center px-4 py-3 border-b border-outline-variant/10">
              <button onClick={onClose} className="text-on-surface hover:bg-surface-container-high transition-all duration-200 active:scale-95 p-2 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>close</span>
              </button>
              <h1 className="text-xl font-bold text-on-surface font-['Inter'] tracking-tight">Bộ lọc tìm kiếm</h1>
              <button onClick={clearFilters} className="text-primary font-['Inter'] font-semibold tracking-tight text-sm hover:bg-primary/10 transition-all duration-200 active:scale-95 px-3 py-2 rounded-xl">
                Xóa bộ lọc
              </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-4 sm:px-6 w-full max-w-2xl mx-auto space-y-10 py-6 pb-24">
              
              {/* Sắp xếp */}
              <section className="space-y-4">
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-on-surface">Sắp xếp</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface-container-low p-4 rounded-xl">
                  {sortOptions.map((label) => (
                    <label key={label} onClick={() => setSelectedSort(label)} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-container-highest cursor-pointer transition-colors group">
                      <input checked={selectedSort === label} readOnly className="form-radio h-5 w-5 text-primary border-outline-variant bg-surface-container-highest focus:ring-primary focus:ring-opacity-20" name="sort" type="radio" />
                      <span className="text-[1.125rem] font-medium text-on-surface">{label}</span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Danh mục thực phẩm */}
              <section className="space-y-4">
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-on-surface">Danh mục thực phẩm</h2>
                <div className="flex flex-wrap gap-3">
                  {categoryOptions.map((item) => {
                    const isSelected = selectedCategories.includes(item);
                    return (
                      <button onClick={() => toggleCategory(item)} key={item} className={`px-5 py-2.5 rounded-xl text-[0.875rem] font-medium transition-colors ${isSelected ? 'bg-primary text-on-primary shadow-[0_4px_12px_rgba(0,108,73,0.2)]' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}>
                        {item}
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Khoảng giá */}
              <section className="space-y-4">
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-on-surface">Khoảng giá</h2>
                <div className="flex flex-wrap gap-3">
                  {priceOptions.map(item => {
                    const isSelected = selectedPrices.includes(item);
                    return (
                      <button onClick={() => togglePrice(item)} key={item} className={`px-5 py-2.5 rounded-xl text-[0.875rem] font-medium transition-colors ${isSelected ? 'bg-primary text-on-primary shadow-[0_4px_12px_rgba(0,108,73,0.2)]' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}>
                        {item}
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Khung giờ nhận hàng */}
              <section className="space-y-4">
                <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-on-surface">Khung giờ nhận hàng</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {timeOptions.map(time => {
                    const isSelected = selectedTimes.includes(time.title);
                    return (
                      <button onClick={() => toggleTime(time.title)} key={time.title} className={`flex flex-col items-start px-5 py-3 rounded-xl transition-colors border-[0.5px] border-outline-variant/15 ${isSelected ? 'bg-tertiary-container text-on-tertiary-container hover:bg-tertiary-container/80' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}>
                        <span className="text-[0.875rem] font-semibold">{time.title}</span>
                        <span className={`text-[0.75rem] mt-1 ${isSelected ? 'tracking-[0.05em] uppercase opacity-80 text-on-tertiary-container' : 'text-on-surface-variant'}`}>{time.desc}</span>
                      </button>
                    )
                  })}
                </div>
              </section>
            </main>

            <footer className="bg-surface/90 backdrop-blur-xl absolute bottom-0 w-full rounded-t-3xl border-t border-outline-variant/10 shadow-[0_-8px_24px_-4px_rgba(20,27,43,0.04)] flex justify-end items-center px-6 py-4 pb-safe z-50">
              <button 
                onClick={handleApply}
                className="bg-gradient-to-br w-full sm:w-auto from-primary to-primary-container text-on-primary shadow-lg font-['Inter'] font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-transform px-8 py-3 rounded-xl flex items-center justify-center min-w-[140px]"
              >
                Áp dụng ({selectedCategories.length + selectedPrices.length + selectedTimes.length + (selectedSort !== 'Gần tôi nhất' ? 1 : 0)})
              </button>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
