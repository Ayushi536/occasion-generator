'use client';

import { motion } from 'motion/react';
import { Calendar, Sparkles } from 'lucide-react';
import { WishPage } from '@/lib/types';
import { TEMPLATES } from './theme-config';

interface MemoryTimelineProps {
  page: WishPage;
}

export default function MemoryTimeline({ page }: MemoryTimelineProps) {
  const theme = TEMPLATES[page.template];

  if (!page.timeline || page.timeline.length === 0) return null;

  return (
    <section className="relative py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Chapters of Us</span>
        </div>
        <h2 className={`text-3xl sm:text-4xl font-extrabold text-white ${theme.fontHeading}`}>
          Memory Timeline
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
          Every milestone, laughter-filled roadtrip, and quiet conversation along the way.
        </p>
      </div>

      {/* Timeline spine */}
      <div className="relative border-l-2 border-white/10 ml-4 sm:ml-32 md:ml-1/2 space-y-12 sm:space-y-16">
        {page.timeline.map((item, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative pl-8 sm:pl-10"
            >
              {/* Glowing Timeline Marker Node */}
              <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-slate-900 bg-amber-400 shadow-[0_0_10px_rgba(245,197,24,0.8)]" />

              {/* Memory Card */}
              <div
                className={`rounded-2xl p-6 border ${theme.cardBorder} ${theme.cardBg} transition-all`}
              >
                {/* Date header */}
                <div className="flex items-center gap-2 text-xs font-medium text-amber-400 mb-2">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{item.date}</span>
                </div>

                <h3 className={`text-lg sm:text-xl font-bold text-white mb-2 ${theme.fontHeading}`}>
                  {item.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {item.description}
                </p>

                {item.photoUrl && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-white/10 aspect-video relative group">
                    <img
                      src={item.photoUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
