"use client";
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
import { RSHSMark } from "@/components/ui/rshs-logo";
import { authFetch, setStoredUser } from "@/lib/session";
import { useAuth } from "@/lib/useAuth";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function ProfilePage() {
  const { user: authUser, refreshUser, logout } = useAuth();
  const user = authUser;
  const [form, setForm] = useState({ name: "", phone: "", city: "" });
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (authUser) {
      setForm({ name: authUser.name || "", phone: authUser.phone || "", city: authUser.city || "" });
      setAvatarUrl(authUser.avatarUrl || "");
      setLoading(false);
    }
  }, [authUser]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi file
    if (!file.type.startsWith("image/")) {
      addToast({ title: "Hanya file gambar yang diperbolehkan", type: "error" });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      addToast({ title: "Ukuran file maksimal 2MB", type: "error" });
      return;
    }

    // Convert ke base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setAvatarUrl(base64);
      addToast({ title: "Foto profil diperbarui", type: "success" });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!form.name.trim()) {
      addToast({ title: "Nama wajib diisi", type: "error" });
      return;
    }

    setSaving(true);
    try {
      const res = await authFetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          city: form.city,
          avatarUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        addToast({ title: "Gagal menyimpan", description: data.error, type: "error" });
      } else {
        // Update localStorage dan refresh auth context
        setStoredUser({ ...user, ...data.user });
        await refreshUser();
        addToast({ title: "Profil berhasil diperbarui!", type: "success" });
      }
    } catch (error) {
      addToast({ title: "Error koneksi", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    addToast({ title: "Foto profil dihapus", type: "success" });
  };

  if (loading) return <div className="min-h-screen grid place-items-center bg-[#FCFCFD] dark:bg-[#020617]"><div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#00A69E]" /></div>;
  if (!user) return <div className="min-h-screen grid place-items-center">Unauthorized - <Link href="/login" className="underline">Login</Link></div>;

  return (
    <div className="min-h-screen bg-[#FCFCFD] dark:bg-[#020617] flex flex-col">
      {/* Navbar */}
      <Navbar user={user} onLogout={logout} rshsMode />

      <div className="flex-1 p-6">
        <div className="mx-auto max-w-[720px]">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-[13px] text-slate-600 dark:text-slate-400 hover:text-[#00A69E]">← Kembali ke Dashboard</Link>
          </div>
        <h1 className="mt-6 text-[30px] font-[700] tracking-tight dark:text-white">Pengaturan Akun - Premium</h1>
        <p className="text-[13px] text-slate-600 dark:text-slate-400 mt-1">Kelola profil, keamanan, dan preferensi akun Antriin kamu.</p>

        <div className="mt-8 grid gap-6">
          {/* Profile Edit Card */}
          <Card className="p-6 sm:p-7">
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-col items-center gap-3">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-2xl overflow-hidden shadow-md bg-gradient-to-br from-[#00A69E]/20 to-[#C8D400]/20">
                    {avatarUrl ? (
                      <img src={avatarUrl} className="h-full w-full object-cover" alt="Avatar" />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-[32px] font-[800] text-[#00A69E]">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center text-white text-[11px] font-[600]"
                  >
                    📷 Ubah
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <div className="flex gap-2 w-full">
                  <Button size="sm" variant="secondary" className="rounded-full h-7 text-[11px] flex-1" onClick={() => fileInputRef.current?.click()}>Upload</Button>
                  {avatarUrl && (
                    <Button size="sm" variant="ghost" className="rounded-full h-7 text-[11px] flex-1" onClick={handleRemoveAvatar}>Hapus</Button>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 text-center">Maks 2MB</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <div className="text-[18px] font-[700] tracking-tight dark:text-white">{user.name}</div>
                  <span className="rounded-full bg-[#00A69E] text-white px-2.5 py-1 text-[10px] font-[700] tracking-widest">{user.role.toUpperCase()}</span>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 text-[10px] font-[700]">✓ Verified</span>
                </div>
                <div className="text-[13px] text-slate-500">{user.email}</div>
                {form.city && <div className="text-[12.5px] text-slate-400 mt-1">📍 {form.city}</div>}
                {form.phone && <div className="text-[12.5px] text-slate-400">📱 {form.phone}</div>}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-[700] text-[14px] mb-4">Informasi Profil</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="NAMA LENGKAP" value={form.name} onChange={(e:any)=>setForm({...form, name:e.target.value})} required className="hover:border-[#C8D400] focus:border-[#C8D400] focus:ring-[#C8D400]/20" />
                <Input label="NO. HP / WHATSAPP" value={form.phone} onChange={(e:any)=>setForm({...form, phone:e.target.value})} placeholder="0812..." className="hover:border-[#C8D400] focus:border-[#C8D400] focus:ring-[#C8D400]/20" />
                <Input label="KOTA DOMISILI" value={form.city} onChange={(e:any)=>setForm({...form, city:e.target.value})} placeholder="Kota/Kabupaten" className="hover:border-[#C8D400] focus:border-[#C8D400] focus:ring-[#C8D400]/20" />
                <Input label="EMAIL" value={user.email} disabled className="opacity-75 cursor-not-allowed" />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="primary" className="rounded-full" onClick={handleSaveProfile} loading={saving}>
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
                <Button variant="secondary" className="rounded-full" onClick={()=>setForm({ name:user.name, phone:user.phone||"", city:user.city||"" })} disabled={saving}>
                  Reset
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-[600] dark:text-white">Keamanan & Session</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-[14px] border border-slate-100 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div><div className="text-[13px] font-[550]">Ubah password</div><div className="text-[11px] text-slate-500">Terakhir diubah 2 minggu lalu - Aman</div></div>
                <Button size="sm" variant="secondary" className="rounded-full" onClick={()=>addToast({title:"Fitur ubah password", description:"Hubungi admin untuk reset via email (demo).", type:"info"})}>Ubah →</Button>
              </div>
              <div className="flex items-center justify-between rounded-[14px] border border-slate-100 dark:border-slate-800 p-4">
                <div><div className="text-[13px] font-[550]">Session aktif & Remember Me</div><div className="text-[11px] text-slate-500">Login bertahan hingga refresh - Cookie httpOnly 7-30 hari - Aman</div></div>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 text-[11px] font-[600]">Aktif - Secure</span>
              </div>
              <div className="flex items-center justify-between rounded-[14px] border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-4">
                <div><div className="text-[13px] font-[550] text-amber-900 dark:text-amber-200">2FA - Keamanan ekstra (soon)</div><div className="text-[11px] text-amber-700 dark:text-amber-300">Tambah verifikasi OTP via WhatsApp / Email</div></div>
                <span className="text-[11px] bg-white dark:bg-slate-900 border px-2 py-1 rounded-full">Coming soon</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-[600] dark:text-white">Preferensi & Notifikasi</h3>
            <div className="mt-4 space-y-3 text-[13px]">
              <label className="flex items-center justify-between rounded-[12px] border border-slate-100 dark:border-slate-800 p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"><span>Notifikasi antrean hampir tiba (push + toast)</span><input type="checkbox" defaultChecked className="h-4 w-4" /></label>
              <label className="flex items-center justify-between rounded-[12px] border border-slate-100 dark:border-slate-800 p-3 cursor-pointer hover:bg-slate-50"><span>Suara panggilan TTS di dashboard operator</span><input type="checkbox" defaultChecked className="h-4 w-4" /></label>
              <label className="flex items-center justify-between rounded-[12px] border border-slate-100 dark:border-slate-800 p-3 cursor-pointer hover:bg-slate-50"><span>Email laporan mingguan AI insight</span><input type="checkbox" className="h-4 w-4" /></label>
            </div>
          </Card>

          <div className="flex justify-between items-center text-[11px] text-slate-400 flex-wrap gap-2"><span>&copy; 2026 RSUP Dr. Hasan Sadikin Bandung - Sistem Antrean Digital Resmi Kemenkes</span><Link href="/dashboard" className="underline hover:text-[#00A69E]">Kembali ke dashboard</Link></div>
        </div>
      </div>
    </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
