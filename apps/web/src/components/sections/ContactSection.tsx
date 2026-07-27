'use client';

import { useState } from 'react';
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeader from '@/components/ui/SectionHeader';
import SectionConnector from '@/components/ui/SectionConnector';
import { trackEvent } from '@/lib/analytics';
import { GitHubIcon, InstagramIcon, LinkedInIcon, XIcon } from '@/components/icons/SocialIcons';
import { submitContact } from '@/lib/api';
import { parseSocialLinks } from '@/lib/site';
import type { Profile } from '@/lib/types';

const DEFAULT_CONTACT_PHONE = '+91 7594919014';
const DEFAULT_CONTACT_PHONE_RAW = '917594919014';

function getPhoneFromProfile(profile: Profile | null): { display: string; raw: string } {
  const raw = profile?.phone ?? process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '';
  if (!raw) return { display: DEFAULT_CONTACT_PHONE, raw: DEFAULT_CONTACT_PHONE_RAW };

  const cleaned = raw.replace(/[^0-9]/g, '');
  if (cleaned.length === 10 && !raw.startsWith('91')) {
    return { display: `+91 ${cleaned}`, raw: `91${cleaned}` };
  }

  return {
    display: raw.startsWith('+') ? raw : `+${raw}`,
    raw: cleaned.startsWith('91') ? cleaned : `91${cleaned}`,
  };
}

interface ContactSectionProps {
  profile: Profile | null;
}

const initialForm = { name: '', email: '', phone: '', subject: '', message: '' };

