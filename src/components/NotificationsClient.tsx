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
    <div className="bg-surface text-on-surface min-h-[100dvh] pb-32 font-body antialiased">
      <header className="w-full top-0 sticky bg-surface/90 backdrop-blur-md z-40 border-b border-surface-container">
        <div className="flex items-center justify-center px-6 py-4 w-full max-w-xl mx-auto">
          <h1 className="font-['Inter'] font-semibold tracking-tight text-xl text-primary">{title}</h1>
        </div>
      </header>
      
      <main className="max-w-xl mx-auto px-4 py-6 space-y-8 animate-in fade-in duration-300">
        
        {notifications.length === 0 && (
          <div className="text-center text-on-surface-variant mt-20">Bạn chưa có thông báo nào.</div>
        )}

        {/* Group: Hôm nay */}
        {groups.today.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-bold tracking-[0.1em] uppercase text-on-surface-variant">Hôm nay</h2>
              {groups.today.some(n => !n.isRead) && <span className="w-2 h-2 rounded-full bg-primary-container"></span>}
            </div>
            <div className="space-y-3">
              {groups.today.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => handleRead(n.id, n.isRead, n.orderId ? `/orders` : null)}
                  className={`relative cursor-pointer transition-all duration-300 active:scale-[0.98] border shadow-sm p-4 flex gap-4 rounded-xl ${n.isRead ? 'bg-surface-container-lowest border-outline-variant/10' : 'bg-surface-container-low border-primary/20'}`}
                >
                  {!n.isRead && <div className="absolute top-1/2 -translate-y-1/2 left-1.5 w-2 h-2 rounded-full bg-primary animate-pulse"></div>}
                  {renderIcon(n.type)}
                  <div className="flex-1 space-y-1">
                    <p className="text-[0.875rem] font-medium text-on-surface leading-snug" dangerouslySetInnerHTML={{ __html: n.message }}></p>
                    <p className="text-[0.75rem] text-on-surface-variant font-medium">{formatTime(n.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Group: Hôm qua */}
        {groups.yesterday.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-bold tracking-[0.1em] uppercase text-on-surface-variant">Hôm qua</h2>
              {groups.yesterday.some(n => !n.isRead) && <span className="w-2 h-2 rounded-full bg-primary-container"></span>}
            </div>
            <div className="space-y-3">
              {groups.yesterday.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => handleRead(n.id, n.isRead, n.orderId ? orderRedirectPath : null)}
                  className={`relative cursor-pointer transition-all duration-300 active:scale-[0.98] border shadow-sm p-4 flex gap-4 rounded-xl ${n.isRead ? 'bg-surface-container-lowest border-outline-variant/10' : 'bg-surface-container-low border-primary/20'}`}
                >
                  {!n.isRead && <div className="absolute top-1/2 -translate-y-1/2 left-1.5 w-2 h-2 rounded-full bg-primary animate-pulse"></div>}
                  {renderIcon(n.type)}
                  <div className="flex-1 space-y-1">
                    <p className="text-[0.875rem] font-medium text-on-surface leading-snug" dangerouslySetInnerHTML={{ __html: n.message }}></p>
                    <p className="text-[0.75rem] text-on-surface-variant font-medium">{formatTime(n.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Group: Cũ hơn */}
        {groups.older.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold tracking-[0.1em] uppercase text-on-surface-variant px-2">Cũ hơn</h2>
             <div className="space-y-3">
              {groups.older.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => handleRead(n.id, n.isRead, n.orderId ? orderRedirectPath : null)}
                  className={`relative cursor-pointer transition-all duration-300 active:scale-[0.98] border shadow-sm p-4 flex gap-4 rounded-xl ${n.isRead ? 'bg-surface-container-lowest border-outline-variant/10' : 'bg-surface-container-low border-primary/20'}`}
                >
                  {!n.isRead && <div className="absolute top-1/2 -translate-y-1/2 left-1.5 w-2 h-2 rounded-full bg-primary animate-pulse"></div>}
                  {renderIcon(n.type)}
                  <div className="flex-1 space-y-1">
                    <p className="text-[0.875rem] font-medium text-on-surface leading-snug" dangerouslySetInnerHTML={{ __html: n.message }}></p>
                    <p className="text-[0.75rem] text-on-surface-variant font-medium">
                      {new Date(n.createdAt).toLocaleDateString("vi-VN")} - {formatTime(n.createdAt)}
                    </p>
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
