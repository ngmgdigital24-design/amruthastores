import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'file is required' }, { status: 400 })

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET
    if (!cloudName || !uploadPreset) {
      return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 })
    }

    // Prepare multipart form-data to Cloudinary
    const fd = new FormData()
    fd.append('file', file)
    fd.append('upload_preset', uploadPreset)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: fd,
    })
    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: 'Cloudinary upload failed', details: text }, { status: 502 })
    }
    const json = await res.json()
    const url = json.secure_url || json.url
    if (!url) {
      return NextResponse.json({ error: 'No URL returned from Cloudinary' }, { status: 502 })
    }

    return NextResponse.json({ url }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Upload failed', details: error?.message }, { status: 500 })
  }
}


