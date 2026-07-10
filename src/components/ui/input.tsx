"use client";
import { cn } from "@/lib/utils";

export function Input({ className, error, label, ...props }: any) {
  return (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-[11px] font-semibold tracking-widest text-slate-500 dark:text-slate-400">{label}</label>}
      <input
        className={cn(
          "w-full rounded-full border bg-white px-4 py-3 text-[14px] outline-none transition-all placeholder:text-slate-400 dark:bg-slate-900 dark:border-slate-700 dark:text-white",
          error ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100" : "border-slate-200 focus:border-[#00A69E] focus:ring-4 focus:ring-[#00A69E]/10 dark:focus:border-white dark:focus:ring-white/10",
          className
        )}
        {...props}
      />
      {error && <div className="mt-1.5 text-[11px] text-red-600">{error}</div>}
    </div>
  );
}

export function Textarea({ className, label, error, ...props }: any) {
  return (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-[11px] font-semibold tracking-widest text-slate-500">{label}</label>}
      <textarea
        className={cn(
          "w-full rounded-[16px] border bg-white px-4 py-3 text-[14px] outline-none transition-all min-h-[88px] resize-none dark:bg-slate-900 dark:border-slate-700",
          error ? "border-red-300" : "border-slate-200 focus:border-[#00A69E] focus:ring-4 focus:ring-[#00A69E]/10",
          className
        )}
        {...props}
      />
      {error && <div className="mt-1.5 text-[11px] text-red-600">{error}</div>}
    </div>
  );
}

export function Select({ className, label, children, ...props }: any) {
  return (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-[11px] font-semibold tracking-widest text-slate-500">{label}</label>}
      <select
        className={cn("w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#00A69E] focus:ring-4 focus:ring-[#00A69E]/10 dark:bg-slate-900 dark:border-slate-700", className)}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
