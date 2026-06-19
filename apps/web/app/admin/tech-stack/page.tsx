'use client';

import { useEffect, useState } from 'react';
import AdminCard from '@/components/admin/AdminCard';
import AdminTable from '@/components/admin/AdminTable';
import { techStackApi, TechStack } from '@/lib/admin-api';
import { Plus, X } from 'lucide-react';

export default function TechStackPage() {
  const [techStack, setTechStack] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<TechStack>>({ order: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchTechStack();
  }, []);

  const fetchTechStack = async () => {
    try {
      const data = await techStackApi.getAll();
      setTechStack(data.sort((a, b) => a.order - b.order));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load tech stack' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (editingId) {
        const updated = await techStackApi.update(editingId, formData);
        setTechStack(techStack.map((t) => (t.id === editingId ? updated : t)));
        setMessage({ type: 'success', text: 'Tech stack updated successfully' });
      } else {
        const created = await techStackApi.create(formData);
        setTechStack([...techStack, created]);
        setMessage({ type: 'success', text: 'Tech stack created successfully' });
      }
      resetForm();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save tech stack' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (tech: TechStack) => {
    setFormData(tech);
    setEditingId(tech.id);
    setShowForm(true);
  };

  const handleDelete = async (tech: TechStack) => {
    if (!confirm(`Delete "${tech.name}"?`)) return;

    try {
      await techStackApi.delete(tech.id);
      setTechStack(techStack.filter((t) => t.id !== tech.id));
      setMessage({ type: 'success', text: 'Tech stack deleted successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete tech stack' });
    }
  };

  const resetForm = () => {
    setFormData({ order: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  const columns = [
    { key: 'name', header: 'Technology' },
    { key: 'category', header: 'Category' },
    {
      key: 'iconUrl',
      header: 'Icon',
      render: (item: TechStack) =>
        item.iconUrl ? (
          <img src={item.iconUrl} alt={item.name} className="w-8 h-8 object-contain" />
        ) : (
          '-'
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
          <h1 className="text-3xl font-bold text-primary">Tech Stack</h1>
          <p className="text-muted mt-1">Manage your technology stack</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 gradient-bg rounded-xl text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-accent"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'New Technology'}
        </button>
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

      {showForm && (
        <AdminCard title={editingId ? 'Edit Technology' : 'New Technology'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-secondary mb-1.5 font-medium">Name</label>
                <input
                  required
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                  placeholder="e.g., React, TypeScript"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1.5 font-medium">Category</label>
                <input
                  required
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                  placeholder="e.g., Frontend, Backend, Database"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1.5 font-medium">Icon URL (Optional)</label>
                <input
                  type="url"
                  value={formData.iconUrl || ''}
                  onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                  placeholder="https://example.com/icon.svg"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1.5 font-medium">Order</label>
                <input
                  required
                  type="number"
                  value={formData.order || 0}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 glass rounded-xl text-secondary font-medium hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 gradient-bg rounded-xl text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-accent"
              >
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </AdminCard>
      )}

      <AdminCard>
        <AdminTable
          data={techStack}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No technologies yet. Add your tech stack!"
        />
      </AdminCard>
    </div>
  );
}
