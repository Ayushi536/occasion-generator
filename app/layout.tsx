import type { Metadata, Viewport } from 'next';
import './globals.css';
import '@/styles/brand.css';

export const metadata: Metadata = {
  title: 'Wishly – Custom Occasion Page Generator',
  description: 'Create cinematic, interactive personalized celebration websites with custom animations, memory timelines, audio & video for birthdays, anniversaries, and milestones.',
  openGraph: {
    title: 'Wishly – Custom Occasion Page Generator',
    description: 'Create cinematic, interactive personalized celebration websites with custom animations, memory timelines, audio & video for birthdays, anniversaries, and milestones.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wishly – Custom Occasion Page Generator',
    description: 'Create cinematic, interactive personalized celebration websites with custom animations, memory timelines, audio & video for birthdays, anniversaries, and milestones.',
  },
};

export const viewport: Viewport = {
  themeColor: '#090a0f',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090a0f] text-slate-100 antialiased selection:bg-amber-400 selection:text-slate-950" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
