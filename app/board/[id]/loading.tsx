export default function Loading() {
    return (
      <div className="container mx-auto py-8">
        <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
        <div className="w-full h-96 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            Loading game board...
          </div>
        </div>
      </div>
    );
  }