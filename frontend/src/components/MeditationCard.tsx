import React from "react";
import { Link } from "react-router-dom";

interface MeditationCardProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  altText: string;
  link: string;
  tag?: string;
}

export default function MeditationCard({
  title,
  subtitle,
  imageSrc,
  altText,
  link,
  tag,
}: MeditationCardProps) {
  return (
    <Link
      to={link}
      className="homepage-section-link"
    >
      <p className="text-xs uppercase text-[var(--text-subtle-heading)] mb-1">{subtitle}</p>
      <h2 className="text-lg font-semibold text-[var(--text-light)]">{title}</h2>
      <div className="meditation-image-container">
        <img
          src={imageSrc}
          alt={altText}
          className="meditation-image"
        />
      </div>
      {tag && (
        <div className="flex justify-center gap-2">
          <span className="tag-pill-arc">
            {tag}
          </span>
        </div>
      )}
    </Link>
  );
}