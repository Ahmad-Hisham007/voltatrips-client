interface LocationTabProps {
  location?: string;
  tripLocationSubtitle?: string;
  tripLocationDescription?: string;
}

export function LocationTab({
  location = "New South Wales, Australia",
  tripLocationSubtitle,
  tripLocationDescription,
}: LocationTabProps) {
  const mapQuery = encodeURIComponent(location);
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=7&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="w-full space-y-8 font-sans">
      {/* 1. Google Map Embed Container */}
      <div className="w-full h-[380px] sm:h-[450px] bg-gray-100 overflow-hidden border border-gray-200">
        <iframe
          title={`Map location for ${location}`}
          src={mapEmbedUrl}
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
        />
      </div>

      {/* 2. Content Section */}
      <div className="space-y-4">
        {/* Main Section Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-heading tracking-tight">
          Tour Location
        </h2>

        {/* Subtitle (HTML Content inside h5/p) */}
        {tripLocationSubtitle && (
          <div
            className="sm:text-lg font-bold italic text-primary leading-relaxed [&_h5]:sm:text-lg [&_h5]:font-bold [&_h5]:italic [&_h5]:text-primary font-display"
            dangerouslySetInnerHTML={{ __html: tripLocationSubtitle }}
          />
        )}

        {/* Description (HTML Content inside p / div) */}
        {tripLocationDescription && (
          <div
            className="space-y-4 text-sm text-body font-light leading-relaxed [&_p]:mb-4 [&_.vc_empty_space]:h-4"
            dangerouslySetInnerHTML={{ __html: tripLocationDescription }}
          />
        )}
      </div>
    </div>
  );
}

export default LocationTab;
