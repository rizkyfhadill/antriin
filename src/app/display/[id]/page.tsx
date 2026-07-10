"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RSHSMark } from "@/components/ui/rshs-logo";

export default function DisplayPage() {
  const params = useParams();
  const locationId = params.id as string;
  const [queues, setQueues] = useState<any[]>([]);
  const [location, setLocation] = useState<any>(null);
  const [counters, setCounters] = useState<any[]>([]);
  const lastCalledRef = useRef<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locRes = await fetch(`/api/locations/${locationId}`);
        if (locRes.ok) {
          const d = await locRes.json();
          setLocation(d.location);
          setCounters(d.counters || []);
        }
        const qRes = await fetch(`/api/queues?locationId=${locationId}`);
        if (qRes.ok) {
          const d = await qRes.json();
          setQueues(d.queues || []);
        }
      } catch {}
    };
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, [locationId]);

  useEffect(() => {
    const called = queues.find(q=>q.status==="called");
    if (called && called.id !== lastCalledRef.current) {
      lastCalledRef.current = called.id;
      if ("speechSynthesis" in window) {
        const text = `Nomor antrean ${called.ticketNumber}, silakan menuju ${counters.find((c:any)=>c.id===called.counterId)?.name || "loket"}. Terima kasih.`;
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "id-ID";
        utter.rate = 0.9;
        speechSynthesis.speak(utter);
      }
    }
  }, [queues, counters]);

  const called = queues.find(q=>q.status==="called");
  const waiting = queues.filter(q=>q.status==="waiting").slice(0,5);
  const serving = queues.filter(q=>q.status==="serving");

  return (
    <div className="min-h-screen bg-[#007A74] text-white flex flex-col overflow-hidden selection:bg-white/20 font-sans">
      
      {/* Header TV */}
      <div className="flex items-center justify-between px-5 sm:px-8 py-3 sm:py-4 border-b border-white/10 bg-white/[0.02] backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <RSHSMark size={32} />
          <div>
            <div className="font-[800] tracking-tight text-[13.5px] sm:text-[15px] flex items-center gap-1.5">
              {location?.name?.replace("RSUP Dr. Hasan Sadikin - ","").replace("RSHS - ","") || "Memuat..."}
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            </div>
            <div className="text-[9.5px] sm:text-[10px] tracking-wide opacity-70 uppercase font-[600]">RS Hasan Sadikin Bandung • Pasteur No.38</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] opacity-75 hidden sm:inline">{new Date().toLocaleString("id-ID", { weekday:"long", day:"numeric", month:"long", hour:"2-digit", minute:"2-digit" })}</span>
          <Button size="sm" variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/10 rounded-full h-8 px-3 text-[11px] font-[600]" onClick={()=>{ if("speechSynthesis" in window){ const u=new SpeechSynthesisUtterance("Uji coba suara panggilan RSHS."); u.lang="id-ID"; speechSynthesis.speak(u);} }}>🔊 Uji Suara</Button>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-[1.3fr_0.7fr] gap-0">
        
        {/* Main call monitor */}
        <div className="p-6 sm:p-10 flex flex-col justify-center relative bg-gradient-to-br from-transparent to-black/10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-white/5 blur-[80px] pointer-events-none" />
          
          <div className="relative text-center lg:text-left">
            <div className="text-[11px] sm:text-[12px] tracking-[0.2em] font-[700] opacity-50">SEDANG DIPANGGIL</div>
            <div id="called-number" className="mt-2 text-[80px] sm:text-[140px] lg:text-[160px] font-[800] leading-none tracking-tighter">{called?.ticketNumber || "—"}</div>
            {called ? (
              <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 rounded-full bg-[#00A69E] px-5 sm:px-6 py-2.5 sm:py-3 text-[15px] sm:text-[18px] font-[750] shadow-[0_8px_32px_rgba(0,166,158,0.3)] animate-pulse">
                Silakan Menuju {counters.find((c:any)=>c.id===called.counterId)?.name || "Loket"} <span>→</span>
              </div>
            ) : (
              <div className="mt-4 sm:mt-6 text-[13px] sm:text-[14.5px] opacity-65">Menunggu panggilan antrean poli berikutnya...</div>
            )}

            {/* Sub details */}
            <div className="mt-12 sm:mt-16 grid grid-cols-2 gap-4 max-w-[580px] mx-auto lg:mx-0">
              <div className="rounded-xl bg-white/5 border border-white/10 p-4"><div className="text-[10px] font-[700] tracking-wider opacity-60 uppercase">BERIKUTNYA</div><div className="mt-1.5 text-[18px] sm:text-[22px] font-[800]">{waiting.map((w:any)=>w.ticketNumber).join(" • ") || "—"}</div></div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-4"><div className="text-[10px] font-[700] tracking-wider opacity-60 uppercase">SEDANG DILAYANI</div><div className="mt-1.5 text-[18px] sm:text-[22px] font-[800]">{serving.slice(0, 1).map((s:any)=>s.ticketNumber).join("") || "—"}</div></div>
            </div>
          </div>
        </div>

        {/* Counters list */}
        <div className="bg-white text-[#0B3D3A] flex flex-col border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
            <div className="text-[10px] font-[800] tracking-wider text-slate-400 uppercase">DAFTAR LOKET AKTIF</div>
            <div className="mt-3.5 space-y-2 max-h-[220px] lg:max-h-none overflow-y-auto scrollbar-none">
              {counters.map((c:any)=>{
                const activeQ = queues.find((qq:any)=>qq.counterId===c.id && ["called","serving"].includes(qq.status));
                return (
                  <div key={c.id} className={`rounded-xl border p-3.5 flex justify-between items-center ${activeQ ? "bg-[#0B3D3A] text-white border-[#0B3D3A] shadow-md scale-[1.01]" : "bg-white border-slate-100 hover:border-slate-200"}`}>
                    <div><div className="font-[700] text-[13px]">{c.name}</div><div className={`text-[10.5px] ${activeQ ? "text-white/60" : "text-slate-400"}`}>{c.status}</div></div>
                    <div className="text-[18px] font-[800]">{activeQ?.ticketNumber || "—"}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex-1 p-4 sm:p-5 overflow-auto bg-[#FCFCFD]">
            <div className="text-[10px] font-[800] tracking-wider text-slate-400 uppercase">DAFTAR TUNGGU PASIEN ({queues.filter((q:any)=>["waiting","checked_in"].includes(q.status)).length})</div>
            <div className="mt-3 space-y-2">
              {queues.filter((q:any)=>["waiting","checked_in"].includes(q.status)).slice(0, 8).map((q:any, i:number)=>(
                <div key={q.id} className="flex justify-between items-center rounded-lg border border-slate-100 p-2.5 bg-white hover:bg-slate-50 transition-colors text-[12.5px]">
                  <div className="flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-slate-100 grid place-items-center text-[10px] font-[700]">{i+1}</span><span className="font-[750]">{q.ticketNumber}</span><span className="text-[11px] text-slate-400">Est {q.estimatedWaitMinutes}m</span></div>
                  <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-[700] ${q.status==="checked_in"?"bg-violet-50 text-violet-700":"bg-amber-50 text-amber-700"}`}>{q.status==="checked_in"?"CHECK-IN":"MENUNGGU"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
