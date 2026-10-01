'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Sparkles,
  Heart,
  Cake,
  GraduationCap,
  Award,
  ChevronRight,
  ChevronLeft,
  Upload,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  Music,
  Smartphone,
  Calendar,
  Lock,
  Wand2,
  Film,
  Play,
  Pause,
  Shuffle,
  Volume2,
  Link as LinkIcon,
} from 'lucide-react';
import { OccasionType, TemplateType, LanguageType, PhotoItem, VideoItem, TimelineItem } from '@/lib/types';
import { TEMPLATES } from '@/components/wish-page/theme-config';

const OCCASIONS: { id: OccasionType; label: string; icon: string; desc: string }[] = [
  { id: 'birthday', label: 'Birthday', icon: '🎂', desc: 'Candles, cake, balloons & celebratory vibes' },
  { id: 'anniversary', label: 'Anniversary', icon: '💖', desc: 'Romantic memories, petals & love notes' },
  { id: 'graduation', label: 'Graduation', icon: '🎓', desc: 'Academic milestone, golden caps & future goals' },
  { id: 'milestone', label: 'Career / Milestone', icon: '⭐', desc: 'Promotions, retirements & big achievements' },
  { id: 'love', label: 'Love / Valentine', icon: '💌', desc: 'Deep affection, poetry & tender moments' },
  { id: 'custom', label: 'Custom Occasion', icon: '✨', desc: 'Tailor-made for any joyous moment' },
];

const TEMPLATE_OPTIONS: { id: TemplateType; name: string; desc: string; previewBadge: string }[] = [
  {
    id: 'neon-night',
    name: 'Neon Night',
    desc: 'Electric cyan & pink glow, dark obsidian cyberpunk vibe, pulsing stars.',
    previewBadge: 'Cyber Glow',
  },
  {
    id: 'pastel-dream',
    name: 'Pastel Dream',
    desc: 'Soft twilight rose, ethereal floating petals, warm tender calligraphy.',
    previewBadge: 'Romantic Ethereal',
  },
  {
    id: 'royal-gold',
    name: 'Royal Gold',
    desc: 'Imperial obsidian with 24k gold leaf sheen, regal serif, gala grandeur.',
    previewBadge: 'Aristocratic Luxury',
  },
];

const WIZARD_STEPS = [
  { id: 1, short: 'Occasion', title: 'Choose the occasion' },
  { id: 2, short: 'Recipient', title: 'Add their details' },
  { id: 3, short: 'Words', title: 'Write the message' },
  { id: 4, short: 'Memories', title: 'Collect the moments' },
  { id: 5, short: 'Style', title: 'Choose the atmosphere' },
  { id: 6, short: 'Launch', title: 'Set privacy and publish' },
] as const;

const TEMPLATE_PREVIEWS: Record<TemplateType, { background: string; accent: string; secondary: string; pattern: string }> = {
  'neon-night': {
    background: 'linear-gradient(145deg, #05070f 10%, #0b1930 62%, #250a27)',
    accent: '#22d3ee',
    secondary: '#ec4899',
    pattern: 'radial-gradient(circle at 20% 20%, rgba(34,211,238,.28), transparent 34%)',
  },
  'pastel-dream': {
    background: 'linear-gradient(145deg, #50335f, #2a1b3d 62%, #42243f)',
    accent: '#fbcfe8',
    secondary: '#c4b5fd',
    pattern: 'radial-gradient(circle at 75% 18%, rgba(251,207,232,.3), transparent 38%)',
  },
  'royal-gold': {
    background: 'linear-gradient(145deg, #0b0a0c, #21170f 68%, #100809)',
    accent: '#d4af37',
    secondary: '#f5e6c8',
    pattern: 'linear-gradient(120deg, transparent 35%, rgba(212,175,55,.18) 50%, transparent 65%)',
  },
};

const DRAFT_STORAGE_KEY = 'wishly_create_draft_v1';

interface WishlyCreateDraft {
  version: 1;
  step: number;
  occasion: OccasionType;
  recipientName: string;
  recipientNickname: string;
  relationship: string;
  ageOrYears: string;
  language: LanguageType;
  headline: string;
  subheadline: string;
  letterTitle: string;
  paragraphs: string[];
  secretNote: string;
  photos: PhotoItem[];
  videos: VideoItem[];
  newVideoUrl: string;
  newVideoCaption: string;
  audioEnabled: boolean;
  selectedAudioTrack: { name: string; url: string; isCustom?: boolean };
  timeline: TimelineItem[];
  template: TemplateType;
  revealAt: string;
  passcode: string;
  customSlug: string;
  aiTone: 'emotional' | 'funny' | 'poetic' | 'filmi' | 'nostalgic';
  aiMemories: string;
}

const CURATED_SAMPLE_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    caption: 'Celebration confetti moments',
  },
  {
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    caption: 'Sun-drenched memories & laughter',
  },
  {
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    caption: 'Unfiltered candid smiles',
  },
  {
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    caption: 'Late night cafe chats',
  },
];

const CURATED_SAMPLE_VIDEOS = [
  {
    url: 'https://assets.mixkit.co/videos/preview/mixkit-friends-celebrating-with-sparklers-at-night-42862-large.mp4',
    caption: 'Sparklers & midnight laughter',
  },
  {
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-small-birthday-cake-with-burning-candles-42861-large.mp4',
    caption: 'Candlelight wish moment',
  },
];

