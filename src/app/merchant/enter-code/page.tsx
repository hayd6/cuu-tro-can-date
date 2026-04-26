"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MerchantEnterCodePage() {
  const router = useRouter();
  const [pin, setPin] = useState<string>("");

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setPin(prev => prev.slice(0, -1));
    } else if (pin.length < 6) {
      setPin(prev => prev + key);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-screen flex flex-col">
      
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-surface-container">
        <div className="flex items-center justify-between px-6 py-4 w-full max-w-xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="flex items-center justify-center p-2 rounded-full text-primary hover:bg-surface-container-high transition-colors active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <h1 className="font-['Inter'] font-semibold tracking-tight text-lg text-on-surface">Nhập mã xác nhận</h1>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center px-6 pt-24 pb-32 animate-in slide-in-from-bottom-8 duration-300 w-full max-w-xl mx-auto">
        <div className="w-full text-center">
          <Link 
            href="/merchant/scan"
            className="mb-8 flex space-x-2 items-center justify-center w-full text-primary font-bold hover:underline group"
          >
            <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">qr_code_scanner</span>
            <span>Chuyển sang Quét mã QR</span>
          </Link>

          <p className="text-on-surface-variant text-base mb-10 leading-relaxed font-medium">
            Vui lòng nhập mã PIN 6 số của đơn hàng để xác nhận.
          </p>
          
          {/* OTP Input Area */}
          <div className="flex justify-center gap-2 mb-12">
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const hasValue = index < pin.length;
              const isActive = index === pin.length;
              return (
                <div 
                  key={index}
                  className={`w-12 h-14 rounded-xl flex items-center justify-center text-xl font-bold transition-all shadow-sm
                    ${hasValue ? 'bg-primary/10 text-primary border-2 border-primary/20' : 'bg-surface-container-highest border-2 border-transparent'}
                    ${isActive ? 'bg-surface-container-lowest border-2 border-primary ring-4 ring-primary/10' : ''}
                  `}
                >
                  {hasValue ? (
                     <span className="w-2.5 h-2.5 rounded-full bg-primary animate-in zoom-in duration-200"></span>
                  ) : (
                    isActive && <span className="w-[2px] h-6 bg-primary animate-pulse"></span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <div className="bg-primary/5 p-4 rounded-2xl inline-flex items-center gap-3 border border-primary/10 max-w-[300px]">
              <span className="material-symbols-outlined text-primary">info</span>
              <span className="text-xs text-primary font-medium text-left">Mã PIN được gửi cho khách hàng qua ứng dụng.</span>
            </div>
          </div>
        </div>
      </main>

      {/* Numeric Keypad & Action Button Container */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-outline-variant/15 px-6 pt-6 pb-10 z-40 animate-in slide-in-from-bottom-full duration-300">
        <div className="max-w-md mx-auto">
          {/* Numeric Grid */}
          <div className="grid grid-cols-3 gap-y-2 gap-x-12 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button 
                key={num} 
                onClick={() => handleKeyPress(num.toString())}
                className="py-4 text-2xl font-bold active:bg-primary/10 rounded-2xl transition-all text-on-surface hover:text-primary"
              >
                {num}
              </button>
            ))}
            <div className="py-4"></div>
            <button 
              onClick={() => handleKeyPress("0")}
              className="py-4 text-2xl font-bold active:bg-primary/10 rounded-2xl transition-all text-on-surface hover:text-primary"
            >
              0
            </button>
            <button 
              onClick={() => handleKeyPress("backspace")}
              className="py-4 flex items-center justify-center active:bg-primary/10 rounded-2xl transition-all text-on-surface-variant hover:text-error"
            >
              <span className="material-symbols-outlined">backspace</span>
            </button>
          </div>
          
          {/* Confirm Button */}
          <Link 
            href="/merchant/verify-success"
            className={`w-full py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg
              ${pin.length === 6 
                ? 'bg-gradient-to-br from-primary to-primary-container text-white shadow-primary/25 active:scale-[0.98]' 
                : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed opacity-50 pointer-events-none'
              }
            `}
          >
            <span>Xác nhận đơn hàng</span>
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
