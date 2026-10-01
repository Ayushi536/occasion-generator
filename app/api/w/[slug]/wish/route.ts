import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const wishSchema = z.object({
  authorName: z.string().min(1, 'Please enter your name').max(50),
  relationship: z.string().max(50).optional(),
  message: z.string().min(2, 'Please write a heartfelt message').max(500),
  avatarEmoji: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const result = wishSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || 'Invalid wish data' }, { status: 400 });
    }

    const { authorName, relationship, message, avatarEmoji } = result.data;
    const emojis = ['🎈', '🎂', '💖', '✨', '🥂', '🌟', '🎉', '🌸', '⚡', '💫'];
    const selectedEmoji = avatarEmoji || emojis[Math.floor(Math.random() * emojis.length)];

    const createdWish = db.addWish(slug, {
      authorName: authorName.trim(),
      relationship: relationship?.trim() || 'Well-wisher',
      message: message.trim(),
      avatarEmoji: selectedEmoji,
    });

    if (!createdWish) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ wish: createdWish }, { status: 201 });
  } catch (error) {
    console.error('Error adding wish:', error);
    return NextResponse.json({ error: 'Failed to post wish' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    let wishId = searchParams.get('wishId');

    if (!wishId) {
      try {
        const body = await req.json();
        wishId = body.wishId;
      } catch {
        // body might be empty
      }
    }

    if (!wishId) {
      return NextResponse.json({ error: 'wishId is required' }, { status: 400 });
    }

    const success = db.deleteWish(slug, wishId);
    if (!success) {
      return NextResponse.json({ error: 'Wish not found or already deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Wish deleted successfully' });
  } catch (error) {
    console.error('Error deleting wish:', error);
    return NextResponse.json({ error: 'Failed to delete wish' }, { status: 500 });
  }
}
