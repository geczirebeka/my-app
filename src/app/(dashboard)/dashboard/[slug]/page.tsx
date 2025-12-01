import { getBookingsCountForClub } from "@/lib/server/bookings";
import { getClubBySlug } from "@/lib/server/clubs";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: club } = await getClubBySlug(slug);
  if (!club) return <p>Club not found</p>;

  const { count: totalBookings } = await getBookingsCountForClub(club.id);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded-xl">
          <p className="text-gray-500 text-sm">Total Bookings</p>
          <p className="text-2xl font-bold mt-2">{totalBookings}</p>
        </div>
      </div>
    </div>
  );
}
