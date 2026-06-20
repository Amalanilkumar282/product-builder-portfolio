'use client';

import { useAuth } from '@/hooks/use-auth';
import { LayoutDashboard, FolderKanban, User, Briefcase, GraduationCap, Settings, FileText, Star, MessageSquare, Layers, Award, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/profile', label: 'Profile', icon: User },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/skills', label: 'Skills', icon: Settings },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/education', label: 'Education', icon: GraduationCap },
  { href: '/admin/services', label: 'Services', icon: Layers },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { href: '/admin/tech-stack', label: 'Tech Stack', icon: Star },
  { href: '/admin/awards', label: 'Awards', icon: Award },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 min-h-screen glass border-r border-default p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg shadow-accent">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-primary text-lg">Admin Panel</h1>
            <p className="text-xs text-muted">Portfolio CMS</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                isActive
                  ? 'gradient-bg text-white shadow-lg shadow-accent'
                  : 'text-secondary hover:bg-white/5 hover:text-primary'
              )}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondary hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 mt-4"
      >
        <LogOut size={18} />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </aside>
  );
}
