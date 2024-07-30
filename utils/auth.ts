import { useState, useEffect } from 'react';

// Mock User type
interface User {
  id: string;
  email: string;
}

// Mock authentication functions
export const signUp = async (email: string, password: string): Promise<User | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { id: 'mock-user-id', email };
};

export const signIn = async (email: string, password: string): Promise<User | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { id: 'mock-user-id', email };
};

export const signOut = async (): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
};

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate fetching user session
    const fetchSession = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({ id: 'mock-user-id', email: 'mock@example.com' });
      setLoading(false);
    };

    fetchSession();
  }, []);

  return { user, loading };
};
