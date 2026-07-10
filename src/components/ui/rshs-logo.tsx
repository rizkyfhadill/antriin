"use client";
import { cn } from "@/lib/utils";

type Variant = "full" | "icon" | "horizontal" | "white";

export function RSHSLogo({
  variant = "full",
  className,
  size = 40,
}: {
  variant?: Variant;
  className?: string;
  size?: number;
}) {
  const icon = (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo RS Hasan Sadikin"
      className="shrink-0"
    >
      {/* Teal petal top-left */}
      <path
        d="M58 58 C 30 58, 20 48, 20 30 C 20 18, 30 10, 42 10 C 54 10, 58 24, 58 40 Z"
        fill="#00A69E"
      />
      {/* Lime petal top-right */}
      <path
        d="M62 58 C 90 58, 100 48, 100 30 C 100 18, 90 10, 78 10 C 66 10, 62 24, 62 40 Z"
        fill="#C8D400"
      />
      {/* Teal petal bottom-left */}
      <path
        d="M58 62 C 30 62, 20 72, 20 90 C 20 102, 30 110, 42 110 C 54 110, 58 96, 58 80 Z"
        fill="#00A69E"
      />
      {/* Lime petal bottom-right */}
      <path
        d="M62 62 C 90 62, 100 72, 100 90 C 100 102, 90 110, 78 110 C 66 110, 62 96, 62 80 Z"
        fill="#C8D400"
      />
      {/* Left horizontal teal accent */}
      <path
        d="M56 58 C 56 50, 48 46, 30 46 C 18 46, 8 52, 8 60 C 8 68, 18 74, 30 74 C 48 74, 56 70, 56 62 Z"
        fill="#00A69E"
      />
      {/* Center white cross / plus formed by negative space + white shape */}
      <path
        d="M56 56 L 64 56 L 64 48 C 64 44, 66 40, 60 40 C 54 40, 56 44, 56 48 Z"
        fill="#FFFFFF"
      />
      <path
        d="M56 64 L 64 64 L 64 72 C 64 76, 66 80, 60 80 C 54 80, 56 76, 56 72 Z"
        fill="#FFFFFF"
      />
      <path
        d="M56 56 L 56 64 L 48 64 C 44 64, 40 62, 40 60 C 40 58, 44 56, 48 56 Z"
        fill="#FFFFFF"
      />
      <path
        d="M64 56 L 64 64 L 72 64 C 76 64, 80 62, 80 60 C 80 58, 76 56, 72 56 Z"
        fill="#FFFFFF"
      />
    </svg>
  );

  if (variant === "icon") {
    return <div className={cn("inline-flex", className)}>{icon}</div>;
  }

  if (variant === "white") {
    return (
      <div className={cn("inline-flex items-center gap-3", className)}>
        {icon}
        <div className="leading-[1.05] text-white">
          <div className="font-[800] tracking-[-0.02em] text-[18px] sm:text-[20px]">Kemenkes</div>
          <div className="font-[700] tracking-[-0.01em] text-[14px] sm:text-[16px] text-white/90">RS Hasan Sadikin</div>
        </div>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className={cn("inline-flex items-center gap-2.5", className)}>
        {icon}
        <div className="leading-[1.05]">
          <div className="font-[800] tracking-[-0.02em] text-[#00A69E] text-[14px] sm:text-[15px]">Kemenkes</div>
          <div className="font-[700] tracking-[-0.01em] text-[#0B3D3A] dark:text-white text-[12px] sm:text-[13px]">RS Hasan Sadikin</div>
        </div>
      </div>
    );
  }

  // full
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      {icon}
      <div className="leading-[1.05]">
        <div className="font-[800] tracking-[-0.02em] text-[#00A69E] text-[18px] sm:text-[22px]">Kemenkes</div>
        <div className="font-[700] tracking-[-0.01em] text-[#0B3D3A] dark:text-white text-[15px] sm:text-[18px]">RS Hasan Sadikin</div>
      </div>
    </div>
  );
}

export function RSHSMark({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <div className={cn("inline-flex", className)}>
      <svg viewBox="0 0 120 120" width={size} height={size} xmlns="http://www.w3.org/2000/svg" aria-label="RS Hasan Sadikin">
        <path d="M58 58 C 30 58, 20 48, 20 30 C 20 18, 30 10, 42 10 C 54 10, 58 24, 58 40 Z" fill="#00A69E" />
        <path d="M62 58 C 90 58, 100 48, 100 30 C 100 18, 90 10, 78 10 C 66 10, 62 24, 62 40 Z" fill="#C8D400" />
        <path d="M58 62 C 30 62, 20 72, 20 90 C 20 102, 30 110, 42 110 C 54 110, 58 96, 58 80 Z" fill="#00A69E" />
        <path d="M62 62 C 90 62, 100 72, 100 90 C 100 102, 90 110, 78 110 C 66 110, 62 96, 62 80 Z" fill="#C8D400" />
        <path d="M56 58 C 56 50, 48 46, 30 46 C 18 46, 8 52, 8 60 C 8 68, 18 74, 30 74 C 48 74, 56 70, 56 62 Z" fill="#00A69E" />
        <path d="M56 56 L 64 56 L 64 48 C 64 44, 66 40, 60 40 C 54 40, 56 44, 56 48 Z" fill="#FFFFFF" />
        <path d="M56 64 L 64 64 L 64 72 C 64 76, 66 80, 60 80 C 54 80, 56 76, 56 72 Z" fill="#FFFFFF" />
        <path d="M56 56 L 56 64 L 48 64 C 44 64, 40 62, 40 60 C 40 58, 44 56, 48 56 Z" fill="#FFFFFF" />
        <path d="M64 56 L 64 64 L 72 64 C 76 64, 80 62, 80 60 C 80 58, 76 56, 72 56 Z" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
