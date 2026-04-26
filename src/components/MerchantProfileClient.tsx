"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { switchUserRole } from "@/lib/actions/users";

interface MerchantStats {
  pendingOrders: number;
  completedToday: number;
  revenueToday: number;
  activeProducts: number;
  totalBalance: number;
}

interface MerchantProfileClientProps {
  store: {
    id: string;
    name: string;
    imageUrl: string | null;
    owner: {
      phone: string | null;
    };
    rating: number;
  };
  stats: MerchantStats;
}

export default function MerchantProfileClient({ store, stats }: MerchantProfileClientProps) {
  const router = useRouter();
  const { data: session, update } = useSession();
  const user = session?.user as any;
  
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  
  // The toggle is an "ACTION" switch: it always starts OFF. Turning it ON triggers the switch.
  const [isFlipping, setIsFlipping] = useState(false);

  const handleRoleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFlipping || !user?.id) return;
    
    const checked = e.target.checked;
    if (!checked) return;

    setIsFlipping(true);

    try {
      const newRole = "BUYER";
      
      // 1. Update Database
      await switchUserRole(user.id, newRole);
      
      // 2. Update NextAuth Session
      await update({ role: newRole });

      // 3. Briefly wait and redirect
      setTimeout(() => {
        router.refresh();
        router.push("/profile");
      }, 500);
    } catch (err) {
      console.error("Lỗi chuyển đổi role:", err);
      setIsFlipping(false);
      alert("Không thể chuyển đổi vai trò. Vui lòng thử lại.");
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-[100dvh] pb-32">
      
      {/* Top Navigation Anchor */}
      <main className="max-w-2xl mx-auto px-4 space-y-8 mt-6 pt-4 animate-in fade-in duration-300">
        
        {/* Header Section */}
        <div className="flex justify-between items-center px-2 mb-4">
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Cá nhân</h1>
          <Link href="/settings" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface-variant group">
            <span className="material-symbols-outlined text-[24px] group-hover:text-primary transition-colors">settings</span>
          </Link>
        </div>
        <section className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-primary-container shadow-lg">
              <img 
                className="w-full h-full rounded-full object-cover bg-white" 
                alt={store.name} 
                src={store.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200"}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1.5 rounded-full shadow-md border-2 border-surface">
              <span className="material-symbols-outlined text-sm block" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">{store.name}</h1>
            <p className="text-on-surface-variant flex items-center justify-center gap-1.5 mt-1 font-medium">
              <span className="material-symbols-outlined text-sm">call</span>
              {store.owner?.phone || "Chưa cập nhật"}
            </p>
          </div>
          <Link href="/merchant/profile/edit" className="bg-surface-container-highest text-primary px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:bg-primary/10 shadow-sm border border-outline-variant/10 active:scale-95">
            Chỉnh sửa cửa hàng
          </Link>
        </section>

        {/* Dashboard Bento Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-semibold tracking-tighter text-on-surface">Đối tác xanh</h2>
            <span className="tracking-wider uppercase text-primary font-bold text-xs bg-primary-container/20 px-2 py-1 rounded">Seller Dashboard</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Daily Revenue */}
            <Link href="/merchant/revenue" className="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between h-32 border border-outline-variant/10 shadow-sm relative overflow-hidden group active:scale-95 transition-transform">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-primary mb-2">savings</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Doanh thu ngày</p>
                <p className="text-xl font-bold text-on-surface tracking-tight">{stats.revenueToday.toLocaleString('vi-VN')}<span className="text-xs ml-1 font-normal text-on-surface-variant">đ</span></p>
              </div>
            </Link>

            {/* Monthly Revenue (Placeholder stat - could calculate dynamically later) */}
            <Link href="/merchant/revenue" className="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between h-32 border border-outline-variant/10 shadow-sm relative overflow-hidden group active:scale-95 transition-transform">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-primary mb-2">payments</span>
                <span className="material-symbols-outlined text-on-surface-variant text-sm opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Đơn hàng chờ</p>
                <p className="text-xl font-bold text-primary tracking-tight">{stats.pendingOrders} <span className="text-xs font-normal">ĐƠN</span></p>
              </div>
            </Link>
            
             {/* Rescued Food / Completed Orders */}
             <div className="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between h-32 border border-outline-variant/10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary-container/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
              <span className="material-symbols-outlined text-primary-container mb-2">eco</span>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Đã bán hôm nay</p>
                <p className="text-xl font-bold text-on-surface tracking-tight">{stats.completedToday} đơn</p>
              </div>
            </div>

            {/* Ratings */}
            <div className="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between h-32 border border-outline-variant/10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-secondary/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
              <span className="material-symbols-outlined text-secondary mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Đánh giá chung</p>
                <p className="text-xl font-bold text-on-surface tracking-tight">{store.rating} <span className="text-xs font-normal text-on-surface-variant">/ 5.0</span></p>
              </div>
            </div>

            {/* Active Products instead of Tier */}
            <div className="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between h-32 border-2 border-outline-variant/10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-surface-container-highest/50 rounded-bl-full transition-transform group-hover:scale-110"></div>
              <span className="material-symbols-outlined text-on-surface-variant mb-2">inventory_2</span>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Sản phẩm đang bán</p>
                <p className="text-xl font-bold text-on-surface tracking-tight">{stats.activeProducts}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Wallet & Payment */}
        <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              </div>
              <div>
                <h3 className="font-bold text-on-surface">Ví & Thanh toán</h3>
                <p className="text-xs text-on-surface-variant">Cập nhật lúc 10:45</p>
              </div>
            </div>
            <Link href="/merchant/wallet" className="bg-gradient-to-r from-primary to-primary-container text-white px-5 py-2 rounded-lg font-bold text-sm shadow-sm active:scale-95 transition-transform">
              Rút tiền
            </Link>
          </div>
          <div className="space-y-4">
            <div className="bg-surface-container-low border border-outline-variant/10 p-4 rounded-lg flex items-center justify-between">
              <span className="text-on-surface-variant text-sm font-medium">Số dư khả dụng</span>
              <span className="text-lg font-bold text-on-surface">{stats.totalBalance.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex items-center gap-3 px-1">
              <div className="w-8 h-8 rounded bg-white flex items-center justify-center border border-outline-variant/10">
                <img 
                  className="w-6 h-auto opacity-80" 
                  alt="Vietcombank" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuqHpy9Dv9BlUdshSo72-hK5Ugdoa6i2BsvVc_L15UepkGLO9OeoyrZTx1ZzhmDV7e8znbG0dTi-Bmuqy3732TL8zLyEMrnsfCHCF8zaoZE3e5OgBzAjd3axF4KhAM0F-Fm6C3oJCi_-2xNGP-lGyKgnXTFLWYEyxOxJp2xqjG466VCa9E3034WgGnnLC7zO2hzm_sSnN_WNg4JXOVXucZKs6dQTV9HoszVxRAMUKUPeUnyWijQsDnFOMhSGNhY5uhwobeOQ9428Y"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-on-surface">Vietcombank</p>
                <p className="text-xs text-on-surface-variant font-mono">**** 1234</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-lg">chevron_right</span>
            </div>
          </div>
        </section>

        {/* Settings List */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest px-1">Cài đặt hệ thống</h3>
          <div className="bg-surface-container-lowest rounded-[16px] overflow-hidden shadow-sm border border-outline-variant/10">
            
            {/* Manage Reviews */}
            <Link href={`/store/${store.id}/reviews`} className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-container-low transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">star</span>
                </div>
                <p className="font-semibold text-on-surface group-hover:text-primary transition-colors">Quản lý đánh giá</p>
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
            
            {/* Notification Toggle */}
            <div className="flex items-center justify-between px-5 py-4 hover:bg-surface-container-low transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant">notifications_active</span>
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
            
            {/* Switch to Buyer - Action Toggle Pattern */}
            <div className="flex items-center justify-between px-5 py-4 bg-primary/5 hover:bg-primary/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">swap_horiz</span>
                </div>
                <div>
                  <p className="font-bold text-primary">Chuyển sang Người Mua</p>
                  <p className="text-[10px] uppercase font-bold tracking-tighter text-on-primary-container">Chế độ người dùng</p>
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

        {/* Danger Zone */}
        <section className="pt-4 flex flex-col gap-3">
          <Link href="/login" className="w-full py-4 text-center text-error font-bold text-sm bg-error-container/20 rounded-xl hover:bg-error-container/40 transition-colors border border-error/10">
            Đăng xuất
          </Link>
          <Link href="/coming-soon" className="block w-full py-2 text-on-surface-variant/60 text-sm hover:text-error transition-colors text-center">
            Xóa tài khoản
          </Link>
        </section>

      </main>
    </div>
  );
}
