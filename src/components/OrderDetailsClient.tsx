"use client";

import { useRouter } from "next/navigation";

interface OrderDetailsClientProps {
  order: any;
}

export default function OrderDetailsClient({ order }: OrderDetailsClientProps) {
  const router = useRouter();

  // Generate real QR code using orderId
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${order.id}`;

  return (
    <div className="bg-surface text-on-surface min-h-[100dvh] pb-8 font-body">
      {/* TopAppBar */}
      <header className="w-full sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-surface-container">
        <div className="flex items-center justify-between px-4 h-16 w-full max-w-screen-xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full active:scale-95 duration-150 hover:bg-surface-container-high transition-colors text-primary"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-semibold tracking-tight text-lg text-primary">Chi tiết đơn hàng</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 space-y-6 pt-6">
        {/* Active Order Card */}
        <article className="bg-white rounded-3xl overflow-hidden shadow-lg border border-outline-variant/10 animate-in fade-in duration-500 slide-in-from-bottom-4">
          {/* Status & Time Banner */}
          <div className="px-6 py-4 flex justify-between items-center bg-primary/5 border-b border-outline-variant/5">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
              order.status === 'PICKED_UP' ? 'bg-primary text-white' : 'bg-tertiary-container text-on-tertiary-container'
            }`}>
              {order.status === 'PICKED_UP' ? 'Đã hoàn thành' : 'Chờ nhận hàng'}
            </span>
            <div className="flex items-center space-x-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">event</span>
              <span className="text-xs font-bold">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
          
          {/* QR & PIN Content */}
          <div className="p-8 flex flex-col items-center bg-white">
            <div className="p-4 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] mb-8 border border-outline-variant/5 relative group transition-transform hover:scale-[1.02]">
              <img 
                alt="Order QR Code" 
                className="w-48 h-48 rounded-xl" 
                src={qrCodeUrl}
              />
              <div className="absolute inset-0 border-2 border-primary/20 rounded-3xl pointer-events-none group-hover:border-primary/40 transition-colors"></div>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.3em] mb-2 opacity-60">Mã PIN dự phòng</p>
              <p className="text-4xl font-black tracking-widest text-on-surface font-mono">#{order.pickupCode || 'N/A'}</p>
            </div>
          </div>
          
          {/* Store Info */}
          <div className="p-6 bg-surface-container-lowest/50">
             <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md border border-outline-variant/10">
                <img 
                  alt="Store Logo" 
                  className="w-full h-full object-cover" 
                  src={order.store.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=200"}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight text-on-surface">{order.store.name}</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{order.store.address}</p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 px-4 rounded-xl bg-primary text-white text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-primary/20">
                <span className="material-symbols-outlined text-[18px]">directions</span>
                <span>Chỉ đường</span>
              </button>
              <button className="py-3 px-4 rounded-xl border border-outline-variant text-on-surface text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-surface-container-high">
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span>Liên hệ</span>
              </button>
            </div>
          </div>
          
          {/* Item Details */}
          <div className="px-6 py-6 bg-surface-container-low/30 border-t border-outline-variant/5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Chi tiết vật phẩm</h4>
            {order.items.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between mb-4 last:mb-0">
                <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {item.quantity}x
                    </span>
                    <span className="text-sm font-bold text-on-surface max-w-[150px] truncate">{item.product.name}</span>
                </div>
                <span className="font-bold text-primary">{(item.unitPrice * item.quantity).toLocaleString('vi-VN')}đ</span>
              </div>
            ))}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-outline-variant/10">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${order.paymentStatus === 'PAID' ? 'bg-success' : 'bg-warning'}`}></span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Tổng cộng</p>
                <p className="text-xl font-black text-primary">{order.totalAmount.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>
          </div>
        </article>

        {/* Rescue Stats */}
        <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary relative">
            <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            <div className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">+0.5kg</div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-primary">Bạn đã cứu thực phẩm thành công!</p>
            <p className="text-xs text-on-surface-variant leading-relaxed opacity-80">Hành động nhỏ của bạn đang góp phần giảm lượng phát thải khí nhà kính.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
