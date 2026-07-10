"use client";
import Link from "next/link";
import { RSHSLogo } from "@/components/ui/rshs-logo";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      {/* Main Footer */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <RSHSLogo variant="horizontal" size={36} />
            </Link>
            <p className="text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-400 max-w-[280px]">
              Sistem antrean digital resmi RSUP Dr. Hasan Sadikin Bandung. Ambil antrean dari rumah, pantau realtime, check-in QR.
            </p>
            <div className="mt-4 flex gap-2">
              <a href="#" className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 dark:border-slate-700 hover:bg-[#C8D400] hover:border-[#C8D400] transition-colors text-[14px]">📘</a>
              <a href="#" className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 dark:border-slate-700 hover:bg-[#C8D400] hover:border-[#C8D400] transition-colors text-[14px]">📷</a>
              <a href="#" className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 dark:border-slate-700 hover:bg-[#C8D400] hover:border-[#C8D400] transition-colors text-[14px]">🐦</a>
            </div>
          </div>

          {/* Layanan */}
          <div>
            <div className="text-[11px] font-[800] tracking-widest text-slate-400 mb-3">LAYANAN</div>
            <ul className="space-y-2">
              {[
                { label: "Poliklinik Terpadu", href: "/locations" },
                { label: "IGD 24 Jam", href: "/locations" },
                { label: "Radiologi & Lab", href: "/locations" },
                { label: "Farmasi", href: "/locations" },
                { label: "Konsultasi AI", href: "/ai" },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="link-hover-yellow text-[13px] text-slate-600 dark:text-slate-400 hover:text-[#C8D400]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informasi */}
          <div>
            <div className="text-[11px] font-[800] tracking-widest text-slate-400 mb-3">INFORMASI</div>
            <ul className="space-y-2">
              {[
                { label: "Tentang RSHS", href: "/" },
                { label: "Cara Kerja", href: "/#cara-kerja" },
                { label: "Fitur Unggulan", href: "/#fitur" },
                { label: "Alur Pasien", href: "/#cara-kerja" },
                { label: "Kontak", href: "/" },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="link-hover-yellow text-[13px] text-slate-600 dark:text-slate-400 hover:text-[#C8D400]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <div className="text-[11px] font-[800] tracking-widest text-slate-400 mb-3">KONTAK</div>
            <ul className="space-y-2 text-[13px] text-slate-600 dark:text-slate-400">
              <li className="flex gap-2">
                <span className="shrink-0">📍</span>
                <span>Jl. Pasteur No.38, Bandung 40161</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">📞</span>
                <span>(022) 2032214</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0"></span>
                <a href="https://rshs.go.id" target="_blank" rel="noreferrer" className="link-hover-yellow hover:text-[#C8D400]">rshs.go.id</a>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">🕒</span>
                <span>Poli: 07:00 - 16:00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-500">
            <div className="text-center sm:text-left">
              © 2026 RSUP Dr. Hasan Sadikin Bandung • Sistem Antrean Digital Resmi Kemenkes
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <Link href="/" className="link-hover-yellow hover:text-[#C8D400]">Beranda</Link>
              <Link href="/locations" className="link-hover-yellow hover:text-[#C8D400]">Pelayanan</Link>
              <Link href="/ai" className="link-hover-yellow hover:text-[#C8D400]">Konsultasi AI</Link>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Sistem Operasional</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
