"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { switchUserRole } from "@/lib/actions/users";
import { useSession, signOut } from "next-auth/react";

interface UserProfileProps {
  user: {
    id: string;
    email: string;
    name?: string | null;
    phone?: string | null;
    avatarUrl?: string | null;
    role: string;
  };
  greenStats: {
    foodSavedKg: number;
    co2ReducedKg: number;
    totalSavings: number;
    rank: string;
    level: number;
  };
}

export default function ProfileClient({ user: initialUser, greenStats }: UserProfileProps) {
  const router = useRouter();
  const { data: session, update } = useSession();
  
  // Source of truth: session role, then fallback
  const user = (session?.user as any) || initialUser;
  const currentRole = user.role;

  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  
  // The toggle is now an "Action Switch" that starts OFF (unchecked)
  // Turning it ON triggers the switch to the OTHER role.
  const [isFlipping, setIsFlipping] = useState(false);

  const handleRoleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFlipping) return;
    
    setIsFlipping(true);

    try {
      // Xác định role mới dựa trên role HIỆN TẠI của người dùng
      const newRole = currentRole === "MERCHANT" ? "BUYER" : "MERCHANT";
      
      console.log(`[RoleSwitch] Switching from ${currentRole} to ${newRole}`);
      
      // 1. Cập nhật Database
      await switchUserRole(user.id, newRole);
      
      // 2. Cập nhật NextAuth Session (Client-side)
      await update({ role: newRole });

      // 3. Chuyển hướng bằng window.location để force reload toàn bộ app
      // Điều này đảm bảo tất cả Provider (AppProvider, Shell) đều nhận role mới sạch sẽ
      const targetPath = newRole === "MERCHANT" ? "/merchant" : "/";
      window.location.href = targetPath;
      
    } catch (err) {
      console.error("Lỗi chuyển đổi role:", err);
      setIsFlipping(false);
      alert("Không thể chuyển đổi vai trò. Vui lòng thử lại.");
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-[100dvh] font-body">
      {/* Top AppBar */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md px-6 py-4 flex items-center justify-between w-full border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <h1 className="font-headline font-semibold tracking-tight text-xl text-on-surface">Cá nhân</h1>
        </div>
        <Link href="/settings" className="p-2 hover:bg-surface-container-low rounded-full transition-colors active:scale-95 text-on-surface-variant inline-flex items-center justify-center">
          <span className="material-symbols-outlined">settings</span>
        </Link>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6 pb-32 space-y-8">
        {/* Profile Header Section */}
        <section className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <img 
              alt="Profile Avatar" 
              className="w-24 h-24 rounded-full object-cover border-4 border-surface-container-lowest shadow-sm" 
              src={user.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDjxawOqSKQhMB0xhPirT7jQ8D4lDk39DWEhGbpVRVP-M1nJEY-BAL3BThynaGWhjFvr3_Utb1Qb9vdDUWFbcvgt6CRXW2rWSjOezEbQlRvLnNfbfFwq8eMPZZrRuxsTsIhM2EzfAytsdQCX4dYlBASDKWTNXJ8MrAJ4bz08P5Ya5L375GfSXDvqCPry9ydUg110OS8AwOI7vJuK-ziWJ7h9B4xOcrkoGB8FmfaHMiE2hnFo0vvWEXSp4wF6rLbQwsFEuyxfzsJbVM"}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{user.name || "Người Dùng"}</h2>
            <p className="text-on-surface-variant text-sm">{user.email}</p>
            {user.phone && <p className="text-on-surface-variant text-xs mt-1">{user.phone}</p>}
          </div>
          <Link href="/profile/edit" className="inline-block px-6 py-2 bg-surface-container-high text-primary font-medium rounded-full hover:bg-surface-container-highest transition-colors active:scale-95 duration-150 shadow-sm border border-outline-variant/10">
            Chỉnh sửa hồ sơ
          </Link>
        </section>

        {/* Impact Dashboard 'Chiến binh xanh' */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
              Chiến binh xanh
            </h3>
            <span className="text-primary text-xs font-bold uppercase tracking-widest bg-primary-container/20 px-2 py-1 rounded">LEVEL {greenStats.level}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* Card 1 */}
            <div className="bg-surface-container-lowest border border-outline-variant/10 shadow-sm p-4 rounded-[16px] flex flex-col space-y-2">
              <span className="material-symbols-outlined text-primary">restaurant</span>
              <div>
                <p className="text-xs text-on-surface-variant">Thực phẩm đã cứu</p>
                <p className="text-xl font-bold">{greenStats.foodSavedKg.toLocaleString('vi-VN')} kg</p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-surface-container-lowest border border-outline-variant/10 shadow-sm p-4 rounded-[16px] flex flex-col space-y-2">
              <span className="material-symbols-outlined text-primary">cloud_done</span>
              <div>
                <p className="text-xs text-on-surface-variant">CO2 giảm</p>
                <p className="text-xl font-bold">{greenStats.co2ReducedKg.toLocaleString('vi-VN')} kg</p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-surface-container-lowest border border-outline-variant/10 shadow-sm p-4 rounded-[16px] flex flex-col space-y-2">
              <span className="material-symbols-outlined text-primary">payments</span>
              <div>
                <p className="text-xs text-on-surface-variant">Tiền tiết kiệm</p>
                <p className="text-xl font-bold">{greenStats.totalSavings.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>
            {/* Card 4 */}
            <div className="bg-surface-container-lowest border border-outline-variant/10 shadow-sm p-4 rounded-[16px] flex flex-col space-y-2">
              <span className="material-symbols-outlined text-primary">military_tech</span>
              <div>
                <p className="text-xs text-on-surface-variant">Hạng</p>
                <p className="text-sm font-bold leading-tight">{greenStats.rank}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Payment & Address Management */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest px-1">Quản lý</h3>
          <div className="bg-surface-container-lowest rounded-[16px] overflow-hidden shadow-sm border border-outline-variant/10">
            {/* Payment */}
            <Link href="/profile/wallet" className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-container-low transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">account_balance_wallet</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-on-surface group-hover:text-primary transition-colors">Ví & Thanh toán</p>
                  <p className="text-xs text-on-surface-variant">MoMo, ZaloPay</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
            </Link>
            <div className="h-[1px] bg-surface-container-low mx-5"></div>
            {/* Address */}
            <Link href="/coming-soon" className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-container-low transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">location_on</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-on-surface group-hover:text-primary transition-colors">Địa chỉ của tôi</p>
                  <p className="text-xs text-on-surface-variant">Nhà, Công ty</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
            </Link>
          </div>
        </section>

        {/* System Settings */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest px-1">Cài đặt hệ thống</h3>
          <div className="bg-surface-container-lowest rounded-[16px] overflow-hidden shadow-sm border border-outline-variant/10">
            {/* Reviews */}
            <Link href="/profile/reviews" className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-container-low transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">star</span>
                </div>
                <p className="font-semibold text-on-surface group-hover:text-primary transition-colors">Đánh giá của tôi</p>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
            </Link>

            <div className="h-[1px] bg-surface-container-low mx-5"></div>

            {/* Change Password */}
            <Link href="/profile/change-password" className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-container-low transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">password</span>
                </div>
                <p className="font-semibold text-on-surface group-hover:text-primary transition-colors">Đổi mật khẩu</p>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
            </Link>
            
            <div className="h-[1px] bg-surface-container-low mx-5"></div>
            
            {/* Notifications */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
                </div>
                <p className="font-semibold text-on-surface">Cài đặt thông báo</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isNotificationsEnabled}
                  onChange={() => setIsNotificationsEnabled(!isNotificationsEnabled)}
                />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="h-[1px] bg-surface-container-low mx-5"></div>
            
            {/* Merchant Switch - Action Toggle Pattern */}
            <div className="flex items-center justify-between px-5 py-5 bg-primary/5 rounded-xl border border-primary/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {currentRole === "MERCHANT" ? "swap_horiz" : "storefront"}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-primary">
                    {currentRole === "MERCHANT" ? "Chuyển sang Người Mua" : "Chuyển sang Người bán"}
                  </p>
                  <p className="text-[10px] uppercase font-bold tracking-tighter text-on-primary-container">
                    {currentRole === "MERCHANT" ? "CHẾ ĐỘ NGƯỜI DÙNG" : "KIẾM THÊM THU NHẬP TỪ THỰC PHẨM"}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isFlipping}
                  disabled={isFlipping}
                  onChange={handleRoleToggle}
                />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>



          </div>
        </section>

        {/* Help & Legal */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest px-1">Hỗ trợ & Pháp lý</h3>
          <div className="bg-surface-container-lowest rounded-[16px] overflow-hidden shadow-sm border border-outline-variant/10">
            <Link href="/support/faq" className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-container-low transition-colors group">
              <span className="font-medium text-on-surface group-hover:text-primary transition-colors">Trung tâm trợ giúp (FAQ)</span>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-[20px]">help_outline</span>
            </Link>
            <div className="h-[1px] bg-surface-container-low mx-5"></div>
            <Link href="/support/contact" className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-container-low transition-colors group">
              <span className="font-medium text-on-surface group-hover:text-primary transition-colors">Liên hệ CSKH</span>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-[20px]">support_agent</span>
            </Link>
            <div className="h-[1px] bg-surface-container-low mx-5"></div>
            <Link href="/support/privacy" className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-container-low transition-colors group">
              <span className="font-medium text-on-surface group-hover:text-primary transition-colors">Điều khoản và Chính sách</span>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-[20px]">verified_user</span>
            </Link>
          </div>
        </section>

        {/* Logout & Account Actions */}
        <section className="space-y-4 pt-4">
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full py-4 text-error font-bold text-lg hover:bg-error-container/20 transition-colors rounded-[16px] flex items-center justify-center gap-2 border border-error/20">
            <span className="material-symbols-outlined">logout</span>
            Đăng xuất
          </button>
          <Link href="/coming-soon" className="block w-full py-2 text-on-surface-variant/60 text-sm hover:text-error transition-colors text-center">
            Xóa tài khoản
          </Link>
          <p className="text-center text-[10px] text-outline-variant font-medium uppercase tracking-[0.2em] pb-8">Phiên bản 1.0.0</p>
        </section>
      </main>
    </div>
  );
}
