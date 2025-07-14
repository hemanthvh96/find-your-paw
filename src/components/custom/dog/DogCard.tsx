import type { Dog } from "@/features/search/searchTypes";
import { useFavorites } from "@/features/favorites/FavoritesContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DogCard({ dog }: { dog: Dog }) {
  const { favoriteIds, addFavorite, removeFavorite } = useFavorites();
  const isFavorite = favoriteIds.has(dog.id);

  const handleToggleFavorite = () => {
    isFavorite ? removeFavorite(dog.id) : addFavorite(dog.id);
  };

  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="p-0">
        <img
          src={dog.img}
          alt={dog.name}
          className="aspect-[4/3] w-full object-cover"
        />
      </CardContent>
      <CardFooter className="flex items-start justify-between p-4">
        <div className="grid gap-0.5">
          <h4 className="font-semibold">{dog.name}</h4>
          <p className="text-sm text-muted-foreground">{dog.breed}</p>
          <p className="text-sm text-muted-foreground">Age: {dog.age}</p>
          <p className="text-sm text-muted-foreground">Zip: {dog.zip_code}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer"
          onClick={handleToggleFavorite}
          aria-label={
            isFavorite ? `Unfavorite ${dog.name}` : `Favorite ${dog.name}`
          }
        >
          <Heart
            className={cn(
              "h-5 w-5 text-destructive",
              isFavorite && "fill-destructive"
            )}
          />
        </Button>
      </CardFooter>
    </Card>
  );
}
