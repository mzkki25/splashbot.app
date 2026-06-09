"use client"

import { Bot, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  onStartQuestion?: (question: string) => void
}

const SAMPLE_QUESTIONS = [
  "Bagaimana tren penjualan mobil di Jakarta tahun 2023?",
  "Bandingkan penjualan sepeda motor di Jawa Barat vs Jawa Timur",
  "Apa prediksi penjualan retail beauty untuk 2025?",
  "Analisis pertumbuhan ekonomi Indonesia Q3 2023",
]

export default function EmptyState({ onStartQuestion }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center mb-6">
        <Bot className="h-10 w-10 text-blue-600 dark:text-blue-400" />
      </div>

      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        Halo! Saya SPLASHBot
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-8">
        Asisten ekonomi cerdas Anda. Tanyakan apapun tentang data makroekonomi, penjualan, atau tren retail.
      </p>

      <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-4 uppercase tracking-wider">
        Coba tanyakan ini
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
        {SAMPLE_QUESTIONS.map((question) => (
          <Button
            key={question}
            variant="outline"
            size="sm"
            className="h-auto py-2.5 px-3 text-xs text-left font-normal justify-between hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 group"
            onClick={() => onStartQuestion?.(question)}
          >
            <span className="line-clamp-2 mr-2">{question}</span>
            <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
          </Button>
        ))}
      </div>
    </div>
  )
}
