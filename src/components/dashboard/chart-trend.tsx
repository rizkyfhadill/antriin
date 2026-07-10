"use client";
import { useEffect, useRef } from "react";

export function ChartTrend({ data }: { data: { date: string; count: number }[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const w = rect.width;
    const h = rect.height;
    const padding = 20;
    
    ctx.clearRect(0,0,w,h);
    
    const max = Math.max(...data.map(d=>d.count), 10);
    const points = data.map((d,i) => ({
      x: padding + (i / (data.length-1)) * (w - padding*2),
      y: h - padding - (d.count / max) * (h - padding*2),
      count: d.count
    }));
    
    // gradient fill
    const gradient = ctx.createLinearGradient(0,0,0,h);
    gradient.addColorStop(0, "rgba(59,130,246,0.25)");
    gradient.addColorStop(1, "rgba(59,130,246,0)");
    ctx.beginPath();
    ctx.moveTo(points[0].x, h - padding);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length-1].x, h - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((p, i) => {
      if (i===0) return;
      const prev = points[i-1];
      const cx = (prev.x + p.x)/2;
      ctx.quadraticCurveTo(prev.x, prev.y, cx, (prev.y + p.y)/2);
      if (i===points.length-1) ctx.lineTo(p.x, p.y);
    });
    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
    
    // points
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
      ctx.fillStyle = "#00A69E";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
      ctx.fillStyle = "#fff";
      ctx.fill();
    });
  }, [data]);

  return <canvas ref={canvasRef} className="w-full h-[180px]" style={{ width:"100%", height:"180px" }} />;
}

export function BarMini({ data, color = "#00A69E" }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-[48px]">
      {data.map((v,i)=>(
        <div key={i} className="flex-1 rounded-full transition-all hover:opacity-80" style={{ height:`${(v/max)*100}%`, background: color, minHeight:"4px" }} />
      ))}
    </div>
  );
}
