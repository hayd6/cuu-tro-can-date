"use client";

import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppProvider";

export default function SettingsPage() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useAppContext();

  return (
    <div className="bg-surface text-on-surface min-h-[100dvh]">
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
            <h1 className="font-headline font-semibold tracking-tight text-[#141b2b] text-lg">Cài đặt chung</h1>
          </div>
        </div>
        <div className="bg-[#f1f3ff] h-[1px] w-full"></div>
      </header>

      <main className="desktop-page-shell-tight px-4 lg:px-6 xl:px-8 py-6 lg:py-8 space-y-6">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest px-1">Giao diện</h2>
          <div className="bg-surface-container-lowest rounded-[16px] overflow-hidden shadow-sm border border-outline-variant/10">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined">{isDarkMode ? "dark_mode" : "light_mode"}</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-on-surface">Chế độ tối (Dark Mode)</p>
                  <p className="text-xs text-on-surface-variant">Bảo vệ mắt vào ban đêm</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </section>

        <section className="space-y-2">
           <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest px-1">Khác</h2>
           <div className="bg-surface-container-lowest rounded-[16px] overflow-hidden shadow-sm border border-outline-variant/10">
            <div className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-container-low transition-colors group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">language</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-on-surface group-hover:text-primary transition-colors">Ngôn ngữ</p>
                  <p className="text-xs text-on-surface-variant">Tiếng Việt</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
            </div>
            
            <div className="h-[1px] bg-surface-container-low mx-5"></div>

            <div className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-container-low transition-colors group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">info</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-on-surface group-hover:text-primary transition-colors">Về ứng dụng</p>
                  <p className="text-xs text-on-surface-variant">Phiên bản, Điều khoản</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
            </div>
           </div>
        </section>
      </main>
    </div>
  );
}
