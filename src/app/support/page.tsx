"use client";

import { useRouter } from "next/navigation";

export default function SupportPage() {
  const router = useRouter();

  return (
    <div className="bg-surface text-on-surface antialiased min-h-[100dvh] font-body">
      {/* Top Navigation Bar */}
      <header className="w-full top-0 sticky z-50 bg-surface/80 backdrop-blur-xl border-b border-surface-container">
        <div className="flex items-center justify-between px-6 py-4 w-full max-w-3xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="text-primary active:scale-95 duration-150 p-2 rounded-xl hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-['Inter'] font-semibold tracking-tight text-on-surface text-xl">Hỗ trợ & Trợ giúp</h1>
          </div>
          <button className="text-primary active:scale-95 duration-150 p-2 rounded-xl hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-8 pb-24 animate-in fade-in duration-300">
        {/* Search Section */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-6 text-on-surface">Chào bạn, chúng tôi có thể giúp gì?</h2>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline-variant">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input 
              className="w-full h-14 pl-12 pr-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-on-surface-variant outline-none shadow-sm" 
              placeholder="Tìm kiếm câu hỏi..." 
              type="text"
            />
          </div>
        </section>

        {/* Category Bento Grid */}
        <section className="mb-12">
          <h3 className="font-['Inter'] text-sm font-medium uppercase tracking-[0.05em] text-on-surface-variant mb-6">Danh mục hỗ trợ</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Category 1 */}
            <button className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest rounded-2xl hover:bg-surface-container transition-colors group shadow-sm border border-outline-variant/10">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary">eco</span>
              </div>
              <span className="font-semibold text-sm">Cứu trợ</span>
            </button>
            {/* Category 2 */}
            <button className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest rounded-2xl hover:bg-surface-container transition-colors group shadow-sm border border-outline-variant/10">
              <div className="w-12 h-12 rounded-xl bg-secondary-container/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-secondary">payments</span>
              </div>
              <span className="font-semibold text-sm">Thanh toán</span>
            </button>
            {/* Category 3 */}
            <button className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest rounded-2xl hover:bg-surface-container transition-colors group shadow-sm border border-outline-variant/10">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-on-surface">account_circle</span>
              </div>
              <span className="font-semibold text-sm">Tài khoản</span>
            </button>
            {/* Category 4 */}
            <button className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest rounded-2xl hover:bg-surface-container transition-colors group shadow-sm border border-outline-variant/10">
              <div className="w-12 h-12 rounded-xl bg-tertiary-container/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-tertiary">gavel</span>
              </div>
              <span className="font-semibold text-sm">Chính sách</span>
            </button>
          </div>
        </section>

        {/* FAQ List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-['Inter'] text-sm font-medium uppercase tracking-[0.05em] text-on-surface-variant">Câu hỏi thường gặp</h3>
            <span className="text-xs font-semibold text-primary px-3 py-1 bg-primary/10 rounded-full">Phổ biến</span>
          </div>
          <div className="space-y-4">
            {[
              "Làm thế nào để nhận thực phẩm cứu trợ?",
              "Sản phẩm \"Cận Date\" có an toàn không?",
              "Chính sách hoàn tiền của Cứu Trợ Cận Date?",
              "Tôi có thể trở thành đối tác cung cấp không?"
            ].map((question, idx) => (
              <div key={idx} className="bg-surface-container-lowest rounded-2xl overflow-hidden group transition-all cursor-pointer shadow-sm border border-outline-variant/10 hover:bg-surface-container-low active:scale-[0.99]">
                <div className="flex items-center justify-between p-6">
                  <div className="flex gap-4 items-center">
                    <span className="material-symbols-outlined text-primary/60">help_outline</span>
                    <span className="font-medium text-on-surface">{question}</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support Card */}
        <section className="mt-12">
          <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-primary to-primary-container text-white shadow-lg">
            {/* Decorative Circle */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h4 className="text-xl font-bold mb-2">Vẫn cần sự giúp đỡ?</h4>
                <p className="text-white/80 text-sm max-w-xs">Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng 24/7 để giải quyết mọi vấn đề của bạn.</p>
              </div>
              <button className="bg-white text-primary font-bold px-6 py-3 rounded-xl active:scale-95 transition-transform shadow-lg hover:shadow-xl">
                Liên hệ ngay
              </button>
            </div>
          </div>
        </section>

        {/* Support Info Bento */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-surface-container-lowest border border-outline-variant/10 shadow-sm rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary-container text-sm">mail</span>
            </div>
            <div>
              <span className="block font-semibold text-on-surface">Email</span>
              <span className="text-sm text-on-surface-variant">support@cuutrocandate.vn</span>
            </div>
          </div>
          <div className="p-6 bg-surface-container-lowest border border-outline-variant/10 shadow-sm rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-secondary-container text-sm">call</span>
            </div>
            <div>
              <span className="block font-semibold text-on-surface">Hotline</span>
              <span className="text-sm text-on-surface-variant">1900 123 456</span>
            </div>
          </div>
        </section>

      </main>

      {/* Visual Anchor: Floating Feedback Button */}
      <div className="fixed bottom-8 right-6">
        <button className="bg-surface/80 backdrop-blur-md shadow-lg px-5 py-3 rounded-full flex items-center gap-2 text-primary font-semibold border border-primary/10 active:scale-95 transition-transform hover:shadow-xl">
          <span className="material-symbols-outlined">rate_review</span>
          <span className="text-sm">Gửi ý kiến</span>
        </button>
      </div>
    </div>
  );
}
