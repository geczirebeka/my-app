import { supabaseServer } from "../supabase/server";

export async function getCourtsForClub(clubId: string) {
  const supabase = supabaseServer();

  return supabase
    .from("courts")
    .select("*")
    .eq("club_id", clubId)
    .order("name");
}

export async function createCourt(clubId: string, name: string) {
  const supabase = supabaseServer();

  return supabase.from("courts").insert({
    club_id: clubId,
    name,
  });
}

export async function updateCourt(courtId: string, name: string) {
  const supabase = supabaseServer();

  return supabase.from("courts").update({ name }).eq("id", courtId);
}

export async function deleteCourt(courtId: string) {
  const supabase = supabaseServer();

  return supabase.from("courts").delete().eq("id", courtId);
}
