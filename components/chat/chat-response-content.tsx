"use client"

import type React from "react"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import PlotlyChart from "./chat-plotly-chart"

interface ChatResponseContentProps {
  content: string
  result?: string | null
}

const isPlotlyJsonUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    return (
      urlObj.pathname.endsWith(".json") &&
      (urlObj.hostname.includes("googleapis.com") || urlObj.hostname.includes("firebasestorage.app"))
    )
  } catch {
    return false
  }
}

export default function ChatResponseContent({ content, result }: ChatResponseContentProps) {
  const shouldShowChart = result && isPlotlyJsonUrl(result)

  return (
    <div className="w-full break-words">
      {/* Main content */}
      <div className="prose prose-sm max-w-none dark:prose-invert overflow-auto">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            pre: ({ node, ...props }) => (
              <pre className="overflow-x-auto p-4 bg-gray-100 dark:bg-gray-900 rounded-md my-4" {...props} />
            ),
            code: (props) => {
              const { inline, ...rest } = props as React.ComponentProps<"code"> & { inline?: boolean }
              return inline ? (
                <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded text-sm" {...rest} />
              ) : (
                <code {...rest} />
              )
            },
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto">
                <table className="border-collapse border border-gray-300 dark:border-gray-700" {...props} />
              </div>
            ),
            a: ({ node, ...props }) => (
              <a
                className="text-blue-600 dark:text-blue-400 break-all"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* Plotly Chart */}
      {shouldShowChart && <PlotlyChart url={result}/>}

      {/* Non-chart result content */}
      {result && !shouldShowChart && (
        <div className="prose prose-sm max-w-none dark:prose-invert overflow-auto">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            pre: ({ node, ...props }) => (
              <pre className="overflow-x-auto p-4 bg-gray-100 dark:bg-gray-900 rounded-md my-4" {...props} />
            ),
            code: (props) => {
              const { inline, ...rest } = props as React.ComponentProps<"code"> & { inline?: boolean }
              return inline ? (
                <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded text-sm" {...rest} />
              ) : (
                <code {...rest} />
              )
            },
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto">
                <table className="border-collapse border border-gray-300 dark:border-gray-700" {...props} />
              </div>
            ),
            a: ({ node, ...props }) => (
              <a
                className="text-blue-600 dark:text-blue-400 break-all"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
          }}
        >
          {result}
        </ReactMarkdown>
      </div>
      )}
    </div>
  )
}
