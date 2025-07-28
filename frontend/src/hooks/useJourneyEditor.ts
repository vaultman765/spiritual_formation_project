import { useState, useEffect } from "react";
import { useJourney } from "@/context/journeyContext";
import type { ArcData } from "@/utils/types";

interface UseJourneyEditorProps {
  initialJourney?: { title: string; arcs: ArcData[] };
}

export function useJourneyEditor({ initialJourney }: UseJourneyEditorProps) {
  const [availableArcs, setAvailableArcs] = useState<ArcData[]>([]);
  const [selectedArcs, setSelectedArcs] = useState<ArcData[]>(initialJourney?.arcs || []);
  const [title, setTitle] = useState(initialJourney?.title || "");
  const { refreshJourneys } = useJourney();

  // Fetch available arcs on mount
  useEffect(() => {
    fetch("/api/arcs/")
      .then((res) => res.json())
      .then((data) => setAvailableArcs(data))
      .catch(console.error);
  }, []);

  // Handle reordering of selected arcs
  const handleReorder = (sourceIndex: number, destinationIndex: number) => {
    const reordered = [...selectedArcs];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(destinationIndex, 0, moved);
    setSelectedArcs(reordered);
  };

  return {
    availableArcs,
    selectedArcs,
    title,
    setTitle,
    setSelectedArcs,
    handleReorder,
    refreshJourneys,
  };
}