"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestPasswordReset, verifyResetOtp, resetPasswordWithOtp } from "@/lib/actions/users";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Step 2 OTP Refs
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleRequestOtp = async () => {
    if (!email) {
      setError("Vui lòng nhập Email.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      setError("Vui lòng nhập đầy đủ mã OTP.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await verifyResetOtp(email, fullOtp);
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Mã OTP không hợp lệ.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải từ 6 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await resetPasswordWithOtp(email, otp.join(""), newPassword);
      setStep(4);
      // Auto redirect after 3s
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi đặt lại mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 4) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  // Password criteria checks
  const hasMinChars = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);

  return (
    <div className="bg-surface font-body text-on-surface min-h-[100dvh] flex flex-col relative overflow-hidden">
      {/* TopAppBar Navigation Shell */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur flex items-center justify-between px-4 h-16">
        <button 
          onClick={handleBack}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-150 text-on-surface-variant"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-['Inter'] font-semibold tracking-tight text-primary text-center flex-1">Khôi phục mật khẩu</h1>
        <div className="w-10"></div>
        <div className="absolute bottom-0 left-0 right-0 bg-outline-variant/20 h-[1px]"></div>
      </header>

      <main className="mt-16 flex-1 flex flex-col items-center px-6 pt-10 pb-12 w-full max-w-md mx-auto">
        
        {/* Stepper Bar */}
        {step < 4 && (
          <div className="flex items-center justify-center gap-3 mb-12 w-full">
            <div className={`h-1.5 w-12 rounded-full shadow-sm ${step >= 1 ? 'bg-primary-container' : 'bg-surface-container-highest'}`}></div>
            <div className={`h-1.5 w-12 rounded-full shadow-sm ${step >= 2 ? 'bg-primary-container' : 'bg-surface-container-highest'}`}></div>
            <div className={`h-1.5 w-12 rounded-full shadow-sm ${step >= 3 ? 'bg-primary-container ring-2 ring-primary ring-offset-2' : 'bg-surface-container-highest'}`}></div>
          </div>
        )}

        {/* STEP 1: Input Email */}
        {step === 1 && (
          <div className="w-full bg-surface-container-low rounded-xl p-6 space-y-8 shadow-sm">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-on-surface tracking-tight leading-tight">
                Tìm tài khoản của bạn
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Vui lòng nhập Email để nhận mã khôi phục.
              </p>
            </div>

            {error && <p className="text-error text-sm font-semibold text-center">{error}</p>}

            <div className="aspect-video w-full rounded-lg overflow-hidden bg-surface-container-highest flex items-center justify-center relative">
              <img className="w-full h-full object-cover mix-blend-overlay opacity-40" alt="security lock" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZfUUsjk1KsmShWdBx2XhoenyVYAnBg7Ya_3c499m72f-2aICA3Sprr-CqXiPErW02EVGOfAwXrGxdw7lmkm8NKf1MiOjU5SqgG-AyqMwNL4qIydPNCz08zyKxBPFnb8thCPkkjGIB0JTxroSdKcgS74mbrO0zL7-SJ7LpyV9d0Kr9zBXW8aVwOBuO6V2HJv2rtlpVroGxnRvGnPOx8y9jgKefJUtDOq_b4Xo022SnTQZM-tOQdZzVfzJIGUx3WD7z7ociZrhAR1g"/>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
              <span className="material-symbols-outlined text-primary-container text-5xl opacity-80" style={{ fontVariationSettings: "'FILL' 1" }}>
                lock_reset
              </span>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">person</span>
                  <input 
                    className="w-full h-14 pl-12 pr-4 bg-surface-container-lowest border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline transition-all duration-200 shadow-sm" 
                    placeholder="VD: email@example.com" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="pt-4">
                <button 
                  disabled={loading}
                  onClick={handleRequestOtp} 
                  className="w-full h-14 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/10 active:scale-[0.98] transition-transform duration-150 disabled:opacity-70"
                >
                  <span>{loading ? "Đang gửi..." : "Tiếp tục"}</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>
            </div>
            
            <div className="mt-8 text-center space-y-4">
              <p className="text-sm text-on-surface-variant">Bạn gặp sự cố khi nhận mã?</p>
              <button className="text-primary font-semibold text-sm hover:underline transition-all">
                Trung tâm trợ giúp
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <div className="w-full max-w-md bg-surface-container-lowest shadow-sm border border-outline-variant/10 rounded-xl p-8 transition-all">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container/10 text-primary mb-6">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>phonelink_lock</span>
              </div>
              <h2 className="text-2xl font-bold text-on-surface mb-2 tracking-tight">Xác thực mã OTP</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Nhập mã 6 số vừa được gửi đến <span className="font-semibold text-on-surface">{email}</span>
              </p>
            </div>

            {error && <p className="text-error text-sm font-semibold text-center mb-4">{error}</p>}

            <div className="grid grid-cols-6 gap-2 sm:gap-3 mb-8">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <input 
                  key={i}
                  ref={el => { otpInputs.current[i] = el; }}
                  onChange={(e) => handleOtpChange(i, e)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  value={otp[i]}
                  className="w-full aspect-square text-center text-xl font-bold bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary transition-all text-primary" 
                  maxLength={1} 
                  placeholder="·" 
                  type="text"
                />
              ))}
            </div>

            <div className="flex flex-col items-center gap-2 mb-10">
              <span className="text-xs text-on-surface-variant opacity-60 font-medium">Bạn chưa nhận được mã?</span>
              <button className="text-primary font-semibold text-sm px-4 py-2 rounded-full bg-surface-container-low">
                Gửi lại mã
              </button>
            </div>

            <button 
              disabled={loading}
              onClick={handleVerifyOtp} 
              className="w-full h-14 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-95 duration-150 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <span>{loading ? "Đang xác nhận..." : "Xác nhận"}</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        )}

        {/* STEP 3 & 4: Reset Password (Background context for Step 4 Popup) */}
        {(step === 3 || step === 4) && (
          <div className={`w-full max-w-md ${step === 4 ? 'opacity-40 pointer-events-none select-none' : ''}`}>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-on-surface leading-tight tracking-tight mb-2">Đặt lại mật khẩu</h2>
              <p className="text-on-surface-variant text-sm mb-8">Vui lòng tạo mật khẩu mới mạnh hơn để bảo vệ tài khoản của bạn.</p>
            </div>

            {error && <p className="text-error text-sm font-semibold text-center mb-4">{error}</p>}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface-variant ml-1">Mật khẩu mới</label>
                <div className="relative group">
                  <input 
                    className="w-full h-14 px-4 bg-surface-container-highest rounded-xl text-on-surface border-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/40" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">{showPassword ? 'visibility' : 'visibility_off'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface-variant ml-1">Nhập lại mật khẩu mới</label>
                <div className="relative">
                  <input 
                    className="w-full h-14 px-4 bg-surface-container-highest rounded-xl text-on-surface border-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/40" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-5 bg-surface-container-low rounded-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full ${hasMinChars ? 'bg-primary-container/20 text-primary' : 'bg-surface-container-highest text-outline-variant'}`}>
                    <span className="material-symbols-outlined text-sm font-bold">{hasMinChars ? 'check' : 'close'}</span>
                  </div>
                  <span className={`text-sm font-medium ${hasMinChars ? 'text-on-surface' : 'text-on-surface-variant'}`}>Tối thiểu 8 ký tự</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full ${hasUpper ? 'bg-primary-container/20 text-primary' : 'bg-surface-container-highest text-outline-variant'}`}>
                    <span className="material-symbols-outlined text-sm font-bold">{hasUpper ? 'check' : 'close'}</span>
                  </div>
                  <span className={`text-sm font-medium ${hasUpper ? 'text-on-surface' : 'text-on-surface-variant'}`}>Có chữ in hoa</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full ${hasNumber ? 'bg-primary-container/20 text-primary' : 'bg-surface-container-highest text-outline-variant'}`}>
                    <span className="material-symbols-outlined text-sm font-bold">{hasNumber ? 'check' : 'close'}</span>
                  </div>
                  <span className={`text-sm font-medium ${hasNumber ? 'text-on-surface' : 'text-on-surface-variant'}`}>Có chữ số</span>
                </div>
              </div>

              <button 
                disabled={loading}
                onClick={handleResetPassword} 
                className="w-full h-14 mt-8 bg-gradient-to-br from-primary to-primary-container text-white font-bold text-lg rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
              >
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* STEP 4: Success Popup Overlay */}
      {step === 4 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm"></div>
          <div className="relative bg-white/85 backdrop-blur-[16px] w-full max-w-sm rounded-xl p-8 flex flex-col items-center text-center shadow-[0_12px_32px_-4px_rgba(20,27,43,0.08)] border border-white/40">
            <div className="w-24 h-24 mb-6 rounded-full bg-primary-container flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full animate-ping bg-primary-container/30 opacity-75"></div>
              <span className="material-symbols-outlined text-on-primary-container text-5xl font-bold" style={{ fontVariationSettings: "'FILL' 0, 'wght' 700" }}>check_circle</span>
            </div>
            
            <h2 className="text-2xl font-bold tracking-tight text-on-surface mb-3">Đổi mật khẩu thành công!</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
              Hệ thống sẽ chuyển hướng bạn về trang đăng nhập sau <span className="text-primary font-bold">3 giây</span>...
            </p>
            
            <Link href="/login" className="group w-full h-14 bg-gradient-to-tr from-primary to-primary-container text-on-primary rounded-xl font-semibold text-base flex items-center justify-center gap-2 active:scale-95 duration-150 shadow-lg shadow-primary/20">
              Đăng nhập ngay
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
            
            <div className="mt-8 flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-full">
              <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Tài khoản an toàn</span>
            </div>
          </div>
        </div>
      )}

      {/* Abstract Background Shapes */}
      <div className="fixed -bottom-24 -left-24 w-64 h-64 bg-primary-container/10 rounded-full blur-[80px] -z-10"></div>
      <div className="fixed top-24 -right-12 w-48 h-48 bg-secondary-container/10 rounded-full blur-[80px] -z-10"></div>
    </div>
  );
}
