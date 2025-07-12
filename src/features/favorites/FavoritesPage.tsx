import { useState, useEffect } from "react";
import { useFavorites } from "./FavoritesContext";
import { fetchDogDetails } from "../search/searchAPI";
import type { Dog } from "../search/searchTypes";
import DogGrid from "@/components/custom/dog/DogGrid";
import DogCardSkeleton from "@/components/custom/dog/DogCardSkeleton";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const { favoriteIds, clearFavorites } = useFavorites();
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const favoriteIdsArray = Array.from(favoriteIds);
    if (favoriteIdsArray.length === 0) {
      setFavoriteDogs([]);
      return;
    }
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const dogs = await fetchDogDetails(favoriteIdsArray);
        setFavoriteDogs(dogs);
      } catch (error) {
        console.error("Failed to fetch favorite dogs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();
  }, [favoriteIds]);

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <h1 className="text-xl font-bold tracking-tight">
          My Favorites ({favoriteIds.size})
        </h1>
        {favoriteIds.size > 0 && (
          <Button variant="destructive" onClick={clearFavorites}>
            Clear All Favorites
          </Button>
        )}
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {Array.from({ length: favoriteIds.size }).map((_, index) => (
            <DogCardSkeleton key={index} />
          ))}
        </div>
      ) : favoriteDogs.length > 0 ? (
        <DogGrid dogs={favoriteDogs} />
      ) : (
        <div className="flex h-[50vh] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <h2 className="text-2xl font-semibold">No Favorites Yet</h2>
          <p className="mt-2 text-muted-foreground">
            Click the heart on any dog to add it here.
          </p>
        </div>
      )}
    </div>
  );
}
