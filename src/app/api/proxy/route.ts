// app/api/proxy/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  //This is AI endpoint.


  try {
    // const formData = await req.formData();
    // const imageFile = formData.get('image') as File | null;

    // const externalFormData = new FormData();
    // externalFormData.append('image', imageFile);

    // const externalResponse = await fetch('https://tien-ms-7e06.tail1bbb7.ts.net/predict', {
    //   method: 'POST',
    //   body: externalFormData,
    // });
    // const data = await externalResponse.json()
    const data = {
      masks: [
        [328.6830139160156, 586.685302734375, 632.4400024414062, 848.9697875976562],
        [1106.6612548828125, 661.9686279296875, 1465.2977294921875, 925.8386840820312],
        [895.464111328125, 1115.58349609375, 967.5437622070312, 1167.6304931640625],
        [1433.7581787109375, 1124.3170166015625, 1515.1768798828125, 1184.38232421875],
        [644.2689819335938, 1120.7576904296875, 718.8682861328125, 1167.7254638671875],
        [406.3097839355469, 1132.173095703125, 473.1642761230469, 1177.5460205078125],
        [1176.5277099609375, 1125.1461181640625, 1235.72216796875, 1167.9931640625],
      ],
      labels: ['cat doodle bird doodle', 'cat doodle bird doodle', 'circle', 'circle', 'circle', 'circle', 'circle']
    }
    return NextResponse.json(data)

  } catch (err) {
    console.error('[API ERROR]:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