const CURATED_SOUNDTRACKS = [
  {
    id: 'acoustic-birthday',
    name: '🎸 Warm Acoustic Celebration & Chimes',
    genre: 'Acoustic / Warm',
    url: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
  },
  {
    id: 'cinematic-strings',
    name: '🎻 Grand Gala Strings & Fanfare',
    genre: 'Orchestral / Gala',
    url: 'https://cdn.freesound.org/previews/416/416632_5121236-lq.mp3',
  },
  {
    id: 'midnight-piano',
    name: '🎹 Midnight Cozy Piano Waltz',
    genre: 'Emotional / Sentimental',
    url: 'https://cdn.freesound.org/previews/530/530415_11861866-lq.mp3',
  },
  {
    id: 'upbeat-pop',
    name: '🎉 Joyful Upbeat Pop Celebration',
    genre: 'Pop / Festive',
    url: 'https://cdn.freesound.org/previews/467/467758_7037-lq.mp3',
  },
  {
    id: 'romantic-notes',
    name: '🌹 Tender Romantic Love Harmony',
    genre: 'Romantic / Love',
    url: 'https://cdn.freesound.org/previews/518/518305_2402876-lq.mp3',
  },
  {
    id: 'festive-dhol',
    name: '🥁 High-Energy Bollywood Festive Beats',
    genre: 'Desi / Bollywood',
    url: 'https://cdn.freesound.org/previews/412/412224_5121236-lq.mp3',
  },
];

