"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const TEXT = {
  invalidCredentials: "Sai email ho\u1eb7c m\u1eadt kh\u1ea9u",
  genericError: "C\u00f3 l\u1ed7i x\u1ea3y ra. Vui l\u00f2ng th\u1eed l\u1ea1i.",
  brand: "C\u1ee9u Tr\u1ee3 C\u1eadn Date",
  welcomeBack: "Ch\u00e0o m\u1eebng quay tr\u1edf l\u1ea1i!",
  registerSuccess: "\u0110\u0103ng k\u00fd th\u00e0nh c\u00f4ng! Vui l\u00f2ng \u0111\u0103ng nh\u1eadp.",
  emailPlaceholder: "Nh\u1eadp email",
  password: "M\u1eadt kh\u1ea9u",
  passwordPlaceholder: "Nh\u1eadp m\u1eadt kh\u1ea9u",
  forgotPassword: "Qu\u00ean m\u1eadt kh\u1ea9u?",
  loadingLogin: "\u0110ang \u0111\u0103ng nh\u1eadp...",
  login: "\u0110\u0103ng nh\u1eadp",
  or: "Ho\u1eb7c",
  continueGoogle: "Ti\u1ebfp t\u1ee5c b\u1eb1ng Google",
  noAccount: "Ch\u01b0a c\u00f3 t\u00e0i kho\u1ea3n?",
  registerNow: "\u0110\u0103ng k\u00fd ngay",
  rescueFood: "C\u1ee9u tr\u1ee3 th\u1ef1c ph\u1ea9m",
  heroTitle: "\u0110\u0103ng nh\u1eadp \u0111\u1ec3 ti\u1ebfp t\u1ee5c gi\u1ea3i c\u1ee9u th\u1ef1c ph\u1ea9m quanh b\u1ea1n.",
  heroDescription:
    "Theo d\u00f5i \u0111\u01a1n h\u00e0ng, qu\u1ea3n l\u00fd c\u1eeda h\u00e0ng, v\u00e0 chuy\u1ec3n \u0111\u1ed5i gi\u1eefa tr\u1ea3i nghi\u1ec7m ng\u01b0\u1eddi mua v\u00e0 ng\u01b0\u1eddi b\u00e1n tr\u00ean m\u00e0n h\u00ecnh desktop r\u1ed9ng r\u00e3i h\u01a1n.",
  loading: "\u0110ang t\u1ea3i...",
} as const;

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
        setError(res.error === "CredentialsSignin" ? TEXT.invalidCredentials : res.error);
      } else if (res?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError(TEXT.genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md xl:max-w-lg bg-surface-container-lowest rounded-[24px] p-8 md:p-10 xl:p-12 shadow-[0_12px_32px_-4px_rgba(20,27,43,0.04)] relative z-10 flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
        </div>
        <div className="space-y-1">
          <h1 className="text-[28px] font-black tracking-tighter text-on-surface">{TEXT.brand}</h1>
          <p className="text-on-surface-variant font-medium text-[1.125rem]">{TEXT.welcomeBack}</p>
        </div>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {registered && (
          <p className="text-primary text-sm font-semibold text-center bg-primary-container/20 p-2 rounded-lg">
            {TEXT.registerSuccess}
          </p>
        )}
        {error && <p className="text-error text-sm font-semibold text-center">{error}</p>}

        <div className="flex flex-col gap-2">
          <label className="text-[0.875rem] font-semibold text-on-surface" htmlFor="email">Email</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60">person</span>
            <input
              className="w-full bg-surface-container-highest rounded-xl py-3 pl-12 pr-4 text-on-surface text-[0.875rem] focus:outline-none focus:ring-0 focus:border-primary border border-transparent placeholder:text-on-surface-variant/50 transition-all duration-200"
              id="email"
              placeholder={TEXT.emailPlaceholder}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[0.875rem] font-semibold text-on-surface" htmlFor="password">{TEXT.password}</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60">lock</span>
            <input
              className="w-full bg-surface-container-highest rounded-xl py-3 pl-12 pr-12 text-on-surface text-[0.875rem] focus:outline-none focus:ring-0 focus:border-primary border border-transparent placeholder:text-on-surface-variant/50 transition-all duration-200"
              id="password"
              placeholder={TEXT.passwordPlaceholder}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end mt-1">
            <Link className="text-[0.75rem] font-semibold text-primary hover:text-primary-container transition-colors" href="/forgot-password">
              {TEXT.forgotPassword}
            </Link>
          </div>
        </div>

        <button disabled={loading} className="w-full bg-primary text-on-primary font-semibold text-[1rem] py-3.5 rounded-[12px] shadow-[0_8px_16px_-4px_rgba(0,108,73,0.3)] hover:shadow-[0_12px_24px_-6px_rgba(0,108,73,0.4)] transition-all duration-300 transform active:scale-[0.98] mt-2 disabled:opacity-70" type="submit">
          {loading ? TEXT.loadingLogin : TEXT.login}
        </button>
      </form>

      <div className="flex items-center gap-4 w-full">
        <div className="flex-1 h-[1px] bg-surface-container-highest"></div>
        <span className="text-[0.75rem] font-medium text-on-surface-variant uppercase tracking-wider">{TEXT.or}</span>
        <div className="flex-1 h-[1px] bg-surface-container-highest"></div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => signIn("google", { callbackUrl })}
          className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-surface-container-low rounded-xl hover:bg-surface-container-highest transition-colors border border-outline-variant/20 group"
        >
          <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk58JdMkFdJYTgJYkjMuJxLGnGQ4VfQbkAymRivJIWMuCYm97VI0SVF-peQoSo__iowfmC6YomLzTYcVbfebDXaePQLIHSaUZRGvsW7QXkjb5k9gM-uPGILCWt4XTZ6XYZ7dSR_PRDEZRrEsVhNmrs5_oz1fxwuRSu3EEKKkBhAVsuKFHPnOZzBOj7S3RBLfzfNK1R1vsY3ejPDKhIzdgqtw_MaAGqIRA5iIcbiEw_yUiwNQ_8wStn4betbG7sq1JUn_Z9CI3Q9x84" />
          <span className="text-[0.875rem] font-semibold text-on-surface">{TEXT.continueGoogle}</span>
        </button>
      </div>

      <div className="text-center mt-2">
        <p className="text-[0.875rem] text-on-surface-variant">
          {TEXT.noAccount} <Link className="font-bold text-primary hover:text-primary-container transition-colors" href="/register">{TEXT.registerNow}</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-[100dvh] flex flex-col justify-center items-center p-6 lg:p-10 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-container rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary-container rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

      <div className="w-full max-w-6xl grid lg:grid-cols-[1.1fr_minmax(420px,520px)] items-center gap-12 relative z-10">
        <div className="hidden lg:block">
          <div className="max-w-xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {TEXT.rescueFood}
            </span>
            <h1 className="text-5xl xl:text-6xl font-black tracking-tight text-on-surface leading-[0.95]">
              {TEXT.heroTitle}
            </h1>
            <p className="text-lg text-on-surface-variant max-w-lg leading-relaxed">
              {TEXT.heroDescription}
            </p>
          </div>
        </div>

        <Suspense fallback={<div>{TEXT.loading}</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
