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
    <div className="bg-surface text-on-surface font-body antialiased min-h-[calc(100vh-var(--header-height))] overflow-y-auto">
      {/* Top Navigation Bar - Hidden on Desktop */}
      <nav className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/20 lg:hidden">
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

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-10 animate-in fade-in duration-300">
        {/* Desktop Title & Actions */}
        <div className="hidden lg:flex items-center justify-between border-b border-outline-variant/10 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Sửa sản phẩm</h1>
            <p className="text-sm text-on-surface-variant mt-1">Cập nhật thông tin chi tiết cho túi xả hàng của bạn</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="bg-surface-container-low text-on-surface hover:bg-surface-container-high font-bold px-6 py-3 rounded-xl transition-all active:scale-98"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-primary to-primary-container text-white font-bold px-8 py-3 rounded-xl shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
<<<<<<< HEAD
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Image Upload (lg:col-span-4) */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
=======
          <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Image Upload (md:col-span-4 lg:col-span-4) */}
            <div className="md:col-span-4 lg:col-span-4 md:sticky md:top-24 lg:sticky lg:top-24 space-y-4">
>>>>>>> feature/tablet
              <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-outline mb-1">
                Hình ảnh sản phẩm
              </label>
              <div 
                onClick={() => document.getElementById('product-img')?.click()}
                className="aspect-square w-full rounded-2xl bg-surface-container-low flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/50 hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden group shadow-sm"
              >
                {form.imageUrl ? (
                  <>
                    <img src={form.imageUrl} alt="Product Preview" className={`w-full h-full object-cover ${isUploading ? 'opacity-50' : 'group-hover:scale-105 transition-transform duration-300'}`} />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-white text-3xl">add_a_photo</span>
                      <span className="text-white text-xs font-bold mt-2">Thay đổi ảnh</span>
                    </div>
                  </>
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
              <p className="text-[10px] text-on-surface-variant/60 text-center">Nên chọn ảnh vuông, dung lượng tối đa 5MB</p>
            </div>

<<<<<<< HEAD
            {/* Right Column: Form Fields (lg:col-span-8) */}
            <div className="lg:col-span-8 space-y-6">
=======
            {/* Right Column: Form Fields (md:col-span-8 lg:col-span-8) */}
            <div className="md:col-span-8 lg:col-span-8 space-y-6">
>>>>>>> feature/tablet
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-outline mb-3" htmlFor="product_name">
                    Tên túi xả hàng/Sản phẩm *
                  </label>
                  <input
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/10 focus:ring-2 focus:ring-primary/20 transition-all text-base placeholder:text-on-surface-variant/40"
                    id="product_name"
                    placeholder="Ví dụ: Túi bánh mì Artisan cuối ngày"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-outline mb-3">Danh mục</label>
                  <select
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/10 focus:ring-2 focus:ring-primary/20 transition-all text-base font-semibold"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-outline mb-3">Số lượng tổng cộng</label>
                  <div className="flex items-center justify-between h-12 px-2 rounded-xl bg-surface-container-low border border-outline-variant/10">
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-highest transition-colors text-primary bg-white shadow-sm"
                      type="button"
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <span className="text-base font-bold text-on-surface">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-highest transition-colors text-primary bg-white shadow-sm"
                      type="button"
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>

                  </div>
                </div>

                {/* Pricing Section */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-outline mb-3">Chi tiết giá cả *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-medium text-on-surface-variant px-1">Giá gốc</span>
                      <div className="relative">
                        <input
                          className="w-full h-12 pl-4 pr-10 rounded-xl bg-surface-container-low border border-outline-variant/10 focus:ring-2 focus:ring-primary/20 transition-all text-base"
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
                      <span className="text-[11px] font-medium text-tertiary px-1 font-bold">Giá cứu trợ</span>
                      <div className="relative">
                        <input
                          className="w-full h-12 pl-4 pr-10 rounded-xl bg-tertiary-container/5 border border-tertiary/20 focus:border-tertiary focus:ring-0 transition-all text-base font-extrabold text-tertiary"
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
                </div>

                {/* Time Picker Section */}
                <div className="bg-surface-container-low/50 p-5 rounded-2xl border border-outline-variant/10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                    <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-on-surface">Khung giờ lấy hàng</label>
                  </div>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-medium text-on-surface-variant block text-center">Từ</span>
                      <input
                        className="w-full h-11 px-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-center text-sm font-bold text-primary"
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
                        className="w-full h-11 px-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-center text-sm font-bold text-primary"
                        type="time"
                        value={form.pickupEnd}
                        onChange={(e) => setForm((f) => ({ ...f, pickupEnd: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Expiry Date Section */}
                <div className="bg-tertiary-container/5 p-5 rounded-2xl border border-tertiary/20">
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
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-outline mb-3" htmlFor="description">
                    Mô tả chi tiết
                  </label>
                  <textarea
                    className="w-full p-4 rounded-xl bg-surface-container-low border border-outline-variant/10 focus:ring-2 focus:ring-primary/20 transition-all text-base placeholder:text-on-surface-variant/40 resize-none min-h-[120px]"
                    id="description"
                    placeholder="Mô tả thành phần, tình trạng thực phẩm, lưu ý dị ứng..."
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  ></textarea>
                </div>
              </div>
            </div>

          </div>
        </form>
      </main>

      {/* Mobile Bottom Action Area (lg:hidden) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface/90 backdrop-blur-md border-t border-outline-variant/10 lg:hidden z-40">
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
