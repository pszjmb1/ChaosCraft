import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <Card key={n}>
            <CardHeader>
              <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
                <div className="h-9 w-full bg-muted animate-pulse rounded mt-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}