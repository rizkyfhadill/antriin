"use client";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "accent" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "xl" | "icon";

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  loading = false,
  leftIcon,
  rightIcon,
  ...props
}: {
  className?: string;
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  [key: string]: any;
}) {
  const variants: Record<Variant, string> = {
    // Primary: teal → kuning saat hover
    primary: [
      "bg-[#00A69E] text-white",
      "shadow-[0_4px_14px_rgba(0,166,158,0.25)]",
      "hover:bg-[#C8D400] hover:text-[#0B3D3A] hover:shadow-[0_8px_24px_rgba(200,212,0,0.4)] hover:-translate-y-[2px]",
      "active:translate-y-0 active:scale-[0.97]",
      "dark:bg-[#00A69E] dark:text-white dark:hover:bg-[#C8D400] dark:hover:text-[#0B3D3A]",
    ].join(" "),
    // Secondary: putih/slate → kuning saat hover
    secondary: [
      "bg-white text-[#0B3D3A] border border-slate-200",
      "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
      "hover:bg-[#C8D400] hover:text-[#0B3D3A] hover:border-[#C8D400] hover:shadow-[0_4px_14px_rgba(200,212,0,0.35)] hover:-translate-y-[1px]",
      "active:translate-y-0 active:scale-[0.98]",
      "dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-[#C8D400] dark:hover:text-[#0B3D3A] dark:hover:border-[#C8D400]",
    ].join(" "),
    // Accent: sama dengan primary
    accent: [
      "bg-[#00A69E] text-white",
      "shadow-[0_4px_16px_rgba(0,166,158,0.32)]",
      "hover:bg-[#C8D400] hover:text-[#0B3D3A] hover:shadow-[0_8px_24px_rgba(200,212,0,0.44)] hover:-translate-y-[2px]",
      "active:translate-y-0 active:scale-[0.97]",
    ].join(" "),
    // Ghost: transparan → kuning saat hover
    ghost: [
      "bg-transparent text-slate-600",
      "hover:bg-[#C8D400] hover:text-[#0B3D3A] hover:shadow-[0_4px_14px_rgba(200,212,0,0.25)]",
      "active:bg-[#B4BF00]",
      "dark:text-slate-400 dark:hover:bg-[#C8D400] dark:hover:text-[#0B3D3A]",
    ].join(" "),
    // Outline: border → kuning solid saat hover
    outline: [
      "bg-transparent border border-slate-300 text-[#0B3D3A]",
      "hover:bg-[#C8D400] hover:text-[#0B3D3A] hover:border-[#C8D400] hover:-translate-y-[1px] hover:shadow-[0_4px_14px_rgba(200,212,0,0.3)]",
      "active:translate-y-0 active:scale-[0.98]",
      "dark:border-slate-700 dark:text-slate-100 dark:hover:bg-[#C8D400] dark:hover:text-[#0B3D3A] dark:hover:border-[#C8D400]",
    ].join(" "),
    // Danger: tetap merah
    danger: [
      "bg-red-500 text-white",
      "shadow-[0_4px_16px_rgba(239,68,68,0.3)]",
      "hover:bg-[#C8D400] hover:text-[#0B3D3A] hover:shadow-[0_8px_24px_rgba(200,212,0,0.4)] hover:-translate-y-[1px]",
      "active:translate-y-0 active:scale-[0.97]",
    ].join(" "),
  };
  const sizes: Record<Size, string> = {
    sm: "h-[32px] px-3.5 text-[12.5px] gap-1.5",
    md: "h-[40px] px-5 text-[13.5px] gap-2",
    lg: "h-[44px] px-6 text-[14px] gap-2",
    xl: "h-[52px] px-8 text-[15px] gap-2.5",
    icon: "h-9 w-9 p-0",
  };

  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center rounded-full font-[600] tracking-[-0.01em] transition-all duration-300 ease-out disabled:opacity-50 disabled:pointer-events-none select-none focus:outline-none focus-visible:ring-4 focus-visible:ring-[#00A69E]/20 whitespace-nowrap overflow-hidden",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {/* Shimmer overlay */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

      {loading ? (
        <span className="relative h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        leftIcon && <span className="relative">{leftIcon}</span>
      )}
      <span className="relative">{children}</span>
      {rightIcon && !loading && <span className="relative">{rightIcon}</span>}
    </button>
  );
}
