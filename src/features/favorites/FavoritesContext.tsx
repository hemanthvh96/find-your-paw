import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/AuthContext";

interface FavoritesContextType {
  favoriteIds: Set<string>;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const storageKey = user ? `favoriteIds_${user.email}` : null;

  useEffect(() => {
    if (user && storageKey) {
      try {
        const storedFavorites = localStorage.getItem(storageKey);
        setFavoriteIds(
          storedFavorites ? new Set(JSON.parse(storedFavorites)) : new Set()
        );
      } catch (error) {
        console.error("Failed to parse favorites from local storage", error);
        setFavoriteIds(new Set());
      }
    } else {
      setFavoriteIds(new Set());
    }
  }, [user, storageKey]);

  useEffect(() => {
    if (user && storageKey) {
      const favoriteIdsArray = Array.from(favoriteIds);
      localStorage.setItem(storageKey, JSON.stringify(favoriteIdsArray));
    }
  }, [favoriteIds, user, storageKey]);

  const addFavorite = (id: string) => {
    setFavoriteIds((prev) => new Set(prev).add(id));
  };

  const removeFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const clearFavorites = () => {
    setFavoriteIds(new Set());
  };

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds, addFavorite, removeFavorite, clearFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
