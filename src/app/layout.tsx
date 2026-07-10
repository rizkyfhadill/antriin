import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { SplashScreen } from "@/components/ui/loading-screen";
import { AuthProvider } from "@/lib/useAuth";

export const metadata: Metadata = {
  title: "Sistem Antrean Digital RSUP Dr. Hasan Sadikin Bandung",
  description: "Ambil nomor antrean poli RSHS Bandung dari rumah. Pantau estimasi realtime, check-in QR di Gedung Kemuning, display TV dengan suara panggil. Jl. Pasteur No.38 Bandung. Untuk pasien BPJS & Umum.",
  keywords: ["RSHS", "RSUP Hasan Sadikin", "antrean RSHS", "antrean online RSHS", "Poli RSHS Bandung", "BPJS RSHS", "IGD RSHS"],
  openGraph: {
    title: "Antriin RSHS — Antrean Pintar RSUP Dr. Hasan Sadikin Bandung",
    description: "Tidak perlu antre subuh di RSHS. Ambil nomor dari rumah, AI prediksi waktu tunggu, QR check-in, display TV. Jl. Pasteur No.38 Bandung.",
    type: "website",
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              // Default awal aplikasi selalu LIGHT.
              // Dark mode hanya aktif jika pengguna pernah memilih dark secara eksplisit.
              const t = localStorage.getItem('antriin-theme');
              if (t === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
                if (!t) localStorage.setItem('antriin-theme', 'light');
              }
            } catch(e){}
          })();
        `}} />
      </head>
      <body className="bg-[#FCFCFD] text-[#0B3D3A] antialiased selection:bg-[#00A69E]/20 dark:bg-[#020617] dark:text-slate-100 min-h-screen">
        <SplashScreen />
        <ToastProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ToastProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}
