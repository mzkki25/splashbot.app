"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/handler/theme-toggle"
import { useIsMobile } from "@/hooks/useMobile"
import { isAuthenticated, generateChatSessionId } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { MessageSquare, BarChart3, FileText, Search, TrendingUp, ArrowRight, Sparkles, Database, Layers, CheckCircle } from "lucide-react"

export default function Home() {
  const isMobile = useIsMobile()
  const router = useRouter()
  const authenticated = isAuthenticated()

  const handleStartChat = () => {
    router.push(authenticated ? `/chat?id=${generateChatSessionId()}` : "/login")
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-[#070913] transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200/50 dark:border-slate-800/40 bg-white/80 dark:bg-[#070913]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-3.5 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Image src="/splashbot-logo.png" alt="SPLASHBot" width={34} height={34} className="rounded-xl shadow-md shadow-blue-500/10" />
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">SPLASHBot</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {authenticated ? (
              <Button onClick={handleStartChat} size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-all">
                <MessageSquare className="h-4 w-4" />
                Mulai Chat
              </Button>
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2 text-sm font-semibold transition-all">
                  Masuk
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-16 pb-12 sm:pt-24 sm:pb-20 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_30%,rgba(59,130,246,0.1),transparent)] dark:bg-[radial-gradient(50%_50%_at_50%_30%,rgba(59,130,246,0.06),transparent)]" />
          <div className="absolute top-1/4 left-1/4 -z-10 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute top-1/3 right-1/4 -z-10 w-96 h-96 bg-violet-400/10 dark:bg-violet-500/5 rounded-full blur-[100px] animate-pulse" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30 px-4 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-8 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
              Didukung oleh Kecerdasan Buatan Terintegrasi Gemini
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] px-2">
              Kuasai Analisis Data
              <span className="block mt-3 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
                Ekonomi & Tren Ritel Indonesia
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-500 dark:text-slate-400 max-w-xl mx-auto px-4">
              Platform cerdas berbasis kecerdasan buatan untuk mengeksplorasi wawasan bisnis, tren penjualan ritel, otomotif, serta indikator makroekonomi secara instan.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Button size="lg" onClick={handleStartChat} className="h-12 px-8 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 shadow-lg shadow-blue-500/20 dark:shadow-none hover:translate-y-[-1px] transition-all">
                Mulai Chat Sekarang
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Link href="#features">
                <Button variant="outline" size="lg" className="h-12 px-8 text-sm font-bold rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all">
                  Lihat Fitur Utama
                </Button>
              </Link>
            </div>

            {/* Premium Visual Mockup */}
            <div className="mt-16 relative rounded-2xl border border-gray-200/85 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/30 p-4 sm:p-5 backdrop-blur-md shadow-2xl shadow-slate-200/50 dark:shadow-none max-w-3xl mx-auto">
              <div className="flex items-center justify-between border-b border-gray-200/60 dark:border-slate-800/40 pb-3 mb-4 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500">Dashboard SPLASHBot</div>
                <div className="w-6" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {/* Chat Panel Mockup */}
                <div className="md:col-span-2 border border-gray-200/70 dark:border-slate-800/50 rounded-xl bg-white/90 dark:bg-[#070913]/90 p-4 shadow-sm">
                  <div className="flex items-start gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0">U</div>
                    <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 max-w-[85%]">
                      Tolong tampilkan proyeksi penjualan mobil nasional sampai tahun 2025.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-violet-600 dark:text-violet-400 text-xs font-bold shrink-0">SB</div>
                    <div className="bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100/50 dark:border-violet-900/20 rounded-2xl px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 w-full">
                      <div className="font-semibold text-violet-600 dark:text-violet-400 mb-1">Analisis Proyeksi Mobil (4 Wheels):</div>
                      Berdasarkan tren historis, berikut adalah representasi visual penjualan mobil:
                      <div className="mt-2.5 p-2 bg-slate-50 dark:bg-[#070913]/60 rounded-lg border border-gray-200/60 dark:border-slate-800/40">
                        {/* Mock Chart representation */}
                        <div className="h-24 flex items-end justify-between gap-1.5 px-3 pt-4">
                          <div className="w-full bg-blue-500/75 rounded-t-sm" style={{ height: "45%" }} />
                          <div className="w-full bg-blue-500/75 rounded-t-sm" style={{ height: "55%" }} />
                          <div className="w-full bg-blue-500/75 rounded-t-sm" style={{ height: "65%" }} />
                          <div className="w-full bg-indigo-500/85 rounded-t-sm" style={{ height: "80%" }} />
                          <div className="w-full bg-violet-600 rounded-t-sm shadow-md shadow-violet-500/20 animate-pulse" style={{ height: "92%" }} />
                        </div>
                        <div className="flex justify-between text-[8px] text-slate-400 dark:text-slate-500 mt-2 px-1">
                          <span>2022</span>
                          <span>2023</span>
                          <span>2024 (Prediksi)</span>
                          <span>2025 (Prediksi)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Stats Panel Mockup */}
                <div className="border border-gray-200/70 dark:border-slate-800/50 rounded-xl bg-white/90 dark:bg-[#070913]/90 p-4 flex flex-col justify-between shadow-sm">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Domain Analisis</h4>
                    <div className="space-y-2">
                      {[
                        { name: "Motor & Mobil", color: "text-blue-600 dark:text-blue-400" },
                        { name: "Ritel Makanan & Kosmetik", color: "text-emerald-600 dark:text-emerald-400" },
                        { name: "Ritel Obat & Umum", color: "text-violet-600 dark:text-violet-400" },
                        { name: "Ekonomi Makro", color: "text-amber-600 dark:text-amber-400" },
                      ].map((item) => (
                        <div key={item.name} className="flex justify-between items-center text-xs p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                          <span className={`${item.color} font-bold text-[10px]`}>• Terintegrasi</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">100K+</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Titik Data Sektor Ritel</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features / Capabilities */}
        <section id="features" className="py-20 border-t border-slate-200/60 dark:border-slate-800/30 bg-white/30 dark:bg-slate-900/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Teknologi Analisis</p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Fitur Unggulan SPLASHBot</h2>
              <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Dioptimalkan untuk memproses data rumit dan menerjemahkannya ke dalam grafik interaktif serta wawasan bisnis taktis.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <MessageSquare className="h-5 w-5" />,
                  title: "Smart Chat Data",
                  desc: "Diskusikan dataset secara langsung dengan bahasa alami. Sistem otomatis memproses data menggunakan Pandas.",
                  color: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
                  ring: "ring-blue-500/10",
                },
                {
                  icon: <TrendingUp className="h-5 w-5" />,
                  title: "Visualisasi Plotly",
                  desc: "Merender grafik interaktif dan komparatif secara otomatis berdasarkan hasil kueri data ritel Anda.",
                  color: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
                  ring: "ring-emerald-500/10",
                },
                {
                  icon: <FileText className="h-5 w-5" />,
                  title: "Analisis File Multimodal",
                  desc: "Unggah dokumen PDF atau gambar laporan perekonomian Anda untuk dianalisis oleh AI.",
                  color: "bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400",
                  ring: "ring-violet-500/10",
                },
                {
                  icon: <Search className="h-5 w-5" />,
                  title: "Riset Ekonomi Makro",
                  desc: "Integrasi pencarian web DuckDuckGo untuk memberikan info makroekonomi riil yang mutakhir.",
                  color: "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400",
                  ring: "ring-amber-500/10",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="group relative rounded-2xl border border-slate-200/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/20 p-6 hover:shadow-xl dark:hover:shadow-none hover:border-blue-500/30 dark:hover:border-blue-500/20 transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-4 ring-1 ring-inset ${f.ring}`}>
                    {f.icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Scope / Dataset Domains Showcase */}
        <section className="py-20 border-t border-slate-200/60 dark:border-slate-800/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Cakupan Sektor Analisis</h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Kami mencakup berbagai sektor bisnis utama di pasar Indonesia yang dapat Anda kueri secara instan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[
                { name: "2 Wheels (Motor)", desc: "Proyeksi penjualan, tren regional, dan kinerja motor roda dua." },
                { name: "4 Wheels (Mobil)", desc: "Analisis pasar roda empat, segmentasi penjualan, dan prediksi pasar." },
                { name: "Ritel Makanan (FnB)", desc: "Tren pengeluaran makanan & minuman serta dinamika pasar konsumen." },
                { name: "Ritel Kecantikan", desc: "Data pengeluaran produk perawatan tubuh dan tren estetika retail." },
                { name: "Ritel Obat-obatan", desc: "Analisis transaksi drugstore, suplemen, serta obat-obatan." },
                { name: "Ritel Umum & Makro", desc: "Parameter ekonomi makro nasional dan tren penjualan ritel umum." },
              ].map((domain) => (
                <div key={domain.name} className="p-5 border border-slate-200/60 dark:border-slate-800/50 rounded-xl bg-white/50 dark:bg-slate-900/10">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{domain.name}</span>
                  </div>
                  <p className="text-[11px] leading-normal text-slate-500 dark:text-slate-400">{domain.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 border-t border-slate-200/60 dark:border-slate-800/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <div className="rounded-3xl bg-gradient-to-b from-blue-50/50 to-indigo-50/20 dark:from-slate-900/30 dark:to-slate-950/20 border border-blue-100/50 dark:border-slate-800/60 p-8 sm:p-12 backdrop-blur-sm">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Siap Menemukan Wawasan Data Bisnis?</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                Silakan masuk menggunakan kredensial Anda dan mulai diskusikan data bisnis Anda secara mudah.
              </p>
              <Button size="lg" onClick={handleStartChat} className="h-12 px-8 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 shadow-lg shadow-blue-500/20 dark:shadow-none hover:translate-y-[-1px] transition-all">
                Mulai Analisis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800/30 py-8 bg-white/50 dark:bg-[#070913]/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
            <Image src="/splashbot-logo.png" alt="SPLASHBot" width={22} height={22} className="rounded-lg" />
            SPLASHBot
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} Databoks, Kompas Gramedia. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  )
}
