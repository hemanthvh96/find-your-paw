import type { Dog } from "@/features/search/searchTypes";
import DogCard from "./DogCard";

export default function DogGrid({ dogs }: { dogs: Dog[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {dogs.map((dog) => (
        <DogCard key={dog.id} dog={dog} />
      ))}
    </div>
  );
}
