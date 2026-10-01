import { WishPage, GuestWish, UserRecord } from './types';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// In-memory persistent state holder for Next.js server runtime
interface GlobalStore {
  users: UserRecord[];
  pages: WishPage[];
  initialized: boolean;
}

declare global {
  var __wishly_store__: GlobalStore | undefined;
}

const STORE_FILE = path.join(process.cwd(), 'data', 'wishly_store.json');
const FALLBACK_STORE_FILE = '/tmp/wishly_store.json';

let lastLoadedMtime = 0;

function saveStore(store: GlobalStore): void {
  try {
    const dir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
    lastLoadedMtime = Date.now();
  } catch {
    try {
      fs.writeFileSync(FALLBACK_STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
      lastLoadedMtime = Date.now();
    } catch {
      // In-memory persistence fallback
    }
  }
}

function loadStore(): GlobalStore | null {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.pages)) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  try {
    if (fs.existsSync(FALLBACK_STORE_FILE)) {
      const content = fs.readFileSync(FALLBACK_STORE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.pages)) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  return null;
}

const defaultUsers: UserRecord[] = [
  {
    id: 'user_creator_01',
    name: 'Aarav Sharma',
    email: 'creator@wishly.app',
    passwordHash: bcrypt.hashSync('wishly123', 10),
    role: 'user',
    createdAt: new Date('2026-01-10T10:00:00.000Z').toISOString(),
  },
  {
    id: 'user_admin_01',
    name: 'Wishly Superadmin',
    email: 'admin@wishly.app',
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    createdAt: new Date('2026-01-01T10:00:00.000Z').toISOString(),
  },
];

