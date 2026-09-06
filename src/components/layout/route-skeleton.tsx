import { Skeleton } from "@/components/ui/skeleton";

export function RouteSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-6 w-1/3" />
    </div>
  );
}
