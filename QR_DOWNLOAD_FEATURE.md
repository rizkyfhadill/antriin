# 🎫 QR Download Feature - Dokumentasi Lengkap

**Status:** ✅ Implemented dengan download PDF & JPG

---

##  **Overview**

Pasien sekarang bisa **download QR Code antrean** dalam 2 format:
- 📄 **PDF** - Untuk print dan simpan dokumen resmi
- 🖼️ **JPG** - Untuk share via WhatsApp, email, atau simpan di galeri

---

##  **User Flow**

### **1. Pasien Ambil Antrean**
```
Dashboard → Tab "Ambil Antrean" → Pilih Poli → Pilih Layanan → Klik "Ambil Antrean"
```

### **2. Modal QR Muncul**
Setelah berhasil ambil antrean, modal menampilkan:
- 🎫 Nomor Tiket (contoh: P042)
- QR Code besar dan jelas
- Informasi poli tujuan
- Estimasi waktu tunggu
- Nama RSUP Dr. Hasan Sadikin

### **3. Download Options**
2 tombol download tersedia:
- **Download JPG** - Simpan sebagai gambar
- **Download PDF** - Simpan sebagai dokumen PDF

### **4. Gunakan di Loket**
- Tunjukkan QR di HP (dari galeri)
- Atau print PDF dan bawa fisik
- Operator scan QR → Auto check-in ✅

---

## ️ **Technical Implementation**

### **Packages Used:**
```json
{
  "qrcode": "^1.5.3",           // Generate QR code
  "jspdf": "^2.5.1",            // Generate PDF
  "html2canvas": "^1.4.1"       // Convert HTML to image
}
```

### **Component Structure:**
```
src/components/ui/qr-download.tsx
├── generateQRImage()     // Generate QR as data URL
├── downloadAsJPG()       // Download as JPG image
└── downloadAsPDF()       // Download as PDF document
```

### **API Integration:**
```typescript
// QR Code generation
const qrImage = await QRCode.toDataURL(qrCode, {
  width: 400,
  margin: 2,
  color: {
    dark: "#000000",
    light: "#FFFFFF",
  },
});
```

---

## 📄 **PDF Download Features**

### **Layout:**
```
┌─────────────────────────────────────
│  [GREEN HEADER]                     │
│  ANTREAN RSHS BANDUNG              │
─────────────────────────────────────
│                                     │
│      [QR CODE IMAGE]               │
│         120x120mm                   │
│                                     │
│  Tiket: P042                        │
│  RSUP Dr. Hasan Sadikin            │
│  Poliklinik Terpadu                 │
│                                     │
│  Estimasi Tunggu: 12 menit         │
│                                     │
├─────────────────────────────────────
│  Tunjukkan QR ini di loket         │
│  pendaftaran RSHS Bandung          │
└─────────────────────────────────────
```

### **Features:**
- ✅ A4 portrait format
- ✅ High resolution (scale 2x)
- ✅ Branded header (teal color)
- ✅ Clear QR code
- ✅ Ticket information
- ✅ Professional layout

---

## 🖼️ **JPG Download Features**

### **Canvas Layout:**
```javascript
// Canvas dimensions: 800x1000px
- White background
- Green header (#00A69E)
- Title: "ANTREAN RSHS BANDUNG"
- QR Code: 400x400px
- Ticket number: 48px bold
- Location & service info
- Estimated wait time (teal color)
- Footer instruction
```

### **Features:**
- ✅ High quality (95% JPEG quality)
- ✅ Optimized for mobile viewing
- ✅ Share-ready format
- ✅ Compact file size

---

## 💡 **Use Cases**

### **Scenario 1: Pasien Screenshot**
```
1. Ambil antrean di rumah
2. QR muncul di modal
3. Screenshot manual
4. Simpan di galeri
5. Tunjukkan di loket
```

### **Scenario 2: Pasien Download JPG**
```
1. Ambil antrean
2. Klik "Download JPG"
3. File tersimpan: antrean-P042.jpg
4. Bisa share via WhatsApp
5. Atau simpan di galeri
```

### **Scenario 3: Pasien Download PDF**
```
1. Ambil antrean
2. Klik "Download PDF"
3. File tersimpan: antrean-P042.pdf
4. Print untuk backup fisik
5. Bawa ke RSHS
```

### **Scenario 4: Share ke Keluarga**
```
1. Download JPG
2. Share via WhatsApp ke keluarga
3. "Ini antrean saya ya, nanti jemput jam 11"
4. Keluarga bisa lihat estimasi waktu
```

---

##  **UI/UX Design**

