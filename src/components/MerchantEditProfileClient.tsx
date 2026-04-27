"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { updateStoreProfile } from "@/lib/actions/stores";
import { uploadAvatar } from "@/lib/actions/users";
import LocationPickerModal from "./LocationPickerModal";

interface MerchantEditProfileClientProps {
  store: {
    id: string;
    name: string;
    address: string;
    imageUrl: string | null;
    lat: number | null;
    lng: number | null;
    owner: {
      phone: string | null;
    };
  };
}

export default function MerchantEditProfileClient({ store }: MerchantEditProfileClientProps) {
  const router = useRouter();
  const { data: session, update } = useSession();
  const user = session?.user as any;

  const [formData, setFormData] = useState({
    name: store.name || "",
    address: store.address || "",
    phone: store.owner.phone || "",
    lat: store.lat || undefined,
    lng: store.lng || undefined,
  });

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    setFormData(prev => ({
      ...prev,
      lat,
      lng,
      address: address || prev.address
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const res = await uploadAvatar(user.id, base64);
        if (res.success) {
          await update({ image: res.avatarUrl });
          setSuccess("Đã cập nhật logo cửa hàng!");
          router.refresh();
        }
      };
    } catch (err: any) {
      setError("Lỗi khi tải ảnh: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!store.id || !user?.id) return;
    
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await updateStoreProfile(store.id, formData);
      await update({ name: formData.name, phone: formData.phone });
      setSuccess("Cập nhật thông tin thành công!");
      setTimeout(() => {
        router.push("/merchant/profile");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Không thể cập nhật hồ sơ cửa hàng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-[100dvh] pb-12">
      <header className="w-full top-0 sticky z-50 bg-background/80 backdrop-blur-md border-b border-surface-container">
        <div className="flex items-center justify-between px-6 py-4 w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="text-primary hover:bg-primary/10 transition-colors p-2 rounded-full active:scale-95 duration-150 ease-in-out"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-['Inter'] font-semibold tracking-tight text-on-surface text-lg">Sửa hồ sơ cửa hàng</h1>
          </div>
          <button 
            onClick={() => handleSubmit()}
            disabled={loading || uploading}
            className="text-primary font-bold hover:bg-primary/10 px-4 py-2 rounded-xl transition-colors active:scale-95 duration-150 ease-in-out disabled:opacity-50"
          >
            Lưu
          </button>
        </div>
      </header>

      <main className="desktop-page-shell-tight px-4 lg:px-6 xl:px-8 py-8 animate-in fade-in duration-300 slide-in-from-bottom-4">
        <div className="max-w-5xl mx-auto">
          {error && <p className="text-error text-sm font-semibold p-3 bg-error-container/20 rounded-lg mb-6">{error}</p>}
          {success && <p className="text-primary text-sm font-semibold p-3 bg-primary-container/20 rounded-lg mb-6">{success}</p>}

          <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-12">
            
            {/* LEFT COLUMN: Logo */}
            <div className="w-full lg:w-1/3 flex-shrink-0 flex flex-col items-center lg:pt-4">
              <section className="flex flex-col items-center gap-6 w-full">
          <div className="relative group cursor-pointer" onClick={() => document.getElementById('store-logo-input')?.click()}>
            <div className="w-32 h-32 rounded-full overflow-hidden bg-surface-container-highest flex items-center justify-center ring-4 ring-surface-container-low shadow-sm">
              <img 
                alt="Store Logo" 
                className={`w-full h-full object-cover ${uploading ? 'opacity-50' : ''}`}
                src={store.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200"}
              />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="material-symbols-outlined text-white">{uploading ? 'sync' : 'edit'}</span>
            </div>
            <input 
              id="store-logo-input"
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange}
            />
          </div>
          <div className="text-center">
            <h2 className="text-on-surface font-semibold text-lg">Logo cửa hàng</h2>
            <p className="text-on-surface-variant text-sm mt-1">
              {uploading ? "Đang tải ảnh..." : "Dung lượng tối đa 5MB. Định dạng: JPG, PNG"}
            </p>
          </div>
        </section>
        </div>

        {/* RIGHT COLUMN: Form Fields */}
        <div className="w-full lg:w-2/3 space-y-8 lg:bg-surface-container-lowest lg:p-8 lg:rounded-[32px] lg:shadow-sm lg:border lg:border-outline-variant/10">
          <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Tên cửa hàng</label>
            <div className="relative group">
              <input 
                className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium" 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên cửa hàng"
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">store</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Địa chỉ</label>
              <button 
                type="button"
                onClick={() => setIsMapOpen(true)}
                className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline"
              >
                <span className="material-symbols-outlined text-xs">map</span>
                CHỌN TRÊN BẢN ĐỒ
              </button>
            </div>
            <div className="relative group">
              <textarea 
                className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium resize-none pr-12" 
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Nhập địa chỉ cửa hàng hoặc chọn từ bản đồ"
              />
              <span className="material-symbols-outlined absolute right-4 top-4 text-on-surface-variant/40">location_on</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Giờ hoạt động</label>
              <div className="flex items-center gap-2 bg-surface-container-highest rounded-xl px-4 py-3 shadow-sm border border-transparent focus-within:ring-2 focus-within:ring-primary/20 transition-all group opacity-70">
                <div className="flex-1 flex items-center justify-center gap-2">
                  <input 
                    className="bg-transparent border-none text-on-surface focus:ring-0 outline-none font-bold text-center w-24 p-0 whitespace-nowrap" 
                    type="time" 
                    defaultValue="08:00"
                    disabled
                  />
                  <span className="text-on-surface-variant/40 font-bold text-sm">đến</span>
                  <input 
                    className="bg-transparent border-none text-on-surface focus:ring-0 outline-none font-bold text-center w-24 p-0 whitespace-nowrap" 
                    type="time" 
                    defaultValue="22:00"
                    disabled
                  />
                </div>
                <span className="material-symbols-outlined text-on-surface-variant/40 group-focus-within:text-primary transition-colors">schedule</span>
              </div>
              <p className="text-[10px] text-on-surface-variant pt-1 pl-1">Tính năng đang cập nhật</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Hotline</label>
              <div className="relative">
                <input 
                  className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium" 
                  placeholder="090x xxx xxx" 
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">call</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Địa chỉ email</label>
            <div className="relative group">
              <input 
                className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-4 text-on-surface-variant opacity-70 cursor-not-allowed outline-none font-medium" 
                placeholder="email@example.com" 
                type="email"
                defaultValue={user?.email || ""}
                disabled
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">mail</span>
            </div>
             <p className="text-[10px] text-on-surface-variant pt-1 pl-1">Email đăng nhập không thể thay đổi</p>
          </div>
          
            <button type="submit" className="hidden">Submit hidden</button>
          </form>

          <div className="space-y-4 pt-2">
            <div className="bg-surface-container-low lg:bg-surface p-2 rounded-2xl border border-outline-variant/10 shadow-sm">
              <Link href="/profile/change-password" className="flex items-center justify-between bg-surface-container-lowest p-4 rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                  <div>
                    <p className="font-semibold text-on-surface">Thay đổi mật khẩu</p>
                    <p className="text-xs text-on-surface-variant">Cập nhật mật khẩu bảo mật của bạn</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant/40">chevron_right</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

      <LocationPickerModal 
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelect={handleLocationSelect}
        initialCenter={formData.lat && formData.lng ? { lat: formData.lat, lng: formData.lng } : undefined}
      />
    </div>
  );
}
