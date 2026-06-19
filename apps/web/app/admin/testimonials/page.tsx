'use client';

import { useEffect, useState } from 'react';
import AdminCard from '@/components/admin/AdminCard';
import AdminTable from '@/components/admin/AdminTable';
import { testimonialsApi, Testimonial } from '@/lib/admin-api';
import { Plus, X } from 'lucide-react';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Testimonial>>({ rating: 5, order: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await testimonialsApi.getAll();
      setTestimonials(data.sort((a, b) => a.order - b.order));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load testimonials' });
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
        const updated = await testimonialsApi.update(editingId, formData);
        setTestimonials(testimonials.map((t) => (t.id === editingId ? updated : t)));
        setMessage({ type: 'success', text: 'Testimonial updated successfully' });
      } else {
        const created = await testimonialsApi.create(formData);
        setTestimonials([...testimonials, created]);
        setMessage({ type: 'success', text: 'Testimonial created successfully' });
      }
      resetForm();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save testimonial' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setFormData(testimonial);
    setEditingId(testimonial.id);
    setShowForm(true);
  };

  const handleDelete = async (testimonial: Testimonial) => {
    if (!confirm(`Delete testimonial from "${testimonial.name}"?`)) return;

    try {
      await testimonialsApi.delete(testimonial.id);
      setTestimonials(testimonials.filter((t) => t.id !== testimonial.id));
      setMessage({ type: 'success', text: 'Testimonial deleted successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete testimonial' });
    }
  };

  const resetForm = () => {
    setFormData({ rating: 5, order: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (item: Testimonial) => (
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-xs text-muted">{item.position} at {item.company}</p>
        </div>
      ),
    },
    {
      key: 'content',
      header: 'Testimonial',
      render: (item: Testimonial) => <p className="text-sm line-clamp-2">{item.content}</p>,
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (item: Testimonial) => (
        <span className="text-sm">{'⭐'.repeat(item.rating)}</span>
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
          <h1 className="text-3xl font-bold text-primary">Testimonials</h1>
          <p className="text-muted mt-1">Manage client testimonials</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 gradient-bg rounded-xl text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-accent"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'New Testimonial'}
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
        <AdminCard title={editingId ? 'Edit Testimonial' : 'New Testimonial'}>
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
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1.5 font-medium">Position</label>
                <input
                  required
                  type="text"
                  value={formData.position || ''}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1.5 font-medium">Company</label>
                <input
                  required
                  type="text"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1.5 font-medium">Rating</label>
                <select
                  required
                  value={formData.rating || 5}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                >
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {'⭐'.repeat(r)} ({r} stars)
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-secondary mb-1.5 font-medium">Testimonial Content</label>
                <textarea
                  required
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1.5 font-medium">Avatar URL (Optional)</label>
                <input
                  type="url"
                  value={formData.avatarUrl || ''}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                  placeholder="https://example.com/avatar.jpg"
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
          data={testimonials}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No testimonials yet. Add your first testimonial!"
        />
      </AdminCard>
    </div>
  );
}
