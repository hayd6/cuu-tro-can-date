"use client";

import { useAppContext } from "@/context/AppProvider";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/images/logo-cuu-tro-can-date.png";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { isSidebarExpanded, toggleSidebar, role, currentAddress } = useAppContext();

  const buyerTabs = [
    { name: "Khám phá", path: "/", icon: "explore" },
    { name: "Đơn hàng", path: "/orders", icon: "receipt_long" },
    { name: "Thông báo", path: "/notifications", icon: "notifications", badge: true },
    { name: "Cá nhân", path: "/profile", icon: "person" },
  ];

  const merchantTabs = [
    { name: "Trang chủ", path: "/merchant", icon: "home" },
    { name: "Đơn hàng", path: "/merchant/orders", icon: "receipt_long" },
    { name: "Thông báo", path: "/merchant/notifications", icon: "notifications", badge: true },
    { name: "Cá nhân", path: "/merchant/profile", icon: "person" },
  ];

  const computedRole = pathname.startsWith("/merchant") ? "MERCHANT" : role;
  const tabs = computedRole === "BUYER" ? buyerTabs : merchantTabs;

  const hideShellRoutes = [
    "/login", 
    "/register", 
    "/forgot-password", 
    "/product", 
    "/checkout", 
    "/list", 
    "/reviews", 
    "/settings", 
    "/merchant/create", 
    "/merchant/scan", 
    "/merchant/enter-code", 
    "/merchant/revenue", 
    "/merchant/wallet",
    "/merchant/verify-success",
    "/merchant/products",
    "/merchant/listings",
    "/merchant/profile/edit",
    "/profile/edit",
    "/profile/change-password",
    "/support/faq",
    "/support/contact",
    "/support/privacy",
    "/coming-soon"
  ];
  
  const shouldHideMobileShell = hideShellRoutes.some(route => pathname.startsWith(route)) || 
                               pathname.includes("/review");

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/forgot-password");

  const currentSearch = searchParams.get("search") || "";

  const handleSearch = (val: string) => {
    const params = new URLSearchParams(window.location.search);
    if (val) {
      params.set("search", val);
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const isHomepage = pathname === "/" || pathname === "/merchant";
  
  // Safe default avatar
  const userAvatar = session?.user?.image || (session?.user as any)?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100";

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden bg-surface text-on-surface antialiased">
      {/* Desktop Header */}
      {!isAuthRoute && (
        <header className="hidden lg:flex sticky top-0 left-0 right-0 h-[var(--header-height)] z-50 bg-white/90 backdrop-blur-md border-b border-outline-variant/10 items-center justify-between px-4 md:px-5 xl:px-8 flex-shrink-0">
          {/* Left: Hamburger, Logo, App Name */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 text-on-surface hover:bg-surface-container rounded-full transition-colors flex items-center justify-center"
              aria-label="Toggle Sidebar"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <Link href={computedRole === "BUYER" ? "/" : "/merchant"} className="flex items-center gap-2 cursor-pointer">
              <Image src={logo} alt="Logo" className="w-10 h-10 object-contain" priority />
              <h1 className="text-lg font-black text-emerald-700 whitespace-nowrap tracking-tight">Cứu Trợ Cận Date</h1>
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 flex max-w-5xl mx-4 md:mx-6 xl:mx-10">
            <div className="flex flex-1 items-center bg-surface-container-low border border-outline-variant/10 rounded-2xl p-1.5 gap-2 h-14">
              {computedRole === "BUYER" && pathname === "/" && (
                <div 
                  onClick={() => window.dispatchEvent(new Event("reset-map-location"))}
                  className="flex-1 flex items-center px-4 gap-3 border-r border-outline-variant/20 h-full cursor-pointer hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <span suppressHydrationWarning className="text-sm font-medium text-on-surface truncate max-w-[200px] lg:max-w-[400px]">{currentAddress}</span>
                </div>
              )}
              <div className={`${computedRole === "BUYER" && pathname === "/" ? "flex-[1.5]" : "flex-1"} flex items-center px-4 gap-3 h-full relative`}>
                <span className="material-symbols-outlined text-outline">search</span>
                <input 
                  type="text" 
                  placeholder="Tìm món ăn hoặc cửa hàng..." 
                  className="bg-transparent border-none focus:ring-0 text-sm w-full text-on-surface pr-10"
                  value={currentSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                {pathname === "/" && (
                  <button 
                    onClick={() => {
                      const params = new URLSearchParams(window.location.search);
                      params.set("filter", "true");
                      router.push(`${pathname}?${params.toString()}`);
                    }}
                    className="absolute right-2 bg-emerald-700 text-white p-2 rounded-xl hover:bg-emerald-800 transition-colors flex items-center justify-center h-10 aspect-square shadow-sm"
                  >
                    <span className="material-symbols-outlined text-base">tune</span>
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Right: User Avatar */}
          <div className="flex items-center">
            <Link href={computedRole === "BUYER" ? "/profile" : "/merchant/profile"}>
              <img 
                src={userAvatar} 
                alt="Avatar" 
                className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20 cursor-pointer hover:ring-primary/50 transition-all" 
              />
            </Link>
          </div>
        </header>
      )}

      {/* Body Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        {!isAuthRoute && (
          <aside 
            style={{ 
              width: isSidebarExpanded ? "var(--sidebar-width-expanded)" : "var(--sidebar-width-collapsed)" 
            }}
            className="hidden lg:flex flex-col bg-surface-container-lowest border-r border-outline-variant/20 py-6 px-3 gap-2 transition-all duration-300 ease-in-out flex-shrink-0 overflow-y-auto"
          >
            <nav className="flex flex-col gap-2 flex-1">
              {tabs.map((tab) => {
                const isActive = pathname === tab.path || 
                  (tab.path !== "/" && tab.path !== "/merchant" && pathname.startsWith(tab.path)) ||
                  (tab.path === "/merchant" && (pathname.startsWith("/merchant/listings") || pathname.startsWith("/merchant/products")));
                return (
                  <Link 
                    key={tab.path} 
                    href={tab.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out ${isActive ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:bg-slate-100 font-medium'}`}
                  >
                    <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : { fontVariationSettings: "'FILL' 0" }}>
                      {tab.icon}
                    </span>
                    {isSidebarExpanded && (
                      <span className="font-sans text-sm whitespace-nowrap">{tab.name}</span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Section: Settings */}
            <div className="mt-auto mb-4 border-t border-outline-variant/10 pt-4 flex flex-col gap-2">
              <Link 
                href="/settings"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out ${pathname === '/settings' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:bg-slate-100 font-medium'}`}
              >
                <span className="material-symbols-outlined" style={pathname === '/settings' ? { fontVariationSettings: "'FILL' 1" } : { fontVariationSettings: "'FILL' 0" }}>
                  settings
                </span>
                {isSidebarExpanded && (
                  <span className="font-sans text-sm whitespace-nowrap">Cài đặt chung</span>
                )}
              </Link>
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main className={`flex-1 relative overflow-y-auto hide-scrollbar ${!shouldHideMobileShell ? 'pb-[90px]' : ''} lg:pb-0 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]`}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {!shouldHideMobileShell && (
        <nav className="lg:hidden absolute bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-6 bg-surface/90 backdrop-blur-xl rounded-t-[24px] z-[60] shadow-[0_-4px_20px_0_rgba(0,0,0,0.06)] border-t border-outline-variant/10">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path || 
              (tab.path !== "/" && tab.path !== "/merchant" && pathname.startsWith(tab.path)) ||
              (tab.path === "/merchant" && (pathname.startsWith("/merchant/listings") || pathname.startsWith("/merchant/products")));
            return (
              <Link 
                key={tab.path} 
                href={tab.path}
                className={`flex flex-col items-center justify-center px-3 py-2 transition-all duration-300 ease-out ${isActive ? 'text-primary bg-primary/10 rounded-2xl' : 'text-outline hover:text-primary active:scale-90'}`}
              >
                <div className="relative">
                  <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : { fontVariationSettings: "'FILL' 0" }}>
                    {tab.icon}
                  </span>
                  {tab.badge && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
                  )}
                </div>
                {isActive && (
                  <span className="font-['Inter'] text-[10px] font-bold tracking-wide uppercase mt-1">
                    {tab.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
