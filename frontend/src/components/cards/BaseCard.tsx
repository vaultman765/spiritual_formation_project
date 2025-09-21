import { Link } from "react-router-dom";

interface LinkCardProps {
  link: string;
  children: React.ReactNode; // Accepts custom JSX content
  className?: string; // Optional className for the Link
}

interface OnClickCardProps {
  onClick: () => void;
  children: React.ReactNode; // Accepts custom JSX content
  className?: string; // Optional className for the Link
}

export function CustomLinkCard({ link, children, className = "card-link" }: Readonly<LinkCardProps>) {
  return (
    <Link to={link} className={className}>
      {children}
    </Link>
  );
}

export function CustomOnClickCard({ onClick, children, className = "card-onclick" }: Readonly<OnClickCardProps>) {
  return (
    <div onClick={onClick} className={className}>
      {children}
    </div>
  );
}

export function CardImage({
  imageSrc, // original image path, e.g. "/images/arc_days/123_day_01.jpg"
  altText,
  divClassName = "card-image-container",
  imgClassName = "card-image",
}: Readonly<{
  imageSrc: string;
  altText?: string;
  divClassName?: string;
  imgClassName?: string;
}>) {
  // remove leading `/images/` and the extension
  const relativePath = imageSrc
    .replace(/^\/?images\//, "") // strip "images/"
    .replace(/\.(jpg|jpeg|png|webp|avif)$/i, ""); // strip extension

  // build paths to site_images (your optimized folder)
  const makeSrc = (ext: string, size: number) => `/images/site_images/${relativePath}-${size}.${ext}`;

  return (
    <div className={divClassName}>
      <picture>
        {/* Modern AVIF */}
        <source
          srcSet={`
            ${makeSrc("avif", 400)} 400w,
            ${makeSrc("avif", 800)} 800w,
            ${makeSrc("avif", 1200)} 1200w
          `}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          type="image/avif"
        />
        {/* WebP fallback */}
        <source
          srcSet={`
            ${makeSrc("webp", 400)} 400w,
            ${makeSrc("webp", 800)} 800w,
            ${makeSrc("webp", 1200)} 1200w
          `}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          type="image/webp"
        />
        {/* Default JPEG */}
        <img
          src={makeSrc("jpg", 800)} // mid-size default
          srcSet={`
            ${makeSrc("jpg", 400)} 400w,
            ${makeSrc("jpg", 800)} 800w,
            ${makeSrc("jpg", 1200)} 1200w
          `}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={altText}
          loading="lazy"
          decoding="async"
          className={imgClassName}
        />
      </picture>
    </div>
  );
}

export function CardTitle({ title, className = "card-title" }: Readonly<{ title: string; className?: string }>) {
  return <h2 className={className}>{title}</h2>;
}
