'use client';

import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, Download, Mail } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { GitHubIcon, InstagramIcon, LinkedInIcon, XIcon } from '@/components/icons/SocialIcons';
import SceneCanvas from '@/components/3d/SceneCanvas';
import SignalCore from '@/components/3d/SignalCore';
import { CANONICAL_NAME, DEFAULT_TITLE, parseSocialLinks } from '@/lib/site';
import type { Profile } from '@/lib/types';

interface HeroSectionProps {
  profile: Profile | null;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const socials = parseSocialLinks(profile?.socialLinks);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
    >
      {/* Background: animated gradient orbs */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div
          className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full bg-accent-light blur-[120px]"
          style={{ animation: 'float 8s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-[10%] right-[8%] w-[450px] h-[450px] rounded-full bg-blue-light blur-[120px]"
          style={{ animation: 'float 10s ease-in-out infinite reverse' }}
        />
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center py-20">
        {/* —— Left: text —— */}
        <div>
          {/* Above-the-fold entrance animations are CSS (see .hero-rise in
              globals.css) rather than Framer Motion: they run on first paint
              instead of waiting for the client bundle to hydrate, which keeps
              the hero — and the LCP element with it — out of the JS critical
              path. Below-the-fold reveals still use Framer Motion. */}
          <div className="mb-6 hero-rise">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-accent-muted border border-accent bg-accent-light">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Available for Projects
            </span>
          </div>

          {/* The role lives *inside* the h1 so the page's primary heading
              carries the actual positioning ("Amal Anilkumar — Full-Stack and
              AI Product Engineer") rather than just a greeting. The role is a
              block-level span styled exactly like the old <p>, so the rendered
              layout is unchanged. */}
          <h1
            style={{ '--hero-delay': '0.1s' } as React.CSSProperties}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-primary mb-2 hero-rise-lcp"
          >
            Hi, I&apos;m{' '}
            <span className="gradient-text">{profile?.name ?? CANONICAL_NAME}</span>
            <span className="block text-xl sm:text-2xl font-medium text-secondary mt-4 leading-normal">
              {profile?.title ?? DEFAULT_TITLE}
              {profile?.location && (
                <span className="text-base ml-3 text-muted">📍 {profile.location}</span>
              )}
            </span>
          </h1>

          <p
            style={{ '--hero-delay': '0.25s' } as React.CSSProperties}
            className="text-sm font-medium tracking-widest text-accent uppercase mb-6 hero-rise"
          >
            Product Builder · Full-Stack Engineer · Problem Solver
          </p>

          <p
            style={{ '--hero-delay': '0.3s' } as React.CSSProperties}
            className="text-secondary text-base md:text-lg max-w-xl mb-10 leading-relaxed hero-rise"
          >
            {profile?.bio ??
              'Passionate about a world where tech and nature thrive together.'}
          </p>

          {/* CTAs */}
          <div
            style={{ '--hero-delay': '0.4s' } as React.CSSProperties}
            className="flex flex-wrap gap-4 mb-10 hero-rise"
          >
            <Link
              href="#contact"
              className="gradient-bg px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-lg shadow-accent hover:opacity-90 hover:-translate-y-0.5 transition-all"
            >
              Let&apos;s Work Together
            </Link>
            <Link
              href="#projects"
              className="glass px-6 py-3 rounded-xl text-secondary font-semibold text-sm hover:border-accent hover:text-primary hover:-translate-y-0.5 transition-all"
            >
              View My Work
            </Link>
            {profile?.resumeUrl && (
              <a
                href={profile.resumeUrl}
                download
                onClick={() => trackEvent('resume_click', { location: 'hero' })}
                className="glass px-6 py-3 rounded-xl text-secondary font-semibold text-sm flex items-center gap-2 hover:border-accent hover:text-primary hover:-translate-y-0.5 transition-all"
              >
                <Download size={15} /> Resume
              </a>
            )}
          </div>

          {/* Social icons */}
          <div
            style={{ '--hero-delay': '0.5s' } as React.CSSProperties}
            className="flex flex-wrap gap-3 hero-rise"
          >
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl text-secondary text-sm hover:text-primary hover:border-accent transition-all"
              >
                <Mail size={15} /> {profile.email}
              </a>
            )}
            {socials.github && (
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                onClick={() => trackEvent('github_click', { location: 'hero' })}
                className="p-2.5 glass rounded-xl text-secondary hover:text-primary hover:border-accent transition-all"
              >
                <GitHubIcon width={18} height={18} />
              </a>
            )}
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                onClick={() => trackEvent('linkedin_click', { location: 'hero' })}
                className="p-2.5 glass rounded-xl text-secondary hover:text-primary hover:border-blue-400 transition-all"
              >
                <LinkedInIcon width={18} height={18} />
              </a>
            )}
            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                onClick={() => trackEvent('x_click', { location: 'hero' })}
                className="p-2.5 glass rounded-xl text-secondary hover:text-primary hover:border-sky-400 transition-all"
              >
                <XIcon width={18} height={18} />
              </a>
            )}
            {socials.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                onClick={() => trackEvent('instagram_click', { location: 'hero' })}
                className="p-2.5 glass rounded-xl text-secondary hover:text-primary hover:border-pink-400 transition-all"
              >
                <InstagramIcon width={18} height={18} />
              </a>
            )}
          </div>
        </div>

        {/* —— Right: avatar —— */}
        <div
          style={{ '--hero-delay': '0.2s' } as React.CSSProperties}
          className="flex justify-center lg:justify-end hero-pop"
        >
          <div className="relative">
            {/* Signal Core: interactive 3D lattice, static glow fallback when
                3D is disabled/unsupported/reduced-motion — same footprint. */}
            <SceneCanvas
              className="absolute -inset-20 sm:-inset-28"
              cameraPosition={[0, 0, 6.5]}
              fallback={<div className="absolute -inset-4 gradient-bg rounded-full blur-3xl opacity-15" />}
            >
              <SignalCore scrollProgress={scrollYProgress} />
            </SceneCanvas>

            {/* Avatar */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-accent glow-purple">
              {profile?.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={`${profile.name} — ${profile.title ?? DEFAULT_TITLE}`}
                  fill
                  // Above the fold and the largest paint candidate on the
                  // homepage: preload it and cap the request at its rendered
                  // size (w-64 mobile / md:w-80) instead of the 100vw default.
                  priority
                  sizes="(max-width: 768px) 256px, 320px"
                  className="object-cover"
                />
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
              <span className="text-success">• </span>
              <span className="text-secondary">Available for Projects</span>
            </motion.div>

            {/* Floating badge 2 */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-6 bottom-16 glass rounded-xl px-3 py-2 text-xs font-medium whitespace-nowrap shadow-lg"
            >
              <span className="text-accent">⚡ </span>
              <span className="text-secondary">Product Builder</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted"
      >
        <ArrowDown size={22} />
      </motion.div>
    </section>
  );
}



