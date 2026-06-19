'use client';

import { useAuth } from '@/hooks/use-auth';
import { Bell, User } from 'lucide-react';

export default function AdminHeader() {
  const { logout } = useAuth();

  return (
    <header className="h-16 glass border-b border-default px-8 flex items-center justify-between sticky top-0 z-10 backdrop-blur-xl">
      <div>
        <h2 className="text-lg font-semibold text-primary">Welcome back!</h2>
        <p className="text-xs text-muted">Manage your portfolio content</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:border-accent transition-all">
          <Bell size={18} className="text-secondary" />
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-3 glass rounded-xl px-4 py-2 hover:border-accent transition-all cursor-pointer">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="text-sm">
            <p className="text-primary font-medium">Admin</p>
            <p className="text-muted text-xs">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