export default function CreateWishPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPhonePreview, setShowPhonePreview] = useState(true);
  const [draftReady, setDraftReady] = useState(false);
  const [draftStatus, setDraftStatus] = useState<'restored' | 'saved' | ''>('');
  const formPanelRef = useRef<HTMLDivElement | null>(null);

  // Form State
  const [occasion, setOccasion] = useState<OccasionType>('birthday');
  const [recipientName, setRecipientName] = useState('');
  const [recipientNickname, setRecipientNickname] = useState('');
  const [relationship, setRelationship] = useState('Best Friend');
  const [ageOrYears, setAgeOrYears] = useState('');

  const [language, setLanguage] = useState<LanguageType>('en');
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [letterTitle, setLetterTitle] = useState('A Message From The Heart');
  const [paragraphs, setParagraphs] = useState<string[]>([
    'Happy celebration to someone who brings unmatched light and laughter into this world!',
    'Thank you for always being there through every chapter. Looking forward to many more milestones together.',
  ]);
  const [secretNote, setSecretNote] = useState('Always proud of you, no matter the distance.');

  const [photos, setPhotos] = useState<PhotoItem[]>([
    {
      id: 'p1',
      url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
      caption: 'Sparkling celebration moments',
    },
  ]);

  // Video State
  const [videos, setVideos] = useState<VideoItem[]>([
    {
      id: 'v1',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-friends-celebrating-with-sparklers-at-night-42862-large.mp4',
      caption: 'Sparklers & celebration smiles',
    },
  ]);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoCaption, setNewVideoCaption] = useState('');
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  // Audio State & Preview
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [selectedAudioTrack, setSelectedAudioTrack] = useState<{
    name: string;
    url: string;
    isCustom?: boolean;
  }>({
    name: CURATED_SOUNDTRACKS[0].name,
    url: CURATED_SOUNDTRACKS[0].url,
  });
  const [previewingAudioUrl, setPreviewingAudioUrl] = useState<string | null>(null);
  const [audioDiceRolling, setAudioDiceRolling] = useState(false);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  const [timeline, setTimeline] = useState<TimelineItem[]>([
    {
      id: 't1',
      date: 'The Beginning',
      title: 'When Our Journey Started',
      description: 'The first time our paths crossed and everything became a little brighter.',
    },
  ]);

  const [template, setTemplate] = useState<TemplateType>('neon-night');
  const [revealAt, setRevealAt] = useState('');
  const [passcode, setPasscode] = useState('');
  const [customSlug, setCustomSlug] = useState('');

  // AI Wish Wizard State
  const [aiTone, setAiTone] = useState<'emotional' | 'funny' | 'poetic' | 'filmi' | 'nostalgic'>('emotional');
  const [aiMemories, setAiMemories] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState('');

  // Restore once on mount. A valid template query takes precedence over a saved draft;
  // missing or invalid query values retain the restored/default selection.
  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      try {
      const rawDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (rawDraft) {
        const parsed = JSON.parse(rawDraft) as Partial<WishlyCreateDraft>;
        if (parsed && parsed.version === 1) {
          if (typeof parsed.step === 'number') setStep(Math.min(6, Math.max(1, parsed.step)));
          if (OCCASIONS.some((item) => item.id === parsed.occasion)) setOccasion(parsed.occasion as OccasionType);
          if (typeof parsed.recipientName === 'string') setRecipientName(parsed.recipientName);
          if (typeof parsed.recipientNickname === 'string') setRecipientNickname(parsed.recipientNickname);
          if (typeof parsed.relationship === 'string') setRelationship(parsed.relationship);
          if (typeof parsed.ageOrYears === 'string') setAgeOrYears(parsed.ageOrYears);
          if (['en', 'hi', 'hinglish'].includes(parsed.language || '')) setLanguage(parsed.language as LanguageType);
          if (typeof parsed.headline === 'string') setHeadline(parsed.headline);
          if (typeof parsed.subheadline === 'string') setSubheadline(parsed.subheadline);
          if (typeof parsed.letterTitle === 'string') setLetterTitle(parsed.letterTitle);
          if (Array.isArray(parsed.paragraphs)) setParagraphs(parsed.paragraphs.filter((item): item is string => typeof item === 'string'));
          if (typeof parsed.secretNote === 'string') setSecretNote(parsed.secretNote);
          if (Array.isArray(parsed.photos)) setPhotos(parsed.photos);
          if (Array.isArray(parsed.videos)) setVideos(parsed.videos);
          if (typeof parsed.newVideoUrl === 'string') setNewVideoUrl(parsed.newVideoUrl);
          if (typeof parsed.newVideoCaption === 'string') setNewVideoCaption(parsed.newVideoCaption);
          if (typeof parsed.audioEnabled === 'boolean') setAudioEnabled(parsed.audioEnabled);
          if (parsed.selectedAudioTrack?.name && parsed.selectedAudioTrack?.url) setSelectedAudioTrack(parsed.selectedAudioTrack);
          if (Array.isArray(parsed.timeline)) setTimeline(parsed.timeline);
          if (TEMPLATE_OPTIONS.some((item) => item.id === parsed.template)) setTemplate(parsed.template as TemplateType);
          if (typeof parsed.revealAt === 'string') setRevealAt(parsed.revealAt);
          if (typeof parsed.passcode === 'string') setPasscode(parsed.passcode);
          if (typeof parsed.customSlug === 'string') setCustomSlug(parsed.customSlug);
          if (['emotional', 'funny', 'poetic', 'filmi', 'nostalgic'].includes(parsed.aiTone || '')) setAiTone(parsed.aiTone as WishlyCreateDraft['aiTone']);
          if (typeof parsed.aiMemories === 'string') setAiMemories(parsed.aiMemories);
          setDraftStatus('restored');
        }
      }

      const requestedTemplate = new URLSearchParams(window.location.search).get('template');
      if (TEMPLATE_OPTIONS.some((item) => item.id === requestedTemplate)) {
        setTemplate(requestedTemplate as TemplateType);
      }
      } catch (error) {
        console.warn('Unable to restore the local Wishly draft:', error);
      } finally {
        setDraftReady(true);
      }
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (!draftReady) return;

    const timeout = window.setTimeout(() => {
      const draft: WishlyCreateDraft = {
        version: 1,
        step,
        occasion,
        recipientName,
        recipientNickname,
        relationship,
        ageOrYears,
        language,
        headline,
        subheadline,
        letterTitle,
        paragraphs,
        secretNote,
        photos,
        videos,
        newVideoUrl,
        newVideoCaption,
        audioEnabled,
        selectedAudioTrack,
        timeline,
        template,
        revealAt,
        passcode,
        customSlug,
        aiTone,
        aiMemories,
      };

      try {
        window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
        setDraftStatus('saved');
      } catch (error) {
        console.warn('Unable to save the local Wishly draft:', error);
      }
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [
    draftReady,
    step,
    occasion,
    recipientName,
    recipientNickname,
    relationship,
    ageOrYears,
    language,
    headline,
    subheadline,
    letterTitle,
    paragraphs,
    secretNote,
    photos,
    videos,
    newVideoUrl,
    newVideoCaption,
    audioEnabled,
    selectedAudioTrack,
    timeline,
    template,
    revealAt,
    passcode,
    customSlug,
    aiTone,
    aiMemories,
  ]);

  const handleGenerateWithAi = async () => {
    setIsGeneratingAi(true);
    setAiSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await fetch('/api/ai/wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: recipientName.trim() || 'My Favorite Person',
          occasion,
          relationship: relationship || 'Best Friend',
          tone: aiTone,
          language,
          keyMemories: aiMemories.trim(),
          mode: 'full_letter',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.headline) setHeadline(data.headline);
        if (data.subheadline) setSubheadline(data.subheadline);
        if (data.letterTitle) setLetterTitle(data.letterTitle);
        if (data.paragraphs && Array.isArray(data.paragraphs) && data.paragraphs.length > 0) {
          setParagraphs(data.paragraphs);
        }
        if (data.secretNote) setSecretNote(data.secretNote);
        setAiSuccessMsg('✨ Heartfelt story crafted with Gemini AI!');
        setTimeout(() => setAiSuccessMsg(''), 4500);
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || 'Failed to generate AI wish');
      }
    } catch (err) {
      console.error('AI generation error:', err);
      setErrorMsg('Failed to connect to AI generator');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Smart suggestions helper
  const applyMessagePreset = (type: 'birthday-hi' | 'birthday-en' | 'anniversary' | 'gratitude') => {
    if (type === 'birthday-hi') {
      setLanguage('hi');
      setHeadline(`जन्मदिन मुबारक हो, ${recipientName || 'मेरी जान'}!`);
      setSubheadline('तुम्हारी मुस्कान ही हमारे दिन का सबसे खूबसूरत उजाला है।');
      setLetterTitle('दुआओं और प्यार से भरा एक संदेश');
      setParagraphs([
        `जन्मदिन की ढेरों शुभकामनाएं! भगवान से यही प्रार्थना है कि तुम्हारा आने वाला साल ढेर सारी खुशियों, अच्छी सेहत और बड़ी सफलताओं से भरा हो।`,
        `तुम हमारे परिवार और दोस्तों की जान हो। तुम्हारी यह प्यारी सी हंसी कभी कम न हो।`,
      ]);
    } else if (type === 'birthday-en') {
      setLanguage('en');
      setHeadline(`Happy Birthday, ${recipientName || 'Legend'}!`);
      setSubheadline('To another year of wild laughter, crazy memories, and bold wins.');
      setLetterTitle('A Quarter Century of Brilliance');
      setParagraphs([
        `Happy Birthday to one of the most incredible souls I know! Watching you grow and conquer every hurdle has been pure inspiration.`,
        `May this new chapter bring you everything your heart desires and more. Keep shining bright!`,
      ]);
    } else if (type === 'anniversary') {
      setLanguage('en');
      setHeadline(`Happy Anniversary, ${recipientName || 'My Love'}!`);
      setSubheadline('To every yesterday we cherished and every tomorrow we dream of.');
      setLetterTitle('Forever and Always');
      setParagraphs([
        `Another year of choosing each other through every sunrise and midnight conversation. You make life feel like the sweetest adventure.`,
        `Thank you for being my anchor, my confidant, and my favorite part of every day. Here is to our infinite forever!`,
      ]);
    }
  };

  const handleAddSamplePhotos = () => {
    const newItems = CURATED_SAMPLE_PHOTOS.map((p, idx) => ({
      id: `sample_${Date.now()}_${idx}`,
      url: p.url,
      caption: p.caption,
    }));
    setPhotos([...photos, ...newItems]);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('wishly_token') : null;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers,
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setPhotos([
          ...photos,
          {
            id: `photo_${Date.now()}`,
            url: data.url,
            caption: file.name.replace(/\.[^/.]+$/, ''),
          },
        ]);
      }
    } catch (err) {
      console.error('Upload error', err);
    }
  };

  const handleAddSampleVideos = () => {
    const newItems = CURATED_SAMPLE_VIDEOS.map((v, idx) => ({
      id: `sample_vid_${Date.now()}_${idx}`,
      url: v.url,
      caption: v.caption,
    }));
    setVideos([...videos, ...newItems]);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploadingVideo(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'video');

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('wishly_token') : null;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers,
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setVideos([
          ...videos,
          {
            id: `video_${Date.now()}`,
            url: data.url,
            caption: file.name.replace(/\.[^/.]+$/, ''),
          },
        ]);
      }
    } catch (err) {
      console.error('Video upload error', err);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleAddCustomVideoLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl.trim()) return;
    setVideos([
      ...videos,
      {
        id: `video_${Date.now()}`,
        url: newVideoUrl.trim(),
        caption: newVideoCaption.trim() || `Celebration Video for ${recipientName || 'You'}`,
      },
    ]);
    setNewVideoUrl('');
    setNewVideoCaption('');
  };

  // Audio Random Picker with dice roll & instant preview
  const handleRandomSoundtrack = () => {
    setAudioDiceRolling(true);
    const randomIndex = Math.floor(Math.random() * CURATED_SOUNDTRACKS.length);
    const chosen = CURATED_SOUNDTRACKS[randomIndex];
    setSelectedAudioTrack({ name: chosen.name, url: chosen.url });

    // Play 4-second preview
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
    }
    const audio = new Audio(chosen.url);
    audio.volume = 0.5;
    audioPreviewRef.current = audio;
    audio
      .play()
      .then(() => {
        setPreviewingAudioUrl(chosen.url);
        setTimeout(() => {
          if (audioPreviewRef.current) {
            audioPreviewRef.current.pause();
            setPreviewingAudioUrl(null);
          }
        }, 4500);
      })
      .catch(() => {});

    setTimeout(() => setAudioDiceRolling(false), 600);
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'audio');

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('wishly_token') : null;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers,
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        const uploadedTrack = {
          name: `🎵 ${file.name.replace(/\.[^/.]+$/, '')} (Custom Upload)`,
          url: data.url,
          isCustom: true,
        };
        setSelectedAudioTrack(uploadedTrack);
        setAudioEnabled(true);
      }
    } catch (err) {
      console.error('Audio upload error', err);
    }
  };

  const handleToggleAudioPreview = (trackUrl: string) => {
    if (previewingAudioUrl === trackUrl) {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
      setPreviewingAudioUrl(null);
    } else {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
      const audio = new Audio(trackUrl);
      audio.volume = 0.5;
      audioPreviewRef.current = audio;
      audio
        .play()
        .then(() => setPreviewingAudioUrl(trackUrl))
        .catch(() => setPreviewingAudioUrl(null));
      audio.onended = () => setPreviewingAudioUrl(null);
    }
  };

  const handleAddTimelineNode = () => {
    setTimeline([
      ...timeline,
      {
        id: `t_${Date.now()}`,
        date: 'New Chapter',
        title: 'Unforgettable Memory',
        description: 'Describe this special moment here...',
      },
    ]);
  };

  const focusField = (id: string) => {
    window.requestAnimationFrame(() => document.getElementById(id)?.focus());
  };

  const handleNextStep = () => {
    setErrorMsg('');
    if (step === 1 && !occasion) {
      setErrorMsg('Please select an occasion.');
      return;
    }
    if (step === 2) {
      if (!recipientName.trim()) {
        setErrorMsg('Please enter the recipient’s name.');
        focusField('recipient-name');
        return;
      }
      if (!headline) {
        setHeadline(`Happy ${OCCASIONS.find((o) => o.id === occasion)?.label || 'Celebration'}, ${recipientName}!`);
      }
    }
    if (step === 3) {
      if (paragraphs.length === 0 || !paragraphs[0].trim()) {
        setErrorMsg('Please include at least one message paragraph.');
        focusField('message-paragraph-0');
        return;
      }
    }
    if (step === 4) {
      if (photos.length === 0) {
        setErrorMsg('Please add at least 1 photo for the memory showcase.');
        focusField('photo-upload-zone');
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 6));
  };

  const handleGenerate = async () => {
    setErrorMsg('');

    if (!recipientName.trim()) {
      setStep(2);
      setErrorMsg('Please enter the recipient’s name before publishing.');
      focusField('recipient-name');
      return;
    }
    if (paragraphs.length === 0 || !paragraphs.some((paragraph) => paragraph.trim())) {
      setStep(3);
      setErrorMsg('Please include at least one message paragraph before publishing.');
      focusField('message-paragraph-0');
      return;
    }
    if (photos.length === 0) {
      setStep(4);
      setErrorMsg('Please add at least 1 photo before publishing.');
      focusField('photo-upload-zone');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        recipientName: recipientName.trim(),
        recipientNickname: recipientNickname.trim() || undefined,
        occasion,
        relationship: relationship.trim() || 'Friend',
        ageOrYears: ageOrYears.trim() || undefined,
        language,
        template,
        status: 'published',
        revealAt: revealAt ? new Date(revealAt).toISOString() : undefined,
        passcode: passcode.trim() || undefined,
        headline: headline.trim() || `Happy ${occasion}, ${recipientName}!`,
        subheadline: subheadline.trim() || undefined,
        letterTitle: letterTitle.trim() || 'A Message From The Heart',
        paragraphs: paragraphs.filter((p) => p.trim().length > 0),
        secretNote: secretNote.trim() || undefined,
        timeline,
        photos,
        videos,
        audioTrack: {
          enabled: audioEnabled,
          name: selectedAudioTrack.name,
          url: selectedAudioTrack.url,
        },
        slug: customSlug.trim() || undefined,
      };

      const token = typeof window !== 'undefined' ? localStorage.getItem('wishly_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/pages', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create page');
      }

      const { page } = await res.json();
      try {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // Creation succeeded even if browser storage is unavailable.
      }
      router.push(`/create/${page.id}/review`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Failed to generate page. Please check your inputs.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const currentTheme = TEMPLATES[template];

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col [&_button:focus-visible]:outline-none [&_button:focus-visible]:ring-2 [&_button:focus-visible]:ring-amber-300 [&_input:focus-visible]:outline-none [&_input:focus-visible]:ring-2 [&_input:focus-visible]:ring-amber-400/30 [&_textarea:focus-visible]:outline-none [&_textarea:focus-visible]:ring-2 [&_textarea:focus-visible]:ring-amber-400/30">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Step {step} of {WIZARD_STEPS.length}
                </span>
                {draftStatus && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300" aria-live="polite">
                    <CheckCircle2 className="h-3 w-3" />
                    {draftStatus === 'restored' ? 'Draft restored' : 'Draft saved locally'}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {WIZARD_STEPS[step - 1].title}
              </h1>
            </div>

            <button
              onClick={() => setShowPhonePreview(!showPhonePreview)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-medium text-slate-300"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>{showPhonePreview ? 'Hide Preview' : 'Show Preview'}</span>
            </button>
          </div>

          {/* Progress Indicators */}
          <ol className="grid grid-cols-6 gap-1.5 sm:gap-2" aria-label="Creation progress">
            {WIZARD_STEPS.map((item) => {
              const isCurrent = item.id === step;
              const isComplete = item.id < step;
              return (
                <li key={item.id} aria-current={isCurrent ? 'step' : undefined} className="min-w-0">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isComplete || isCurrent ? 'bg-amber-400' : 'bg-white/10'
                    }`}
                  />
                  <span className={`mt-2 hidden truncate text-[10px] font-semibold sm:block ${isCurrent ? 'text-white' : isComplete ? 'text-amber-300' : 'text-slate-500'}`}>
                    {item.id}. {item.short}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Studio Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Area (7 Cols) */}
          <div ref={formPanelRef} className="lg:col-span-7 bg-slate-900/40 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
            {errorMsg && (
              <div role="alert" aria-live="assertive" className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-rose-400 shrink-0" aria-hidden="true" />
                {errorMsg}
              </div>
            )}

            {/* STEP 1: Occasion */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 mb-4">
                  Select the milestone to automatically customize the animations, decorations, and confetti.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {OCCASIONS.map((occ) => (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => setOccasion(occ.id)}
                      aria-pressed={occasion === occ.id}
                      className={`relative p-4 rounded-2xl border text-left transition flex items-start gap-3.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080c] ${
                        occasion === occ.id
                          ? 'border-amber-300 bg-amber-400/12 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/30'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      {occasion === occ.id && (
                        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-amber-300" aria-hidden="true" />
                      )}
                      <span className="text-3xl shrink-0">{occ.icon}</span>
                      <div>
                        <div className="text-sm font-bold text-white">{occ.label}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{occ.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Recipient */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    id="recipient-name"
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Priya Patel, Dr. Rohan, Samantha Miller"
                    aria-invalid={errorMsg.includes('recipient')}
                    aria-describedby={errorMsg.includes('recipient') ? 'recipient-name-error' : undefined}
                    className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/25 ${errorMsg.includes('recipient') ? 'border-rose-400' : 'border-white/10 focus:border-amber-400'}`}
                  />
                  {errorMsg.includes('recipient') && (
                    <p id="recipient-name-error" className="mt-1.5 text-[11px] text-rose-300">A recipient name is required to continue.</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nickname / Pet Name
                    </label>
                    <input
                      type="text"
                      value={recipientNickname}
                      onChange={(e) => setRecipientNickname(e.target.value)}
                      placeholder="e.g. Piyu, Champ, Sunshine"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Relationship
                    </label>
                    <input
                      type="text"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      placeholder="e.g. Best Friend, Soulmate, Sister"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Age / Milestone Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={ageOrYears}
                    onChange={(e) => setAgeOrYears(e.target.value)}
                    placeholder="e.g. 25th Birthday, 5th Anniversary, Class of 2026"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Message & Language */}
            {step === 3 && (
              <div className="space-y-4">
                {/* Language Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Celebration Language
                  </label>
                  <div className="flex gap-2">
                    {[
                      { id: 'en', label: 'English' },
                      { id: 'hi', label: 'हिंदी (Hindi)' },
                      { id: 'hinglish', label: 'Hinglish' },
                    ].map((lang) => (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => setLanguage(lang.id as LanguageType)}
                        aria-pressed={language === lang.id}
                        className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                          language === lang.id
                            ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Heartfelt Wish Wizard (Gemini AI Powered) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-cyan-500/10 border border-amber-400/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Wand2 className="h-4 w-4" />
                      <span>Gemini AI Heartfelt Story Wizard</span>
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30">
                      AI Powered
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Let AI craft a personalized celebration narrative tailored to {recipientName || 'your loved one'}.
                  </p>

                  {/* Tone selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Choose Tone:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: 'emotional', label: 'Emotional & Warm 🥺' },
                        { id: 'funny', label: 'Playful & Witty 😂' },
                        { id: 'poetic', label: 'Poetic & Romantic 🌹' },
                        { id: 'filmi', label: 'Bollywood & Filmi 🎬' },
                        { id: 'nostalgic', label: 'Nostalgic Throwback ☕' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setAiTone(t.id as typeof aiTone)}
                          aria-pressed={aiTone === t.id}
                          className={`px-2.5 py-1 rounded-lg text-[11px] transition ${
                            aiTone === t.id
                              ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Key memories prompt */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Memories / Inside Jokes (Optional):
                    </label>
                    <input
                      type="text"
                      value={aiMemories}
                      onChange={(e) => setAiMemories(e.target.value)}
                      placeholder="e.g. Late night chai, Goa roadtrip, always laughing at silly jokes"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateWithAi}
                    disabled={isGeneratingAi}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-amber-500/20 disabled:opacity-50"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{isGeneratingAi ? 'Writing Heartfelt Story with Gemini AI...' : '✨ Generate Story with Gemini AI'}</span>
                  </button>

                  {aiSuccessMsg && (
                    <div className="text-[11px] text-emerald-400 font-medium text-center">
                      {aiSuccessMsg}
                    </div>
                  )}
                </div>

                {/* Instant Templates / Presets */}
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block mb-1">
                    Or Use Quick-Fill Presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => applyMessagePreset('birthday-en')}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 transition"
                    >
                      🎂 English Birthday
                    </button>
                    <button
                      type="button"
                      onClick={() => applyMessagePreset('birthday-hi')}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-amber-300 font-hindi transition"
                    >
                      🪔 हिंदी जन्मदिन
                    </button>
                    <button
                      type="button"
                      onClick={() => applyMessagePreset('anniversary')}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-pink-300 transition"
                    >
                      💖 Romantic Anniversary
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder={`Happy Birthday, ${recipientName || 'Name'}!`}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Subheadline / Dedication
                  </label>
                  <input
                    type="text"
                    value={subheadline}
                    onChange={(e) => setSubheadline(e.target.value)}
                    placeholder="To the one who lights up every room..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Letter Title
                  </label>
                  <input
                    type="text"
                    value={letterTitle}
                    onChange={(e) => setLetterTitle(e.target.value)}
                    placeholder="A Message From The Heart"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Message Paragraphs
                    </label>
                    {paragraphs.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setParagraphs([''])}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Clear All</span>
                      </button>
                    )}
                  </div>
                  {paragraphs.map((p, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <textarea
                        id={`message-paragraph-${idx}`}
                        rows={3}
                        value={p}
                        onChange={(e) => {
                          const updated = [...paragraphs];
                          updated[idx] = e.target.value;
                          setParagraphs(updated);
                        }}
                        aria-invalid={idx === 0 && errorMsg.includes('paragraph')}
                        className={`flex-1 rounded-xl border bg-white/5 p-3 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/25 resize-none ${
                          idx === 0 && errorMsg.includes('paragraph') ? 'border-rose-400' : 'border-white/10'
                        } ${
                          language === 'hi' ? 'font-hindi' : ''
                        }`}
                      />
                      {paragraphs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setParagraphs(paragraphs.filter((_, i) => i !== idx))}
                          className="p-2 text-slate-400 hover:text-rose-400 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setParagraphs([...paragraphs, ''])}
                    className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Another Paragraph</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Final Secret Note (Revealed at Grand Finale)
                  </label>
                  <input
                    type="text"
                    value={secretNote}
                    onChange={(e) => setSecretNote(e.target.value)}
                    placeholder="A private emotional note or inside joke..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Media, Videos & Timeline */}
            {step === 4 && (
              <div className="space-y-6">
                {/* 1. Photos Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Photos ({photos.length} / 15)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSamplePhotos}
                      className="text-xs text-amber-400 hover:text-amber-300 transition"
                    >
                      + Add High-Res Photo Pack
                    </button>
                  </div>

                  {/* Photo Upload Zone */}
                  <label
                    id="photo-upload-zone"
                    htmlFor="photo-upload"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        document.getElementById('photo-upload')?.click();
                      }
                    }}
                    className={`block border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition bg-white/5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${errorMsg.includes('photo') ? 'border-rose-400' : 'border-white/15 hover:border-amber-400/50'}`}
                  >
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Upload className="h-7 w-7 text-slate-400 mx-auto mb-1.5" />
                    <span className="text-xs font-medium text-slate-200 block">
                      Click to upload photos from device
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      High-res PNG, JPG, WEBP formats supported
                    </span>
                    {errorMsg.includes('photo') && (
                      <span className="text-[11px] text-rose-300 block mt-2">Add at least one image to continue.</span>
                    )}
                  </label>

                  {/* Uploaded Photos Thumbnails */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                    {photos.map((ph, idx) => (
                      <div
                        key={ph.id || idx}
                        className="relative rounded-xl overflow-hidden aspect-square border border-white/10 group"
                      >
                        <img
                          src={ph.url}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                          className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/70 text-white opacity-0 group-hover:opacity-100 transition hover:bg-rose-600"
                          title="Delete photo"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. VIDEOS SECTION (User Request) */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Film className="h-4 w-4 text-amber-400" />
                      <label className="text-xs font-semibold text-slate-200">
                        Celebration Videos & Highlight Reels ({videos.length})
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSampleVideos}
                      className="text-xs text-amber-400 hover:text-amber-300 transition"
                    >
                      + Add Sample Video Pack
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    {/* Device Video Upload */}
                    <label className="border-2 border-dashed border-white/15 hover:border-amber-400/50 rounded-2xl p-4 text-center cursor-pointer transition bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                      <Film className="h-6 w-6 text-slate-400 mb-1" />
                      <span className="text-xs font-medium text-slate-200">
                        {isUploadingVideo ? 'Uploading Video...' : 'Upload Video File from Device'}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">MP4, WEBM, MOV</span>
                    </label>

                    {/* Web / YouTube Video Link Form */}
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                        <LinkIcon className="h-3 w-3 text-amber-400" />
                        <span>Add Video Link (YouTube or MP4):</span>
                      </span>
                      <input
                        type="url"
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=... or direct MP4 link"
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newVideoCaption}
                          onChange={(e) => setNewVideoCaption(e.target.value)}
                          placeholder="Caption / Memory title"
                          className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomVideoLink}
                          disabled={!newVideoUrl.trim()}
                          className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-bold text-xs transition cursor-pointer"
                        >
                          Add Video
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Videos List */}
                  {videos.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {videos.map((vid, idx) => (
                        <div
                          key={vid.id || idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-10 w-12 rounded-lg bg-black border border-white/10 flex items-center justify-center shrink-0">
                              <Film className="h-4 w-4 text-amber-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-white truncate">
                                {vid.caption || `Video #${idx + 1}`}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate max-w-xs">
                                {vid.url}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setVideos(videos.filter((_, i) => i !== idx))}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                            title="Delete video"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Timeline Milestones */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Memory Timeline Milestones
                    </label>
                    <button
                      type="button"
                      onClick={handleAddTimelineNode}
                      className="text-xs text-amber-400 hover:text-amber-300 transition"
                    >
                      + Add Milestone
                    </button>
                  </div>

                  <div className="space-y-3">
                    {timeline.map((node, idx) => (
                      <div
                        key={node.id || idx}
                        className="p-3.5 rounded-xl border border-white/10 bg-white/5 space-y-2 relative"
                      >
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={node.date}
                            onChange={(e) => {
                              const updated = [...timeline];
                              updated[idx].date = e.target.value;
                              setTimeline(updated);
                            }}
                            placeholder="Date or Year"
                            className="w-1/3 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={node.title}
                            onChange={(e) => {
                              const updated = [...timeline];
                              updated[idx].title = e.target.value;
                              setTimeline(updated);
                            }}
                            placeholder="Milestone Title"
                            className="w-2/3 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white"
                          />
                          {timeline.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setTimeline(timeline.filter((_, i) => i !== idx))}
                              className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                              title="Delete milestone"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={node.description}
                          onChange={(e) => {
                            const updated = [...timeline];
                            updated[idx].description = e.target.value;
                            setTimeline(updated);
                          }}
                          placeholder="Short story / sweet note"
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Style, Themes & Audio Studio */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-slate-400 mb-3">
                    Select one of 3 genuinely distinct visual themes. Each features tailored typography, color palettes, animations, and ambiance.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {TEMPLATE_OPTIONS.map((tmpl) => {
                      const preview = TEMPLATE_PREVIEWS[tmpl.id];
                      const isSelected = template === tmpl.id;
                      return (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() => setTemplate(tmpl.id)}
                          aria-pressed={isSelected}
                          className={`group overflow-hidden rounded-2xl border text-left transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080c] ${
                            isSelected
                              ? 'border-amber-300 bg-amber-400/10 shadow-lg shadow-amber-950/30 ring-1 ring-amber-300/30'
                              : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/25'
                          }`}
                        >
                          <div
                            className="relative h-24 overflow-hidden border-b border-white/10 p-3"
                            style={{ background: `${preview.pattern}, ${preview.background}` }}
                          >
                            <div className="absolute inset-x-5 top-4 h-px opacity-70" style={{ backgroundColor: preview.accent }} />
                            <div className="absolute bottom-3 left-3 right-3 rounded-lg border border-white/15 bg-black/25 p-2 backdrop-blur-sm">
                              <span className="block text-[8px] uppercase tracking-[0.18em]" style={{ color: preview.secondary }}>For someone special</span>
                              <span className={`mt-0.5 block truncate text-xs font-bold ${TEMPLATES[tmpl.id].fontHeading}`} style={{ color: preview.accent }}>
                                {recipientName || tmpl.name}
                              </span>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="absolute right-2.5 top-2.5 h-4 w-4 text-white drop-shadow" aria-hidden="true" />
                            )}
                          </div>
                          <div className="p-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-bold text-white">{tmpl.name}</span>
                              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: preview.accent }} aria-hidden="true" />
                            </div>
                            <span className="mt-1 block text-[9px] uppercase tracking-wider text-slate-400">{tmpl.previewBadge}</span>
                            <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{tmpl.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* AUDIO STUDIO: Sound Chosen at Random or Uploaded from Device */}
                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4 text-amber-400" />
                      <div>
                        <span className="text-xs font-bold text-white block">
                          Cinematic Ambient Celebration Sound
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Plays in background with un-mute toggle & volume control
                        </span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={audioEnabled}
                        onChange={(e) => setAudioEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
                    </label>
                  </div>

                  {audioEnabled && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3.5 backdrop-blur-xl">
                      {/* Top Action Row: Random Picker + Device Upload */}
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        {/* 🎲 Pick at Random Button */}
                        <button
                          type="button"
                          onClick={handleRandomSoundtrack}
                          className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                        >
                          <Shuffle className={`h-4 w-4 ${audioDiceRolling ? 'animate-spin' : ''}`} />
                          <span>🎲 Pick Soundtrack at Random</span>
                        </button>

                        {/* 📁 Upload Audio from Device */}
                        <label className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer">
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={handleAudioUpload}
                            className="hidden"
                          />
                          <Upload className="h-4 w-4 text-amber-400" />
                          <span>📁 Upload from Device (MP3/WAV)</span>
                        </label>
                      </div>

                      {/* Selected Track Status Bar */}
                      <div className="p-3 rounded-xl bg-black/40 border border-amber-400/30 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Volume2 className="h-4 w-4 text-amber-400 shrink-0 animate-pulse" />
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-mono text-amber-400 block tracking-wider">
                              Selected Audio Track:
                            </span>
                            <p className="text-xs font-bold text-white truncate">
                              {selectedAudioTrack.name}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleAudioPreview(selectedAudioTrack.url)}
                          className="py-1 px-3 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
                        >
                          {previewingAudioUrl === selectedAudioTrack.url ? (
                            <>
                              <Pause className="h-3 w-3" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-3 w-3 fill-current" />
                              <span>Preview</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Curated Soundtracks List */}
                      <div>
                        <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                          Or Choose from Curated Soundtracks:
                        </span>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {CURATED_SOUNDTRACKS.map((track) => (
                            <div
                              key={track.id}
                              role="radio"
                              aria-checked={selectedAudioTrack.url === track.url}
                              tabIndex={0}
                              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition cursor-pointer ${
                                selectedAudioTrack.url === track.url
                                  ? 'border-amber-400 bg-amber-400/15 text-white font-semibold'
                                  : 'border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-white/15'
                              }`}
                              onClick={() =>
                                setSelectedAudioTrack({ name: track.name, url: track.url })
                              }
                              onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault();
                                  setSelectedAudioTrack({ name: track.name, url: track.url });
                                }
                              }}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="truncate">{track.name}</span>
                                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-400 shrink-0">
                                  {track.genre}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleAudioPreview(track.url);
                                }}
                                className="p-1 rounded-md text-amber-400 hover:text-white transition"
                                title="Play preview"
                              >
                                {previewingAudioUrl === track.url ? (
                                  <Pause className="h-3.5 w-3.5 text-amber-300" />
                                ) : (
                                  <Play className="h-3.5 w-3.5 fill-current" />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 6: Privacy & Launch */}
            {step === 6 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Custom Unique URL Slug (Optional)
                  </label>
                  <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs">
                    <span className="text-slate-500">wishly.app/w/</span>
                    <input
                      type="text"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                      placeholder={`${recipientName ? recipientName.toLowerCase().replace(/\s+/g, '-') : 'special'}-${occasion}`}
                      className="flex-1 bg-transparent px-2 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-amber-400" />
                      <span>Schedule Reveal Date (Optional)</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={revealAt}
                      onChange={(e) => setRevealAt(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Content stays locked until this date/time.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-pink-400" />
                      <span>Secret Passcode (Optional)</span>
                    </label>
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="e.g. 1234 or inside joke"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Visitors will need this to unlock the page.
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-200">
                  ✨ <strong>Instant Permanent Link:</strong> Upon publishing, your site will be live immediately with high-speed 60fps animations, guest wishes wall, and interactive candle finale!
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-slate-300 hover:bg-white/10 transition flex items-center gap-1.5"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {step < 6 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <span>Continue</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleGenerate}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 text-sm font-extrabold transition flex items-center gap-2 cursor-pointer shadow-xl shadow-amber-500/30 disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{submitting ? 'Generating Celebration...' : 'Review & Publish Wish'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Live Phone Preview (5 Cols) */}
          {showPhonePreview && (
            <div className="lg:col-span-5 sticky top-24">
              <div className="flex items-center justify-between mb-3 px-2">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-amber-400" />
                  <span>Real-time Live Preview</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {template} · {occasion}
                </span>
              </div>

              {/* Realistic Mobile Device Frame */}
              <div className="mx-auto max-w-[340px] rounded-[42px] border-[10px] border-slate-800 bg-[#090a0f] shadow-2xl overflow-hidden relative aspect-[9/18]">
                {/* Speaker Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 h-3.5 w-24 rounded-full bg-slate-800 z-30" />

                {/* Simulated Screen Content */}
                <div
                  className={`h-full overflow-y-auto text-center select-none ${currentTheme.bgClass}`}
                  style={{ background: currentTheme.pageBackground }}
                >
                  <div className="relative min-h-[47%] overflow-hidden px-5 pb-5 pt-12 flex flex-col items-center justify-center">
                    <div
                      className="absolute inset-x-7 top-10 h-28 rounded-full blur-3xl opacity-30"
                      style={{ backgroundColor: currentTheme.palette.primary }}
                      aria-hidden="true"
                    />
                    <div
                      className="relative mb-3 grid h-10 w-10 place-items-center rounded-full border bg-black/20"
                      style={{ color: currentTheme.palette.primary, borderColor: `${currentTheme.palette.primary}66` }}
                      aria-hidden="true"
                    >
                      {occasion === 'birthday' ? (
                        <Cake className="h-5 w-5" />
                      ) : occasion === 'graduation' || occasion === 'milestone' ? (
                        <GraduationCap className="h-5 w-5" />
                      ) : occasion === 'anniversary' || occasion === 'love' ? (
                        <Heart className="h-5 w-5" />
                      ) : (
                        <Sparkles className="h-5 w-5" />
                      )}
                    </div>

                    <span className={`relative text-[9px] uppercase tracking-[0.2em] ${currentTheme.heroSubtext}`}>
                      {relationship || 'Friend'} · {ageOrYears || OCCASIONS.find((item) => item.id === occasion)?.label}
                    </span>

                    <h3 className={`relative mt-3 text-2xl font-bold leading-tight ${currentTheme.fontDisplay} ${currentTheme.textHeading}`}>
                      {headline || `Happy ${OCCASIONS.find((item) => item.id === occasion)?.label}, ${recipientName || 'Name'}!`}
                    </h3>

                    {subheadline && (
                      <p className={`relative mt-2 text-[11px] font-light italic ${currentTheme.heroSubtext}`}>
                        {subheadline}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 px-4 pb-6">
                    {/* Letter card preview */}
                    <div className={`rounded-2xl p-4 border ${currentTheme.cardBorder} ${currentTheme.cardBg} text-left`}>
                      <span className={`text-[10px] font-semibold block mb-1 ${currentTheme.textHeading}`}>
                        {letterTitle}
                      </span>
                      <p className={`text-[11px] leading-relaxed line-clamp-4 ${currentTheme.textBody}`}>
                        {paragraphs.find((paragraph) => paragraph.trim()) || 'Your heartfelt letter preview here...'}
                      </p>
                    </div>

                    {timeline.length > 0 && (
                      <div className="rounded-2xl border border-white/10 bg-black/15 p-3 text-left">
                        <span className="text-[9px] uppercase tracking-[0.16em]" style={{ color: currentTheme.palette.primary }}>Memory timeline</span>
                        <div className="mt-2 border-l pl-3" style={{ borderColor: `${currentTheme.palette.primary}66` }}>
                          <p className="text-[9px] opacity-60">{timeline[0].date}</p>
                          <p className="text-[11px] font-semibold text-white">{timeline[0].title}</p>
                        </div>
                      </div>
                    )}

                    {photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-1.5" aria-label={`${photos.length} photo preview`}>
                        {photos.slice(0, 3).map((photo, index) => (
                          <div key={photo.id || index} className={`overflow-hidden border border-white/10 ${template === 'pastel-dream' ? 'rounded-2xl even:translate-y-2' : template === 'royal-gold' ? 'rounded-sm p-1 bg-amber-50/90' : 'rounded-lg'}`}>
                            <img
                              src={photo.url}
                              alt={photo.caption || `Memory ${index + 1}`}
                              loading="lazy"
                              decoding="async"
                              className="aspect-[3/4] h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {videos.length > 0 && (
                      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-3 text-left">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ backgroundColor: currentTheme.palette.primary, color: '#080a10' }}>
                          <Play className="h-3.5 w-3.5 fill-current" />
                        </span>
                        <div className="min-w-0">
                          <span className="block text-[9px] uppercase tracking-wider text-slate-400">Video memory</span>
                          <span className="block truncate text-[11px] text-white">{videos[0].caption || 'Personal highlight'}</span>
                        </div>
                      </div>
                    )}

                    <div className={`rounded-2xl border p-3 text-center ${currentTheme.cardBorder} ${currentTheme.cardBg}`}>
                      <Cake className="mx-auto h-5 w-5" style={{ color: currentTheme.palette.primary }} aria-hidden="true" />
                      <span className="text-[10px] text-slate-300 block mt-1">
                        Interactive finale · wishes · keepsake
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
