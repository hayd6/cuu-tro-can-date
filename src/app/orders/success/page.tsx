"use client";

import { CheckCircle2, ChevronRight, QrCode } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function SuccessPage() {
  return (
    <div className="min-h-[100dvh] bg-surface px-6 pt-24 pb-32 flex flex-col items-center">
      <motion.div 
        initial={{ scale: 0 }} 
        animate={{ scale: 1 }} 
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
        className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center shadow-ambient mb-6"
      >
        <CheckCircle2 size={40} className="text-white" strokeWidth={2.5} />
      </motion.div>
      <h1 className="text-2xl font-bold text-center mb-2 text-on_surface">Giải cứu thành công!</h1>
      <p className="text-on_surface_variant text-center mb-10 max-w-[250px] text-sm">
        Chuẩn bị đồ nghề ra đón bé thức ăn về dinh thôi nào!
      </p>

      <div className="bg-surface-container-lowest w-full p-6 rounded-3xl shadow-sm text-center mb-6">
        <div className="text-sm text-on_surface_variant mb-1 font-medium">Mã nhận đồ:</div>
        <div className="text-4xl font-mono font-bold tracking-[0.2em] text-primary-500 mb-6 py-2">847291</div>
        <div className="w-full h-px bg-surface-container-low mb-6"></div>
        <div className="text-sm font-medium mb-3 text-on_surface_variant">Hoặc dùng mã QR tại quầy:</div>
        <div className="mx-auto w-48 h-48 bg-surface-container-low rounded-2xl flex items-center justify-center overflow-hidden border-2 border-primary-50">
          <QrCode size={120} className="text-main opacity-80" />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-surface-container-lowest border-t border-surface-container-low lg:left-64 shadow-up pb-safe z-50">
        <Link href="/orders" className="w-full bg-surface-container-low hover:bg-surface-container-highest transition-colors text-on_surface py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95">
          Đi đến Trạm Đơn Hàng <ChevronRight size={20} />
        </Link>
      </div>
    </div>
  );
}
