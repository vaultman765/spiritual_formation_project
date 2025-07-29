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

export function CustomLinkCard({
  link,
  children,
  className = 'card-link'
}: LinkCardProps) {
  return (
    <Link
      to={link}
      className={className}
    >
      {children}
    </Link>
  );
}

export function CustomOnClickCard({
  onClick,
  children,
  className = 'card-onclick'
}: OnClickCardProps) {
  return (
    <div
    onClick={onClick}
    className={className}
    >
      {children}
    </div>
  );
}

export function CardImage(
  { imageSrc, altText, divClassName = 'card-image-container', imgClassName = 'card-image' }:
  { imageSrc: string; altText?: string; divClassName?: string; imgClassName?: string }) {
  return (
    <div className={divClassName}>
      <img src={imageSrc} alt={altText} className={imgClassName} />
    </div>
  );

}

export function CardTitle({ title, className = 'card-title' }: { title: string; className?: string }) {
  return (
      <h2 className={className}>{title}</h2>
  );
}
