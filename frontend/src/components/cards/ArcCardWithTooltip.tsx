import TooltipWrapper from "@/components/common/TooltipWrapper";
import { CustomJourneyArcCard } from "@/components/cards/ArcCard";
import type { ArcData } from "@/utils/types";

interface ArcCardWithTooltipProps {
  arc: ArcData;
  onSelect?: (arc: ArcData) => void;
  onRemove?: (arcId: string) => void;
}

export default function ArcCardWithTooltip({
  arc,
  onSelect,
  onRemove,
}: ArcCardWithTooltipProps) {
  return (
    <div className="relative mb-2">
      {onRemove && (
        <button
          onClick={() => onRemove(arc.arc_id)}
          className="absolute top-1 right-1 text-sm text-red-400 hover:text-red-600 z-10"
        >
          ✕
        </button>
      )}
      <TooltipWrapper
        content={
          <>
            <p className="font-bold mb-1">{arc.arc_title}</p>
            <p className="italic text-sm mb-1 text-gray-300">
              {arc.primary_reading?.join(", ") || "No readings available"}
            </p>
            <p className="text-sm text-white">
              {arc.arc_summary || "No summary available"}
            </p>
          </>
        }
      >
        <div onClick={() => onSelect?.(arc)} className="cursor-pointer">
          <CustomJourneyArcCard arc={arc} />
        </div>
      </TooltipWrapper>
    </div>
  );
}
