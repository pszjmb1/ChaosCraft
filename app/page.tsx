import Hero from "@/components/hero";
import Link from 'next/link';

export default async function Index() {
  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h2 className="font-medium text-xl mb-4">ChaosCraft: Distributed Game of Life Evolution</h2>
        <p>A real-time collaborative Conway's Game of Life implementation showcasing 
          <Link href="https://supabase.com/launch-week"> Supabase Launch Week 13's</Link> groundbreaking features. ChaosCraft demonstrates the convergence of edge computing, real-time collaboration, and scheduled automation in a visually engaging experience.</p>
        <p><Link href="/sign-in">Sign-in</Link> to play.</p>
      </main>
    </>
  );
}
