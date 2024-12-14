'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-destructive text-lg font-medium">
          Unable to load game boards
        </div>
        <p className="text-muted-foreground text-center max-w-md">
          There was a problem loading the game boards. Please try again later.
        </p>
        <Button onClick={reset} variant="outline">
          Try again
        </Button>
      </div>
    </div>
  );
}