import type { ArcData } from '@/utils/types';

type ArcCardProps = {
  arc: ArcData;
  onClick?: () => void;
};

export default function ArcCard({ arc, onClick }: ArcCardProps) {
  const { arc_title, day_count, card_tags } = arc;
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg bg-purple-800 hover:bg-purple-700 border border-purple-600 p-4 shadow transition-colors duration-200"
    >
      <h3 className="text-white font-semibold text-lg mb-1">{arc_title}</h3>
      <p className="text-sm text-violet-300 mb-2">{day_count}-day arc</p>
      <div className="flex flex-wrap gap-2">
        {card_tags?.map((tag) => (
          <span
              key={tag}
              className="text-xs bg-purple-600 text-white rounded-full px-2 py-0.5"
          >
              {tag}
          </span>
          ))}
      </div>
    </div>
  );
};
