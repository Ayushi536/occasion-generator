import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const page = db.getPageBySlug(slug);

  if (!page) {
    return NextResponse.json({ error: 'Wish page not found' }, { status: 404 });
  }

  // Check scheduled reveal
  const now = new Date();
  const isScheduledInFuture = page.revealAt && new Date(page.revealAt) > now;

  // Passcode verification if protected
  const enteredPasscode = req.nextUrl.searchParams.get('passcode');
  const isProtected = Boolean(page.passcode && page.passcode.trim().length > 0);
  const isUnlocked = !isProtected || enteredPasscode === page.passcode;

  // Track view
  const visitorCookie = req.cookies.get(`viewed_${slug}`);
  const isUnique = !visitorCookie;
  db.incrementPageView(slug, isUnique);

  const response = NextResponse.json({
    page: {
      ...page,
      // If scheduled in future or passcode locked, redact sensitive contents
      isScheduledInFuture,
      isUnlocked,
      paragraphs: isScheduledInFuture || !isUnlocked ? [] : page.paragraphs,
      timeline: isScheduledInFuture || !isUnlocked ? [] : page.timeline,
      photos: isScheduledInFuture || !isUnlocked ? [] : page.photos,
      videos: isScheduledInFuture || !isUnlocked ? [] : page.videos,
      secretNote: isScheduledInFuture || !isUnlocked ? undefined : page.secretNote,
      // Don't expose private fields
      passcode: undefined,
    },
  });

  if (isUnique) {
    response.cookies.set({
      name: `viewed_${slug}`,
      value: 'true',
      path: `/w/${slug}`,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return response;
}
