"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Inline types (replacing removed mockData)
type Item = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  discountPercent: number;
  discountPrice: number;
  originalPrice: number;
  quantityLeft: number;
  expiryTime: string | Date;
  allergens?: string[];
};
type Store = { id: string; name: string };


export default function ProductBottomSheet({ 
  isOpen, 
  onClose, 
  item, 
  store 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  item: Item | null; 
  store: Store | null; 
}) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!item) return;
    const interval = setInterval(() => {
      const ms = new Date(item.expiryTime).getTime() - Date.now();
      if (ms <= 0) {
        setTimeLeft("00:00:00");
        return;
      }
      const hrs = Math.floor(ms / 3600000).toString().padStart(2, '0');
      const mins = Math.floor((ms % 3600000) / 60000).toString().padStart(2, '0');
      const secs = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
      setTimeLeft(`${hrs}:${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [item]);

  if (!item || !store) return null;

  const isExpired = new Date(item.expiryTime).getTime() - Date.now() <= 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] max-h-[90vh] overflow-y-auto pb-safe"
          >
            <div className="relative">
               <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full backdrop-blur-md">
                 <X size={20} />
               </button>

               <div className="w-full h-56 bg-surface-container-low relative">
                 <img src={item.imageUrl || item.image || ""} alt={item.name} className="w-full h-full object-cover rounded-t-3xl" />
                 <div className="absolute top-4 left-4 bg-danger-500 text-white font-bold px-3 py-1 rounded-full text-xs shadow-md">
                   GIẢM {item.discountPercent}%
                 </div>
                 <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                    <Clock size={16} className={`${isExpired ? 'text-on_surface_variant' : 'text-danger-500'}`} />
                    <span className={`font-mono font-semibold text-sm ${isExpired ? 'text-on_surface_variant' : 'text-danger-500'}`}>
                      {timeLeft || "Đang tính..."}
                    </span>
                 </div>
               </div>

               <div className="px-6 py-5">
                 <div className="text-on_surface_variant text-sm font-medium mb-1">{store.name}</div>
                 <h2 className="text-xl font-bold text-on_surface leading-tight mb-3">{item.name}</h2>
                 
                 <div className="flex items-end gap-3 mb-4">
                   <div className="text-2xl font-bold text-primary-500">{item.discountPrice.toLocaleString()}đ</div>
                   <div className="text-on_surface_variant line-through mb-1 text-sm">{item.originalPrice.toLocaleString()}đ</div>
                   <div className="ml-auto bg-surface-container-low px-3 py-1 rounded-lg text-sm text-on_surface font-medium">
                     Còn {item.quantityLeft} phần
                   </div>
                 </div>

                 <div className="bg-primary-50 rounded-xl p-4 mb-4 flex items-start gap-3">
                   <Clock className="text-primary-500 mt-0.5 shrink-0" size={20} />
                   <div>
                     <div className="font-semibold text-sm text-primary-600">Giờ lấy hàng: 19:00 - 20:00 hôm nay</div>
                     <div className="text-xs text-on_surface_variant mt-1">Vui lòng đến đúng giờ để lấy phần ăn.</div>
                   </div>
                 </div>

                 <div className="space-y-2 mb-6">
                   <p className="text-sm text-on_surface_variant leading-relaxed">
                     {item.description}
                   </p>
                   {item.allergens && (
                     <p className="text-xs text-on_surface_variant">
                       <span className="font-medium text-on_surface">Cảnh báo dị ứng:</span> {item.allergens.join(", ")}
                     </p>
                   )}
                 </div>

                 <button 
                  disabled={isExpired || item.quantityLeft === 0}
                  onClick={() => router.push(`/checkout/${item.id}`)}
                  className="w-full bg-gradient-to-br from-primary-500 to-primary_container text-white py-4 rounded-xl font-bold shadow-ambient transition-transform active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:from-gray-400 disabled:to-gray-500 disabled:pointer-events-none"
                 >
                   {isExpired ? "ĐÃ HẾT HẠN" : item.quantityLeft === 0 ? "ĐÃ HẾT HÀNG" : "CỨU NGAY"}
                 </button>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
