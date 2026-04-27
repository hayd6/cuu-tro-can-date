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

const TEXT = {
  roleErrorLog: "L\u1ed7i chuy\u1ec3n \u0111\u1ed5i role:",
  roleErrorAlert: "Kh\u00f4ng th\u1ec3 chuy\u1ec3n \u0111\u1ed5i vai tr\u00f2. Vui l\u00f2ng th\u1eed l\u1ea1i.",
  pageTitle: "C\u00e1 nh\u00e2n",
  phoneFallback: "Ch\u01b0a c\u1eadp nh\u1eadt",
  editStore: "Ch\u1ec9nh s\u1eeda c\u1eeda h\u00e0ng",
  greenPartner: "\u0110\u1ed1i t\u00e1c xanh",
  dailyRevenue: "Doanh thu ng\u00e0y",
  pendingOrders: "\u0110\u01a1n h\u00e0ng ch\u1edd",
  soldToday: "\u0110\u00e3 b\u00e1n h\u00f4m nay",
  rating: "\u0110\u00e1nh gi\u00e1 chung",
  activeProducts: "S\u1ea3n ph\u1ea9m \u0111ang b\u00e1n",
  wallet: "V\u00ed & Thanh to\u00e1n",
  updatedAt: "C\u1eadp nh\u1eadt l\u00fac 10:45",
  withdraw: "R\u00fat ti\u1ec1n",
  availableBalance: "S\u1ed1 d\u01b0 kh\u1ea3 d\u1ee5ng",
  systemSettings: "C\u00e0i \u0111\u1eb7t h\u1ec7 th\u1ed1ng",
  manageReviews: "Qu\u1ea3n l\u00fd \u0111\u00e1nh gi\u00e1",
  changePassword: "\u0110\u1ed5i m\u1eadt kh\u1ea9u",
  notificationSettings: "C\u00e0i \u0111\u1eb7t th\u00f4ng b\u00e1o",
  switchToBuyer: "Chuy\u1ec3n sang Ng\u01b0\u1eddi Mua",
  userMode: "Ch\u1ebf \u0111\u1ed9 ng\u01b0\u1eddi d\u00f9ng",
  supportLegal: "H\u1ed7 tr\u1ee3 & Ph\u00e1p l\u00fd",
  faq: "Trung t\u00e2m tr\u1ee3 gi\u00fap (FAQ)",
  contact: "Li\u00ean h\u1ec7 CSKH",
  policy: "\u0110i\u1ec1u kho\u1ea3n v\u00e0 Ch\u00ednh s\u00e1ch",
  logout: "\u0110\u0103ng xu\u1ea5t",
  deleteAccount: "X\u00f3a t\u00e0i kho\u1ea3n",
  dong: "\u0111",
  orderUpper: "\u0110\u01a0N",
  orderLower: "\u0111\u01a1n",
} as const;

