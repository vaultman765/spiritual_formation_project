// components/journey/CustomJourneyEditor.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { ArcList } from "@/components/ArcList";
import { useJourney } from "@/context/journeyContext";
import TooltipWrapper from "@/components/common/TooltipWrapper";
import { CustomJourneyArcCard } from "@/components/cards/ArcCard";
import type { ArcData } from "@/utils/types";
import { saveOrUpdateJourney } from "@/utils/journeyUtils";

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

  const handleUpdate = async () => {
    if (selectedArcs.length === 0) return;

    try {
      await saveOrUpdateJourney({
        journeyId: activeJourney.id,
        title,
        arcs: selectedArcs,
        updateJourney,
      });

      await refreshJourneys();
      setTimeout(() => navigate("/my-journey"), 50);
    } catch (err) {
      console.error("Failed to create or overwrite journey:", err);
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
          <ArcList
            arcs={displayAvailableArcs}
            onSelect={(arc) => setSelectedArcs([...selectedArcs, arc])} // Add to selected
          />
        </div>

        {/* Selected Arcs with drag-to-reorder */}
        <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto p-4 rounded-xl bg-[var(--bg-card)] border border-white/10 shadow-inner mx-4">
          <ArcList
            arcs={selectedArcs}
            onReorder={(sourceIndex, destinationIndex) => {
              const reordered = [...selectedArcs];
              const [moved] = reordered.splice(sourceIndex, 1);
              reordered.splice(destinationIndex, 0, moved);
              setSelectedArcs(reordered);
            }}
            onRemove={(arcId) =>
              setSelectedArcs(
                selectedArcs.filter((arc) => arc.arc_id !== arcId)
              )
            }
          />
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
