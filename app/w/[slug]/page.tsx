import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import WishPageRenderer from '@/components/wish-page/WishPageRenderer';
import type { Metadata } from 'next';

interface WishPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ passcode?: string }>;
}

export async function generateMetadata({ params }: WishPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = db.getPageBySlug(slug);

  if (!page) {
    return {
      title: 'Wish Page Not Found – Wishly',
    };
  }

  return {
    title: `${page.headline} – Wishly`,
    description: page.subheadline || `A special personalized celebration for ${page.recipientName}`,
    openGraph: {
      title: page.headline,
      description: page.subheadline || `A special personalized celebration for ${page.recipientName}`,
      images: page.photos[0]?.url ? [{ url: page.photos[0].url }] : [],
    },
  };
}

export default async function PublicWishPage({ params, searchParams }: WishPageProps) {
  const { slug } = await params;
  const { passcode } = await searchParams;

  const page = db.getPageBySlug(slug);
  if (!page) {
    notFound();
  }

  // Check schedule
  const now = new Date();
  const isScheduledInFuture = Boolean(page.revealAt && new Date(page.revealAt) > now);

  // Check passcode
  const isProtected = Boolean(page.passcode && page.passcode.trim().length > 0);
  const isUnlocked = !isProtected || passcode === page.passcode;

  // Track view
  db.incrementPageView(slug, true);

  const safePage = {
    ...page,
    isScheduledInFuture,
    isUnlocked,
    paragraphs: isScheduledInFuture || !isUnlocked ? [] : page.paragraphs,
    timeline: isScheduledInFuture || !isUnlocked ? [] : page.timeline,
    photos: isScheduledInFuture || !isUnlocked ? [] : page.photos,
    videos: isScheduledInFuture || !isUnlocked ? [] : page.videos,
    secretNote: isScheduledInFuture || !isUnlocked ? undefined : page.secretNote,
    passcode: undefined,
  };

  return <WishPageRenderer page={safePage} />;
}
