// src/features/search/SearchTypes.ts

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface Filters {
  breeds: Set<string>;
  zipCodes: string;
  ageMin: string;
  ageMax: string;
}

export type SortState = {
  field: string;
  order: "asc" | "desc";
};

export interface FilterContentProps {
  filters: Filters;
  breedSearchTerm: string;
  filteredBreeds: string[];
  openAccordionItems: string[];
  onBreedSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenAccordionChange: (items: string[]) => void;
  onBreedFilterChange: (breed: string, checked: boolean) => void;
  onLocalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  applyTextFilters: () => void;
  onResetFilters: () => void;
  localFilters: { ageMin: string; ageMax: string; zipCodes: string };
}
