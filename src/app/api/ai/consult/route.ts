import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Pesan wajib diisi" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key tidak dikonfigurasi" }, { status: 500 });
    }

    const systemPrompt = `Anda adalah asisten AI konsultasi kesehatan untuk RSUP Dr. Hasan Sadikin Bandung. Tugas Anda:

1. Berikan informasi umum tentang gejala yang disebutkan
2. Jelaskan pertolongan pertama yang bisa dilakukan di rumah
3. Sebutkan tanda-tanda bahaya (red flags) yang memerlukan penanganan segera
4. Rekomendasikan poli yang sesuai di RSHS Bandung
5. Selalu sertakan disclaimer bahwa ini bukan diagnosa medis profesional

Format respons:
- Gunakan bahasa Indonesia yang jelas dan mudah dipahami
- Struktur dengan heading dan bullet points
- Maksimal 200 kata
- Akhiri dengan rekomendasi poli RSHS

Poli yang tersedia di RSHS:
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

PENTING: Jangan memberikan diagnosa definitif. Selalu arahkan ke dokter untuk pemeriksaan lebih lanjut.`;

    // Call Gemini API dengan retry dan fallback model
    const models = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.5-pro"];
    let lastError: any = null;

    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: message }],
                },
              ],
              systemInstruction: {
                parts: [{ text: systemPrompt }],
              },
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const aiResponse =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Maaf, saya tidak dapat memproses pertanyaan Anda saat ini.";

          return NextResponse.json({
            success: true,
            response: aiResponse,
            model: model,
          });
        }

        const errorData = await response.json().catch(() => null);
        lastError = errorData;

        // Jika quota exceeded, coba model lain
        if (errorData?.error?.status === "RESOURCE_EXHAUSTED") {
          console.warn(`Model ${model} quota exceeded, trying next model...`);
          continue;
        }

        // Error lain, return langsung
        console.error("Gemini API error:", errorData);
        return NextResponse.json(
          { error: "Gagal menghubungi AI" },
          { status: 500 }
        );
      } catch (error) {
        lastError = error;
        continue;
      }
    }

    // Semua model gagal
    console.error("All Gemini models failed:", lastError);
    return NextResponse.json(
      { error: "Layanan AI sedang sibuk. Silakan coba lagi dalam beberapa saat." },
      { status: 500 }
    );
  } catch (error) {
    console.error("AI consult error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
