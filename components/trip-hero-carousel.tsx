"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type TripImage = {
  mediaDetails: {
    file: string;
    filePath: string;
    width: number;
    height: number;
  };
};

type CarouselProps = {
  images: Array<TripImage>;
  price?: number;
};

const SWIPE_DETECTION_THRESHOLD = 50;

export function TripHeroCarousel({
  images = [],
  price = 0,
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const isBeginning = current === 0;
  const isEnd = current === images.length - 1;

  // Build a full image list for slide
  const slideCount = images.length || 1;
  const displayImages = images.length > 0 ? images : [
    { mediaDetails: { file: "placeholder", filePath: "/placeholder.jpg", width: 1600, height: 900 } },
  ];

  // Navigate
  const prev = () => setCurrent((c) => (c <= 0 ? 0 : c - 1));
  const next = () => setCurrent((c) => (c >= slideCount - 1 ? slideCount - 1 : c + 1));

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStart - e.touches[0].clientX;
    if (Math.abs(delta) > SWIPE_DETECTION_THRESHOLD) {
      if (delta > 0) next(); else prev();
    }
    setTouchStart(0);
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-gray-100 font-sans"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Trip image carousel"
    >
      {/* Vignette overlay – inner shadow sides + bottom fade */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Left side vignette */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/50 to-transparent" />
        {/* Right side vignette */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/50 to-transparent" />
        {/* Bottom-to-top fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Outer navigation arrows */}
      <button
        onClick={prev}
        disabled={isBeginning}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/80 hover:bg-white p-3 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg transition-transform hover:scale-105"
      >
        <ChevronLeft className="h-6 w-6 text-body" />
      </button>
      <button
        onClick={next}
        disabled={isEnd}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/80 hover:bg-white p-3 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg transition-transform hover:scale-105"
      >
        <ChevronRight className="h-6 w-6 text-body" />
      </button>

      {/* Slides container */}
      <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] [perspective:1000px]">
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            transform: `translateX(calc(-100% * ${current} * (1 + 0.15))`,
            transition: "transform 0.4s ease-out",
          }}
        >
          {displayImages.map((img, idx) => (
            <div
              key={idx}
              className="relative flex-shrink-0 w-5/6 max-w-sm"
              aria-hidden={idx !== current}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${current + 1} of ${slideCount}`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={`https://roam.qodeinteractive.com${img.mediaDetails.filePath}`}
                  alt={img.mediaDetails.file}
                  fill
                  sizes="80vw"
                  className="object-cover"
                  priority={idx === 0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {Array.from({ length: slideCount }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className="h-2 w-8 rounded-full transition-all"
            style={{
              backgroundColor: idx === current ? "#ff681a" : "rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </div>

      {/* Price badge overlay */}
      {price > 0 && (
        <div className="absolute left-4 bottom-4 z-10 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-content shadow-lg">
          ${price} per person
        </div>
      )}
    </section>
  );
}
