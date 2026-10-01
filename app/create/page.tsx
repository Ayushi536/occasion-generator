'use client';

import { useState, useRef } from 'react';
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

  const handleNextStep = () => {
    setErrorMsg('');
    if (step === 1 && !occasion) {
      setErrorMsg('Please select an occasion.');
      return;
    }
    if (step === 2) {
      if (!recipientName.trim()) {
        setErrorMsg('Please enter the recipient’s name.');
        return;
      }
      if (!headline) {
        setHeadline(`Happy ${OCCASIONS.find((o) => o.id === occasion)?.label || 'Celebration'}, ${recipientName}!`);
      }
    }
    if (step === 3) {
      if (paragraphs.length === 0 || !paragraphs[0].trim()) {
        setErrorMsg('Please include at least one message paragraph.');
        return;
      }
    }
    if (step === 4) {
      if (photos.length === 0) {
        setErrorMsg('Please add at least 1 photo for the memory showcase.');
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 6));
  };

  const handleGenerate = async () => {
    setErrorMsg('');
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
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Step {step} of 6
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {step === 1 && 'Choose the Occasion'}
                {step === 2 && 'Who is this Celebration For?'}
                {step === 3 && 'Heartfelt Words & Language'}
                {step === 4 && 'Memory Photos & Moments'}
                {step === 5 && 'Visual Style & Atmosphere'}
                {step === 6 && 'Privacy, Timing & Launch'}
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
          <div className="grid grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-amber-400' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Studio Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Area (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/40 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
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
                      className={`p-4 rounded-2xl border text-left transition flex items-start gap-3.5 cursor-pointer ${
                        occasion === occ.id
                          ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-500/5'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
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
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Priya Patel, Dr. Rohan, Samantha Miller"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
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
                        rows={3}
                        value={p}
                        onChange={(e) => {
                          const updated = [...paragraphs];
                          updated[idx] = e.target.value;
                          setParagraphs(updated);
                        }}
                        className={`flex-1 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none resize-none ${
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
                  <label className="block border-2 border-dashed border-white/15 hover:border-amber-400/50 rounded-2xl p-5 text-center cursor-pointer transition bg-white/5 hover:bg-white/10">
                    <input
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

                  <div className="space-y-3">
                    {TEMPLATE_OPTIONS.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => setTemplate(tmpl.id)}
                        className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                          template === tmpl.id
                            ? 'border-amber-400 bg-amber-400/10 shadow-lg'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{tmpl.name}</span>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                              {tmpl.previewBadge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 max-w-md">{tmpl.desc}</p>
                        </div>
                        <div
                          className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                            template === tmpl.id ? 'border-amber-400 bg-amber-400' : 'border-white/20'
                          }`}
                        >
                          {template === tmpl.id && <div className="h-2 w-2 rounded-full bg-slate-950" />}
                        </div>
                      </button>
                    ))}
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
                              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition cursor-pointer ${
                                selectedAudioTrack.url === track.url
                                  ? 'border-amber-400 bg-amber-400/15 text-white font-semibold'
                                  : 'border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-white/15'
                              }`}
                              onClick={() =>
                                setSelectedAudioTrack({ name: track.name, url: track.url })
                              }
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
                  className={`h-full overflow-y-auto p-4 pt-10 text-center select-none ${currentTheme.bgClass}`}
                >
                  {/* Floating Deco */}
                  <div className="text-2xl mb-2 animate-bounce">
                    {occasion === 'birthday' ? '🎂' : occasion === 'anniversary' ? '💖' : '✨'}
                  </div>

                  <span className="text-[10px] uppercase tracking-wider text-slate-400">
                    {relationship || 'Friend'} · {ageOrYears || 'Celebration'}
                  </span>

                  <h3
                    className={`text-xl font-bold mt-2 leading-tight ${currentTheme.fontDisplay} ${
                      template === 'neon-night'
                        ? 'text-cyan-300 neon-glow-cyan'
                        : template === 'royal-gold'
                        ? 'gold-gradient-text'
                        : 'text-white'
                    }`}
                  >
                    {headline || `Happy Celebration, ${recipientName || 'Name'}!`}
                  </h3>

                  {subheadline && (
                    <p className="text-[11px] text-slate-300 mt-2 font-light italic">
                      {subheadline}
                    </p>
                  )}

                  {/* Letter card preview */}
                  <div
                    className={`mt-4 rounded-xl p-3 border ${currentTheme.cardBorder} ${currentTheme.cardBg} text-left`}
                  >
                    <span className="text-[10px] text-amber-400 font-semibold block mb-1">
                      {letterTitle}
                    </span>
                    <p className="text-[11px] text-slate-200 line-clamp-3">
                      {paragraphs[0] || 'Your heartfelt letter preview here...'}
                    </p>
                  </div>

                  {/* Photo Preview */}
                  {photos[0] && (
                    <div className="mt-3 rounded-xl overflow-hidden aspect-video border border-white/10">
                      <img
                        src={photos[0].url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* Interactive Cake/Finale preview */}
                  <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-lg">🕯️🎂🕯️</span>
                    <span className="text-[10px] text-slate-300 block mt-1">
                      Interactive Candle Blow Finale Included
                    </span>
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
