import { supabaseServer } from "../supabase/server";

export async function getClubBySlug(slug: string) {
  const supabase = supabaseServer();

  return supabase
    .from("clubs")
    .select("id, name, slug")
    .eq("slug", slug)
    .single();
}
