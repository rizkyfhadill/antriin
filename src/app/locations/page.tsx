"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { RSHSMark } from "@/components/ui/rshs-logo";
import { useAuth } from "@/lib/useAuth";

export default function LocationsPage() {
  const { user, logout } = useAuth();
  const [locations, setLocations] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchLoc = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (filter !== "all") params.set("category", filter);
    const res = await fetch(`/api/locations?${params.toString()}`);
    const data = await res.json();
    let locs = data.locations || [];
    if (!q) {
      const rshs = locs.filter((l:any)=> l.name.includes("Hasan Sadikin") || l.name.includes("RSHS"));
      if (rshs.length > 0) locs = rshs;
    }
    setLocations(locs);
    setLoading(false);
  };

  useEffect(() => { fetchLoc(); }, [filter]);

  return (
    <div className="min-h-screen bg-[#FCFCFD] dark:bg-[#020617] flex flex-col">
      <Navbar user={user} rshsMode onLogout={logout} />
      
      <div className="pt-24 sm:pt-28 pb-12 sm:pb-16 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        
        {/* Header RSHS minimal */}
        <div className="rounded-2xl bg-[#007A74] text-white p-5 sm:p-7 relative overflow-hidden mb-6">
          <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-white/10 blur-[50px]" />
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/20 px-2.5 py-1 text-[11px] font-[700] tracking-wider text-emerald-200">
                <RSHSMark size={16} /> RSUP DR. HASAN SADIKIN BANDUNG
              </div>
              <h1 className="mt-3 text-[24px] sm:text-[32px] font-[800] leading-tight tracking-tight">Poli & Instalasi Pelayanan</h1>
              <p className="text-[12.5px] text-white/80 mt-1 max-w-[480px]">Ambil antrean rawat jalan dari rumah secara online. Realtime dan praktis.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input value={q} onChange={(e:any)=>setQ(e.target.value)} onKeyDown={(e:any)=> e.key==="Enter" && fetchLoc()} placeholder="Cari poli..." className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-full h-10 text-[12.5px]" />
              <Button variant="secondary" size="md" className="rounded-full bg-white text-[#00A69E] hover:bg-slate-50 h-10 px-4 font-[600] shrink-0 text-[12.5px]" onClick={fetchLoc}>Cari</Button>
            </div>
          </div>
        </div>

        {/* Filter Quick Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-6">
          {[
            { id:"all", label:"Semua Layanan", icon:"🏥" },
            { id:"poli", label:"Poli Terpadu", icon:"🩺" },
            { id:"igd", label:"IGD 24 Jam", icon:"🚨" },
            { id:"eksekutif", label:"Eksekutif", icon:"⭐" },
            { id:"radio", label:"Diagnostik", icon:"🔬" },
            { id:"farmasi", label:"Farmasi", icon:"💊" },
          ].map(c=>(
            <button key={c.id} onClick={()=>{ if(c.id==="all") { setFilter("all"); setQ(""); } else { setQ(c.id==="poli"?"Poliklinik":c.id==="igd"?"IGD":c.id==="eksekutif"?"Eksekutif":c.id==="radio"?"Radiologi":"Farmasi"); } fetchLoc(); }} className={`whitespace-nowrap rounded-full border px-4 py-2 text-[12.5px] font-[600] flex items-center gap-1.5 transition-all ${filter===c.id ? "bg-[#00A69E] text-white border-[#00A69E] shadow-sm" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-[#00A69E]/30 text-slate-700 dark:text-slate-300"}`}>
              <span>{c.icon}</span>{c.label}
            </button>
          ))}
        </div>

        {/* Poli Cards Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3].map(i=> <div key={i} className="h-[220px] animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />)}</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map(loc=>(
              <Card key={loc.id} hover rshs className="overflow-hidden p-0 flex flex-col justify-between card-hover-yellow">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <Badge variant="blue" className="text-[10px] rounded-full">RSHS</Badge>
                    <span className="text-[11px] font-[700] text-emerald-600 flex items-center gap-1">🕒 {loc.openingTime}-{loc.closingTime}</span>
                  </div>
                  <h3 className="font-[800] tracking-tight text-[14.5px] text-slate-900 dark:text-white mt-3 leading-tight line-clamp-1">{loc.name.replace("RSUP Dr. Hasan Sadikin - ","").replace("RSHS - ","")}</h3>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{loc.description.split(".")[0]}.</p>
                  <div className="mt-3.5 flex flex-wrap gap-1.5 text-[11px]"><span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-[600] text-slate-600 dark:text-slate-300">{loc.totalCounters} loket</span><span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5">Kuota {loc.quotaPerDay}/hari</span></div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <Link href={`/locations/${loc.id}`} className="flex-1"><Button size="sm" variant="secondary" className="w-full rounded-full h-8 text-[11.5px] border-slate-200">Detail Poli</Button></Link>
                  <Link href={`/dashboard`} className="flex-1"><Button size="sm" variant="primary" className="w-full rounded-full bg-[#00A69E] hover:bg-[#008F88] h-8 text-[11.5px] shadow-sm">Antri →</Button></Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && locations.length===0 && (
          <Card className="p-12 text-center border-dashed"><div className="text-[36px]">🏥</div><div className="font-[700] mt-2 text-[14px]">Poli tidak ditemukan</div><div className="text-[12px] text-slate-400 mt-1">Coba kata kunci lain atau reset filter.</div><Button size="sm" variant="secondary" className="mt-4 rounded-full h-8 px-4" onClick={()=>{ setQ(""); setFilter("all"); fetchLoc(); }}>Reset Filter</Button></Card>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
