"use client"

export default function ChatLoadingSkeleton() {
  return (
    <div className="flex justify-start">
      <div className="flex flex-row gap-3 max-w-[90%] sm:max-w-[90%]">
        <div className="h-8 w-8 rounded-full bg-green-500/30 animate-pulse flex-shrink-0" />
        <div className="w-full">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4" />
          </div>
        </div>
      </div>
    </div>
  )
}
