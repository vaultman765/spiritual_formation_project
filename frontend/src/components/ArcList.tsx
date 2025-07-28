import { Draggable, Droppable, DragDropContext } from "@hello-pangea/dnd";
import TooltipWrapper from "@/components/common/TooltipWrapper";
import { CustomJourneyArcCard } from "@/components/cards/ArcCard";
import type { ArcData } from "@/utils/types";

interface ArcListProps {
  arcs: ArcData[];
  onReorder?: (sourceIndex: number, destinationIndex: number) => void;
  onRemove?: (arcId: string) => void;
  onSelect?: (arc: ArcData) => void; // New prop for click-to-select
}

export function ArcList({ arcs, onReorder, onRemove, onSelect }: ArcListProps) {
  return (
    <DragDropContext
      onDragEnd={(result) => {
        if (!result.destination || !onReorder) return;
        onReorder(result.source.index, result.destination.index);
      }}
    >
      <Droppable droppableId="arc-list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {arcs.map((arc, index) => (
              <Draggable
                key={arc.arc_id}
                draggableId={arc.arc_id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="relative mb-2"
                  >
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
                            {arc.primary_reading.join(", ")}
                          </p>
                          <p className="text-sm text-white">
                            {arc.arc_summary}
                          </p>
                        </>
                      }
                    >
                      <div
                        onClick={() => onSelect?.(arc)} // Handle click-to-select
                        className="cursor-pointer"
                      >
                        <CustomJourneyArcCard arc={arc} />
                      </div>
                    </TooltipWrapper>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
