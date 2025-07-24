import type { MeditationNote } from "@/utils/types";
import { formatDate } from "@/utils/dates";
import { CustomOnClickCard, CardTitle } from "@/components/cards/BaseCard";

interface NoteCardProps {
  note: MeditationNote;
  onClick: () => void;
}

export default function NoteCard({ note, onClick }: NoteCardProps) {
  const { meditation_day_full, updated_at } = note;
  const { arc_title, day_title } = meditation_day_full;

  if (!meditation_day_full) {
    return (
      <div className="bg-red-500 text-white p-4 rounded">
        <p className="font-semibold">
          Error loading note: missing day metadata
        </p>
      </div>
    );
  }

  return (
    <CustomOnClickCard onClick={onClick}>
      <CardTitle
        title={day_title}
        className="!text-yellow-300 mb-1 card-title"
      />
      <p className="text-sm italic text-white/70">
        from <span className="underline">{arc_title}</span>
      </p>
      <p className="text-xs mt-2 text-white/50">
        Last updated: {formatDate(updated_at)}
      </p>
    </CustomOnClickCard>
  );
}
