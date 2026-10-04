"use client";

import { useState } from "react";
import Image from "next/image";
import LightboxModal from "@/components/Lightbox/LightboxModal";

export interface GalleryImage {
  mediaDetails: {
    file: string;
    filePath: string;
    width: number;
    height: number;
  };
}

interface GalleryTabProps {
  images: GalleryImage[];
}

// Image URL Formatter Helper
export const getImageUrl = (filePath: string) => {
  if (!filePath) return "";
  return filePath.startsWith("/")
    ? `https://cms.voltatrips.com${filePath}`
    : filePath;
};

export default function GalleryTab({ images }: GalleryTabProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No images available in this gallery.
      </div>
    );
  }

  return (
    <>
      {/* 
        Masonry Grid Layout (Matching screenshot):
        - Columns: 1 on mobile, 2 on sm, 3 on lg
        - Gap between items: 16px (gap-4)
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, index) => {
          const imageUrl = getImageUrl(img.mediaDetails.filePath);

          return (
            <div
              key={img.mediaDetails.filePath || index}
              onClick={() => setSelectedIndex(index)}
              className="group relative cursor-pointer overflow-hidden rounded-md bg-muted transition-all hover:opacity-95"
            >
              <Image
                src={imageUrl}
                alt={`Gallery image ${index + 1}`}
                width={img.mediaDetails.width || 800}
                height={img.mediaDetails.height || 600}
                className="h-auto w-full transform object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Overlay tint on hover */}
              <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          );
        })}
      </div>
      Lightbox Slider Modal Layer
      {selectedIndex !== null && (
        <LightboxModal
          images={images}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  );
}
