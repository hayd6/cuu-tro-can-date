"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerUser } from "@/lib/actions/users";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (!formData.fullName || !formData.contact || !formData.password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        fullName: formData.fullName,
        email: formData.contact, // Currently treating contact as email
        password: formData.password,
      });
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface antialiased min-h-[100dvh] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-container rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary-container rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

      <main className="w-full max-w-md xl:max-w-lg bg-surface-container-lowest sm:bg-transparent rounded-2xl sm:rounded-none shadow-sm sm:shadow-none p-6 sm:p-0 relative z-10">
        {/* Header */}
        <header className="mb-10">
          <button 
            onClick={() => router.back()}
            aria-label="Go back" 
            className="mb-6 w-10 h-10 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container-low transition-colors duration-200 -ml-2"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface mb-2">Tạo tài khoản mới</h1>
          <p className="text-sm font-medium text-on-surface-variant">Tham gia cộng đồng giải cứu thực phẩm</p>
        </header>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && <p className="text-error text-sm font-semibold">{error}</p>}
          
          {/* Full Name Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wider uppercase text-on-surface-variant" htmlFor="fullName">Họ và tên</label>
            <input 
              className="w-full bg-surface-container-highest border-0 rounded-xl px-4 py-3.5 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 text-sm" 
              id="fullName" 
              name="fullName" 
              placeholder="Nhập họ và tên của bạn" 
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          {/* Email/Phone Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wider uppercase text-on-surface-variant" htmlFor="contact">Email</label>
            <input 
              className="w-full bg-surface-container-highest border-0 rounded-xl px-4 py-3.5 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 text-sm" 
              id="contact" 
              name="contact" 
              placeholder="Nhập email" 
              type="email"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wider uppercase text-on-surface-variant" htmlFor="password">Mật khẩu</label>
            <div className="relative">
              <input 
                className="w-full bg-surface-container-highest border-0 rounded-xl px-4 py-3.5 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 text-sm" 
                id="password" 
                name="password" 
                placeholder="Tạo mật khẩu" 
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wider uppercase text-on-surface-variant" htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <div className="relative">
              <input 
                className="w-full bg-surface-container-highest border-0 rounded-xl px-4 py-3.5 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 text-sm" 
                id="confirmPassword" 
                name="confirmPassword" 
                placeholder="Nhập lại mật khẩu" 
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          {/* Terms and Submit Area */}
          <div className="pt-6 flex flex-col gap-5">
            <p className="text-[13px] text-on-surface-variant leading-relaxed text-center px-2">
              Bằng cách đăng ký, bạn đồng ý với <a className="text-primary font-semibold hover:underline decoration-primary/30 underline-offset-2" href="#">Điều khoản & Chính sách</a>
            </p>
            {/* Primary CTA */}
            <button disabled={loading} className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-semibold rounded-xl py-4 flex items-center justify-center gap-2 shadow-[0_12px_32px_-4px_rgba(20,27,43,0.04)] hover:shadow-md transition-all duration-200 active:scale-[0.98] disabled:opacity-70" type="submit">
              <span className="text-base tracking-wide">{loading ? "Đang xử lý..." : "Đăng ký"}</span>
            </button>
          </div>
        </form>

        {/* Footer / Login Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-on-surface-variant">
            Đã có tài khoản? 
            <Link className="text-primary font-bold hover:text-primary-container transition-colors ml-1" href="/login">Đăng nhập</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
