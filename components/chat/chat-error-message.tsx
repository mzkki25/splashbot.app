"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatErrorMessageProps {
  error: string
  onRetry?: () => void
}

export default function ChatErrorMessage({ error, onRetry }: ChatErrorMessageProps) {
  return (
    <div className="flex justify-start">
      <div className="flex flex-row gap-3 max-w-[90%]">
        <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="h-4 w-4 text-white" />
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300 mb-2">{error}</p>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="text-xs h-7">
              <RefreshCw className="h-3 w-3 mr-1" />
              Coba Lagi
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
