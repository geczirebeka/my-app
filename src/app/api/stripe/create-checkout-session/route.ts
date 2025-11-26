import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

function supabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clubId, courtId, startTs, endTs, userId } = body;

    if (!clubId || !courtId || !startTs || !endTs) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const supabase = supabaseServer();

    const rpcRes = await supabase.rpc("create_pending_booking", {
      p_club_id: clubId,
      p_court_id: courtId,
      p_user_id: userId ?? null,
      p_start_ts: startTs,
      p_end_ts: endTs,
    });

    if (rpcRes.error) {
      console.error("RPC error:", rpcRes.error);
      return NextResponse.json(
        { error: rpcRes.error.message },
        { status: 409 },
      );
    }

    const bookingId = rpcRes.data as string;

    const start = new Date(startTs);
    const end = new Date(endTs);
    const durationMinutes = Math.round(
      (end.getTime() - start.getTime()) / 60000,
    );

    const priceRes = await supabase
      .from("club_pricing")
      .select("price_numeric")
      .eq("club_id", clubId)
      .eq("duration_minutes", durationMinutes)
      .single();

    if (priceRes.error || !priceRes.data) {
      console.error("Price lookup error:", priceRes.error);

      await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);

      return NextResponse.json(
        { error: "Pricing not configured for this duration" },
        { status: 400 },
      );
    }

    const priceNumeric = Number(priceRes.data.price_numeric);
    const amountCents = Math.round(priceNumeric * 100);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Booking ${durationMinutes}min - ${bookingId}`,
              metadata: { bookingId },
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      metadata: { booking_id: bookingId },
      success_url: `${baseUrl}/checkout/success?bookingId=${bookingId}`,
      cancel_url: `${baseUrl}/checkout/cancel?bookingId=${bookingId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 },
    );
  }
}
