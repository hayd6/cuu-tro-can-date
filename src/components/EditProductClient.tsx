"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateProduct, uploadProductImage } from "@/lib/actions/products";

const CATEGORIES = [
  { value: "BAKED_GOODS", label: "Bánh mì/Bánh ngọt" },
  { value: "HOT_FOOD", label: "Cơm hộp/Đồ ăn nóng" },
  { value: "FRUIT_VEG", label: "Trái cây/Rau củ" },
  { value: "VEGETARIAN", label: "Chay" },
  { value: "DRINKS", label: "Đồ uống" },
  { value: "OTHER", label: "Khác" },
];

export default function EditProductClient({ product, storeId }: { product: any, storeId: string }) {
  const router = useRouter();
  
  // Format dates for time inputs
  const startHH = product.pickupStart ? new Date(product.pickupStart).getHours().toString().padStart(2, '0') : "00";
  const startMM = product.pickupStart ? new Date(product.pickupStart).getMinutes().toString().padStart(2, '0') : "00";
  
  const endHH = product.pickupEnd ? new Date(product.pickupEnd).getHours().toString().padStart(2, '0') : "23";
  const endMM = product.pickupEnd ? new Date(product.pickupEnd).getMinutes().toString().padStart(2, '0') : "59";

  const [quantity, setQuantity] = useState(product.quantityTotal);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [form, setForm] = useState({
    name: product.name,
    description: product.description || "",
    originalPrice: product.originalPrice.toString(),
    discountPrice: product.discountPrice.toString(),
    category: product.category,
    pickupStart: `${startHH}:${startMM}`,
    pickupEnd: `${endHH}:${endMM}`,
    expiryDate: new Date(product.expiryTime).toISOString().split('T')[0],
    expiryTime: new Date(product.expiryTime).getHours().toString().padStart(2, '0') + ":" + new Date(product.expiryTime).getMinutes().toString().padStart(2, '0'),
    imageUrl: product.imageUrl || "",
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
          setForm((prev) => ({ ...prev, imageUrl: res.imageUrl as string }));
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
      // Build pickup times
      const [startH, startM] = form.pickupStart.split(":").map(Number);
      const [endH, endM] = form.pickupEnd.split(":").map(Number);

      const pickupStart = new Date();
      pickupStart.setHours(startH, startM, 0, 0);

      const pickupEnd = new Date();
      pickupEnd.setHours(endH, endM, 0, 0);
      if (pickupEnd <= pickupStart) pickupEnd.setDate(pickupEnd.getDate() + 1);

      // Expiry Time Calculation
      const expiryDateObj = new Date(form.expiryDate);
      const [exH, exM] = form.expiryTime.split(":").map(Number);
      expiryDateObj.setHours(exH, exM, 0, 0);

      const res = await updateProduct(product.id, storeId, {
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
        status: 'AVAILABLE' as any,
      });

      if (res.success) {
        router.push("/merchant/listings");
        router.refresh();
      } else {
        alert(res.error || "Có lỗi xảy ra. Vui lòng thử lại.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-screen">
      <nav className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/20">
        <div className="flex items-center justify-between px-4 h-14 w-full max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="hover:bg-surface-container-low transition-colors p-2 rounded-full">
              <span className="material-symbols-outlined text-on-surface">close</span>
            </button>
            <h1 className="text-xl font-bold text-on-surface">Sửa sản phẩm</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="text-primary font-bold hover:bg-primary/5 transition-colors px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </nav>

      <main className="max-w-screen-md mx-auto px-4 py-6 pb-32">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Image Upload */}
          <section>
            <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-outline mb-3">
              Hình ảnh sản phẩm
            </label>
            <div 
              onClick={() => document.getElementById('product-img')?.click()}
              className="aspect-square w-full rounded-2xl bg-surface-container-low flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/50 hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden"
            >
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="Product Preview" className={`w-full h-full object-cover ${isUploading ? 'opacity-50' : ''}`} />
              ) : (
                <>
                  <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isUploading ? "sync" : "add_a_photo"}
                  </span>
                  <p className="text-on-surface-variant text-sm font-medium mt-2">
                    {isUploading ? "Đang tải ảnh..." : "Chạm để tải ảnh lên"}
                  </p>
                </>
              )}
            </div>
            <input 
              type="file" 
              id="product-img" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange}
            />
          </section>

          {/* Name */}
          <section>
            <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-outline mb-3" htmlFor="product_name">
              Tên túi xả hàng/Sản phẩm *
            </label>
            <input
              className="w-full h-12 px-4 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 transition-all text-base placeholder:text-on-surface-variant/40"
              id="product_name"
              placeholder="Ví dụ: Túi bánh mì Artisan cuối ngày"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </section>

          {/* Category */}
          <section>
            <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-outline mb-3">Danh mục</label>
            <select
              className="w-full h-12 px-4 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 transition-all text-base"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </section>

          {/* Quantity */}
          <section>
            <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-outline mb-3">Số lượng tổng cộng</label>
            <div className="flex items-center justify-between h-12 px-2 rounded-xl bg-surface-container-low border border-outline-variant/10">
              <button
                onClick={() => quantity > 1 && setQuantity((q) => q - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-highest transition-colors text-primary"
                type="button"
              >
                <span className="material-symbols-outlined">remove</span>
              </button>
              <span className="text-base font-bold text-on-surface">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-highest transition-colors text-primary"
                type="button"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </section>

          {/* Pricing Section */}
          <section>
            <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-outline mb-3">Chi tiết giá cả *</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-on-surface-variant px-1">Giá gốc (đ)</span>
                <div className="relative">
                  <input
                    className="w-full h-12 pl-4 pr-10 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 transition-all text-base"
                    placeholder="80000"
                    type="number"
                    required
                    value={form.originalPrice}
                    onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-sm">đ</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-tertiary px-1">Giá cứu trợ (đ)</span>
                <div className="relative">
                  <input
                    className="w-full h-12 pl-4 pr-10 rounded-xl bg-tertiary-container/10 border border-tertiary-container/30 focus:border-tertiary-container focus:ring-0 transition-all text-base font-bold text-tertiary"
                    placeholder="30000"
                    type="number"
                    required
                    value={form.discountPrice}
                    onChange={(e) => setForm((f) => ({ ...f, discountPrice: e.target.value }))}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-tertiary font-bold text-sm">đ</span>
                </div>
              </div>
            </div>
          </section>

          {/* Time Picker Section */}
          <section className="bg-surface-container-low/50 p-5 rounded-2xl border border-outline-variant/10">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
              <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-on-surface">Khung giờ lấy hàng</label>
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-medium text-on-surface-variant block text-center">Từ</span>
                <input
                  className="w-full h-11 px-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-center text-sm font-semibold text-primary"
                  type="time"
                  value={form.pickupStart}
                  onChange={(e) => setForm((f) => ({ ...f, pickupStart: e.target.value }))}
                />
              </div>
              <div className="pt-5">
                <span className="material-symbols-outlined text-outline-variant text-lg">arrow_forward</span>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-medium text-on-surface-variant block text-center">Đến</span>
                <input
                  className="w-full h-11 px-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-center text-sm font-semibold text-primary"
                  type="time"
                  value={form.pickupEnd}
                  onChange={(e) => setForm((f) => ({ ...f, pickupEnd: e.target.value }))}
                />
              </div>
            </div>
          </section>

          {/* Expiry Date Section */}
          <section className="bg-tertiary-container/5 p-5 rounded-2xl border border-tertiary/20">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-tertiary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>event_available</span>
              <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-tertiary">Thời hạn cứu trợ (Hết hạn)</label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-medium text-on-surface-variant block">Ngày hết hạn</span>
                <input
                  className="w-full h-11 px-3 rounded-lg bg-white border border-outline-variant/20 text-sm font-semibold text-tertiary"
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-medium text-on-surface-variant block">Giờ hết hạn</span>
                <input
                  className="w-full h-11 px-3 rounded-lg bg-white border border-outline-variant/20 text-sm font-semibold text-tertiary"
                  type="time"
                  value={form.expiryTime}
                  onChange={(e) => setForm((f) => ({ ...f, expiryTime: e.target.value }))}
                />
              </div>
            </div>
          </section>

          {/* Description */}
          <section>
            <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-outline mb-3" htmlFor="description">
              Mô tả chi tiết
            </label>
            <textarea
              className="w-full p-4 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 transition-all text-base placeholder:text-on-surface-variant/40 resize-none min-h-[120px]"
              id="description"
              placeholder="Mô tả thành phần, tình trạng thực phẩm, lưu ý dị ứng..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            ></textarea>
          </section>
        </form>
      </main>

      {/* Bottom Action Area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface/90 backdrop-blur-md border-t border-outline-variant/10">
        <div className="max-w-screen-md mx-auto">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-14 bg-primary text-white font-bold text-base rounded-2xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? "Đang xử lý..." : (product.status !== 'AVAILABLE' || new Date(product.expiryTime) <= new Date() ? "Lưu & Đăng bán lại" : "Lưu thay đổi")}
          </button>
        </div>
      </div>
    </div>
  );
}
