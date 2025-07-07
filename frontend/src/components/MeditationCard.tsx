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
      className="!no-underline block rounded-2xl border border-[var(--brand-primary-dark)] bg-[var(--bg-card)]/75 p-4 shadow-md shadow-black/20 hover:scale-[1.01] hover:shadow-lg hover:shadow-yellow-400/20 transition-all duration-200 flex flex-col items-center text-center hover:ring-2 hover:ring-yellow-400/30"
    >
      <p className="text-xs uppercase text-[var(--text-subtle-heading)] mb-1">{subtitle}</p>
      <h2 className="text-lg font-semibold text-[var(--text-light)]">{title}</h2>
      <div className="max-h-[400px] w-full px-4 flex justify-center items-center rounded-xl mb-3">
        <img
          src={imageSrc}
          alt={altText}
          className="max-h-[400px] max-w-full object-contain"
        />
      </div>
      {tag && (
        <div className="flex justify-center gap-2">
          <span className="text-xs text-[var(--text-main)] bg-[var(--badge-bg)] border border-[var(--badge-border)] px-2 py-1 rounded-full">
            {tag}
          </span>
        </div>
      )}
    </Link>
  );
}