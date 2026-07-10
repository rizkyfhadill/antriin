"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal, ModalHeader } from "@/components/ui/modal";
import { ChartTrend, BarMini } from "@/components/dashboard/chart-trend";
import { QRDownload } from "@/components/ui/qr-download";
import { useToast } from "@/components/ui/toast";
import { RSHSMark } from "@/components/ui/rshs-logo";
import { authFetch, setStoredUser } from "@/lib/session";
import { useAuth } from "@/lib/useAuth";
import { Footer } from "@/components/layout/footer";

export default function DashboardPage() {
  const { user: authUser, loading: authLoading, logout } = useAuth();
  const user = authUser;
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [queues, setQueues] = useState<any[]>([]);
  const [tab, setTab] = useState("overview");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [counters, setCounters] = useState<any[]>([]);
  const [showQR, setShowQR] = useState<any>(null);
  const [qrInput, setQrInput] = useState("");
  const [ratingModal, setRatingModal] = useState<any>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const { addToast } = useToast();
  const router = useRouter();

  // Role detection
  const isCustomer = user?.role === "customer";
  const isOperator = user?.role === "operator";
  const isAdmin = user?.role === "admin";
  const isSuperAdmin = user?.role === "super_admin";
  const canManage = isAdmin || isSuperAdmin;
  const canOperate = isOperator || canManage;

  // Load dashboard data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadDashboardData = async () => {
      try {
        const [analyticsRes, locRes, queueRes] = await Promise.all([
          authFetch("/api/analytics"),
          authFetch("/api/locations"),
          authFetch(`/api/queues?${user.role === "customer" ? `customerId=${user.id}` : ""}`)
        ]);

        if (analyticsRes.ok) setStats(await analyticsRes.json());
        if (locRes.ok) {
          const ld = await locRes.json();
          setLocations(ld.locations || []);
          if (ld.locations?.length > 0) setSelectedLocation(ld.locations[0]);
        }
        if (queueRes.ok) {
          const qd = await queueRes.json();
          setQueues(qd.queues || []);
        }
      } catch (e) {
        console.error("Dashboard data load error:", e);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  useEffect(() => {
    if (!selectedLocation) return;
    authFetch(`/api/services?locationId=${selectedLocation.id}`).then(r=>r.json()).then(d=>setServices(d.services||[]));
    authFetch(`/api/counters?locationId=${selectedLocation.id}`).then(r=>r.json()).then(d=>setCounters(d.counters||[]));
    const interval = setInterval(() => {
      authFetch(`/api/queues?locationId=${selectedLocation.id}`).then(r=>r.json()).then(d=>setQueues(d.queues||[])).catch(()=>{});
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedLocation]);

  const handleLogout = logout;

  const handleTakeQueue = async (serviceId: string) => {
    if (!selectedLocation) return;
    const res = await authFetch("/api/queues", { method: "POST", body: JSON.stringify({ locationId: selectedLocation.id, serviceId }) });
    const data = await res.json();
    if (res.ok) {
      addToast({ title: `Tiket ${data.queue.ticketNumber} berhasil!`, type: "success" });
      setQueues([data.queue, ...queues]);
      setShowQR(data.queue);
    } else {
      addToast({ title: "Gagal", description: data.error, type: "error" });
    }
  };

  const updateQueueStatus = async (id: string, status: string, counterId?: string) => {
    const res = await authFetch(`/api/queues/${id}`, { method: "PATCH", body: JSON.stringify({ status, counterId }) });
    if (res.ok) {
      const data = await res.json();
      setQueues(queues.map(q => q.id === id ? data.queue : q));
      addToast({ title: `Status: ${status}`, type: "success" });
      if (status === "completed") setRatingModal(data.queue);
    } else {
      const err = await res.json();
      addToast({ title: "Gagal", description: err.error, type: "error" });
    }
  };

  const verifyQR = async () => {
    if (!qrInput) { addToast({ title: "QR kosong", type: "warning" }); return; }
    const res = await authFetch("/api/qr/verify", { method: "POST", body: JSON.stringify({ qrCode: qrInput }) });
    const data = await res.json();
    if (res.ok) {
      addToast({ title: "Check-in berhasil!", type: "success" });
      setQueues(queues.map(q=> q.id===data.queue.id ? data.queue : q));
      setQrInput("");
    } else {
      addToast({ title: "Gagal", description: data.error, type: "error" });
    }
  };

  const submitRating = async () => {
    if (!ratingModal) return;
    const res = await authFetch("/api/ratings", { method: "POST", body: JSON.stringify({ queueId: ratingModal.id, locationId: ratingModal.locationId, rating: ratingValue, comment: "Pelayanan memuaskan" }) });
    if (res.ok) {
      addToast({ title: "Terima kasih!", type: "success" });
      setRatingModal(null);
    }
  };

  if (authLoading || (loading && !user)) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#FCFCFD] dark:bg-[#020617]">
        <RSHSMark size={64} className="animate-pulse" />
        <span className="text-[13px] text-slate-500 mt-4">Memuat dashboard...</span>
      </div>
    );
  }

  // Navigation based on role
  const getNavItems = () => {
    if (isCustomer) {
      return [
        { id: "overview", label: "Ringkasan" },
        { id: "my-queues", label: "Antrean Saya" },
        { id: "take-queue", label: "Ambil Antrean" },
      ];
    }
    if (isOperator) {
      return [
        { id: "overview", label: "Ringkasan" },
        { id: "queues", label: "Antrean" },
        { id: "display", label: "Layar TV" },
      ];
    }
    if (isAdmin || isSuperAdmin) {
      return [
        { id: "overview", label: "Ringkasan" },
        { id: "queues", label: "Antrean" },
        { id: "locations", label: "Lokasi" },
        { id: "analytics", label: "Analitik" },
        { id: "display", label: "Layar TV" },
      ];
    }
    return [{ id: "overview", label: "Ringkasan" }];
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-[#FCFCFD] dark:bg-[#020617] text-[#0B3D3A] dark:text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-slate-200/60 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[60px] sm:h-[64px] gap-2">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <RSHSMark size={28} />
              <span className="font-[800] tracking-tight text-[14px] hidden sm:inline">Antriin RSHS</span>
            </Link>
            <div className="hidden lg:flex items-center gap-0.5 rounded-full bg-slate-100 dark:bg-slate-800 p-0.5">
              {navItems.map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} className={`rounded-full px-3.5 py-1 text-[12.5px] font-[600] transition-all duration-200 ${tab===t.id ? "bg-[#00A69E] text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-[#0B3D3A] hover:bg-[#C8D400] dark:hover:text-[#0B3D3A] dark:hover:bg-[#C8D400]"}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1 text-[12px] h-8 font-[600]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Realtime</span>
            </div>
            <button onClick={handleLogout} className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 dark:border-slate-700 text-[12px] hover:bg-slate-50 dark:hover:bg-slate-800">⎋</button>
          </div>
        </div>
        {/* Mobile nav */}
        <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 px-3 py-1.5 flex gap-1 overflow-x-auto scrollbar-none">
          {navItems.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11.5px] font-[600] transition-all duration-200 ${tab===t.id ? "bg-[#00A69E] text-white shadow-sm" : "bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-[#0B3D3A] hover:bg-[#C8D400] dark:hover:text-[#0B3D3A] dark:hover:bg-[#C8D400]"}`}>{t.label}</button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
        {/* OVERVIEW TAB - For all roles */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-[#00A69E]/20 bg-gradient-to-r from-[#00A69E]/5 to-transparent p-4 flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
              <div className="flex gap-2.5 items-center">
                <RSHSMark size={32} />
                <div>
                  <div className="font-[800] text-[14px] tracking-tight">RSUP Dr. Hasan Sadikin Bandung</div>
                  <div className="text-[11.5px] text-slate-500">Gedung Kemuning Lt.2 • Pasteur 38</div>
                </div>
              </div>
              <Badge variant="blue" className="text-[10px] rounded-full">{user?.role?.toUpperCase()}</Badge>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-[20px] sm:text-[24px] font-[800] tracking-tight">Halo, {user?.name?.split(" ")[0]} 👋</h1>
                <p className="text-[12.5px] text-slate-500">
                  {isCustomer ? "Pantau antrean dan ambil nomor poli dari rumah." :
                   isOperator ? "Kelola antrean pasien secara realtime." :
                   "Dashboard manajemen Poliklinik RSHS."}
                </p>
              </div>
              {canOperate && selectedLocation && (
                <Link href={`/display/${selectedLocation.id}`} target="_blank">
                  <Button variant="primary" size="sm" className="rounded-full h-9 text-[12px]">Display TV </Button>
                </Link>
              )}
            </div>

            {/* Stats - Different for each role */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {isCustomer ? (
                <>
                  <Card rshs className="p-4 stat-hover-yellow">
                    <div className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider">Antrean Aktif</div>
                    <div className="mt-2 text-[20px] sm:text-[24px] font-[800] text-[#0B3D3A] dark:text-white">{queues.filter(q=>["waiting","called","checked_in"].includes(q.status)).length}</div>
                  </Card>
                  <Card rshs className="p-4 stat-hover-yellow">
                    <div className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider">Selesai</div>
                    <div className="mt-2 text-[20px] sm:text-[24px] font-[800] text-[#0B3D3A] dark:text-white">{queues.filter(q=>q.status==="completed").length}</div>
                  </Card>
                  <Card rshs className="p-4 stat-hover-yellow">
                    <div className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider">Lokasi Poli</div>
                    <div className="mt-2 text-[20px] sm:text-[24px] font-[800] text-[#0B3D3A] dark:text-white">{locations.length}</div>
                  </Card>
                  <Card rshs className="p-4 stat-hover-yellow">
                    <div className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider">Estimasi</div>
                    <div className="mt-2 text-[20px] sm:text-[24px] font-[800] text-[#0B3D3A] dark:text-white">~15m</div>
                  </Card>
                </>
              ) : (
                <>
                  <Card rshs className="p-4 stat-hover-yellow">
                    <div className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider">Poli RSHS</div>
                    <div className="mt-2 text-[20px] sm:text-[24px] font-[800] text-[#0B3D3A] dark:text-white flex items-center justify-between">
                      <span>{stats?.totalLocations || locations.length}</span>
                      <span className="text-[16px] opacity-75">🏥</span>
                    </div>
                  </Card>
                  <Card rshs className="p-4 stat-hover-yellow">
                    <div className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider">Antrean Aktif</div>
                    <div className="mt-2 text-[20px] sm:text-[24px] font-[800] text-[#0B3D3A] dark:text-white flex items-center justify-between">
                      <span>{stats?.activeQueues || queues.filter(q=>["waiting","called"].includes(q.status)).length}</span>
                      <span className="text-[16px] opacity-75">🎫</span>
                    </div>
                  </Card>
                  <Card rshs className="p-4 stat-hover-yellow">
                    <div className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider">Selesai</div>
                    <div className="mt-2 text-[20px] sm:text-[24px] font-[800] text-[#0B3D3A] dark:text-white flex items-center justify-between">
                      <span>{stats?.completedQueues || queues.filter(q=>q.status==="completed").length}</span>
                      <span className="text-[16px] opacity-75">✅</span>
                    </div>
                  </Card>
                  <Card rshs className="p-4 stat-hover-yellow">
                    <div className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider">Estimasi Tunggu</div>
                    <div className="mt-2 text-[20px] sm:text-[24px] font-[800] text-[#0B3D3A] dark:text-white flex items-center justify-between">
                      <span>{stats?.avgWait || 12}m</span>
                      <span className="text-[16px] opacity-75">⏰</span>
                    </div>
                  </Card>
                </>
              )}
            </div>

            {/* Customer: Quick actions */}
            {isCustomer && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="p-5 border-[#00A69E]/20">
                  <h3 className="font-[700] text-[14px] mb-3">Ambil Antrean Baru</h3>
                  <p className="text-[12px] text-slate-500 mb-3">Pilih poli dan layanan untuk mengambil nomor antrean.</p>
                  <Button variant="primary" size="sm" className="rounded-full" onClick={()=>setTab("take-queue")}>Ambil Antrean →</Button>
                </Card>
                <Card className="p-5">
                  <h3 className="font-[700] text-[14px] mb-3">Lihat Antrean Saya</h3>
                  <p className="text-[12px] text-slate-500 mb-3">Pantau status antrean dan estimasi waktu tunggu.</p>
                  <Button variant="secondary" size="sm" className="rounded-full" onClick={()=>setTab("my-queues")}>Lihat Antrean →</Button>
                </Card>
              </div>
            )}

            {/* Operator/Manager: Chart & Insights */}
            {!isCustomer && (
              <div className="grid lg:grid-cols-[1fr_340px] gap-6">
                <Card className="p-5">
                  <div className="flex items-center justify-between"><h3 className="font-[700] text-[14px]">Statistik Pengunjung (7 Hari)</h3><Badge variant="blue" className="text-[9px]">AI AKTIF</Badge></div>
                  <div className="mt-4"><ChartTrend data={stats?.dailyTrend || Array.from({length:7}).map((_,i)=>({date:`2024-01-0${i+1}`, count: Math.floor(Math.random()*40+20)}))} /></div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3"><div className="text-[10px] text-slate-400">Jam Tersibuk</div><div className="font-[700] text-[13px] mt-0.5">09:00 - 11:00</div></div>
                    <div className="rounded-xl bg-[#E6F7F5] dark:bg-slate-800/50 p-3"><div className="text-[10px] text-[#00A69E] font-[600]">Poli Teramai</div><div className="font-[700] text-[13px] mt-0.5 text-[#00A69E]">Penyakit Dalam</div></div>
                  </div>
                </Card>
                <div className="space-y-4">
                  <Card className="p-4 bg-[#00A69E] text-white">
                    <div className="text-[10px] font-[700] tracking-wider opacity-75">AI INSIGHT</div>
                    <div className="mt-3 space-y-2 text-[12.5px]">
                      {(stats?.insights || ["Senin jam 9-11 puncak antrean, tambah loket BPJS."]).slice(0, 2).map((ins: string, i:number)=>(
                        <div key={i} className="bg-white/10 p-2.5 rounded-lg border border-white/10">{ins}</div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MY QUEUES TAB - Customer only */}
        {tab === "my-queues" && isCustomer && (
          <div className="space-y-4">
            <h2 className="text-[18px] font-[800] tracking-tight">Antrean Saya</h2>
            {queues.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-[32px]">🎟️</div>
                <div className="font-[600] mt-1 text-[13px]">Belum ada antrean</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Ambil nomor antrean untuk mulai.</div>
                <Button variant="primary" size="sm" className="mt-4 rounded-full" onClick={()=>setTab("take-queue")}>Ambil Antrean</Button>
              </Card>
            ) : (
              <div className="space-y-2">
                {queues.slice(0, 10).map((q:any)=>(
                  <Card key={q.id} className="p-3.5 card-hover-yellow flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-[#0B3D3A] text-white grid place-items-center font-[700] text-[13px]">{q.ticketNumber}</div>
                      <div>
                        <div className="flex items-center gap-1.5"><span className="text-[13px] font-[600]">{q.locationName || "Poli RSHS"}</span><StatusBadge status={q.status} /></div>
                        <div className="mt-0.5 text-[11px] text-slate-400">Est {q.estimatedWaitMinutes} menit • Posisi #{q.position}</div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 px-2.5 rounded-full" onClick={()=>setShowQR(q)}>Lihat QR</Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAKE QUEUE TAB - Customer only */}
        {tab === "take-queue" && isCustomer && (
          <div className="space-y-4">
            <h2 className="text-[18px] font-[800] tracking-tight">Ambil Antrean</h2>
            <Card className="p-5 border-[#00A69E]/20">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                <div>
                  <h3 className="font-[700] text-[15px]">{selectedLocation?.name || "Pilih Lokasi"}</h3>
                  <p className="text-[12px] text-slate-500 mt-0.5">{selectedLocation?.address}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {services.map((svc:any)=>(
                  <div key={svc.id} className="group rounded-xl border border-slate-100 dark:border-slate-800 p-3.5 card-hover-yellow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-[700] text-[13px] leading-tight">{svc.name}</span>
                        <Badge variant="blue" className="text-[9.5px] rounded-full py-0">{svc.durationAvg}m</Badge>
                      </div>
                      <p className="text-[11.5px] text-slate-500 mt-1 line-clamp-2">{svc.description}</p>
                    </div>
                    <Button onClick={()=>handleTakeQueue(svc.id)} size="sm" variant="primary" className="mt-3 w-full rounded-full h-8 text-[11.5px]">Ambil Antrean</Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* QUEUES TAB - Operator/Manager */}
        {tab === "queues" && canOperate && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-[18px] font-[800] tracking-tight">Manajemen Antrean</h2>
              {canManage && (
                <div className="flex items-center gap-2">
                  <Input placeholder="Cari nomor..." value="" onChange={()=>{}} className="w-[180px] h-8 text-[12px] rounded-full" />
                </div>
              )}
            </div>
            <div className="grid lg:grid-cols-[1fr_310px] gap-6">
              <div className="space-y-2">
                {queues.slice(0, 15).map((q:any)=>(
                  <Card key={q.id} className="p-3.5 card-hover-yellow flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-[#0B3D3A] text-white grid place-items-center font-[700] text-[13px]">{q.ticketNumber}</div>
                      <div>
                        <div className="flex items-center gap-1.5"><span className="text-[13px] font-[600]">Pasien RSHS</span><StatusBadge status={q.status} /></div>
                        <div className="mt-0.5 text-[11px] text-slate-400">Est {q.estimatedWaitMinutes}m • Pos #{q.position}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Button size="sm" variant="accent" className="h-7 px-2.5 text-[11.5px] rounded-full" onClick={()=>updateQueueStatus(q.id,"called")}>Panggil</Button>
                      <Button size="sm" variant="secondary" className="h-7 px-2.5 text-[11.5px] rounded-full" onClick={()=>updateQueueStatus(q.id,"serving")}>Mulai</Button>
                      <Button size="sm" variant="secondary" className="h-7 px-2.5 text-[11.5px] rounded-full" onClick={()=>updateQueueStatus(q.id,"completed")}>Selesai</Button>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-[700] text-[13px] mb-3">Loket Pelayanan</h4>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-none pr-1">
                    {counters.map((c:any)=>(
                      <div key={c.id} className="row-hover-yellow flex justify-between items-center bg-slate-50 dark:bg-slate-800/30 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-[12px]">
                        <div><div className="font-[600]">{c.name}</div><div className="text-[10.5px] text-slate-400">{c.status}</div></div>
                        <span className={`h-2 w-2 rounded-full ${c.status==="active"?"bg-emerald-500":"bg-slate-300"}`} />
                      </div>
                    ))}
                  </div>
                </Card>
                {isOperator && (
                  <Card className="p-4 bg-[#0B3D3A] text-white">
                    <div className="text-[11px] font-[700] tracking-wider opacity-75">SCAN QR PASIEN</div>
                    <div className="mt-3 flex gap-1.5">
                      <input value={qrInput} onChange={e=>setQrInput(e.target.value)} placeholder="QR Code..." className="flex-1 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-[12px] text-white placeholder:text-white/40 outline-none focus:border-[#00A69E]" />
                      <Button size="sm" variant="accent" className="bg-[#00A69E] h-8 rounded-full text-[11.5px]" onClick={verifyQR}>Check-in</Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* LOCATIONS TAB - Manager/SuperAdmin */}
        {tab === "locations" && canManage && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <div>
                <h2 className="text-[18px] font-[800] tracking-tight">Poli & Instalasi RSHS</h2>
                <p className="text-[12px] text-slate-500 mt-0.5">Kelola poli pelayanan rawat jalan.</p>
              </div>
              <Button variant="secondary" size="sm" className="rounded-full h-8 text-[11.5px]">+ Tambah Poli</Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map((loc:any)=>(
                <Card key={loc.id} rshs className="overflow-hidden card-hover-yellow">
                  <div className="h-[140px] relative overflow-hidden"><img src={loc.imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400"} alt="" className="h-full w-full object-cover" /><div className="absolute top-2.5 left-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-[600]">{loc.category}</div></div>
                  <div className="p-4">
                    <h3 className="font-[700] text-[13.5px] truncate">{loc.name.replace("RSUP Dr. Hasan Sadikin - ","").replace("RSHS - ","")}</h3>
                    <p className="text-[11.5px] text-slate-500 mt-1 line-clamp-1">{loc.address}</p>
                    <div className="mt-3 flex gap-1"><span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10.5px] font-[600]">{loc.totalCounters} loket</span></div>
                    <div className="mt-4 flex gap-1.5">
                      <Link href={`/display/${loc.id}`} target="_blank" className="flex-1"><Button size="sm" variant="secondary" className="w-full rounded-full h-8 text-[11.5px]">Monitor TV</Button></Link>
                      <Button size="sm" variant="primary" className="flex-1 rounded-full h-8 text-[11.5px]" onClick={()=>setSelectedLocation(loc)}>Kelola</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ANALYTICS TAB - Manager/SuperAdmin */}
        {tab === "analytics" && canManage && (
          <div className="space-y-5">
            <h2 className="text-[18px] font-[800] tracking-tight">AI Analitik & Laporan</h2>
            <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6">
              <Card className="p-5 sm:p-6">
                <h3 className="font-[700] text-[14px] mb-4">Distribusi Pengunjung Per Layanan</h3>
                <div className="space-y-3.5">
                  {(stats?.serviceDistribution || []).slice(0, 4).map((s:any)=>(
                    <div key={s.name} className="text-[12.5px]">
                      <div className="flex justify-between font-[500]"><span>{s.name}</span><span className="text-slate-400">{s.count} pasien</span></div>
                      <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div className="h-full bg-[#00A69E]" style={{width: `${Math.min(100, (s.count/60)*100)}%`}} /></div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-5 flex flex-col justify-between bg-slate-50 dark:bg-slate-800/20">
                <div>
                  <h4 className="font-[700] text-[13px] mb-2 text-[#0B3D3A] dark:text-white">Rekomendasi AI</h4>
                  <p className="text-[12px] text-slate-600 dark:text-slate-400 leading-[1.5]">Disarankan membuka 1 loket BPJS tambahan di Gedung Kemuning Lantai 2 khusus hari Senin pukul 09:00 - 11:00 WIB.</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[12.5px]"><span className="text-slate-500">Akurasi Prediksi</span><span className="font-[700] text-emerald-600">94.2%</span></div>
              </Card>
            </div>
          </div>
        )}

        {/* DISPLAY TAB - Operator/Manager */}
        {tab === "display" && canOperate && selectedLocation && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-[18px] font-[800] tracking-tight">Layar TV Antrean</h2>
              <Link href={`/display/${selectedLocation.id}`} target="_blank">
                <Button size="sm" variant="primary" className="rounded-full h-8 text-[11.5px] bg-[#00A69E]">Fullscreen ↗</Button>
              </Link>
            </div>
            <Card className="p-0 overflow-hidden bg-[#0B3D3A] text-white min-h-[380px] flex flex-col">
              <div className="p-6 flex-1 grid md:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
                <div className="text-center md:text-left">
                  <div className="text-[11px] tracking-widest opacity-60">SEDANG DIPANGGIL</div>
                  <div className="text-[72px] sm:text-[96px] font-[800] leading-none mt-2 tracking-tight">{queues.find(q=>q.status==="called")?.ticketNumber || "—"}</div>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#00A69E] px-4 py-1.5 text-[14px] font-[600]">Menuju Loket <span className="animate-bounce">→</span></div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl space-y-2.5">
                  <div className="text-[11px] opacity-60">LOKET AKTIF</div>
                  {counters.slice(0, 3).map((c:any)=>(
                    <div key={c.id} className="flex justify-between text-[12.5px] border-b border-white/5 pb-1.5 last:border-0">
                      <span className="opacity-80">{c.name}</span>
                      <span className="font-[700]">{queues.find((q:any)=>q.counterId===c.id && ["called","serving"].includes(q.status))?.ticketNumber || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* QR Modal */}
      {showQR && (
        <Modal open={!!showQR} onClose={()=>setShowQR(null)} size="md">
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="mx-auto h-12 w-12 rounded-xl bg-[#00A69E] text-white grid place-items-center font-bold text-xl">QR</div>
              <h3 className="mt-3 text-[20px] font-[800]">Tiket {showQR.ticketNumber}</h3>
              <p className="text-[13px] text-slate-500">Tunjukkan QR Code ini di loket pendaftaran RSHS</p>
            </div>

            {/* QR Display */}
            <div className="bg-gradient-to-br from-[#00A69E]/10 to-[#C8D400]/10 rounded-2xl p-8 mb-6">
              <div className="bg-white rounded-xl p-6 shadow-lg max-w-[300px] mx-auto">
                <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="font-mono text-sm font-bold text-[#00A69E] mb-2">{showQR.qrCode}</div>
                    <div className="text-xs text-slate-500">QR Code</div>
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-lg font-bold text-[#0B3D3A]">{showQR.ticketNumber}</div>
                  <div className="text-xs text-slate-500">{selectedLocation?.name || "RSUP Dr. Hasan Sadikin"}</div>
                  {showQR.estimatedWaitMinutes && (
                    <div className="text-sm font-bold text-[#00A69E]">
                      Estimasi: {showQR.estimatedWaitMinutes} menit
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Download Options */}
            <QRDownload
              ticketNumber={showQR.ticketNumber}
              qrCode={showQR.qrCode}
              locationName={selectedLocation?.name || "RSUP Dr. Hasan Sadikin Bandung"}
              serviceName="Poliklinik Terpadu"
              estimatedWait={showQR.estimatedWaitMinutes}
            />

            {/* Close Button */}
            <div className="mt-4">
              <Button
                variant="secondary"
                size="md"
                className="w-full rounded-full"
                onClick={()=>setShowQR(null)}
              >
                Tutup
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Rating Modal */}
      {ratingModal && (
        <Modal open={!!ratingModal} onClose={()=>setRatingModal(null)} size="sm">
          <div className="p-6 text-center">
            <div className="text-[32px]">⭐</div>
            <h3 className="mt-2 text-[18px] font-[800]">Layanan Selesai</h3>
            <p className="text-[12.5px] text-slate-500 mt-1">Beri rating pelayanan medis hari ini.</p>
            <div className="mt-4 flex justify-center gap-1.5">
              {[1,2,3,4,5].map(v=>(
                <button key={v} onClick={()=>setRatingValue(v)} className={`h-9 w-9 rounded-full grid place-items-center text-[16px] border ${ratingValue>=v?"bg-[#C8D400] border-[#C8D400]":"bg-slate-100 dark:bg-slate-800"}`}>★</button>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <Button variant="secondary" className="flex-1 rounded-full h-9 text-[12px]" onClick={()=>setRatingModal(null)}>Nanti</Button>
              <Button variant="primary" className="flex-1 rounded-full bg-[#00A69E] h-9 text-[12px]" onClick={submitRating}>Kirim Rating</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
