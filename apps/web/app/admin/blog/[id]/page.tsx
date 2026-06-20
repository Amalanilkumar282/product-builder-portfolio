'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminCard from '@/components/admin/AdminCard';
import ImageUpload from '@/components/ui/ImageUpload';
import { blogApi, BlogPost } from '@/lib/admin-api';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BlogFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImageUrl: '',
    published: false,
    publishedAt: '',
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!isNew) {
      fetchPost();
    }
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const data = await blogApi.getById(params.id as string);
      setFormData(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load blog post' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      if (isNew) {
        await blogApi.create(formData);
        setMessage({ type: 'success', text: 'Post created!' });
      } else {
        await blogApi.update(params.id as string, formData);
        setMessage({ type: 'success', text: 'Post updated!' });
      }
      setTimeout(() => router.push('/admin/blog'), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to ${isNew ? 'create' : 'update'} post` });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof BlogPost, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog">
          <button className="p-2 hover:bg-accent/10 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-primary">{isNew ? 'New' : 'Edit'} Blog Post</h1>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-2xl p-4 ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/20 text-green-500'
              : 'bg-red-500/10 border border-red-500/20 text-red-500'
          }`}
        >
          {message.text}
        </div>
      )}

      <AdminCard>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-accent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-accent outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Excerpt *</label>
            <textarea
              value={formData.excerpt || ''}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-accent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            <textarea
              value={formData.content || ''}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={12}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-accent outline-none font-mono text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cover Image</label>
            {isNew ? (
              <input
                type="url"
                value={formData.coverImageUrl || ''}
                onChange={(e) => handleChange('coverImageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-accent outline-none"
              />
            ) : (
              <ImageUpload
                entityType="project"
                entityId={params.id as string}
                currentImageUrl={formData.coverImageUrl}
                onUploadSuccess={(url: string) => handleChange('coverImageUrl', url)}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Published Date</label>
              <input
                type="datetime-local"
                value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().slice(0, 16) : ''}
                onChange={(e) => handleChange('publishedAt', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-accent outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.published || false}
                onChange={(e) => handleChange('published', e.target.checked)}
                className="w-5 h-5 rounded border-border text-accent focus:ring-accent"
              />
              <label className="text-sm font-medium">Published</label>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/admin/blog">
              <button className="px-6 py-3 rounded-xl border border-border hover:bg-accent/10 transition-colors">
                Cancel
              </button>
            </Link>
            <button
              onClick={handleSave}
              disabled={saving || !formData.title || !formData.slug || !formData.excerpt || !formData.content}
              className="px-6 py-3 gradient-bg rounded-xl text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
