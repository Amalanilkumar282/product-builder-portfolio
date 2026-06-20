'use client';

import { useEffect, useState } from 'react';
import AdminCard from '@/components/admin/AdminCard';
import AdminTable from '@/components/admin/AdminTable';
import { educationApi, Education } from '@/lib/admin-api';
import { Plus, X } from 'lucide-react';

export default function EducationPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Education>>({ order: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const data = await educationApi.getAll();
      setEducation(data.sort((a, b) => a.order - b.order));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load education' });
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
        const updated = await educationApi.update(editingId, formData);
        setEducation(education.map((edu) => (edu.id === editingId ? updated : edu)));
        setMessage({ type: 'success', text: 'Education updated successfully' });
      } else {
        const created = await educationApi.create(formData);
        setEducation([...education, created]);
        setMessage({ type: 'success', text: 'Education created successfully' });
      }
      resetForm();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save education' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (edu: Education) => {
    setFormData(edu);
    setEditingId(edu.id);
    setShowForm(true);
  };

  const handleDelete = async (edu: Education) => {
    if (!confirm(`Delete education from "${edu.institution}"?`)) return;

    try {
      await educationApi.delete(edu.id);
      setEducation(education.filter((e) => e.id !== edu.id));
      setMessage({ type: 'success', text: 'Education deleted successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete education' });
    }
  };

  const resetForm = () => {
    setFormData({ order: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  const columns = [
    {
      key: 'degree',
      header: 'Degree',
      render: (item: Education) => (
        <div>
          <p className="font-medium">{item.degree}</p>
          <p className="text-xs text-muted">{item.field}</p>
        </div>
      ),
    },
    { key: 'institution', header: 'Institution' },
    {
      key: 'startDate',
      header: 'Period',
      render: (item: Education) => (
        <span className="text-sm">
          {new Date(item.startDate).getFullYear()} - {item.endDate ? new Date(item.endDate).getFullYear() : 'Present'}
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
          <h1 className="text-3xl font-bold text-primary">Education</h1>
          <p className="text-muted mt-1">Manage your educational background</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 gradient-bg rounded-xl text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-accent"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'New Education'}
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
        <AdminCard title={editingId ? 'Edit Education' : 'New Education'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-secondary mb-1.5 font-medium">Institution</label>
                <input
                  required
                  type="text"
                  value={formData.institution || ''}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1.5 font-medium">Degree</label>
                <input
                  required
                  type="text"
                  value={formData.degree || ''}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                  placeholder="e.g., Bachelor's, Master's"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1.5 font-medium">Field of Study</label>
                <input
                  required
                  type="text"
                  value={formData.field || ''}
                  onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                  placeholder="e.g., Computer Science"
                />
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
                  value={formData.endDate?.split('T')[0] || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
          data={education}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No education yet. Add your educational background!"
        />
      </AdminCard>
    </div>
  );
}
