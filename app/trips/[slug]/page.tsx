import { notFound } from "next/navigation";
import { type Metadata } from "next";

import { fetchTrip, type Trip } from "@/lib/queries/trip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookingForm } from "@/components/booking-form";
import { TripHeroCarousel } from "@/components/trip-hero-carousel";
import { TiDocumentText } from "react-icons/ti";
import { LuMap, LuMapPin } from "react-icons/lu";
import { MdOutlineCameraAlt } from "react-icons/md";
import { RiUserHeartLine } from "react-icons/ri";

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

export default async function TripPage({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params: _params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // slug not used - ID 31 is hardcoded for initial dev
  const trip = await fetchTrip(31);

  if (!trip) notFound();

  return (
    <div className="flex flex-col">
      {/* =========================================== */}
      {/* 1. HERO CAROUSEL (above fold, full-width)   */}
      {/* =========================================== */}
      <TripHeroCarousel
        images={trip.tripFields.tripGallery.nodes}
        price={trip.tripFields.tripPrice}
      />

      {/* =========================================== */}
      {/* 2. MAIN LAYOUT: 2-column grid              */}
      {/* =========================================== */}
      <Tabs defaultValue="information" className="w-full">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:px-8 pb-27.5 max-w-325 mx-auto md:pt-20.5 pt-10">
          <section className="lg:col-span-9 px-5">
            <TabsContent value="information">
              <InformationTab trip={trip} />
            </TabsContent>

            <TabsContent value="tour-plan">
              <TourPlanTab itinerary={trip.tripFields.tripItinerary} />
            </TabsContent>

            <TabsContent value="location">
              <LocationTab location={trip.tripFields.tripLocation} />
            </TabsContent>

            <TabsContent value="gallery">
              <GalleryTab images={trip.tripFields.tripGallery.nodes} />
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsTab />
            </TabsContent>
            {/* Empty wrapper that matches your design structure */}
            <div className="bg-gray-100 border border-border rounded-lg overflow-hidden"></div>
          </section>

          {/* RIGHT COLUMN ~28% (sticky sidebar) */}
          <aside className="lg:col-span-3 px-5">
            <div className="sticky top-24">
              <BookingForm />
            </div>
          </aside>
        </div>

        {/* Tab Content – boxed card inside tabs */}
        <div className="p-4 sm:p-6 bg-surface rounded-b-lg"></div>
      </Tabs>
    </div>
  );
}

// ===========================================================
// Individual Tab Components (server components)
// ===========================================================

function InformationTab({ trip }: { trip: Trip }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Title & Price Header */}
      <h2 className="text-heading font-display text-2xl lg:text-3xl">
        {trip.title}
      </h2>

      {/* Metadata Badges */}
      <div className="flex flex-wrap gap-3 text-sm text-body">
        <span className="flex items-center gap-1">
          📅 {trip.tripFields.tripDuration} Days
        </span>
        <span className="flex items-center gap-1">
          👥 {trip.tripFields.tripAgeRequirement}
        </span>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {trip.slug}
        </span>
      </div>

      {/* Key Details Table */}
      <dl className="divide-y divide-border">
        <div className="flex justify-between py-2">
          <dt className="text-muted">Departure</dt>
          <dd className="text-right text-body">{trip.tripFields.departure}</dd>
        </div>
        <div className="flex justify-between py-2">
          <dt className="text-muted">Departure Time</dt>
          <dd className="text-right text-body">
            {trip.tripFields.departureTime}
          </dd>
        </div>
        <div className="flex justify-between py-2">
          <dt className="text-muted">Dress Code</dt>
          <dd className="text-right text-body">{trip.tripFields.dressCode}</dd>
        </div>
      </dl>

      {/* Included / Not Included Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium text-heading mb-2 flex items-center gap-2">
            <span className="text-green-500">✓</span> What&apos;s Included
          </h3>
          <ul className="list-none space-y-1 text-body">
            {trip.tripFields.tripDetails.whatsIncluded.map((item, i) => (
              <li key={i}>• {item.item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-medium text-heading mb-2 flex items-center gap-2">
            <span className="text-muted">✕</span> What&apos;s Not Included
          </h3>
          <ul className="list-none space-y-1 text-body">
            {trip.tripFields.tripDetails.whatsNotIncluded.map((item, i) => (
              <li key={i}>• {item.item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Short Description */}
      <p className="text-body">
        {trip.tripFields.tripDetails.tripShortDescription}
      </p>

      {/* Full Description */}
      <div
        className="prose prose-sm max-w-none text-body"
        dangerouslySetInnerHTML={{
          __html: trip.tripFields.tripDetails.tripFullDescription,
        }}
      />
    </div>
  );
}

function TourPlanTab({
  itinerary,
}: {
  itinerary: Trip["tripFields"]["tripItinerary"];
}) {
  return (
    <div className="divide-y divide-border">
      {itinerary.map((item) => (
        <div key={item.day} className="py-4 first:pt-0 last:pb-0">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-semibold text-primary-content">
                {item.day}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-heading font-medium text-base">
                Day {item.day}: {item.title}
              </h3>
              <p
                className="mt-1 text-sm text-body prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LocationTab({ location }: { location: string }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-heading font-display text-2xl lg:text-3xl">
          Location
        </h2>
        <p className="mt-1 text-body">{location}</p>
      </div>

      <div className="aspect-video h-64 w-full overflow-hidden rounded-lg border border-border">
        <iframe
          title="Map"
          src="https://www.google.com/maps/embed?pb=!1m18!&output=gbmp"
          className="h-full w-full border-0"
          loading="lazy"
        />
      </div>

      {/* Extended location text placeholder */}
      <div className="text-body">
        <p>
          Explore the beautiful islands of Thailand with our expertly curated
          itinerary. From pristine beaches to vibrant markets, discover the
          hidden gems of Southeast Asia.
        </p>
      </div>
    </div>
  );
}

function GalleryTab({
  images,
}: {
  images: Array<{
    mediaDetails: {
      file: string;
      filePath: string;
      width: number;
      height: number;
    };
  }>;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((img) => (
        <div
          key={img.mediaDetails.filePath}
          className="group relative aspect-square overflow-hidden rounded-lg border border-border"
        >
          {/* placeholder for lightbox - will open modal on click */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              img.mediaDetails.filePath.startsWith("/")
                ? `https://roam.qodeinteractive.com${img.mediaDetails.filePath}`
                : img.mediaDetails.filePath
            }
            alt="Gallery image"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
}

function ReviewsTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-heading font-display text-2xl lg:text-3xl">
          Reviews
        </h2>
        <p className="mt-1 text-body">
          Join the conversation and share your experience!
        </p>
      </div>

      {/* <ReviewForm /> — import when available */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <p className="text-center text-muted">
          Review form and review list coming soon.
        </p>
      </div>
    </div>
  );
}
