"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { RSHSLogo, RSHSMark } from "@/components/ui/rshs-logo";
import { setToken, setStoredUser } from "@/lib/session";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, remember }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast({ title: "Gagal masuk RSHS", description: data.hint ? `${data.error}. ${data.hint}` : data.error, type: "error" });
      } else {
        if (data.token) setToken(data.token);
        if (data.user) {
          setStoredUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            avatarUrl: data.user.avatarUrl || null,
          });
        }
        addToast({ title: `Selamat datang, ${data.user.name.split(" ")[0]}!`, description: `Masuk sebagai ${data.user.role}`, type: "success" });
        window.location.href = "/dashboard";
      }
    } catch {
      addToast({ title: "Error koneksi", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_0.9fr] bg-[#FCFCFD] dark:bg-[#020617]">
      <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12">
        <div className="mx-auto w-full max-w-[440px]">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="transition-transform duration-300 group-hover:scale-105"><RSHSLogo variant="horizontal" size={40} /></div>
            </Link>
            <Link href="/" className="link-hover-yellow flex items-center gap-1.5 text-[12px] font-[600] text-slate-600 dark:text-slate-300 hover:text-[#C8D400]">
              <span>←</span> Kembali
            </Link>
          </div>

          <div className="mt-6">
            <div className="inline-flex rounded-full bg-[#00A69E]/10 border border-[#00A69E]/20 px-3 py-1 text-[11px] font-[700] text-[#00A69E] pill-hover-yellow cursor-pointer">
              <RSHSMark size={14} />
              RESMI KEMENKES RSHS • PASTEUR NO.38 BANDUNG
            </div>
            <h1 className="mt-4 text-[28px] font-[800] tracking-[-0.03em] leading-[1.05] text-[#0B3D3A] dark:text-white">Masuk Dashboard<br/><span className="text-[#00A69E]">Antrean RSHS Bandung</span></h1>
            <p className="mt-3 text-[13px] leading-[1.5] text-slate-600 dark:text-slate-400">Untuk pasien, petugas poli, manager, dan direktur RSHS.</p>
          </div>

          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            <Input label="EMAIL" value={email} onChange={(e:any)=>setEmail(e.target.value)} type="email" placeholder="contoh@rshs.go.id" required className="hover:border-[#C8D400] focus:border-[#C8D400] focus:ring-[#C8D400]/20" />
            <div>
              <div className="flex justify-between items-center mb-1.5"><label className="text-[11px] font-semibold tracking-widest text-slate-500">PASSWORD</label><Link href="/forgot-password" className="link-hover-yellow text-[11px] text-[#00A69E] font-[600]">Lupa password?</Link></div>
              <div className="relative">
                <input value={password} onChange={e=>setPassword(e.target.value)} type={showPassword? "text" : "password"} placeholder="Masukkan password" className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 pr-12 text-[14px] outline-none hover:border-[#C8D400] focus:border-[#C8D400] focus:ring-4 focus:ring-[#C8D400]/20 transition-all" required />
                <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center rounded-full icon-hover-yellow text-[12px]">{showPassword ? "🙈" : "️"}</button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-[13px] hover:text-[#C8D400] transition-colors cursor-pointer"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} className="h-4 w-4 rounded hover:accent-[#C8D400]" /> Ingat saya (30 hari)</label>
            <Button type="submit" loading={loading} variant="primary" size="lg" className="w-full rounded-full mt-1">Masuk Dashboard RSHS →</Button>
          </form>

          <div className="mt-6 rounded-[18px] border border-[#00A69E]/20 bg-[#00A69E]/5 dark:bg-[#00A69E]/10 p-4 card-hover-yellow">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-8 w-8 rounded-full bg-[#00A69E] text-white grid place-items-center text-[14px] shrink-0 icon-hover-yellow">i</div>
              <div>
                <div className="text-[12px] font-[800] tracking-widest text-[#00A69E]">AKSES SISTEM RSHS</div>
                <p className="mt-1 text-[12px] leading-[1.5] text-slate-600 dark:text-slate-400">Login hanya untuk akun terdaftar. Akun direktur, manager poli, dan petugas poli disediakan oleh administrator.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-[13px] text-slate-600 dark:text-slate-400">Pasien baru RSHS? <Link href="/register" className="link-hover-yellow font-[700] text-[#00A69E]">Daftar akun pasien RSHS</Link></div>
          <div className="mt-4 text-center text-[11px] text-slate-400">© 2026 RSHS Bandung • Jl. Pasteur No.38 • (022) 2032214</div>
        </div>
      </div>

      {/* Right side */}
      <div className="hidden lg:flex relative overflow-hidden bg-[#007A74] p-10 flex-col justify-between">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(600px_400px_at_80%_20%,rgba(255,255,255,0.08),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(500px_300px_at_20%_80%,rgba(0,0,0,0.15),transparent)]" />
        </div>
        <div className="relative text-white/60 text-[11px] tracking-[0.2em] font-[700]">RSUP DR. HASAN SADIKIN BANDUNG • PASTEUR NO.38 • JAWA BARAT</div>
        <div className="relative space-y-6">
          <div>
            <h2 className="text-[32px] font-[800] leading-[0.95] tracking-[-0.03em] text-white">Keamanan Akun<br/>adalah <span className="text-[#C8D400]">Prioritas</span></h2>
            <p className="mt-4 text-[14px] leading-[1.5] text-white/80 max-w-[380px]">Kami melindungi data pasien dengan enkripsi BCrypt dan sistem otentikasi token yang aman. Password Anda tidak pernah disimpan dalam bentuk plain text.</p>
          </div>
          <div className="space-y-3">
            {[
              { icon: "🔐", title: "Enkripsi BCrypt", desc: "Password di-hash dengan 10 rounds salt" },
              { icon: "🛡️", title: "JWT Token Aman", desc: "Session dengan HTTP-only cookie + Bearer token" },
              { icon: "📧", title: "Verifikasi Email", desc: "Hanya email terdaftar yang bisa reset password" },
            ].map(item => (
              <div key={item.title} className="rounded-xl bg-white/10 border border-white/15 backdrop-blur p-4 flex gap-3 card-hover-yellow">
                <div className="text-[20px]">{item.icon}</div>
                <div><div className="text-[13px] font-[700] text-white">{item.title}</div><div className="text-[12px] text-white/70 mt-0.5">{item.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-[11px] tracking-widest text-white/50">BLU KEMENKES • FK UNPAD • BPJS KESEHATAN</div>
      </div>
    </div>
  );
}
