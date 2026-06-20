'use client';

import { useEffect, useState } from 'react';
import AdminCard from '@/components/admin/AdminCard';
import AdminTable from '@/components/admin/AdminTable';
import { servicesApi, Service } from '@/lib/admin-api';
import { Plus, X } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Service>>({ order: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await servicesApi.getAll();
      setServices(data.sort((a, b) => a.order - b.order));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load services' });
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
        const updated = await servicesApi.update(editingId, formData);
        setServices(services.map((s) => (s.id === editingId ? updated : s)));
        setMessage({ type: 'success', text: 'Service updated successfully' });
      } else {
        const created = await servicesApi.create(formData);
        setServices([...services, created]);
        setMessage({ type: 'success', text: 'Service created successfully' });
      }
      resetForm();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save service' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service: Service) => {
    setFormData(service);
    setEditingId(service.id);
    setShowForm(true);
  };

  const handleDelete = async (service: Service) => {
    if (!confirm(`Delete "${service.title}"?`)) return;

    try {
      await servicesApi.delete(service.id);
      setServices(services.filter((s) => s.id !== service.id));
      setMessage({ type: 'success', text: 'Service deleted successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete service' });
    }
  };

  const resetForm = () => {
    setFormData({ order: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  const columns = [
    { key: 'title', header: 'Service Title' },
    {
      key: 'description',
      header: 'Description',
      render: (item: Service) => <p className="text-sm line-clamp-2">{item.description}</p>,
    },
    { key: 'icon', header: 'Icon' },
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
          <h1 className="text-3xl font-bold text-primary">Services</h1>
          <p className="text-muted mt-1">Manage your service offerings</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 gradient-bg rounded-xl text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-accent"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'New Service'}
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
        <AdminCard title={editingId ? 'Edit Service' : 'New Service'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-secondary mb-1.5 font-medium">Service Title</label>
                <input
                  required
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1.5 font-medium">Icon Name (lucide-react)</label>
                <input
                  required
                  type="text"
                  value={formData.icon || ''}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                  placeholder="e.g., Code, Layout, Database"
                />
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
          data={services}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No services yet. Add your service offerings!"
        />
      </AdminCard>
    </div>
  );
}
