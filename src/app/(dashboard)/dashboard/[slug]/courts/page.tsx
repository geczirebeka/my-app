// dashboard/[slug]/courts/page.tsx
import { getClubBySlug } from "@/lib/server/clubs";
import {
  getCourtsForClub,
  createCourt,
  updateCourt,
  deleteCourt,
} from "@/lib/server/courts";

export default async function CourtsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: club } = await getClubBySlug(slug);
  const { data: courts } = await getCourtsForClub(club.id);

  async function addCourt(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    await createCourt(club.id, name);
  }

  async function renameCourt(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    await updateCourt(id, name);
  }

  async function removeCourt(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteCourt(id);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Courts</h1>

      <form action={addCourt} className="flex gap-2">
        <input
          type="text"
          name="name"
          placeholder="Court Name"
          required
          className="border px-3 py-2 rounded"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Court
        </button>
      </form>

      <div className="space-y-4">
        {courts?.map((court) => (
          <div
            key={court.id}
            className="border p-4 rounded flex items-center justify-between"
          >
            <span className="font-medium">{court.name}</span>

            <div className="flex gap-2">
              <form action={renameCourt} className="flex gap-2">
                <input type="hidden" name="id" value={court.id} />
                <input
                  type="text"
                  name="name"
                  defaultValue={court.name}
                  className="border px-2 py-1 rounded"
                />
                <button className="bg-yellow-300 text-white px-3 py-1 rounded">
                  Save
                </button>
              </form>

              <form action={removeCourt}>
                <input type="hidden" name="id" value={court.id} />
                <button className="bg-red-400 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
