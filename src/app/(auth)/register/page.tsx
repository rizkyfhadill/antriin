"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { RSHSLogo, RSHSMark } from "@/components/ui/rshs-logo";
import { setToken, setStoredUser } from "@/lib/session";
import { getProvinces, getCitiesByProvince, type Province, type City } from "@/lib/indonesia-regions";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", province: "", city: "" });
  const [loading, setLoading] = useState(false);
  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const router = useRouter();
  const { addToast } = useToast();

  const provinces = getProvinces();

  useEffect(() => {
    if (form.province) {
      const cities = getCitiesByProvince(form.province);
      setAvailableCities(cities);
      setForm(f => ({ ...f, city: "" }));
    } else {
      setAvailableCities([]);
    }
  }, [form.province]);

  const submit = async (e: any) => {
    e.preventDefault();
    if (form.password.length < 6) { addToast({ title:"Password minimal 6 karakter", type:"error" }); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, role: "customer" }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast({ title: "Gagal daftar RSHS", description: data.error, type: "error" });
      } else {
        if (data.token) setToken(data.token);
        if (data.user) {
          setStoredUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
          });
        }
        addToast({ title: `Akun RSHS dibuat!`, description: `Selamat datang, ${form.name}`, type: "success" });
        window.location.href = "/dashboard";
      }
    } catch {
      addToast({ title: "Error koneksi", type: "error" });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_0.9fr] bg-[#FCFCFD] dark:bg-[#020617]">
      <div className="flex flex-col justify-center px-6 sm:px-12 py-10">
        <div className="mx-auto w-full max-w-[460px]">
          <div className="flex items-center justify-between pb-6 border-b border-slate-200/70 dark:border-white/10">
            <RSHSLogo variant="full" size={44} />
            <Link href="/login" className="link-hover-yellow flex items-center gap-1.5 text-[12px] font-[600] text-slate-600 dark:text-slate-300 hover:text-[#C8D400]">
              <span>←</span> Login
            </Link>
          </div>

          <div className="mt-6 inline-flex rounded-full bg-[#00A69E]/10 border border-[#00A69E]/20 px-3 py-1 text-[11px] font-[700] text-[#00A69E] items-center gap-1.5 pill-hover-yellow cursor-pointer">
            <RSHSMark size={14} />
            PENDAFTARAN PASIEN RSHS • PASTEUR 38
          </div>
          <h1 className="mt-4 text-[28px] font-[800] tracking-[-0.03em] leading-[1.05] text-[#0B3D3A] dark:text-white">Daftar akun<br/><span className="text-[#00A69E]">Antriin RSHS Bandung</span></h1>
          <p className="mt-2 text-[13px] leading-[1.5] text-slate-600 dark:text-slate-400">Untuk pasien BPJS & Umum RSHS. Daftar akun pasien, ambil antrean poli dari rumah, dan pantau estimasi realtime.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="NAMA LENGKAP *" value={form.name} onChange={(e:any)=>setForm({...form, name:e.target.value})} required placeholder="Nama sesuai KTP/BPJS" className="hover:border-[#C8D400] focus:border-[#C8D400] focus:ring-[#C8D400]/20" />
              <Input label="NO. HP (WA)" value={form.phone} onChange={(e:any)=>setForm({...form, phone:e.target.value})} placeholder="0812..." className="hover:border-[#C8D400] focus:border-[#C8D400] focus:ring-[#C8D400]/20" />
            </div>
            <Input label="EMAIL *" type="email" value={form.email} onChange={(e:any)=>setForm({...form, email:e.target.value})} required placeholder="email@contoh.com" className="hover:border-[#C8D400] focus:border-[#C8D400] focus:ring-[#C8D400]/20" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold tracking-widest text-slate-500 dark:text-slate-400">PROVINSI *</label>
                <select value={form.province} onChange={(e:any)=>setForm({...form, province:e.target.value})} className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-[14px] outline-none hover:border-[#C8D400] focus:border-[#C8D400] focus:ring-4 focus:ring-[#C8D400]/20 transition-all">
                  <option value="">-- Pilih Provinsi --</option>
                  {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold tracking-widest text-slate-500 dark:text-slate-400">KOTA/KABUPATEN *</label>
                <select value={form.city} onChange={(e:any)=>setForm({...form, city:e.target.value})} disabled={!form.province} className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-[14px] outline-none hover:border-[#C8D400] focus:border-[#C8D400] focus:ring-4 focus:ring-[#C8D400]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  <option value="">-- Pilih Kota/Kabupaten --</option>
                  {availableCities.map(c => <option key={c.code} value={`${c.type} ${c.name}`}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <Input label="PASSWORD * MIN 6" type="password" value={form.password} onChange={(e:any)=>setForm({...form, password:e.target.value})} required placeholder="Buat password aman" className="hover:border-[#C8D400] focus:border-[#C8D400] focus:ring-[#C8D400]/20" />
            <div className="rounded-[16px] border border-[#00A69E]/20 bg-[#00A69E]/5 p-4 card-hover-yellow">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-[#00A69E] text-white grid place-items-center text-[14px] shrink-0 icon-hover-yellow">✓</div>
                <div>
                  <div className="text-[12px] font-[800] tracking-widest text-[#00A69E]">AKUN PASIEN RSHS</div>
                  <p className="mt-1 text-[12px] leading-[1.5] text-slate-600 dark:text-slate-400">Pendaftaran mandiri hanya untuk pasien. Akun direktur, manager poli, dan petugas poli dibuat oleh administrator RSHS.</p>
                </div>
              </div>
            </div>
            <Button type="submit" loading={loading} size="lg" className="w-full rounded-full">Daftar akun RSHS → Gratis</Button>
            <div className="text-[11px] text-slate-500 text-center">Dengan mendaftar, kamu setuju data dipakai untuk antrean RSHS Pasteur 38.</div>
          </form>

          <div className="mt-6 text-center text-[13px] text-slate-600 dark:text-slate-400">Sudah punya akun RSHS? <Link href="/login" className="link-hover-yellow font-[700] text-[#00A69E]">Masuk Dashboard RSHS</Link></div>
        </div>
      </div>

      <div className="hidden lg:flex relative overflow-hidden bg-[#007A74] p-10 flex-col justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(600px_400px_at_20%_80%,rgba(255,255,255,0.08),transparent)]" />
        <div className="relative text-[11px] tracking-widest font-[700] text-white/60">RSUP DR. HASAN SADIKIN • PASTEUR NO.38 • BANDUNG • RSHS.GO.ID</div>
        <div className="relative">
          <div className="text-[34px] font-[800] leading-[0.9] tracking-[-0.03em] text-white">Antrean RSHS<br/>lebih manusiawi,<br/><span className="text-[#C8D400]">tidak subuh lagi.</span></div>
          <div className="mt-6 space-y-3 text-[13px] text-white/80">
            <div className="flex gap-2"><span className="text-[#C8D400]">✓</span><span>Ambil nomor poli RSHS dari rumah (Garut, Tasik, Cirebon tidak perlu menginap di Bandung)</span></div>
            <div className="flex gap-2"><span className="text-[#C8D400]">✓</span><span>QR check-in di Kemuning Lt.2, anti calo, BPJS & Umum tertib</span></div>
            <div className="flex gap-2"><span className="text-[#C8D400]">✓</span><span>Display TV besar + suara panggilan otomatis, ruang tunggu ber-AC</span></div>
          </div>
          <div className="mt-8 rounded-[18px] bg-white text-[#0B3D3A] p-5 card-hover-yellow">
            <div className="text-[12px] font-[700]">🗣️ Kata pasien RSHS asal Tasik</div>
            <p className="mt-2 text-[13px] leading-[1.5] text-slate-700">"Sistem baru RSHS sangat membantu. Saya dari Tasik kontrol Poli Jantung sebulan sekali. Dulu harus sewa kos di Bandung. Sekarang ambil antrean online jam 7 pagi, berangkat jam 8, sampai jam 11 pas giliran. Hemat 200rb tidak perlu nginep."</p>
            <div className="mt-3 text-[11px] text-slate-500">— Pak Dede, 58th, Pasien Jantung RSHS, Tasikmalaya</div>
          </div>
        </div>
        <div className="relative flex justify-between text-[11px] tracking-widest text-white/50"><span>© 2026 RSHS BANDUNG • PASTEUR 38</span><span>BPJS • UMUM • EKSEKUTIF</span></div>
      </div>
    </div>
  );
}
