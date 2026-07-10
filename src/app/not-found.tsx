import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center bg-[#FCFCFD] p-6">
      <div className="text-center max-w-[480px]">
        <div className="mx-auto h-20 w-20 rounded-[24px] bg-[#00A69E] grid place-items-center text-white text-[32px] font-bold">404</div>
        <h1 className="mt-6 text-[32px] font-semibold tracking-tight">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-[14px] text-slate-600">Sepertinya halaman yang kamu cari tidak ada atau sudah dipindahkan. Mari kembali ke beranda.</p>
        <div className="mt-6 flex justify-center gap-3"><Link href="/"><Button variant="primary">Kembali ke beranda</Button></Link><Link href="/dashboard"><Button variant="secondary">Dashboard</Button></Link></div>
      </div>
    </div>
  );
}
