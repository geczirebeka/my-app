import Image from "next/image";
import { notFound } from "next/navigation";

import { supabaseServer } from "@/lib/supabase/server";

export default async function ClubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = supabaseServer();

  const { data: club, error } = await supabase
    .from("clubs")
    .select("*, courts(*)")
    .eq("slug", slug)
    .single();

  if (!club) return notFound();

  return (
    <div className="flex flex-col">
      <div className="w-full h-64 overflow-hidden rounded-b-2xl">
        <Image
          src="https://via.placeholder.com/1200x350?text=Club+Banner"
          alt={club.name}
          className="w-full h-full object-cover"
        />
      </div>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">{club.name}</h1>
          <p className="text-muted-foreground">
            Premium indoor padel courts in central London.
          </p>
        </div>

        <a href={`/club/${slug}/calendar`} className="btn-primary">
          View Calendar
        </a>
      </main>
    </div>
  );
}
