'use client';

import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  RotateCcw
} from 'lucide-react';

interface GameControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onStep: () => void;
  generation: number;
}

export default function GameControls({
  isRunning,
  onStart,
  onStop,
  onReset,
  onStep,
  generation
}: GameControlsProps) {
  return (
    <div className="flex items-center gap-4 my-4">
      <Button
        variant="default"
        size="default"
        onClick={isRunning ? onStop : onStart}
      >
        {isRunning ? (
          <Pause className="h-4 w-4 mr-2" />
        ) : (
          <Play className="h-4 w-4 mr-2" />
        )}
        {isRunning ? 'Stop' : 'Start'}
      </Button>

      <Button
        variant="outline"
        size="default"
        onClick={onReset}
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset
      </Button>

      <Button
        variant="outline"
        size="default"
        onClick={onStep}
        disabled={isRunning}
      >
        Next Generation
      </Button>

      <span className="text-sm text-muted-foreground">
        Generation: {generation}
      </span>
    </div>
  );
}