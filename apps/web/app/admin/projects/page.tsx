'use client';

import { useEffect, useState } from 'react';
import AdminCard from '@/components/admin/AdminCard';
import AdminTable from '@/components/admin/AdminTable';
import { projectsApi, Project } from '@/lib/admin-api';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

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
    } catch (error) {
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
    } catch (error) {
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
              className="w-12 h-12 object-cover rounded-lg"
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
      key: 'description',
      header: 'Description',
      render: (item: Project) => (
        <p className="text-sm line-clamp-2">{item.description}</p>
      ),
    },
    {
      key: 'published',
      header: 'Status',
      render: (item: Project) => (
        <span
          className={`px-2 py-1 rounded-lg text-xs font-medium ${
            item.published
              ? 'bg-green-500/10 text-green-500'
              : 'bg-yellow-500/10 text-yellow-500'
          }`}
        >
          {item.published ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'featured',
      header: 'Featured',
      render: (item: Project) => (
        <span className="text-sm">{item.featured ? '⭐' : '-'}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Projects</h1>
          <p className="text-muted mt-1">Manage your portfolio projects</p>
        </div>
        <Link href="/admin/projects/new">
          <button className="px-6 py-3 gradient-bg rounded-xl text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-accent">
            <Plus size={18} />
            New Project
          </button>
        </Link>
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
        <AdminTable
          data={projects}
          columns={columns}
          emptyMessage="No projects yet. Create your first project!"
          actions={(item) => (
            <div className="flex items-center justify-end gap-2">
              <Link href={`/admin/projects/${item.id}`}>
                <button className="px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors flex items-center gap-1">
                  <Pencil size={14} />
                  Edit
                </button>
              </Link>
              <button
                onClick={() => handleDelete(item)}
                className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-1"
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
