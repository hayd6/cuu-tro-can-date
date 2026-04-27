"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createOrder } from "@/lib/actions/orders";
import { useSession } from "next-auth/react";

// Hard-coded merchant demo store ID — replaced at runtime after seed
// For demo: any logged-in user can place orders against the seeded store
const DEMO_BUYER_EMAIL = "nguyen.thi.a@gmail.com";

type Product = {
  id: string;
  name: string;
  imageUrl: string | null;
  originalPrice: number;
  discountPrice: number;
  store: {
    id: string;
    name: string;
    address: string;
    imageUrl: string | null;
  };
};

export default function CheckoutClient({
  product,
  initialQuantity,
}: {
  product: Product;
  initialQuantity: number;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(initialQuantity);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);

    try {
      // MoMo integration
      if (paymentMethod === "MOMO") {
        const response = await fetch("/api/payment/momo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: product.discountPrice * quantity,
            orderInfo: `Thanh toán: ${product.name} - ${product.store.name} (x${quantity})`,
          }),
        });
        const data = await response.json();
        if (data.payUrl) {
          window.location.href = data.payUrl;
          return;
        }
        alert("Lỗi MoMo: " + (data.error || "Vui lòng thử lại"));
        setIsProcessing(false);
        return;
      }

      // For COD and other methods - create order directly
      const buyerId = (session?.user as any)?.id;

      if (!buyerId) {
        // Fallback to demo buyer if not logged in
        router.push("/login?callbackUrl=" + encodeURIComponent(`/checkout/${product.id}`));
        return;
      }

      await createOrder({
        buyerId,
        storeId: product.store.id,
        productId: product.id,
        quantity,
        unitPrice: product.discountPrice,
        paymentMethod,
      });

      router.push("/orders?success=1");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-[calc(100vh-var(--header-height))] font-body relative lg:pb-12 overflow-y-auto">
      {/* Top AppBar - Hidden on Desktop */}
      <header className="w-full top-0 sticky z-50 bg-surface/90 backdrop-blur-md flex items-center justify-between px-4 py-3 border-b border-outline-variant/10 shadow-sm lg:hidden">
        <div className="flex items-center gap-4 w-full max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="hover:bg-surface-container-high p-2 rounded-full active:-translate-x-1 transition-all text-primary"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="flex-grow text-center text-lg font-semibold tracking-tight text-on-surface">
            Xác nhận đơn hàng
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 lg:py-10 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Store Information Card */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-high">
                  <img
                    className="w-full h-full object-cover"
                    alt={product.store.name}
                    src={product.store.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=200"}
                  />
                </div>
                <div className="flex-grow space-y-1">
                  <h2 className="text-on-surface font-extrabold text-xl leading-tight">{product.store.name}</h2>
                  <p className="text-on-surface-variant text-sm flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    {product.store.address}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-4 bg-primary/5 py-1.5 px-3 rounded-full w-fit">
                    <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                    <span className="text-primary font-bold text-xs uppercase tracking-wider">Lấy hàng trong giờ mở cửa</span>
                  </div>
                </div>
              </div>
              <div className="mt-5 p-4 bg-error-container/20 rounded-xl flex gap-3 items-start border border-error/10">
                <span className="material-symbols-outlined text-error text-[20px] mt-0.5">warning</span>
                <p className="text-on-error-container text-xs sm:text-sm leading-relaxed font-semibold">
                  Vui lòng đến đúng giờ. Đơn hàng sẽ bị hủy và không hoàn tiền nếu quá hạn.
                </p>
              </div>
            </section>

            {/* Product Summary */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 space-y-4 border border-outline-variant/10 shadow-sm">
              <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Sản phẩm cứu trợ</h3>
              <div className="flex items-center justify-between gap-4 py-2">
                <div className="flex flex-col">
                  <span className="text-on-surface font-bold text-lg mb-1">{product.name}</span>
                  <span className="text-primary font-extrabold text-lg">
                    {product.discountPrice.toLocaleString("vi-VN")}đ
                    <span className="text-xs text-on-surface-variant font-medium ml-2">/ phần</span>
                  </span>
                </div>

                <div className="flex items-center bg-surface-container-high rounded-full px-1.5 py-1.5 gap-3">
                  <button
                    onClick={() => quantity > 1 && setQuantity((q) => q - 1)}
                    className="w-10 h-10 flex items-center justify-center text-on-surface hover:text-primary transition-colors active:scale-95 bg-surface-container-lowest rounded-full shadow-sm"
                  >
                    <span className="material-symbols-outlined text-base">remove</span>
                  </button>
                  <span className="w-6 text-center font-black text-on-surface text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-on-primary transition-colors active:scale-95 bg-primary rounded-full shadow-sm"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Payment Methods */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Phương thức thanh toán</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* MoMo */}
                <label className="flex items-center p-4 bg-surface-container-lowest rounded-2xl cursor-pointer hover:bg-surface-container-low transition-colors border shadow-sm has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5 has-[:checked]:shadow-md">
                  <input
                    checked={paymentMethod === "MOMO"}
                    onChange={() => setPaymentMethod("MOMO")}
                    className="w-5 h-5 text-primary border-outline-variant focus:ring-primary focus:ring-offset-0 bg-surface-container-lowest"
                    name="payment"
                    type="radio"
                  />
                  <div className="flex items-center gap-3 ml-4">
                    <div className="w-10 h-10 rounded-xl bg-[#A50064] shadow-sm flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">MoMo</div>
                    <span className="font-bold text-on-surface text-sm">Ví MoMo</span>
                  </div>
                </label>

                {/* ZaloPay */}
                <label className="flex items-center p-4 bg-surface-container-lowest rounded-2xl cursor-pointer hover:bg-surface-container-low transition-colors border shadow-sm has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5 has-[:checked]:shadow-md">
                  <input
                    checked={paymentMethod === "ZALOPAY"}
                    onChange={() => setPaymentMethod("ZALOPAY")}
                    className="w-5 h-5 text-primary border-outline-variant focus:ring-primary focus:ring-offset-0 bg-surface-container-lowest"
                    name="payment"
                    type="radio"
                  />
                  <div className="flex items-center gap-3 ml-4">
                    <div className="w-10 h-10 rounded-xl bg-[#008FE5] shadow-sm flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">Zalo</div>
                    <span className="font-bold text-on-surface text-sm">ZaloPay</span>
                  </div>
                </label>

                {/* COD */}
                <label className="flex items-center p-4 bg-surface-container-lowest rounded-2xl cursor-pointer hover:bg-surface-container-low transition-colors border shadow-sm has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5 has-[:checked]:shadow-md">
                  <input
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="w-5 h-5 text-primary border-outline-variant focus:ring-primary focus:ring-offset-0 bg-surface-container-lowest"
                    name="payment"
                    type="radio"
                  />
                  <div className="flex items-center gap-3 ml-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant flex-shrink-0">
                      <span className="material-symbols-outlined">payments</span>
                    </div>
                    <div>
                      <span className="font-bold text-on-surface text-sm block">COD</span>
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-widest block mt-0.5">Tiền mặt</span>
                    </div>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary (Desktop Sticky) */}
          <div className="lg:col-span-4">
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 shadow-md sticky top-24 space-y-6">
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/10 pb-3">
                Tổng kết đơn hàng
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-on-surface-variant font-medium">
                  <span>Tạm tính ({quantity} phần)</span>
                  <span>{(product.discountPrice * quantity).toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between text-on-surface-variant font-medium">
                  <span>Phí dịch vụ</span>
                  <span className="text-emerald-600 font-bold">Miễn phí</span>
                </div>
                <div className="border-t border-outline-variant/10 pt-3 flex justify-between items-baseline">
                  <span className="text-base font-bold text-on-surface">Tổng cộng</span>
                  <span className="text-2xl font-extrabold text-primary">
                    {(product.discountPrice * quantity).toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all text-center disabled:opacity-70 disabled:pointer-events-none"
              >
                {isProcessing ? "Đang xử lý..." : "Xác nhận & Thanh toán"}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Action Bar (lg:hidden) */}
      <footer className="fixed bottom-0 left-0 w-full z-40 bg-white/95 backdrop-blur-xl border-t border-outline-variant/10 shadow-[0_-8px_24px_-4px_rgba(20,27,43,0.06)] rounded-t-3xl px-6 pt-5 pb-8 lg:hidden">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-0.5">Tổng thanh toán</span>
            <span className="text-2xl font-extrabold text-primary">
              {(product.discountPrice * quantity).toLocaleString("vi-VN")}đ
            </span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="flex-1 max-w-[220px] bg-gradient-to-r from-primary to-primary-container text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-lg shadow-primary/20 active:scale-95 transition-all text-center disabled:opacity-70 disabled:pointer-events-none"
          >
            {isProcessing ? "Đang xử lý..." : "Thanh toán"}
          </button>
        </div>
      </footer>
    </div>

  );
}
