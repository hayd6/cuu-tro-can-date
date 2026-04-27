"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createProduct, uploadProductImage } from "@/lib/actions/products";

const DEMO_STORE_EMAIL = "tiemanxanh@cuutrocandate.vn";

const CATEGORIES = [
  { value: "BAKED_GOODS", label: "Bánh mì/Bánh ngọt" },
  { value: "HOT_FOOD", label: "Cơm hộp/Đồ ăn nóng" },
  { value: "FRUIT_VEG", label: "Trái cây/Rau củ" },
  { value: "VEGETARIAN", label: "Chay" },
  { value: "DRINKS", label: "Đồ uống" },
  { value: "OTHER", label: "Khác" },
];

export default function CreateProductPage() {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    originalPrice: "",
    discountPrice: "",
    category: "BAKED_GOODS",
    pickupStart: "19:00",
    pickupEnd: "21:00",
    expiryDate: new Date().toISOString().split('T')[0],
    expiryTime: "21:00",
    imageUrl: "",
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.");
      return;
    }

    try {
      setIsUploading(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const res = await uploadProductImage(base64);
        if (res.success) {
          setForm((prev) => ({ ...prev, imageUrl: res.imageUrl }));
        }
      };
    } catch (err: any) {
      alert("Lỗi tải ảnh: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.originalPrice || !form.discountPrice) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the demo store ID
      const res = await fetch("/api/merchant/store-id");
      const { storeId } = await res.json();

      if (!storeId) {
        alert("Không tìm thấy cửa hàng");
        setIsSubmitting(false);
        return;
      }

      // Build pickup times for today
      const today = new Date();
      const [startH, startM] = form.pickupStart.split(":").map(Number);
      const [endH, endM] = form.pickupEnd.split(":").map(Number);

      const pickupStart = new Date(today);
      pickupStart.setHours(startH, startM, 0, 0);

      const pickupEnd = new Date(today);
      pickupEnd.setHours(endH, endM, 0, 0);
      if (pickupEnd <= pickupStart) pickupEnd.setDate(pickupEnd.getDate() + 1);

      // Expiry Time Calculation
      const expiryDateObj = new Date(form.expiryDate);
      const [exH, exM] = form.expiryTime.split(":").map(Number);
      expiryDateObj.setHours(exH, exM, 0, 0);

      await createProduct({
        storeId,
        name: form.name,
        description: form.description || undefined,
        imageUrl: form.imageUrl || undefined,
        category: form.category,
        originalPrice: parseInt(form.originalPrice),
        discountPrice: parseInt(form.discountPrice),
        quantityTotal: quantity,
        expiryTime: expiryDateObj,
        pickupStart,
        pickupEnd,
      });

      router.push("/merchant");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50/50 text-on-surface font-body antialiased min-h-screen">
      {/* TopAppBar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex items-center justify-between px-5 h-16 w-full max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="hover:bg-slate-100 transition-colors p-2 rounded-full">
              <span className="material-symbols-outlined text-on-surface-variant text-xl">close</span>
            </button>
            <div>
              <h1 className="text-xl font-black text-on-surface tracking-tight">Đăng sản phẩm mới</h1>
              <p className="text-[11px] text-on-surface-variant/80 font-medium hidden md:block">Điền thông tin chi tiết để giải cứu thực phẩm của bạn nhanh nhất.</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="text-emerald-800 font-bold hover:bg-emerald-50 transition-colors px-5 py-2 rounded-xl disabled:opacity-50 text-sm border border-emerald-800/10"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-5 lg:px-8 py-8">
        <form className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start" onSubmit={handleSubmit}>
          
          {/* LEFT COLUMN: Image Upload */}
          <div className="md:col-span-5 lg:col-span-5">
            <div 
              onClick={() => document.getElementById('product-img')?.click()}
              className="aspect-square w-full rounded-[24px] bg-white flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-emerald-600/50 transition-all cursor-pointer relative overflow-hidden shadow-sm"
            >
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="Product Preview" className={`w-full h-full object-cover ${isUploading ? 'opacity-50' : ''}`} />
              ) : (
                <div className="flex flex-col items-center text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-800 mb-4">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {isUploading ? "sync" : "add_a_photo"}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-on-surface mb-1">Tải ảnh sản phẩm</h3>
                  <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed">
                    {isUploading ? "Đang tải ảnh..." : "Kéo thả hoặc nhấp để chọn ảnh. Định dạng JPG, PNG (Tối đa 5MB)"}
                  </p>
                </div>
              )}
            </div>
            <input 
              type="file" 
              id="product-img" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange}
            />
          </div>

          {/* RIGHT COLUMN: Form Inputs */}
          <div className="md:col-span-7 lg:col-span-7 space-y-5">
            {/* Product Name */}
            <div>
              <label className="block text-[11px] font-bold tracking-wider uppercase text-on-surface-variant mb-2" htmlFor="product_name">
                Tên sản phẩm *
              </label>
              <input
                className="w-full h-12 px-4 rounded-xl bg-slate-100/80 border border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-800/10 focus:border-emerald-800/20 transition-all text-sm font-medium placeholder:text-on-surface-variant/40"
                id="product_name"
                placeholder="Ví dụ: Bánh Mì Hoa Cúc - 500g"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] font-bold tracking-wider uppercase text-on-surface-variant mb-2">
                Danh mục
              </label>
              <div className="relative">
                <select
                  className="w-full h-12 px-4 pr-10 rounded-xl bg-slate-100/80 border border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-800/10 focus:border-emerald-800/20 transition-all text-sm font-medium text-on-surface appearance-none"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Row 2: Quantity */}
            <div>
              <label className="block text-[11px] font-bold tracking-wider uppercase text-on-surface-variant mb-2">Số lượng *</label>
              <div className="flex items-center justify-between h-12 px-2 rounded-xl bg-slate-100/80 border border-slate-200/50">
                <button
                  onClick={() => quantity > 1 && setQuantity((q) => q - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-on-surface"
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">remove</span>
                </button>
                <span className="text-sm font-bold text-on-surface">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-on-surface"
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
              </div>
            </div>

            {/* Row 3: Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold tracking-wider uppercase text-on-surface-variant mb-2">Giá gốc (VNĐ)</label>
                <div className="relative">
                  <input
                    className="w-full h-12 pl-4 pr-12 rounded-xl bg-slate-100/80 border border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-800/10 focus:border-emerald-800/20 transition-all text-sm font-medium"
                    placeholder="0"
                    type="number"
                    required
                    value={form.originalPrice}
                    onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-on-surface-variant/70">VNĐ</span>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-wider uppercase text-on-surface-variant mb-2">Giá giải cứu *</label>
                <div className="relative">
                  <input
                    className="w-full h-12 pl-4 pr-12 rounded-xl bg-slate-100/80 border border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-800/10 focus:border-emerald-800/20 transition-all text-sm font-medium"
                    placeholder="0"
                    type="number"
                    required
                    value={form.discountPrice}
                    onChange={(e) => setForm((f) => ({ ...f, discountPrice: e.target.value }))}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-on-surface-variant/70">VNĐ</span>
                </div>
              </div>
            </div>

            {/* Khung giờ lấy hàng */}
            <div className="bg-slate-100/50 p-4 rounded-xl border border-slate-200/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-emerald-800 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                <label className="text-[11px] font-bold tracking-wider uppercase text-on-surface">Khung giờ lấy hàng</label>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <input
                  className="w-full h-10 px-2 rounded-lg bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-800/10 focus:border-emerald-800/20 text-center text-xs font-semibold text-emerald-800"
                  type="time"
                  value={form.pickupStart}
                  onChange={(e) => setForm((f) => ({ ...f, pickupStart: e.target.value }))}
                />
                <span className="material-symbols-outlined text-on-surface-variant text-base">arrow_forward</span>
                <input
                  className="w-full h-10 px-2 rounded-lg bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-800/10 focus:border-emerald-800/20 text-center text-xs font-semibold text-emerald-800"
                  type="time"
                  value={form.pickupEnd}
                  onChange={(e) => setForm((f) => ({ ...f, pickupEnd: e.target.value }))}
                />
              </div>
            </div>

            {/* Thời hạn cứu trợ */}
            <div className="bg-slate-100/50 p-4 rounded-xl border border-slate-200/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-emerald-800 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>event_available</span>
                <label className="text-[11px] font-bold tracking-wider uppercase text-on-surface">Thời hạn cứu trợ (Hết hạn)</label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="w-full h-10 px-3 rounded-lg bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-800/10 focus:border-emerald-800/20 text-xs font-semibold text-emerald-800"
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
                />
                <input
                  className="w-full h-10 px-3 rounded-lg bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-800/10 focus:border-emerald-800/20 text-xs font-semibold text-emerald-800"
                  type="time"
                  value={form.expiryTime}
                  onChange={(e) => setForm((f) => ({ ...f, expiryTime: e.target.value }))}
                />
              </div>
            </div>


            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold tracking-wider uppercase text-on-surface-variant mb-2" htmlFor="description">
                Mô tả chi tiết
              </label>
              <textarea
                className="w-full p-4 rounded-xl bg-slate-100/80 border border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-emerald-800/10 focus:border-emerald-800/20 transition-all text-sm font-medium placeholder:text-on-surface-variant/40 resize-none min-h-[140px]"
                id="description"
                placeholder="Mô tả trạng thái sản phẩm, hạn sử dụng chính xác (Vd: HSD đến 20:00 hôm nay)..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-800/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? "Đang đăng bán..." : "Đăng bán ngay 🚀"}
              </button>
              <p className="text-[10px] text-center text-on-surface-variant/60 mt-3 leading-relaxed">
                Bằng cách nhấn "Đăng bán ngay", bạn đồng ý rằng thông tin sản phẩm là chính xác và tuân thủ các quy định về an toàn thực phẩm.
              </p>
            </div>
          </div>

        </form>

        {/* Tip Section */}
        <div className="mt-12 bg-emerald-50/30 border border-emerald-600/10 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center text-emerald-800">
            <span className="material-symbols-outlined text-lg">info</span>
          </div>
          <div>
            <h4 className="text-xs font-black text-emerald-900 mb-1">Mẹo nhỏ cho người bán</h4>
            <p className="text-[11px] text-emerald-800/80 leading-relaxed font-medium">Sản phẩm có giá giảm trên 50% thường được "giải cứu" chỉ trong vòng 15 phút. Hãy đảm bảo hình ảnh rõ nét để thu hút khách hàng nhanh hơn.</p>
          </div>
        </div>

      </main>
    </div>
  );
}

