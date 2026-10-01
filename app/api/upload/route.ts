
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

const ALLOWED_IMAGES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const ALLOWED_VIDEOS = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

export async function POST(req: NextRequest) {
  try {
    // Preserve the existing auth lookup and sandbox behavior.
    const user = await getCurrentUser();
    void user;

    const formData = await req.formData();
    const file = formData.get('file');
    const mediaType = formData.get('type') || 'image';

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 },
      );
    }

    if (mediaType !== 'image' && mediaType !== 'video') {
      return NextResponse.json(
        { error: 'Type must be image or video' },
        { status: 400 },
      );
    }

    const allowedTypes =
      mediaType === 'video' ? ALLOWED_VIDEOS : ALLOWED_IMAGES;
    const maxSize =
      mediaType === 'video' ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json(
        { error: `Unsupported ${mediaType} format` },
        { status: 400 },
      );
    }

    if (file.size === 0 || file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File must be non-empty and no larger than ${
            maxSize / (1024 * 1024)
          } MB`,
        },
        { status: 400 },
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Cloudinary is not configured on the server' },
        { status: 503 },
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      format: string;
    }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'wishly',
          resource_type: mediaType,
        },
        (error, uploaded) => {
          if (error) {
            reject(error);
          } else if (!uploaded) {
            reject(new Error('Cloudinary returned no upload result'));
          } else {
            resolve(uploaded);
          }
        },
      ).end(buffer);
    });

    return NextResponse.json(
      {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process media file' },
      { status: 500 },
    );
  }
}