const defaultPages: WishPage[] = [
  {
    id: 'page_demo_01',
    slug: 'priya-25th-birthday',
    creatorId: 'user_creator_01',
    recipientName: 'Priya Patel',
    recipientNickname: 'Piyu',
    occasion: 'birthday',
    relationship: 'Soul Sister',
    ageOrYears: '25th',
    language: 'hinglish',
    template: 'neon-night',
    status: 'published',
    headline: 'Happy 25th Birthday, Priya!',
    subheadline: 'To the girl who turns ordinary days into electric midnight memories.',
    letterTitle: 'A Quarter Century of Radiance & Laughter',
    paragraphs: [
      'Happy 25th Birthday to my favorite human in the whole universe! From our late-night chai gossip sessions in college to celebrating every tiny win together, you have always been the spark that lights up the room.',
      'तुम्हारी हंसी और तुम्हारी यह positive energy किसी भी उदास दिन को खुशियों से भर देती है। You have this rare superpower to make everyone around you feel valued, cherished, and unstoppable.',
      'As you step into your 25th chapter, my only wish for you is endless joy, bold adventures, and dreams that turn into reality faster than you can imagine. Keep shining with that neon sparkle, Piyu!',
    ],
    secretNote: 'PS: You will always be my emergency contact, my crime partner, and my personal standup comedian forever.',
    timeline: [
      {
        id: 't1',
        date: 'August 2019',
        title: 'The First Chai Encounter',
        description: 'Met outside the library during monsoon semester. We shared one ginger tea and ended up talking for three straight hours.',
        photoUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 't2',
        date: 'December 2021',
        title: 'Goa Roadtrip Madness',
        description: 'Scattered maps, sunset at Vagator beach, and screaming Bollywood melodies on scooter rides till 4 AM.',
        photoUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 't3',
        date: 'October 2024',
        title: 'New City, Same Connection',
        description: 'Even when jobs moved us 800 miles apart, FaceTime Sundays never missed a single beat.',
        photoUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
      },
    ],
    photos: [
      {
        id: 'p1',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        caption: 'Golden hour smiles at the cliffside',
      },
      {
        id: 'p2',
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        caption: 'Unfiltered candid moments',
      },
      {
        id: 'p3',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        caption: 'Birthday glow',
      },
      {
        id: 'p4',
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
        caption: 'Pure joy & celebration vibes',
      },
    ],
    videos: [
      {
        id: 'v1',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-friends-celebrating-with-sparklers-at-night-42862-large.mp4',
        caption: 'Sparkler moments from last winter',
      },
    ],
    audioTrack: {
      enabled: true,
      name: 'Ambient Electric Serenade',
      url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    },
    candlesCount: 42,
    views: 184,
    uniqueVisitors: 112,
    wishes: [
      {
        id: 'w1',
        authorName: 'Rohan Mehra',
        relationship: 'Old Roommate',
        message: 'Happy Birthday Priya! Keep spreading that contagious laugh wherever you go! 🎂✨',
        createdAt: '2026-03-20T14:22:00.000Z',
        avatarEmoji: '🎈',
      },
      {
        id: 'w2',
        authorName: 'Ananya & Neha',
        relationship: 'College Crew',
        message: 'Quarter of a century looking absolutely legendary. Love you to bits, Piyu! ❤️🎉',
        createdAt: '2026-03-21T09:15:00.000Z',
        avatarEmoji: '🥂',
      },
      {
        id: 'w3',
        authorName: 'Kabir Verma',
        relationship: 'Work Bestie',
        message: 'जन्मदिन की ढेर सारी शुभकामनाएं! May this 25th year bring you promotions, vacations, and all the dessert! 🌟',
        createdAt: '2026-03-21T18:40:00.000Z',
        avatarEmoji: '⚡',
      },
    ],
    createdAt: '2026-03-19T08:00:00.000Z',
    updatedAt: '2026-03-21T19:00:00.000Z',
  },
  {
    id: 'page_demo_02',
    slug: 'alex-sam-forever',
    creatorId: 'user_creator_01',
    recipientName: 'Samantha & Alex',
    recipientNickname: 'Sam & Al',
    occasion: 'anniversary',
    relationship: 'Soulmates',
    ageOrYears: '5th Anniversary',
    language: 'en',
    template: 'pastel-dream',
    status: 'published',
    headline: 'Happy 5th Anniversary, Samantha & Alex!',
    subheadline: 'Five years of warmth, quiet tea mornings, and building a world together.',
    letterTitle: 'Half a Decade of Tender Magic',
    paragraphs: [
      'Five years ago today, you both stood before family and friends and promised forever. Watching your love evolve has been one of the greatest privileges of my life.',
      'You teach everyone around you what true partnership looks like: listening with patience, laughing through sudden rainstorms, and always choosing each other at the end of every long day.',
      'Here is to another five hundred chapters of soft morning light, shared dreams, and ever-deepening love. Happy 5th Anniversary!',
    ],
    secretNote: 'May your bond grow gentler, richer, and sweeter with each sunrise.',
    timeline: [
      {
        id: 't201',
        date: 'May 2021',
        title: 'The Wedding Day',
        description: 'Surrounded by lavender blossoms, promises made under the setting sun.',
        photoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 't202',
        date: 'October 2023',
        title: 'Our First Home',
        description: 'Unpacking cardboard boxes, paint on our noses, and dancing in the empty living room.',
        photoUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
      },
    ],
    photos: [
      {
        id: 'p201',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        caption: 'The unforgettable ceremony',
      },
      {
        id: 'p202',
        url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
        caption: 'Gentle moments by the shore',
      },
      {
        id: 'p203',
        url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
        caption: 'Golden evening strolls',
      },
    ],
    videos: [],
    audioTrack: {
      enabled: true,
      name: 'Gentle Piano Romance',
      url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c6f44d99.mp3',
    },
    candlesCount: 88,
    views: 340,
    uniqueVisitors: 215,
    wishes: [
      {
        id: 'w201',
        authorName: 'Grandma Miller',
        relationship: 'Family',
        message: 'Blessings to both my darling grandchildren. Five years down and many more to go! 💕',
        createdAt: '2026-03-22T10:00:00.000Z',
        avatarEmoji: '🌸',
      },
    ],
    createdAt: '2026-03-20T12:00:00.000Z',
    updatedAt: '2026-03-22T11:00:00.000Z',
  },
  {
    id: 'page_demo_03',
    slug: 'rohan-graduation-gala',
    creatorId: 'user_admin_01',
    recipientName: 'Dr. Rohan Verma',
    recipientNickname: 'Doctor Sahab',
    occasion: 'graduation',
    relationship: 'Proud Brother',
    ageOrYears: 'MD Degree Honors',
    language: 'hi',
    template: 'royal-gold',
    status: 'published',
    headline: 'मुबारक हो, डॉ. रोहन वर्मा!',
    subheadline: 'कड़ी मेहनत, समर्पण और असीम धैर्य का यह ऐतिहासिक स्वर्ण उत्सव।',
    letterTitle: 'एक नया मील का पत्थर और गौरवशाली सफर',
    paragraphs: [
      'आज पूरा परिवार तुम पर गर्व से फूला नहीं समा रहा है। वर्षों की अनगिनत रातों की पढ़ाई, क्लीनिकल राउंड्स और तुम्हारे अटूट संकल्प ने आज तुम्हें इस मुकाम पर पहुंचाया है।',
      'डॉक्टर बनना केवल एक पेशा नहीं, बल्कि मानव सेवा की एक पवित्र प्रतिज्ञा है। हमें पूरा विश्वास है कि तुम हर मरीज के जीवन में आशा की किरण बनकर चमकोगे।',
      'तुम्हारी इस शानदार सफलता पर पूरे दिल से बधाई। यह तो सिर्फ शुरुआत है, तुम्हारे आगे संपूर्ण आसमान खुला है!',
    ],
    secretNote: 'हमेशा याद रखना—सच्ची सफलता लोगों के चेहरों पर मुस्कान लाने में है।',
    timeline: [
      {
        id: 't301',
        date: '2020',
        title: 'White Coat Ceremony',
        description: 'Taking the Hippocratic oath on the first day of medical school.',
        photoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 't302',
        date: '2025',
        title: 'Final Clinical Honors',
        description: 'Awarded highest distinction in diagnostic internal medicine.',
        photoUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=800&q=80',
      },
    ],
    photos: [
      {
        id: 'p301',
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
        caption: 'The moment the dream began',
      },
      {
        id: 'p302',
        url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
        caption: 'Gold Medal convocation day',
      },
    ],
    videos: [],
    audioTrack: {
      enabled: true,
      name: 'Regal Orchestral Anthem',
      url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
    },
    candlesCount: 120,
    views: 512,
    uniqueVisitors: 340,
    wishes: [
      {
        id: 'w301',
        authorName: 'Mummy & Papa',
        relationship: 'Parents',
        message: 'हमारे बेटे रोहन, भगवान तुम्हें लंबी उम्र और मरीजों की सेवा करने की अपार शक्ति दे। बहुत-बहुत प्यार! 👑🪔',
        createdAt: '2026-03-25T08:30:00.000Z',
        avatarEmoji: '🌟',
      },
    ],
    createdAt: '2026-03-24T10:00:00.000Z',
    updatedAt: '2026-03-25T09:00:00.000Z',
  },
];

