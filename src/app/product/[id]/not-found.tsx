import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-surface px-8 text-center">
      {/* Premium Gradient Icon */}
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-8 shadow-inner">
        <span className="material-symbols-outlined text-5xl text-slate-400">inventory_2</span>
      </div>
      
      <h2 className="text-2xl font-black text-on-surface mb-3 tracking-tight">Sản phẩm không tồn tại</h2>
      <p className="text-on-surface-variant text-sm leading-relaxed mb-10 max-w-[280px]">
        Có vẻ như đợt túi mù này đã kết thúc hoặc được cửa hàng gỡ bỏ. Hãy cùng tìm kiếm những lựa chọn giải cứu khác hấp dẫn không kém nhé!
      </p>

      <div className="w-full max-w-xs space-y-4">
        <Link
          href="/list"
          className="block w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-transform"
        >
          Tiếp tục giải cứu đồ ăn
        </Link>
        <Link
          href="/orders"
          className="block w-full bg-surface-container-high text-on-surface font-bold py-4 rounded-2xl active:scale-95 transition-transform"
        >
          Quay lại đơn hàng
        </Link>
      </div>
    </div>
  );
}
