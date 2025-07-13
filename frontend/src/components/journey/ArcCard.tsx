import type { ArcData } from '@/utils/types';
import { formatTagLabel } from '@/utils/tagDisplay';

type ArcCardProps = {
  arc: ArcData;
  onClick?: () => void;
};

export default function ArcCard({ arc, onClick }: ArcCardProps) {
  const { arc_title, day_count, card_tags } = arc;
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg bg-purple-800 hover:bg-purple-700 border border-yellow-400/70 p-4 shadow transition-colors transition-transform duration-150 hover:scale-[1.02]"
    >
      <h3 className="text-white font-display text-lg">{arc_title}</h3>
      <p className="text-sm text-violet-300 italic mb-2">{day_count}-day arc</p>
      <div className="flex flex-wrap gap-2">
        {card_tags?.map((tag) => (
          <span
            key={tag}
            className="bg-[var(--brand-primary-dark)] text-black px-2 py-1 text-xs rounded-full"
          >
            {formatTagLabel(tag)}
          </span>
          ))}
      </div>
    </div>
  );
};
