import { createContext, useState, useContext, type ReactNode } from 'react';

interface User {
  name: string;
  role: string;
  hospitalName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, role: string, hospitalName?: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (name: string, role: string, hospitalName?: string) => {
    // In a real app, you would authenticate with a backend.
    // For this mock, we'll just set the user based on the role.
    if (role === 'Caregiver') {
      setUser({ name: 'Caregiver User', role, hospitalName });
    } else {
      setUser({ name, role, hospitalName });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
