// app/board/[id]/error.tsx
'use client';
  
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-destructive text-lg font-medium">
          Something went wrong loading the game board!
        </div>
        <Button
          onClick={() => reset()}
          variant="outline"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}