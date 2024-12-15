// app/board/new/page.tsx
import { Metadata } from 'next';
import { NewBoardForm } from '@/components/client/new-board-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Create New Game Board - ChaosCraft',
  description: 'Create a new Game of Life board with custom rules and dimensions'
};

export default function NewBoardPage() {
  return (
    <div className="container max-w-xl py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Game Board</h1>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Configure your Game of Life board. You can set custom dimensions and
          rules for cell evolution.
        </AlertDescription>
      </Alert>

      <NewBoardForm />
    </div>
  );
}