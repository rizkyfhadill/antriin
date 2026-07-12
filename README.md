
**Sistem Antrean Digital RSUP Dr. Hasan Sadikin Bandung**

AI Prediction • QR Check-in • Display TV Realtime

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue) ![Supabase](https://img.shields.io/badge/Supabase-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Fitur Utama

### Untuk Pasien
- Ambil antrean poli dari rumah
- Pantau estimasi waktu tunggu realtime
- QR Code check-in (anti calo) + download PDF/JPG
- Rating & feedback + riwayat antrean

### Untuk Petugas & Manager
- Panggil & update status antrean
- Scan QR + monitor loket
- Analytics, AI insight & export laporan

### AI & Teknologi
- **Gemini AI Konsultasi** kesehatan
- **AI Prediction** waktu tunggu (94% akurat)
- Display TV dengan suara panggil otomatis
- Dark mode & fully responsive

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + React + TypeScript + Tailwind
- **Backend**: Next.js API Routes + Drizzle ORM
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini 2.0 Flash
- **Auth**: JWT (jose) + bcryptjs

---

## 🚀 Quick Start

```bash
# 1. Clone & install
git clone https://github.com/username/antriin-rshs.git
cd antriin-rshs
npm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local (DATABASE_URL, JWT_SECRET, dll)

# 3. Setup database
npm run db:push

# 4. Seed data (opsional)
curl -X POST http://localhost:3000/api/seed

# 5. Jalankan
npm run dev
```

Buka http://localhost:3000

### Environment Variables Penting
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-32-char-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 👥 User Accounts (Setelah Seed)

| Role         | Email                        | Password   |
|--------------|------------------------------|------------|
| Pasien       | pasien@rshs.go.id            | RSHS@2026  |
| Petugas Poli | petugas.poli@rshs.go.id      | RSHS@2026  |
| Manager Poli | manager.poli@rshs.go.id      | RSHS@2026  |
| Direktur     | direktur@rshs.go.id          | RSHS@2026  |

---

## 🔌 API Utama

| Endpoint                  | Method | Keterangan                     |
|---------------------------|--------|--------------------------------|
| `/api/auth/login`         | POST   | Login                          |
| `/api/queues`             | GET/POST | Ambil & buat antrean         |
| `/api/queues/[id]`        | PATCH  | Update status antrean          |
| `/api/locations`          | GET    | Daftar poli/lokasi             |
| `/api/analytics`          | GET    | Data analytics & AI insight    |
| `/api/qr/verify`          | POST   | Verifikasi QR check-in         |

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

Tambahkan semua env variables di Vercel Dashboard.

### Docker
```bash
docker build -t antriin-rshs .
docker run -p 3000:3000 --env-file .env.local antriin-rshs
```

---

## 📋 Project Structure (Ringkas)

```
src/
├── app/               # App Router (pages + API)
│   ├── (auth)/        # Login, Register
│   ├── dashboard/     # Protected area
│   ├── display/       # TV Display
│   └── api/           # API routes
├── components/        # UI Components
├── db/                # Drizzle schema
└── lib/               # Auth, utils
```

---

## 🐛 Troubleshooting Singkat

- **DB gagal connect** → Cek `DATABASE_URL` & Supabase aktif
- **JWT error** → Generate secret baru (`openssl rand -base64 32`)
- **QR tidak scan** → Cek kamera permission & endpoint `/api/qr/verify`

---

## 📝 License

MIT License © 2026 RSUP Dr. Hasan Sadikin Bandung

---

**RSUP Dr. Hasan Sadikin Bandung • 2026**
