# 📊 Status Database - Antriin RSHS

Dokumentasi lengkap tentang sumber data untuk setiap halaman dan komponen di website Antriin RSHS.

---

## ✅ **Data dari Database Supabase**

### **1. Users (Pengguna)**
**Tabel:** `users`
**API:** `/api/auth/login`, `/api/auth/register`, `/api/auth/me`

**Data yang disimpan:**
- ✅ Nama lengkap
- ✅ Email
- ✅ Password (hashed dengan bcrypt)
- ✅ Role (customer, operator, admin, super_admin)
- ✅ No. HP
- ✅ Kota domisili
- ✅ Avatar URL
- ✅ Created/Updated timestamp

**Penggunaan:**
- Login/Register → Simpan ke database
- Dashboard → Ambil dari database
- Profile → Update di database

---

### **2. Locations (Lokasi/Instalasi)**
**Tabel:** `locations`
**API:** `/api/locations` (GET, POST)

**Data yang disimpan:**
- ✅ Nama instalasi (contoh: "Poliklinik Terpadu Kemuning")
- ✅ Kategori (hospital, clinic, dll)
- ✅ Deskripsi lengkap
- ✅ Alamat lengkap
- ✅ Kota
- ✅ Koordinat GPS (latitude, longitude)
- ✅ Jam operasional (openingTime, closingTime)
- ✅ Jumlah loket (totalCounters)
- ✅ Kuota per hari (quotaPerDay)
- ✅ Rata-rata waktu layanan (avgServiceTime)
- ✅ Image URL
- ✅ Owner ID (relasi ke users)

**Penggunaan:**
- Landing page → Tampilkan 3 lokasi pertama
- Locations page → Tampilkan semua lokasi dengan filter
- Dashboard → Kelola lokasi
- Location detail → Detail satu lokasi

**Contoh Data di Database:**
```json
{
  "name": "RSUP Dr. Hasan Sadikin - Poliklinik Terpadu Kemuning",
  "description": "Pusat layanan rawat jalan RSHS Bandung...",
  "address": "Jl. Pasteur No.38, Gedung Kemuning Lt.2",
  "city": "Bandung",
  "latitude": -6.8936,
  "longitude": 107.6020,
  "openingTime": "07:00",
  "closingTime": "16:00",
  "totalCounters": 8,
  "quotaPerDay": 500,
  "avgServiceTime": 12,
  "imageUrl": "https://images.unsplash.com/photo-...",
  "category": "hospital"
}
```

---

### **3. Services (Layanan Poli)**
**Tabel:** `services`
**API:** `/api/services` (GET, POST)

**Data yang disimpan:**
- ✅ Nama layanan (contoh: "Poli Penyakit Dalam")
- ✅ Deskripsi layanan
- ✅ Durasi rata-rata (menit)
- ✅ Harga (jika ada)
- ✅ Kuota per hari
- ✅ Location ID (relasi ke locations)
- ✅ Active status

**Penggunaan:**
- Dashboard → Pilih layanan untuk antrean
- Location detail → Tampilkan layanan tersedia
- Take queue → Pilih layanan

**Contoh Data:**
```json
{
  "name": "Poli Penyakit Dalam",
  "description": "Konsultasi penyakit dalam, diabetes, hipertensi, ginjal",
  "durationAvg": 12,
  "price": 0,
  "quota": 80,
  "locationId": "uuid-location-id",
  "isActive": true
}
```

---

### **4. Counters (Loket)**
**Tabel:** `counters`
**API:** `/api/counters` (GET, POST)

**Data yang disimpan:**
- ✅ Nama loket (contoh: "Loket 1", "Loket BPJS A")
- ✅ Status (active, inactive, busy)
- ✅ Location ID (relasi ke locations)
- ✅ Operator ID (relasi ke users, optional)

**Penggunaan:**
- Dashboard → Tampilkan loket aktif
- Display TV → Tampilkan loket yang melayani
- Queue management → Assign ke loket

**Contoh Data:**
```json
{
  "name": "Loket BPJS A",
  "status": "active",
  "locationId": "uuid-location-id",
  "operatorId": "uuid-operator-id"
}
```

---

### **5. Queues (Antrean)**
**Tabel:** `queues`
**API:** `/api/queues` (GET, POST, PATCH)

**Data yang disimpan:**
- ✅ Nomor tiket (contoh: "P042")
- ✅ Status (waiting, called, checked_in, serving, completed, cancelled, missed)
- ✅ Lokasi ID
- ✅ Layanan ID
- ✅ Customer ID
- ✅ Counter ID (optional, saat sudah dipanggil)
- ✅ Estimasi waktu tunggu (menit)
- ✅ Posisi antrean
- ✅ QR Code (unique)
- ✅ QR used status
- ✅ Timestamps (calledAt, checkedInAt, servingAt, completedAt)

