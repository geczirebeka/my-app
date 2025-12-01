import Link from "next/link";
import { ReactNode } from "react";

export default async function DashboardLayout({
  params,
  children,
}: {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}) {
  const { slug } = await params;

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 border-r p-4">
        <div className="font-bold text-lg mb-4">{slug.toUpperCase()}</div>

        <nav className="space-y-2">
          <Link href={`/dashboard/${slug}`} className="block">
            Overview
          </Link>

          <Link href={`/dashboard/${slug}/bookings`} className="block">
            Bookings
          </Link>

          <Link href={`/dashboard/${slug}/courts`} className="block">
            Courts
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
