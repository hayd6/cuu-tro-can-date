import Link from "next/link";

export default function Footer() {
  return (
    <footer className="hidden lg:block bg-surface-container-lowest border-t border-outline-variant/10 py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-4 md:px-6 xl:px-10 flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex-1">
          <h2 className="text-xl font-black text-emerald-700 mb-4 tracking-tight">Cứu Trợ Cận Date</h2>
          <p className="text-slate-600 text-sm mb-4 leading-relaxed max-w-sm">
            Nền tảng thương mại điện tử kết nối người dùng với các cửa hàng, siêu thị để giải cứu thực phẩm cận date, góp phần giảm thiểu lãng phí và bảo vệ môi trường.
          </p>
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Cứu Trợ Cận Date. Đã đăng ký bản quyền.
          </p>
        </div>
        
        <div className="flex gap-12">
          <div>
            <h3 className="font-bold text-on-surface mb-4">Về chúng tôi</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link href="/settings/about" className="hover:text-emerald-700 transition-colors">
                  Giới thiệu
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-on-surface mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">mail</span>
                support@cuutrocandate.vn
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">call</span>
                1900 1234
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-on-surface mb-4">Điều khoản</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link href="/support/privacy" className="hover:text-emerald-700 transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/support/terms" className="hover:text-emerald-700 transition-colors">
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link href="/support/faq" className="hover:text-emerald-700 transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
