"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { updateUserProfile, uploadAvatar } from "@/lib/actions/users";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const user = session?.user as any;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    // Check size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const res = await uploadAvatar(user.id, base64);
        if (res.success) {
          await update({ image: res.avatarUrl });
          setSuccess("Đã cập nhật ảnh đại diện!");
        }
      };
    } catch (err: any) {
      setError("Lỗi khi tải ảnh: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await updateUserProfile(user.id, formData);
      await update({ name: formData.name, phone: formData.phone });
      setSuccess("Cập nhật thông tin thành công!");
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Không thể cập nhật hồ sơ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-[100dvh]">
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline font-semibold text-lg">Chỉnh sửa hồ sơ</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-error text-sm font-semibold p-3 bg-error-container/20 rounded-lg">{error}</p>}
          {success && <p className="text-primary text-sm font-semibold p-3 bg-primary-container/20 rounded-lg">{success}</p>}

          <section className="flex flex-col items-center mb-8">
            <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-input')?.click()}>
              <img 
                src={user?.avatarUrl || user?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuDjxawOqSKQhMB0xhPirT7jQ8D4lDk39DWEhGbpVRVP-M1nJEY-BAL3BThynaGWhjFvr3_Utb1Qb9vdDUWFbcvgt6CRXW2rWSjOezEbQlRvLnNfbfFwq8eMPZZrRuxsTsIhM2EzfAytsdQCX4dYlBASDKWTNXJ8MrAJ4bz08P5Ya5L375GfSXDvqCPry9ydUg110OS8AwOI7vJuK-ziWJ7h9B4xOcrkoGB8FmfaHMiE2hnFo0vvWEXSp4wF6rLbQwsFEuyxfzsJbVM"}
                alt="Avatar"
                className={`w-24 h-24 rounded-full object-cover border-2 border-outline-variant/20 ${uploading ? 'opacity-50' : ''}`}
              />
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="material-symbols-outlined text-white">{uploading ? 'sync' : 'edit'}</span>
              </div>
              <input 
                id="avatar-input"
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
              />
            </div>
            <p className="text-xs text-on-surface-variant mt-2 font-medium">
              {uploading ? "Đang tải ảnh..." : "Chạm để thay đổi ảnh"}
            </p>
          </section>

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">Tên hiển thị</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-surface-container-highest rounded-xl px-4 py-3.5 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-sm"
                placeholder="Nhập tên của bạn"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">Số điện thoại</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-surface-container-highest rounded-xl px-4 py-3.5 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-sm"
                placeholder="Nhập số điện thoại"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-surface-container-low rounded-xl px-4 py-3.5 text-on-surface-variant text-sm border border-outline-variant/10 opacity-70 cursor-not-allowed"
              />
              <span className="text-[10px] text-outline ml-1 mt-1">Không thể thay đổi email.</span>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/profile/change-password" title="Đổi mật khẩu" className="flex items-center gap-2 p-4 bg-surface-container-lowest border border-outline-variant/10 rounded-xl hover:bg-surface-container-low transition-colors group">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">lock_open</span>
              <span className="flex-1 font-semibold text-sm">Đổi mật khẩu</span>
              <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full mt-6 bg-primary text-on-primary py-4 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>
      </main>
    </div>
  );
}

