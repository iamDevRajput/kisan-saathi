'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useStore } from '@/store/useStore';
import { useEffect } from 'react';

export function useAuth() {
  const { data: session, status } = useSession();
  const { setUser, logout, user, isAuthenticated } = useStore();

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id || '',
        email: session.user.email || '',
        name: session.user.name || '',
        image: session.user.image || undefined,
        role: (session.user.role as 'USER' | 'ADMIN' | 'FARMER') || 'USER',
      });
    } else {
      logout();
    }
  }, [session, setUser, logout]);

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logoutUser = async () => {
    await signOut({ redirect: false });
    logout();
  };

  return {
    user,
    isAuthenticated,
    isLoading: status === 'loading',
    login,
    logout: logoutUser,
  };
}
