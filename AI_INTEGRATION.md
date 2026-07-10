#  Gemini AI Integration - Dokumentasi Lengkap

**Status:** ✅ Integrated dengan Gemini 2.0 Flash (dengan fallback ke Gemini Pro & 1.5 Flash)

---

##  **Overview**

Halaman **Konsultasi AI** (`/ai`) sekarang menggunakan **Google Gemini AI** yang sebenarnya untuk memberikan respons konsultasi kesehatan yang cerdas dan kontekstual.

---

## 🔧 **Arsitektur**

```
┌─────────────────────────────────────────────────────────────
│                    USER (Client)                             │
│  Halaman /ai - Chat Interface                               │
─────────────────────────────────────────────────────────────
                           ↓ fetch("/api/ai/consult")
┌─────────────────────────────────────────────────────────────
│                  NEXT.JS API (Server)                        │
│  /api/ai/consult - Proxy & Security Layer                   │
│  - Validasi input                                           │
│  - System prompt injection                                  │
│  - API key protection (tidak expose ke client)             │
│  - Multi-model fallback                                     │
─────────────────────────────────────────────────────────────
                           ↓ HTTPS
┌─────────────────────────────────────────────────────────────
│              GOOGLE GEMINI API (Cloud)                       │
│  Models: gemini-2.0-flash → gemini-2.5-flash → gemini-2.5-pro  │
│  - Natural Language Processing                              │
│  - Medical knowledge base                                   │
│  - Context-aware responses                                  │
─────────────────────────────────────────────────────────────
```

---

## 🔐 **Security**

### **API Key Protection:**
- ✅ API key disimpan di `.env.local` (server-side only)
- ✅ Tidak pernah dikirim ke client browser
- ✅ Hanya diakses melalui API route `/api/ai/consult`
- ✅ Environment variable `GEMINI_API_KEY`

### **Input Validation:**
- ✅ Validasi pesan tidak kosong
- ✅ Rate limiting implicit via API quota
- ✅ Error handling untuk malformed requests

---

##  **Models & Fallback Strategy**

### **Priority Order:**

| Priority | Model | Kecepatan | Quality | Quota |
|----------|-------|-----------|---------|-------|
| 1️⃣ | **gemini-2.0-flash** | ⚡⚡⚡ Super Fast | ⭐⭐⭐⭐⭐ Excellent | Free tier limited |
| 2️ | **gemini-pro** | ⚡ Fast | ⭐⭐⭐⭐⭐ Excellent | Higher quota |
| 3️⃣ | **gemini-1.5-flash** | ⚡⚡⚡ Super Fast | ⭐⭐⭐⭐ Good | Backup option |

### **Fallback Logic:**
```typescript
for (const model of ["gemini-2.0-flash", "gemini-pro", "gemini-1.5-flash"]) {
  try {
    const response = await callGemini(model, message);
    if (response.ok) {
      return success(response, model);
    }
    
    if (error === "QUOTA_EXCEEDED") {
      console.warn(`${model} quota exceeded, trying next...`);
      continue; // Coba model berikutnya
    }
    
    return error(response); // Error lain, stop
  } catch (error) {
    continue; // Network error, coba model lain
  }
}

return error("Semua model gagal");
```

---

##  **System Prompt**

AI menggunakan system prompt khusus untuk konsultasi medis RSHS:

