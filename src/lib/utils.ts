export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
export function formatMinutes(min: number) {
  if (min < 60) return `${min} menit`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (m === 0) return `${h} jam`;
  return `${h} jam ${m} menit`;
}
export function generateTicketNumber(serviceCode: string = "A"): string {
  const num = Math.floor(Math.random() * 900 + 100);
  return `${serviceCode}${num.toString().padStart(3, "0")}`;
}
export function generateQRCode(): string {
  return `ANTR-${Date.now()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}
export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    waiting: "bg-amber-100 text-amber-800 border-amber-200",
    called: "bg-blue-100 text-blue-800 border-blue-200",
    checked_in: "bg-violet-100 text-violet-800 border-violet-200",
    serving: "bg-sky-100 text-sky-800 border-sky-200",
    completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
    cancelled: "bg-slate-100 text-slate-600 border-slate-200",
    missed: "bg-red-100 text-red-800 border-red-200",
  };
  return map[status] || "bg-slate-100 text-slate-700";
}
export function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    waiting: "Menunggu",
    called: "Dipanggil",
    checked_in: "Check-in",
    serving: "Sedang Dilayani",
    completed: "Selesai",
    cancelled: "Dibatalkan",
    missed: "Terlewat",
  };
  return map[status] || status;
}
export function formatCurrency(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}
