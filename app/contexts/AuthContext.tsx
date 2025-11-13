'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated');
    const authTimestamp = localStorage.getItem('adminAuthTimestamp');

    if (authStatus === 'true' && authTimestamp) {
      // Check if session is still valid (24 hours)
      const timestamp = parseInt(authTimestamp);
      const now = Date.now();
      const hoursPassed = (now - timestamp) / (1000 * 60 * 60);

      if (hoursPassed < 24) {
        setIsAuthenticated(true);
      } else {
        // Session expired
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminAuthTimestamp');
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Call the login API
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminAuthTimestamp', Date.now().toString());
        // Optionally store user info
        if (data.user) {
          localStorage.setItem('adminUser', JSON.stringify(data.user));
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminAuthTimestamp');
    localStorage.removeItem('adminUser');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
