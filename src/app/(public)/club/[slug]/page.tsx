import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type ClubPageProps = {
  params: { slug: string };
};

//TODO: Fetch real data from DB later
async function getClubData(slug: string) {
  return {
    name: "Padel London",
    description: "Premium indoor padel courts in central London.",
    address: "12 Court Street, London",
    image: "https://via.placeholder.com/1200x350?text=Club+Banner",
    facilities: ["Indoor courts", "Equipment rental", "Free parking"],
  };
}

export default async function ClubPage({ params }: ClubPageProps) {
  const { slug } = await params;
  const club = await getClubData(slug);

  return (
    <div className="flex flex-col">
      {/* Header Image */}
      <div className="w-full h-64 overflow-hidden rounded-b-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {/* Club Name + Description */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">{club.name}</h1>
          <p className="text-muted-foreground">{club.description}</p>
        </div>

        <Separator />

        {/* Facilities */}
        <Card>
          <CardHeader>
            <CardTitle>Facilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {club.facilities.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <p>{f}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Book Now CTA */}
        <div className="flex justify-center py-4">
          <Button size="lg" className="px-8 text-lg" asChild>
            <a href={`/club/${slug}/calendar`}>View Calendar</a>
          </Button>
        </div>
      </main>
    </div>
  );
}
