'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AdminCard from '@/components/admin/AdminCard';
import AdminTable from '@/components/admin/AdminTable';
import { projectsApi, Project } from '@/lib/admin-api';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectsApi.getAll();
      setProjects(data.sort((a, b) => a.order - b.order));
    } catch {
      setMessage({ type: 'error', text: 'Failed to load projects' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (project: Project) => {
    if (!confirm(`Are you sure you want to delete "${project.title}"?`)) return;

    try {
      await projectsApi.delete(project.id);
      setProjects(projects.filter((p) => p.id !== project.id));
      setMessage({ type: 'success', text: 'Project deleted successfully' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete project' });
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (item: Project) => (
        <div className="flex items-center gap-3">
          {item.coverImageUrl && (
            <img
              src={item.coverImageUrl}
              alt={item.title}
              className="h-12 w-12 rounded-lg object-cover"
            />
          )}
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-xs text-muted">{item.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'summary',
      header: 'Summary',
      render: (item: Project) => <p className="line-clamp-2 text-sm">{item.summary}</p>,
    },
    {
      key: 'isPublished',
      header: 'Status',
      render: (item: Project) => (
        <span
          className={`rounded-lg px-2 py-1 text-xs font-medium ${
            item.isPublished
              ? 'bg-green-500/10 text-green-500'
              : 'bg-yellow-500/10 text-yellow-500'
          }`}
        >
          {item.isPublished ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'featured',
      header: 'Featured',
      render: (item: Project) => <span className="text-sm">{item.featured ? '⭐' : '-'}</span>,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Projects</h1>
          <p className="mt-1 text-muted">Manage your portfolio projects</p>
        </div>
        <Link href="/admin/projects/new">
          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-accent transition-all hover:opacity-90">
            <Plus size={18} />
            New Project
          </button>
        </Link>
      </div>

      {message && (
        <div
          className={`rounded-2xl p-4 ${
            message.type === 'success'
              ? 'border border-green-500/20 bg-green-500/10 text-green-500'
              : 'border border-red-500/20 bg-red-500/10 text-red-500'
          }`}
        >
          {message.text}
        </div>
      )}

      <AdminCard>
        <AdminTable
          data={projects}
          columns={columns}
          emptyMessage="No projects yet. Create your first project!"
          actions={(item) => (
            <div className="flex items-center justify-end gap-2">
              <Link href={`/admin/projects/${item.id}`}>
                <button className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/10">
                  <Pencil size={14} />
                  Edit
                </button>
              </Link>
              <button
                onClick={() => handleDelete(item)}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        />
      </AdminCard>
    </div>
  );
}
