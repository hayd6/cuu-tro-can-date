"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Html5Qrcode } from "html5-qrcode";
import { confirmPickup } from "@/lib/actions/orders";

interface Props {
  storeId: string;
}

export default function MerchantScanClient({ storeId }: Props) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isHandlingSuccess = useRef(false);
  const lastScannedCode = useRef<string | null>(null);

  const startScanner = async () => {
    try {
      const container = document.getElementById("qr-reader");
      if (!container) return;

      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;
      
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      
      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          if (isHandlingSuccess.current) return;
          
          // Ignore if it's the exact same code that just failed
          if (decodedText === lastScannedCode.current) return;
          
          isHandlingSuccess.current = true;
          lastScannedCode.current = decodedText;
          
          await stopScanner();
          handleScannedResult(decodedText);
        },
        () => {}
      );
      setIsReady(true);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError("Không thể truy cập camera. Vui lòng cấp quyền và thử lại.");
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop();
      scannerRef.current.clear();
      scannerRef.current = null;
    }
  };

  const handleScannedResult = async (orderId: string) => {
    setProcessing(true);
    setError(null);
    try {
      const res = await confirmPickup(orderId, storeId);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/merchant/orders");
        }, 1500);
      } else {
        setError(res.error || "Mã không hợp lệ. Vui lòng quét lại.");
        // We don't reset isHandlingSuccess immediately to allow the user to see the error
        // But we allow manual restart
      }
    } catch (err: any) {
      console.error(err);
      setError("Lỗi kết nối máy chủ. Vui lòng thử lại.");
    } finally {
      setProcessing(false);
    }
  };



  useEffect(() => {
    startScanner();
    return () => {
      stopScanner().catch(console.error);
    };
  }, []);

  const handleRestartScan = async () => {
    setError(null);
    setSuccess(false);
    setProcessing(false);
    
    isHandlingSuccess.current = true;
    lastScannedCode.current = null;
    
    await stopScanner();
    
    setTimeout(async () => {
      isHandlingSuccess.current = false;
      await startScanner();
    }, 300);
  };

  return (
    <div className="bg-black text-white min-h-[100dvh] font-body relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] pointer-events-none rounded-full"></div>

      <header className="sticky top-0 w-full z-50 bg-black/40 backdrop-blur-xl flex items-center justify-between px-4 h-16 border-b border-white/5">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-sm font-bold uppercase tracking-[0.2em]">Xác nhận đơn hàng</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex flex-col items-center justify-center pt-12 px-6">
        <div className="relative w-full max-w-sm aspect-square bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <div id="qr-reader" className="w-full h-full" />
          
          {isReady && !processing && (
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] border-2 border-primary rounded-2xl">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)] animate-scan"></div>
              </div>
            </div>
          )}

          {(!isReady || processing || success) && !error && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
              {success ? (
                <div className="flex flex-col items-center animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(var(--success-rgb),0.4)]">
                    <span className="material-symbols-outlined text-white text-5xl font-black">check</span>
                  </div>
                  <p className="text-lg font-black uppercase tracking-widest text-success">Thành công!</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center px-8">
                  <div className="w-12 h-12 border-4 border-primary border-t-white rounded-full animate-spin mb-6"></div>
                  {isHandlingSuccess.current && !processing && !success ? (
                    <div className="space-y-2 animate-pulse">
                      <p className="text-sm font-black uppercase tracking-widest text-white">Đang khởi động lại...</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">Vui lòng di chuyển camera ra xa mã QR cũ</p>
                    </div>
                  ) : (
                    <p className="text-sm font-bold uppercase tracking-widest text-white/80">
                      {processing ? "Đang xác nhận..." : "Đang bật camera..."}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center z-30 animate-in fade-in duration-300">
              <span className="material-symbols-outlined text-error text-6xl mb-4">
                {error.includes("camera") ? "videocam_off" : "cancel"}
              </span>
              <h2 className="text-lg font-black text-white mb-2 uppercase tracking-tight">
                {error.includes("camera") ? "Lỗi Camera" : "Mã không đúng"}
              </h2>
              <p className="text-xs font-medium mb-8 text-white/50 leading-relaxed max-w-[200px] mx-auto">
                {error}
              </p>
              <button 
                onClick={handleRestartScan}
                className="bg-error text-white font-bold px-10 py-4 rounded-2xl active:scale-95 transition-transform shadow-lg shadow-error/20 text-xs tracking-widest uppercase"
              >
                {error.includes("camera") ? "Thử lại" : "Quét lại ngay"}
              </button>
            </div>
          )}
        </div>

        <div className="mt-12 text-center space-y-6 w-full max-w-xs">
          <div className="space-y-2">
             <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Cách 1: Quét mã QR</p>
             <p className="text-xs text-white/60 leading-relaxed">
               Đưa mã QR của khách hàng vào khung hình để xác nhận tự động.
             </p>
          </div>

          <div className="h-[1px] w-full bg-white/10 relative">
             <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">Hoặc</span>
          </div>

          <div className="space-y-4">
             <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Cách 2: Nhập mã PIN</p>
             <Link 
               href="/merchant/enter-code"
               className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 active:scale-[0.98] transition-all"
             >
               <span className="material-symbols-outlined">keyboard</span>
               NHẬP MÃ THỦ CÔNG
             </Link>
          </div>
        </div>
      </main>



      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(250px); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        #qr-reader__dashboard { display: none !important; }
        #qr-reader__status_span { display: none !important; }
        #qr-reader video { width: 100% !important; height: 100% !important; object-fit: cover !important; }
      `}</style>
    </div>
  );
}
