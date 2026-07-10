# 🚀 Quick Start Guide - Antriin RSHS

Panduan cepat untuk menjalankan project dalam 5 menit!

---

## 📋 Prerequisites

- ✅ Node.js 18+ ([Download](https://nodejs.org))
- ✅ npm 9+ (sudah termasuk dengan Node.js)
- ✅ Supabase account ([Sign up](https://supabase.com))

---

## 🎯 5 Langkah Setup

### Step 1: Clone & Install

```bash
git clone https://github.com/username/antriin-rshs.git
cd antriin-rshs
npm install
```

### Step 2: Setup Supabase Database

1. Buka [supabase.com](https://supabase.com) → Login
2. Klik **"New Project"**
3. Isi:
   - Name: `antriin-rshs`
   - Database Password: `buat-password-aman`
   - Region: `Southeast Asia (Singapore)`
4. Tunggu ~2 menit
5. Buka **Settings → Database**
6. Copy **Connection String** (pilih "Nodejs")

### Step 3: Configure Environment

```bash
# Copy example file
cp .env.example .env.local

# Edit dengan text editor
nano .env.local
```

Isi dengan data Anda:

```env
# Ganti dengan connection string dari Supabase
DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# Generate secret: openssl rand -base64 32
JWT_SECRET=rahasia-sangat-panjang-minimal-32-karakter-acak

NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Setup Database

```bash
# Push schema ke Supabase
npm run db:push
```

### Step 5: Run!

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) 

---

## 🔑 Login Credentials

Setelah app berjalan, seed data otomatis:

| Role | Email | Password |
|------|-------|----------|
| Pasien | `pasien@rshs.go.id` | `RSHS@2026` |
| Petugas | `petugas.poli@rshs.go.id` | `RSHS@2026` |
| Manager | `manager.poli@rshs.go.id` | `RSHS@2026` |
| Direktur | `direktur@rshs.go.id` | `RSHS@2026` |

---

## 🎨 First Steps

1. **Login sebagai Pasien**
   - Buka: http://localhost:3000/login
   - Email: `pasien@rshs.go.id`
   - Password: `RSHS@2026`

2. **Ambil Antrean**
   - Dashboard → Tab "Ambil Antrean"
   - Pilih poli → Pilih layanan
   - Dapat tiket + QR code

3. **Explore Dashboard**
   - Lihat antrean realtime
   - Cek statistik
   - Update profil

---

## 🐛 Common Issues

### "Database connection failed"
- ✅ Check `DATABASE_URL` di `.env.local`
- ✅ Verify Supabase project aktif
- ✅ Copy connection string dengan benar

### "JWT secret invalid"
- ✅ Generate secret baru: `openssl rand -base64 32`
- ✅ Minimal 32 karakter

### "Module not found"
```bash
rm -rf node_modules .next
npm install
```

---

##  Next Steps

- 📖 Baca [README.md](README.md) untuk dokumentasi lengkap
- 🔌 Explore [API Endpoints](README.md#-api-endpoints)
- 🎨 Customize UI di `src/components/`
- 🗄️ Modify schema di `src/db/schema.ts`

---

##  Tips

- **Development**: Pakai `npm run dev` untuk hot reload
- **Production**: Build dengan `npm run build` lalu `npm start`
- **Database**: Gunakan Supabase Dashboard untuk browse data
- **Debug**: Check console browser + terminal

---

**Happy Coding! **
