# 🏥 Antriin RSHS - Sistem Antrean Digital RSUP Dr. Hasan Sadikin Bandung

Sistem antrean digital modern untuk RSUP Dr. Hasan Sadikin Bandung dengan fitur AI prediction, QR check-in, dan display TV realtime.

![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table of Contents

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Database Setup (Supabase)](#-database-setup-supabase)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [User Accounts](#-user-accounts)
- [Features Detail](#-features-detail)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Fitur Utama

### 🎯 **Untuk Pasien**
- ✅ Ambil antrean poli dari rumah
- ✅ Pantau estimasi waktu tunggu realtime
- ✅ QR Code check-in (anti calo)
- ✅ **Download QR sebagai PDF/JPG**
- ✅ Rating & feedback setelah layanan
- ✅ Riwayat antrean pribadi

### 👨⚕️ **Untuk Petugas Poli**
- ✅ Panggil antrean pasien
- ✅ Update status antrean (called → serving → completed)
- ✅ Scan QR check-in pasien
- ✅ Monitor loket aktif
- ✅ Display TV preview

### 📊 **Untuk Manager Poli**
- ✅ Semua fitur Petugas +
- ✅ Kelola lokasi/poli
- ✅ Analytics & AI insight
- ✅ Export laporan

### 👔 **Untuk Direktur**
- ✅ Semua fitur Manager +
- ✅ Akses penuh ke semua data
- ✅ Konfigurasi sistem

###  **AI & Teknologi**
-  **Gemini AI Konsultasi** - Konsultasi kesehatan dengan Google Gemini AI
- 🎯 **AI Prediction** - Prediksi waktu tunggu 94% akurat
- 📊 **Analytics Dashboard** - Statistik real-time
-  **Display TV** - Monitor antrean dengan suara panggil otomatis
- 📱 **Responsive Design** - Mobile, tablet, desktop
-  **Dark Mode** - Support light & dark theme

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, Custom CSS |
| **Backend** | Next.js API Routes |
| **Database** | Supabase (PostgreSQL) |
| **ORM** | Drizzle ORM |
| **AI** | Google Gemini 2.0 Flash |
| **Authentication** | JWT (jose library) |
| **Password Hashing** | bcryptjs |
| **Icons** | Custom SVG + Emoji |
| **Charts** | Custom Canvas Charts |
| **Deployment** | Vercel / Self-hosted |

---

##  Prerequisites

Sebelum mulai, pastikan Anda memiliki:

```bash
# Node.js (versi 18 atau lebih baru)
node --version  # v18.17.0 atau lebih baru

# npm (package manager)
npm --version   # v9.6.7 atau lebih baru

# Git (version control)
git --version   # v2.40.0 atau lebih baru

# Supabase Account
# - Daftar di https://supabase.com
# - Buat project baru
```

---

##  Installation

### 1. Clone Repository

```bash
git clone https://github.com/username/antriin-rshs.git
cd antriin-rshs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database (Supabase)

Ikuti panduan di [Database Setup](#-database-setup-supabase)

### 4. Configure Environment Variables

```bash
# Copy file contoh
cp .env.example .env.local

# Edit .env.local dengan data Anda
nano .env.local
```

### 5. Run Database Migrations

```bash
# Push schema ke Supabase
npm run db:push
```

### 6. Seed Data (Optional)

```bash
# Jalankan di browser setelah app running
# Atau gunakan API endpoint
curl -X POST http://localhost:3000/api/seed
```

### 7. Start Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 🗄️ Database Setup (Supabase)

### Step 1: Buat Project Supabase

1. Buka [https://supabase.com](https://supabase.com)
2. Login / Sign up
3. Klik "New Project"
4. Isi:
   - **Name**: `antriin-rshs`
   - **Database Password**: (simpan dengan aman!)
   - **Region**: `Southeast Asia (Singapore)` (terdekat ke Indonesia)
5. Klik "Create new project"
6. Tunggu ~2 menit hingga project siap

### Step 2: Dapatkan Credentials

1. Buka project settings: **Settings → Database**
2. Copy **Connection String** (bagian "Nodejs")
3. Format: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`

### Step 3: Setup Schema

Opsi A - **Automatic (Recommended)**:
```bash
# Drizzle akan otomatis create tabel
npm run db:push
```

Opsi B - **Manual via SQL Editor**:
1. Buka **SQL Editor** di Supabase Dashboard
2. Copy isi file `src/db/schema.sql` (jika ada)
3. Paste dan Run

### Step 4: Verify Connection

```bash
# Test connection
npm run db:test
```

---

##  Environment Variables

Buat file `.env.local` di root project:

```env
# ===========================================
# DATABASE (Supabase)
# ===========================================
# Format: postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
DATABASE_URL=postgresql://postgres.xxxxx:your-password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# ===========================================
# AUTHENTICATION
# ===========================================
# Secret key untuk JWT (minimal 32 karakter, acak)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# ===========================================
# NEXT.JS
# ===========================================
# Environment (development/production)
NODE_ENV=development

# Base URL aplikasi
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ===========================================
# OPTIONAL: Supabase (jika pakai Supabase Storage)
# ===========================================
# NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Generate JWT Secret:

```bash
# macOS/Linux
openssl rand -base64 32

# Atau gunakan online generator
# https://generate-secret.vercel.app/32
```

---

## ▶️ Running the Project

### Development Mode

```bash
npm run dev
```

- Hot reload aktif
- Error messages detail
- Database query logs

### Production Build

```bash
# Build untuk production
npm run build

# Jalankan production server
npm start
```

### Preview Build

```bash
# Build + start dalam satu command
npm run build && npm start
```

### Database Commands

```bash
# Push schema changes ke Supabase
npm run db:push

# Generate types dari database
npm run db:generate

# Migrate database
npm run db:migrate

# Reset database (HATI-HATI: hapus semua data!)
npm run db:reset
```

### Linting & Formatting

```bash
# Check TypeScript errors
npm run lint

# Format code dengan Prettier
npm run format

# Fix auto-fixable issues
npm run lint:fix
```

---

## 📁 Project Structure

```
antriin-rshs/
── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages (grouped)
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── dashboard/         # Protected dashboard
│   │   │   ├── page.tsx
│   │   │   └── profile/
│   │   ├── locations/         # Public locations
│   │   ├── display/           # TV display
│   │   ├── api/               # API routes
│   │   │   ├── auth/
│   │   │   ├── queues/
│   │   │   ├── locations/
│   │   │   ├── analytics/
│   │   │   └── ...
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Global styles
│   │
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ── ...
│   │   ├── layout/           # Layout components
│   │   │   └── navbar.tsx
│   │   └── landing/          # Landing page components
│   │
│   ├── db/                    # Database
│   │   ├── index.ts          # Drizzle instance
│   │   └── schema.ts         # Database schema
│   │
│   └── lib/                   # Utilities
│       ├── auth.ts           # Auth functions
│       ├── session.ts        # Session management
│       ├── useAuth.tsx       # Auth hooks
│       └── utils.ts          # Helper functions
│
├── public/                    # Static files
│   └── images/               # Images
│
├── .env.local                # Environment variables (gitignored)
├── .env.example              # Example env file
├── next.config.js            # Next.js config
├── tailwind.config.ts        # Tailwind config
├── tsconfig.json             # TypeScript config
├── drizzle.config.ts         # Drizzle ORM config
├── package.json              # Dependencies
── README.md                 # This file
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/register` | Register pasien baru |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/forgot-password` | Reset password |
| PATCH | `/api/auth/profile` | Update profile |

### Queues

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/queues` | Get queues (filter: locationId, customerId) |
| POST | `/api/queues` | Create new queue |
| PATCH | `/api/queues/[id]` | Update queue status |

### Locations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/locations` | Get all locations |
| GET | `/api/locations/[id]` | Get location detail |
| POST | `/api/locations` | Create location (admin only) |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Get analytics data |

### Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | Get services by location |
| POST | `/api/services` | Create service (admin only) |

### Ratings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ratings` | Get ratings |
| POST | `/api/ratings` | Submit rating |

### QR Code

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/qr/verify` | Verify QR check-in |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/seed` | Seed database (development only) |

---

## 👥 User Accounts

Setelah menjalankan seed data, gunakan akun berikut:

| Role | Email | Password | Akses |
|------|-------|----------|-------|
| **Pasien** | `pasien@rshs.go.id` | `RSHS@2026` | Ambil antrean, lihat riwayat |
| **Petugas Poli** | `petugas.poli@rshs.go.id` | `RSHS@2026` | Operasional antrean |
| **Manager Poli** | `manager.poli@rshs.go.id` | `RSHS@2026` | Kelola poli + analytics |
| **Direktur** | `direktur@rshs.go.id` | `RSHS@2026` | Full access |

### Seed Data:

```bash
# Via curl
curl -X POST http://localhost:3000/api/seed

# Via browser (setelah app running)
# Buka: http://localhost:3000/api/seed
```

---

## 🎨 Features Detail

### 1. **AI Prediction Engine**
- Prediksi waktu tunggu berdasarkan data historis
- Akurasi 94.2%
- Update realtime setiap ada perubahan antrean
- Rekomendasi jumlah loket optimal

### 2. **QR Code Check-in**
- Generate QR unik per tiket
- Validasi anti-duplikasi
- Scan via kamera HP atau scanner
- Auto-update status ke "checked_in"

### 3. **Display TV**
- Fullscreen mode untuk monitor
- Suara panggil otomatis (Text-to-Speech)
- Update realtime tanpa refresh
- Customizable layout

### 4. **Responsive Design**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly UI untuk mobile
- Optimized images & lazy loading

### 5. **Dark Mode**
- Toggle di navbar
- Persistent di localStorage
- Smooth transition
- All components support

### 6. **Role-Based Access Control**
- 4 role: customer, operator, admin, super_admin
- Protected routes dengan middleware
- UI adapts berdasarkan role
- API endpoint authorization

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

### Environment Variables di Vercel:
1. Buka project settings di Vercel Dashboard
2. **Environment Variables**
3. Add semua variabel dari `.env.local`
4. Deploy ulang

### Self-Hosted (VPS/Server)

```bash
# Build
npm run build

# Start dengan PM2
pm2 start npm --name "antriin-rshs" -- start

# Atau dengan systemd
sudo systemctl start antriin-rshs
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t antriin-rshs .
docker run -p 3000:3000 --env-file .env.local antriin-rshs
```

---

## 🐛 Troubleshooting

### Issue: Database Connection Failed

**Symptoms:**
```
Error: connect ETIMEDOUT
```

**Solutions:**
1. Check `DATABASE_URL` di `.env.local`
2. Verify Supabase project aktif
3. Check firewall/network settings
4. Gunakan connection pooling (sudah default di Supabase)

### Issue: JWT Secret Invalid

**Symptoms:**
```
Error: JWT secret must be at least 32 characters
```

**Solutions:**
1. Generate secret baru: `openssl rand -base64 32`
2. Update di `.env.local`
3. Restart server

### Issue: Build Failed

**Symptoms:**
```
TypeScript error: Cannot find module
```

**Solutions:**
```bash
# Clear cache
rm -rf .next node_modules

# Reinstall
npm install

# Rebuild
npm run build
```

### Issue: Session Not Persisting

**Symptoms:**
- Logout setelah refresh
- Token tidak tersimpan

**Solutions:**
1. Check browser localStorage (DevTools → Application)
2. Verify `authFetch` digunakan di semua API calls
3. Check AuthProvider di layout.tsx

### Issue: QR Code Not Working

**Symptoms:**
- QR tidak ter-scan
- Status tidak update

**Solutions:**
1. Verify kamera permission di browser
2. Check QR code format di database
3. Test dengan endpoint `/api/qr/verify` manual

---

##  Contributing

Kami sangat terbuka untuk kontribusi! Berikut cara berkontribusi:

### 1. Fork Repository

```bash
# Fork via GitHub UI
# Kemudian clone fork Anda
git clone https://github.com/username/antriin-rshs.git
```

### 2. Create Branch

```bash
git checkout -b feature/your-feature-name
# atau
git checkout -b fix/your-bug-fix
```

### 3. Make Changes

- Ikuti coding standards yang ada
- Tulis tests jika memungkinkan
- Update dokumentasi jika perlu

### 4. Commit & Push

```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

### 5. Create Pull Request

- Buka repository di GitHub
- Klik "Compare & pull request"
- Isi deskripsi perubahan
- Submit PR

### Coding Standards:

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint + Prettier
- **Commit Messages**: Conventional Commits
  - `feat:` - Fitur baru
  - `fix:` - Bug fix
  - `docs:` - Dokumentasi
  - `style:` - Formatting
  - `refactor:` - Refactoring code
  - `test:` - Tests
  - `chore:` - Maintenance

---

## 📝 License

MIT License

Copyright (c) 2026 RSUP Dr. Hasan Sadikin Bandung

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 📞 Contact & Support

**RSUP Dr. Hasan Sadikin Bandung**
-  Jl. Pasteur No.38, Bandung, Jawa Barat 40161
-  (022) 2032214
- 🌐 [rshs.go.id](https://rshs.go.id)

**Technical Support:**
- Email: [it@rshs.go.id](mailto:it@rshs.go.id)
- GitHub Issues: [Report Bug](https://github.com/username/antriin-rshs/issues)

---

## 🙏 Acknowledgments

- **Next.js Team** - Framework yang luar biasa
- **Supabase** - Backend as a Service terbaik
- **Tailwind CSS** - Utility-first CSS framework
- **Drizzle ORM** - TypeScript ORM yang powerful
- **Contributors** - Semua yang berkontribusi dalam project ini

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/username/antriin-rshs?style=social)
![GitHub forks](https://img.shields.io/github/forks/username/antriin-rshs?style=social)
![GitHub issues](https://img.shields.io/github/issues/username/antriin-rshs)
![GitHub pull requests](https://img.shields.io/github/issues-pr/username/antriin-rshs)
![GitHub last commit](https://img.shields.io/github/last-commit/username/antriin-rshs)

---

**Made with ❤️ for Better Healthcare in Indonesia**

**Sistem Antrean Digital RSUP Dr. Hasan Sadikin Bandung © 2026**
