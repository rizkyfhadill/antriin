"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { RSHSMark } from "@/components/ui/rshs-logo";
import { authFetch } from "@/lib/session";

export default function LocationDetailPage() {
  const { id } = useParams() as { id: string };
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [taking, setTaking] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetch(`/api/locations/${id}`).then(r=>r.json()).then(d=>{ setData(d); setLoading(false); }).catch(()=>setLoading(false));
  }, [id]);

  const takeQueue = async (serviceId: string) => {
    setTaking(serviceId);
    const res = await authFetch("/api/queues", {
      method:"POST",
      body: JSON.stringify({ locationId: id, serviceId })
    });
    const d = await res.json();
    setTaking(null);
    if (res.ok) addToast({ title:`Tiket ${d.queue.ticketNumber} berhasil!`, description:`Estimasi ${d.estimated} menit`, type:"success" });
    else addToast({ title:"Gagal", description:d.error, type:"error" });
  };

  if (loading) return <div className="min-h-screen grid place-items-center bg-[#FCFCFD] dark:bg-[#020617]"><div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#00A69E]" /></div>;
  if (!data?.location) return <div className="min-h-screen grid place-items-center">Poli tidak ditemukan • <Link href="/locations" className="underline ml-1">Kembali</Link></div>;

  const loc = data.location;

  return (
    <div className="min-h-screen bg-[#FCFCFD] dark:bg-[#020617]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Navigation & Logo Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Link href="/locations" className="inline-flex items-center gap-1.5 text-[12.5px] font-[600] text-slate-500 hover:text-[#00A69E]">← Kembali ke poli</Link>
          <Link href="/" className="flex items-center gap-1.5"><RSHSMark size={28} /><span className="text-[11px] font-[800] text-[#00A69E] tracking-wider">KEMENKES RSHS</span></Link>
        </div>

        <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-6">
          <div className="space-y-4">
            {/* Main Visual Header */}
            <div className="relative h-[240px] sm:h-[340px] rounded-2xl overflow-hidden shadow-sm">
              <img src={loc.imageUrl} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00A69E]/90 via-[#00A69E]/30 to-transparent" />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <Badge variant="default" className="bg-white/90 text-[#00A69E] rounded-full">{loc.category.toUpperCase()}</Badge>
                <Badge variant="default" className="bg-emerald-500 text-white rounded-full">BUKA</Badge>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h1 className="text-[20px] sm:text-[30px] font-[800] leading-tight tracking-tight">{loc.name.replace("RSUP Dr. Hasan Sadikin - ","").replace("RSHS - ","")}</h1>
                <p className="mt-1 text-[11.5px] sm:text-[12.5px] opacity-85 leading-normal">{loc.address}</p>
                <div className="mt-4 flex gap-2">
                  <Link href={`/display/${loc.id}`} target="_blank"><Button size="sm" variant="secondary" className="rounded-full bg-white text-[#00A69E] text-[11px] font-[600] h-8">Layar Monitor TV</Button></Link>
                  <Button size="sm" variant="ghost" className="rounded-full bg-white/10 text-white border border-white/20 text-[11px] font-[600] h-8" onClick={()=>{ navigator.clipboard.writeText(window.location.href); addToast({title:"Link disalin", type:"success"}); }}>Bagikan</Button>
                </div>
              </div>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-3 text-center"><div className="text-[10px] text-slate-400 font-[700] uppercase tracking-wider">JAM LAYANAN</div><div className="mt-1 font-[800] text-[13.5px] text-[#00A69E]">{loc.openingTime} - {loc.closingTime}</div></Card>
              <Card className="p-3 text-center"><div className="text-[10px] text-slate-400 font-[700] uppercase tracking-wider">JUMLAH LOKET</div><div className="mt-1 font-[800] text-[13.5px] text-[#00A69E]">{loc.totalCounters} loket</div></Card>
              <Card className="p-3 text-center"><div className="text-[10px] text-slate-400 font-[700] uppercase tracking-wider">KAPASITAS</div><div className="mt-1 font-[800] text-[13.5px] text-[#00A69E]">BPJS & UMUM</div></Card>
            </div>

            {/* Services Available */}
            <Card className="p-5">
              <h3 className="font-[800] text-[14px] mb-1">Ambil Nomor Antrean Pelayanan</h3>
              <p className="text-[12px] text-slate-500 mb-4">{loc.description}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {data.services?.map((s:any)=>(
                  <div key={s.id} className="rounded-xl border border-slate-100 dark:border-slate-800 p-3.5 card-hover-yellow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1"><span className="font-[750] text-[13px] leading-tight">{s.name}</span><Badge variant="blue" className="text-[9.5px] rounded-full py-0">{s.durationAvg}m</Badge></div>
                      <p className="text-[11.5px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{s.description}</p>
                    </div>
                    <Button size="sm" variant="primary" className="mt-4 w-full rounded-full bg-[#00A69E] h-8 text-[11.5px] shadow-sm font-[600]" loading={taking===s.id} onClick={()=>takeQueue(s.id)}>Antre • {s.name} →</Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right sidebar info */}
          <div className="space-y-4">
            {/* Maps */}
            <Card className="p-4">
              <h4 className="font-[700] text-[13px] mb-2">Panduan Rute & Peta</h4>
              <div className="rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 h-[140px]">
                <iframe title="map" width="100%" height="100%" style={{border:0}} loading="lazy" src={`https://maps.google.com/maps?q=${loc.latitude || -6.8936},${loc.longitude || 107.6020}&z=15&output=embed`} />
              </div>
              <a href={`https://www.google.com/maps/search/?api=1&query=${loc.latitude || -6.8936},${loc.longitude || 107.6020}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex w-full justify-center rounded-full bg-[#00A69E] hover:bg-[#008F88] text-white py-1.5 text-[11.5px] font-[600]">Buka Google Maps ↗</a>
            </Card>

            {/* Antrean aktif */}
            <Card className="p-4">
              <h4 className="font-[700] text-[13px] mb-2 flex items-center gap-1.5">Antrean Sedang Berjalan <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /></h4>
              <div className="space-y-1.5 max-h-[200px] overflow-auto pr-1">
                {data.queues?.filter((q:any)=>["waiting","called","serving"].includes(q.status)).slice(0,5).map((q:any)=>(
                  <div key={q.id} className="row-hover-yellow flex justify-between items-center rounded-lg border border-slate-50 dark:border-slate-800 p-2 text-[12px]"><span className="font-[700]">{q.ticketNumber}</span><StatusBadge status={q.status} /></div>
                ))}
                {(!data.queues || data.queues.length===0) && <div className="text-center py-6 text-[11.5px] text-slate-400">Tidak ada antrean aktif.</div>}
              </div>
            </Card>

            {/* Ulasan */}
            <Card className="p-4">
              <h4 className="font-[700] text-[13px] mb-2">Ulasan Terbaru Pasien</h4>
              <div className="space-y-3 max-h-[220px] overflow-auto pr-1">
                {data.ratings?.slice(0, 3).map((r:any)=>(
                  <div key={r.id} className="row-hover-yellow border-b border-slate-100 dark:border-slate-800 pb-2.5 last:border-0"><div className="text-[10px] text-amber-500">{"★".repeat(r.rating)}</div><p className="text-[12px] mt-1 italic text-slate-600 dark:text-slate-300">"{r.comment}"</p></div>
                ))}
                {(!data.ratings || data.ratings.length===0) && <div className="text-center py-6 text-[11.5px] text-slate-400">Belum ada ulasan poli.</div>}
              </div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
