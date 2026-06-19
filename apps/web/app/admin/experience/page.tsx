'use client';

import { useEffect, useState } from 'react';
import AdminCard from '@/components/admin/AdminCard';
import AdminTable from '@/components/admin/AdminTable';
import { experienceApi, Experience } from '@/lib/admin-api';
import { Plus, X } from 'lucide-react';

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Experience>>({ current: false, order: 0, type: 'Full-time' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const data = await experienceApi.getAll();
      setExperiences(data.sort((a, b) => a.order - b.order));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load experience' });
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
        const updated = await experienceApi.update(editingId, formData);
        setExperiences(experiences.map((exp) => (exp.id === editingId ? updated : exp)));
        setMessage({ type: 'success', text: 'Experience updated successfully' });
      } else {
        const created = await experienceApi.create(formData);
        setExperiences([...experiences, created]);
        setMessage({ type: 'success', text: 'Experience created successfully' });
      }
      resetForm();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save experience' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (exp: Experience) => {
    setFormData(exp);
    setEditingId(exp.id);
    setShowForm(true);
  };

  const handleDelete = async (exp: Experience) => {
    if (!confirm(`Delete experience at "${exp.company}"?`)) return;

    try {
      await experienceApi.delete(exp.id);
      setExperiences(experiences.filter((e) => e.id !== exp.id));
      setMessage({ type: 'success', text: 'Experience deleted successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete experience' });
    }
  };

  const resetForm = () => {
    setFormData({ current: false, order: 0, type: 'Full-time' });
    setEditingId(null);
    setShowForm(false);
  };

  const columns = [
    {
      key: 'position',
      header: 'Position',
      render: (item: Experience) => (
        <div>
          <p className="font-medium">{item.position}</p>
          <p className="text-xs text-muted">{item.company}</p>
        </div>
      ),
    },
    { key: 'type', header: 'Type' },
    {
      key: 'startDate',
      header: 'Period',
      render: (item: Experience) => (
        <span className="text-sm">
          {new Date(item.startDate).getFullYear()} - {item.current ? 'Present' : new Date(item.endDate!).getFullYear()}
        </span>
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
          <h1 className="text-3xl font-bold text-primary">Experience</h1>
          <p className="text-muted mt-1">Manage your work experience</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 gradient-bg rounded-xl text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-accent"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'New Experience'}
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
        <AdminCard title={editingId ? 'Edit Experience' : 'New Experience'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-xs text-secondary mb-1.5 font-medium">Type</label>
                <select
                  required
                  value={formData.type || ''}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1.5 font-medium">Start Date</label>
                <input
                  required
                  type="date"
                  value={formData.startDate?.split('T')[0] || ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1.5 font-medium">End Date</label>
                <input
                  type="date"
                  disabled={formData.current}
                  value={formData.endDate?.split('T')[0] || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.current || false}
                  onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: e.target.checked ? undefined : formData.endDate })}
                  className="w-4 h-4 rounded accent-accent"
                />
                <label htmlFor="current" className="text-sm text-primary cursor-pointer">
                  Currently working here
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-secondary mb-1.5 font-medium">Description</label>
                <textarea
                  required
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors resize-none"
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
          data={experiences}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No experience yet. Add your first position!"
        />
      </AdminCard>
    </div>
  );
}
