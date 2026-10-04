"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import {
  GalleryImage,
  getImageUrl,
} from "../../app/trips/components/GalleryTab";

interface LightboxModalProps {
  images: GalleryImage[];
  initialIndex: number;
  onClose: () => void;
}

export default function LightboxModal({
  images,
  initialIndex,
  onClose,
}: LightboxModalProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(
    null,
  );
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      {/* Outer Click Backdrop to Close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Lightbox Content Box (Matching Screenshot UI) */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-sm bg-white shadow-2xl">
        {/* Fullscreen Icon Top Right Overlay */}
        <button
          onClick={() => {
            const elem = document.documentElement;
            if (!document.fullscreenElement) {
              elem.requestFullscreen?.();
            } else {
              document.exitFullscreen?.();
            }
          }}
          className="absolute right-3 top-3 z-20 rounded p-1.5 text-white bg-black/40 hover:bg-black/60 transition-colors"
          title="Toggle Fullscreen"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </button>

        {/* Swiper Image Container */}
        <div className="relative flex-1 bg-neutral-900">
          <Swiper
            modules={[Navigation, Keyboard]}
            initialSlide={initialIndex}
            keyboard={{ enabled: true }}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
            className="h-[60vh] md:h-[70vh] w-full"
          >
            {images.map((img, idx) => {
              const url = getImageUrl(img.mediaDetails.filePath);
              return (
                <SwiperSlide
                  key={idx}
                  className="flex items-center justify-center p-2"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={url}
                      alt={`Slide ${idx + 1}`}
                      fill
                      className="object-contain"
                      priority={idx === initialIndex}
                      sizes="(max-width: 1200px) 100vw, 1200px"
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Bottom Control Bar (Matching Screenshot UI) */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-white px-6 py-3 text-gray-700">
          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => swiperInstance?.slidePrev()}
              disabled={currentIndex === 0}
              className="p-1 text-gray-600 hover:text-black disabled:opacity-30 transition-colors"
              aria-label="Previous Image"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => swiperInstance?.slideNext()}
              disabled={currentIndex === images.length - 1}
              className="p-1 text-gray-600 hover:text-black disabled:opacity-30 transition-colors"
              aria-label="Next Image"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Dynamic Counter (e.g. 3/9) */}
          <span className="text-xs font-medium text-gray-500 tracking-wider">
            {currentIndex + 1} / {images.length}
          </span>

          {/* Close Button (X) */}
          <button
            onClick={onClose}
            className="p-1 text-gray-600 hover:text-black transition-colors"
            aria-label="Close Lightbox"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
