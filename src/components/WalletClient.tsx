"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { linkPayment, unlinkPayment, setDefaultPayment } from "@/lib/actions/wallet";

interface Payment {
  id: string;
  type: "WALLET" | "BANK";
  provider: string;
  accountNumber: string;
  accountName: string | null;
  isDefault: boolean;
}

interface WalletClientProps {
  initialPayments: any[];
  userId: string;
}

export default function WalletClient({ initialPayments, userId }: WalletClientProps) {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [isLinking, setIsLinking] = useState<string | null>(null);

  // Helper to check if a provider is linked
  const getLinkage = (provider: string) => payments.find(p => p.provider === provider);

  const handleLink = async (provider: string, type: "WALLET" | "BANK") => {
    setIsLinking(provider);
    
    // Simulating a real linkage flow (in real app, this would redirect to MoMo/ZaloPay)
    const mockAccountNumber = provider === "MOMO" ? "09***123" : provider === "ZALOPAY" ? "08***456" : "07***789";
    
    const res = await linkPayment({
      userId,
      type,
      provider,
      accountNumber: mockAccountNumber,
      accountName: "Người dùng Test"
    });

    if (res.success) {
      setPayments([...payments, res.data as Payment]);
      router.refresh();
    } else {
      alert(res.error);
    }
    setIsLinking(null);
  };

  const handleUnlink = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn hủy liên kết phương thức này?")) return;
    const res = await unlinkPayment(id);
    if (res.success) {
      setPayments(payments.filter(p => p.id !== id));
      router.refresh();
    }
  };

  const handleSetDefault = async (id: string) => {
    const res = await setDefaultPayment(id, userId);
    if (res.success) {
      setPayments(payments.map(p => ({ ...p, isDefault: p.id === id })));
      router.refresh();
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-[100dvh]">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-50 bg-surface/80 backdrop-blur-md border-b border-surface-container">
        <div className="desktop-page-shell-tight flex items-center justify-between px-4 lg:px-6 py-3 w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-surface-container transition-colors active:scale-95 duration-150 text-primary"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-['Inter'] font-semibold text-lg tracking-tight text-on-surface flex-1 text-center pr-10">Liên kết thanh toán</h1>
          </div>
        </div>
      </header>

      <main className="desktop-page-shell-tight px-4 lg:px-6 xl:px-8 pt-6 lg:pt-8 pb-20 lg:pb-12 space-y-10 animate-in fade-in duration-300 slide-in-from-bottom-4">
        {/* Hero Message */}
        <section className="space-y-2">
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-on-surface">Quản lý <span className="text-primary">thanh toán.</span></h2>
          <p className="text-on-surface-variant text-sm max-w-xs">Thiết lập các phương thức thanh toán để việc cứu trợ thực phẩm trở nên nhanh chóng hơn.</p>
        </section>

        {/* Section 1: Digital Wallets */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant">Ví điện tử</h3>
          </div>
          <div className="bg-surface-container-low rounded-xl p-1 space-y-1 border border-outline-variant/10 shadow-sm">
            {/* MoMo */}
            <WalletCard 
               provider="MOMO"
               name="MoMo"
               bgColor="#A50064"
               logo="https://lh3.googleusercontent.com/aida-public/AB6AXuAqqvwXiO5sYXu-dqiaXyifwRb9vgowJquHDZZtSSijop9Cdbl1YqMI9C0OXu2CK-tCIzLuYaN_RUQbFr0LWzXzjQ61AUfKpREZTZup-5uid7q9LmoUamaruaugcomt6mdqejVrCr0_xvSUcb1n-6AdjaZuzc6zpbXDom6hawQy0OTGHrmoznTNJRf_JSxJaKNo2PYgXMKZZUDoapJf1ykquuULL7KlPxbJoWOz51ADhXW7Tb6leDGyftV6ZkpFBT9Sp-UnwbDe0hM"
               linkage={getLinkage("MOMO")}
               onLink={() => handleLink("MOMO", "WALLET")}
               onUnlink={handleUnlink}
               isLinking={isLinking === "MOMO"}
            />

            {/* ZaloPay */}
            <WalletCard 
               provider="ZALOPAY"
               name="ZaloPay"
               bgColor="#008FE5"
               linkage={getLinkage("ZALOPAY")}
               onLink={() => handleLink("ZALOPAY", "WALLET")}
               onUnlink={handleUnlink}
               isLinking={isLinking === "ZALOPAY"}
            />

            {/* ShopeePay */}
            <WalletCard 
               provider="SHOPEEPAY"
               name="ShopeePay"
               bgColor="#EE4D2D"
               linkage={getLinkage("SHOPEEPAY")}
               onLink={() => handleLink("SHOPEEPAY", "WALLET")}
               onUnlink={handleUnlink}
               isLinking={isLinking === "SHOPEEPAY"}
            />
          </div>
        </section>

        {/* Section 2: Bank Accounts */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant">Tài khoản Ngân hàng</h3>
          <div className="bg-surface-container-low rounded-xl p-1 space-y-1 border border-outline-variant/10 shadow-sm">
            {payments.filter(pt => pt.type === "BANK").length === 0 ? (
                <p className="p-8 text-center text-xs text-on-surface-variant italic">Chưa có ngân hàng liên kết</p>
            ) : (
                payments.filter(pt => pt.type === "BANK").map(bank => (
                    <div key={bank.id} className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between border border-outline-variant/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">account_balance</span>
                            </div>
                            <div>
                            <p className="font-semibold text-base">{bank.provider}</p>
                            <p className="text-sm font-mono tracking-widest text-on-surface-variant">{bank.accountNumber}</p>
                            </div>
                        </div>
                        <button 
                          onClick={() => handleUnlink(bank.id)}
                          className="p-2 hover:bg-error/5 rounded-full transition-colors text-error"
                        >
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                ))
            )}

            {/* Add Bank Button (Simple for now) */}
            <button 
              onClick={() => handleLink("Vietcombank", "BANK")}
              className="w-full py-4 text-primary font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors rounded-xl mt-2 active:scale-95 border-t border-outline-variant/10"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              Thêm Vietcombank (Mock)
            </button>
          </div>
        </section>

        {/* Section 3: Default Method */}
        <section className="bg-surface-container-low/50 p-5 rounded-2xl border border-outline-variant/10 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-base">Tự động chọn mặc định</h3>
              <p className="text-xs text-on-surface-variant pr-4">Hệ thống sẽ ưu tiên các phương thức đã liên kết khi thanh toán.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </section>

        {/* Help Section */}
        <footer className="pt-4 text-center pb-8 border-t border-outline-variant/10">
          <p className="text-xs text-on-surface-variant">
            Gặp vấn đề khi thanh toán? 
            <a className="text-primary font-bold hover:underline ml-1" href="/support">Liên hệ hỗ trợ 24/7</a>
          </p>
        </footer>
      </main>

      {/* Floating Security Badge */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-surface/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-outline-variant/10 pointer-events-none">
        <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Bảo mật đa tầng PCI DSS</span>
      </div>
    </div>
  );
}

function WalletCard({ provider, name, bgColor, logo, linkage, onLink, onUnlink, isLinking }: any) {
    return (
        <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between border border-outline-variant/5">
            <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center text-white font-bold`} style={{ backgroundColor: bgColor }}>
                {logo ? (
                    <img className="w-8 h-8 object-contain" alt={name} src={logo} />
                ) : (
                    name.substring(0, 2).toUpperCase()
                )}
            </div>
            <div>
                <p className="font-semibold text-base">{name}</p>
                <p className="text-xs text-on-surface-variant">
                    {linkage ? `Tài khoản: ${linkage.accountNumber}` : "Chưa có kết nối"}
                </p>
            </div>
            </div>
            {linkage ? (
                <button 
                  onClick={() => onUnlink(linkage.id)}
                  className="text-xs font-bold text-on-surface-variant px-3 py-1 bg-surface-container-high rounded-full border border-outline-variant/10 hover:bg-error/5 hover:text-error transition-colors"
                >
                    Hủy liên kết
                </button>
            ) : (
                <button 
                  onClick={onLink}
                  disabled={isLinking}
                  className="bg-gradient-to-r from-primary to-primary-container text-white text-xs font-bold px-4 py-2 rounded-xl active:scale-95 transition-transform shadow-sm disabled:opacity-50"
                >
                    {isLinking ? "Đang xử lý..." : "Liên kết ngay"}
                </button>
            )}
        </div>
    )
}
