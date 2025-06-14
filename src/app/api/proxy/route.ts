// app/api/proxy/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  //This is AI endpoint.


  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;

    const externalFormData = new FormData();
    externalFormData.append('image', imageFile);

    const externalResponse = await fetch('https://tien-ms-7e06.tail1bbb7.ts.net/predict', {
      method: 'POST',
      body: externalFormData,
    });
    const data = await externalResponse.json()

    return NextResponse.json(data as {
      boxes: Array<any>,
      labels: Array<string>,
      masks: Array<any>
    })

  } catch (err) {
    console.error('[API ERROR]:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
