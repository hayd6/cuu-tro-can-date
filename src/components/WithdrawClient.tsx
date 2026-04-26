"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestWithdrawal } from "@/lib/actions/stores";

interface Transaction {
  id: string;
  type: string;
  title: string;
  amount: number;
  date: Date | string;
  status: string;
}

interface WithdrawClientProps {
  balance: number;
  storeId: string;
  history: Transaction[];
}

export default function WithdrawClient({ balance, storeId, history }: WithdrawClientProps) {
  const router = useRouter();
  const [amount, setAmount] = useState<string>("500000");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWithdraw = async () => {
    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Số tiền không hợp lệ");
      return;
    }
    if (numAmount > balance) {
      setError("Số dư không đủ");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await requestWithdrawal(storeId, numAmount, "Vietcombank - **** 1234"); // Mock bank info for now
      router.refresh();
      // Reset form or show success
      alert("Yêu cầu rút tiền đã được gửi!");
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-[100dvh]">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm h-16 flex items-center px-4">
        <div className="flex items-center w-full max-w-4xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-surface-container-high transition-colors active:scale-95 duration-200 rounded-full flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <h1 className="ml-4 font-inter text-lg tracking-tight text-on-surface font-bold">Rút tiền</h1>
        </div>
      </header>
      
      <main className="pt-24 pb-12 px-4 max-w-lg mx-auto space-y-8 animate-in fade-in duration-300 slide-in-from-bottom-4">
        {/* Wallet Hero Section */}
        <section className="relative overflow-hidden rounded-xl p-8 bg-gradient-to-br from-primary to-primary-container text-white shadow-md">
          <div className="relative z-10 space-y-1">
            <p className="text-xs uppercase tracking-widest opacity-90 font-semibold">Số dư khả dụng</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold tracking-tighter">{balance.toLocaleString('vi-VN')}</span>
              <span className="text-lg font-medium">đ</span>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </section>

        {/* Withdrawal Form */}
        <section className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight px-1 text-on-surface">Rút tiền</h2>
            
            {/* Amount Input Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1">Số tiền muốn rút</label>
              <div className="relative flex items-center">
                <input 
                  className="w-full bg-surface-container-highest border-none rounded-xl p-4 text-xl font-bold focus:ring-2 focus:ring-primary/20 transition-all text-on-surface outline-none" 
                  placeholder="0" 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <span className="absolute right-4 font-bold text-on-surface-variant">VND</span>
              </div>
              {error && <p className="text-error text-xs px-1 font-medium">{error}</p>}
            </div>

            {/* Bank Selection Card (Static for now) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1">Ngân hàng nhận tiền</label>
              <div className="bg-surface-container-low rounded-xl p-4 flex items-center justify-between group cursor-pointer hover:bg-surface-container transition-colors border border-outline-variant/10 shadow-sm active:scale-95">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm border border-outline-variant/10">
                    <img 
                      alt="Vietcombank" 
                      className="w-full h-full object-contain" 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Logo_Vietcombank.svg/1200px-Logo_Vietcombank.svg.png"
                    />
                  </div>
                  <div>
                    <p className="text-base font-bold text-on-surface">Vietcombank</p>
                    <p className="text-sm text-on-surface-variant">**** **** 1234</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleWithdraw}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white font-bold text-lg shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : (
              <>
                <span>Xác nhận rút tiền</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </>
            )}
          </button>
          
          <p className="text-sm text-center text-on-surface-variant px-6">Thời gian xử lý giao dịch dự kiến từ 5-10 phút.</p>
        </section>

        {/* Transaction History */}
        <section className="space-y-6 pt-4 pb-12">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-bold tracking-tight text-on-surface">Lịch sử giao dịch</h2>
            <button className="text-primary font-semibold text-sm hover:underline">Xem tất cả</button>
          </div>
          <div className="space-y-px bg-outline-variant/10 rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
            {history.filter(h => h.type === 'WITHDRAW').length === 0 ? (
              <div className="bg-surface-container-lowest p-8 text-center text-on-surface-variant italic">
                Chưa có lịch sử rút tiền
              </div>
            ) : (
              history.filter(h => h.type === 'WITHDRAW').map((tx) => (
                <div key={tx.id} className="bg-surface-container-lowest p-4 flex items-center justify-between group hover:bg-surface-container-low transition-colors cursor-pointer border-t first:border-t-0 border-outline-variant/10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-error-container/40 flex items-center justify-center">
                      <span className="material-symbols-outlined text-error text-lg">call_made</span>
                    </div>
                    <div>
                      <p className="text-base font-bold text-on-surface">{tx.title}</p>
                      <p className="text-sm text-on-surface-variant">
                        {new Date(tx.date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-on-surface">{tx.amount.toLocaleString('vi-VN')}đ</p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${tx.status === 'COMPLETED' ? 'text-primary' : 'text-on-surface-variant opacity-60'}`}>
                      {tx.status === 'COMPLETED' ? 'Thành công' : (tx.status === 'PENDING' ? 'Đang xử lý' : 'Thất bại')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
