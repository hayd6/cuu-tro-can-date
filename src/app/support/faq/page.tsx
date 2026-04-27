"use client";

import { useRouter } from "next/navigation";

export default function FAQPage() {
  const router = useRouter();

  return (
    <div className="bg-surface text-on-surface antialiased min-h-[100dvh] font-body">
      {/* Top Navigation Bar */}
      <header className="w-full top-0 sticky z-50 bg-surface/90 backdrop-blur-md border-b border-surface-container">
        <div className="desktop-page-shell-tight flex items-center justify-between px-4 lg:px-6 py-4 w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="text-primary active:scale-95 duration-150 p-2 -ml-2 rounded-xl hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-['Inter'] font-semibold tracking-tight text-on-surface text-xl">Trung tâm trợ giúp</h1>
          </div>
        </div>
      </header>
      
      <main className="desktop-page-shell-tight px-4 lg:px-6 xl:px-8 pt-8 pb-24 animate-in fade-in duration-300">
        {/* Search Section */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-6 text-on-surface">Chào bạn, chúng tôi<br/>có thể giúp gì?</h2>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline-variant">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input 
              role="searchbox"
              className="w-full h-14 pl-12 pr-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-on-surface-variant outline-none" 
              placeholder="Tìm kiếm câu hỏi..." 
              type="text"
            />
          </div>
        </section>

        {/* Category Bento Grid */}
        <section className="mb-12">
          <h3 className="text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant mb-6 px-1">Danh mục hỗ trợ</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Category 1 */}
            <button className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl hover:bg-surface-container transition-colors group shadow-sm active:scale-95">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary">eco</span>
              </div>
              <span className="font-semibold text-sm">Cứu trợ</span>
            </button>
            {/* Category 2 */}
            <button className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl hover:bg-surface-container transition-colors group shadow-sm active:scale-95">
              <div className="w-12 h-12 rounded-xl bg-secondary-container/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-secondary">payments</span>
              </div>
              <span className="font-semibold text-sm">Thanh toán</span>
            </button>
            {/* Category 3 */}
            <button className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl hover:bg-surface-container transition-colors group shadow-sm active:scale-95">
               <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-on-surface">account_circle</span>
              </div>
              <span className="font-semibold text-sm">Tài khoản</span>
            </button>
            {/* Category 4 */}
            <button onClick={() => router.push('/support/privacy')} className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl hover:bg-surface-container transition-colors group shadow-sm active:scale-95">
              <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-tertiary">gavel</span>
              </div>
              <span className="font-semibold text-sm">Chính sách</span>
            </button>
          </div>
        </section>

        {/* FAQ List */}
        <section>
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant">Câu hỏi thường gặp</h3>
            <span className="text-xs font-semibold text-primary px-3 py-1 bg-primary/10 rounded-full">Phổ biến</span>
          </div>
          <div className="space-y-3">
            {/* FAQ Item 1 */}
            <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl overflow-hidden group transition-all cursor-pointer shadow-sm hover:shadow-md">
              <div className="flex items-center justify-between p-6">
                <div className="flex gap-4 items-center">
                  <span className="material-symbols-outlined text-primary/60">help_outline</span>
                  <span className="font-medium text-on-surface">Làm thế nào để nhận thực phẩm cứu trợ?</span>
                </div>
                <span className="material-symbols-outlined text-outline-variant group-hover:translate-x-1 group-hover:text-primary transition-transform">chevron_right</span>
              </div>
            </div>
            {/* FAQ Item 2 */}
            <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl overflow-hidden group transition-all cursor-pointer shadow-sm hover:shadow-md">
              <div className="flex items-center justify-between p-6">
                <div className="flex gap-4 items-center">
                  <span className="material-symbols-outlined text-primary/60">help_outline</span>
                  <span className="font-medium text-on-surface">Sản phẩm "Cận Date" có an toàn không?</span>
                </div>
                <span className="material-symbols-outlined text-outline-variant group-hover:translate-x-1 group-hover:text-primary transition-transform">chevron_right</span>
              </div>
            </div>
            {/* FAQ Item 3 */}
            <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl overflow-hidden group transition-all cursor-pointer shadow-sm hover:shadow-md">
              <div className="flex items-center justify-between p-6">
                <div className="flex gap-4 items-center">
                  <span className="material-symbols-outlined text-primary/60">help_outline</span>
                  <span className="font-medium text-on-surface">Chính sách hoàn tiền của Cứu Trợ Cận Date?</span>
                </div>
                <span className="material-symbols-outlined text-outline-variant group-hover:translate-x-1 group-hover:text-primary transition-transform">chevron_right</span>
              </div>
            </div>
            {/* FAQ Item 4 */}
            <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl overflow-hidden group transition-all cursor-pointer shadow-sm hover:shadow-md">
              <div className="flex items-center justify-between p-6">
                <div className="flex gap-4 items-center">
                  <span className="material-symbols-outlined text-primary/60">help_outline</span>
                  <span className="font-medium text-on-surface">Tôi có thể trở thành đối tác cung cấp không?</span>
                </div>
                <span className="material-symbols-outlined text-outline-variant group-hover:translate-x-1 group-hover:text-primary transition-transform">chevron_right</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support Card */}
        <section className="mt-12">
          <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-primary to-primary-container text-white shadow-lg">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h4 className="text-xl font-bold mb-2">Vẫn cần sự giúp đỡ?</h4>
                <p className="text-white/80 text-sm max-w-xs">Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng 24/7 để giải quyết mọi vấn đề của bạn.</p>
              </div>
              <button onClick={() => router.push('/support/contact')} className="bg-white text-primary font-bold px-6 py-3 rounded-xl active:scale-95 transition-all shadow-md w-full md:w-auto text-center">
                Liên hệ ngay
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
