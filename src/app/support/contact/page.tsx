"use client";

import { useRouter } from "next/navigation";

export default function ContactSupportPage() {
  const router = useRouter();

  return (
    <div className="bg-surface text-on-surface min-h-[100dvh] font-body">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-50 bg-surface/90 backdrop-blur-md border-b border-surface-container">
        <div className="flex items-center justify-between px-6 py-4 w-full max-w-xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="text-primary active:scale-95 duration-150 p-2 -ml-2 rounded-xl hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-['Inter'] font-semibold tracking-tight text-on-surface text-xl">Hỗ trợ & Liên hệ</h1>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 pb-24 animate-in fade-in duration-300">
        {/* Support Options - Bento Style Layout */}
        <div className="grid grid-cols-1 gap-4 mb-8 mt-6">
          {/* Primary Action: Chat */}
          <div className="group relative overflow-hidden rounded-xl bg-surface-container-low p-1 active:scale-[0.98] transition-transform duration-150 shadow-sm border border-outline-variant/10">
            <div className="bg-surface-container-lowest rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="bg-gradient-to-br from-primary to-primary-container w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-md">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Chat trực tiếp</h3>
                  <p className="text-on-surface-variant text-sm">Trao đổi trực tiếp với nhân viên</p>
                </div>
              </div>
              <button 
                onClick={() => router.push("/coming-soon")}
                className="bg-gradient-to-br from-primary to-primary-container text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm active:scale-95 transition-all w-full md:w-auto"
              >
                Kết nối ngay
              </button>
            </div>
          </div>

          {/* Grid for Hotline & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hotline Card */}
            <div className="bg-secondary-container rounded-xl p-6 flex flex-col justify-between h-44 active:scale-[0.98] transition-transform shadow-sm">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-on-secondary-container text-3xl">call</span>
                <span className="bg-on-secondary-container/10 text-on-secondary-container text-[10px] font-bold px-2 py-1 rounded-full tracking-wider">PRIORITY</span>
              </div>
              <div>
                <p className="text-on-secondary-container/70 text-xs font-bold uppercase tracking-widest mb-1">Hotline 24/7</p>
                <h4 className="text-xl font-extrabold text-on-secondary-container">1900 123 456</h4>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-surface-container-highest rounded-xl p-6 flex flex-col justify-between h-44 active:scale-[0.98] transition-transform shadow-sm">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-primary text-3xl">mail</span>
                <div className="w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center bg-white/50">
                  <span className="material-symbols-outlined text-primary text-sm">open_in_new</span>
                </div>
              </div>
              <div>
                <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">Gửi Email</p>
                <h4 className="text-lg font-bold text-on-surface truncate">support@cuutrocandate.vn</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Operating Hours & Status */}
        <footer className="bg-surface-container-low rounded-2xl p-8 text-center relative overflow-hidden border border-outline-variant/10 shadow-sm mt-8">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-primary font-bold text-sm tracking-wide">SYSTEM ONLINE</span>
            </div>
            <h4 className="text-2xl font-black text-on-surface mb-2">Hoạt động 24/7</h4>
            <p className="text-on-surface-variant text-sm max-w-[240px] leading-relaxed">
              Đội ngũ Cứu Trợ Cận Date luôn sẵn sàng hỗ trợ bạn bất kể ngày đêm.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
