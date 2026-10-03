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
                ? `https://cms.voltatrips.com${img.mediaDetails.filePath}`
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

export default GalleryTab;
