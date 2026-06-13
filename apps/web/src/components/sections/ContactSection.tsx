'use client';

import { useState } from 'react';
import { Mail, Send, GitFork, Globe, X, MapPin } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { submitContact } from '@/lib/api';
import type { Profile, SocialLinks } from '@/lib/types';

interface ContactSectionProps {
  profile: Profile | null;
}

const initialForm = { name: '', email: '', phone: '', subject: '', message: '' };

export default function ContactSection({ profile }: ContactSectionProps) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

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
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Email</p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-sm text-slate-300 hover:text-purple-400 transition-colors"
                  >
                    {profile.email}
                  </a>
                  {profile.alternateEmail && (
                    <a
                      href={`mailto:${profile.alternateEmail}`}
                      className="block text-sm text-slate-400 hover:text-purple-400 transition-colors mt-0.5"
                    >
                      {profile.alternateEmail}
                    </a>
                  )}
                </div>
              </GlassCard>
            )}

            {profile?.location && (
              <GlassCard hover={false} className="flex items-center gap-4">
                <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">
                    Location
                  </p>
                  <p className="text-sm text-slate-300">{profile.location}</p>
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
                  className="p-3 glass rounded-xl text-slate-400 hover:text-white hover:border-purple-500/30 transition-all"
                >
                  <GitFork size={20} />
                </a>
              )}
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 glass rounded-xl text-slate-400 hover:text-white hover:border-blue-500/30 transition-all"
                >
                  <Globe size={20} />
                </a>
              )}
              {socials.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 glass rounded-xl text-slate-400 hover:text-white hover:border-sky-500/30 transition-all"
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
                <h3 className="text-xl font-bold text-slate-100 mb-2">Message Sent!</h3>
                <p className="text-slate-400 text-sm">
                  Thanks for reaching out. I&apos;ll get back to you shortly.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                      Name *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full glass rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full glass rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                    Subject *
                  </label>
                  <input
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Project inquiry"
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project..."
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-400 text-xs">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full gradient-bg py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
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
