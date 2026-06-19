'use client';

import { useEffect, useState } from 'react';
import AdminCard from '@/components/admin/AdminCard';
import AdminTable from '@/components/admin/AdminTable';
import { awardsApi, Award } from '@/lib/admin-api';
import { Plus, X } from 'lucide-react';

export default function AwardsPage() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Award>>({ order: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const data = await awardsApi.getAll();
      setAwards(data.sort((a, b) => a.order - b.order));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load awards' });
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
        const updated = await awardsApi.update(editingId, formData);
        setAwards(awards.map((a) => (a.id === editingId ? updated : a)));
        setMessage({ type: 'success', text: 'Award updated successfully' });
      } else {
        const created = await awardsApi.create(formData);
        setAwards([...awards, created]);
        setMessage({ type: 'success', text: 'Award created successfully' });
      }
      resetForm();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save award' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (award: Award) => {
    setFormData(award);
    setEditingId(award.id);
    setShowForm(true);
  };

  const handleDelete = async (award: Award) => {
    if (!confirm(`Delete "${award.title}"?`)) return;

    try {
      await awardsApi.delete(award.id);
      setAwards(awards.filter((a) => a.id !== award.id));
      setMessage({ type: 'success', text: 'Award deleted successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete award' });
    }
  };

  const resetForm = () => {
    setFormData({ order: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  const columns = [
    { key: 'title', header: 'Award Title' },
    { key: 'issuer', header: 'Issued By' },
    {
      key: 'date',
      header: 'Date',
      render: (item: Award) => new Date(item.date).toLocaleDateString(),
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
          <h1 className="text-3xl font-bold text-primary">Awards</h1>
          <p className="text-muted mt-1">Manage your awards and certifications</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 gradient-bg rounded-xl text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-accent"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'New Award'}
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
        <AdminCard title={editingId ? 'Edit Award' : 'New Award'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-secondary mb-1.5 font-medium">Award Title</label>
                <input
                  required
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1.5 font-medium">Issued By</label>
                <input
                  required
                  type="text"
                  value={formData.issuer || ''}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1.5 font-medium">Date</label>
                <input
                  required
                  type="date"
                  value={formData.date?.split('T')[0] || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
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
              <div className="md:col-span-2">
                <label className="block text-xs text-secondary mb-1.5 font-medium">Description (Optional)</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors resize-none"
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
          data={awards}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No awards yet. Add your achievements!"
        />
      </AdminCard>
    </div>
  );
}
