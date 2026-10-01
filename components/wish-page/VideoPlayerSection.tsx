'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Film, Play, Volume2, Sparkles, ExternalLink } from 'lucide-react';
import { WishPage, VideoItem } from '@/lib/types';
import { TEMPLATES } from './theme-config';

interface VideoPlayerSectionProps {
  page: WishPage;
}

export default function VideoPlayerSection({ page }: VideoPlayerSectionProps) {
  const theme = TEMPLATES[page.template];

  // If page.videos is empty, provide a default celebration highlight reel so the section is always alive
  const defaultVideos: VideoItem[] = [
    {
      id: 'default_v1',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-friends-celebrating-with-sparklers-at-night-42862-large.mp4',
      caption: `Festive Sparkler Celebration for ${page.recipientName}`,
    },
  ];

  const videos = page.videos && page.videos.length > 0 ? page.videos : defaultVideos;

  // Convert youtube watch links to embed links if necessary
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 max-w-5xl mx-auto overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
          <Film className="h-4 w-4" />
          <span>Cinematic Video Reel</span>
        </div>
        <h2 className={`text-3xl sm:text-5xl font-extrabold text-white ${theme.fontHeading} tracking-tight`}>
          Living Video Memories
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
          Relive our favorite shared moments, candid laughter, and celebration milestones captured on video.
        </p>
      </div>

      <div className={`grid gap-8 relative z-10 ${videos.length === 1 ? 'grid-cols-1 max-w-3xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
        {videos.map((video, idx) => {
          const embedUrl = getEmbedUrl(video.url);

          return (
            <motion.div
              key={video.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className={`rounded-3xl overflow-hidden border ${theme.cardBorder} ${theme.cardBg} p-2 sm:p-3 shadow-2xl backdrop-blur-xl group hover:border-amber-400/50 transition-all duration-300`}
            >
              {/* Video Player Frame with Hollywood Border */}
              <div className="aspect-video relative rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={video.caption || 'Celebration Video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <video
                    src={video.url}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Video Caption & Timestamp */}
              <div className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-mono text-amber-400 block tracking-wider">
                    Chapter Reel #{idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-white truncate">
                    {video.caption || `Unforgettable Memory with ${page.recipientName}`}
                  </p>
                </div>

                <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
                  <Play className="h-3.5 w-3.5 fill-current" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
