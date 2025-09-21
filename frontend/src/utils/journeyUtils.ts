import type { ArcData } from "@/utils/types";

interface SaveOrUpdateJourneyParams {
  journeyId?: number; // Optional for updates
  title: string;
  arcs: ArcData[];
  createJourney?: (data: any) => Promise<void>;
  updateJourney?: (id: number, title: string, data: any) => Promise<void>;
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
    if (updateJourney) {
      await updateJourney(journeyId, title, arcProgress);
    } else {
      throw new Error("updateJourney function is not provided.");
    }
  } else {
    // Create new journey
    if (!createJourney) {
      throw new Error("createJourney function is not provided.");
    }
    await createJourney({ title, arc_progress: arcProgress });
  }
}