import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingForm } from "@/components/booking-form";
import { TripHeroCarousel } from "@/components/trip-hero-carousel";
import InformationTab from "@/app/trips/components/InformationTab";
import TourPlanTab from "@/app/trips/components/TourPlanTab";
import LocationTab from "@/app/trips/components/LocationTab";
import GalleryTab from "@/app/trips/components/GalleryTab";
import ReviewsTab from "@/app/trips/components/ReviewsTab";
import { fetchTripReviews, buildReviewSummary } from "@/lib/queries/review";
import type { Trip } from "@/lib/queries/trip";
import type { WpNode } from "@/lib/queries/wp";
import { TiDocumentText } from "react-icons/ti";
import { LuMap, LuMapPin } from "react-icons/lu";
import { MdOutlineCameraAlt } from "react-icons/md";
import { RiUserHeartLine } from "react-icons/ri";

// Tab values matching Phase 1 /trips/[slug]/page.tsx
const TABS = [
  { id: "information", label: "Information", icon: TiDocumentText },
  { id: "tour-plan", label: "Tour Plan", icon: LuMap },
  { id: "location", label: "Location", icon: LuMapPin },
  { id: "gallery", label: "Gallery", icon: MdOutlineCameraAlt },
  { id: "reviews", label: "Reviews", icon: RiUserHeartLine },
];

/**
 * Adapts the WpNode (from GetNodeByUri) into the Trip type
 * consumed by the Phase 1 trip components.
 *
 * Extracts the trip slug from the last URI segment — fetchTripReviews
 * expects just the slug (e.g. "speedboat-in-hurghada"), not the full path.
 */
function mapWpNodeToTrip(node: WpNode): Trip {
  // uri like "/trips/speedboat-in-hurghada/" -> "speedboat-in-hurghada"
  const uri = (node.uri ?? "").replace(/^\/|\/$/g, "");
  const segments = uri.split("/");
  const tripSlug = segments[segments.length - 1] || "";

  return {
    title: node.title ?? "",
    slug: tripSlug,
    id: node.databaseId ? String(node.databaseId) : (node.id ?? ""),
    databaseId: node.databaseId ?? 0,
    tripFields: node.tripFields as Trip["tripFields"],
    content: node.content ?? undefined,
  };
}

/**
 * Trip branch of the catch-all route.
 * Reuses the Phase 1 trip components (carousel, tabs, booking sidebar)
 * so there is a single source of truth for trip UI.
 */
export default async function TripLayout({ node }: { node: WpNode }) {
  const trip = mapWpNodeToTrip(node);

  const reviewComments = await fetchTripReviews(trip.slug);
  const reviewSummary = buildReviewSummary(reviewComments);

  return (
    <div className="flex flex-col">
      {/* 1. HERO CAROUSEL (above fold, full-width) */}
      {trip.tripFields?.tripGallery &&
        trip.tripFields.tripGallery.nodes && (
          <TripHeroCarousel
            images={trip.tripFields.tripGallery.nodes}
            price={trip.tripFields.tripPrice}
            title={trip.title}
            duration={trip.tripFields.tripDuration}
            rating={reviewSummary.averageRating}
          />
        )}

      {/* 2. MAIN LAYOUT: 2-column grid */}
      <Tabs defaultValue="information" className="w-full z-20 bg-base">
        {/* TabsList — gray background bar with active indicator */}
        <div className="bg-gray-100">
          <TabsList className="flex flex-col sm:flex-row max-w-325 md:mx-auto mx-12 bg-transparent border-0! outline-0 shadow-none">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="md:not-last:not-first:not-odd:border-x md:border-y-0! not-last:not-first:not-odd:border-y flex justify-center items-center gap-2 text-body text-[16px] cursor-pointer leading-tight border-gray-300 flex-1 p-5.5! data-[state=active]:bg-white data-[state=active]:border-transparent data-[state=active]:text-primary"
              >
                {<tab.icon className="text-lg" />} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* LEFT COLUMN ~72% (tabs wrapper) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 pb-27.5 max-w-325 mx-auto md:pt-20.5 pt-10">
          <section className="lg:col-span-9 px-5">
            <TabsContent value="information">
              <InformationTab trip={trip} />
            </TabsContent>

            <TabsContent value="tour-plan">
              <TourPlanTab
                itinerary={trip.tripFields?.tripItinerary ?? []}
              />
            </TabsContent>

            <TabsContent value="location">
              <LocationTab
                location={trip.tripFields?.tripLocation ?? ""}
                tripLocationSubtitle={trip.tripFields?.tripLocationSubtitle ?? ""}
                tripLocationDescription={
                  trip.tripFields?.tripLocationDescription ?? ""
                }
              />
            </TabsContent>

            <TabsContent value="gallery">
              <GalleryTab
                images={
                  trip.tripFields?.tripGallery?.nodes ?? []
                }
              />
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsTab
                trip={trip}
                comments={reviewComments}
                summary={reviewSummary}
              />
            </TabsContent>
          </section>

          {/* RIGHT COLUMN ~28% (sticky sidebar) */}
          <aside className="lg:col-span-3 px-5 md:md-0 mt-5">
            <div className="sticky top-24">
              <BookingForm />
            </div>
          </aside>
        </div>
      </Tabs>
    </div>
  );
}
