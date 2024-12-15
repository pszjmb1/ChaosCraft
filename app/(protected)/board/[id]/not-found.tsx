export default function NotFound() {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-lg font-medium">
            Game board not found
          </div>
          <p className="text-muted-foreground">
            The game board you're looking for doesn't exist or you don't have access to it.
          </p>
        </div>
      </div>
    );
  }