"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("momo");

  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);

    if (paymentMethod === 'momo') {
      try {
        const response = await fetch('/api/payment/momo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: 15000 * quantity,
            orderInfo: `Thanh toán túi mù - Bếp Xanh Eco-Deli (x${quantity})`
          }),
        });
        
        const data = await response.json();
        
        if (data.payUrl) {
          window.location.href = data.payUrl;
        } else {
          setIsProcessing(false);
          alert('Lỗi thanh toán MoMo: ' + (data.error || 'Vui lòng thử lại sau'));
        }
      } catch (error) {
        setIsProcessing(false);
        console.error('Payment error:', error);
        alert('Có lỗi xảy ra khi kết nối cổng thanh toán.');
      }
    } else {
      // Simulated checkout for other methods
      setTimeout(() => {
        setIsProcessing(false);
        router.push("/orders/success");
      }, 1500);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-[100dvh] font-body relative pb-32">
      {/* Top AppBar */}
      <header className="w-full top-0 sticky z-50 bg-surface/90 backdrop-blur-md flex items-center justify-between px-4 py-3 border-b border-outline-variant/10 shadow-sm">
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
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-300">
        {/* Pickup Information Card */}
        <section className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/10 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
              <img 
                className="w-full h-full object-cover" 
                alt="Store front" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXrTVqy46aAPixTtPa8kqs3QL6K62edospHiOVKukdXGsoodT4W8LPa3rV9vsFu0vhjj529dR4EtgZatje5dqBoMYJD3l_JAXeg5KQ3pxXuHyFtWheSCfnONymiIZtQt84aSwT7Gcpx9heiuZeD4vBzYCDIlghUMg3NdKR_CKcWlaCBHCs0lyO4KVl3ipHN_3B5RtP9LcgRl63Q-01xpI9h5e3JG58VRcwOhUX_NxivTWnP66nXdDtf7pzUaU5x7ZQyIsZgxAhYqw"
              />
            </div>
            <div className="flex-grow space-y-1">
              <h2 className="text-on-surface font-bold text-lg leading-tight">Bếp Xanh Eco-Deli</h2>
              <p className="text-on-surface-variant text-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">location_on</span>
                123 Lê Lợi, Q.1
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3 bg-primary/5 py-1.5 px-3 rounded-full w-fit">
                <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                <span className="text-primary font-semibold text-xs uppercase tracking-wider">Hôm nay, 20:00 - 21:30</span>
              </div>
            </div>
          </div>
          <div className="mt-5 p-3 bg-error-container/30 rounded-xl flex gap-3 items-start border border-error/5">
            <span className="material-symbols-outlined text-error text-[18px] mt-0.5">warning</span>
            <p className="text-on-error-container text-[11px] sm:text-xs leading-relaxed font-medium">
              Vui lòng đến đúng giờ. Đơn hàng sẽ bị hủy và không hoàn tiền nếu quá hạn.
            </p>
          </div>
        </section>

        {/* Product Summary */}
        <section className="bg-surface-container-lowest rounded-2xl p-5 space-y-4 border border-outline-variant/10 shadow-sm">
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest pl-1">Sản phẩm cứu trợ</h3>
          <div className="flex items-center justify-between group gap-4">
            <div className="flex flex-col">
              <span className="text-on-surface font-semibold text-base mb-1">Túi mù bánh ngọt & Bánh mì</span>
              <span className="text-primary font-bold">{(15000 * quantity).toLocaleString('vi-VN')}đ</span>
            </div>
            
            <div className="flex items-center bg-surface-container-high rounded-full px-1 py-1 gap-2">
              <button 
                onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                className="w-8 h-8 flex items-center justify-center text-on-surface hover:text-primary transition-colors active:scale-95 bg-surface-container-lowest rounded-full shadow-sm"
              >
                <span className="material-symbols-outlined text-lg">remove</span>
              </button>
              <span className="w-4 text-center font-bold text-on-surface">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="w-8 h-8 flex items-center justify-center text-on-primary transition-colors active:scale-95 bg-primary rounded-full shadow-sm"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="space-y-4 pb-12">
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-1">Phương thức thanh toán</h3>
          <div className="space-y-3">
            {/* MoMo */}
            <label className="flex items-center p-4 bg-surface-container-lowest rounded-2xl cursor-pointer hover:bg-surface-container-low transition-colors border shadow-sm has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5 has-[:checked]:shadow-md">
              <input 
                checked={paymentMethod === 'momo'} 
                onChange={() => setPaymentMethod('momo')}
                className="w-5 h-5 text-primary border-outline-variant focus:ring-primary focus:ring-offset-0 bg-surface-container-lowest" 
                name="payment" 
                type="radio"
              />
              <div className="flex items-center gap-3 ml-4">
                <div className="w-10 h-10 rounded-xl bg-[#A50064] shadow-sm flex items-center justify-center text-white text-[10px] font-bold">MoMo</div>
                <span className="font-semibold text-on-surface">Ví MoMo</span>
              </div>
            </label>
            
            {/* ZaloPay */}
            <label className="flex items-center p-4 bg-surface-container-lowest rounded-2xl cursor-pointer hover:bg-surface-container-low transition-colors border shadow-sm has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5 has-[:checked]:shadow-md">
              <input 
                checked={paymentMethod === 'zalo'} 
                onChange={() => setPaymentMethod('zalo')}
                className="w-5 h-5 text-primary border-outline-variant focus:ring-primary focus:ring-offset-0 bg-surface-container-lowest" 
                name="payment" 
                type="radio"
              />
              <div className="flex items-center gap-3 ml-4">
                <div className="w-10 h-10 rounded-xl bg-[#008FE5] shadow-sm flex items-center justify-center text-white text-[10px] font-bold">Zalo</div>
                <span className="font-semibold text-on-surface">ZaloPay</span>
              </div>
            </label>
            
            {/* Card */}
            <label className="flex items-center p-4 bg-surface-container-lowest rounded-2xl cursor-pointer hover:bg-surface-container-low transition-colors border shadow-sm has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5 has-[:checked]:shadow-md">
              <input 
                checked={paymentMethod === 'card'} 
                onChange={() => setPaymentMethod('card')}
                className="w-5 h-5 text-primary border-outline-variant focus:ring-primary focus:ring-offset-0 bg-surface-container-lowest" 
                name="payment" 
                type="radio"
              />
              <div className="flex items-center gap-3 ml-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined">credit_card</span>
                </div>
                <div>
                   <span className="font-semibold text-on-surface block">Thẻ ATM / Tín dụng</span>
                   <span className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5 block">Nội địa & Quốc tế</span>
                </div>
              </div>
            </label>
            
            {/* COD */}
            <label className="flex items-center p-4 bg-surface-container-lowest rounded-2xl cursor-pointer hover:bg-surface-container-low transition-colors border shadow-sm has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5 has-[:checked]:shadow-md">
              <input 
                checked={paymentMethod === 'cod'} 
                onChange={() => setPaymentMethod('cod')}
                className="w-5 h-5 text-primary border-outline-variant focus:ring-primary focus:ring-offset-0 bg-surface-container-lowest" 
                name="payment" 
                type="radio"
              />
              <div className="flex items-center gap-3 ml-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div>
                   <span className="font-semibold text-on-surface block">Thanh toán khi nhận hàng</span>
                   <span className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5 block">Tiền mặt</span>
                </div>
              </div>
            </label>
          </div>
        </section>
      </main>

      {/* Bottom Action Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl border-t border-outline-variant/10 shadow-[0_-8px_24px_-4px_rgba(20,27,43,0.06)] rounded-t-3xl sm:rounded-none px-6 pt-5 pb-8 sm:pb-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-0.5">Tổng thanh toán</span>
            <span className="text-2xl font-extrabold text-primary">{(15000 * quantity).toLocaleString('vi-VN')}đ</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={isProcessing}
            className="flex-1 sm:flex-none sm:w-[200px] bg-gradient-to-r from-primary to-primary-container text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-lg shadow-primary/20 active:scale-95 transition-all text-center disabled:opacity-70 disabled:pointer-events-none"
          >
            {isProcessing ? "Đang xử lý..." : "Thanh toán"}
          </button>
        </div>
      </footer>
    </div>
  );
}
