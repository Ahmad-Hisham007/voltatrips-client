import { notFound } from "next/navigation";
import { type Metadata } from "next";

import { fetchTrip } from "@/lib/queries/trip";
import { buildReviewSummary, fetchTripReviews } from "@/lib/queries/review";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookingForm } from "@/components/booking-form";
import { TripHeroCarousel } from "@/components/trip-hero-carousel";
import { TiDocumentText } from "react-icons/ti";
import { LuMap, LuMapPin } from "react-icons/lu";
import { MdOutlineCameraAlt } from "react-icons/md";
import { RiUserHeartLine } from "react-icons/ri";
import { Check, Clock } from "lucide-react";
import { FaRegAddressCard } from "react-icons/fa6";
import Link from "next/link";
import { GrMapLocation } from "react-icons/gr";
import { IoMdClose } from "react-icons/io";
import { TourPlanTab } from "../components/TourPlanTab";
import InformationTab from "../components/InformationTab";
import LocationTab from "../components/LocationTab";
import GalleryTab from "../components/GalleryTab";
import ReviewsTab from "../components/ReviewsTab";

export const metadata: Metadata = {
  title: "Trip Details",
};

// Tab values matching the design spec
const TABS = [
  { id: "information", label: "Information", icon: TiDocumentText },
  { id: "tour-plan", label: "Tour Plan", icon: LuMap },
  { id: "location", label: "Location", icon: LuMapPin },
  { id: "gallery", label: "Gallery", icon: MdOutlineCameraAlt },
  { id: "reviews", label: "Reviews", icon: RiUserHeartLine },
];
// export async function generateStaticParams() {
//   // Static preview-er jonno default slug return kora
//   return [{ slug: "thai-island-to-visit" }];
// }
export default async function TripPage({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params: _params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // slug not used - ID 31 is hardcoded for initial dev
  const [trip, reviewComments] = await Promise.all([
    fetchTrip(31),
    fetchTripReviews(31),
  ]);

  if (!trip) notFound();

  const reviewSummary = buildReviewSummary(reviewComments);

  return (
    <div className="flex flex-col">
      {/* =========================================== */}
      {/* 1. HERO CAROUSEL (above fold, full-width)   */}
      {/* =========================================== */}
      <TripHeroCarousel
        images={trip.tripFields.tripGallery.nodes}
        price={trip.tripFields.tripPrice}
        duration={trip.tripFields.tripDuration}
      />

      {/* =========================================== */}
      {/* 2. MAIN LAYOUT: 2-column grid              */}
      {/* =========================================== */}
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
              <TourPlanTab itinerary={trip.tripFields.tripItinerary} />
            </TabsContent>

            <TabsContent value="location">
              <LocationTab
                location={trip.tripFields.tripLocation}
                tripLocationSubtitle={trip.tripFields.tripLocationSubtitle}
                tripLocationDescription={
                  trip.tripFields.tripLocationDescription
                }
              />
            </TabsContent>

            <TabsContent value="gallery">
              <GalleryTab images={trip.tripFields.tripGallery.nodes} />
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
