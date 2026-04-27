"use client";

import { useRouter } from "next/navigation";

export default function StoreReviewsPage() {
  const router = useRouter();

  return (
    <div className="bg-background text-on-background min-h-screen pb-10">
      {/* TopAppBar */}
      <header className="sticky top-0 w-full z-50 bg-[#f9f9ff]/80 backdrop-blur-xl shadow-sm">
        <div className="flex items-center px-4 py-3 w-full">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()} 
              className="active:scale-95 transition-transform duration-200 text-[#006c49]"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-['Inter'] font-semibold tracking-tight text-[#141b2b] text-lg">Đánh giá & Nhận xét</h1>
          </div>
          {/* Share button removed per user request */}
        </div>
        <div className="bg-[#f1f3ff] h-[1px] w-full"></div>
      </header>
      
      <main className="desktop-page-shell-tight px-4 lg:px-6 xl:px-8 py-6 lg:py-8">
        {/* Rating Overview Section */}
        <section className="bg-surface-container-lowest rounded-xl p-6 mb-6 shadow-sm border border-outline-variant/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-extrabold text-on-background tracking-tighter">4.8</span>
              <div className="flex gap-0.5 my-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
              </div>
              <p className="text-on-surface-variant text-sm font-medium">Dựa trên 128 đánh giá</p>
            </div>
            
            <div className="space-y-2">
              {/* 5 Star */}
              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="w-2">5</span>
                <div className="flex-1 h-2 bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[85%]"></div>
                </div>
              </div>
              {/* 4 Star */}
              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="w-2">4</span>
                <div className="flex-1 h-2 bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[10%]"></div>
                </div>
              </div>
              {/* 3 Star */}
              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="w-2">3</span>
                <div className="flex-1 h-2 bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[3%]"></div>
                </div>
              </div>
              {/* 2 Star */}
              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="w-2">2</span>
                <div className="flex-1 h-2 bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[1%]"></div>
                </div>
              </div>
              {/* 1 Star */}
              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="w-2">1</span>
                <div className="flex-1 h-2 bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[1%]"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Filters Section */}
        <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4">
          <button className="whitespace-nowrap px-5 py-2 rounded-full bg-primary text-on-primary font-semibold text-sm shadow-sm transition-transform active:scale-95">Tất cả (128)</button>
          <button className="whitespace-nowrap px-5 py-2 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant font-medium text-sm transition-transform active:scale-95">Có hình ảnh (42)</button>
          <button className="whitespace-nowrap px-5 py-2 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant font-medium text-sm transition-transform active:scale-95">5 sao (112)</button>
          <button className="whitespace-nowrap px-5 py-2 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant font-medium text-sm transition-transform active:scale-95">4 sao (12)</button>
        </div>
        
        {/* Review List */}
        <div className="space-y-4 mt-4">
          {/* Review Card 1 */}
          <article className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 shadow-sm transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-sm">N</div>
                <div>
                  <h3 className="font-semibold text-sm text-on-background">Người dùng ẩn danh</h3>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-medium mt-0.5">20/10/2023</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
              Bánh mì rất ngon, vẫn còn giòn dù là hàng cuối ngày. Rất đáng tiền! Mình sẽ ủng hộ thêm để góp phần giảm lãng phí thức ăn.
            </p>
            <div className="flex gap-2">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-surface-container-low border border-outline-variant/10">
                <img alt="Bánh mì giòn" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1Z72OJJtPzCFnfGC2BtTx-ySGPmQOCHNmVD_moJyymvzgKIuPUR4imM9lxb2BbjJ3AcBsgm6RFbBNwG9thWWZswEcqon8LppuGfo08-C1G0YPKPDqRE-RW2l4OfCZK5Q9XFxd-pgRq5SgPzZx110NBVcInSy5IX0opyUMgPNgHW2tkI8ztsMIKSYAUia0LRoY5E04fMxG0G0nNn6d97QCBwTOWcxgJuBt6o6USUYugB3_nOrISH3uHXK9W5fs3GYBLx4tOW7OI8M"/>
              </div>
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-surface-container-low border border-outline-variant/10">
                <img alt="Túi giấy" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcpasFIigtaq_S1fzdYhDw7Cd-sbBZZqLv6Eu_YuXtWTF3gzCGmw0W1S2Ci-ydsdm6vcel1b88gJBIsjVhaHv_fTLKwWX9xVgMrCOVtEDuadDY3qpJx7pVttlBwM7jhGqp7ccUBmc7SO5boqMvKo2eTEjnxHLPzvHmMrCBhHsdT9YiVA7CGGTHPOo-4GthTFMi6_jt1nK54jot4_JDYmUc_O8mDiGHx5216m4njnUepABk5I0OWThKIRP0v_vSyETKBhq5bpy_zks"/>
              </div>
            </div>
          </article>
          
          {/* Review Card 2 */}
          <article className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 shadow-sm transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold text-sm">H</div>
                <div>
                  <h3 className="font-semibold text-sm text-on-background">Hoàng A.***</h3>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-medium mt-0.5">18/10/2023</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
              Túi mù bất ngờ, có cả bánh su kem mình thích. Cảm giác mở túi rất hồi hộp và vui. Chắc chắn sẽ quay lại.
            </p>
            <div className="flex gap-2">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-surface-container-low border border-outline-variant/10">
                <img alt="Bánh su kem" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkvmw1N6Gt6llY_IRUfM7yby-QW6NzWZhvc84yuVUhjzMKUhSAneTvrFoDTbMWGr0DCYpEf0zm6ZWttKxBxEu7kncYgxGabD_qXTDhpD7Dfrv4JS39PkBLw4jHf0wQeFI3O1RAddHZ6UPKvxSOPUrDxgFCom7kBaB2J823QNdxdFJFvm7Xf5ovMH8Ade8aWfG1MmguWq327AqrEOuJpDOlPLuobXrV8noReGYRwmQfAOsK6g605TEyjAG00szEqAzqPkXCzp1B_VU"/>
              </div>
            </div>
          </article>
          
          {/* Review Card 3 (Text only) */}
          <article className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 shadow-sm transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container font-bold text-sm">M</div>
                <div>
                  <h3 className="font-semibold text-sm text-on-background">Minh T.***</h3>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-medium mt-0.5">15/10/2023</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-[16px] text-outline-variant">star</span>
              </div>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Đồ ăn đóng gói sạch sẽ, nhân viên thân thiện. Một cách hay để tiết kiệm chi tiêu mà vẫn được ăn ngon.
            </p>
          </article>
        </div>
        
        <div className="flex justify-center mt-8 mb-4">
          <button className="flex items-center gap-2 text-primary font-bold text-sm hover:underline active:scale-95 transition-transform">
            Xem thêm 125 đánh giá khác
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
        </div>
      </main>
    </div>
  );
}
