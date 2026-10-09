"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { StarRating } from "./ui/star-rating";

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
  title?: string;
  duration?: number;
  rating?: number;
};

export function TripHeroCarousel({
  images = [],
  price = 0,
  title,
  duration,
  rating,
}: CarouselProps) {
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

  return (
    <section className="w-full font-sans sticky top-0 z-10">
      {/* Outer wrapper with background and fixed/responsive height */}
      <div className="relative w-full h-87.5 sm:h-112.5 md:h-125 lg:h-180 bg-black/20 ring-1 ring-white/10 overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination]}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          loop={true}
          speed={1000}
          pagination={{ clickable: true }}
          watchSlidesProgress={true}
          navigation={true}
          className="w-full h-full py-6 
    [&_.swiper-button-next]:text-white 
    [&_.swiper-button-prev]:text-white
    [&_.swiper-button-next]:z-80!
    [&_.swiper-button-prev]:z-90!
    [&_.swiper-pagination]:z-50!
    [&_.swiper-pagination-bullet]:bg-white!
    [&_.swiper-pagination-bullet-active]:bg-primary!
    [&_.swiper-pagination-bullet-active]:w-6!
    [&_.swiper-pagination-bullet-active]:rounded-2xl! 
    [&_.swiper-slide]:transition-[filter,opacity] 
    [&_.swiper-slide]:duration-1000 
    [&_.swiper-slide]:ease-[cubic-bezier(0.25,1,0.5,1)]
    [&_.swiper-slide]:will-change-[filter,opacity] 
    [&_.swiper-slide]:opacity-80 
    [&_.swiper-slide]:brightness-75 
    [&_.swiper-slide-active]:opacity-100! 
    [&_.swiper-slide-active]:brightness-100!
    [&_.swiper-slide-active]:transition-[filter,opacity] 
    [&_.swiper-slide-active]:duration-1000
    [--swiper-navigation-color:#fff]
  [&_.swiper-pagination]:hidden
  [&_.swiper-pagination]:md:block
  "
        >
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: `
        linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.6) 35%, transparent 70%),
        linear-gradient(to right, rgba(0, 0, 0, 0.7) 0%, transparent 20%),
        linear-gradient(to left, rgba(0, 0, 0, 0.7) 0%, transparent 20%)
      `,
            }}
            aria-hidden="true"
          />
          {/* Title badge */}
          {title && (
            <div className="absolute w-full top-6/12 left-6/12 -translate-y-6/12 -translate-x-6/12  px-10 text-center font-bold text-white z-15">
              <h1 className="md:text-8xl text-4xl text-center font-bold text-white">
                {title}
              </h1>
              <Image
                src={"/separator.png"}
                width={500}
                height={70}
                className="max-w-50 md:max-w-full mx-auto mt-3"
                alt="separator"
              />
            </div>
          )}
          {displayImages.map((img, idx) => {
            // Image URL Safety Check
            const imageSrc = img.mediaDetails.filePath.startsWith("http")
              ? img.mediaDetails.filePath
              : `https://cms.voltatrips.com${img.mediaDetails.filePath}`;

            return (
              <SwiperSlide
                key={idx}
                className="w-[75%]! h-full overflow-hidden my-auto relative"
              >
                <Image
                  src={imageSrc}
                  alt={img.mediaDetails.file || "Trip image"}
                  fill
                  sizes="85vw"
                  className="object-cover object-center"
                  priority={idx === 0}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Price badge */}
      {price > 0 && (
        <div className="absolute bottom-4 z-30  px-4 italic font-display md:text-xl text-[16px] font-extrabold text-white ">
          Price {price} / {duration} days
        </div>
      )}
      {/* Rating badge */}
      {rating && (
        <div className="absolute bottom-4 right-0 z-30  px-4 italic font-display md:text-xl text-[16px] font-extrabold text-white ">
          <StarRating
            value={(rating / 10) * 5}
            max={5}
            size={18}
            className="text-white stroke-white! [&_svg]:stroke-white!"
          />
        </div>
      )}
    </section>
  );
}
