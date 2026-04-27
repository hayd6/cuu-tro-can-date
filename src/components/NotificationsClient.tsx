"use client";

import { useState } from "react";
import { markNotificationAsRead } from "@/lib/actions/notifications";
import { useRouter } from "next/navigation";

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
  orderId?: string | null;
  storeId?: string | null;
}

interface Props {
  notifications: NotificationRecord[];
  title?: string;
  orderRedirectPath?: string;
}

export default function NotificationsClient({ 
  notifications: initialNotifications, 
  title = "Thông báo",
  orderRedirectPath = "/orders" 
}: Props) {
  const [notifications, setNotifications] = useState<NotificationRecord[]>(initialNotifications);
  const router = useRouter();

  const handleRead = async (id: string, isRead: boolean, targetUrl: string | null) => {
    if (!isRead) {
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      await markNotificationAsRead(id);
    }
    
    if (targetUrl) {
      router.push(targetUrl);
    }
  };

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const groups = {
    today: notifications.filter(n => isSameDay(new Date(n.createdAt), today)),
    yesterday: notifications.filter(n => isSameDay(new Date(n.createdAt), yesterday)),
    older: notifications.filter(n => !isSameDay(new Date(n.createdAt), today) && !isSameDay(new Date(n.createdAt), yesterday)),
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case "EMERGENCY":
        return (
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-error-container flex items-center justify-center text-error">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          </div>
        );
      case "ORDER":
        return (
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>package_2</span>
          </div>
        );
      case "SYSTEM":
        return (
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          </div>
        );
      case "PROMOTION":
        return (
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>redeem</span>
          </div>
        );
      case "REVIEW":
        return (
           <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-surface-dim flex items-center justify-center text-on-surface-variant">
             <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
           </div>
        );
      default:
        return (
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-surface-dim flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
          </div>
        );
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="bg-slate-50/50 text-on-surface min-h-[100dvh] pb-32 font-body antialiased">
      
      {/* Mobile Sticky Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center justify-center px-4 py-4 w-full">
          <h1 className="font-['Inter'] font-semibold tracking-tight text-xl text-primary">Thông báo</h1>
        </div>
      </header>

<<<<<<< HEAD
      <main className="max-w-4xl mx-auto px-4 lg:px-6 xl:px-8 py-6 lg:py-10 space-y-8 lg:space-y-12 animate-in fade-in duration-300">
=======
      <main className="max-w-4xl mx-auto px-4 md:px-6 lg:px-6 xl:px-8 py-6 md:py-8 lg:py-10 space-y-8 lg:space-y-12 animate-in fade-in duration-300">
>>>>>>> feature/tablet
        
        {/* Desktop Title Header */}
        <div className="hidden lg:block mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Thông báo</h2>
          <p className="text-slate-500 text-sm">Theo dõi các ưu đãi giải cứu và tình trạng đơn hàng của bạn.</p>
        </div>

        {notifications.length === 0 && (
          <div className="text-center text-slate-400 mt-20 text-sm font-medium">Bạn chưa có thông báo nào.</div>
        )}

        {/* Group: Hôm nay */}
        {groups.today.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-bold tracking-widest text-slate-500 uppercase bg-slate-100 px-3 py-1 rounded-full">Hôm nay</span>
              <div className="h-px flex-1 bg-slate-200/60"></div>
            </div>
<<<<<<< HEAD
            <div className="grid gap-4">
=======
            <div className="grid gap-4 md:grid-cols-2">
>>>>>>> feature/tablet
              {groups.today.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => handleRead(n.id, n.isRead, n.orderId ? `/orders` : null)}
                  className={`group relative flex items-start gap-5 p-6 bg-white border border-transparent hover:border-emerald-100 rounded-2xl shadow-[0_12px_32px_-4px_rgba(20,27,43,0.04)] transition-all cursor-pointer`}
                >
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    {renderIcon(n.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-800 text-base">{n.title || "Thông báo"}</h3>
                      <span className="text-xs font-medium text-slate-400">{formatTime(n.createdAt)}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: n.message }}></p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Group: Hôm qua */}
        {groups.yesterday.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-bold tracking-widest text-slate-500 uppercase bg-slate-100 px-3 py-1 rounded-full">Hôm qua</span>
              <div className="h-px flex-1 bg-slate-200/60"></div>
            </div>
<<<<<<< HEAD
            <div className="grid gap-4">
=======
            <div className="grid gap-4 md:grid-cols-2">
>>>>>>> feature/tablet
              {groups.yesterday.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => handleRead(n.id, n.isRead, n.orderId ? orderRedirectPath : null)}
                  className={`group relative flex items-start gap-5 p-6 bg-white border border-transparent hover:border-emerald-100 rounded-2xl shadow-[0_12px_32px_-4px_rgba(20,27,43,0.04)] transition-all cursor-pointer`}
                >
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    {renderIcon(n.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-800 text-base">{n.title || "Thông báo"}</h3>
                      <span className="text-xs font-medium text-slate-400">{formatTime(n.createdAt)}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: n.message }}></p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Group: Cũ hơn */}
        {groups.older.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-bold tracking-widest text-slate-500 uppercase bg-slate-100 px-3 py-1 rounded-full">Cũ hơn</span>
              <div className="h-px flex-1 bg-slate-200/60"></div>
            </div>
<<<<<<< HEAD
            <div className="grid gap-4 opacity-80">
=======
            <div className="grid gap-4 md:grid-cols-2 opacity-80">
>>>>>>> feature/tablet
              {groups.older.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => handleRead(n.id, n.isRead, n.orderId ? orderRedirectPath : null)}
                  className={`group relative flex items-start gap-5 p-6 bg-white border border-transparent hover:border-emerald-100 rounded-2xl shadow-[0_12px_32px_-4px_rgba(20,27,43,0.04)] transition-all cursor-pointer`}
                >
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                    {renderIcon(n.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-800 text-base">{n.title || "Thông báo"}</h3>
                      <span className="text-xs font-medium text-slate-400">
                        {new Date(n.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: n.message }}></p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

    </div>
  );
}