export default function MerchantProfileClient({ store, stats }: MerchantProfileClientProps) {
  const router = useRouter();
  const { data: session, update } = useSession();
  const user = session?.user as any;

  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleRoleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFlipping || !user?.id) return;
    if (!e.target.checked) return;

    setIsFlipping(true);

    try {
      await switchUserRole(user.id, "BUYER");
      await update({ role: "BUYER" });
      setTimeout(() => {
        router.refresh();
        router.push("/profile");
      }, 500);
    } catch (err) {
      console.error(TEXT.roleErrorLog, err);
      setIsFlipping(false);
      alert(TEXT.roleErrorAlert);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-[100dvh] pb-32">
      <main className="desktop-page-shell-tight px-4 lg:px-6 xl:px-8 space-y-8 lg:space-y-10 mt-6 pt-4 animate-in fade-in duration-300">
        <div className="flex justify-between items-center px-2 mb-4 lg:hidden">
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">{TEXT.pageTitle}</h1>
          <Link href="/settings" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface-variant group">
            <span className="material-symbols-outlined text-[24px] group-hover:text-primary transition-colors">settings</span>
          </Link>
        </div>

        <section className="desktop-page-card p-6 lg:p-8">
<<<<<<< HEAD
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            <div className="flex flex-col items-center text-center space-y-4 lg:col-span-4 lg:items-start lg:text-left">
=======
          <div className="grid gap-8 md:grid-cols-12 lg:grid-cols-12 md:items-start lg:items-start">
            <div className="flex flex-col items-center text-center space-y-4 md:col-span-4 lg:col-span-4 md:items-start md:text-left lg:items-start lg:text-left">
>>>>>>> feature/tablet
              <div className="relative">
                <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full p-1 bg-gradient-to-tr from-primary to-primary-container shadow-lg">
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
                <h2 className="text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">{store.name}</h2>
<<<<<<< HEAD
                <p className="text-on-surface-variant flex items-center justify-center lg:justify-start gap-1.5 mt-1 font-medium">
=======
                <p className="text-on-surface-variant flex items-center justify-center md:justify-start lg:justify-start gap-1.5 mt-1 font-medium">
>>>>>>> feature/tablet
                  <span className="material-symbols-outlined text-sm">call</span>
                  {store.owner?.phone || TEXT.phoneFallback}
                </p>
              </div>
              <Link href="/merchant/profile/edit" className="bg-surface-container-highest text-primary px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:bg-primary/10 shadow-sm border border-outline-variant/10 active:scale-95">
                {TEXT.editStore}
              </Link>
            </div>

<<<<<<< HEAD
            <div className="lg:col-span-8 space-y-4">
=======
            <div className="md:col-span-8 lg:col-span-8 space-y-4">
>>>>>>> feature/tablet
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-semibold tracking-tighter text-on-surface">{TEXT.greenPartner}</h2>
                <span className="tracking-wider uppercase text-primary font-bold text-xs bg-primary-container/20 px-2 py-1 rounded">Seller Dashboard</span>
              </div>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                <Link href="/merchant/revenue" className="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between h-32 border border-outline-variant/10 shadow-sm relative overflow-hidden group active:scale-95 transition-transform">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
                  <span className="material-symbols-outlined text-primary mb-2">savings</span>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{TEXT.dailyRevenue}</p>
                    <p className="text-xl font-bold text-on-surface tracking-tight">{stats.revenueToday.toLocaleString("vi-VN")}<span className="text-xs ml-1 font-normal text-on-surface-variant">{TEXT.dong}</span></p>
                  </div>
                </Link>
                <Link href="/merchant/revenue" className="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between h-32 border border-outline-variant/10 shadow-sm relative overflow-hidden group active:scale-95 transition-transform">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
                  <span className="material-symbols-outlined text-primary mb-2">payments</span>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{TEXT.pendingOrders}</p>
                    <p className="text-xl font-bold text-primary tracking-tight">{stats.pendingOrders} <span className="text-xs font-normal">{TEXT.orderUpper}</span></p>
                  </div>
                </Link>
                <div className="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between h-32 border border-outline-variant/10 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary-container/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
                  <span className="material-symbols-outlined text-primary-container mb-2">eco</span>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{TEXT.soldToday}</p>
                    <p className="text-xl font-bold text-on-surface tracking-tight">{stats.completedToday} {TEXT.orderLower}</p>
                  </div>
                </div>
                <div className="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between h-32 border border-outline-variant/10 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-secondary/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
                  <span className="material-symbols-outlined text-secondary mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{TEXT.rating}</p>
                    <p className="text-xl font-bold text-on-surface tracking-tight">{store.rating} <span className="text-xs font-normal text-on-surface-variant">/ 5.0</span></p>
                  </div>
                </div>
                <div className="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between h-32 border-2 border-outline-variant/10 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-surface-container-highest/50 rounded-bl-full transition-transform group-hover:scale-110"></div>
                  <span className="material-symbols-outlined text-on-surface-variant mb-2">inventory_2</span>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{TEXT.activeProducts}</p>
                    <p className="text-xl font-bold text-on-surface tracking-tight">{stats.activeProducts}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-12">
          <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 shadow-sm xl:col-span-5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                </div>
                <div>
                  <h3 className="font-bold text-on-surface">{TEXT.wallet}</h3>
                  <p className="text-xs text-on-surface-variant">{TEXT.updatedAt}</p>
                </div>
              </div>
              <Link href="/merchant/wallet" className="bg-gradient-to-r from-primary to-primary-container text-white px-5 py-2 rounded-lg font-bold text-sm shadow-sm active:scale-95 transition-transform">
                {TEXT.withdraw}
              </Link>
            </div>
            <div className="space-y-4">
              <div className="bg-surface-container-low border border-outline-variant/10 p-4 rounded-lg flex items-center justify-between">
                <span className="text-on-surface-variant text-sm font-medium">{TEXT.availableBalance}</span>
                <span className="text-lg font-bold text-on-surface">{stats.totalBalance.toLocaleString("vi-VN")}{TEXT.dong}</span>
              </div>
              <div className="flex items-center gap-3 px-1">
                <div className="w-8 h-8 rounded bg-white flex items-center justify-center border border-outline-variant/10">
                  <img className="w-6 h-auto opacity-80" alt="Vietcombank" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuqHpy9Dv9BlUdshSo72-hK5Ugdoa6i2BsvVc_L15UepkGLO9OeoyrZTx1ZzhmDV7e8znbG0dTi-Bmuqy3732TL8zLyEMrnsfCHCF8zaoZE3e5OgBzAjd3axF4KhAM0F-Fm6C3oJCi_-2xNGP-lGyKgnXTFLWYEyxOxJp2xqjG466VCa9E3034WgGnnLC7zO2hzm_sSnN_WNg4JXOVXucZKs6dQTV9HoszVxRAMUKUPeUnyWijQsDnFOMhSGNhY5uhwobeOQ9428Y" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-on-surface">Vietcombank</p>
                  <p className="text-xs text-on-surface-variant font-mono">**** 1234</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-lg">chevron_right</span>
              </div>
            </div>
          </section>

          <div className="space-y-6 xl:col-span-7">
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest px-1">{TEXT.systemSettings}</h3>
              <div className="bg-surface-container-lowest rounded-[16px] overflow-hidden shadow-sm border border-outline-variant/10">
                <Link href={`/store/${store.id}/reviews`} className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-container-low transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">star</span>
                    </div>
                    <p className="font-semibold text-on-surface group-hover:text-primary transition-colors">{TEXT.manageReviews}</p>
                  </div>
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
                </Link>
                <div className="h-[1px] bg-surface-container-low mx-5"></div>
                <Link href="/profile/change-password" className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-container-low transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">password</span>
                    </div>
                    <p className="font-semibold text-on-surface group-hover:text-primary transition-colors">{TEXT.changePassword}</p>
                  </div>
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
                </Link>
                <div className="h-[1px] bg-surface-container-low mx-5"></div>
                <div className="flex items-center justify-between px-5 py-4 hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant">notifications_active</span>
                    </div>
                    <p className="font-semibold text-on-surface">{TEXT.notificationSettings}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isNotificationsEnabled} onChange={() => setIsNotificationsEnabled(!isNotificationsEnabled)} />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="h-[1px] bg-surface-container-low mx-5"></div>
                <div className="flex items-center justify-between px-5 py-4 bg-primary/5 hover:bg-primary/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">swap_horiz</span>
                    </div>
                    <div>
                      <p className="font-bold text-primary">{TEXT.switchToBuyer}</p>
                      <p className="text-[10px] uppercase font-bold tracking-tighter text-on-primary-container">{TEXT.userMode}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isFlipping} disabled={isFlipping} onChange={handleRoleToggle} />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest px-1">{TEXT.supportLegal}</h3>
              <div className="bg-surface-container-lowest rounded-[16px] overflow-hidden shadow-sm border border-outline-variant/10 divide-y divide-surface-container-low">
                <Link href="/support/faq" className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-container-low transition-colors group">
                  <span className="font-medium text-on-surface group-hover:text-primary transition-colors">{TEXT.faq}</span>
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-[20px]">help_outline</span>
                </Link>
                <Link href="/support/contact" className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-container-low transition-colors group">
                  <span className="font-medium text-on-surface group-hover:text-primary transition-colors">{TEXT.contact}</span>
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-[20px]">support_agent</span>
                </Link>
                <Link href="/support/privacy" className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-container-low transition-colors group">
                  <span className="font-medium text-on-surface group-hover:text-primary transition-colors">{TEXT.policy}</span>
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-[20px]">verified_user</span>
                </Link>
              </div>
            </section>

            <section className="pt-4 flex flex-col gap-3">
              <Link href="/login" className="w-full py-4 text-center text-error font-bold text-sm bg-error-container/20 rounded-xl hover:bg-error-container/40 transition-colors border border-error/10">
                {TEXT.logout}
              </Link>
              <Link href="/coming-soon" className="block w-full py-2 text-on-surface-variant/60 text-sm hover:text-error transition-colors text-center">
                {TEXT.deleteAccount}
              </Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
