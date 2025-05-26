import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
    }

    const allowedDomains = ["storage.googleapis.com", "firebasestorage.app", "adi-internship-2.firebasestorage.app"]

    let isValidDomain = false
    try {
      const urlObj = new URL(url)
      isValidDomain = allowedDomains.some(
        (domain) => urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`),
      )
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    if (!isValidDomain) {
      return NextResponse.json({ error: "URL not from allowed domain" }, { status: 403 })
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "SPLASHBot/1.0",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch data: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "public, max-age=3600", 
      },
    })
  } catch (error) {
    console.error("Plotly proxy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
