import { useState, useEffect } from "react";
import { useJourneyEditor } from "@/hooks/useJourneyEditor";
import { saveOrUpdateJourney } from "@/utils/journeyUtils";
import { ArcList } from "@/components/ArcList";
import type { ArcData } from "@/utils/types";
import { useJourney } from "@/context/journeyContext";
import { useNavigate } from "react-router-dom";

interface JourneyEditorPageProps {
  mode: "create" | "edit";
  initialJourney?: { title: string; arcs: ArcData[] };
}

export default function JourneyEditorPage({ mode, initialJourney }: JourneyEditorPageProps) {
  const { availableArcs, selectedArcs, title, setTitle, setSelectedArcs, handleReorder, refreshJourneys } = useJourneyEditor(
    mode === "edit" ? { initialJourney } : {}
  );

  const { createJourney, updateJourney, activeJourney } = useJourney();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const displayAvailableArcs = availableArcs.filter(
    (arc) =>
      !selectedArcs.some((selected) => selected.arc_id === arc.arc_id) &&
      (arc.arc_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        arc.card_tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleSave = async () => {
    if (selectedArcs.length === 0) return;

    try {
      await saveOrUpdateJourney({
        journeyId: mode === "edit" ? activeJourney?.id : undefined,
        title,
        arcs: selectedArcs,
        createJourney: mode === "create" ? createJourney : undefined,
        updateJourney: mode === "edit" ? updateJourney : undefined,
      });

      await refreshJourneys();
      navigate("/my-journey");
    } catch (err) {
      console.error("Failed to save journey:", err);
    }
  };

  useEffect(() => {
    if (mode === "edit" && activeJourney) {
      setTitle(activeJourney.title);
      const selected = activeJourney.arc_progress.map((arc) => {
        const fullArc = availableArcs.find((a) => a.arc_id === arc.arc_id);
        return { ...arc, ...fullArc }; // Merge arc data with fullArc to include card_tags
      });
      setSelectedArcs(selected.filter(Boolean) as ArcData[]);
    }
  }, [activeJourney, availableArcs]);

  return (
    <main>
      <div className="text-center mb-4 text-[var(--text-main)]">
        <h1 className="text-5xl font-display font-semibold mb-2">
          {mode === "create" ? "Create a Custom Journey" : "Edit Custom Journey"}
        </h1>
        <p className="text-lg text-white/70 max-w-2xl mx-auto">
          {mode === "create"
            ? "Select and reorder arcs to build a mental prayer journey tailored to your needs."
            : "Add, remove, or reorder arcs in your journey."}
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

      <div className="mb-4 col-span-2 justify-self-center">
        <input
          type="text"
          placeholder="Search Available Arcs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-style placeholder-white/70"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* Available Arcs column */}
        <div>
          <h2 className="text-center text-2xl text-[var(--brand-primary)] font-semibold mb-4 relative after:content-[''] after:block after:h-[2px] after:w-8 after:bg-[var(--brand-primary)] after:mt-1 after:mx-auto">
            Available Arcs
          </h2>

          <div className="flex flex-col max-h-[65vh] overflow-y-auto p-4 rounded-xl bg-[var(--bg-card)] border border-white/10 shadow-inner mx-4">
            <ArcList arcs={displayAvailableArcs} onSelect={(arc) => setSelectedArcs([...selectedArcs, arc])} />
          </div>
        </div>

        {/* Selected Arcs column */}
        <div>
          <h2 className="text-center text-2xl text-[var(--brand-primary)] font-semibold mb-4 relative after:content-[''] after:block after:h-[2px] after:w-8 after:bg-[var(--brand-primary)] after:mt-1 after:mx-auto">
            Selected Arcs
          </h2>

          <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto p-4 rounded-xl bg-[var(--bg-card)] border border-white/10 shadow-inner mx-4">
            <ArcList
              arcs={selectedArcs}
              onReorder={handleReorder}
              onRemove={(arcId) => setSelectedArcs(selectedArcs.filter((arc) => arc.arc_id !== arcId))}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
        <div className="flex justify-center mb-4">
          <button
            onClick={handleSave}
            className="bg-yellow-500 hover:bg-yellow-600 px-10 py-4 rounded-xl text-black font-bold shadow-md hover:shadow-lg transition"
          >
            {mode === "create" ? "Create Journey" : "Save Changes"}
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
