'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import AdminCard from '@/components/admin/AdminCard';
import ImageUpload from '@/components/ui/ImageUpload';
import { projectsApi, type Project } from '@/lib/admin-api';

/** Mirrors the API's validation so the form can warn before a 400 comes back. */
const LIMITS = {
  title: [3, 120],
  summary: [10, 300],
  content: [50, 10000],
  seoTitle: [3, 70],
  seoDescription: [10, 160],
} as const;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function toArray(value: string[] | string | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed as string[];
    } catch {
      /* fall through to the comma-separated reading below */
    }
    return value.split(',').map((v) => v.trim()).filter(Boolean);
  }
  return [];
}

export default function ProjectFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';

  const [form, setForm] = useState<Partial<Project>>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    featured: false,
    isPublished: false,
    order: 0,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  );

  const load = useCallback(async () => {
    try {
      setForm(await projectsApi.getById(id));
    } catch {
      setMessage({ type: 'error', text: 'Failed to load project.' });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isNew) void load();
  }, [isNew, load]);

  function set<K extends keyof Project>(field: K, value: Project[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  /** Blank optional strings must be omitted, not sent as "" — the API's
   *  @Length validators reject an empty string but accept an absent key. */
  function buildPayload(): Partial<Project> {
    const payload: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(form)) {
      if (['id', 'createdAt', 'updatedAt', 'tags', 'techStacks'].includes(key)) continue;
      if (typeof value === 'string' && value.trim() === '') continue;
      if (value === null || value === undefined) continue;
      payload[key] = value;
    }
    payload.gallery = toArray(form.gallery);
    payload.relatedServiceSlugs = toArray(form.relatedServiceSlugs);
    return payload as Partial<Project>;
  }

  const slugValid = !form.slug || SLUG_PATTERN.test(form.slug);
  const contentLength = form.content?.length ?? 0;
  const contentValid = contentLength >= LIMITS.content[0] && contentLength <= LIMITS.content[1];

  const canSave =
    Boolean(form.title && form.slug && form.summary) && slugValid && contentValid && !saving;

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const payload = buildPayload();
      if (isNew) {
        const created = await projectsApi.create(payload);
        setMessage({ type: 'success', text: 'Project created.' });
        // Redirect to the real id so uploads have an entity to attach to.
        router.replace(`/admin/projects/${created.id}`);
      } else {
        await projectsApi.update(id, payload);
        setMessage({ type: 'success', text: 'Project updated. The live site is refreshing.' });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Save failed.',
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="py-12 text-center text-secondary">Loading…</p>;
  }

  const input =
    'w-full rounded-md border border-default bg-background px-3 py-2.5 text-sm text-primary';
  const labelCls = 'mb-1.5 block text-sm font-medium text-primary';

  const gallery = toArray(form.gallery);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/projects"
          className="inline-flex size-11 items-center justify-center rounded-md hover:bg-accent-light"
          aria-label="Back to projects"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-3xl font-bold text-primary">{isNew ? 'New' : 'Edit'} project</h1>
      </div>

      {message && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-md border p-4 text-sm ${
            message.type === 'success'
              ? 'border-success/40 text-success'
              : 'border-red-500/40 text-red-500'
          }`}
        >
          {message.text}
        </div>
      )}

      <AdminCard>
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-primary">Basics</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="title" className={labelCls}>
                Title *
              </label>
              <input
                id="title"
                className={input}
                value={form.title ?? ''}
                onChange={(e) => set('title', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="slug" className={labelCls}>
                Slug *
              </label>
              <input
                id="slug"
                className={input}
                value={form.slug ?? ''}
                onChange={(e) => set('slug', e.target.value)}
                aria-invalid={!slugValid}
                aria-describedby="slug-help"
              />
              <p id="slug-help" className="mt-1 text-xs text-muted">
                {slugValid ? 'Lowercase, hyphen-separated.' : 'Must be lowercase and hyphen-separated.'}
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="summary" className={labelCls}>
              Summary * <span className="text-muted">({form.summary?.length ?? 0}/300)</span>
            </label>
            <textarea
              id="summary"
              rows={2}
              className={input}
              value={form.summary ?? ''}
              onChange={(e) => set('summary', e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="content" className={labelCls}>
              Body (markdown) *{' '}
              <span className={contentValid ? 'text-muted' : 'text-red-500'}>
                ({contentLength}/10000, minimum 50)
              </span>
            </label>
            <textarea
              id="content"
              rows={12}
              className={`${input} font-mono`}
              value={form.content ?? ''}
              onChange={(e) => set('content', e.target.value)}
              aria-invalid={!contentValid}
            />
            {/* The API requires this field and the previous form had no input
                for it, so creating a project from the admin always 400'd. */}
            <p className="mt-1 text-xs text-muted">
              Supports headings, lists, links, bold, code and blockquotes.
            </p>
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-primary">Links</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="demoUrl" className={labelCls}>
                Live demo URL
              </label>
              <input
                id="demoUrl"
                type="url"
                placeholder="https://example.com"
                className={input}
                value={form.demoUrl ?? ''}
                onChange={(e) => set('demoUrl', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="githubUrl" className={labelCls}>
                Repository URL
              </label>
              <input
                id="githubUrl"
                type="url"
                placeholder="https://github.com/user/repo"
                className={input}
                value={form.githubUrl ?? ''}
                onChange={(e) => set('githubUrl', e.target.value)}
              />
              <p className="mt-1 text-xs text-muted">
                Adding this also lists the project on /open-source.
              </p>
            </div>
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-primary">Case study detail</h2>
          <p className="text-sm text-secondary">
            These fill the metadata rail and narrative sections on the public project page.
            Leave any of them blank and that block simply is not rendered.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {(
              [
                ['role', 'Your role'],
                ['clientName', 'Client'],
                ['duration', 'Duration'],
                ['status', 'Status'],
                ['industry', 'Industry'],
                ['stackSummary', 'Stack summary'],
              ] as const
            ).map(([field, label]) => (
              <div key={field}>
                <label htmlFor={field} className={labelCls}>
                  {label}
                </label>
                <input
                  id={field}
                  className={input}
                  value={(form[field] as string) ?? ''}
                  onChange={(e) => set(field, e.target.value)}
                />
              </div>
            ))}
          </div>

          {(
            [
              ['challenge', 'The challenge'],
              ['approach', 'Approach'],
              ['outcome', 'Outcome'],
            ] as const
          ).map(([field, label]) => (
            <div key={field}>
              <label htmlFor={field} className={labelCls}>
                {label} <span className="text-muted">(markdown, min 10 chars if used)</span>
              </label>
              <textarea
                id={field}
                rows={4}
                className={input}
                value={(form[field] as string) ?? ''}
                onChange={(e) => set(field, e.target.value)}
              />
            </div>
          ))}

          <div>
            <label htmlFor="metrics" className={labelCls}>
              Results / metrics
            </label>
            <textarea
              id="metrics"
              rows={2}
              className={input}
              value={form.metrics ?? ''}
              onChange={(e) => set('metrics', e.target.value)}
            />
            <p className="mt-1 text-xs text-muted">
              Rendered as a highlighted panel. Use real, verifiable numbers.
            </p>
          </div>

          <div>
            <label htmlFor="relatedServiceSlugs" className={labelCls}>
              Related service slugs
            </label>
            <input
              id="relatedServiceSlugs"
              className={input}
              placeholder="full-stack-web-development, backend-api-architecture"
              value={toArray(form.relatedServiceSlugs).join(', ')}
              onChange={(e) => set('relatedServiceSlugs', e.target.value.split(',').map((v) => v.trim()).filter(Boolean))}
            />
            <p className="mt-1 text-xs text-muted">
              Comma-separated. Leave blank to infer related services from shared tags.
            </p>
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-primary">Media</h2>

          {isNew ? (
            <p className="text-sm text-secondary">
              Save the project first — uploads need a record to attach to.
            </p>
          ) : (
            <>
              <ImageUpload
                target="project_cover"
                entityId={id}
                label="Cover image"
                currentUrl={form.coverImageUrl}
                onUploadSuccess={(url) => set('coverImageUrl', url)}
              />

              <div>
                <ImageUpload
                  target="project_gallery"
                  entityId={id}
                  label="Add a gallery image"
                  onUploadSuccess={(url) => set('gallery', [...gallery, url])}
                />
                {gallery.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {gallery.map((src) => (
                      <li key={src} className="flex items-center gap-2 text-xs text-muted">
                        <span className="min-w-0 flex-1 truncate">{src}</span>
                        <button
                          type="button"
                          onClick={() =>
                            set(
                              'gallery',
                              gallery.filter((item) => item !== src),
                            )
                          }
                          aria-label="Remove this gallery image"
                          className="inline-flex size-11 items-center justify-center rounded-md hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </AdminCard>

      <AdminCard>
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-primary">SEO &amp; publishing</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="seoTitle" className={labelCls}>
                SEO title <span className="text-muted">({form.seoTitle?.length ?? 0}/70)</span>
              </label>
              <input
                id="seoTitle"
                className={input}
                value={form.seoTitle ?? ''}
                onChange={(e) => set('seoTitle', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="seoDescription" className={labelCls}>
                SEO description{' '}
                <span className="text-muted">({form.seoDescription?.length ?? 0}/160)</span>
              </label>
              <input
                id="seoDescription"
                className={input}
                value={form.seoDescription ?? ''}
                onChange={(e) => set('seoDescription', e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div>
              <label htmlFor="order" className={labelCls}>
                Order
              </label>
              <input
                id="order"
                type="number"
                min={0}
                className={`${input} w-28`}
                value={form.order ?? 0}
                onChange={(e) => set('order', Number(e.target.value))}
              />
            </div>

            <label className="inline-flex min-h-11 items-center gap-2 text-sm text-primary">
              <input
                type="checkbox"
                checked={form.featured ?? false}
                onChange={(e) => set('featured', e.target.checked)}
              />
              Featured
            </label>

            <label className="inline-flex min-h-11 items-center gap-2 text-sm text-primary">
              <input
                type="checkbox"
                checked={form.isPublished ?? false}
                onChange={(e) => set('isPublished', e.target.checked)}
              />
              Published
            </label>
          </div>
        </div>
      </AdminCard>

      <button
        type="button"
        onClick={handleSave}
        disabled={!canSave}
        className="inline-flex min-h-11 items-center gap-2 rounded-md gradient-bg px-5 text-sm font-medium disabled:opacity-50"
      >
        <Save size={16} aria-hidden="true" />
        {saving ? 'Saving…' : isNew ? 'Create project' : 'Save changes'}
      </button>
    </div>
  );
}
