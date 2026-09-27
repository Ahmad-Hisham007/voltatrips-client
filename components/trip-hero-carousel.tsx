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

const SWIPE_THRESHOLD = 50;

export function TripHeroCarousel({ images = [], price = 0 }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  // Fallback to placeholder if no images
  const displayImages =
    images.length > 0
      ? images
      : [
          {
            mediaDetails: {
              file: "placeholder",
              filePath: "/placeholder.jpg",
              width: 1600,
              height: 900,
            },
          },
        ];

  // Carousel state helpers
  const slideCount = displayImages.length;
  const isBeginning = current === 0;
  const isEnd = current === slideCount - 1;

  const prev = () => setCurrent((c) => (c <= 0 ? 0 : c - 1));
  const next = () => setCurrent((c) => (c >= slideCount - 1 ? slideCount - 1 : c + 1));

  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.touches[0].clientX);

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStart - e.touches[0].clientX;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta > 0) next();
      else prev();
    }
    setTouchStart(0);
  };

  return (
    <section
      className="relative mx-auto max-w-6xl px-4 py-8 font-sans"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Trip image carousel"
    >
      {/* Carousel outer wrapper with rounded shadow edge and inner-shadow vignette */}
      <div className="relative rounded-2xl bg-black/20 shadow-2xl ring-1 ring-white/10">
        {/* Inner shadow vignette overlay — rounded edges, inner shadow fading from sides + bottom */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            boxShadow:
              "inset 32px 0 32px -24px rgba(0,0,0,0.45), inset -32px 0 32px -24px rgba(0,0,0,0.45), inset 0 48px 48px -32px rgba(0,0,0,0), inset 0 -64px 80px -32px rgba(0,0,0,0.65)",
          }}
          aria-hidden="true"
        />

        {/* Slides container — centered, one main slide with 15% peek peeks */}
        <div className="relative flex h-64 w-full items-center justify-center overflow-hidden sm:h-80 md:h-96 lg:h-[500px]">
          {/* We use opacity/transform to show current as full, adjacent as peek */}
          {displayImages.map((img, idx) => {
            const offset = idx - current;
            // Show main slide at full opacity; adjacent at 15% peek
            const isVisible = Math.abs(offset) <= 1;
            const scale = Math.abs(offset) === 1 ? 0.85 : 1;
            const opacity = Math.abs(offset) === 1 ? 0.6 : 1;
            const filter = Math.abs(offset) === 1 ? "blur(1px)" : "none";
            const translate =
              offset === 0
                ? "translateX(0)"
                : offset < 0
                ? "translateX(-15%)"
                : "translateX(15%)";

            if (!isVisible) return null;

            return (
              <div
                key={idx}
                className="absolute inset-0 m-auto h-full w-5/6 max-w-sm rounded-lg shadow-xl"
                style={{
                  opacity: idx === current ? 1 : opacity,
                  transform: `${translate} scale(${scale})`,
                  filter,
                  transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
                  pointerEvents: idx === current ? "auto" : "none",
                }}
                aria-roledescription="slide"
                aria-label={`Slide ${idx + 1} of ${slideCount}`}
              >
                <Image
                  src={`https://cms.voltatrips.com${img.mediaDetails.filePath}`}
                  alt={img.mediaDetails.file || "Trip image"}
                  fill
                  sizes="80vw"
                  className="object-cover"
                  priority={idx === 0}
                />
              </div>
            );
          })}

          {/* Fallback image when no images — shows a nice placeholder */}
          {displayImages.length === 1 && displayImages[0].mediaDetails.file === "placeholder" && (
            <div className="absolute inset-0 flex items-center justify-center text-center text-gray-400">
              <span>No images available</span>
            </div>
          )}
        </div>

        {/* Outer navigation arrows — large, centered on the left/right sides */}
        <button
          onClick={prev}
          disabled={isBeginning}
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 rounded-full bg-white/90 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed p-4 shadow-lg transition-transform hover:scale-105"
        >
          <ChevronLeft className="h-7 w-7 text-gray-800" />
        </button>
        <button
          onClick={next}
          disabled={isEnd}
          aria-label="Next slide"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 rounded-full bg-white/90 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed p-4 shadow-lg transition-transform hover:scale-105"
        >
          <ChevronRight className="h-7 w-7 text-gray-800" />
        </button>

        {/* Progress dots centered at the bottom */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-20">
          {displayImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className="h-2.5 w-10 rounded-full transition-all"
              style={{
                backgroundColor:
                  idx === current ? "#ff681a" : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Price badge at bottom-left, overlaid on the rounded container edge */}
      {price > 0 && (
        <div className="absolute bottom-4 left-4 z-20 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-content shadow-md">
          ${price} per person
        </div>
      )}
    </section>
  );
}
