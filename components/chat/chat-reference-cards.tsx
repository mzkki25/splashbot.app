"use client"

import { ExternalLink, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ReferenceCardsProps {
  references: string[]
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "")
  } catch {
    return url
  }
}

function extractTitle(url: string): string {
  try {
    const path = new URL(url).pathname
    const last = path.split("/").filter(Boolean).pop() || url
    return last.replace(/[-_]/g, " ").replace(/\.[^.]+$/, "").slice(0, 40)
  } catch {
    return url.slice(0, 40)
  }
}

export default function ReferenceCards({ references }: ReferenceCardsProps) {
  if (!references || references.length === 0) return null

  return (
    <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
        Referensi ({references.length})
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {references.slice(0, 6).map((ref, i) => (
          <a
            key={i}
            href={ref}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-2 rounded-md bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700 group"
          >
            <div className="flex items-start gap-2">
              <ExternalLink className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-blue-500 group-hover:text-blue-600" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate capitalize">
                  {extractTitle(ref)}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                  {extractDomain(ref)}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
