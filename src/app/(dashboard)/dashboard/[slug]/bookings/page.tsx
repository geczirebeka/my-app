import { format, addMinutes } from "date-fns";

import DateSelector from "@/components/dashboard/DateSelector";
import { getBookingsForClubOnDate } from "@/lib/server/bookings";
import { getClubBySlug } from "@/lib/server/clubs";
import { getCourtsForClub } from "@/lib/server/courts";

export default async function BookingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { date } = await searchParams;

  const dateLookup = date ?? format(new Date(), "yyyy-MM-dd");

  const { data: club } = await getClubBySlug(slug);
  const { data: courts } = await getCourtsForClub(club.id);
  const { data: bookings } = await getBookingsForClubOnDate(club.id, dateLookup);

  // Generate time slots every 30 min
  const start = new Date(`${dateLookup}T08:00`);
  const end = new Date(`${dateLookup}T22:00`);
  const times: string[] = [];

  for (let t = start; t <= end; t = addMinutes(t, 30)) {
    times.push(format(t, "HH:mm"));
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Bookings</h1>

      <form className="mb-4">
        <DateSelector />
      </form>

      <div className="overflow-x-auto">
        <table className="border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="border px-4 py-2 bg-gray-100">Time</th>
              {courts?.map((court) => (
                <th key={court.id} className="border px-4 py-2 bg-gray-100 text-left">
                  {court.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {times.map((time) => (
              <tr key={time}>
                <td className="border px-2 py-1 w-24 bg-gray-50 text-sm">{time}</td>

                {courts?.map((court) => {
                  const booking = bookings?.find((b) => {
                    return b.court_id === court.id && b.start_time.startsWith(time);
                  });

                  return (
                    <td key={court.id} className="border px-2 py-1 h-10 text-sm">
                      {booking ? (
                        <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Booked
                        </div>
                      ) : (
                        <div className="text-gray-300 text-xs">•</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
