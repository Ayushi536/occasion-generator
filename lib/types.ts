export type OccasionType =
  | 'birthday'
  | 'anniversary'
  | 'milestone'
  | 'graduation'
  | 'love'
  | 'custom';

export type TemplateType = 'neon-night' | 'pastel-dream' | 'royal-gold';

export type LanguageType = 'en' | 'hi' | 'hinglish';

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  photoUrl?: string;
}

export interface PhotoItem {
  id: string;
  url: string;
  caption?: string;
}

export interface VideoItem {
  id: string;
  url: string;
  caption?: string;
}

export interface GuestWish {
  id: string;
  authorName: string;
  relationship?: string;
  message: string;
  createdAt: string;
  avatarEmoji?: string;
}

export interface WishPage {
  id: string;
  slug: string;
  creatorId: string;
  recipientName: string;
  recipientNickname?: string;
  occasion: OccasionType;
  relationship: string;
  ageOrYears?: string;
  language: LanguageType;
  template: TemplateType;
  status: 'draft' | 'published';
  revealAt?: string;
  passcode?: string;
  headline: string;
  subheadline?: string;
  letterTitle: string;
  paragraphs: string[];
  secretNote?: string;
  timeline: TimelineItem[];
  photos: PhotoItem[];
  videos: VideoItem[];
  audioTrack?: {
    enabled: boolean;
    name: string;
    url: string;
  };
  candlesCount: number;
  views: number;
  uniqueVisitors: number;
  wishes: GuestWish[];
  createdAt: string;
  updatedAt: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}
