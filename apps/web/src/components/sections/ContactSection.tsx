'use client';

import { useState } from 'react';
import { Mail, Send, GitFork, Globe, X, MapPin, Phone, MessageCircle } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { submitContact } from '@/lib/api';
import type { Profile, SocialLinks } from '@/lib/types';

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

function getWhatsAppUrl(raw: string): string {
  return `https://wa.me/${raw}`;
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
  const waUrl = getWhatsAppUrl(phoneInfo.raw);
  const telUrl = `tel:${phoneInfo.display}`;

  const socials: SocialLinks = (() => {
    try {
      return profile?.socialLinks ? JSON.parse(profile.socialLinks) : {};
    } catch {
      return {};
    }
  })();

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
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className="max-w-7xl mx-auto px-6 py-24">
      <div className="w-full h-px gradient-bg opacity-20 mb-24" />

      <AnimatedSection>
        <SectionHeader
          label="Get In Touch"
          title="Let's Build Something"
          subtitle="Have a project in mind? I'd love to hear about it. Drop me a message and I'll get back to you."
        />
      </AnimatedSection>

      {/* Prominent WhatsApp + Call CTAs */}
      <AnimatedSection className="mb-10" direction="up">
        <div className="grid sm:grid-cols-2 gap-4">
          {/* WhatsApp CTA */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl p-[1px] focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-background"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-4 rounded-2xl bg-background/90 px-6 py-5 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25 shrink-0">
                <MessageCircle size={24} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wider font-medium mb-0.5">WhatsApp</p>
                <p className="text-sm font-semibold text-primary group-hover:text-green-500 transition-colors">
                  Message on WhatsApp
                </p>
                <p className="text-xs text-muted">{phoneInfo.display}</p>
              </div>
            </div>
          </a>

          {/* Call CTA */}
          <a
            href={telUrl}
            className="group relative overflow-hidden rounded-2xl p-[1px] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent via-purple-500 to-accent-muted opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-4 rounded-2xl bg-background/90 px-6 py-5 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center shadow-lg shadow-accent/25 shrink-0">
                <Phone size={24} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wider font-medium mb-0.5">Direct Call</p>
                <p className="text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                  Call Directly
                </p>
                <p className="text-xs text-muted">{phoneInfo.display}</p>
              </div>
            </div>
          </a>
        </div>
      </AnimatedSection>

      <div className="grid lg:grid-cols-5 gap-10">
        {/* Contact info */}
        <AnimatedSection className="lg:col-span-2" direction="left">
          <div className="space-y-6">
            {profile?.email && (
              <GlassCard hover={false} className="flex items-center gap-4">
                <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider mb-0.5">Email</p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-sm text-secondary hover:text-accent transition-colors"
                  >
                    {profile.email}
                  </a>
                  {profile.alternateEmail && (
                    <a
                      href={`mailto:${profile.alternateEmail}`}
                      className="block text-sm text-secondary hover:text-accent transition-colors mt-0.5"
                    >
                      {profile.alternateEmail}
                    </a>
                  )}
                </div>
              </GlassCard>
            )}

            <GlassCard hover={false} className="flex items-center gap-4">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shrink-0">
                <Phone size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-0.5">Phone</p>
                <a href={telUrl} className="text-sm text-secondary hover:text-accent transition-colors">
                  {phoneInfo.display}
                </a>
              </div>
            </GlassCard>

            {profile?.location && (
              <GlassCard hover={false} className="flex items-center gap-4">
                <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider mb-0.5">
                    Location
                  </p>
                  <p className="text-sm text-secondary">{profile.location}</p>
                </div>
              </GlassCard>
            )}

            {/* Social links */}
            <div className="flex gap-3 flex-wrap">
              {socials.GitFork && (
                <a
                  href={socials.GitFork}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 glass rounded-xl text-secondary hover:text-primary hover:border-accent transition-all"
                >
                  <GitFork size={20} />
                </a>
              )}
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 glass rounded-xl text-secondary hover:text-primary hover:border-blue-400 transition-all"
                >
                  <Globe size={20} />
                </a>
              )}
              {socials.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 glass rounded-xl text-secondary hover:text-primary hover:border-sky-400 transition-all"
                >
                  <X size={20} />
                </a>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* Form */}
        <AnimatedSection className="lg:col-span-3" direction="right">
          <GlassCard hover={false} className="p-8">
            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">Message Sent!</h3>
                <p className="text-secondary text-sm">
                  Thanks for reaching out. I&apos;ll get back to you shortly.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-sm text-accent hover:text-accent-muted transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-secondary mb-1.5 font-medium">
                      Name *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full glass rounded-xl px-4 py-3 text-sm text-primary placeholder-slate-600 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-secondary mb-1.5 font-medium">
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full glass rounded-xl px-4 py-3 text-sm text-primary placeholder-slate-600 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-secondary mb-1.5 font-medium">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 7594919014"
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-primary placeholder-slate-600 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-secondary mb-1.5 font-medium">
                    Subject *
                  </label>
                  <input
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Project inquiry"
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-primary placeholder-slate-600 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-secondary mb-1.5 font-medium">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project..."
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-primary placeholder-slate-600 focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-600 dark:text-red-400 text-xs">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full gradient-bg py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent"
                >
                  {status === 'loading' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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


