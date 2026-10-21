// app/trips/page.tsx — Trip catalog (archive) page
import Link from "next/link";

import { fetchTripList } from "@/lib/queries/trip";

export type TripSummary = {
  title: string;
  url: string;
  slug: string;
};

export default async function TripsArchivePage() {
  let trips: TripSummary[] = [];

  try {
    trips = await fetchTripList();
  } catch (error) {
    console.error("Error fetching trips catalog:", error);
    trips = [];
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Explore All Trips</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <div key={trip.slug} className="border p-4 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-2">{trip.title}</h2>
            <Link
              href={trip.url}
              className="text-blue-600 hover:underline font-medium"
            >
              View Trip Details &rarr;
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
