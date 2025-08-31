import { CardTitle, CustomOnClickCard } from "@/components/cards/BaseCard";
import { formatDate } from "@/utils/dates";
import type { MeditationNote } from "@/utils/types";

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
        <p className="font-semibold">Error loading note: missing day metadata</p>
      </div>
    );
  }

  return (
    <CustomOnClickCard onClick={onClick} data-testid={`note-card-${note.id}`} className="!w-full !sm:max-w-sm card-onclick">
      <CardTitle title={day_title} className="!text-[var(--brand-primary-dark)] mb-1 card-title" />
      <p className="text-sm italic text-[var(--text-light)]/90">
        from <span className="underline">{arc_title}</span>
      </p>
      <p className="text-xs mt-2 text-[var(--gray-300)]/80">Last updated: {formatDate(updated_at)}</p>
    </CustomOnClickCard>
  );
}
