import { useState, useEffect } from "react";
import { useFavorites } from "../favorites/FavoritesContext";
import {
  fetchBreeds,
  searchDogs,
  fetchDogDetails,
  fetchMatch,
} from "./searchAPI";
import type {
  Dog,
  FilterContentProps,
  Filters,
  SortState,
} from "./searchTypes";
import DogGrid from "@/components/custom/dog/DogGrid";
import DogCardSkeleton from "@/components/custom/dog/DogCardSkeleton";
import FilterContent from "./FilterContent";
import SortControls from "./SortControls";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PanelLeftOpen } from "lucide-react";

export default function SearchPage() {
  const [allBreeds, setAllBreeds] = useState<string[]>([]);

  const [dogs, setDogs] = useState<Dog[]>(() => {
    try {
      const stored = sessionStorage.getItem("search_dogs");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [filters, setFilters] = useState<Filters>(() => {
    const stored = sessionStorage.getItem("search_filters");
    if (stored) {
      const parsed = JSON.parse(stored);
      parsed.breeds = new Set(parsed.breeds);
      return parsed;
    }

    return { breeds: new Set(), zipCodes: "", ageMin: "", ageMax: "" };
  });

  const [sort, setSort] = useState<SortState>(() => {
    try {
      const stored = sessionStorage.getItem("search_sort");
      return stored ? JSON.parse(stored) : { field: "breed", order: "asc" };
    } catch {
      return { field: "breed", order: "asc" };
    }
  });

  const [currentPage, setCurrentPage] = useState<number>(() => {
    try {
      const stored = sessionStorage.getItem("search_currentPage");
      return stored ? parseInt(stored, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 24;

  const [localFilters, setLocalFilters] = useState({
    ageMin: filters.ageMin,
    ageMax: filters.ageMax,
    zipCodes: filters.zipCodes,
  });

  const [breedSearchTerm, setBreedSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(dogs.length === 0);
  const { favoriteIds } = useFavorites();
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([
    "breed",
  ]);

  useEffect(() => {
    const storableFilters = { ...filters, breeds: Array.from(filters.breeds) };
    sessionStorage.setItem("search_filters", JSON.stringify(storableFilters));
  }, [filters]);

  useEffect(() => {
    sessionStorage.setItem("search_sort", JSON.stringify(sort));
  }, [sort]);

  useEffect(() => {
    sessionStorage.setItem("search_dogs", JSON.stringify(dogs));
  }, [dogs]);

  useEffect(() => {
    sessionStorage.setItem("search_currentPage", String(currentPage));
  }, [currentPage]);

  useEffect(() => {
    fetchBreeds().then(setAllBreeds).catch(console.error);
  }, []);

  useEffect(() => {
    const isInitialLoadWithPersistedData = dogs.length > 0 && isLoading;
    if (isInitialLoadWithPersistedData) {
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filters.breeds.size > 0) {
        filters.breeds.forEach((breed) => params.append("breeds", breed));
      }
      if (filters.zipCodes) {
        filters.zipCodes
          .split(",")
          .forEach((zip) => params.append("zipCodes", zip.trim()));
      }
      if (filters.ageMin) params.append("ageMin", filters.ageMin);
      if (filters.ageMax) params.append("ageMax", filters.ageMax);
      params.append("sort", `${sort.field}:${sort.order}`);
      params.append("size", String(PAGE_SIZE));
      params.append("from", String((currentPage - 1) * PAGE_SIZE));

      try {
        const searchResult = await searchDogs(params);
        setTotalPages(Math.ceil(searchResult.total / PAGE_SIZE));
        setDogs(
          searchResult.resultIds?.length > 0
            ? await fetchDogDetails(searchResult.resultIds)
            : []
        );
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setDogs([]);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [filters, sort, currentPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  const handleFindMatch = async () => {
    if (favoriteIds.size === 0) return;
    try {
      const ids = Array.from(favoriteIds);
      const matchResult = await fetchMatch(ids);
      const dogDetails = await fetchDogDetails([matchResult.match]);
      setMatchedDog(dogDetails[0]);
    } catch (error) {
      console.error("Failed to find a match:", error);
    }
  };

  const handleBreedFilterChange = (breed: string, checked: boolean) => {
    setCurrentPage(1);
    setFilters((prev) => {
      const newBreeds = new Set(prev.breeds);
      checked ? newBreeds.add(breed) : newBreeds.delete(breed);
      return { ...prev, breeds: newBreeds };
    });
  };

  const handleLocalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyTextFilters = () => {
    if (
      localFilters.ageMin !== filters.ageMin ||
      localFilters.ageMax !== filters.ageMax ||
      localFilters.zipCodes !== filters.zipCodes
    ) {
      setCurrentPage(1);
      setFilters((prev) => ({ ...prev, ...localFilters }));
    }
  };

  const handleSortFieldChange = (field: string) => {
    if (field) {
      setSort((prev) => ({ ...prev, field }));
      setCurrentPage(1);
    }
  };

  const toggleSortOrder = () => {
    setSort((prev) => ({
      ...prev,
      order: prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    const areFiltersActive =
      filters.breeds.size > 0 ||
      filters.zipCodes !== "" ||
      filters.ageMin !== "" ||
      filters.ageMax !== "";
    if (areFiltersActive) {
      sessionStorage.removeItem("search_filters");
      sessionStorage.removeItem("search_sort");
      sessionStorage.removeItem("search_dogs");
      sessionStorage.removeItem("search_currentPage");
      setFilters({ breeds: new Set(), zipCodes: "", ageMin: "", ageMax: "" });
      setLocalFilters({ ageMin: "", ageMax: "", zipCodes: "" });
      setCurrentPage(1);
    }
  };

  const getPaginationItems = () => {
    const siblingCount = 1;
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "...", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, "...", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, "...", ...middleRange, "...", totalPages];
    }
    return [];
  };

  const filterContentProps: FilterContentProps = {
    filters,
    breedSearchTerm: breedSearchTerm,
    filteredBreeds: allBreeds.filter((breed) =>
      breed.toLowerCase().includes(breedSearchTerm.toLowerCase())
    ),
    openAccordionItems,
    localFilters,
    onBreedSearchChange: (e) => setBreedSearchTerm(e.target.value),
    onOpenAccordionChange: setOpenAccordionItems,
    onBreedFilterChange: handleBreedFilterChange,
    onLocalFilterChange: handleLocalFilterChange,
    applyTextFilters: applyTextFilters,
    onResetFilters: resetFilters,
  };

  return (
    <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-[300px_1fr]">
      <aside className="hidden border-r bg-muted/20 p-4 md:block">
        <FilterContent {...filterContentProps} />
      </aside>

      <main className="container mx-auto flex flex-col p-4 sm:p-6">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center justify-between md:w-auto">
            <h3 className="text-xl font-semibold">Results</h3>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Open filters"
                  >
                    <PanelLeftOpen className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-4">
                  <FilterContent {...filterContentProps} />
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <SortControls
            sort={sort}
            onSortFieldChange={handleSortFieldChange}
            onToggleSortOrder={toggleSortOrder}
          />
        </div>

        <div className="my-6 flex justify-center">
          {favoriteIds.size > 0 && (
            <Button
              onClick={handleFindMatch}
              variant="ghost"
              className="w-full max-w-sm justify-center bg-accent text-accent-foreground dark:bg-accent/50 cursor-pointer"
            >
              Find My Match ({favoriteIds.size})
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <DogCardSkeleton key={index} />
              ))}
            </div>
          ) : dogs.length > 0 ? (
            <DogGrid dogs={dogs} />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No dogs found matching your criteria.
            </div>
          )}
        </div>

        <div className="mt-auto pt-6">
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                    aria-disabled={currentPage === 1}
                  />
                </PaginationItem>
                {getPaginationItems().map((item, index) => (
                  <PaginationItem key={index}>
                    {typeof item === "number" ? (
                      <PaginationLink
                        isActive={currentPage === item}
                        onClick={() => handlePageChange(item)}
                        className="cursor-pointer"
                      >
                        {item}
                      </PaginationLink>
                    ) : (
                      <PaginationEllipsis />
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                    aria-disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </main>

      <Dialog
        open={matchedDog !== null}
        onOpenChange={(open) => !open && setMatchedDog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>We Found Your Perfect Match!</DialogTitle>
            <DialogDescription>
              Based on your favorites, this is your most compatible companion.
            </DialogDescription>
          </DialogHeader>
          {matchedDog && (
            <div className="flex flex-col items-center gap-4 py-4">
              <img
                src={matchedDog.img}
                alt={matchedDog.name}
                className="h-48 w-48 rounded-full object-cover"
              />
              <div className="text-center">
                <p className="text-2xl font-bold">{matchedDog.name}</p>
                <p className="text-muted-foreground">{matchedDog.breed}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              className="cursor-pointer"
              onClick={() => setMatchedDog(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
