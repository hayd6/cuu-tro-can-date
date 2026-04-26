"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const registered = searchParams.get("registered");
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError(res.error === "CredentialsSignin" ? "Sai email hoặc mật khẩu" : res.error);
      } else if (res?.ok) {
        router.push(callbackUrl);
        router.refresh(); // Force refresh to get new session state
      }
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface-container-lowest rounded-[24px] p-8 md:p-10 shadow-[0_12px_32px_-4px_rgba(20,27,43,0.04)] relative z-10 flex flex-col gap-8">
      {/* Header / Logo */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}> eco </span>
        </div>
        <div className="space-y-1">
          <h1 className="text-[28px] font-black tracking-tighter text-on-surface">Cứu Trợ Cận Date</h1>
          <p className="text-on-surface-variant font-medium text-[1.125rem]">Chào mừng quay trở lại!</p>
        </div>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {registered && (
          <p className="text-primary text-sm font-semibold text-center bg-primary-container/20 p-2 rounded-lg">
            Đăng ký thành công! Vui lòng đăng nhập.
          </p>
        )}
        {error && <p className="text-error text-sm font-semibold text-center">{error}</p>}

        {/* Email Input */}
        <div className="flex flex-col gap-2">
          <label className="text-[0.875rem] font-semibold text-on-surface" htmlFor="email">Email</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60">person</span>
            <input 
              className="w-full bg-surface-container-highest rounded-xl py-3 pl-12 pr-4 text-on-surface text-[0.875rem] focus:outline-none focus:ring-0 focus:border-primary border border-transparent placeholder:text-on-surface-variant/50 transition-all duration-200" 
              id="email" 
              placeholder="Nhập email" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-2">
          <label className="text-[0.875rem] font-semibold text-on-surface" htmlFor="password">Mật khẩu</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60">lock</span>
            <input 
              className="w-full bg-surface-container-highest rounded-xl py-3 pl-12 pr-12 text-on-surface text-[0.875rem] focus:outline-none focus:ring-0 focus:border-primary border border-transparent placeholder:text-on-surface-variant/50 transition-all duration-200" 
              id="password" 
              placeholder="Nhập mật khẩu" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end mt-1">
            <Link className="text-[0.75rem] font-semibold text-primary hover:text-primary-container transition-colors" href="/forgot-password">Quên mật khẩu?</Link>
          </div>
        </div>

        {/* Submit Button */}
        <button disabled={loading} className="w-full bg-primary text-on-primary font-semibold text-[1rem] py-3.5 rounded-[12px] shadow-[0_8px_16px_-4px_rgba(0,108,73,0.3)] hover:shadow-[0_12px_24px_-6px_rgba(0,108,73,0.4)] transition-all duration-300 transform active:scale-[0.98] mt-2 disabled:opacity-70" type="submit">
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex-1 h-[1px] bg-surface-container-highest"></div>
        <span className="text-[0.75rem] font-medium text-on-surface-variant uppercase tracking-wider">Hoặc</span>
        <div className="flex-1 h-[1px] bg-surface-container-highest"></div>
      </div>

      {/* Social Login */}
      <div className="flex flex-col gap-3">
        <button 
          onClick={() => signIn("google", { callbackUrl })}
          className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-surface-container-low rounded-xl hover:bg-surface-container-highest transition-colors border border-outline-variant/20 group"
        >
          <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk58JdMkFdJYTgJYkjMuJxLGnGQ4VfQbkAymRivJIWMuCYm97VI0SVF-peQoSo__iowfmC6YomLzTYcVbfebDXaePQLIHSaUZRGvsW7QXkjb5k9gM-uPGILCWt4XTZ6XYZ7dSR_PRDEZRrEsVhNmrs5_oz1fxwuRSu3EEKKkBhAVsuKFHPnOZzBOj7S3RBLfzfNK1R1vsY3ejPDKhIzdgqtw_MaAGqIRA5iIcbiEw_yUiwNQ_8wStn4betbG7sq1JUn_Z9CI3Q9x84"/>
          <span className="text-[0.875rem] font-semibold text-on-surface">Tiếp tục bằng Google</span>
        </button>
      </div>

      {/* Sign Up Link */}
      <div className="text-center mt-2">
        <p className="text-[0.875rem] text-on-surface-variant">
          Chưa có tài khoản? <Link className="font-bold text-primary hover:text-primary-container transition-colors" href="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-[100dvh] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Decor (Abstract Glassmorphism Layer) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-container rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary-container rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

      <Suspense fallback={<div>Đang tải...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
