"use client";

import Link from "next/link";
import { useState } from "react";
import { switchUserRole } from "@/lib/actions/users";
import { useSession, signOut } from "next-auth/react";
import defaultAvatar from "@/assets/images/avatar-mac-dinh.jpg";

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

const TEXT = {
  roleErrorLog: "L\u1ed7i chuy\u1ec3n \u0111\u1ed5i role:",
  roleErrorAlert: "Kh\u00f4ng th\u1ec3 chuy\u1ec3n \u0111\u1ed5i vai tr\u00f2. Vui l\u00f2ng th\u1eed l\u1ea1i.",
  pageTitle: "C\u00e1 nh\u00e2n",
  fallbackUser: "Ng\u01b0\u1eddi d\u00f9ng",
  editProfile: "Ch\u1ec9nh s\u1eeda h\u1ed3 s\u01a1",
  greenHero: "Chi\u1ebfn binh xanh",
  foodSaved: "Th\u1ef1c ph\u1ea9m \u0111\u00e3 c\u1ee9u",
  co2Reduced: "CO2 gi\u1ea3m",
  savings: "Ti\u1ec1n ti\u1ebft ki\u1ec7m",
  rank: "H\u1ea1ng",
  management: "Qu\u1ea3n l\u00fd",
  wallet: "V\u00ed & Thanh to\u00e1n",
  myAddress: "\u0110\u1ecba ch\u1ec9 c\u1ee7a t\u00f4i",
  homeOffice: "Nh\u00e0, C\u00f4ng ty",
  systemSettings: "C\u00e0i \u0111\u1eb7t h\u1ec7 th\u1ed1ng",
  myReviews: "\u0110\u00e1nh gi\u00e1 c\u1ee7a t\u00f4i",
  changePassword: "\u0110\u1ed5i m\u1eadt kh\u1ea9u",
  notificationSettings: "C\u00e0i \u0111\u1eb7t th\u00f4ng b\u00e1o",
  switchToBuyer: "Chuy\u1ec3n sang Ng\u01b0\u1eddi Mua",
  switchToSeller: "Chuy\u1ec3n sang Ng\u01b0\u1eddi b\u00e1n",
  buyerMode: "CH\u1ebe \u0110\u1ed8 NG\u01af\u1edcI D\u00d9NG",
  sellerMode: "KI\u1ebeM TH\u00caM THU NH\u1eacP T\u1eea TH\u1ef0C PH\u1ea8M",
  supportLegal: "H\u1ed7 tr\u1ee3 & Ph\u00e1p l\u00fd",
  faq: "Trung t\u00e2m tr\u1ee3 gi\u00fap (FAQ)",
  contact: "Li\u00ean h\u1ec7 CSKH",
  policy: "\u0110i\u1ec1u kho\u1ea3n v\u00e0 Ch\u00ednh s\u00e1ch",
  logout: "\u0110\u0103ng xu\u1ea5t",
  deleteAccount: "X\u00f3a t\u00e0i kho\u1ea3n",
  version: "Phi\u00ean b\u1ea3n 1.0.0",
  dong: "\u0111",
} as const;

