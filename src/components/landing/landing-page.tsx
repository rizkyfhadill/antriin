"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardGlass } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { useToast } from "@/components/ui/toast";
import { Progress } from "@/components/ui/progress";
import { RSHSLogo, RSHSMark } from "@/components/ui/rshs-logo";
import { authFetch, getStoredUser, clearSession } from "@/lib/session";

export function LandingPage() {
  const [user, setUser] = useState<any>(getStoredUser());
  const [stats, setStats] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [queues, setQueues] = useState<any[]>([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { addToast } = useToast();

  useEffect(() => {
    authFetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.user) setUser(d.user); else if (!getStoredUser()) setUser(null); })
      .catch(()=>{});
    
    // Fetch real data from database
    Promise.all([
      fetch("/api/analytics").then(r => r.json()),
      fetch("/api/locations").then(r => r.json()),
      fetch("/api/queues").then(r => r.json()),
    ]).then(([analyticsData, locationsData, queuesData]) => {
      setStats(analyticsData);
      setLocations(locationsData.locations?.slice(0, 3) || []);
      setQueues(queuesData.queues || []);
    }).catch(()=>{});

    const interval = setInterval(() => setActiveTestimonial(prev => (prev + 1) % 3), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try { await authFetch("/api/auth/logout", { method: "POST" }); } catch {}
    clearSession();
    setUser(null);
    addToast({ title: "Berhasil keluar", type: "success" });
  };

  const testimonials = [
    { name: "Ibu Lastri", role: "Pasien BPJS asal Garut", avatar: "https://i.pravatar.cc/100?img=32", text: "Dulu harus berangkat jam 3 subuh dari Garut. Sekarang daftar online jam 7 pagi dari rumah, pantau waktu tunggu realtime, dan datang pas jam panggilan. Sangat menghemat tenaga." },
    { name: "Pak Asep", role: "Keluarga Pasien Poli Anak", avatar: "https://i.pravatar.cc/100?img=15", text: "Daftar untuk kontrol anak sangat mudah. Tinggal scan QR di loket Kemuning untuk check-in otomatis. TV display jelas dan bersuara memanggil nomor pasien." },
    { name: "dr. Nadya Prameswari", role: "Manager Rawat Jalan RSHS", avatar: "https://i.pravatar.cc/100?img=68", text: "Antrean poliklinik terpadu menjadi jauh lebih tertib dan kondusif. Prediksi AI membantu kami mengantisipasi lonjakan pasien dan mengoptimalkan penempatan petugas." },
  ];

  return (
    <div className="min-h-screen bg-[#FCFCFD] text-[#0B3D3A] dark:bg-[#020617] dark:text-white antialiased selection:bg-[#00A69E]/20 overflow-x-hidden">
      <Navbar user={user} onLogout={handleLogout} rshsMode />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="absolute inset-0 -z-10 bg-dot-grid opacity-40" />
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(1000px_500px_at_50%_-10%,rgba(0,166,158,0.1),transparent_60%)] dark:bg-[radial-gradient(1000px_500px_at_50%_-10%,rgba(0,166,158,0.15),transparent_60%)]" />
          <div className="absolute top-10 left-1/2 -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-gradient-to-r from-[#00A69E]/8 via-[#C8D400]/5 to-[#00A69E]/8 blur-[80px]" />
        </div>

        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[800px] text-center">
            {/* Endorsement Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 dark:border-white/10 bg-white/90 dark:bg-white/[0.04] pl-2 pr-3 py-1 shadow-sm backdrop-blur-xl mb-6">
              <RSHSMark size={24} />
              <span className="h-3 w-px bg-slate-200 dark:bg-white/15" />
              <span className="text-[11px] sm:text-[12px] font-[600] text-slate-700 dark:text-slate-300">
                Antrean Digital Resmi <span className="text-[#00A69E] font-[700]">RSUP Dr. Hasan Sadikin Bandung</span>
              </span>
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <h1 className="text-[32px] sm:text-[48px] lg:text-[56px] font-[800] leading-[1.05] tracking-[-0.03em] text-slate-900 dark:text-white">
              Tidak Perlu Antre Subuh,<br />
              <span className="text-rshs-gradient">Daftar Poli dari Rumah.</span>
            </h1>

            <p className="mx-auto mt-4 sm:mt-5 max-w-[580px] text-[14px] sm:text-[16px] leading-[1.5] text-slate-600 dark:text-slate-400">
              Sistem antrean pintar RSHS Bandung. Ambil nomor antrean rawat jalan dari rumah, pantau waktu tunggu secara akurat, dan check-in praktis dengan QR Code di Gedung Kemuning.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href={user ? "/dashboard" : "/register"} className="w-full sm:w-auto max-w-[280px]">
                <Button size="lg" variant="primary" className="w-full rounded-full bg-[#00A69E] hover:bg-[#008F88] text-[13.5px] font-[600] h-11">
                  Ambil Antrean Poli
                </Button>
              </Link>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto max-w-[280px] rounded-full border-slate-200 hover:bg-slate-50 text-[13.5px] h-11" onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}>
                Lihat Panduan Alur
              </Button>
            </div>

            {/* Quick Specs */}
            <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4 max-w-[540px] mx-auto">
              {[
                { v: "20+", l: "Poli Spesialis" },
                { v: "500", l: "Kuota Terpadu" },
                { v: "07:00", l: "Pendaftaran Buka" },
              ].map(s=>(
                <div key={s.l} className="rounded-xl border border-slate-200/50 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] p-2.5 sm:p-3 text-center">
                  <div className="font-[800] text-[14px] sm:text-[16px] text-[#00A69E]">{s.v}</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Creative Dashboard Mockup */}
          <div id="demo" className="relative mx-auto mt-12 max-w-[1000px]">
            {/* Browser Chrome */}
            <div className="bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-t-2xl p-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-amber-400 hover:bg-amber-500 transition-colors cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400 hover:bg-emerald-500 transition-colors cursor-pointer" />
                  </div>
                  <div className="ml-3 px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-[11px] text-slate-600 dark:text-slate-400 font-mono flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    rshs.go.id/antriin
                  </div>
                </div>
                <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-[10px] font-[700] shadow-lg shadow-blue-500/30">
                  BPJS & UMUM
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 rounded-b-2xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="grid lg:grid-cols-[200px_1fr_220px] gap-4">
                
                {/* Left: Poli Services - Creative List */}
                <div className="space-y-3">
                  <div className="text-[10px] font-[800] text-slate-400 tracking-widest uppercase flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00A69E]" />
                    Layanan Poli
                  </div>
                  
                  {[
                    { name: "Farmasi Rawat Jalan", active: true, color: "from-teal-400 to-teal-600" },
                    { name: "Radiologi & Lab", active: false, color: "from-slate-400 to-slate-600" },
                    { name: "IGD 24 Jam", active: false, color: "from-slate-400 to-slate-600" }
                  ].map((poli, i) => (
                    <div key={i} className={`relative group cursor-pointer transition-all ${poli.active ? 'scale-105' : 'hover:scale-102'}`}>
                      <div className={`absolute inset-0 bg-gradient-to-r ${poli.color} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                      <div className={`relative p-3 rounded-xl border-2 ${poli.active ? 'border-[#00A69E] bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-950/30 dark:to-teal-900/30' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${poli.active ? 'bg-[#00A69E] animate-pulse' : 'bg-slate-300'}`} />
                          <span className={`text-[11px] font-[600] truncate ${poli.active ? 'text-[#0F172A] dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                            {poli.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Center: Active Queues - Modern Design */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-[700] text-slate-900 dark:text-white">Antrean Aktif</h3>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-[700] text-emerald-700 dark:text-emerald-400">LIVE</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Cards - Glassmorphism */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Menunggu", value: "25", color: "from-amber-400 to-orange-500", icon: "⏳" },
                      { label: "Dipanggil", value: "R102", color: "from-blue-400 to-blue-600", icon: "📢" },
                      { label: "Selesai", value: "4", color: "from-emerald-400 to-emerald-600", icon: "✅" }
                    ].map((stat, i) => (
                      <div key={i} className="relative group">
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-xl opacity-10 group-hover:opacity-20 transition-opacity`} />
                        <div className="relative bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                          <div className="text-[16px] mb-1">{stat.icon}</div>
                          <div className="text-[9px] text-slate-500 font-[500] mb-0.5">{stat.label}</div>
                          <div className="text-[18px] font-[800] text-slate-900 dark:text-white">{stat.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Queue List - Modern Cards */}
                  <div className="space-y-2">
                    {[
                      { ticket: "P100", name: "Pasien", poli: "Poli", status: "WAITING", color: "amber" },
                      { ticket: "P042", name: "Pasien", poli: "Poli", status: "WAITING", color: "amber" },
                      { ticket: "P101", name: "Pasien", poli: "Poli", status: "WAITING", color: "amber" }
                    ].map((q, i) => (
                      <div key={i} className="group bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 hover:border-[#00A69E] hover:shadow-lg hover:shadow-[#00A69E]/10 transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A69E] to-[#008F88] flex items-center justify-center text-white font-[700] text-[12px] group-hover:scale-110 transition-transform">
                                {q.ticket}
                              </div>
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse" />
                            </div>
                            <div>
                              <div className="text-[12px] font-[600] text-slate-900 dark:text-white">{q.name}</div>
                              <div className="text-[10px] text-slate-500">{q.poli}</div>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded-lg text-[9px] font-[700] ${q.color === 'amber' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700'}`}>
                            {q.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: AI & QR - Creative Cards */}
                <div className="space-y-4">
                  {/* AI Card - Gradient with Pattern */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 rounded-2xl" />
                    <div className="absolute inset-0 opacity-10">
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 100 100">
                        <circle cx="20" cy="20" r="15" />
                        <circle cx="70" cy="50" r="20" />
                        <circle cx="30" cy="80" r="12" />
                      </svg>
                    </div>
                    <div className="relative p-4 rounded-2xl overflow-hidden">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                          <span className="text-[14px]"></span>
                        </div>
                        <div className="text-[10px] font-[800] text-white/90 tracking-wider">AI ESTIMASI</div>
                      </div>
                      <div className="text-[28px] font-[800] text-white leading-none mb-1">
                        20 <span className="text-[14px] font-[500]">Menit Lagi</span>
                      </div>
                      <div className="text-[11px] text-white/80">Rata-rata Poli</div>
                      <div className="mt-3 flex items-center gap-1 text-[10px] text-white/90">
                        <span></span>
                        <span>5 menit dari kemarin</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Card - Interactive */}
                  <div className="relative group">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border-2 border-slate-200 dark:border-slate-700 group-hover:border-[#00A69E] transition-all">
                      <div className="text-center">
                        <div className="text-[10px] font-[700] text-slate-400 mb-3">QR Check-in Pasien</div>
                        <div className="relative inline-block">
                          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#0F172A] to-[#0F172A] flex items-center justify-center group-hover:scale-105 transition-transform">
                            <div className="text-[10px] font-mono text-white font-[700]">
                              RSHS-P100
                            </div>
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <div className="mt-3 text-[9px] text-slate-500">Scan untuk check-in</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Endorsement Block */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pb-12">
          <div className="rounded-2xl border border-slate-200/50 dark:border-white/5 bg-white dark:bg-slate-900/40 p-5 flex flex-col md:flex-row items-center gap-4 sm:gap-6 shadow-sm card-hover-yellow">
          <RSHSLogo variant="horizontal" size={44} />
          <span className="hidden md:block h-6 w-px bg-slate-200 dark:bg-white/10" />
          <p className="flex-1 text-[13px] text-slate-600 dark:text-slate-400 text-center md:text-left leading-normal">
            Layanan resmi Kemenkes RI di RSUP Dr. Hasan Sadikin Bandung. Sistem dikelola langsung oleh tim IT RSHS Bandung untuk memastikan keamanan data rujukan BPJS dan kemudahan check-in pasien.
          </p>
          <div className="flex gap-2 shrink-0">
            <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 text-[11px] font-[700] flex items-center gap-1.5 pill-hover-yellow cursor-pointer"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />TERVERIFIKASI</span>
          </div>
        </div>
      </section>

      {/* Healthcare Stats - Creative & Unique Design */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pb-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Dokter Spesialis - Gradient Card */}
          <div className="relative group stat-hover-yellow">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-5 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 100 100">
                  <circle cx="20" cy="20" r="15" />
                  <circle cx="60" cy="40" r="20" />
                  <circle cx="30" cy="70" r="12" />
                  <circle cx="80" cy="80" r="18" />
                </svg>
              </div>
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-[42px] font-[800] text-white leading-none mb-1">
                  45+
                </div>
                <div className="text-[14px] text-white/90 font-[500]">Dokter Spesialis</div>
                <div className="mt-3 flex items-center gap-1 text-[11px] text-white/80">
                  <span className="text-white">↑</span>
                  <span>8 dari bulan lalu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Poli Tersedia - Glassmorphism Card */}
          <div className="relative group stat-hover-yellow">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-2xl" />
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl" />
            <div className="relative p-5 rounded-2xl overflow-hidden">
              {/* Animated Dots */}
              <div className="absolute top-2 right-2 flex gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: '200ms' }} />
                <div className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: '400ms' }} />
              </div>
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                  <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-[42px] font-[800] text-white leading-none mb-1">
                  {stats?.totalLocations || 4}
                </div>
                <div className="text-[14px] text-white/90 font-[500]">Poli Tersedia</div>
                <div className="mt-3 text-[11px] text-white/80">Semua aktif beroperasi</div>
              </div>
            </div>
          </div>

          {/* Antrian Hari Ini - Split Card */}
          <div className="relative group stat-hover-yellow">
            <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="h-16 bg-gradient-to-r from-emerald-400 to-emerald-600 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-end px-4">
                  <svg className="h-20 w-20 text-white/20" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="p-5">
                <div className="text-[42px] font-[800] text-slate-900 dark:text-white leading-none mb-1">
                  {stats?.totalQueues || 0}
                </div>
                <div className="text-[14px] text-slate-500 font-[500] mb-3">Antrian Hari Ini</div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-600 font-[600]">↑ 12% dari kemarin</span>
                  <span className="text-slate-400">Live</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Pelayanan - Interactive Card */}
          <div className="relative group stat-hover-yellow">
            <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800 p-5 relative overflow-hidden">
              {/* Background Stars Pattern */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/30">
                    <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-md">
                    <span className="text-[11px] font-[700] text-white">Excellent</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <div className="text-[42px] font-[800] text-slate-900 dark:text-white leading-none">
                    {stats?.avgRating || "4.9"}
                  </div>
                  <div className="text-[16px] text-slate-400 font-[600]">/5.0</div>
                </div>
                <div className="text-[14px] text-slate-500 font-[500] mb-3">Rating Pelayanan</div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`flex-1 h-8 rounded-lg transition-all ${i <= Math.round(stats?.avgRating || 5) ? 'bg-gradient-to-t from-amber-400 to-amber-300' : 'bg-slate-200 dark:bg-slate-700'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="fitur" className="bg-white dark:bg-slate-900 border-y border-slate-200/50 dark:border-slate-800 py-16 sm:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-10">
            <Badge variant="outline" hoverable className="rounded-full border-emerald-200 text-[#00A69E] px-3">LAYANAN UNGGULAN</Badge>
            <h2 className="mt-3 text-[28px] sm:text-[36px] font-[800] leading-none tracking-tight">Pelayanan Poli RSHS Modern</h2>
            <p className="mt-3 text-[14px] text-slate-600 dark:text-slate-400 leading-normal">
              Fitur khusus yang dirancang untuk mempercepat alur pelayanan BPJS dan Umum di Poliklinik Terpadu Gedung Kemuning.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🏥", title: "Pendaftaran Poli Online", desc: "Daftar untuk kontrol poli spesialis (Jantung, Anak, Dalam, dll) tanpa harus mengantre berkas fisik dari subuh." },
              { icon: "🤖", title: "AI Prediksi Waktu Tunggu", desc: "Analisis cerdas berdasarkan jam sibuk poli untuk memberikan estimasi kedatangan yang akurat bagi pasien luar kota." },
              { icon: "🎫", title: "QR Code Check-in", desc: "Scan tiket digital di depan pintu poli untuk check-in instan. Mencegah manipulasi antrean dan calo." },
              { icon: "📢", title: "Display TV & Suara Panggil", desc: "Layar monitor ruang tunggu memanggil nomor pasien otomatis menggunakan teknologi Text-to-Speech bahasa Indonesia." },
              { icon: "💊", title: "Farmasi Terpadu", desc: "Pantau pengerjaan resep obat BPJS atau umum. Menunggu obat jadi lebih nyaman tanpa penumpukan di loket." },
              { icon: "⭐", title: "Rating & Feedback Pasien", desc: "Beri ulasan dan rating langsung untuk dokter dan pelayanan poli setelah selesai tindakan medis." }
            ].map(f=>(
              <Card key={f.title} hover rshs className="p-5 flex flex-col gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6F7F5] text-[#00A69E] text-[18px] font-bold shadow-sm">{f.icon}</div>
                <h3 className="text-[14px] font-[700] text-slate-900 dark:text-white leading-tight">{f.title}</h3>
                <p className="text-[12.5px] leading-[1.5] text-slate-600 dark:text-slate-400">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Alur Pasien 3 Langkah */}
      <section id="cara-kerja" className="py-16 sm:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <Badge variant="outline" hoverable className="rounded-full border-emerald-200 text-[#00A69E]">ALUR PASIEN</Badge>
              <h2 className="mt-3 text-[28px] sm:text-[36px] font-[800] leading-none tracking-tight">3 Langkah Menggunakan Antrean</h2>
              <p className="mt-3 text-[14px] text-slate-600 dark:text-slate-400 leading-normal">
                Sangat mudah digunakan oleh seluruh rentang usia. Cukup ikuti tiga langkah simpel berikut untuk berobat ke RSHS Bandung.
              </p>
              <div className="mt-8 space-y-6">
                {[
                  { n: "01", t: "Pilih Poli & Ambil Nomor", d: "Buka Antriin RSHS, pilih poli spesialis tujuan Anda, lalu klik Ambil Antrean untuk mendapatkan nomor tiket digital." },
                  { n: "02", t: "Pantau Estimasi Kedatangan", d: "Lihat posisi antrean Anda secara realtime di HP. Anda dapat berangkat dari rumah sesuai waktu estimasi dari AI." },
                  { n: "03", t: "Scan QR & Mulai Tindakan", d: "Setibanya di Gedung Kemuning, scan tiket digital Anda di loket pendaftaran untuk check-in. Anda tinggal menunggu dipanggil masuk poli." }
                ].map(s=>(
                  <div key={s.n} className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00A69E] text-white text-[12.5px] font-[800] shadow-sm">{s.n}</div>
                    <div>
                      <h4 className="text-[14px] font-[700] text-slate-900 dark:text-white leading-tight">{s.t}</h4>
                      <p className="mt-1 text-[12.5px] leading-[1.5] text-slate-600 dark:text-slate-400">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Card className="p-6 sm:p-8 border-slate-200/60 bg-white shadow-xl max-w-[520px] mx-auto relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-40 h-40 opacity-5">
                  <svg className="w-full h-full" fill="currentColor" viewBox="0 0 100 100">
                    <circle cx="20" cy="20" r="15" />
                    <circle cx="70" cy="50" r="20" />
                    <circle cx="30" cy="80" r="12" />
                  </svg>
                </div>
                
                {/* Header */}
                <div className="relative flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v10H5V5zm2 2a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-[700] text-slate-900 dark:text-white">Tiket Antrean Aktif</h3>
                      <div className="text-[10px] text-slate-500">Real-time tracking</div>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-lg shadow-emerald-500/30">
                    <span className="text-[10px] font-[700] text-white">BPJS PASIEN</span>
                  </div>
                </div>

                {queues.length > 0 ? (
                  <>
                    {/* Main Ticket Card - Creative Design */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 rounded-2xl" />
                      <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 100 100">
                          <circle cx="80" cy="20" r="25" />
                          <circle cx="20" cy="70" r="15" />
                        </svg>
                      </div>
                      
                      <div className="relative p-5 rounded-2xl overflow-hidden">
                        {/* Top Row */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="text-[10px] font-[800] text-white/70 tracking-widest">POLI RSHS</div>
                            <div className="text-[42px] font-[800] text-white leading-none mt-1">
                              {queues[0].ticketNumber}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[28px] font-[800] text-white leading-none">
                              {queues[0].estimatedWaitMinutes}
                            </div>
                            <div className="text-[12px] font-[500] text-white/90">Menit Lagi</div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min(100, (queues[0].position / 10) * 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-white/80 font-[500]">{queues[0].operatorName || "Operator"}</span>
                          </div>
                          <span className="text-white/80 font-[500]">RSHS Bandung</span>
                        </div>
                      </div>
                    </div>

                    {/* Info Card - Creative */}
                    <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-800">
                      <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                      </div>
                      <div className="relative">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30">
                            <span className="text-[14px]">💡</span>
                          </div>
                          <div>
                            <div className="text-[12px] font-[700] text-amber-900 dark:text-amber-400 mb-1">Saran Kedatangan</div>
                            <div className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                              Berangkat dari lokasi Anda agar tiba di <strong>Jl. Pasteur No.38 Bandung</strong> tepat waktu. Siapkan KTP, kartu BPJS, dan surat rujukan FKTP Anda.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mt-4 text-center py-8">
                    <div className="text-[48px] mb-2">🎫</div>
                    <div className="text-[14px] font-[600] text-slate-600">Belum ada antrean aktif</div>
                    <div className="text-[12px] text-slate-500 mt-1">Ambil antrean untuk melihat tiket Anda di sini</div>
                    <Link href="/dashboard" className="mt-4 inline-block">
                      <Button size="sm" variant="primary" className="rounded-full bg-gradient-to-r from-[#00A69E] to-[#008F88] hover:shadow-lg hover:shadow-teal-500/30 transition-all">
                        Ambil Antrean Sekarang
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-200/50 dark:border-slate-800 py-16 sm:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-center">
            <div className="text-center lg:text-left">
              <Badge variant="navy" className="rounded-full bg-[#00A69E] text-white border-0 px-3 py-1">ULASAN PASIEN</Badge>
              <h2 className="mt-3 text-[28px] sm:text-[32px] font-[800] leading-tight tracking-tight">Dipercaya Oleh Pasien RSHS</h2>
              <p className="mt-2 text-[13px] text-slate-500 leading-normal">Feedback langsung dari pasien BPJS dan Umum yang merasakan langsung kemudahan antrean online.</p>
              <div className="mt-4 flex justify-center lg:justify-start gap-1">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setActiveTestimonial(i)} className={`h-1.5 rounded-full transition-all ${i === activeTestimonial ? "w-6 bg-[#00A69E]" : "w-1.5 bg-slate-300"}`} />
                ))}
              </div>
            </div>
            <Card className="p-5 sm:p-6 shadow-sm card-hover-yellow">
              <p className="text-[14px] sm:text-[15px] leading-[1.6] text-slate-700 dark:text-slate-300 italic font-[500]">
                "{testimonials[activeTestimonial].text}"
              </p>
              <div className="mt-4 flex items-center gap-3">
                <img src={testimonials[activeTestimonial].avatar} className="h-10 w-10 rounded-full object-cover" alt="" />
                <div>
                  <div className="text-[13px] font-[700] text-slate-900 dark:text-white leading-tight">{testimonials[activeTestimonial].name}</div>
                  <div className="text-[11px] text-slate-500">{testimonials[activeTestimonial].role}</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
              <Badge variant="outline" hoverable className="rounded-full border-emerald-200 text-[#00A69E]">BANTUAN PASIEN</Badge>
            <h2 className="text-[28px] font-[800] leading-none mt-2 tracking-tight">Pertanyaan yang Sering Diajukan</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "Apakah harus datang subuh untuk antre di RSHS?", a: "Tidak lagi! Pasien BPJS dan Umum kini dapat mengambil nomor antrean online dari rumah melalui HP mulai pukul 07:00 WIB. Anda cukup memantau waktu estimasi panggil AI dan datang 15 menit sebelum giliran." },
              { q: "Di mana lokasi tepatnya Poliklinik Terpadu?", a: "Poliklinik Terpadu RSHS berlokasi di Gedung Kemuning Lantai 2, RSUP Dr. Hasan Sadikin, Jl. Pasteur No.38, Bandung. Silakan parkir di gedung parkir baru Lantai 3-5 untuk kenyamanan Anda." },
              { q: "Dokumen apa saja yang perlu disiapkan untuk berobat?", a: "Untuk pasien BPJS, siapkan KTP asli, kartu BPJS Kesehatan, dan surat rujukan FKTP/RS tipe C/B yang masih aktif. Untuk pasien Umum, cukup bawa KTP asli." },
              { q: "Bagaimana cara melakukan check-in setelah sampai RSHS?", a: "Setibanya di lantai 2 Gedung Kemuning, tunjukkan QR Code pada tiket digital di HP Anda ke petugas pendaftaran atau scan di mesin pemindai mandiri. Status Anda akan berubah menjadi check-in." }
            ].map((f, i)=>(
              <div key={f.q} className={`rounded-xl border transition-all ${openFaq===i ? "border-[#00A69E] bg-[#E6F7F5]/20 dark:bg-white/[0.02]" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"}`}>
                <button onClick={() => setOpenFaq(openFaq===i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                  <span className="text-[13px] sm:text-[14px] font-[600] text-slate-800 dark:text-white pr-4">{f.q}</span>
                  <span className="text-[14px] text-slate-400">{openFaq===i ? "−" : "+"}</span>
                </button>
                {openFaq===i && <div className="px-4 pb-4 text-[12.5px] leading-[1.5] text-slate-600 dark:text-slate-400 border-t border-slate-100/50 pt-3">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#00A69E] to-[#007A74] p-8 sm:p-12 text-white shadow-lg text-center">
          <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-white/10 blur-[60px] pointer-events-none" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-[28px] sm:text-[38px] font-[800] leading-tight tracking-tight">Kesehatan Anda adalah Prioritas Kami</h2>
            <p className="mt-3 text-[14px] text-white/80 leading-relaxed max-w-[480px] mx-auto">
              Daftar antrean poliklinik terpadu dan IGD RSUP Dr. Hasan Sadikin Bandung dengan mudah melalui genggaman HP Anda.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/register" className="w-full sm:w-auto group">
                <span className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white text-[#00A69E] font-[700] text-[13.5px] h-11 px-6 shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300 hover:bg-[#C8D400] hover:text-[#0B3D3A] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(200,212,0,0.35)] active:translate-y-0 active:scale-[0.98]">
                  Daftar Pasien Baru
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Link>
              <Link href="/login" className="w-full sm:w-auto group">
                <span className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-transparent border-2 border-white/40 text-white font-[700] text-[13.5px] h-11 px-6 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-[#00A69E] hover:border-white hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(255,255,255,0.2)] active:translate-y-0 active:scale-[0.98]">
                  Masuk Dashboard
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <RSHSLogo variant="horizontal" size={38} />
            <div className="flex gap-6 text-[12.5px] text-slate-500 dark:text-slate-400 flex-wrap justify-center">
              <Link href="/locations" className="link-hover-yellow">Jadwal Poli</Link>
              <a href="https://www.rshs.go.id" target="_blank" rel="noreferrer" className="link-hover-yellow">Web Resmi RSHS</a>
              <span className="text-slate-300 dark:text-slate-800">|</span>
              <span>Hubungi Kami: (022) 2032214</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 text-center">
            <span>© 2026 RSUP Dr. Hasan Sadikin Bandung. Sistem Antrean Resmi Kemenkes RI • Pasteur No.38 Bandung.</span>
            <Badge variant="outline" className="text-[10px] border-slate-200 dark:border-slate-800 text-slate-400">BPJS KESEHATAN KELAS A</Badge>
          </div>
        </div>
      </footer>
    </div>
  );
}
