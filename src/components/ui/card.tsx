"use client";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type CardProps = {
  className?: string;
  children?: any;
  hover?: boolean;
  pressable?: boolean;
  padding?: boolean;
  rshs?: boolean;
  size?: "sm" | "md" | "lg";
  [key: string]: any;
};

export function Card({ className, children, hover = false, pressable = false, padding = false, rshs = false, size = "md", ...props }: CardProps) {
  const sizeMap = {
    sm: "p-3 sm:p-4",
    md: "p-5 sm:p-6",
    lg: "p-6 sm:p-8",
  };
  return (
    <div
      className={cn(
        "group/card relative rounded-2xl bg-white border backdrop-blur-xl transition-all duration-300 ease-out",
        // Default light mode
        !rshs && "border-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_16px_rgba(15,23,42,0.04)]",
        rshs && "border-[#00A69E]/15 shadow-[0_2px_8px_rgba(0,166,158,0.04),0_8px_24px_rgba(0,166,158,0.04)]",
        // Dark mode base
        "dark:bg-slate-900/60",
        !rshs && "dark:border-slate-800 dark:shadow-none",
        rshs && "dark:border-[#00A69E]/20 dark:shadow-[0_2px_12px_rgba(0,166,158,0.1)]",
        // Hover states - kuning glow
        hover && !rshs && "card-hover-yellow",
        hover && rshs && "card-hover-yellow",
        // Pressable
        pressable && "cursor-pointer active:scale-[0.98] active:translate-y-0",
        // Padding
        padding && sizeMap[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardGlass({ className, children, ...props }: any) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white/80 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_rgba(15,23,42,0.08)] card-hover-yellow",
        "dark:bg-slate-900/40 dark:border-white/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: any) {
  return <div className={cn("p-5 sm:p-6 pb-3", className)} {...props}>{children}</div>;
}
export function CardContent({ className, children, ...props }: any) {
  return <div className={cn("p-5 sm:p-6 pt-0", className)} {...props}>{children}</div>;
}

/** RSHS branded card dengan gradient top bar kuning saat hover */
export function CardRSHS({ className, children, ...props }: any) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-white border border-[#00A69E]/15 card-hover-yellow",
        "dark:bg-slate-900 dark:border-[#00A69E]/20",
        className
      )}
      {...props}
    >
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#00A69E] via-[#C8D400] to-[#C8D400] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {children}
    </div>
  );
}

/** Stat card dengan icon rotate saat hover */
export function StatCard({
  icon,
  label,
  value,
  trend,
  trendColor = "emerald",
  className,
}: {
  icon?: string | ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  trendColor?: "emerald" | "blue" | "amber" | "red";
  className?: string;
}) {
  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
    amber: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    red: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
  };
  return (
    <Card rshs className={cn("p-4 sm:p-5 stat-hover-yellow", className)}>
      <div className="flex justify-between items-start gap-2">
        <span className="text-[18px] sm:text-[20px] shrink-0 stat-icon">{icon}</span>
        {trend && (
          <span className={cn("rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-[700] border whitespace-nowrap", colorMap[trendColor])}>
            {trend}
          </span>
        )}
      </div>
      <div className="mt-2.5 sm:mt-3 text-[10px] sm:text-[11px] font-[700] tracking-widest text-slate-400 dark:text-slate-500 uppercase">{label}</div>
      <div className="mt-1 text-[22px] sm:text-[26px] lg:text-[28px] font-[800] tracking-tight leading-none text-[#0B3D3A] dark:text-white">{value}</div>
    </Card>
  );
}