export default function ProfileClient({ user: initialUser, greenStats }: UserProfileProps) {
  const { data: session, update } = useSession();
  const user = (session?.user as any) || initialUser;
  const currentRole = user.role;

  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleRoleToggle = async () => {
    if (isFlipping) return;
    setIsFlipping(true);

    try {
      const newRole = currentRole === "MERCHANT" ? "BUYER" : "MERCHANT";
      await switchUserRole(user.id, newRole);
      await update({ role: newRole });
      window.location.href = newRole === "MERCHANT" ? "/merchant" : "/";
    } catch (err) {
      console.error(TEXT.roleErrorLog, err);
      setIsFlipping(false);
      alert(TEXT.roleErrorAlert);
    }
  };

  return (
    <div className="bg-slate-50/50 text-on-surface min-h-[100dvh] font-body antialiased">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100/80 px-6 py-4 flex items-center justify-between w-full lg:hidden">
        <h1 className="font-['Inter'] font-semibold tracking-tight text-xl text-slate-800">{TEXT.pageTitle}</h1>
        <Link href="/settings" className="p-2 hover:bg-slate-50 rounded-full transition-colors active:scale-95 text-slate-600 inline-flex items-center justify-center">
          <span className="material-symbols-outlined">settings</span>
        </Link>
      </header>

      <main className="max-w-md md:max-w-7xl mx-auto px-4 pt-8 pb-32 space-y-8 animate-in fade-in duration-300">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* User Card */}
          <section className="flex flex-col items-center text-center md:col-span-4 md:bg-white md:p-8 md:rounded-2xl md:border md:border-slate-100 md:shadow-sm">
            <div className="relative mb-4">
              <img
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full object-cover border border-slate-100 shadow-sm flex-shrink-0"
                src={user.avatarUrl || defaultAvatar.src}
              />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">{user.name || TEXT.fallbackUser}</h2>
            <p className="text-slate-500 text-sm mt-0.5">{user.email}</p>
            {user.phone && <p className="text-slate-400 text-xs mt-1">{user.phone}</p>}
            
            <Link href="/profile/edit" className="mt-5 px-6 py-2.5 bg-indigo-50/80 hover:bg-indigo-100/80 text-emerald-800 text-sm font-bold rounded-full transition-all active:scale-95 duration-150 shadow-sm">
              {TEXT.editProfile}
            </Link>
          </section>

          {/* 4 Stats Cards */}
          <section className="space-y-4 md:col-span-8">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700 text-xl">eco</span>
                <span className="text-base font-bold text-slate-800">Chiến binh xanh</span>
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded">LEVEL {greenStats.level || 1}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between min-h-[120px]">
                <span className="material-symbols-outlined text-2xl text-emerald-700 w-fit">restaurant</span>
                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-400 mb-0.5">{TEXT.foodSaved}</p>
                  <p className="text-xl font-black text-slate-800">{greenStats.foodSavedKg.toLocaleString("vi-VN")} kg</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between min-h-[120px]">
                <span className="material-symbols-outlined text-2xl text-emerald-700 w-fit">cloud</span>
                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-400 mb-0.5">{TEXT.co2Reduced}</p>
                  <p className="text-xl font-black text-slate-800">{greenStats.co2ReducedKg.toLocaleString("vi-VN")} kg</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between min-h-[120px]">
                <span className="material-symbols-outlined text-2xl text-emerald-700 w-fit">payments</span>
                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-400 mb-0.5">{TEXT.savings}</p>
                  <p className="text-xl font-black text-slate-800">{greenStats.totalSavings.toLocaleString("vi-VN")}đ</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between min-h-[120px]">
                <span className="material-symbols-outlined text-2xl text-emerald-700 w-fit">military_tech</span>
                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-400 mb-0.5">{TEXT.rank}</p>
                  <p className="text-base font-bold text-slate-800 leading-tight">Mầm xanh</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sections Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column (Management) */}
          <div className="space-y-6">
            {currentRole !== "MERCHANT" && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">{TEXT.management}</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                  <Link href="/profile/wallet" className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50/50 flex items-center justify-center text-slate-800 flex-shrink-0">
                        <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{TEXT.wallet}</p>
                        <p className="text-xs text-slate-400">MoMo, ZaloPay</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                  </Link>

                  <Link href="/coming-soon" className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50/50 flex items-center justify-center text-slate-800 flex-shrink-0">
                        <span className="material-symbols-outlined text-xl">location_on</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{TEXT.myAddress}</p>
                        <p className="text-xs text-slate-400">{TEXT.homeOffice}</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Settings, Support, Logout) */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">{TEXT.systemSettings}</h3>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                
                <Link href="/profile/reviews" className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50/50 flex items-center justify-center text-slate-800 flex-shrink-0">
                      <span className="material-symbols-outlined text-xl">star</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      {currentRole === "MERCHANT" ? "Quản lý đánh giá" : TEXT.myReviews}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                </Link>

                <Link href="/profile/change-password" className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50/50 flex items-center justify-center text-slate-800 flex-shrink-0">
                      <span className="material-symbols-outlined text-xl">password</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">{TEXT.changePassword}</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                </Link>

                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50/50 flex items-center justify-center text-slate-800 flex-shrink-0">
                      <span className="material-symbols-outlined text-xl">notifications</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{TEXT.notificationSettings}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isNotificationsEnabled} onChange={() => setIsNotificationsEnabled(!isNotificationsEnabled)} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-800"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between px-5 py-4 bg-emerald-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-200/50 flex items-center justify-center text-emerald-900 flex-shrink-0">
                      <span className="material-symbols-outlined text-xl">
                        {currentRole === "MERCHANT" ? "swap_horiz" : "storefront"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-900">
                        {currentRole === "MERCHANT" ? TEXT.switchToBuyer : TEXT.switchToSeller}
                      </p>
                      <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider mt-0.5">
                        {currentRole === "MERCHANT" ? TEXT.buyerMode : TEXT.sellerMode}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isFlipping} disabled={isFlipping} onChange={handleRoleToggle} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-800"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">{TEXT.supportLegal}</h3>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                <Link href="/support/faq" className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-all group">
                  <span className="text-sm font-bold text-slate-700">{TEXT.faq}</span>
                  <span className="material-symbols-outlined text-slate-400 text-xl">help</span>
                </Link>

                <Link href="/support/contact" className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-all group">
                  <span className="text-sm font-bold text-slate-700">{TEXT.contact}</span>
                  <span className="material-symbols-outlined text-slate-400 text-xl">support_agent</span>
                </Link>

                <Link href="/support/privacy" className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-all group">
                  <span className="text-sm font-bold text-slate-700">{TEXT.policy}</span>
                  <span className="material-symbols-outlined text-slate-400 text-xl">verified_user</span>
                </Link>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <button 
                onClick={() => signOut({ callbackUrl: "/login" })} 
                className="w-full py-4 bg-rose-50/50 hover:bg-rose-50 border border-rose-100/50 text-rose-700 font-bold text-base rounded-2xl flex items-center justify-center transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-xl mr-2">logout</span>
                <span>{TEXT.logout}</span>
              </button>

              <div className="text-center">
                <Link 
                  href="/coming-soon" 
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors"
                >
                  {TEXT.deleteAccount}
                </Link>
                <p className="text-[10px] text-slate-300 font-medium tracking-wider block uppercase pt-2">
                  {TEXT.version}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
