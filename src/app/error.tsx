"use client";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen grid place-items-center bg-[#FCFCFD] p-6">
      <div className="text-center max-w-[480px]">
        <div className="mx-auto h-20 w-20 rounded-[24px] bg-red-500 grid place-items-center text-white text-[28px] font-bold">!</div>
        <h1 className="mt-6 text-[28px] font-semibold tracking-tight">Terjadi kesalahan</h1>
        <p className="mt-2 text-[14px] text-slate-600 break-all">{error.message || "Internal error"}</p>
        <div className="mt-6 flex justify-center gap-3"><Button variant="primary" onClick={()=>reset()}>Coba lagi</Button><Button variant="secondary" onClick={()=>window.location.href="/"}>Beranda</Button></div>
      </div>
    </div>
  );
}
