import { Link, useNavigate } from "react-router";
import { Heart, Dog } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { useFavorites } from "@/features/favorites/FavoritesContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { favoriteIds } = useFavorites();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      toast.success("You have been successfully logged out.");
    } catch (error) {
      toast.error((error as Error).message || "Logout failed.");
    }
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link
          to="/search"
          className="flex items-center gap-2"
          aria-label="FindPaws Home"
        >
          <Dog className="h-6 w-6 text-accent" />
          <h1 className="hidden text-xl font-bold tracking-tight text-foreground sm:block">
            FindPaws
          </h1>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <Link
            to="/favorites"
            className="relative"
            aria-label="View Favorites"
          >
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer"
            >
              <Heart className="h-5 w-5" />
            </Button>
            {favoriteIds.size > 0 && (
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                {favoriteIds.size}
              </span>
            )}
          </Link>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full cursor-pointer"
                  aria-label="Open user menu"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src="https://cdn.pixabay.com/photo/2016/01/05/17/51/maltese-1123016_1280.jpg"
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
