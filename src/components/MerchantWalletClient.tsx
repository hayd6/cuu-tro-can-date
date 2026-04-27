"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface Transaction {
  id: string;
  type: string;
  title: string;
  amount: number;
  date: Date | string;
  status: string;
}

interface MerchantWalletClientProps {
  balance: number;
  history: Transaction[];
  stats: {
    monthlyRevenue: number;
    completedOrders: number;
    avgOrderValue: number;
    growth: number;
  };
  chartData: { label: string; height: string; value: number }[];
  timeframe?: "week" | "month";
}

export default function MerchantWalletClient({ balance, history, stats, chartData, timeframe = "week" }: MerchantWalletClientProps) {
  const router = useRouter();

  return (
    <div className="bg-surface text-on-surface font-body min-h-[100dvh]">
      {/* TopAppBar */}
      <header className="sticky top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-surface-container">
        <div className="desktop-page-shell-tight flex items-center px-4 lg:px-6 h-16 w-full justify-start gap-2">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-surface-container-high transition-colors flex items-center justify-center text-on-surface-variant rounded-full active:scale-95"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-['Inter'] font-semibold tracking-tight text-xl text-primary">Thống Kê Doanh Thu</h1>
        </div>
      </header>

      <main className="desktop-page-shell-tight px-4 lg:px-6 xl:px-8 pt-6 lg:pt-8 pb-32 lg:pb-12">
        <div className="flex flex-col gap-6 lg:gap-8 max-w-5xl mx-auto">
        
        {/* Tổng quan tài chính */}
        <section className="bg-surface-container-highest lg:bg-[#0ca35b] rounded-2xl p-6 lg:p-8 shadow-sm relative overflow-hidden group border border-outline-variant/10 lg:border-none">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between h-full gap-6">
            <div className="text-left">
              <h2 className="text-on-surface-variant lg:text-white/90 font-semibold text-xs tracking-wider uppercase mb-1">Số dư khả dụng</h2>
              <div className="text-[2.25rem] lg:text-[2.5rem] font-bold text-on-surface lg:text-white tracking-tight mb-6 lg:mb-2">
                {balance.toLocaleString('vi-VN')}<span className="text-xl lg:text-2xl ml-1 text-on-surface-variant lg:text-white">đ</span>
              </div>
              <div className="hidden lg:flex items-center gap-1.5 text-white/80 text-[11px] bg-black/10 w-max px-3 py-1.5 rounded-full font-medium">
                 <span className="material-symbols-outlined text-[14px]">info</span>
                 Tiền về sau 24h hoàn thành đơn
              </div>
            </div>
            <Link 
              href="/merchant/wallet/withdraw"
              className="w-full lg:w-auto bg-gradient-to-br from-primary to-primary-container lg:bg-none lg:bg-white text-white lg:text-[#0ca35b] lg:px-8 py-3 lg:py-3 rounded-xl lg:rounded-lg font-bold tracking-wide hover:opacity-90 transition-opacity flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
              Rút tiền
            </Link>
          </div>
          {/* Decorative gradient */}
          <div className="absolute lg:hidden -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-colors duration-500"></div>
        </section>

        {/* Chỉ số KPI */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest rounded-2xl p-5 relative shadow-sm border border-outline-variant/10">
            <div className="flex items-center gap-2 text-on-surface-variant mb-2">
              <span className="material-symbols-outlined text-lg">trending_up</span>
              <h3 className="text-xs font-semibold uppercase tracking-wider">Doanh thu tháng</h3>
            </div>
            <div className="text-xl font-bold text-on-surface">
              {stats.monthlyRevenue >= 1000000 
                ? `${(stats.monthlyRevenue / 1000000).toFixed(1)}M` 
                : stats.monthlyRevenue.toLocaleString('vi-VN')}
              <span className="text-sm font-medium ml-1 text-on-surface-variant">VNĐ</span>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-2xl p-5 relative shadow-sm border border-outline-variant/10">
            <div className="flex items-center gap-2 text-on-surface-variant mb-2">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <h3 className="text-xs font-semibold uppercase tracking-wider">Đơn hoàn thành</h3>
            </div>
            <div className="text-xl font-bold text-on-surface">{stats.completedOrders}<span className="text-sm font-medium ml-1 text-on-surface-variant">đơn</span></div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-2xl p-5 relative shadow-sm border border-outline-variant/10">
            <div className="flex items-center gap-2 text-on-surface-variant mb-2">
              <span className="material-symbols-outlined text-lg">receipt</span>
              <h3 className="text-xs font-semibold uppercase tracking-wider">Trung bình đơn</h3>
            </div>
            <div className="text-xl font-bold text-on-surface">{stats.avgOrderValue.toLocaleString('vi-VN')}<span className="text-sm font-medium ml-1 text-on-surface-variant">đ</span></div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-2xl p-5 relative shadow-sm border border-outline-variant/10">
            <div className="flex items-center gap-2 text-primary mb-2">
              <span className="material-symbols-outlined text-lg">arrow_upward</span>
              <h3 className="text-xs font-semibold uppercase tracking-wider">Tăng trưởng</h3>
            </div>
            <div className="text-xl font-bold text-primary">+{stats.growth}%</div>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 w-full">
          {/* Biểu đồ doanh thu (Real Data) */}
          <section className="w-full lg:w-[60%] bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10 flex flex-col lg:h-[420px]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-lg font-bold text-on-surface">Doanh thu {timeframe === 'month' ? '30' : '7'} ngày qua</h2>
                <p className="text-xs text-on-surface-variant mt-1">Thống kê từ {new Date(Date.now() - (timeframe === 'month' ? 29 : 6) * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')} - {new Date().toLocaleDateString('vi-VN')}</p>
              </div>
              <div className="hidden lg:flex bg-surface-container-high rounded-full p-1">
                <button 
                  onClick={() => window.location.search = '?timeframe=week'}
                  className={`px-3 py-1 text-[10px] font-bold rounded-full transition-colors ${timeframe === 'week' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Theo Tuần
                </button>
                <button 
                  onClick={() => window.location.search = '?timeframe=month'}
                  className={`px-3 py-1 text-[10px] font-bold rounded-full transition-colors ${timeframe === 'month' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Theo Tháng
                </button>
              </div>
            </div>
            <div className="flex-1 flex items-end justify-between gap-2 px-2 mt-auto">
            {chartData.map((col, idx) => (
              <div key={idx} className="w-full flex flex-col items-center gap-2 group cursor-pointer relative">
                {/* Tooltip on hover */}
                {col.value > 0 && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
                    {col.value.toLocaleString('vi-VN')}đ
                  </div>
                )}
                <div 
                  className="w-full bg-surface-container-highest rounded-t-md relative overflow-hidden group-hover:bg-primary-container/30 transition-colors"
                  style={{ height: col.height }}
                >
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-primary-container rounded-t-md h-full opacity-80 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <span className="text-[10px] font-medium text-on-surface-variant group-hover:text-primary transition-colors">{col.label}</span>
              </div>
            ))}
            </div>
          </section>

          {/* Lịch sử giao dịch */}
          <section className="w-full lg:w-[40%] bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10 flex flex-col lg:h-[420px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-on-surface">Lịch sử giao dịch</h2>
              <button className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors">
                 <span className="material-symbols-outlined text-sm">history</span>
              </button>
            </div>
            
            <div className="space-y-3 lg:overflow-y-auto lg:pr-2 lg:no-scrollbar flex-1">
              {history.length === 0 ? (
                <p className="text-center py-8 text-on-surface-variant italic text-sm">Chưa có giao dịch nào</p>
            ) : (
              history.map((tx) => (
                <div key={tx.id} className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between shadow-sm border border-outline-variant/10">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'INCOME' ? 'bg-primary/10 text-primary' : 'bg-error-container/40 text-on-error-container'}`}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {tx.type === 'INCOME' ? 'add_circle' : 'account_balance'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-on-surface">{tx.title}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {new Date(tx.date).toLocaleDateString('vi-VN')} {new Date(tx.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${tx.type === 'INCOME' ? 'text-primary' : 'text-on-surface'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('vi-VN')}đ
                    </p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${tx.status === 'COMPLETED' ? 'text-primary' : 'text-on-surface-variant opacity-60'}`}>
                      {tx.status === 'COMPLETED' ? 'Hoàn thành' : (tx.status === 'PENDING' ? 'Đang xử lý' : 'Thất bại')}
                    </p>
                  </div>
                </div>
              ))
            )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-outline-variant/10 text-center">
              <Link href="/merchant/wallet/history" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider hover:text-primary transition-colors">
                XEM TẤT CẢ GIAO DỊCH
              </Link>
            </div>
          </section>
        </div>
        </div>
      </main>
    </div>
  );
}
