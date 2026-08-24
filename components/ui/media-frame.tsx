import Image from "next/image";

type MediaFrameProps = {
  src?: string;
  alt: string;
  /** CSS aspect ratio, e.g. "3 / 4". */
  ratio?: string;
  caption?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imageClassName?: string;
};

/**
 * The photography well. Enforces the greyscale treatment; falls back to a
 * hatched placeholder with a caption when no source exists.
 */
export function MediaFrame({
  src,
  alt,
  ratio = "3 / 4",
  caption,
  priority = false,
  sizes = "(max-width: 900px) 100vw, 33vw",
  className = "",
  imageClassName = "",
}: MediaFrameProps) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-photo-grey ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`kire-photo object-cover ${imageClassName}`}
        />
      ) : (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(11,11,11,.06) 0 8px, transparent 8px 16px)",
            }}
          />
          {caption && (
            <span className="kire-label absolute bottom-3 left-3 text-ink-500">
              {caption}
            </span>
          )}
        </>
      )}
    </div>
  );
}
