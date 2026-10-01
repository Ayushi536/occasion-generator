import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const createPageSchema = z.object({
  recipientName: z.string().min(1, 'Recipient name is required'),
  recipientNickname: z.string().optional(),
  occasion: z.enum(['birthday', 'anniversary', 'milestone', 'graduation', 'love', 'custom']),
  relationship: z.string().default('Friend'),
  ageOrYears: z.string().optional(),
  language: z.enum(['en', 'hi', 'hinglish']).default('en'),
  template: z.enum(['neon-night', 'pastel-dream', 'royal-gold']).default('neon-night'),
  status: z.enum(['draft', 'published']).default('draft'),
  revealAt: z.string().optional(),
  passcode: z.string().optional(),
  headline: z.string().min(1, 'Headline is required'),
  subheadline: z.string().optional(),
  letterTitle: z.string().default('A Message From the Heart'),
  paragraphs: z.array(z.string()).min(1, 'At least 1 message paragraph is required'),
  secretNote: z.string().optional(),
  timeline: z.array(
    z.object({
      id: z.string(),
      date: z.string(),
      title: z.string(),
      description: z.string(),
      photoUrl: z.string().optional(),
    })
  ).default([]),
  photos: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      caption: z.string().optional(),
    })
  ).default([]),
  videos: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      caption: z.string().optional(),
    })
  ).default([]),
  audioTrack: z.object({
    enabled: z.boolean(),
    name: z.string(),
    url: z.string(),
  }).optional(),
  slug: z.string().optional(),
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Admin gets all pages or user gets their created pages
  const pages = user.role === 'admin' ? db.getAllPages() : db.getPagesByCreator(user.id);
  return NextResponse.json({ pages });
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Please sign in to create a wish page' }, { status: 401 });
    }

    const body = await req.json();
    const result = createPageSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || 'Validation failed' }, { status: 400 });
    }

    const data = result.data;

    // Generate unique slug
    let baseSlug = data.slug
      ? slugify(data.slug)
      : slugify(`${data.recipientName}-${data.occasion}`);
    if (!baseSlug) baseSlug = `wish-${Date.now().toString(36)}`;

    let finalSlug = baseSlug;
    let counter = 1;
    while (db.getPageBySlug(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newPage = db.createPage({
      ...data,
      slug: finalSlug,
      creatorId: user.id,
      timeline: data.timeline || [],
      photos: data.photos || [],
      videos: data.videos || [],
    });

    return NextResponse.json({ page: newPage }, { status: 201 });
  } catch (error) {
    console.error('Error creating wish page:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
