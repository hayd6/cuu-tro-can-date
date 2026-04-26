"use client";

import { useRouter } from "next/navigation";

export default function ComingSoonPage() {
  const router = useRouter();

  return (
    <div className="bg-surface text-on-surface antialiased min-h-[100dvh] font-body flex flex-col">
      {/* Top Navigation Anchor */}
      <header className="w-full z-50 bg-white/80 backdrop-blur-md h-16 flex items-center px-4 shrink-0">
        <div className="flex items-center w-full max-w-lg mx-auto">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-surface-container-high transition-colors active:scale-95 duration-200 rounded-full flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full animate-in zoom-in-95 duration-500 pb-20">
        
        {/* Animated Icon Container */}
        <div className="relative mb-10 w-32 h-32 flex items-center justify-center">
          {/* Pulse Rings */}
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-4 bg-primary/30 rounded-full animate-pulse"></div>
          
          {/* Inner Icon Circle */}
          <div className="relative z-10 w-24 h-24 bg-gradient-to-tr from-primary to-primary-container rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <span className="material-symbols-outlined text-white text-5xl animate-bounce mt-2" style={{ fontVariationSettings: "'FILL' 1" }}>draw</span>
          </div>
          
          {/* Decorative Sparks */}
          <span className="absolute top-0 right-0 material-symbols-outlined text-tertiary text-2xl animate-spin-slow">auto_awesome</span>
          <span className="absolute bottom-4 left-0 material-symbols-outlined text-secondary text-xl animate-pulse delay-150" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
        </div>

        {/* Text Area */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl font-black tracking-tight text-on-surface bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
            Sắp ra mắt!
          </h1>
          <p className="text-sm font-medium text-on-surface-variant max-w-xs mx-auto leading-relaxed">
            Tính năng này đang được đội ngũ <span className="text-primary font-bold">Cứu Trợ Cận Date</span> xây dựng và sẽ sớm ra mắt trong thời gian tới. Mong bạn thông cảm!
          </p>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => router.back()}
          className="bg-surface-container-lowest border border-outline-variant/20 shadow-md text-on-surface hover:text-primary hover:bg-primary/5 hover:border-primary/20 px-8 py-3.5 rounded-full font-bold transition-all active:scale-95 flex items-center gap-2"
        >
          <span className="material-symbols-outlined">undo</span>
          Quay lại trước đó
        </button>
      </main>
    </div>
  );
}
