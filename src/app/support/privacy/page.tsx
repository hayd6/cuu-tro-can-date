"use client";

import { useRouter } from "next/navigation";

export default function PrivacyPolicyPage() {
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
            <h1 className="font-['Inter'] font-semibold tracking-tight text-on-surface text-xl">Điều khoản và Chính sách</h1>
          </div>
        </div>
      </header>

      <main className="desktop-page-shell-tight px-4 lg:px-6 xl:px-8 py-12 pb-24 animate-in fade-in duration-300">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold tracking-widest uppercase mb-4">
            Văn bản pháp lý cập nhật
          </div>
          <h2 className="text-4xl font-extrabold tracking-tighter text-on-surface mb-2 leading-tight">Điều khoản và Chính sách</h2>
          <p className="text-on-surface-variant font-medium text-sm">Ngày cập nhật: 24/04/2026</p>
        </div>

        <div className="space-y-16">
          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>gavel</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">1. Quy định chung</h3>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-8 space-y-4 border border-outline-variant/10 shadow-sm">
              <p className="text-on-surface-variant leading-relaxed">
                Chào mừng bạn đến với Cứu Trợ Cận Date. Bằng cách sử dụng ứng dụng, bạn đồng ý tuân thủ các quy định nhằm xây dựng một cộng đồng cứu hộ thực phẩm văn minh:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-primary-container text-xl mt-0.5">verified</span>
                  <span className="text-on-surface font-medium leading-relaxed">Người dùng phải từ 15 tuổi trở lên hoặc có sự giám sát của người bảo hộ.</span>
                </li>
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-primary-container text-xl mt-0.5">verified</span>
                  <span className="text-on-surface font-medium leading-relaxed">Cam kết cung cấp thông tin chính xác khi đăng ký tài khoản.</span>
                </li>
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-primary-container text-xl mt-0.5">verified</span>
                  <span className="text-on-surface font-medium leading-relaxed">Ứng dụng có quyền tạm khóa tài khoản nếu phát hiện hành vi gian lận hoặc gây rối.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>assignment_ind</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">2. Quyền và nghĩa vụ người dùng</h3>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-8 space-y-6 border border-outline-variant/10 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/5">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Đối với Người Mua</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Kiểm tra kỹ tình trạng thực phẩm khi nhận hàng và hoàn thành thanh toán đúng hạn.</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/5">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Đối với Người Bán</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Đảm bảo thông tin sản phẩm (HSD, giá gốc) là trung thực và chịu trách nhiệm về chất lượng thực phẩm.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>cyclone</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">3. Quy trình giao dịch</h3>
            </div>
            <div className="bg-surface-container-highest/30 rounded-2xl p-8 border border-outline-variant/20 shadow-sm">
              <p className="text-on-surface-variant leading-relaxed mb-6 italic">
                Vì đặc thù thực phẩm "Cận Date", quy trình giao dịch được tối ưu hóa để diễn ra nhanh nhất:
              </p>
              <div className="space-y-4 font-medium text-sm">
                 <div className="flex items-start gap-4">
                    <span className="w-6 h-6 rounded-full bg-primary flex-shrink-0 items-center justify-center flex text-[10px] text-white">A</span>
                    <p>Đặt hàng trực tuyến thông qua ứng dụng và nhận mã lấy hàng (QR/Code).</p>
                 </div>
                 <div className="flex items-start gap-4">
                    <span className="w-6 h-6 rounded-full bg-primary flex-shrink-0 items-center justify-center flex text-[10px] text-white">B</span>
                    <p>Đến cửa hàng trong khung giờ quy định để lấy thực phẩm.</p>
                 </div>
                 <div className="flex items-start gap-4">
                    <span className="w-6 h-6 rounded-full bg-primary flex-shrink-0 items-center justify-center flex text-[10px] text-white">C</span>
                    <p>Không hỗ trợ hoàn trả đối với sản phẩm đã ra khỏi cửa hàng, trừ trường hợp lỗi từ phía Người Bán.</p>
                 </div>
              </div>
            </div>
          </section>

          {/* Section 4 - RESTORED BEAUTY */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>person_search</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">4. Thu thập thông tin</h3>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-8 space-y-4 border border-outline-variant/10 shadow-sm">
              <p className="text-on-surface-variant leading-relaxed">
                Chúng tôi thu thập các loại thông tin sau để đảm bảo quy trình cứu hộ thực phẩm diễn ra suôn sẻ và an toàn nhất cho người dùng:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-primary-container text-xl mt-0.5">check_circle</span>
                  <span className="text-on-surface font-medium leading-relaxed">Thông tin tài khoản: Họ tên, số điện thoại, địa chỉ email.</span>
                </li>
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-primary-container text-xl mt-0.5">check_circle</span>
                  <span className="text-on-surface font-medium leading-relaxed">Vị trí địa lý: Dữ liệu GPS để hiển thị thực phẩm gần bạn nhất.</span>
                </li>
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-primary-container text-xl mt-0.5">check_circle</span>
                  <span className="text-on-surface font-medium leading-relaxed">Lịch sử giao dịch: Các đơn hàng cứu hộ và phương thức thanh toán.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5 - RESTORED BEAUTY */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">5. Sử dụng thông tin</h3>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-8 space-y-6 border border-outline-variant/10 shadow-sm">
              <p className="text-on-surface-variant leading-relaxed">
                Mọi dữ liệu thu thập được xử lý dựa trên mục đích cải thiện nỗ lực giảm thiểu lãng phí thực phẩm toàn cầu:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/5">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Vận hành</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Xử lý đơn hàng và thông báo trạng thái đơn hàng thời gian thực.</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/5">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Cá nhân hóa</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Gợi ý sản phẩm "Cận Date" dựa trên sở thích và vị trí của bạn.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 - RESTORED BEAUTY */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>shield_lock</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">6. Bảo mật</h3>
            </div>
            <div className="bg-surface-container-highest/30 rounded-2xl p-8 border border-outline-variant/20 shadow-sm">
              <p className="text-on-surface-variant leading-relaxed mb-6">
                An toàn dữ liệu là ưu tiên tuyệt đối. Chúng tôi áp dụng chuẩn bảo mật khắt khe cho từng giao dịch:
              </p>
              <div className="space-y-4 font-medium text-sm">
                 <div className="flex gap-4 p-4 rounded-xl hover:bg-surface-container-lowest transition-colors group">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shadow-sm">4</div>
                   <div>
                     <p className="font-bold text-on-surface mb-1">Mã hóa AES-256</p>
                     <p className="text-xs text-on-surface-variant leading-relaxed">Mọi thông tin nhạy cảm đều được mã hóa tuyệt đối khi truyền tải.</p>
                   </div>
                 </div>
                 <div className="flex gap-4 p-4 rounded-xl hover:bg-surface-container-lowest transition-colors group">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shadow-sm">5</div>
                   <div>
                     <p className="font-bold text-on-surface mb-1">Giám sát 24/7</p>
                     <p className="text-xs text-on-surface-variant leading-relaxed">Hệ thống tường lửa thông minh ngăn chặn mọi hành vi xâm nhập trái phép.</p>
                   </div>
                 </div>
              </div>
            </div>
          </section>

          {/* Quick Contact Footer */}
          <section className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-primary to-primary-container text-white text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            <span className="material-symbols-outlined text-4xl mb-4 relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>contact_support</span>
            <h4 className="text-2xl font-bold mb-2 relative z-10">Bạn cần thêm thông tin?</h4>
            <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10 mt-6">
              <button className="bg-white text-primary font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity active:scale-95 duration-150 shadow-md">Gửi Email</button>
            </div>
          </section>
        </div>

        <footer className="mt-16 text-center border-t border-outline-variant/10 pt-8">
          <p className="text-on-surface-variant/60 text-xs">© 2026 Cứu Trợ Cận Date. All rights reserved.</p>
          <p className="text-on-surface-variant/60 text-xs mt-1 italic">Tối ưu hóa vòng đời thực phẩm vì tương lai xanh.</p>
        </footer>
      </main>
    </div>
  );
}
