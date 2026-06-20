'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface UseAuthReturn {
  isAuthenticated: boolean;
  accessToken: string | null;
  isLoading: boolean;
  logout: () => void;
}

export function useAuth(requireAuth = true): UseAuthReturn {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
    } else if (requireAuth && pathname !== '/admin/login') {
      // Redirect to login if auth is required and user is not on login page
      router.push('/admin/login');
    }
    
    setIsLoading(false);
  }, [requireAuth, pathname, router]);

  const logout = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    setAccessToken(null);
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  return {
    isAuthenticated,
    accessToken,
    isLoading,
    logout,
  };
}
