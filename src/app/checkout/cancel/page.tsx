import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="max-w-xl mx-auto mt-24 text-center">
      <h1 className="text-3xl font-semibold mb-4">Payment Cancelled</h1>
      <p className="text-lg mb-6">Your booking was not completed.</p>

      <Link href="/" className="text-blue-600 underline">
        Try Again
      </Link>
    </div>
  );
}
