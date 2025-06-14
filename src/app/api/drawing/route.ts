// app/api/proxy/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {

  const IMAGE_ANALYZE_URL = ''

  //This is AI endpoint.
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;

    const externalFormData = new FormData();
    externalFormData.append('image', imageFile);

    const externalResponse = await fetch(IMAGE_ANALYZE_URL, {
      method: 'POST',
      body: externalFormData,
    });

    const data = await externalResponse.json()

    // data schema를 보고 어딘가에 저장하든지 처리함

    return NextResponse.json(
      { message: 'Operation successful.'},
      { status: 200 }
    );
  } catch (err) {
    console.error('[API ERROR]:', err)
  }
}
