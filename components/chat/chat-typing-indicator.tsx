"use client"

import { Bot } from "lucide-react"

export default function ChatTypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex flex-row gap-2 items-center">
        <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-2">
          <div className="flex gap-1">
            <span className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse" />
            <span className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse [animation-delay:200ms]" />
            <span className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse [animation-delay:400ms]" />
          </div>
        </div>
      </div>
    </div>
  )
}
