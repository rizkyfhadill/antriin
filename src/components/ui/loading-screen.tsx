"use client";
import { useEffect, useState } from "react";
import { RSHSMark } from "@/components/ui/rshs-logo";

type Variant = "full" | "inline" | "overlay" | "card";

/**
 * Loading Screen / Splash dengan logo Kemenkes RSHS
 * - full: fullscreen splash (saat first load / route change)
 * - overlay: overlay dengan backdrop blur (untuk modal)
 * - inline: inline loader kecil
 * - card: card placeholder loading
 */
export function LoadingScreen({
  variant = "full",
  message = "Memuat Antriin RSHS...",
  subMessage = "Sistem Antrean Digital Kemenkes RS Hasan Sadikin",
  className = "",
  showProgress = true,
}: {
  variant?: Variant;
  message?: string;
  subMessage?: string;
  className?: string;
  showProgress?: boolean;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (variant !== "full" && variant !== "overlay") return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) return 95;
        return p + Math.random() * 12 + 3;
      });
    }, 180);
    return () => clearInterval(interval);
  }, [variant]);

  if (variant === "inline") {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <div className="relative">
          <RSHSMark size={20} className="animate-[pulseSoft_1.2s_ease-in-out_infinite]" />
        </div>
        <span className="text-[12px] font-[600] text-[#00A69E] tracking-tight">{message}</span>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`rounded-[20px] border border-[#00A69E]/20 bg-white dark:bg-slate-900 p-8 flex flex-col items-center gap-4 ${className}`}>
        <div className="relative">
          <div className="absolute inset-0 animate-ping opacity-20">
            <RSHSMark size={48} />
          </div>
          <RSHSMark size={48} />
        </div>
        <div className="text-center">
          <div className="text-[13px] font-[700] text-[#0B3D3A] dark:text-white">{message}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{subMessage}</div>
        </div>
        <div className="w-full max-w-[200px] h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div className="h-full bg-rshs-gradient animate-[shimmer_1.5s_ease-in-out_infinite]" style={{ width: "60%" }} />
        </div>
      </div>
    );
  }

  // full / overlay
  return (
    <div
      className={`fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#FCFCFD] dark:bg-[#020617] transition-opacity duration-500 ${
        variant === "overlay" ? "backdrop-blur-xl bg-white/80 dark:bg-slate-900/80" : ""
      } ${className}`}
    >
      {/* Decorative gradient bg */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,rgba(0,166,158,0.08),transparent_60%)]" />
        <div className="absolute top-[20%] left-[15%] h-[240px] w-[240px] rounded-full bg-[#00A69E]/10 blur-[80px] animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-[20%] right-[15%] h-[280px] w-[280px] rounded-full bg-[#C8D400]/10 blur-[80px] animate-[float_8s_ease-in-out_infinite]" />
      </div>

      {/* Logo container */}
      <div className="relative flex flex-col items-center">
        {/* Outer rotating ring */}
        <div className="relative">
          <div className="absolute -inset-6 rounded-full border-2 border-dashed border-[#00A69E]/20 animate-[spin_12s_linear_infinite]" />
          <div className="absolute -inset-10 rounded-full border border-[#C8D400]/15 animate-[spin_18s_linear_infinite_reverse]" />

          {/* Logo with ping pulse */}
          <div className="relative">
            <div className="absolute inset-0 animate-ping opacity-20">
              <RSHSMark size={80} />
            </div>
            <div className="relative animate-[scaleIn_0.8s_cubic-bezier(0.16,1,0.3,1)]">
              <RSHSMark size={80} />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="mt-8 text-center animate-[slideUp_0.6s_ease_0.2s_both]">
          <div className="text-[11px] font-[800] tracking-[0.2em] text-[#00A69E]">KEMENKES</div>
          <div className="mt-1 text-[20px] sm:text-[24px] font-[800] tracking-tight text-[#0B3D3A] dark:text-white">
            RS Hasan Sadikin <span className="text-[#00A69E]">Bandung</span>
          </div>
          <div className="mt-2 text-[12px] font-[500] text-slate-500 dark:text-slate-400 tracking-tight">
            {message}
          </div>
          <div className="mt-1 text-[10px] font-[600] tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            {subMessage}
          </div>
        </div>

        {/* Progress bar */}
        {showProgress && (
          <div className="mt-6 w-[240px] sm:w-[320px] animate-[slideUp_0.6s_ease_0.4s_both]">
            <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-rshs-gradient rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-[600] tracking-widest text-slate-400">
              <span>PASTEUR NO.38</span>
              <span>{Math.round(Math.min(progress, 100))}%</span>
            </div>
          </div>
        )}

        {/* Skeleton hints */}
        <div className="mt-6 flex gap-2 animate-[slideUp_0.6s_ease_0.6s_both]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-[#00A69E] animate-[pulseSoft_1.2s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Bottom brand strip */}
      <div className="absolute bottom-6 left-0 right-0 text-center animate-[fadeIn_1s_ease_0.8s_both] px-6">
        <div className="text-[10px] font-[700] tracking-[0.2em] sm:tracking-[0.25em] text-slate-400 dark:text-slate-500">
          SISTEM ANTREAN DIGITAL RESMI KEMENKES
        </div>
        <div className="mt-1 text-[10px] font-[500] tracking-[0.1em] text-slate-300 dark:text-slate-600">
          RSUP Dr. Hasan Sadikin Bandung • Jl. Pasteur No. 38
        </div>
      </div>
    </div>
  );
}

/**
 * Splash screen yang hilang setelah first load
 */
export function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hide after 1.4s or when fully loaded
    const timer = setTimeout(() => setVisible(false), 1400);
    const handleLoad = () => setTimeout(() => setVisible(false), 800);
    if (document.readyState === "complete") handleLoad();
    else window.addEventListener("load", handleLoad);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[500] transition-opacity duration-500 opacity-100">
      <LoadingScreen variant="full" />
    </div>
  );
}

/**
 * Page loader untuk route transition / data fetching
 */
export function PageLoader({ label = "Memuat..." }: { label?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 p-8">
      <div className="relative">
        <div className="absolute inset-0 animate-ping opacity-20">
          <RSHSMark size={48} />
        </div>
        <RSHSMark size={48} />
      </div>
      <div className="text-center">
        <div className="text-[13px] font-[700] text-[#0B3D3A] dark:text-white tracking-tight">{label}</div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Kemenkes RS Hasan Sadikin • Pasteur 38</div>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-[#00A69E] animate-[pulseSoft_1.2s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
