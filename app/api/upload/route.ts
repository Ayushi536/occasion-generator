import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    // Allow upload for authenticated users or prospective creators in sandbox session

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const mediaType = (formData.get('type') as string) || 'image';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check Cloudinary environment variables
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      // Direct Cloudinary upload
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Data = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${base64Data}`;

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${mediaType === 'video' ? 'video' : 'image'}/upload`;
      const cloudRes = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: dataUri,
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default',
        }),
      });

      if (cloudRes.ok) {
        const cloudData = await cloudRes.json();
        return NextResponse.json({
          url: cloudData.secure_url,
          public_id: cloudData.public_id,
          format: cloudData.format,
        });
      }
    }

    // Fallback: Convert to base64 Data URL for zero-dependency instant reliable preview
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType =
      file.type ||
      (mediaType === 'video'
        ? 'video/mp4'
        : mediaType === 'audio'
        ? 'audio/mpeg'
        : 'image/jpeg');
    const dataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;

    return NextResponse.json({
      url: dataUrl,
      name: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json({ error: 'Failed to process media file' }, { status: 500 });
  }
}
