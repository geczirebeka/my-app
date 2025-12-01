import { supabaseServer } from "../supabase/server";

export async function getBookingsCountForClub(clubId: string) {
  const supabase = supabaseServer();

  return supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("club_id", clubId);
}

export async function getUpcomingBookingsForClub(clubId: string) {
  const supabase = supabaseServer();

  return supabase
    .from("bookings")
    .select("id, court_id, start_time, end_time, user_email")
    .eq("club_id", clubId)
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true });
}

export async function getBookingsForClubOnDate(clubId: string, date: string) {
  const supabase = supabaseServer();

  return supabase
    .from("bookings")
    .select("id, court_id, start_time, end_time, status")
    .eq("club_id", clubId)
    .eq("date", date)
    .order("start_time");
}
