"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MerchantVerifySuccessPage() {
  const router = useRouter();

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container/30 min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-6 h-16 w-full bg-[#f1f3ff] border-b border-surface-container/50">
        <button 
          onClick={() => router.push('/merchant')}
          className="absolute left-6 p-2 -ml-2 rounded-full hover:bg-[#dce2f7]/50 transition-colors active:scale-95 duration-150"
        >
          <span className="material-symbols-outlined text-slate-900">close</span>
        </button>
        <h1 className="font-['Inter'] font-semibold tracking-tight text-slate-900 mx-auto">Xác nhận đơn hàng</h1>
      </header>

      <main className="flex-grow pt-24 pb-48 px-6 flex flex-col items-center max-w-lg mx-auto w-full animate-in fade-in duration-500">
        {/* Success Icon & Title */}
        <div className="mt-8 mb-8 flex flex-col items-center text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary-container/20 rounded-full scale-125 blur-xl animate-pulse"></div>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg relative z-10">
              <span className="material-symbols-outlined text-white text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2 text-on-surface">Đơn hàng đã được xác nhận!</h2>
          <p className="text-on-surface-variant max-w-[280px]">
            Đơn hàng <span className="font-bold text-primary">#847-291</span> đã được đối soát thành công. Bạn có thể bàn giao túi đồ cho khách hàng.
          </p>
        </div>

        {/* Handover Details */}
        <section className="w-full space-y-4">
          <div className="bg-surface-container-low rounded-2xl p-6 relative overflow-hidden border border-outline-variant/10">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container/5 rounded-full -mr-8 -mt-8"></div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70 mb-4">Chi tiết bàn giao</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">person</span>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase">Người mua</p>
                  <p className="text-base font-bold text-on-surface">Nguyễn Văn A</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">shopping_bag</span>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase">Sản phẩm</p>
                  <p className="text-base font-bold text-on-surface leading-tight">1x Túi mù bánh mì & Bánh ngọt</p>
                </div>
              </div>

              <div className="pt-4 mt-2 bg-surface-container-highest/30 rounded-xl p-4 border border-outline-variant/5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-on-surface-variant text-xs font-medium">Trạng thái</span>
                  <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-wider">Đã thanh toán</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-on-surface-variant text-xs" >Tổng cộng</span>
                  <span className="text-2xl font-black text-primary tracking-tight">15.000đ</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-4 flex items-center gap-4 border border-outline-variant/10 shadow-sm">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
              <img 
                alt="Product" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdVSbyesKrILJBhSS4rYrzvK4BVu_yORCrHWjDR3vI90yrGtEPr420O5s_7xS1q5CNO9ufnfbgrL5HPN22XkypOcDWyGxstslPleNig3J1nXYWn_5DW62D86fqYIx6OJzkTUFJbRUhcQxRtt6wo6E64QqUjEOYpwjAhx7sWHaIvkv-b0ziuA1MkJhADwh4gCAZND93CxyhMs_vK7QbR3wKJ9EOHK7Sugl44Pu54NdHTrNYmQsk5lDtt7rWkqRhzncn5xhnGxenfL8" 
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-on-surface">Đóng gói ngay</p>
              <p className="text-[10px] text-on-surface-variant leading-tight">Đảm bảo sản phẩm vẫn còn giòn và tươi ngon trước khi giao.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Actions */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-surface/80 backdrop-blur-xl z-40 max-w-lg mx-auto space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Link 
            href="/merchant/scan"
            className="h-14 bg-surface-container-high text-primary font-bold rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-outline-variant/10 hover:bg-surface-container-highest"
          >
            <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
            <span>Quét tiếp</span>
          </Link>
          <Link 
            href="/merchant/enter-code"
            className="h-14 bg-surface-container-high text-primary font-bold rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-outline-variant/10 hover:bg-surface-container-highest"
          >
            <span className="material-symbols-outlined text-xl">keyboard</span>
            <span>Nhập mã</span>
          </Link>
        </div>
        
        <button 
          onClick={() => router.push('/merchant')}
          className="w-full h-14 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-2xl active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
        >
          <span>Về Trang Chủ</span>
          <span className="material-symbols-outlined text-xl">home</span>
        </button>
      </footer >
    </div>
  );
}
