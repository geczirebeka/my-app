import Link from "next/link";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { bookingId?: string };
}) {
  const bookingId = searchParams.bookingId;

  return (
    <div className="max-w-xl mx-auto mt-24 text-center">
      <h1 className="text-3xl font-semibold mb-4">Booking Confirmed 🎉</h1>
      <p className="text-lg mb-6">Your booking is complete!</p>

      {bookingId && (
        <p className="font-mono text-sm bg-gray-100 rounded p-3 inline-block mb-6">
          Booking ID: {bookingId}
        </p>
      )}

      <Link href="/" className="text-blue-600 underline">
        Return Home
      </Link>
    </div>
  );
}
