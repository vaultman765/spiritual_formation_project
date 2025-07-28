import { Draggable, Droppable, DragDropContext } from "@hello-pangea/dnd";
import TooltipWrapper from "@/components/common/TooltipWrapper";
import { CustomJourneyArcCard } from "@/components/cards/ArcCard";
import type { ArcData } from "@/utils/types";
import ArcCardWithTooltip from "@/components/cards/ArcCardWithTooltip";

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
                    <ArcCardWithTooltip
                      arc={arc}
                      onSelect={onSelect}
                      onRemove={onRemove}
                    />
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
