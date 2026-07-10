"use client";
import { useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export function Modal({ open, onClose, children, className, size = "md" }: { open: boolean; onClose: () => void; children: ReactNode; className?: string; size?: "sm" | "md" | "lg" | "xl" }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", esc);
      return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
    }
  }, [open, onClose]);

  if (!open) return null;

  const sizeMap: any = { sm: "max-w-[400px]", md: "max-w-[520px]", lg: "max-w-[720px]", xl: "max-w-[980px]" };

  const content = (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-[#00A69E]/40 backdrop-blur-[12px] dark:bg-black/60 animate-[fadeIn_0.3s_ease]" onClick={onClose} />
      <div className={cn("relative w-full max-h-[90vh] sm:max-h-[88vh] overflow-auto rounded-t-[24px] sm:rounded-[24px] bg-white shadow-[0_24px_80px_rgba(0,166,158,0.24)] border border-slate-200/60 animate-[scaleIn_0.35s_cubic-bezier(0.16,1,0.3,1)] dark:bg-slate-900 dark:border-slate-800", sizeMap[size], className)}>
        {children}
      </div>
    </div>
  );

  if (typeof window === "undefined") return null;
  return createPortal(content, document.body);
}

export function ModalHeader({ children, onClose, className }: any) {
  return (
    <div className={cn("sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-xl p-5 sm:p-6 dark:bg-slate-900/80 dark:border-slate-800", className)}>
      <div className="font-semibold tracking-tight">{children}</div>
      <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700">✕</button>
    </div>
  );
}
