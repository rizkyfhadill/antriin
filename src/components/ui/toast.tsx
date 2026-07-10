"use client";
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

type Toast = { id: string; title: string; description?: string; type?: "success" | "error" | "info" | "warning" };
const ToastContext = createContext<{ addToast: (t: Omit<Toast, "id">) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { ...t, id }]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 4200);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none max-w-[92vw]">
        {toasts.map(toast => (
          <div key={toast.id} className={`pointer-events-auto min-w-[320px] max-w-[420px] rounded-[18px] border bg-white p-4 shadow-[0_16px_48px_rgba(0,166,158,0.18)] backdrop-blur-xl animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)] dark:bg-slate-900 dark:border-slate-800 ${toast.type === "error" ? "border-red-200" : toast.type === "success" ? "border-emerald-200" : toast.type === "warning" ? "border-amber-200" : "border-slate-200"}`}>
            <div className="flex gap-3">
              <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 animate-pulse ${toast.type === "error" ? "bg-red-500" : toast.type === "success" ? "bg-emerald-500" : toast.type === "warning" ? "bg-amber-500" : "bg-[#3B82F6]"}`} />
              <div className="flex-1">
                <div className="text-[13.5px] font-semibold text-[#0B3D3A] tracking-tight dark:text-white">{toast.title}</div>
                {toast.description && <div className="mt-1 text-[13px] leading-5 text-slate-600 dark:text-slate-400">{toast.description}</div>}
              </div>
              <button onClick={() => setToasts(prev => prev.filter(x => x.id !== toast.id))} className="h-6 w-6 grid place-items-center rounded-full text-slate-400 hover:text-slate-700">✕</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be in provider");
  return ctx;
}
