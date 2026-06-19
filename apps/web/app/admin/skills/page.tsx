'use client';

import { useEffect, useState } from 'react';
import AdminCard from '@/components/admin/AdminCard';
import AdminTable from '@/components/admin/AdminTable';
import { skillsApi, Skill } from '@/lib/admin-api';
import { Plus, X } from 'lucide-react';

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Skill>>({ proficiency: 50, order: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await skillsApi.getAll();
      setSkills(data.sort((a, b) => a.order - b.order));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load skills' });
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
        const updated = await skillsApi.update(editingId, formData);
        setSkills(skills.map((s) => (s.id === editingId ? updated : s)));
        setMessage({ type: 'success', text: 'Skill updated successfully' });
      } else {
        const created = await skillsApi.create(formData);
        setSkills([...skills, created]);
        setMessage({ type: 'success', text: 'Skill created successfully' });
      }
      resetForm();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save skill' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setFormData(skill);
    setEditingId(skill.id);
    setShowForm(true);
  };

  const handleDelete = async (skill: Skill) => {
    if (!confirm(`Delete "${skill.name}"?`)) return;

    try {
      await skillsApi.delete(skill.id);
      setSkills(skills.filter((s) => s.id !== skill.id));
      setMessage({ type: 'success', text: 'Skill deleted successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete skill' });
    }
  };

  const resetForm = () => {
    setFormData({ proficiency: 50, order: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  const columns = [
    { key: 'name', header: 'Skill Name' },
    { key: 'category', header: 'Category' },
    {
      key: 'proficiency',
      header: 'Proficiency',
      render: (item: Skill) => (
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full gradient-bg"
              style={{ width: `${item.proficiency}%` }}
            />
          </div>
          <span className="text-xs text-muted">{item.proficiency}%</span>
        </div>
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
          <h1 className="text-3xl font-bold text-primary">Skills</h1>
          <p className="text-muted mt-1">Manage your technical skills</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 gradient-bg rounded-xl text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-accent"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'New Skill'}
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
        <AdminCard title={editingId ? 'Edit Skill' : 'New Skill'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-secondary mb-1.5 font-medium">Skill Name</label>
                <input
                  required
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                  placeholder="e.g., React, Node.js"
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
                  placeholder="e.g., Frontend, Backend"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1.5 font-medium">
                  Proficiency ({formData.proficiency}%)
                </label>
                <input
                  required
                  type="range"
                  min="0"
                  max="100"
                  value={formData.proficiency || 50}
                  onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
                  className="w-full"
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
          data={skills}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No skills yet. Add your first skill!"
        />
      </AdminCard>
    </div>
  );
}
