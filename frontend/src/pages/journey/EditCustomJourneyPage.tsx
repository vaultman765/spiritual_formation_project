// components/journey/CustomJourneyEditor.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useJourney } from "@/context/journeyContext";
import TooltipWrapper from "@/components/common/TooltipWrapper";
import { CustomJourneyArcCard } from "@/components/cards/ArcCard";
import type { ArcData } from "@/utils/types";

export default function CustomJourneyEditor() {
  const { activeJourney, updateJourney, refreshJourneys } = useJourney();
  const [availableArcs, setAvailableArcs] = useState<ArcData[]>([]);
  const [selectedArcs, setSelectedArcs] = useState<ArcData[]>([]);
  const [title, setTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch arcs
  useEffect(() => {
    fetch("/api/arcs/")
      .then((res) => res.json())
      .then((data) => setAvailableArcs(data));
  }, []);

  // Prefill form with current journey data
  useEffect(() => {
    if (activeJourney) {
      setTitle(activeJourney.title);
      const selected = activeJourney.arc_progress
        .map((arc) => availableArcs.find((a) => a.arc_id === arc.arc_id))
        .filter(Boolean) as ArcData[];
      setSelectedArcs(selected);
    }
  }, [activeJourney, availableArcs]);

  const displayAvailableArcs = availableArcs.filter(
    (arc) =>
      !selectedArcs.some((sel) => sel.arc_id === arc.arc_id) &&
      (arc.arc_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        arc.card_tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  const handleSelectedReorder = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const reordered = [...selectedArcs];
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    setSelectedArcs(reordered);
  };

  const handleUpdate = async () => {
    if (!activeJourney || selectedArcs.length === 0) return;

    const confirmUpdate = window.confirm(
      "This will reset the progress of your journey. All current arc progress will be lost.\n\nDo you want to continue?"
    );

    if (!confirmUpdate) return;

    try {
      await updateJourney(
        activeJourney.id,
        title,
        selectedArcs.map((arc, index) => ({
          arc_id: arc.arc_id,
          arc_title: arc.arc_title,
          current_day: 1,
          status: index === 0 ? "in_progress" : "upcoming",
          order: index,
          day_count: arc.day_count,
        }))
      );

      await refreshJourneys(); // refresh context
      navigate("/my-journey");
    } catch (err) {
      console.error("Failed to update journey:", err);
    }
  };

  return (
    <main>
      <div className="text-center mb-4 text-[var(--text-main)]">
        <h1 className="text-5xl font-display font-semibold mb-2">
          Edit Custom Journey
        </h1>
        <p className="text-lg text-white/70 max-w-2xl mx-auto">
          Add, remove, or reorder arcs in your journey.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-4">
        <input
          type="text"
          placeholder="Journey Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-style placeholder-white/70"
        />
      </div>

      <hr className="mt-4 mb-4 border-white/20" />

      <div className="grid grid-cols-2 max-w-7xl mx-auto">
        {/* Search and Available Arcs Title */}
        <div className="text-center">
          <h2 className="text-2xl text-[var(--brand-primary)] font-semibold mb-2 relative inline-block after:content-[''] after:block after:h-[2px] after:w-8 after:bg-[var(--brand-primary)] after:mt-1 after:mx-auto">
            Available Arcs
          </h2>
        </div>

        {/* Selected Arcs Title */}
        <div className="text-center">
          <h2 className="text-2xl text-[var(--brand-primary)] font-semibold mb-2 relative inline-block after:content-[''] after:block after:h-[2px] after:w-8 after:bg-[var(--brand-primary)] after:mt-1 after:mx-auto">
            Selected Arcs
          </h2>
        </div>

        <div className="mb-4 col-span-2 justify-self-center">
          <input
            type="text"
            placeholder="Search Available Arcs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-style placeholder-white/70"
          />
        </div>

        {/* Available Arcs */}
        <div className="flex flex-col max-h-[65vh] overflow-y-auto p-4 rounded-xl bg-[var(--bg-card)] border border-white/10 shadow-inner mx-4">
          <div className="gap-4">
            {displayAvailableArcs.map((arc) => (
              <div
                key={arc.arc_id}
                onClick={() => setSelectedArcs([...selectedArcs, arc])}
                className="cursor-pointer"
              >
                <TooltipWrapper
                  content={
                    <>
                      <p className="font-bold mb-1">{arc.arc_title}</p>
                      <p className="italic text-sm mb-1 text-gray-300">
                        {arc.primary_reading.join(", ")}
                      </p>
                      <p className="text-sm text-white">{arc.arc_summary}</p>
                    </>
                  }
                >
                  <div className="mb-2 transition duration-200 hover:scale-[1.01] hover:ring-2 hover:ring-yellow-400/40 hover:shadow-lg hover:shadow-yellow-400/20 rounded-xl">
                    <CustomJourneyArcCard arc={arc} key={arc.arc_id} />
                  </div>
                </TooltipWrapper>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Arcs with drag-to-reorder */}
        <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto p-4 rounded-xl bg-[var(--bg-card)] border border-white/10 shadow-inner mx-4">
          <DragDropContext onDragEnd={handleSelectedReorder}>
            <Droppable droppableId="selected-arcs">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="gap-4"
                >
                  {selectedArcs.map((arc, index) => (
                    <Draggable
                      draggableId={arc.arc_id}
                      index={index}
                      key={arc.arc_id}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="relative mb-2"
                        >
                          {/* Remove button */}
                          <button
                            onClick={() =>
                              setSelectedArcs(
                                selectedArcs.filter(
                                  (a) => a.arc_id !== arc.arc_id
                                )
                              )
                            }
                            className="absolute top-1 right-1 text-sm text-red-400 hover:text-red-600 z-10"
                          >
                            ✕
                          </button>
                          <TooltipWrapper
                            content={
                              <>
                                <p className="font-bold mb-1">
                                  {arc.arc_title}
                                </p>
                                <p className="italic text-sm mb-1 text-gray-300">
                                  {arc.primary_reading.join(", ")}
                                </p>
                                <p className="text-sm text-white">
                                  {arc.arc_summary}
                                </p>
                              </>
                            }
                          >
                            <div className="transition duration-200 hover:scale-[1.01] hover:ring-2 hover:ring-yellow-400/40 hover:shadow-lg hover:shadow-yellow-400/20 rounded-xl">
                              <CustomJourneyArcCard
                                arc={arc}
                                key={arc.arc_id}
                              />
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
        </div>
      </div>

      <div className="flex flex-row gap-6 justify-center mt-6">
        <div className="flex justify-center mb-4">
          <button
            onClick={handleUpdate}
            className="bg-yellow-500 hover:bg-yellow-600 px-10 py-4 rounded-xl text-black font-bold shadow-md hover:shadow-lg transition"
          >
            Save Changes
          </button>
        </div>
        <div className="flex justify-center mb-4">
          <button
            onClick={() => navigate("/my-journey")}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-xl text-white font-semibold shadow hover:shadow-lg transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}
