import type { ArcData } from "@/utils/types";

type Props = {
  arc: ArcData;
  selected?: boolean;
  onAdd?: (arc: ArcData) => void;
  onRemove?: (arcId: string) => void;
};

export default function SelectableArcCard({ arc, selected, onAdd, onRemove }: Props) {
  return (
    <article
      className="group relative rounded-xl border border-white/10 bg-[var(--bg-card)] shadow-md overflow-hidden"
      aria-label={arc.arc_title}
    >
      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={`/images/arc_whole/${arc.arc_id}.jpg`}
          alt={arc.arc_title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      {/* Body */}
      <div className="p-3">
        <h3 className="line-clamp-2 text-center font-semibold text-[var(--text-light)]">{arc.arc_title}</h3>
        <p className="mt-1 text-xs text-center text-[var(--text-muted)]">{arc.day_count}-day arc</p>

        {/* Tags */}
        {arc.card_tags?.length ? (
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {arc.card_tags.slice(0, 4).map((t) => (
              <span key={t} className="rounded-full border border-white/15 px-2 py-[2px] text-[10px] text-[var(--text-muted)]">
                {t}
              </span>
            ))}
            {arc.card_tags.length > 4 && (
              <span className="rounded-full border border-white/15 px-2 py-[2px] text-[10px] text-[var(--text-muted)]">
                +{arc.card_tags.length - 4}
              </span>
            )}
          </div>
        ) : null}

        {/* Action */}
        <div className="mt-3">
          {selected ? (
            <button
              onClick={() => onRemove?.(arc.arc_id)}
              className="w-full rounded-lg border border-white/20 px-3 py-2 text-sm text-red-200 hover:bg-red-500/10"
            >
              Remove from journey
            </button>
          ) : (
            <button
              onClick={() => onAdd?.(arc)}
              className="w-full rounded-lg bg-[var(--brand-primary)] px-3 py-2 text-sm text-[var(--bg-dark)] hover:bg-[var(--hover-gold)]"
            >
              Add to journey
            </button>
          )}
        </div>
      </div>

      {/* Hover tooltip with summary + primary reading(s) */}
      {(arc.arc_summary || arc.primary_reading?.length) && (
        <div
          role="tooltip"
          className="pointer-events-none absolute left-3 top-3 z-20 hidden max-w-[280px] rounded-lg border border-white/15
                     bg-[var(--bg-card)]/95 p-3 text-xs text-[var(--text-main)] shadow-2xl backdrop-blur
                     group-hover:block"
        >
          {arc.arc_summary && <p className="mb-2 leading-snug">{arc.arc_summary}</p>}
          {Array.isArray(arc.primary_reading) && arc.primary_reading.length > 0 && (
            <div className="space-y-1">
              <p className="text-[var(--text-subtle-heading)] uppercase tracking-widest">Primary Reading</p>
              {arc.primary_reading.slice(0, 3).map((r, i) => (
                <p key={i} className="leading-snug">
                  {r}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
