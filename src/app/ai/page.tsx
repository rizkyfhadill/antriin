"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RSHSMark } from "@/components/ui/rshs-logo";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/lib/useAuth";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}



export default function AIConsultationPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Halo! Saya adalah asisten AI konsultasi kesehatan RSHS Bandung. Saya bisa membantu memberikan informasi umum tentang gejala dan rekomendasi poli yang tepat.\n\n**⚠️ Penting:** Konsultasi ini bersifat informatif dan bukan pengganti diagnosa dokter. Untuk pemeriksaan medis yang akurat, silakan ambil antrean di poli terkait.\n\nSilakan ceritakan keluhan Anda, contoh:\n- \"Saya demam sudah 3 hari\"\n- \"Batuk berdahak seminggu\"\n- \"Sakit kepala sebelah\"",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Call real Gemini AI API
      const response = await fetch("/api/ai/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await response.json();

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.success
          ? data.response
          : data.error || "Maaf, terjadi kesalahan. Silakan coba lagi.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Maaf, terjadi kesalahan koneksi. Silakan coba lagi.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "Demam 3 hari tidak turun",
    "Batuk berdahak seminggu",
    "Sakit kepala sebelah",
    "Sesak napas",
    "Nyeri dada",
    "Diare dan muntah"
  ];

  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCFCFD] to-[#E6F7F5] dark:from-[#020617] dark:to-[#0B3D3A] flex flex-col">
      {/* Navbar */}
      <Navbar user={user} onLogout={async () => { await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/"; }} rshsMode />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-slate-200/60 dark:border-slate-800 bg-gradient-to-r from-[#00A69E]/5 to-[#C8D400]/5">
        <div className="absolute inset-0 bg-dot-grid opacity-30" />
        <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#00A69E]/10 border border-[#00A69E]/20 px-3 py-1 text-[11px] font-[700] text-[#00A69E] mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                AI POWERED • GRATIS UNTUK SEMUA
              </div>
              <h1 className="text-[24px] sm:text-[32px] font-[800] tracking-[-0.03em] leading-[1.1] text-[#0B3D3A] dark:text-white">
                Konsultasi Kesehatan<br/>
                <span className="text-rshs-gradient">dengan AI Assistant</span>
              </h1>
              <p className="mt-2 text-[13px] sm:text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-[600px]">
                Dapatkan informasi awal tentang gejala Anda dan rekomendasi poli yang tepat. 
                <strong> Tanpa perlu login.</strong>
              </p>
            </div>
            <div className="hidden lg:block">
              <Card className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                <div className="text-[11px] font-[700] text-slate-400 mb-2">⚠️ DISCLAIMER</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Konsultasi AI bersifat <strong>informatif</strong> dan bukan pengganti diagnosa medis profesional. Untuk pemeriksaan akurat, silakan kunjungi dokter.
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* Main Chat */}
          <Card className="flex flex-col h-[600px] sm:h-[650px] bg-white dark:bg-slate-900">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-[#00A69E] text-white rounded-br-md"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-md"
                    }`}
                  >
                    <div className="text-[12px] sm:text-[13px] leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>
                    <div className={`text-[10px] mt-1 ${
                      msg.role === "user" ? "text-white/70" : "text-slate-400"
                    }`}>
                      {msg.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length < 3 && (
              <div className="border-t border-slate-100 dark:border-slate-800 p-4">
                <div className="text-[11px] font-[700] text-slate-400 mb-2">💡 PERTANYAAN CEPAT</div>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInput(q);
                        setTimeout(handleSend, 100);
                      }}
                      className="rounded-full bg-[#00A69E]/10 hover:bg-[#00A69E]/20 border border-[#00A69E]/20 px-3 py-1.5 text-[11px] font-[600] text-[#00A69E] transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-slate-100 dark:border-slate-800 p-4 sm:p-6">
              <div className="flex gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ceritakan keluhan Anda..."
                  rows={2}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-[13px] outline-none focus:border-[#00A69E] focus:ring-4 focus:ring-[#00A69E]/10 resize-none"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  variant="primary"
                  className="rounded-xl h-auto px-6"
                >
                  <span className="text-[13px] font-[600]">Kirim</span>
                </Button>
              </div>
              <div className="mt-2 text-[10px] text-slate-400 text-center">
                Tekan Enter untuk kirim • Shift+Enter untuk baris baru
              </div>
            </div>
          </Card>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Info Card */}
            <Card className="p-5 bg-gradient-to-br from-[#00A69E] to-[#008F88] text-white">
              <div className="text-[11px] font-[700] tracking-wider opacity-75 mb-2">TENTANG AI INI</div>
              <div className="text-[13px] leading-relaxed">
                AI ini dilatih dengan data medis umum untuk memberikan informasi awal. Selalu konsultasikan dengan dokter untuk diagnosa yang akurat.
              </div>
            </Card>

            {/* Poli Recommendations */}
            <Card className="p-5">
              <div className="text-[12px] font-[700] text-slate-900 dark:text-white mb-3"> POLI RSHS</div>
              <div className="space-y-2">
                {[
                  { name: "Penyakit Dalam", desc: "Diabetes, hipertensi, ginjal" },
                  { name: "Jantung", desc: "Kardiovaskular, EKG, echo" },
                  { name: "Saraf", desc: "Stroke, epilepsi, nyeri kepala" },
                  { name: "Paru", desc: "Asma, TB, PPOK" },
                  { name: "Anak", desc: "Imunisasi, tumbuh kembang" },
                ].map((poli) => (
                  <div key={poli.name} className="rounded-lg bg-slate-50 dark:bg-slate-800 p-2.5 hover:bg-[#00A69E]/10 transition-colors cursor-pointer">
                    <div className="text-[12px] font-[600] text-[#0B3D3A] dark:text-white">{poli.name}</div>
                    <div className="text-[10px] text-slate-500">{poli.desc}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* CTA */}
            <Card className="p-5 bg-gradient-to-br from-[#C8D400] to-[#B4BF00] text-[#0B3D3A]">
              <div className="text-[12px] font-[700] mb-2">SIAP KE DOKTER?</div>
              <div className="text-[11px] leading-relaxed mb-3">
                Ambil antrean sekarang dan dapatkan pelayanan langsung dari dokter spesialis RSHS.
              </div>
              <Link href="/login">
                <Button variant="secondary" size="sm" className="w-full rounded-full h-8 text-[11px] bg-white hover:bg-slate-100">
                  Ambil Antrean →
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
