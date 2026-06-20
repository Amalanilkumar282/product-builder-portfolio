'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminCard from '@/components/admin/AdminCard';
import ImageUpload from '@/components/ui/ImageUpload';
import { projectsApi, Project } from '@/lib/admin-api';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProjectFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';

  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    slug: '',
    summary: '',
    coverImageUrl: '',
    demoUrl: '',
    githubUrl: '',
    featured: false,
    isPublished: false,
    order: 0,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!isNew) {
      fetchProject();
    }
  }, [params.id]);

  const fetchProject = async () => {
    try {
      const data = await projectsApi.getById(params.id as string);
      setFormData(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load project' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      if (isNew) {
        await projectsApi.create(formData);
        setMessage({ type: 'success', text: 'Project created!' });
      } else {
        await projectsApi.update(params.id as string, formData);
        setMessage({ type: 'success', text: 'Project updated!' });
      }
      setTimeout(() => router.push('/admin/projects'), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to ${isNew ? 'create' : 'update'} project` });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Project, value: any) => {
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
        <Link href="/admin/projects">
          <button className="p-2 hover:bg-accent/10 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-primary">{isNew ? 'New' : 'Edit'} Project</h1>
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
              <label className="block text-sm font-medium mb-2">Summary *</label>
              <textarea
              value={formData.summary || ''}
              onChange={(e) => handleChange('summary', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-accent outline-none"
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
              <label className="block text-sm font-medium mb-2">Demo URL</label>
              <input
                type="url"
                value={formData.demoUrl || ''}
                onChange={(e) => handleChange('demoUrl', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">GitHub URL</label>
              <input
                type="url"
                value={formData.githubUrl || ''}
                onChange={(e) => handleChange('githubUrl', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-accent outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Order</label>
              <input
                type="number"
                value={formData.order || 0}
                onChange={(e) => handleChange('order', parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-accent outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) => handleChange('featured', e.target.checked)}
                className="w-5 h-5 rounded border-border text-accent focus:ring-accent"
              />
              <label className="text-sm font-medium">Featured</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isPublished || false}
                onChange={(e) => handleChange('isPublished', e.target.checked)}
                className="w-5 h-5 rounded border-border text-accent focus:ring-accent"
              />
              <label className="text-sm font-medium">Published</label>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/admin/projects">
              <button className="px-6 py-3 rounded-xl border border-border hover:bg-accent/10 transition-colors">
                Cancel
              </button>
            </Link>
            <button
              onClick={handleSave}
              disabled={saving || !formData.title || !formData.slug || !formData.summary}
              className="px-6 py-3 gradient-bg rounded-xl text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
