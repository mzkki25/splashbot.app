"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/handler/theme-toggle"
import { useIsMobile } from "@/hooks/useMobile"
import { isAuthenticated, generateChatSessionId } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { MessageSquare, BarChart3, FileText, Search, TrendingUp, ArrowRight, Sparkles } from "lucide-react"

export default function Home() {
  const isMobile = useIsMobile()
  const router = useRouter()
  const authenticated = isAuthenticated()

  const handleStartChat = () => {
    router.push(authenticated ? `/chat?id=${generateChatSessionId()}` : "/register")
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-950/80">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Image src="/splashbot-logo.png" alt="SPLASHBot" width={32} height={32} className="rounded-lg" />
            <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">SPLASHBot</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {authenticated ? (
              <Button onClick={handleStartChat} size="sm" className="gap-1.5">
                <MessageSquare className="h-4 w-4" />
                Chat
              </Button>
            ) : (
              <>
                <Link href="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
                <Link href="/register"><Button size="sm">Get started</Button></Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_30%,rgba(59,130,246,0.08),transparent)] dark:bg-[radial-gradient(45%_40%_at_50%_30%,rgba(59,130,246,0.12),transparent)]" />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 px-4 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 mb-8">
              <Sparkles className="h-4 w-4" />
              Powered by Gemini
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Understand the economy
              <span className="block mt-3 bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
                with AI-powered insights
              </span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              SPLASHBot analyzes sales trends, retail data, and macroeconomic indicators across Indonesia.
              Ask anything, get data-backed answers instantly.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" onClick={handleStartChat} className="h-12 px-8 text-base gap-2 shadow-none">
                Start chatting
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Link href="#features">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  See what it can do
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 border-t border-gray-100 dark:border-gray-800 pt-12">
              {[
                { value: "7", label: "Data domains" },
                { value: "100K+", label: "Data points" },
                { value: "2020–2025", label: "Year range" },
                { value: "Real-time", label: "AI analysis" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tabular-nums">{s.value}</div>
                  <div className="mt-1 text-sm text-gray-400 dark:text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 sm:py-24 border-t border-gray-50 dark:border-gray-900">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Capabilities</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Built for economic analysis</h2>
              <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                Everything you need to explore and understand economic data
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <MessageSquare className="h-5 w-5" />, title: "Smart Chat", desc: "Natural language conversations about macroeconomics with data-backed responses.", color: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400", ring: "ring-blue-500/10" },
                { icon: <TrendingUp className="h-5 w-5" />, title: "Trend Analysis", desc: "Analyze sales trends across automotive and retail sectors with AI-powered insights.", color: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-500/10" },
                { icon: <FileText className="h-5 w-5" />, title: "Document Upload", desc: "Upload economic reports and PDFs for contextual conversations with your data.", color: "bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400", ring: "ring-violet-500/10" },
                { icon: <Search className="h-5 w-5" />, title: "Web Research", desc: "Real-time economic information from web searches integrated into every response.", color: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400", ring: "ring-amber-500/10" },
              ].map((f) => (
                <div
                  key={f.title}
                  className="group relative rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-4 ring-1 ring-inset ${f.ring}`}>
                    {f.icon}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-10 sm:p-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">Ready to explore?</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                Start asking questions and discover insights from economic data.
              </p>
              <Button size="lg" onClick={handleStartChat} className="h-12 px-8 text-base gap-2">
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
            <Image src="/splashbot-logo.png" alt="SPLASHBot" width={20} height={20} className="rounded" />
            SPLASHBot
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Databoks, Kompas Gramedia
          </p>
        </div>
      </footer>
    </div>
  )
}
