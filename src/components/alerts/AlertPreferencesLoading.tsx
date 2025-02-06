import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const AlertPreferencesLoading = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Alert Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-[200px]" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-[200px]" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
};