function getStore(): GlobalStore {
  const targetFile = fs.existsSync(STORE_FILE)
    ? STORE_FILE
    : fs.existsSync(FALLBACK_STORE_FILE)
    ? FALLBACK_STORE_FILE
    : null;

  if (targetFile) {
    try {
      const stats = fs.statSync(targetFile);
      if (!global.__wishly_store__ || stats.mtimeMs > lastLoadedMtime) {
        const loaded = loadStore();
        if (loaded) {
          global.__wishly_store__ = loaded;
          lastLoadedMtime = stats.mtimeMs;
        }
      }
    } catch {
      // ignore
    }
  }

  if (!global.__wishly_store__) {
    const loaded = loadStore();
    if (loaded) {
      global.__wishly_store__ = loaded;
    } else {
      global.__wishly_store__ = {
        users: [...defaultUsers],
        pages: [...defaultPages],
        initialized: true,
      };
      saveStore(global.__wishly_store__);
    }
  }
  return global.__wishly_store__;
}

export const db = {
  // Users
  getUserByEmail(email: string): UserRecord | undefined {
    const cleanEmail = email.trim().toLowerCase();
    let store = getStore();
    let found = store.users.find((u) => u.email.trim().toLowerCase() === cleanEmail);
    if (!found) {
      // Force disk reload fallback
      const loaded = loadStore();
      if (loaded) {
        global.__wishly_store__ = loaded;
        store = loaded;
        found = store.users.find((u) => u.email.trim().toLowerCase() === cleanEmail);
      }
    }
    return found;
  },

  getUserById(id: string): UserRecord | undefined {
    let store = getStore();
    let found = store.users.find((u) => u.id === id);
    if (!found) {
      const loaded = loadStore();
      if (loaded) {
        global.__wishly_store__ = loaded;
        store = loaded;
        found = store.users.find((u) => u.id === id);
      }
    }
    return found;
  },

  createUser(name: string, email: string, passwordHash: string, role: 'user' | 'admin' = 'user'): UserRecord {
    const store = getStore();
    const newUser: UserRecord = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role,
      createdAt: new Date().toISOString(),
    };
    store.users.push(newUser);
    saveStore(store);
    return newUser;
  },

  getAllUsers(): Omit<UserRecord, 'passwordHash'>[] {
    const store = getStore();
    return store.users.map(({ passwordHash: _, ...rest }) => rest);
  },

  // Wish Pages
  getAllPages(): WishPage[] {
    const store = getStore();
    return [...store.pages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getPagesByCreator(creatorId: string): WishPage[] {
    const store = getStore();
    return store.pages
      .filter((p) => p.creatorId === creatorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getPageById(id: string): WishPage | undefined {
    const store = getStore();
    return store.pages.find((p) => p.id === id);
  },

  getPageBySlug(slug: string): WishPage | undefined {
    const store = getStore();
    return store.pages.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  },

  createPage(data: Omit<WishPage, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'uniqueVisitors' | 'candlesCount' | 'wishes'>): WishPage {
    const store = getStore();
    const newPage: WishPage = {
      ...data,
      id: `page_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      views: 0,
      uniqueVisitors: 0,
      candlesCount: 0,
      wishes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.pages.push(newPage);
    saveStore(store);
    return newPage;
  },

  updatePage(id: string, updates: Partial<WishPage>): WishPage | undefined {
    const store = getStore();
    const index = store.pages.findIndex((p) => p.id === id);
    if (index === -1) return undefined;
    const updated = {
      ...store.pages[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    store.pages[index] = updated;
    saveStore(store);
    return updated;
  },

  deletePage(id: string): boolean {
    const store = getStore();
    const index = store.pages.findIndex((p) => p.id === id);
    if (index === -1) return false;
    store.pages.splice(index, 1);
    saveStore(store);
    return true;
  },

  duplicatePage(id: string, creatorId: string): WishPage | undefined {
    const source = this.getPageById(id);
    if (!source) return undefined;
    const baseSlug = `${source.slug}-copy-${Math.random().toString(36).substring(2, 5)}`;
    const copyData: Omit<WishPage, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'uniqueVisitors' | 'candlesCount' | 'wishes'> = {
      ...source,
      creatorId,
      slug: baseSlug,
      headline: `${source.headline} (Copy)`,
      status: 'draft',
    };
    return this.createPage(copyData);
  },

  incrementPageView(slug: string, isUnique: boolean): void {
    const page = this.getPageBySlug(slug);
    if (!page) return;
    page.views += 1;
    if (isUnique) {
      page.uniqueVisitors += 1;
    }
    saveStore(getStore());
  },

  incrementCandle(slug: string): number {
    const page = this.getPageBySlug(slug);
    if (!page) return 0;
    page.candlesCount = (page.candlesCount || 0) + 1;
    saveStore(getStore());
    return page.candlesCount;
  },

  addWish(slug: string, wish: Omit<GuestWish, 'id' | 'createdAt'>): GuestWish | undefined {
    const page = this.getPageBySlug(slug);
    if (!page) return undefined;
    const newWish: GuestWish = {
      ...wish,
      id: `wish_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    page.wishes.unshift(newWish);
    saveStore(getStore());
    return newWish;
  },

  deleteWish(slugOrId: string, wishId: string): boolean {
    const page = this.getPageBySlug(slugOrId) || this.getPageById(slugOrId);
    if (!page) return false;
    const idx = page.wishes.findIndex((w) => w.id === wishId);
    if (idx === -1) return false;
    page.wishes.splice(idx, 1);
    saveStore(getStore());
    return true;
  },

  getStats() {
    const store = getStore();
    const totalUsers = store.users.length;
    const totalPages = store.pages.length;
    const publishedPages = store.pages.filter((p) => p.status === 'published').length;
    const totalViews = store.pages.reduce((acc, p) => acc + (p.views || 0), 0);
    const totalWishes = store.pages.reduce((acc, p) => acc + (p.wishes?.length || 0), 0);
    const totalCandles = store.pages.reduce((acc, p) => acc + (p.candlesCount || 0), 0);
    return {
      totalUsers,
      totalPages,
      publishedPages,
      totalViews,
      totalWishes,
      totalCandles,
    };
  },
};
