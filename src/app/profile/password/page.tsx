"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { changeUserPassword } from "@/lib/actions/users";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!(session?.user as any)?.id) {
      setError("Vui lòng đăng nhập để thực hiện thay đổi.");
      return;
    }

    if (newPass.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPass !== confirmPass) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      await changeUserPassword((session!.user as any).id, { oldPass, newPass });
      setSuccess(true);
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen text-on-surface pb-24">
      {/* Header */}
      <header className="flex items-center px-4 h-16 border-b border-surface-container-high sticky top-0 bg-surface/80 backdrop-blur-md z-40">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center font-bold text-lg pr-10">Đổi mật khẩu</h1>
      </header>

      <main className="desktop-page-shell-tight px-4 lg:px-6 xl:px-8 py-10 space-y-10">
        {/* Icon & Message */}
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 bg-primary-container/20 rounded-2xl flex items-center justify-center text-primary rotate-[-10deg] shadow-lg shadow-primary/5">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              published_with_changes
            </span>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-on-surface">Bảo vệ tài khoản của bạn</h2>
            <p className="text-on-surface-variant text-sm px-4">
              Sử dụng ít nhất 6 ký tự để mật khẩu mạnh hơn.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-4 bg-error-container/10 border border-error/20 rounded-xl text-error text-sm font-medium text-center animate-shake">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-primary-container/20 border border-primary/20 rounded-xl text-primary text-sm font-bold text-center animate-bounce-short">
              Mật khẩu đã được cập nhật thành công!
            </div>
          )}

          <div className="space-y-6">
            {/* Old Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Mật khẩu cũ</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant opacity-60">lock</span>
                <input 
                  type={showPass ? "text" : "password"}
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  className="w-full h-14 pl-12 pr-12 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-primary focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/50 shadow-sm"
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Mật khẩu mới</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant opacity-60">lock_reset</span>
                <input 
                  type={showPass ? "text" : "password"}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full h-14 pl-12 pr-12 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-primary focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/50 shadow-sm"
                  placeholder="Nhập mật khẩu mới"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">{showPass ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Xác nhận mật khẩu mới</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant opacity-60">verified_user</span>
                <input 
                  type={showPass ? "text" : "password"}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-primary focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/50 shadow-sm"
                  placeholder="Nhập lại mật khẩu mới"
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-primary text-on-primary font-bold rounded-2xl shadow-[0_8px_20px_-4px_rgba(0,108,73,0.3)] hover:shadow-[0_12px_28px_-6px_rgba(0,108,73,0.4)] transition-all active:scale-95 disabled:opacity-70 mt-4"
          >
            {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
          </button>
        </form>
      </main>
    </div>
  );
}
