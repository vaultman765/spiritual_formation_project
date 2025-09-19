import { useRef, useState } from "react";
import SelectableArcCard from "@/components/cards/SelectableArcCard";
import type { ArcData } from "@/utils/types";

type Props = {
  items: ArcData[];
  onRemove: (arcId: string) => void;
  onReorder: (sourceIndex: number, destinationIndex: number) => void;
};

export default function DraggableSelectedGrid({ items, onRemove, onReorder }: Props) {
  const dragFrom = useRef<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleDragStart = (idx: number, e: React.DragEvent) => {
    dragFrom.current = idx;
    e.dataTransfer.setData("text/plain", String(idx));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (idx: number, e: React.DragEvent) => {
    e.preventDefault();
    setOverIndex(idx);
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (idx: number, e: React.DragEvent) => {
    e.preventDefault();
    const from = dragFrom.current;
    dragFrom.current = null;
    setOverIndex(null);
    if (from === null || from === idx) return;
    onReorder(from, idx);
  };

  const handleDragEnd = () => {
    dragFrom.current = null;
    setOverIndex(null);
  };

  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      role="list"
      aria-label="Selected arcs (drag to reorder)"
    >
      {items.map((arc, idx) => {
        const dragging = dragFrom.current === idx;
        const showTarget = overIndex === idx && !dragging;

        return (
          <div
            key={arc.arc_id}
            role="listitem"
            draggable
            onDragStart={(e) => handleDragStart(idx, e)}
            onDragOver={(e) => handleDragOver(idx, e)}
            onDrop={(e) => handleDrop(idx, e)}
            onDragEnd={handleDragEnd}
            className={`relative rounded-xl transition ${dragging ? "opacity-70 ring-2 ring-yellow-400" : ""} ${
              showTarget ? "ring-2 ring-white/30" : ""
            }`}
          >
            {/* order badge */}
            <div className="absolute -left-2 -top-2 z-10 h-6 w-6 select-none rounded-full bg-yellow-400 text-black grid place-items-center text-xs font-bold shadow">
              {idx + 1}
            </div>

            {/* grab hint */}
            <div className="absolute right-2 top-2 z-10 select-none rounded bg-black/30 px-2 py-1 text-[10px] text-white">⇅ drag</div>

            <SelectableArcCard arc={arc} selected onRemove={onRemove} />

            {/* Keyboard / mobile fallback controls */}
            <div className="mt-2 flex items-center justify-between gap-2">
              <button
                className="flex-1 rounded border border-white/20 px-2 py-1 text-xs text-[var(--text-muted)] hover:bg-white/5"
                onClick={() => idx > 0 && onReorder(idx, idx - 1)}
                aria-label={`Move ${arc.arc_title} up`}
              >
                ↑ Move up
              </button>
              <button
                className="flex-1 rounded border border-white/20 px-2 py-1 text-xs text-[var(--text-muted)] hover:bg-white/5"
                onClick={() => idx < items.length - 1 && onReorder(idx, idx + 1)}
                aria-label={`Move ${arc.arc_title} down`}
              >
                ↓ Move down
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