**Penggunaan:**
- Dashboard → Tampilkan antrean realtime
- Display TV → Tampilkan nomor yang dipanggil
- Customer → Lihat antrean saya
- Operator → Update status antrean

**Contoh Data:**
```json
{
  "ticketNumber": "P042",
  "status": "called",
  "locationId": "uuid-location",
  "serviceId": "uuid-service",
  "customerId": "uuid-customer",
  "counterId": "uuid-counter",
  "estimatedWaitMinutes": 12,
  "position": 3,
  "qrCode": "RSHS-P042-xyz",
  "isQrUsed": false,
  "calledAt": "2026-07-09T10:30:00Z"
}
```

---

### **6. Ratings (Penilaian)**
**Tabel:** `ratings`
**API:** `/api/ratings` (GET, POST)

**Data yang disimpan:**
- ✅ Queue ID (relasi ke queues)
- ✅ Customer ID
- ✅ Location ID
- ✅ Rating (1-5 bintang)
- ✅ Komentar (optional)
- ✅ Created timestamp

**Penggunaan:**
- Dashboard → Tampilkan rating layanan
- Location detail → Tampilkan ulasan
- Analytics → Hitung rata-rata rating

**Contoh Data:**
```json
{
  "queueId": "uuid-queue",
  "customerId": "uuid-customer",
  "locationId": "uuid-location",
  "rating": 5,
  "comment": "Pelayanan sangat baik, antrean tertib",
  "createdAt": "2026-07-09T11:00:00Z"
}
```

---

### **7. Analytics (Statistik)**
**Tabel:** Aggregation dari `queues`, `locations`, `services`
**API:** `/api/analytics` (GET)

**Data yang dihitung dari database:**
- ✅ Total lokasi
- ✅ Total antrean aktif
- ✅ Total antrean selesai
- ✅ Rata-rata waktu tunggu
- ✅ Tren harian (7 hari terakhir)
- ✅ Distribusi per layanan
- ✅ Distribusi per status
- ✅ Jam tersibuk
- ✅ AI insights (dari data historis)

**Penggunaan:**
- Dashboard → Tampilkan statistik
- Analytics tab → Grafik dan insight
- Landing page → Tampilkan stats (optional)

---

##  **Data Hardcoded (Tidak dari Database)**

### **1. Testimonials (Ulasan Pasien)**
**File:** `src/components/landing/landing-page.tsx`
**Status:** ⚠️ Hardcoded

**Alasan:**
- Konten marketing yang tidak sering berubah
- Tidak perlu CRUD dari user
- Bisa diupdate manual di code

**Solusi Future:**
- Buat tabel `testimonials` di database
- Tambah API `/api/testimonials`
- Admin bisa manage via dashboard

---

### **2. FAQ (Pertanyaan Umum)**
**File:** `src/components/landing/landing-page.tsx`
**Status:** ⚠️ Hardcoded

**Alasan:**
- Konten statis
- Jarang berubah
- Tidak perlu dynamic

**Solusi Future:**
- Buat tabel `faqs` di database
- Admin bisa CRUD via dashboard

---

### **3. AI Responses (Konsultasi)**
**File:** `src/app/ai/page.tsx`
**Status:** ⚠️ Mock responses

**Alasan:**
- Belum integrasi dengan AI API (Groq/OpenAI)
- Menggunakan keyword matching sederhana

**Solusi Future:**
- Integrasi dengan Groq API atau OpenAI
- Simpan chat history di database
- Train model dengan data medis RSHS

---

## 🔧 **Cara Setup Database**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Setup Environment**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
JWT_SECRET=your-secret-key-minimum-32-characters
```

### **3. Push Schema ke Supabase**
```bash
npm run db:push
```

Ini akan membuat tabel:
- `users`
- `locations`
- `services`
- `counters`
- `queues`
- `ratings`
- `notifications`

### **4. Seed Data**
```bash
# Via API
curl -X POST http://localhost:3000/api/seed

