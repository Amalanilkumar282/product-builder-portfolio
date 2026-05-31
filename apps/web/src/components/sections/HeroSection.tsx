'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, Download, GitFork, Globe, X, Mail } from 'lucide-react';
import type { Profile, SocialLinks } from '@/lib/types';

interface HeroSectionProps {
  profile: Profile | null;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const socials: SocialLinks = (() => {
    try {
      return profile?.socialLinks ? JSON.parse(profile.socialLinks) : {};
    } catch {
      return {};
    }
  })();

  const firstName = profile?.name?.split(' ')[0] ?? 'Amal';

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
    >
      {/* Background: animated gradient orbs */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div
          className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px]"
          style={{ animation: 'float 8s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-[10%] right-[8%] w-[450px] h-[450px] rounded-full bg-blue-500/10 blur-[120px]"
          style={{ animation: 'float 10s ease-in-out infinite reverse' }}
        />
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center py-20">
        {/* ── Left: text ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-purple-300 border border-purple-500/30 bg-purple-500/10">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Available for work
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-slate-100 mb-4"
          >
            Hi, I&apos;m{' '}
            <span className="gradient-text">{profile?.name ?? 'Amal Anilkumar'}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-xl sm:text-2xl font-medium text-slate-400 mb-6"
          >
            {profile?.title ?? 'Software Engineer'}
            {profile?.location && (
              <span className="text-base ml-3 text-slate-500">📍 {profile.location}</span>
            )}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="text-slate-400 text-base md:text-lg max-w-xl mb-10 leading-relaxed"
          >
            {profile?.bio ??
              'Passionate about a world where tech and nature thrive together.'}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            <Link
              href="#contact"
              className="gradient-bg px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-lg shadow-purple-500/25 hover:opacity-90 hover:-translate-y-0.5 transition-all"
            >
              Let&apos;s Work Together
            </Link>
            <Link
              href="#projects"
              className="glass px-6 py-3 rounded-xl text-slate-300 font-semibold text-sm hover:border-purple-500/30 hover:text-white hover:-translate-y-0.5 transition-all"
            >
              View My Work
            </Link>
            {profile?.resumeUrl && (
              <a
                href={profile.resumeUrl}
                download
                className="glass px-6 py-3 rounded-xl text-slate-400 font-semibold text-sm flex items-center gap-2 hover:border-purple-500/30 hover:text-white hover:-translate-y-0.5 transition-all"
              >
                <Download size={15} /> Resume
              </a>
            )}
          </motion.div>

          {/* Social icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl text-slate-400 text-sm hover:text-white hover:border-purple-500/30 transition-all"
              >
                <Mail size={15} /> {profile.email}
              </a>
            )}
            {socials.GitFork && (
              <a
                href={socials.GitFork}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 glass rounded-xl text-slate-400 hover:text-white hover:border-purple-500/30 transition-all"
              >
                <GitFork size={18} />
              </a>
            )}
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 glass rounded-xl text-slate-400 hover:text-white hover:border-blue-500/30 transition-all"
              >
                <Globe size={18} />
              </a>
            )}
            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 glass rounded-xl text-slate-400 hover:text-white hover:border-sky-500/30 transition-all"
              >
                <X size={18} />
              </a>
            )}
          </motion.div>
        </div>

        {/* ── Right: avatar ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center lg:justify-end"
        >
          <div className="relative">
            {/* Outer glow ring */}
            <div className="absolute -inset-4 gradient-bg rounded-full blur-3xl opacity-15" />

            {/* Avatar */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-purple-500/30 glow-purple">
              {profile?.avatarUrl ? (
                <Image src={profile.avatarUrl} alt={profile.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full gradient-bg flex items-center justify-center text-white text-7xl font-bold select-none">
                  {(profile?.name ?? 'A').charAt(0)}
                </div>
              )}
            </div>

            {/* Floating badge 1 */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-6 top-12 glass rounded-xl px-3 py-2 text-xs font-medium whitespace-nowrap shadow-lg"
            >
              <span className="text-green-400">● </span>
              <span className="text-slate-300">Open to work</span>
            </motion.div>

            {/* Floating badge 2 */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-6 bottom-16 glass rounded-xl px-3 py-2 text-xs font-medium whitespace-nowrap shadow-lg"
            >
              <span className="text-blue-400">⚡ </span>
              <span className="text-slate-300">Full-Stack Dev</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-600"
      >
        <ArrowDown size={22} />
      </motion.div>
    </section>
  );
}
