import { NextResponse } from "next/server";

import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: { url: string | URL }) {
  const { searchParams } = new URL(req.url);
  const clubId = searchParams.get("clubId");
  const date = searchParams.get("date");

  const supabase = supabaseServer();

  const { data } = await supabase
    .from("bookings")
    .select("*")
    .eq("club_id", clubId)
    .eq("date", date)
    .neq("status", "cancelled");

  return NextResponse.json(data ?? []);
}