### **Modal Layout:**
```
┌─────────────────────────────────────
│  × Close                            │
─────────────────────────────────────
│                                     │
│         [QR Icon]                   │
│                                     │
│      Tiket P042                     │
│                                     │
│  Tunjukkan QR Code ini di loket    │
│  pendaftaran RSHS                  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  [GRADIENT BACKGROUND]      │   │
│  │                             │   │
│  │     ┌─────────────┐         │   │
│  │     │   QR CODE   │         │   │
│  │     │   DISPLAY   │         │   │
│  │     └─────────────┘         │   │
│  │                             │   │
│  │  P042                       │   │
│  │  RSUP Dr. Hasan Sadikin    │   │
│  │  Estimasi: 12 menit        │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌───────────┐  ┌───────────┐     │
│  │ Download  │  │ Download  │     │
│  │   JPG     │  │   PDF     │     │
│  └───────────┘  └───────────┘     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │          Tutup              │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────
```

### **Colors:**
- **Primary:** `#00A69E` (RSHS Teal)
- **Accent:** `#C8D400` (Lime)
- **Background:** Gradient teal-lime
- **Text:** `#0B3D3A` (Dark teal)

---

##  **File Specifications**

### **JPG:**
- **Resolution:** 800x1000px
- **Quality:** 95%
- **Size:** ~150-200 KB
- **Format:** JPEG
- **Color Space:** RGB

### **PDF:**
- **Format:** A4 Portrait
- **Size:** 210 x 297 mm
- **Resolution:** 300 DPI (scale 2x)
- **File Size:** ~300-500 KB
- **Compression:** Standard

---

## 🔧 **Code Example**

### **Usage in Dashboard:**
```typescript
<QRDownload
  ticketNumber={showQR.ticketNumber}
  qrCode={showQR.qrCode}
  locationName={selectedLocation?.name}
  serviceName="Poliklinik Terpadu"
  estimatedWait={showQR.estimatedWaitMinutes}
/>
```

### **Props:**
```typescript
interface QRDownloadProps {
  ticketNumber: string;      // "P042"
  qrCode: string;            // "RSHS-P042-xyz123"
  locationName?: string;     // "RSUP Dr. Hasan Sadikin"
  serviceName?: string;      // "Poliklinik Terpadu"
  estimatedWait?: number;    // 12 (menit)
}
```

---

## ✅ **Features Checklist**

- [x] QR Code generation
- [x] Download as JPG
- [x] Download as PDF
- [x] Professional layout
- [x] RSHS branding
- [x] Ticket information
- [x] Estimated wait time
- [x] Mobile responsive
- [x] Dark mode support
- [x] Error handling
- [x] Loading states

---

## 🧪 **Testing**

### **Manual Testing:**
1. Login sebagai pasien
2. Ambil antrean Poli Jantung
3. Modal QR muncul
4. Klik "Download JPG"
5. Verifikasi file terdownload
6. Buka file, cek kualitas
7. Klik "Download PDF"
8. Verifikasi PDF terdownload
9. Print PDF, cek layout

### **Expected Results:**
- ✅ JPG: Clear QR, readable text
- ✅ PDF: Professional layout, printable
- ✅ File size: < 1MB
- ✅ Compatibility: All devices

---

## 📱 **Mobile Optimization**

### **Responsive Design:**
- Modal adjusts to screen size
- Buttons stack vertically on small screens
- QR code scales appropriately
- Text remains readable

### **Touch Targets:**
- Download buttons: min 44x44px
- Close button: full width
- Easy one-handed operation

---

## 🔐 **Security**

### **QR Code:**
- ✅ Unique per ticket
- ✅ Cannot be duplicated
- ✅ Validated server-side
- ✅ One-time use flag

### **Data:**
- ✅ No sensitive info in QR
- ✅ Only ticket number & ID
- ✅ Encrypted in transit

---

## 🚀 **Future Enhancements**

### **Planned Features:**
- [ ] Share directly to WhatsApp
- [ ] Add to Apple Wallet / Google Pay
- [ ] Email QR code automatically
- [ ] SMS with QR link
- [ ] Expiration time for QR
- [ ] Animated QR (dynamic)
- [ ] Multi-language support
- [ ] Custom QR design/themes

### **Advanced:**
- [ ] NFC tag integration
- [ ] Biometric verification
- [ ] Real-time QR updates
- [ ] Group booking QR
- [ ] Family member QR

---

## 🐛 **Troubleshooting**

### **Issue: Download tidak bekerja**
**Solusi:** 
- Check browser permissions
- Disable popup blocker
- Try different browser

### **Issue: QR tidak ter-scan**
**Solusi:**
- Pastikan QR tidak blur
- Cek kontras warna
- Print dengan kualitas tinggi

### **Issue: File terlalu besar**
**Solusi:**
- JPG sudah optimized (95% quality)
- PDF menggunakan compressi standar
- Jika masih besar, screenshot manual

---

##  **Support**

**Technical Issues:**
- Email: it@rshs.go.id
- Documentation: README.md

**User Support:**
- Helpdesk RSHS: (022) 2032214
- Loket Informasi

---

**Status:** ✅ **PRODUCTION READY**

**Last Updated:** 2026-07-09
**Version:** 1.0.0
**Download Formats:** PDF + JPG
