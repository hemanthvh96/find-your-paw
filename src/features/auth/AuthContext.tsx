import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { loginAPI, logoutAPI } from "./authAPI";
import type { AuthContextType, User } from "./authTypes";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from local storage", error);
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (name: string, email: string) => {
    await loginAPI(name, email);
    setUser({ name, email });
  };

  const logout = async () => {
    try {
      await logoutAPI();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      sessionStorage.removeItem("search_filters");
      sessionStorage.removeItem("search_sort");
      sessionStorage.removeItem("search_dogs");
      sessionStorage.removeItem("search_currentPage");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
