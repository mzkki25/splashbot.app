"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/handler/theme-toggle"
import { useIsMobile } from "@/hooks/useMobile"
import { useStore } from "@/lib/store/useStore"
import { isAuthenticated, generateChatSessionId } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function Home() {
  const isMobile = useIsMobile()
  const router = useRouter()
  const authenticated = isAuthenticated()

  const handleStartChat = () => {
    if (authenticated) {
      router.push(`/chat?id=${generateChatSessionId()}`)
    } else {
      router.push("/register")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-b">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <Image
              src="/splashbot-logo.png"
              alt="SPLASHBot Logo"
              width={isMobile ? 36 : 44}
              height={isMobile ? 36 : 44}
              className="rounded-lg"
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              SPLASHBot
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {authenticated ? (
              <Button onClick={handleStartChat} size={isMobile ? "sm" : "default"}>
                Go to Chat
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size={isMobile ? "sm" : "default"}>Login</Button>
                </Link>
                <Link href="/register">
                  <Button size={isMobile ? "sm" : "default"}>Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/40 via-transparent to-transparent dark:from-blue-900/20" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2M0IzRUIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="container relative text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Powered by Gemini 2.5 Flash
            </div>

            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-slide-up">
              <span className="block text-gray-900 dark:text-white">Your AI Assistant for</span>
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Macroeconomic Intelligence
              </span>
            </h2>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-slide-up delay-100">
              SPLASHBot is an intelligent macroeconomic assistant powered by SPLASH from Databoks, Kompas Gramedia.
              Analyze sales trends, explore retail data, and get instant insights.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-200">
              <Button size="lg" className="text-lg px-8 h-12 shadow-lg shadow-blue-500/25" onClick={handleStartChat}>
                Start Chatting
              </Button>
              <Link href="#features">
                <Button variant="outline" size="lg" className="text-lg px-8 h-12">
                  Explore Features
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto animate-slide-up delay-300">
              {[
                { value: "6+", label: "Data Domains" },
                { value: "100K+", label: "Data Points" },
                { value: "2020-2025", label: "Year Range" },
                { value: "0ms", label: "Avg Response" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 container">
          <h3 className="text-3xl font-bold text-center mb-4">What SPLASHBot Can Do</h3>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">
            Powered by advanced AI to help you understand economic data and trends
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "💬",
                title: "Intelligent Chat",
                desc: "Ask questions about macroeconomics in natural language and get data-backed answers.",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: "📊",
                title: "Data Analytics",
                desc: "Analyze sales trends across 2W, 4W, and retail sectors with AI-powered insights.",
                color: "from-green-500 to-emerald-600",
              },
              {
                icon: "📄",
                title: "PDF Analysis",
                desc: "Upload economic reports and PDFs for contextual, document-aware conversations.",
                color: "from-purple-500 to-violet-600",
              },
              {
                icon: "🔍",
                title: "Web Research",
                desc: "Get up-to-date macroeconomic info from web searches integrated into responses.",
                color: "from-orange-500 to-amber-600",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative p-6 rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4`}
                >
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <div className="relative rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 p-8 sm:p-12 text-center overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
              <div className="relative">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to explore economic data?</h3>
                <p className="text-blue-100 mb-8 max-w-md mx-auto">
                  Start chatting with SPLASHBot and unlock powerful macroeconomic insights today.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 h-12"
                  onClick={handleStartChat}
                >
                  Get Started Free
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/splashbot-logo.png" alt="SPLASHBot" width={28} height={28} className="rounded" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">SPLASHBot</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Capstone ADIIP Team 2. Powered by Databoks, Kompas Gramedia.
          </p>
        </div>
      </footer>
    </div>
  )
}