export default function ContactSection({ profile }: ContactSectionProps) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const phoneInfo = getPhoneFromProfile(profile);
  const socials = parseSocialLinks(profile?.socialLinks);
  const waUrl = socials.whatsapp ?? `https://wa.me/${phoneInfo.raw}`;
  const telUrl = `tel:+${phoneInfo.raw}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      await submitContact({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        subject: form.subject,
        message: form.message,
      });

      trackEvent('contact_form_submit', { location: 'contact_section' });
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-24">
      <SectionConnector className="mb-24" />

      <AnimatedSection>
        <SectionHeader
          label="Get In Touch"
          title="Let's Build Something"
          subtitle="Have a project in mind? Share the brief, the timeline, and the outcome you need."
        />
      </AnimatedSection>

      <AnimatedSection className="mb-10" direction="up">
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { location: 'contact_section' })}
            className="group relative overflow-hidden rounded-2xl p-[1px] focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-background"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 opacity-80 transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-center gap-4 rounded-2xl bg-background/90 px-6 py-5 backdrop-blur-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-500/25">
                <MessageCircle size={24} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <p className="mb-0.5 text-xs font-medium uppercase tracking-wider text-muted">
                  WhatsApp
                </p>
                <p className="text-sm font-semibold text-primary transition-colors group-hover:text-green-500">
                  Message on WhatsApp
                </p>
                <p className="text-xs text-muted">{phoneInfo.display}</p>
              </div>
            </div>
          </a>

          <a
            href={telUrl}
            onClick={() => trackEvent('call_click', { location: 'contact_section' })}
            className="group relative overflow-hidden rounded-2xl p-[1px] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent via-purple-500 to-accent-muted opacity-80 transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-center gap-4 rounded-2xl bg-background/90 px-6 py-5 backdrop-blur-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-purple-600 shadow-lg shadow-accent/25">
                <Phone size={24} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <p className="mb-0.5 text-xs font-medium uppercase tracking-wider text-muted">
                  Direct Call
                </p>
                <p className="text-sm font-semibold text-primary transition-colors group-hover:text-accent">
                  Call Directly
                </p>
                <p className="text-xs text-muted">{phoneInfo.display}</p>
              </div>
            </div>
          </a>
        </div>
      </AnimatedSection>

      <div className="grid gap-10 lg:grid-cols-5">
        <AnimatedSection className="lg:col-span-2" direction="left">
          <div className="space-y-6">
            {profile?.email && (
              <GlassCard hover={false} className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-bg">
                  <Mail size={18} className="text-white" />
                </div>
                <div>
                  <p className="mb-0.5 text-xs uppercase tracking-wider text-muted">Email</p>
                  <a
                    href={`mailto:${profile.email}`}
                    onClick={() => trackEvent('email_click', { location: 'contact_section' })}
                    className="text-sm text-secondary transition-colors hover:text-accent"
                  >
                    {profile.email}
                  </a>
                  {profile.alternateEmail && (
                    <a
                      href={`mailto:${profile.alternateEmail}`}
                      onClick={() =>
                        trackEvent('email_click', { location: 'contact_section_alternate' })
                      }
                      className="mt-0.5 block text-sm text-secondary transition-colors hover:text-accent"
                    >
                      {profile.alternateEmail}
                    </a>
                  )}
                </div>
              </GlassCard>
            )}

            <GlassCard hover={false} className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-bg">
                <Phone size={18} className="text-white" />
              </div>
              <div>
                <p className="mb-0.5 text-xs uppercase tracking-wider text-muted">Phone</p>
                <a
                  href={telUrl}
                  onClick={() => trackEvent('call_click', { location: 'contact_card' })}
                  className="text-sm text-secondary transition-colors hover:text-accent"
                >
                  {phoneInfo.display}
                </a>
              </div>
            </GlassCard>

            {profile?.location && (
              <GlassCard hover={false} className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-bg">
                  <MapPin size={18} className="text-white" />
                </div>
                <div>
                  <p className="mb-0.5 text-xs uppercase tracking-wider text-muted">Location</p>
                  <p className="text-sm text-secondary">{profile.location}</p>
                </div>
              </GlassCard>
            )}

            <div className="flex flex-wrap gap-3">
              {socials.github && (
                <a
                  href={socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  onClick={() => trackEvent('github_click', { location: 'contact_section' })}
                  className="glass rounded-xl p-3 text-secondary transition-all hover:border-accent hover:text-primary"
                >
                  <GitHubIcon width={20} height={20} />
                </a>
              )}
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  onClick={() => trackEvent('linkedin_click', { location: 'contact_section' })}
                  className="glass rounded-xl p-3 text-secondary transition-all hover:border-blue-400 hover:text-primary"
                >
                  <LinkedInIcon width={20} height={20} />
                </a>
              )}
              {socials.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  onClick={() => trackEvent('x_click', { location: 'contact_section' })}
                  className="glass rounded-xl p-3 text-secondary transition-all hover:border-sky-400 hover:text-primary"
                >
                  <XIcon width={20} height={20} />
                </a>
              )}
              {socials.instagram && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  onClick={() => trackEvent('instagram_click', { location: 'contact_section' })}
                  className="glass rounded-xl p-3 text-secondary transition-all hover:border-pink-400 hover:text-primary"
                >
                  <InstagramIcon width={20} height={20} />
                </a>
              )}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="lg:col-span-3" direction="right">
          <GlassCard hover={false} className="p-8">
            {status === 'success' ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full gradient-bg">
                  <Send size={28} className="text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-primary">Message Sent</h3>
                <p className="text-sm text-secondary">
                  Thanks for reaching out. Expect a reply shortly.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-sm text-accent transition-colors hover:text-accent-muted"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-secondary">
                      Name *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full rounded-xl px-4 py-3 text-sm text-primary glass placeholder-slate-600 transition-colors focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-secondary">
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full rounded-xl px-4 py-3 text-sm text-primary glass placeholder-slate-600 transition-colors focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-secondary">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 7594919014"
                    className="w-full rounded-xl px-4 py-3 text-sm text-primary glass placeholder-slate-600 transition-colors focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-secondary">
                    Subject *
                  </label>
                  <input
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Project inquiry"
                    className="w-full rounded-xl px-4 py-3 text-sm text-primary glass placeholder-slate-600 transition-colors focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-secondary">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project, goals, and timeline."
                    className="w-full resize-none rounded-xl px-4 py-3 text-sm text-primary glass placeholder-slate-600 transition-colors focus:border-accent focus:outline-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white gradient-bg shadow-lg shadow-accent transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </GlassCard>
        </AnimatedSection>
      </div>
    </section>
  );
}
