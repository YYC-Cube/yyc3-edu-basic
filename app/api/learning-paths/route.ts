import { NextRequest, NextResponse } from "next/server"

const BASE_URL = process.env.LEARNING_SERVICE_URL || "http://localhost:8000"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const path = url.searchParams.get("path") || "/api/v1/learning-paths"
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { accept: "application/json" },
      cache: "no-store",
    })
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Proxy error"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const res = await fetch(`${BASE_URL}/api/v1/learning-paths`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(body),
    })

    const text = await res.text()
    let data: unknown
    try {
      data = JSON.parse(text)
    } catch {
      data = { raw: text }
    }
    return NextResponse.json(data, { status: res.status })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Proxy error"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
