"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Loader2, AlertCircle, RefreshCw } from "lucide-react"

interface PlotlyChartProps {
  url: string
}

export default function PlotlyChart({ url }: PlotlyChartProps) {
  const plotRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [plotlyData, setPlotlyData] = useState<any>(null)
  const [plotlyLib, setPlotlyLib] = useState<any>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [containerReady, setContainerReady] = useState(false)
  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!plotRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target === plotRef.current) {
            console.log("Container is visible and ready")
            setContainerReady(true)
          }
        })
      },
      { threshold: 0.1 },
    )

    observer.observe(plotRef.current)

    const fallbackTimer = setTimeout(() => {
      if (mountedRef.current && plotRef.current) {
        console.log("Container ready via fallback timer")
        setContainerReady(true)
      }
    }, 500)

    return () => {
      observer.disconnect()
      clearTimeout(fallbackTimer)
    }
  }, [])

  const loadPlotlyData = async () => {
    try {
      console.log("Loading Plotly` library and data...")

      const Plotly = await import("plotly.js-dist-min")
      if (!mountedRef.current) return
      setPlotlyLib(Plotly)

      const proxyUrl = `/api/plotly-proxy?url=${encodeURIComponent(url)}`
      const response = await fetch(proxyUrl)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const plotlyJson = await response.json()
      if (!mountedRef.current) return

      console.log("Plotly data loaded successfully")
      setPlotlyData(plotlyJson)
    } catch (err) {
      console.error("Error loading Plotly data:", err)
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Failed to load chart data")
        setIsLoading(false)
      }
    }
  }

  const createChart = useCallback(async () => {
    if (!plotlyData || !plotlyLib || !containerReady || !plotRef.current || !mountedRef.current) {
      return
    }

    try {
      console.log("Creating chart...")
      setIsLoading(true)
      setError(null)

      const container = plotRef.current

      if (container.offsetWidth === 0 || container.offsetHeight === 0) {
        console.log("Container has no dimensions, waiting...")
        setTimeout(() => {
          if (mountedRef.current) createChart()
        }, 100)
        return
      }
      container.innerHTML = ""

      if (!plotlyData.data || !Array.isArray(plotlyData.data)) {
        throw new Error("Invalid Plotly data structure")
      }

      await plotlyLib.newPlot(
        container,
        plotlyData.data,
        {
          ...plotlyData.layout,
          autosize: true,
          responsive: true,
        },
        {
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: [
            "pan2d",
            "lasso2d",
            "select2d",
            "autoScale2d",
            "hoverClosestCartesian",
            "hoverCompareCartesian",
          ],
          displaylogo: false,
        },
      )

      console.log("Chart created successfully")

      if (mountedRef.current) {
        setIsLoading(false)
        setRetryCount(0)
      }

      const resizeObserver = new ResizeObserver(() => {
        if (container && plotlyLib && mountedRef.current) {
          plotlyLib.Plots.resize(container)
        }
      })

      resizeObserver.observe(container)

      return () => {
        resizeObserver.disconnect()
      }
    } catch (err) {
      console.error("Error creating chart:", err)
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Failed to create chart")
        setIsLoading(false)
      }
    }
  }, [plotlyData, plotlyLib, containerReady])

  useEffect(() => {
    if (url) {
      loadPlotlyData()
    }
  }, [url])

  useEffect(() => {
    if (plotlyData && plotlyLib && containerReady) {
      createChart()
    }
  }, [plotlyData, plotlyLib, containerReady, createChart])

  const handleDownload = async () => {
    if (plotRef.current) {
      await plotlyLib.downloadImage(plotRef.current, {
        format: "png",
        filename: `chart-${Date.now()}`,
        width: 800,
        height: 600,
        scale: 1,
      })
    }
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    setError(null)
    setPlotlyData(null)
    setPlotlyLib(null)
    setContainerReady(false)
    setIsLoading(true)

    setTimeout(() => {
      if (mountedRef.current) {
        loadPlotlyData()
      }
    }, 100)
  }

  useEffect(() => {
    return () => {
      if (plotRef.current && plotlyLib) {
        try {
          plotlyLib.purge(plotRef.current)
        } catch (e) {
          console.log("Error during cleanup:", e)
        }
      }
    }
  }, [plotlyLib])

  if (error) {
    return (
      <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Chart Loading Error</span>
        </div>
        <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
        {retryCount > 0 && <p className="text-xs text-red-500 mb-3">Retry attempts: {retryCount}</p>}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(url, "_blank")}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Open Original
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 my-4 border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {plotlyData && !isLoading && (
            <Button variant="outline" size="sm" onClick={handleDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Image
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-md z-10">
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading chart...</span>
            </div>
          </div>
        )}

        <div
          ref={plotRef}
          className="w-full min-h-[400px] bg-white dark:bg-gray-800 rounded-md border"
          style={{
            minHeight: "400px",
            width: "100%",
            height: "400px",
          }}
        />
      </div>
    </Card>
  )
}
