"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RSHSMark } from "@/components/ui/rshs-logo";

export function Navbar({ user, onLogout, rshsMode = true }: { user?: any; onLogout?: () => void; rshsMode?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    const saved = localStorage.getItem("antriin-theme") as any;
    if (saved) setTheme(saved);
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("antriin-theme", newTheme);
    if (newTheme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  const isLanding = pathname === "/";

  // Navigation links dengan label yang jelas dan redirect yang sesuai
  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "#fitur", label: "Fitur" },
    { href: "#cara-kerja", label: "Alur" },
    { href: "/ai", label: "Konsultasi" },
    { href: "/locations", label: "Pelayanan" },
  ];

  // Full labels untuk larger screens
  const navLinksFull = [
    { href: "/", label: "Beranda" },
    { href: "#fitur", label: "Fitur Unggulan" },
    { href: "#cara-kerja", label: "Alur Pasien" },
    { href: "/ai", label: "Konsultasi AI" },
    { href: "/locations", label: "Pelayanan" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-40 transition-all duration-500 ${scrolled ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-b border-slate-200/60 dark:border-slate-800 shadow-[0_1px_0_rgba(0,166,158,0.04),0_8px_24px_rgba(0,166,158,0.04)] py-2.5" : isLanding ? "bg-transparent py-4" : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800 py-2.5"}`}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0" onClick={() => setMobileOpen(false)}>
          <div className="transition-transform duration-300 group-hover:scale-[1.06] group-hover:-rotate-6">
            <RSHSMark size={32} />
          </div>
          <div className="flex flex-col leading-[1.1] min-w-0">
            <span className="text-[13px] sm:text-[14px] lg:text-[15px] font-[800] tracking-[-0.02em] text-[#0B3D3A] dark:text-white flex items-center gap-1.5 whitespace-nowrap">
              Antriin
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#00A69E]/10 border border-[#00A69E]/20 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-[800] tracking-widest text-[#00A69E] pill-hover-yellow"><span className="h-1 w-1 rounded-full bg-[#00A69E] animate-pulse" />RSHS</span>
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[-0.01em] font-[600] text-[#00A69E] dark:text-[#5EEAD4] truncate max-w-[140px] sm:max-w-[180px] lg:max-w-none">
              <span className="hidden md:inline">Kemenkes RS Hasan Sadikin</span>
              <span className="md:hidden">Kemenkes RSHS</span>
              <span className="hidden xl:inline text-slate-400 dark:text-slate-500"> • Pasteur 38 Bandung</span>
            </span>
          </div>
        </Link>

        {/* Desktop nav (lg+) */}
        <div className="hidden lg:flex items-center gap-1 rounded-full bg-slate-100/80 dark:bg-slate-800/80 p-1 backdrop-blur border border-slate-200/50 dark:border-slate-700/50">
          {navLinksFull.map(link => {
            const isAnchor = link.href.startsWith("#");
            const handleClick = (e: React.MouseEvent) => {
              if (isAnchor) {
                e.preventDefault();
                const target = document.querySelector(link.href);
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }
            };
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleClick}
                className="nav-link-yellow rounded-full px-4 py-1.5 text-[13px] font-[600] tracking-[-0.01em] text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Tablet nav (md to lg) */}
        <div className="hidden md:flex lg:hidden items-center gap-0.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 p-1 backdrop-blur border border-slate-200/50 dark:border-slate-700/50">
          {navLinks.map(link => {
            const isAnchor = link.href.startsWith("#");
            const handleClick = (e: React.MouseEvent) => {
              if (isAnchor) {
                e.preventDefault();
                const target = document.querySelector(link.href);
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }
            };
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleClick}
                className="nav-link-yellow rounded-full px-3 py-1 text-[12px] font-[600] tracking-[-0.01em] text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button onClick={toggleTheme} aria-label="Toggle theme" className="theme-toggle-yellow h-8 w-8 sm:h-9 sm:w-9 grid place-items-center rounded-full border border-slate-200 bg-white text-[13px] sm:text-[14px] shadow-sm">
            {theme === "light" ? "☾" : "☀"}
          </button>

          {user ? (
            <>
              <Link href="/dashboard" className="hidden sm:block">
                <Button variant="secondary" size="sm" className="rounded-full">Dashboard</Button>
              </Link>
              <div className="relative" ref={profileRef}>
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-slate-200 bg-white py-0.5 sm:py-1 pl-0.5 sm:pl-1 pr-2 sm:pr-3 shadow-sm hover:shadow-md hover:border-[#C8D400] transition-all dark:bg-slate-800 dark:border-slate-700">
                  <img src={user.avatarUrl || `https://i.pravatar.cc/100?img=${(user.name?.length % 70) || 10}`} alt="" className="h-6 w-6 sm:h-7 sm:w-7 rounded-full object-cover" />
                  <span className="text-[12px] sm:text-[13px] font-[600] tracking-tight text-[#0B3D3A] dark:text-white hidden md:block max-w-[100px] truncate">{user.name?.split(" ")[0]}</span>
                  <svg width="10" height="10" viewBox="0 0 12 12" className={`transition-transform hidden sm:block ${profileOpen ? "rotate-180" : ""}`}><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200/70 bg-white p-2 shadow-[0_16px_48px_rgba(0,166,158,0.14)] animate-[scaleIn_0.25s_cubic-bezier(0.16,1,0.3,1)] dark:bg-slate-900 dark:border-slate-800">
                    <div className="px-3 py-3">
                      <div className="text-[13px] font-[700] tracking-tight text-[#0B3D3A] dark:text-white">{user.name}</div>
                      <div className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{user.email}</div>
                      <div className="mt-2 inline-flex rounded-full bg-[#00A69E] px-2.5 py-1 text-[10px] font-[700] text-white tracking-widest uppercase">{user.role?.replace("_", " ")}</div>
                    </div>
                    <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
                    {[
                      { href: "/dashboard", icon: "📊", label: "Dashboard" },
                      { href: "/dashboard/profile", icon: "⚙️", label: "Pengaturan Akun" },
                      { href: "/locations", icon: "📍", label: "Jelajahi Lokasi" },
                    ].map(item => (
                      <Link key={item.href} href={item.href} onClick={() => setProfileOpen(false)} className="row-hover-yellow flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-[500] text-slate-700 dark:text-slate-300">
                        <span className="text-[14px]">{item.icon}</span> {item.label}
                      </Link>
                    ))}
                    <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
                    <button onClick={() => { setProfileOpen(false); onLogout?.(); }} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-[600] text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                      <span className="text-[14px]">⎋</span> Keluar
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="link-hover-yellow hidden sm:inline-flex text-[12.5px] sm:text-[13px] font-[600] tracking-[-0.01em] text-slate-600 dark:text-slate-300 px-3 py-2">Masuk</Link>
              <Link href="/register">
                <Button variant="primary" size="sm" className="rounded-full">Daftar</Button>
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden h-8 w-8 grid place-items-center rounded-full border border-slate-200 bg-white shadow-sm icon-hover-yellow">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={`transition-transform ${mobileOpen ? "rotate-90" : ""}`}><path d={mobileOpen ? "M3 3L13 13M13 3L3 13" : "M2 4.5H14M2 8H14M2 11.5H14"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200/60 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-4 animate-[slideUp_0.3s_ease]">
          <div className="flex flex-col gap-1">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-[600] bg-[#C8D400] text-[#0B3D3A] border border-[#C8D400] shadow-[0_4px_14px_rgba(200,212,0,0.3)]">
                  <span>📊</span> Dashboard
                </Link>
                {[
                  { href: "/dashboard/profile", icon: "⚙️", label: "Pengaturan Akun" },
                  { href: "/locations", icon: "📍", label: "Jelajahi Lokasi" },
                ].map(l => (
                  <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="row-hover-yellow flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-[500] text-slate-700 dark:text-slate-200">
                    <span>{l.icon}</span> {l.label}
                  </Link>
                ))}
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
                <button onClick={() => { setMobileOpen(false); onLogout?.(); }} className="flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-[600] text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                  <span></span> Keluar
                </button>
              </>
            ) : (
              <>
                {[
                  { href: "/", label: "Beranda", desc: "Halaman utama" },
                  { href: "#fitur", label: "Fitur Unggulan", desc: "Lihat fitur sistem antrean" },
                  { href: "#cara-kerja", label: "Alur Pasien", desc: "3 langkah mudah" },
                  { href: "/ai", label: "Konsultasi AI", desc: "Tanya AI tentang gejala" },
                  { href: "/locations", label: "Pelayanan", desc: "Daftar poli & instalasi" },
                ].map(l => {
                  const isAnchor = l.href.startsWith("#");
                  const handleClick = (e: React.MouseEvent) => {
                    if (isAnchor) {
                      e.preventDefault();
                      const target = document.querySelector(l.href);
                      if (target) {
                        target.scrollIntoView({ behavior: "smooth" });
                      }
                    }
                    setMobileOpen(false);
                  };
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={handleClick}
                      className="row-hover-yellow flex items-center justify-between rounded-xl px-4 py-3 text-[14px] font-[600] text-slate-700 hover:text-[#C8D400] dark:text-slate-200"
                    >
                      <div>
                        <div>{l.label}</div>
                        <div className="text-[11px] font-[400] text-slate-500 mt-0.5">{l.desc}</div>
                      </div>
                      <span className="text-[#C8D400]">→</span>
                    </Link>
                  );
                })}
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)}><Button variant="secondary" className="w-full rounded-full">Masuk</Button></Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}><Button variant="primary" className="w-full rounded-full">Daftar</Button></Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
