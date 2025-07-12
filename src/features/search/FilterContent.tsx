import type { FilterContentProps } from "./searchTypes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FilterContent({
  filters,
  breedSearchTerm,
  filteredBreeds,
  openAccordionItems,
  onBreedSearchChange,
  onOpenAccordionChange,
  onBreedFilterChange,
  onLocalFilterChange,
  applyTextFilters,
  onResetFilters,
  localFilters,
}: FilterContentProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Filters</h2>
      <Input
        aria-label="Search through breed filters"
        placeholder="Search breeds..."
        value={breedSearchTerm}
        onChange={onBreedSearchChange}
      />

      <Accordion
        type="multiple"
        value={openAccordionItems}
        onValueChange={onOpenAccordionChange}
        className="w-full"
      >
        <AccordionItem value="breed">
          <AccordionTrigger className="cursor-pointer hover:no-underline">
            Breed ({filters.breeds.size})
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-48">
              <div className="flex flex-col gap-2 p-2">
                {filteredBreeds.map((breed) => (
                  <div key={breed} className="flex items-center gap-2">
                    <Checkbox
                      id={`filter-${breed}`}
                      checked={filters.breeds.has(breed)}
                      onCheckedChange={(checked) =>
                        onBreedFilterChange(breed, !!checked)
                      }
                      className="cursor-pointer"
                    />
                    <Label
                      htmlFor={`filter-${breed}`}
                      className="flex-1 cursor-pointer text-sm font-medium leading-none"
                    >
                      {breed}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="age">
          <AccordionTrigger className="cursor-pointer hover:no-underline">
            Age
          </AccordionTrigger>
          <AccordionContent className="space-y-2 p-2">
            <div className="grid grid-cols-2 items-center gap-2">
              <Label htmlFor="ageMin">Min Age</Label>
              <Input
                id="ageMin"
                name="ageMin"
                placeholder="Any"
                type="number"
                value={localFilters.ageMin}
                onChange={onLocalFilterChange}
                onBlur={applyTextFilters}
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <Label htmlFor="ageMax">Max Age</Label>
              <Input
                id="ageMax"
                name="ageMax"
                placeholder="Any"
                type="number"
                value={localFilters.ageMax}
                onChange={onLocalFilterChange}
                onBlur={applyTextFilters}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="location">
          <AccordionTrigger className="cursor-pointer hover:no-underline">
            Location
          </AccordionTrigger>
          <AccordionContent className="p-2">
            <Label htmlFor="zipCodes" className="sr-only">
              Zip Codes
            </Label>
            <Input
              id="zipCodes"
              name="zipCodes"
              placeholder="e.g. 60616, 60617"
              value={localFilters.zipCodes}
              onChange={onLocalFilterChange}
              onBlur={applyTextFilters}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="pt-4">
        <Button
          variant="destructive"
          className="w-full justify-center cursor-pointer"
          onClick={onResetFilters}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
