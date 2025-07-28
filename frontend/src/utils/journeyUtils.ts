import type { ArcData } from "@/utils/types";

interface SaveOrUpdateJourneyParams {
  journeyId?: string; // Optional for updates
  title: string;
  arcs: ArcData[];
  createJourney?: (data: any) => Promise<void>;
  updateJourney?: (id: string, data: any) => Promise<void>;
}

export async function saveOrUpdateJourney({
  journeyId,
  title,
  arcs,
  createJourney,
  updateJourney,
}: SaveOrUpdateJourneyParams): Promise<void> {
  const arcProgress = arcs.map((arc, index) => ({
    arc_id: arc.arc_id,
    arc_title: arc.arc_title,
    current_day: 1,
    status: index === 0 ? "in_progress" : "upcoming",
    order: index,
    day_count: arc.day_count,
  }));

  if (journeyId) {
    // Update existing journey
    await updateJourney(journeyId, title, arcProgress);
  } else {
    // Create new journey
    await createJourney({ title, arc_progress: arcProgress });
  }
}