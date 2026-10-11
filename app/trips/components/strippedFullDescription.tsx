"use client";
import React, { useEffect, useRef, useState } from "react";

const StrippedFullDescription = ({
  tripFullDescription,
}: {
  tripFullDescription: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState<number | undefined>(
    undefined,
  );
  const contentRef = useRef<HTMLDivElement>(null);

  // Measure full height safely after mount/content change
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [tripFullDescription]);

  return (
    <div className="relative mb-4">
      <div
        style={{
          // Tighter collapsed height (125px) removes the extra blank lines spacing
          maxHeight: isExpanded ? `${contentHeight}px` : "125px",
        }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div
          ref={contentRef}
          dangerouslySetInnerHTML={{
            __html: tripFullDescription,
          }}
          className={`[&_h1]:text-4xl! [&_h2]:text-3xl! [&_h3]:text-2xl! [&_h4]:text-xl! [&_h5]:text-lg! [&_h6]:text-[16px]! [&_h1,h2,h3,h4,h5,h6,img]:mb-4 [&_img]:w-full ${
            !isExpanded ? "line-clamp-6" : ""
          }`}
        />
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 inline-flex gap-2 items-center rounded-lg bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary cursor-pointer"
      >
        {isExpanded ? "Read Less" : "Read More"}
      </button>
    </div>
  );
};

export default StrippedFullDescription;
