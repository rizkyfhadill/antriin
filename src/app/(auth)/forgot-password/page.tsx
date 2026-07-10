"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { RSHSLogo, RSHSMark } from "@/components/ui/rshs-logo";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "reset" | "success">("email");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast({ title: "Email wajib diisi", type: "error" });
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setStep("reset");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      addToast({ title: "Password minimal 6 karakter", type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast({ title: "Konfirmasi password tidak cocok", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast({ title: "Gagal reset password", description: data.error, type: "error" });
      } else {
        setStep("success");
        addToast({ title: "Password berhasil direset!", type: "success" });
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
            <Link href="/login" className="link-hover-yellow flex items-center gap-1.5 text-[12px] font-[600] text-slate-600 dark:text-slate-300 hover:text-[#C8D400]">
              <span>←</span> Login
            </Link>
          </div>

          {step === "email" && (
            <>
              <div className="inline-flex rounded-full bg-[#00A69E]/10 border border-[#00A69E]/20 px-3 py-1 text-[11px] font-[700] text-[#00A69E] pill-hover-yellow cursor-pointer">LUPA PASSWORD</div>
              <h1 className="mt-4 text-[28px] font-[800] tracking-[-0.03em] leading-[1.05] text-[#0B3D3A] dark:text-white">Reset Password Akun RSHS</h1>
              <p className="mt-3 text-[13px] leading-[1.5] text-slate-600 dark:text-slate-400">Masukkan email terdaftar Anda. Kami akan memverifikasi dan membantu Anda membuat password baru.</p>

              <form onSubmit={handleCheckEmail} className="mt-7 space-y-4">
                <Input label="EMAIL TERDAFTAR" value={email} onChange={(e: any) => setEmail(e.target.value)} type="email" placeholder="contoh@rshs.go.id" required className="hover:border-[#C8D400] focus:border-[#C8D400] focus:ring-[#C8D400]/20" />
                <Button type="submit" loading={loading} variant="primary" size="lg" className="w-full rounded-full">Lanjutkan →</Button>
              </form>

              <div className="mt-6 text-center text-[13px] text-slate-600 dark:text-slate-400">
                Ingat password? <Link href="/login" className="link-hover-yellow font-[700] text-[#00A69E]">Masuk di sini</Link>
              </div>
            </>
          )}

          {step === "reset" && (
            <>
              <div className="inline-flex rounded-full bg-[#00A69E]/10 border border-[#00A69E]/20 px-3 py-1 text-[11px] font-[700] text-[#00A69E] pill-hover-yellow cursor-pointer">BUAT PASSWORD BARU</div>
              <h1 className="mt-4 text-[28px] font-[800] tracking-[-0.03em] leading-[1.05] text-[#0B3D3A] dark:text-white">Password Baru</h1>
              <p className="mt-3 text-[13px] leading-[1.5] text-slate-600 dark:text-slate-400">
                Email terverifikasi: <span className="font-[700] text-[#00A69E]">{email}</span>. Silakan buat password baru yang aman.
              </p>

              <form onSubmit={handleResetPassword} className="mt-7 space-y-4">
                <Input label="PASSWORD BARU (MIN 6 KARAKTER)" value={newPassword} onChange={(e: any) => setNewPassword(e.target.value)} type="password" placeholder="••••••••" required className="hover:border-[#C8D400] focus:border-[#C8D400] focus:ring-[#C8D400]/20" />
                <Input label="KONFIRMASI PASSWORD" value={confirmPassword} onChange={(e: any) => setConfirmPassword(e.target.value)} type="password" placeholder="••••••••" required className="hover:border-[#C8D400] focus:border-[#C8D400] focus:ring-[#C8D400]/20" />
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <div className="text-[12px] text-red-500 font-[600]">⚠ Password tidak cocok</div>
                )}
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" size="lg" className="flex-1 rounded-full" onClick={() => setStep("email")}>← Kembali</Button>
                  <Button type="submit" loading={loading} variant="primary" size="lg" className="flex-[2] rounded-full">Simpan Password Baru</Button>
                </div>
              </form>
            </>
          )}

          {step === "success" && (
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 grid place-items-center text-[32px]">✅</div>
              <h1 className="mt-5 text-[26px] font-[800] tracking-[-0.03em] text-[#0B3D3A] dark:text-white">Password Berhasil Direset!</h1>
              <p className="mt-3 text-[13px] leading-[1.5] text-slate-600 dark:text-slate-400">Password akun <span className="font-[700] text-[#00A69E]">{email}</span> telah diperbarui. Silakan masuk menggunakan password baru Anda.</p>
              <Button variant="primary" size="lg" className="mt-6 w-full rounded-full" onClick={() => router.push("/login")}>Masuk ke Dashboard →</Button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-400">
            © 2026 RSUP Dr. Hasan Sadikin Bandung • Jl. Pasteur No.38 • (022) 2032214
          </div>
        </div>
      </div>

      {/* Right side - info panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-[#007A74] p-10 flex-col justify-between">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(600px_400px_at_80%_20%,rgba(255,255,255,0.08),transparent)]" />
        </div>
        <div className="relative text-white/60 text-[11px] tracking-[0.2em] font-[700]">RSUP DR. HASAN SADIKIN BANDUNG</div>
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
