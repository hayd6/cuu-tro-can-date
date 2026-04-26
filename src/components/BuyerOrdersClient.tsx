"use client";

import { useState } from "react";
import { cancelOrder } from "@/lib/actions/orders";
import { useRouter } from "next/navigation";
import Link from "next/link";

type OrderItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  product: { id: string; name: string; imageUrl: string | null };
};

type Order = {
  id: string;
  orderCode: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  pickupCode: string | null;
  createdAt: Date;
  store: { id: string; name: string; address: string; imageUrl: string | null };
  items: OrderItem[];
  reviews?: { id: string }[];
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Chờ thanh toán", color: "bg-tertiary-container text-on-tertiary-container" },
  CONFIRMED: { label: "Chờ lấy hàng", color: "bg-primary-container/20 text-on-primary-container" },
  PICKED_UP: { label: "Đã hoàn thành", color: "bg-secondary-container text-on-secondary-container" },
  CANCELLED: { label: "Đã hủy", color: "bg-error-container text-on-error-container" },
};

export default function BuyerOrdersClient({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  const pendingOrders = orders.filter((o) => o.status === "CONFIRMED" || o.status === "PENDING");
  const historyOrders = orders.filter((o) => o.status === "PICKED_UP" || o.status === "CANCELLED");

  const handleCancel = async (orderId: string) => {
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này không?")) return;
    await cancelOrder(orderId);
    router.refresh();
  };

  return (
    <>
      {/* Tabs Navigation */}
      <nav className="flex px-4 bg-surface-container-low mb-6 relative border-b border-outline-variant/10">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex-1 py-4 text-center transition-all ${
            activeTab === "pending"
              ? "border-b-2 border-primary text-primary font-bold"
              : "text-on-surface-variant font-medium border-b-2 border-transparent hover:text-primary"
          }`}
        >
          Đang chờ lấy ({pendingOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-4 text-center transition-all ${
            activeTab === "history"
              ? "border-b-2 border-primary text-primary font-bold"
              : "text-on-surface-variant font-medium border-b-2 border-transparent hover:text-primary"
          }`}
        >
          Lịch sử
        </button>
      </nav>

      <main className="max-w-md mx-auto px-4 space-y-6">
        {activeTab === "pending" && (
          <>
            {pendingOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <span className="material-symbols-outlined text-5xl text-outline-variant">receipt_long</span>
                <p className="text-on-surface-variant font-medium">Chưa có đơn hàng nào đang chờ</p>
              </div>
            ) : (
              pendingOrders.map((order) => {
                const statusInfo = STATUS_MAP[order.status];
                const firstItem = order.items[0];
                return (
                  <article
                    key={order.id}
                    className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_12px_32px_-4px_rgba(20,27,43,0.04)] animate-in fade-in zoom-in duration-300"
                  >
                    {/* Status & Time Banner */}
                    <div className="px-5 py-4 flex justify-between items-center bg-surface-container-low">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      <span className="text-on-surface-variant text-xs font-semibold">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")} - {new Date(order.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    {/* QR & PIN */}
                    <div className="p-8 flex flex-col items-center border-b border-surface-container-high border-dashed bg-white">
                      <div className="p-5 bg-white rounded-2xl shadow-sm mb-6 border border-outline-variant/10">
                        {/* Real QR Code generated from goqr.me */}
                        <div className="w-44 h-44 flex items-center justify-center bg-white rounded-xl overflow-hidden p-2">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${order.id}`} 
                            alt={`QR for order ${order.orderCode}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.2em] mb-1">Mã PIN dự phòng</p>
                        <p className="text-3xl font-extrabold tracking-tight text-on-surface">
                          #{order.pickupCode || order.orderCode}
                        </p>
                      </div>
                    </div>

                    {/* Store Info */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-5">
                        <img
                          alt={order.store.name}
                          className="w-14 h-14 rounded-xl object-cover shadow-sm"
                          src={order.store.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=200"}
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg leading-tight text-on-surface">{order.store.name}</h3>
                          <p className="text-xs text-on-surface-variant mt-1">{order.store.address}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button className="flex-1 py-3 px-4 rounded-lg border border-primary/20 bg-surface-container-low text-primary text-sm font-bold flex items-center justify-center space-x-2 active:scale-95 transition-all hover:bg-primary/5">
                          <span className="material-symbols-outlined text-[20px]">near_me</span>
                          <span>Chỉ đường</span>
                        </button>
                        <button className="flex-1 py-3 px-4 rounded-lg bg-surface-container-high text-on-surface text-sm font-bold flex items-center justify-center space-x-2 active:scale-95 transition-all hover:bg-surface-variant">
                          <span className="material-symbols-outlined text-[20px]">call</span>
                          <span>Gọi cửa hàng</span>
                        </button>
                      </div>
                    </div>

                    {/* Item Details & Footer */}
                    <div className="px-6 py-5 bg-surface-container-low/40 border-t border-outline-variant/10">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-on-surface">
                            {item.quantity}x {item.product.name}
                          </span>
                          <span className="font-bold text-primary">
                            {(item.unitPrice * item.quantity).toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-outline-variant/10">
                        <span className="text-[10px] font-bold text-primary-container bg-primary-container/20 px-3 py-1 rounded-full uppercase tracking-wider">
                          {order.paymentStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                        </span>
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="text-xs font-semibold text-outline hover:text-error transition-colors"
                        >
                          Hủy đơn
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}

            {/* Eco Stats */}
            <div className="bg-primary/10 p-5 rounded-2xl border border-primary/10 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[28px]">eco</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-primary">Bạn đã đặt {orders.filter(o => o.status === "PICKED_UP").length} đơn hàng cứu trợ!</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">Tiếp tục giải cứu để nhận thêm huy hiệu xanh nhé.</p>
              </div>
            </div>
          </>
        )}

        {activeTab === "history" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {historyOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <span className="material-symbols-outlined text-5xl text-outline-variant">history</span>
                <p className="text-on-surface-variant font-medium">Chưa có lịch sử đơn hàng</p>
              </div>
            ) : (
              historyOrders.map((order) => {
                const statusInfo = STATUS_MAP[order.status];
                return (
                  <article
                    key={order.id}
                    className="bg-surface-container-lowest rounded-xl p-5 shadow-[0_12px_32px_-4px_rgba(20,27,43,0.04)] transition-transform active:scale-[0.98]"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden border border-outline-variant/10">
                          <img
                            className="w-full h-full object-cover"
                            alt={order.store.name}
                            src={order.store.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=200"}
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-on-surface text-lg leading-tight">{order.store.name}</h3>
                          <p className="text-on-surface-variant text-sm">
                            {new Date(order.createdAt).toLocaleDateString("vi-VN")} - {new Date(order.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 mb-3 p-3 bg-surface-container-low rounded-xl"
                      >
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-surface-container flex-shrink-0">
                          <img
                            className="w-full h-full object-cover"
                            alt={item.product.name}
                            src={item.product.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200"}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{item.quantity}x {item.product.name}</p>
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-between items-center py-3 border-y border-outline-variant/15">
                      <span className="text-on-surface-variant text-sm">Tổng cộng</span>
                      <span className="font-bold text-on-surface">{order.totalAmount.toLocaleString("vi-VN")}đ</span>
                    </div>

                    {order.status === "PICKED_UP" && (
                      <div className="mt-4 p-3 rounded-lg bg-primary-container/10 flex items-center gap-2 border border-primary/5">
                        <span className="text-lg">🌱</span>
                        <p className="text-on-primary-container text-xs font-medium">Cảm ơn bạn đã cứu thực phẩm qua đơn này!</p>
                      </div>
                    )}

                    {order.status === "PICKED_UP" && (
                      <div className="flex gap-3 mt-5">
                        <Link 
                          href={`/orders/${order.id}/review`}
                          className="flex-1 py-3 px-4 rounded-lg bg-surface-container-highest text-primary font-bold text-sm hover:bg-primary/10 transition-colors active:scale-95 flex items-center justify-center"
                        >
                          {order.reviews && order.reviews.length > 0 ? "Sửa đánh giá" : "Đánh giá"}
                        </Link>
                        <Link 
                          href={`/product/${order.items[0]?.product.id}`}
                          className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-sm shadow-md shadow-primary/20 hover:opacity-90 transition-opacity active:scale-95 flex items-center justify-center"
                        >
                          Đặt lại
                        </Link>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        )}
      </main>
    </>
  );
}
