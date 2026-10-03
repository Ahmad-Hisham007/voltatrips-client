import { Trip } from "@/lib/queries/trip";
import { Check } from "lucide-react";

interface ItineraryItem {
  day: number;
  title: string;
  content?: string;
  description?: string;
  highlights?: string[];
  bulletType?: "check" | "square";
}

export function TourPlanTab({
  itinerary,
}: {
  itinerary: Trip["tripFields"]["tripItinerary"];
}) {
  return (
    <div className="relative pl-14 sm:pl-16 flex flex-col gap-10">
      {/* Vertical Dashed Timeline Line */}
      <div className="absolute left-[21px] sm:left-[23px] top-6 bottom-6 w-0 border-l-2 border-dashed border-gray-200" />

      {itinerary.map((item, index) => {
        const dayNumber = item.day ?? index + 1;
        const htmlContent = item.content;

        return (
          <div key={dayNumber} className="relative flex flex-col gap-3">
            {/* Number Circle Badge */}
            <div className="absolute -left-14 sm:-left-16 top-0 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-content text-lg font-bold shadow-xs">
              {dayNumber}
            </div>

            {/* Day Title */}
            <h3 className="text-heading text-lg sm:text-xl font-bold font-sans tracking-tight pt-1.5 leading-snug">
              Day {dayNumber}: {item.title}
            </h3>

            {/* Content (with Tailwind prose for CMS HTML strings) */}
            {htmlContent && (
              <div
                className="text-body text-[15px] leading-relaxed prose prose-neutral max-w-none 
                  [&_ul]:mt-3 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2.5 [&_ul]:list-none [&_ul]:pl-0 
                  [&_li]:relative [&_li]:pl-6 [&_li]:text-[15px] [&_li]:text-body 
                  [&_li]:before:content-['✓'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-0 [&_li]:before:font-bold [&_li]:before:text-primary"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            )}

            {/* Structured Highlights Fallback (if item has a highlights array) */}
            {"highlights" in item &&
              Array.isArray(item.highlights) &&
              item.highlights.length > 0 && (
                <ul className="mt-1 flex flex-col gap-2.5">
                  {item.highlights.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-body text-[15px]"
                    >
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5 stroke-[2.5]" />

                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
          </div>
        );
      })}
    </div>
  );
}
