
import type { MeditationNote } from '@/utils/types';

interface NoteCardProps {
  note: MeditationNote;
  onClick: () => void;
}

export default function NoteCard({ note, onClick }: NoteCardProps) {
  const { meditation_day_full, updated_at } = note;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!meditation_day_full) {
    return (
      <div className="bg-red-500 text-white p-4 rounded">
        <p className="font-semibold">Error loading note: missing day metadata</p>
      </div>
    );
  }

  const { arc_title, day_title } = meditation_day_full;

  return (
    <div
      className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/10 p-5 shadow-md hover:shadow-lg transition-all cursor-pointer backdrop-blur-sm"
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold text-yellow-300 leading-snug mb-1">
        {day_title}
      </h3>
      <p className="text-sm italic text-white/70">
        from <span className="underline">{arc_title}</span>
      </p>
      <p className="text-xs mt-2 text-white/50">
        Last updated: {formatDate(updated_at)}
      </p>
    </div>
  );
}