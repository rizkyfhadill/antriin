"use client";
import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", hoverable = false, children, ...props }: any) {
  const variants: any = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    navy: "bg-[#00A69E] text-white border-[#00A69E]",
    outline: "bg-transparent border-slate-200 text-slate-600",
  };
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide",
      variants[variant],
      hoverable && "pill-hover-yellow cursor-pointer",
      className
    )} {...props}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: any = {
    waiting: { label: "Menunggu", variant: "amber" },
    called: { label: "Dipanggil", variant: "blue" },
    checked_in: { label: "Check-in", variant: "violet" },
    serving: { label: "Dilayani", variant: "blue" },
    completed: { label: "Selesai", variant: "emerald" },
    cancelled: { label: "Batal", variant: "default" },
    missed: { label: "Terlewat", variant: "default" },
  };
  const conf = map[status] || { label: status, variant: "default" };
  return <Badge variant={conf.variant}>{conf.label}</Badge>;
}
