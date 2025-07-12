import { Skeleton } from "@/components/ui/skeleton";

export default function DogCardSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[225px] w-full rounded-lg" />
      <div className="space-y-2 p-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