# Atau buka di browser
http://localhost:3000/api/seed
```

Ini akan mengisi:
- ✅ 4 users (pasien, operator, manager, direktur)
- ✅ 5 locations (Poli, IGD, Eksekutif, Radiologi, Farmasi)
- ✅ ~30 services (6 per location)
- ✅ ~40 counters (8 per location)
- ✅ ~50 queues (sample data)
- ✅ ~10 ratings (sample data)

### **5. Verify Data**
```bash
# Check via API
curl http://localhost:3000/api/locations
curl http://localhost:3000/api/services?locationId=[ID]
curl http://localhost:3000/api/queues
curl http://localhost:3000/api/analytics
```

---

## 📊 **Database Schema**

### **users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer', 'operator', 'admin', 'super_admin')),
  phone TEXT,
  city TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **locations**
```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT DEFAULT 'hospital',
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  opening_time TIME NOT NULL,
  closing_time TIME NOT NULL,
  total_counters INTEGER NOT NULL DEFAULT 3,
  quota_per_day INTEGER NOT NULL DEFAULT 100,
  avg_service_time INTEGER DEFAULT 10,
  image_url TEXT,
  owner_id UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **services**
```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_avg INTEGER NOT NULL DEFAULT 10,
  price INTEGER DEFAULT 0,
  quota INTEGER DEFAULT 50,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **counters**
```sql
CREATE TABLE counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  operator_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'busy')),
  current_queue_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **queues**
```sql
CREATE TABLE queues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT NOT NULL,
  location_id UUID REFERENCES locations(id),
  service_id UUID REFERENCES services(id),
  customer_id UUID REFERENCES users(id),
  counter_id UUID REFERENCES counters(id),
  status TEXT NOT NULL DEFAULT 'waiting' 
    CHECK (status IN ('waiting', 'called', 'checked_in', 'serving', 'completed', 'cancelled', 'missed')),
  estimated_wait_minutes INTEGER DEFAULT 0,
  position INTEGER DEFAULT 0,
  qr_code TEXT UNIQUE NOT NULL,
  is_qr_used BOOLEAN DEFAULT false,
  booking_date TIMESTAMP DEFAULT NOW(),
  called_at TIMESTAMP,
  checked_in_at TIMESTAMP,
  serving_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **ratings**
```sql
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id UUID REFERENCES queues(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES users(id),
  location_id UUID REFERENCES locations(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

##  **Data Flow Diagram**

```
─────────────────────────────────────────────────────────────
│                    USER INTERFACE                           │
│  Landing | Dashboard | Locations | AI | Display TV         │
─────────────────────────────────────────────────────────────┘
                           ↓
─────────────────────────────────────────────────────────────
│                    API ENDPOINTS                            │
│  /api/locations  /api/services  /api/queues  /api/analytics│
─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────
│                  DRIZZLE ORM                                │
│  Type-safe queries, migrations, schema management          │
─────────────────────────────────────────────────────────────┘
                           ↓
─────────────────────────────────────────────────────────────
│                   SUPABASE POSTGRES                         │
│  Cloud database with realtime, auth, storage               │
─────────────────────────────────────────────────────────────┘
```

---

## ✅ **Checklist: Data dari Database**

### **Landing Page**
- [x] Locations (3 pertama)
- [x] Analytics stats (optional)
- [ ] Testimonials (hardcoded)
- [ ] FAQ (hardcoded)

### **Locations Page**
- [x] Semua locations
- [x] Filter by category/search
- [x] Services per location

### **Location Detail**
- [x] Location info
- [x] Services list
- [x] Active queues
- [x] Ratings/Reviews

### **Dashboard**
- [x] User profile
- [x] Locations list
- [x] Services list
- [x] Counters list
- [x] Queues (realtime)
- [x] Analytics data
- [x] Ratings

### **AI Konsultasi**
- [x] Locations (untuk rekomendasi poli)
- [ ] Chat history (belum ada)
- [ ] AI responses (mock)

### **Display TV**
- [x] Queues (realtime polling)
- [x] Counters status
- [x] Location info

---

##  **Next Steps**

### **Priority 1: Sudah Selesai**
- ✅ Users management
- ✅ Locations CRUD
- ✅ Services CRUD
- ✅ Counters management
- ✅ Queues realtime
- ✅ Ratings system
- ✅ Analytics aggregation

### **Priority 2: Enhancement**
- [ ] Testimonials dari database
- [ ] FAQ dari database
- [ ] Chat history untuk AI
- [ ] Notifications system
- [ ] Export reports (PDF/Excel)

### **Priority 3: Advanced**
- [ ] Real-time subscriptions (Supabase Realtime)
- [ ] File upload (Supabase Storage)
- [ ] Advanced analytics
- [ ] Multi-language support

---

## 📞 **Support**

Untuk pertanyaan tentang database atau data flow:
- Email: it@rshs.go.id
- Documentation: README.md
- API Docs: Postman collection (coming soon)

---

**Last Updated:** 2026-07-09
**Version:** 1.0.0
**Status:** ✅ Production Ready
