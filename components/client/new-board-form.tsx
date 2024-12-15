// components/client/new-board-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type BoardSizePreset = {
  label: string;
  dimensions: string;
};

const BOARD_SIZES: BoardSizePreset[] = [
  { label: 'Small (10x10)', dimensions: '10x10' },
  { label: 'Medium (20x20)', dimensions: '20x20' },
  { label: 'Large (30x30)', dimensions: '30x30' },
];

const GAME_RULES = [
  { label: 'Classic (B3/S23)', value: 'B3/S23' },
  { label: 'HighLife (B36/S23)', value: 'B36/S23' },
  { label: 'Life without Death (B3/S012345678)', value: 'B3/S012345678' },
];

export function NewBoardForm() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    dimensions: BOARD_SIZES[0].dimensions,
    rules: GAME_RULES[0].value
  });

  const createEmptyBoardState = (dimensions: string): string => {
    const [width, height] = dimensions.split('x').map(Number);
    const row = Array(width).fill('0').join('');
    return Array(height).fill(row).join('|');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('game_boards')
        .insert({
          name: formData.name.trim(),
          dimensions: formData.dimensions,
          rules: formData.rules,
          current_state: createEmptyBoardState(formData.dimensions),
          version: 1
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Redirect to the new board page
      router.push(`/board/${data.id}`);
      router.refresh(); // Refresh server data

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create board');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Board Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="My Game of Life Board"
          required
          minLength={3}
          maxLength={50}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dimensions">Board Size</Label>
        <select 
          id="dimensions"
          name="dimensions"
          value={formData.dimensions}
          onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
          className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
        >
          {BOARD_SIZES.map(({ label, dimensions }) => (
            <option key={dimensions} value={dimensions}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rules">Game Rules</Label>
        <select
          id="rules"
          name="rules"
          value={formData.rules}
          onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
          className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
        >
          {GAME_RULES.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Board'}
        </Button>
      </div>
    </form>
  );
}