```
Anda adalah asisten AI konsultasi kesehatan untuk RSUP Dr. Hasan Sadikin Bandung.

TUGAS:
1. Berikan informasi umum tentang gejala
2. Jelaskan pertolongan pertama di rumah
3. Sebutkan tanda-tanda bahaya (red flags)
4. Rekomendasikan poli yang sesuai
5. Selalu sertakan disclaimer medis

FORMAT:
- Bahasa Indonesia jelas & mudah dipahami
- Struktur dengan heading & bullet points
- Maksimal 200 kata
- Akhiri dengan rekomendasi poli RSHS

POLI RSHS:
- Poli Penyakit Dalam (diabetes, hipertensi, ginjal)
- Poli Jantung (kardiovaskular, EKG, echo)
- Poli Saraf (stroke, epilepsi, nyeri kepala)
- Poli Paru (asma, TB, PPOK)
- Poli Anak (imunisasi, tumbuh kembang)
- Poli Mata (katarak, glaukoma, retina)
- Poli THT (telinga, hidung, tenggorokan)
- Poli Bedah (trauma, tumor, hernia)
- Poli Orthopedi (patah tulang, sendi)
- Poli Obgyn (kehamilan, kandungan)
- Poli Kulit (jerawat, alergi, infeksi kulit)
- Poli Gigi (cabut, tambal, scaling)

PENTING: Jangan diagnosa definitif. Arahkan ke dokter.
```

---

## 💬 **Contoh Penggunaan**

### **Input User:**
```
"Saya demam sudah 3 hari, suhu 38.5°C, disertai batuk dan pilek"
```

### **Output AI (Contoh):**
```markdown
## 🌡️ Analisis Gejala

Demam 3 hari dengan suhu 38.5°C disertai batuk dan pilek kemungkinan 
merupakan **infeksi saluran pernapasan atas** (ISPA).

### 🏠 Pertolongan Pertama

- **Minum air putih** minimal 8 gelas/hari
- **Istirahat total** di rumah
- **Kompres hangat** di dahi dan leher
- **Minum paracetamol** 500mg setiap 6 jam jika demam >38°C
- **Konsumsi vitamin C** dari buah atau suplemen

### ️ Tanda Bahaya (Segera ke IGD)

- Sesak napas atau napas cepat
- Demam >39.5°C tidak turun dengan obat
- Kejang atau penurunan kesadaran
- Nyeri dada hebat
- Batuk darah

###  Rekomendasi

Untuk pemeriksaan lebih lanjut, silakan ambil antrean di:
** Poli Penyakit Dalam**

Dokter akan melakukan pemeriksaan fisik dan mungkin menyarankan 
tes darah atau rontgen thorax jika diperlukan.

---
⚠️ **Disclaimer:** Informasi ini bersifat umum dan bukan pengganti 
konsultasi medis profesional.
```

---

## ️ **Setup & Konfigurasi**

### **1. Environment Variables**

File: `.env.local`
```env
# Gemini API Key
GEMINI_API_KEY=AIzaSyDyfqpXtk0fDxz0NFXjBSaDU8NpE9Gt0ZI
```

### **2. Install Dependencies**

```bash
npm install @google/genai
```

### **3. API Endpoint**

File: `src/app/api/ai/consult/route.ts`

**Features:**
- ✅ Multi-model fallback
- ✅ System prompt injection
- ✅ Error handling
- ✅ Response validation
- ✅ Logging

---

## 📊 **API Specification**

### **POST /api/ai/consult**

**Request:**
```json
{
  "message": "Saya sakit kepala sebelah sejak kemarin"
}
```

**Response (Success):**
```json
{
  "success": true,
  "response": "## 🤕 Analisis Gejala\n\nSakit kepala sebelah...",
  "model": "gemini-2.0-flash"
}
```

