import { Link } from "react-router-dom";
import type { ArcData } from "@/utils/types";
import { formatTagLabel } from '@/utils/tagDisplay';

interface ArcCardProps {
  arc: ArcData;
}

export default function ArcCard({ arc }: ArcCardProps) {
  const { arc_id, arc_title, day_count, card_tags } = arc;
  return (
    <Link
      key={arc_id}
      to={`/arcs/${arc_id}`}
      className="homepage-section-link"
    >
      <h2 className="text-lg font-semibold text-[var(--text-light)]">{arc_title}</h2>
      <div className="!mb-0 meditation-image-container">
        <img
          src={`/images/arc_whole/${arc_id}.jpg`}
          alt={arc_title}
          className="h-70 meditation-image"
        />
      </div>
      <div className="text-sm text-[var(--text-subtle-heading)]">{day_count}-day arc</div>
      <div className="flex flex-wrap gap-2 mt-1 justify-center">
        {card_tags.map((tag) => (
          <span
            key={tag}
            className="bg-[var(--brand-primary-dark)] text-black px-2 py-1 text-xs rounded-full"
          >
            {formatTagLabel(tag)}
          </span>
        ))}
      </div>
    </Link>
  );
}