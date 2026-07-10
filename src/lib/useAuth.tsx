"use client";
import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { authFetch, getStoredUser, getToken, setStoredUser, clearSession } from "./session";

interface AuthContextType {
  user: any;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(getStoredUser());
  const [loading, setLoading] = useState(!getStoredUser());
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const res = await authFetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setStoredUser(data.user);
        } else {
          setUser(null);
          clearSession();
        }
      } else {
        setUser(null);
        clearSession();
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
      clearSession();
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authFetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      clearSession();
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (!user) {
      refreshUser();
    } else {
      setLoading(false);
    }

    // Auto-refresh user data every 5 minutes
    const interval = setInterval(() => {
      if (getToken()) {
        refreshUser();
      }
    }, 5 * 60 * 1000); // 5 menit

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook untuk protected routes
export function useRequireAuth(redirectTo = "/login") {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(redirectTo);
    }
  }, [user, loading, redirectTo, router]);

  return { user, loading };
}

// Hook untuk role-based access
export function useRequireRole(roles: string[], redirectTo = "/dashboard") {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (!roles.includes(user.role)) {
        router.replace(redirectTo);
      }
    }
  }, [user, loading, roles, redirectTo, router]);

  return { user, loading };
}
