"use client";
import { Button } from "./button";

export function EmptyState({ icon = "📭", title, description, action, onAction }: { icon?: string; title: string; description?: string; action?: string; onAction?: () => void }) {
  return (
    <div className="text-center py-16 px-6 rounded-[20px] border border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <div className="text-[40px]">{icon}</div>
      <div className="mt-3 font-[600] dark:text-white">{title}</div>
      {description && <div className="mt-1 text-[13px] text-slate-500 dark:text-slate-400 max-w-[320px] mx-auto leading-[1.5]">{description}</div>}
      {action && <Button size="sm" variant="secondary" className="mt-4 rounded-full" onClick={onAction}>{action}</Button>}
    </div>
  );
}
