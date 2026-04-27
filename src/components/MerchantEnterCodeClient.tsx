"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { confirmPickupByPin } from "@/lib/actions/orders";

interface Props {
  storeId: string;
}

export default function MerchantEnterCodeClient({ storeId }: Props) {
  const router = useRouter();
  const [pin, setPin] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showKeypad, setShowKeypad] = useState(true);
  
  const dragStartY = useRef<number | null>(null);

  const handleDragStart = (clientY: number) => {
    dragStartY.current = clientY;
  };

  const handleDragEnd = (clientY: number) => {
    if (dragStartY.current === null) return;
    const diff = clientY - dragStartY.current;
    
    // If dragged down by more than 30px
    if (diff > 30) {
      setShowKeypad(false);
    }
    dragStartY.current = null;
  };

  const handleKeyPress = (key: string) => {
    if (errorMsg) setErrorMsg(null);
    if (key === "backspace") {
      setPin(prev => prev.slice(0, -1));
    } else if (pin.length < 6) {
      setPin(prev => prev + key);
    }
  };

  const handleConfirm = async () => {
    if (pin.length !== 6 || processing) return;
    
    setProcessing(true);
    setErrorMsg(null);
    try {
      const res = await confirmPickupByPin(pin, storeId);
      if (res.success) {
        // Chuyển hướng sang trang verify-success (có thể mang theo order ID nếu cần)
        router.push("/merchant/verify-success");
      } else {
        setErrorMsg(res.error || "Mã PIN không đúng. Vui lòng thử lại.");
        setPin(""); // Clear pin on error for better UX
      }
    } catch (err: any) {
      setErrorMsg("Lỗi hệ thống khi xác nhận PIN. Vui lòng thử lại sau.");
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Bỏ qua nếu đang gõ trong một ô input nào đó (đề phòng)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key >= "0" && e.key <= "9") {
        handleKeyPress(e.key);
      } else if (e.key === "Backspace") {
        handleKeyPress("backspace");
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin, processing, errorMsg]); // Phụ thuộc vào các state để lấy giá trị mới nhất khi nhấn Enter


  return (
    <div className="bg-surface lg:bg-transparent text-on-surface font-body antialiased min-h-[100dvh] flex flex-col relative z-[100] max-w-lg lg:max-w-5xl mx-auto shadow-2xl lg:shadow-none lg:justify-center lg:items-center lg:p-8">
      
      {/* Desktop Wrapper */}
      <div className="flex flex-col lg:flex-row w-full flex-grow lg:flex-grow-0 lg:h-[600px] lg:bg-surface lg:rounded-[32px] lg:shadow-2xl lg:overflow-hidden">
        
        {/* LEFT PANEL */}
        <div className="flex flex-col w-full lg:w-1/2 lg:border-r border-outline-variant/15 relative">
          
          {/* TopAppBar */}
          <header className="sticky lg:absolute top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-surface-container lg:border-none lg:bg-transparent lg:backdrop-blur-none">
            <div className="flex items-center justify-between px-4 py-4 w-full">
              <button 
                onClick={() => router.back()}
                className="flex items-center justify-center w-10 h-10 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95 duration-200"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <h1 className="font-['Inter'] font-semibold tracking-tight text-lg text-on-surface lg:hidden">Nhập mã xác nhận</h1>
              <div className="w-10"></div> {/* Spacer for balance */}
            </div>
          </header>

          <main className="flex-grow flex flex-col items-center px-6 pt-16 lg:pt-0 pb-32 lg:pb-0 animate-in slide-in-from-bottom-8 duration-300 w-full lg:justify-center">
        <div className="w-full text-center max-w-[340px] mx-auto">
          <Link 
            href="/merchant/scan"
            className="mb-8 flex gap-2 items-center justify-center w-full text-primary font-bold hover:opacity-80 active:scale-95 transition-all bg-primary/10 py-3 rounded-xl"
          >
            <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
            <span>Chuyển sang Quét mã QR</span>
          </Link>

          <p className="text-on-surface-variant text-sm mb-10 leading-relaxed font-medium px-4">
            Vui lòng nhập mã PIN 6 số của đơn hàng do khách hàng cung cấp.
          </p>
          
          {/* OTP Input Area */}
          <div 
            className="flex justify-center gap-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity active:scale-95"
            onClick={() => setShowKeypad(true)}
          >
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const hasValue = index < pin.length;
              const isActive = index === pin.length;
              return (
                <div 
                  key={index}
                  className={`w-12 h-14 rounded-xl flex items-center justify-center text-xl font-bold transition-all
                    ${hasValue ? 'bg-primary/10 text-primary border-2 border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]' : 'bg-surface-container-highest border-2 border-transparent'}
                    ${isActive && !errorMsg ? 'bg-surface-container-lowest border-2 border-primary ring-4 ring-primary/10' : ''}
                    ${errorMsg ? 'border-2 border-error ring-4 ring-error/10 bg-error/5 text-error' : ''}
                  `}
                >
                  {hasValue ? (
                     <span className={`w-2.5 h-2.5 rounded-full ${errorMsg ? 'bg-error' : 'bg-primary'} animate-in zoom-in duration-200`}></span>
                  ) : (
                    isActive && !errorMsg && <span className="w-[2px] h-6 bg-primary animate-pulse"></span>
                  )}
                </div>
              );
            })}
          </div>

          {errorMsg && (
            <div className="text-error text-sm font-bold animate-in fade-in slide-in-from-top-2 mb-6 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              {errorMsg}
            </div>
          )}

          <div className="mt-8">
            <div className="bg-primary/5 p-4 rounded-2xl inline-flex items-start gap-3 border border-primary/10 w-full text-left">
              <span className="material-symbols-outlined text-primary text-xl mt-0.5">info</span>
              <span className="text-xs text-primary font-medium leading-relaxed">Khách hàng có thể tìm thấy mã PIN này trong phần <b>Chi tiết đơn hàng</b> trên ứng dụng của họ.</span>
            </div>
          </div>
        </div>
      </main>
    </div>

        {/* RIGHT PANEL - Numeric Keypad & Action Button Container (Bottom Sheet on Mobile) */}
        <div 
          className={`fixed lg:relative bottom-0 left-0 right-0 w-full lg:w-1/2 max-w-lg lg:max-w-none mx-auto bg-surface/95 lg:bg-surface-container-lowest backdrop-blur-2xl lg:backdrop-blur-none border-t border-outline-variant/15 lg:border-t-0 px-6 pt-2 lg:pt-0 pb-8 lg:pb-0 z-40 transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) rounded-t-3xl lg:rounded-none shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] lg:shadow-none lg:flex lg:flex-col lg:justify-center lg:items-center
            ${showKeypad ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
          `}
        >
          <div 
            className="w-full flex lg:hidden justify-center py-4 -mt-2 mb-2 cursor-grab active:cursor-grabbing touch-none"
          onClick={() => setShowKeypad(false)}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
          onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientY)}
          onMouseDown={(e) => handleDragStart(e.clientY)}
          onMouseUp={(e) => handleDragEnd(e.clientY)}
          onMouseLeave={() => { dragStartY.current = null; }}
        >
          <div className="w-12 h-1.5 bg-outline-variant/30 rounded-full transition-colors pointer-events-none"></div>
        </div>

        <div className="max-w-[340px] mx-auto">
          {/* Numeric Grid */}
          <div className="grid grid-cols-3 gap-y-2 gap-x-8 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button 
                key={num} 
                onClick={() => handleKeyPress(num.toString())}
                className="py-4 text-2xl font-bold active:bg-primary/10 rounded-2xl transition-all text-on-surface hover:text-primary active:scale-95"
              >
                {num}
              </button>
            ))}
            <div className="py-4"></div>
            <button 
              onClick={() => handleKeyPress("0")}
              className="py-4 text-2xl font-bold active:bg-primary/10 rounded-2xl transition-all text-on-surface hover:text-primary active:scale-95"
            >
              0
            </button>
            <button 
              onClick={() => handleKeyPress("backspace")}
              className="py-4 flex items-center justify-center active:bg-error/10 rounded-2xl transition-all text-on-surface-variant hover:text-error active:scale-95"
            >
              <span className="material-symbols-outlined text-3xl">backspace</span>
            </button>
          </div>
          
          {/* Confirm Button */}
          <button 
            onClick={handleConfirm}
            disabled={pin.length !== 6 || processing}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-sm
              ${pin.length === 6 && !processing
                ? 'bg-gradient-to-br from-primary to-primary-container text-white shadow-primary/25 active:scale-[0.98]' 
                : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed opacity-50'
              }
            `}
          >
            <span>{processing ? "Đang xác nhận..." : "Xác nhận đơn hàng"}</span>
            {!processing && <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}
