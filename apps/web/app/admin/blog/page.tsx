'use client';

import { useEffect, useState } from 'react';
import AdminCard from '@/components/admin/AdminCard';
import AdminTable from '@/components/admin/AdminTable';
import { blogApi, BlogPost } from '@/lib/admin-api';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await blogApi.getAll();
      setPosts(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load blog posts' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Delete "${post.title}"?`)) return;

    try {
      await blogApi.delete(post.id);
      setPosts(posts.filter((p) => p.id !== post.id));
      setMessage({ type: 'success', text: 'Blog post deleted successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete blog post' });
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (item: BlogPost) => (
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-xs text-muted">{item.slug}</p>
        </div>
      ),
    },
    {
      key: 'excerpt',
      header: 'Excerpt',
      render: (item: BlogPost) => <p className="text-sm line-clamp-2">{item.excerpt}</p>,
    },
    {
      key: 'published',
      header: 'Status',
      render: (item: BlogPost) => (
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
      key: 'publishedAt',
      header: 'Date',
      render: (item: BlogPost) =>
        item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : '-',
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
          <h1 className="text-3xl font-bold text-primary">Blog</h1>
          <p className="text-muted mt-1">Manage your blog posts</p>
        </div>
        <Link href="/admin/blog/new">
          <button className="px-6 py-3 gradient-bg rounded-xl text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-accent">
            <Plus size={18} />
            New Post
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
          data={posts}
          columns={columns}
          emptyMessage="No blog posts yet. Create your first post!"
          actions={(item) => (
            <div className="flex items-center justify-end gap-2">
              <Link href={`/admin/blog/${item.id}`}>
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
