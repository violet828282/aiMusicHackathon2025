// app/api/proxy/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json()
    const externalResponse = await fetch('url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const data = await externalResponse.json()

    return NextResponse.json(data)

  } catch (err) {
    console.error('[API ERROR]:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