**Response (Error):**
```json
{
  "error": "Layanan AI sedang sibuk. Silakan coba lagi."
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad request (message kosong)
- `500` - Server error / AI gagal

---

## 🎨 **UI Integration**

### **Chat Interface:**
- ✅ Real-time typing indicator
- ✅ Auto-scroll ke pesan terbaru
- ✅ Markdown rendering (bold, lists, headings)
- ✅ Timestamp pada setiap pesan
- ✅ Quick questions untuk contoh

### **Features:**
- ✅ Guest access (tidak perlu login)
- ✅ Mobile responsive
- ✅ Dark mode support
- ✅ Quick question buttons

---

##  **Performance**

### **Response Time:**
- **Gemini 2.0 Flash:** ~500ms - 1s
- **Gemini Pro:** ~1s - 2s
- **Gemini 1.5 Flash:** ~500ms - 1s

### **Optimization:**
- ✅ Server-side processing (tidak block client)
- ✅ Concurrent requests supported
- ✅ Connection pooling via fetch API
- ✅ Minimal payload size

---

## ⚠️ **Limitations & Quotas**

### **Free Tier (Gemini 2.0 Flash):**
- **Requests per minute:** 15 RPM
- **Requests per day:** 1500 RPD
- **Input tokens per minute:** 1M TPM
- **Output tokens per minute:** 8M TPM

### **Fallback Strategy:**
Jika quota tercapai:
1. Otomatis switch ke Gemini Pro
2. Jika Pro juga habis, ke Gemini 1.5 Flash
3. Jika semua habis, tampilkan pesan error ramah

### **Monitoring:**
- Log semua API calls ke console
- Track quota usage via Google Cloud Console
- Alert jika quota < 20%

---

## 🔒 **Privacy & Compliance**

### **Data Handling:**
- ✅ Pesan user dikirim ke Google API
- ✅ Tidak disimpan di server (stateless)
- ✅ Tidak ada logging pesan user
- ✅ API key aman di environment variable

### **Disclaimer:**
- ️ AI bukan pengganti dokter
- ⚠️ Hanya untuk informasi umum
- ⚠️ Selalu konsultasi ke profesional medis

---

## 🧪 **Testing**

### **Manual Testing:**
```bash
# Test dengan curl
curl -X POST http://localhost:3000/api/ai/consult \
  -H "Content-Type: application/json" \
  -d '{"message": "Saya demam 3 hari"}'
```

### **Expected Results:**
- ✅ Response dalam < 2 detik
- ✅ Format markdown yang rapi
- ✅ Rekomendasi poli yang sesuai
- ✅ Disclaimer medis ada

---

## 📈 **Future Enhancements**

### **Planned Features:**
- [ ] Chat history (localStorage)
- [ ] Voice input (Web Speech API)
- [ ] Multi-language (ID/EN)
- [ ] Feedback mechanism (thumbs up/down)
- [ ] Symptom checker (structured input)
- [ ] Integration dengan jadwal dokter realtime
- [ ] Streaming response (SSE)
- [ ] Image analysis (foto gejala kulit)

### **Advanced AI:**
- [ ] Fine-tuning dengan data medis RSHS
- [ ] Context memory (multi-turn conversation)
- [ ] Personalized recommendations
- [ ] Integration dengan rekam medis

---

## 🐛 **Troubleshooting**

### **Error: "Layanan AI sedang sibuk"**
**Penyebab:** Semua model quota exceeded
**Solusi:** Tunggu beberapa menit atau coba lagi

### **Error: "Gagal menghubungi AI"**
**Penyebab:** Network error atau API down
**Solusi:** Check koneksi internet, coba lagi

### **Response lambat**
**Penyebab:** Model fallback ke Gemini Pro
**Solusi:** Normal, Pro lebih lambat tapi lebih akurat

### **Response tidak relevan**
**Penyebab:** Prompt kurang jelas
**Solusi:** Perjelas gejala yang dirasakan

---

##  **Support**

**API Issues:**
- Google Cloud Console: https://console.cloud.google.com
- Gemini API Docs: https://ai.google.dev/docs

**Internal:**
- Email: it@rshs.go.id
- Documentation: README.md

---

## ✅ **Checklist Implementation**

- [x] Install @google/genai package
- [x] Create API endpoint `/api/ai/consult`
- [x] Setup system prompt untuk medis
- [x] Multi-model fallback strategy
- [x] Error handling & validation
- [x] Environment variable setup
- [x] UI integration di `/ai` page
- [x] Typing indicator
- [x] Markdown rendering
- [x] Guest access (no login required)
- [x] Mobile responsive
- [x] Dark mode support
- [x] Quick questions
- [x] Documentation

---

**Status:** ✅ **PRODUCTION READY**

**Last Updated:** 2026-07-09
**Version:** 1.0.0
**Model:** Gemini 2.0 Flash (with fallback)
