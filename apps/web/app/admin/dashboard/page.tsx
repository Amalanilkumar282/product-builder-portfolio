'use client';

import { useEffect, useState } from 'react';
import AdminCard from '@/components/admin/AdminCard';
import { projectsApi, skillsApi, experienceApi, blogApi, testimonialsApi } from '@/lib/admin-api';
import { FolderKanban, Settings, Briefcase, FileText, MessageSquare, TrendingUp, Eye, Clock } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  projects: number;
  skills: number;
  experience: number;
  blog: number;
  testimonials: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    skills: 0,
    experience: 0,
    blog: 0,
    testimonials: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projects, skills, experience, blog, testimonials] = await Promise.all([
          projectsApi.getAll(),
          skillsApi.getAll(),
          experienceApi.getAll(),
          blogApi.getAll(),
          testimonialsApi.getAll(),
        ]);

        setStats({
          projects: projects.length,
          skills: skills.length,
          experience: experience.length,
          blog: blog.length,
          testimonials: testimonials.length,
        });
      } catch (err) {
        setError('Failed to load dashboard stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Projects', value: stats.projects, icon: FolderKanban, href: '/admin/projects', color: 'from-blue-500 to-cyan-500' },
    { label: 'Skills', value: stats.skills, icon: Settings, href: '/admin/skills', color: 'from-purple-500 to-pink-500' },
    { label: 'Experience', value: stats.experience, icon: Briefcase, href: '/admin/experience', color: 'from-orange-500 to-red-500' },
    { label: 'Blog Posts', value: stats.blog, icon: FileText, href: '/admin/blog', color: 'from-green-500 to-emerald-500' },
    { label: 'Testimonials', value: stats.testimonials, icon: MessageSquare, href: '/admin/testimonials', color: 'from-indigo-500 to-blue-500' },
  ];

  const quickActions = [
    { label: 'New Project', href: '/admin/projects', icon: FolderKanban },
    { label: 'New Blog Post', href: '/admin/blog', icon: FileText },
    { label: 'Edit Profile', href: '/admin/profile', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-muted">Overview of your portfolio content</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <AdminCard className="hover:border-accent hover:-translate-y-1 transition-all cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
              </AdminCard>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <AdminCard title="Quick Actions" description="Commonly used management tasks">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href}>
                <button className="w-full glass rounded-xl p-4 flex items-center gap-3 hover:border-accent hover:bg-white/5 transition-all group">
                  <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center shadow-lg shadow-accent group-hover:scale-110 transition-transform">
                    <Icon size={18} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-primary">{action.label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </AdminCard>

      {/* Recent Activity (Placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title="Recent Activity" description="Latest content updates">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 glass rounded-xl">
              <Clock size={16} className="text-muted" />
              <div className="flex-1">
                <p className="text-sm text-primary">No recent activity</p>
                <p className="text-xs text-muted">Start creating content to see activity here</p>
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Portfolio Stats" description="Visitor insights">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 glass rounded-xl">
              <div className="flex items-center gap-3">
                <Eye size={16} className="text-accent" />
                <span className="text-sm text-primary">Total Views</span>
              </div>
              <span className="text-sm font-semibold text-primary">-</span>
            </div>
            <div className="flex items-center justify-between p-3 glass rounded-xl">
              <div className="flex items-center gap-3">
                <TrendingUp size={16} className="text-green-500" />
                <span className="text-sm text-primary">Growth</span>
              </div>
              <span className="text-sm font-semibold text-primary">-</span>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}