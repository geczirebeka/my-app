import { notFound } from "next/navigation";

import CalendarClient from "@/components/calendar/CalendarClient";
import { supabaseServer } from "@/lib/supabase/server";

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = supabaseServer();

  const { data: club } = await supabase
    .from("clubs")
    .select("*, courts(*), club_pricing(*), recurring_availability(*)")
    .eq("slug", slug)
    .single();

  if (!club) return notFound();

  return (
    <div className="min-h-screen bg-muted/40">
      <main className="max-w-5xl mx-auto p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">{club.name}</h1>
        </header>

        <CalendarClient club={club} />
      </main>
    </div>
  );
}
