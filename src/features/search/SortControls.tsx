import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ArrowUpDown } from "lucide-react";

interface SortControlsProps {
  sort: { field: string; order: "asc" | "desc" };
  onSortFieldChange: (field: string) => void;
  onToggleSortOrder: () => void;
}

export default function SortControls({
  sort,
  onSortFieldChange,
  onToggleSortOrder,
}: SortControlsProps) {
  return (
    <div className="flex w-full items-center justify-between gap-2 md:w-auto md:justify-end">
      <span className="text-sm font-medium">Sort By</span>
      <ToggleGroup
        type="single"
        variant="outline"
        value={sort.field}
        onValueChange={onSortFieldChange}
      >
        <ToggleGroupItem
          value="breed"
          aria-label="Sort by breed"
          className="cursor-pointer"
        >
          Breed
        </ToggleGroupItem>
        <ToggleGroupItem
          value="name"
          aria-label="Sort by name"
          className="cursor-pointer"
        >
          Name
        </ToggleGroupItem>
        <ToggleGroupItem
          value="age"
          aria-label="Sort by age"
          className="cursor-pointer"
        >
          Age
        </ToggleGroupItem>
      </ToggleGroup>
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleSortOrder}
        aria-label="Toggle sort direction"
        className="cursor-pointer"
      >
        <ArrowUpDown className="h-4 w-4 cursor-pointer" />
      </Button>
    </div>
  );
}
