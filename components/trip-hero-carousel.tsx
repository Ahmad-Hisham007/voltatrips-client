"use client";

import Image from "next/image";

export type TripImage = {
  mediaDetails: {
    file: string;
    filePath: string;
    width: number;
    height: number;
  };
};

type TripHeroCarouselProps = {
  images: Array<TripImage>;
  price: number;
};

const FALLBACK_IMAGES = [
  "https://roam.qodeinteractive.com/wp-content/uploads/2017/08/h5-tour-f-img-8.jpg",
  "https://roam.qodeinteractive.com/wp-content/uploads/2017/08/tour-gallery-img-1-550x550.jpg",
  "https://roam.qodeinteractive.com/wp-content/uploads/2017/08/tour-gallery-img-2-550x550.jpg",
];

export function TripHeroCarousel({
  images = [],
  price = 0,
}: TripHeroCarouselProps) {
  const displayImages = images.length > 0 ? images : FALLBACK_IMAGES.map(
    (file) => ({
      mediaDetails: {
        file,
        filePath: file,
        width: 1300,
        height: 809,
      },
    }),
  );

  return (
    <section className="relative w-full overflow-hidden">
      {/* Vignette overlay: inner shadow sides + bottom fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* side vignette */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/40 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/40 to-transparent" />
        {/* bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Carousel slides - single image shown for placeholder */}
      <div className="relative h-64 sm:h-80 md:h-[400px] bg-gray-100">
        {displayImages.map((img, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: idx === 0 ? 1 : 0 }}
          >
            <Image
              src={`https://roam.qodeinteractive.com${img.mediaDetails.filePath}`}
              alt={`Hero slide ${idx + 1}`}
              fill
              sizes="100vw"
              className="object-cover"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>

      {/* Price badge */}
      <div className="absolute left-4 bottom-4 z-10 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-content">
        ${price} per person
      </div>
    </section>
  );
}