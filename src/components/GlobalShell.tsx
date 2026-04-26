"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/context/AppProvider";

export default function GlobalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role } = useAppContext();

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
    "/profile/edit",
    "/profile/change-password",
    "/support/faq",
    "/support/contact",
    "/support/privacy",
    "/coming-soon"
  ];
  
  const shouldHideShell = hideShellRoutes.some(route => pathname.startsWith(route)) || 
                         pathname.includes("/review");

  if (shouldHideShell) {
    return <main className="h-full w-full overflow-y-auto hide-scrollbar">{children}</main>;
  }

  return (
    <div className="flex h-[100dvh] w-full relative">
      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto hide-scrollbar pb-[90px]">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-6 bg-surface/90 backdrop-blur-xl rounded-t-[24px] z-[60] shadow-[0_-4px_20px_0_rgba(0,0,0,0.06)] border-t border-outline-variant/10">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path || (tab.path !== "/" && tab.path !== "/merchant" && pathname.startsWith(tab.path));
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
    </div>
  );
}
