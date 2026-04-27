"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Automatically navigate to home after 2 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="bg-primary min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden font-body">
      {/* Decorative Circles */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-primary-container/20 rounded-full blur-3xl"></div>
      <div className="absolute top-[40%] left-[20%] w-32 h-32 bg-secondary-fixed/20 rounded-full blur-2xl"></div>

      {/* Main Logo Container */}
      <div className="relative z-10 flex flex-col items-center animate-in zoom-in-95 fade-in duration-1000">
        <div className="w-28 h-28 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
        </div>
        
        <h1 className="text-4xl font-black tracking-tight text-white mb-2 text-center">
          Cứu Trợ<br />Cận Date
        </h1>
        
        <p className="text-white/80 font-medium tracking-widest uppercase text-xs">
          Giải cứu thực phẩm - Bảo vệ hành tinh
        </p>
      </div>

      {/* Loading Indicator */}
      <div className="absolute bottom-16 left-0 w-full flex justify-center">
        <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="w-1/2 h-full bg-white rounded-full animate-bounce mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
