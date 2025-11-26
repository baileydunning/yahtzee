import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'auth_user';

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function buildDefaultStats(userId: string) {
  return {
    userId,
    classicGamesCompleted: 0,
    rainbowGamesCompleted: 0,
    classicHighScores: [],
    rainbowHighScores: [],
    totalYahtzeesInClassic: 0,
    totalYahtzeesInRainbow: 0,
    upperBonusesEarned: 0,
    threeOfKind20Plus: 0,
    fourOfKind25Plus: 0,
    straightShooterGames: 0,
    classic275PlusGames: 0,
    rainbow400PlusGames: 0,
    totalRainbowPoints: 0,
    bothModesPlayed: false,
    totalGames: 0,
    bestClassicScore: 0,
    bestRainbowScore: 0,
    classicAverage: 0,
    rainbowAverage: 0,
    lastGameDate: null,
    lastUpdated: null,
    classicBonusYahtzees: 0,
    rainbowBonusYahtzees: 0,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const passwordHash = await hashPassword(password);

      const isEmail = identifier.includes('@');
      const queryKey = isEmail ? 'email' : 'username';
      const res = await fetch(
        `/users/?${queryKey}=${encodeURIComponent(identifier)}`
      );
      if (!res.ok) throw new Error('Login failed');

      const list = await res.json();
      if (!Array.isArray(list) || list.length === 0) {
        throw new Error('User not found');
      }

      const dbUser = list[0];

      if (dbUser.passwordHash !== passwordHash) {
        throw new Error('Invalid credentials');
      }

      const authUser: User = {
        id: dbUser.id,
        email: dbUser.email,
        username: dbUser.username ?? dbUser.email.split('@')[0],
      };

      localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
      setUser(authUser);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      const trimmedEmail = email.trim();
      const trimmedUsername = username.trim();

      if (!trimmedEmail || !trimmedUsername) {
        throw new Error('Email and username are required');
      }

      // 1) Uniqueness checks
      const emailRes = await fetch(
        `/users/?email=${encodeURIComponent(trimmedEmail)}`
      );
      if (!emailRes.ok) {
        throw new Error('Failed checking email availability');
      }
      const emailUsers = await emailRes.json();
      if (Array.isArray(emailUsers) && emailUsers.length > 0) {
        throw new Error('An account with this email already exists');
      }

      const usernameRes = await fetch(
        `/Users/?username=${encodeURIComponent(trimmedUsername)}`
      );
      if (!usernameRes.ok) {
        throw new Error('Failed checking username availability');
      }
      const usernameUsers = await usernameRes.json();
      if (Array.isArray(usernameUsers) && usernameUsers.length > 0) {
        throw new Error('That username is already taken');
      }

      // 2) Create user
      const passwordHash = await hashPassword(password);

      const res = await fetch(`/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          username: trimmedUsername,
          passwordHash,
        }),
      });

      if (!res.ok) throw new Error('Signup failed');

      const created = await res.json();

      const authUser: User = {
        id: created.id,
        email: created.email,
        username: created.username ?? created.email.split('@')[0],
      };

      // 3) Create baseline UserStats row
      try {
        const statsRes = await fetch(`/UserStats`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildDefaultStats(created.id)),
        });

        if (!statsRes.ok) {
          console.error('Failed to create default stats for user', created.id);
        }
      } catch (e) {
        console.error('Error creating default stats:', e);
      }

      // 4) (Optional) Seed achievements baseline
      // You can either:
      // - Do nothing here and create rows lazily when progress starts, or
      // - If you have a static list of achievement IDs on the client, you
      //   can POST /user_achievements for each with progress:0, unlocked:false.

      localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
      setUser(authUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
