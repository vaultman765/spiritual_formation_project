export interface MeditationData {
  master_day_number: number;
  arc_id: string;
  arc_title: string;
  day_title: string;
  anchor_image: string;
  arc_day_number: number;
  arc_total_days: number;
  primary_reading: {
    title: string;
  };
  secondary_readings: SecondaryReading[];
  meditative_points: string[];
  ejaculatory_prayer: string;
  colloquy: string;
  resolution: string;
}

export interface DaySummary {
  arc_day_number: number;
  master_day_number: number;
  day_title: string;
  primary_reading_title: string;
  anchor_image: string;
}

export interface SecondaryReading {
  title: string;
  reference: string;
  url: string;
}

export interface ArcData {
  arc_id: string;
  arc_title: string;
  day_count: number;
  anchor_image: string[];
  arc_summary: string;
  primary_reading: string[],
  card_tags: string[];
}

interface ArcProgressItem {
  arc_id: string;
  arc_title: string;
  day_count: number;
  current_day: number;
  status:  'in_progress' | 'upcoming' | 'completed' | 'skipped';
  order: number;
}

export interface Journey {
  id: number;
  title: string;
  is_active: boolean;
  is_custom: boolean;
  completed_on: Date | null;
  created_at: string;
  updated_at: string;
  arc_progress: ArcProgressItem[];
  arc_progress_items?: ArcProgressItem[];
}

export interface JourneyContextType {
  journeys: Journey[];
  activeJourney: Journey | null;
  pastJourneys: Journey[];
  archivedJourneys: Journey[];
  refreshJourneys: () => Promise<void>;
  createJourney: (data: { title: string; arc_progress: ArcProgressItem[] }) => Promise<void>
  restartJourney: () => Promise<void>;
  restoreJourney: (id: number) => Promise<void>;
  fetchPastJourneys: () => Promise<void>;
  completeJourney: () => Promise<void>;
  skipArc: () => Promise<void>;
  skipDay: () => Promise<void>;
  updateJourney: (journeyId: number, title: string, arcProgress: { arc_id: string; arc_title: string; order: number; day_count: number; }[]) => Promise<void>;
  markDayComplete: () => Promise<void>;
  deleteJourney: (journeyId: number) => Promise<void>;
  journeyLoading: boolean;
}

export type User = {
  id: number;
  username: string;
  email: string;
};

interface MeditationDayStub {
  id: number;
  arc_id: string;
  arc_day_number: number;
  arc_title: string;
  day_title: string;
  master_day_number: number;
};

export interface MeditationNote {
  id: number;
  content: string;
  meditation_day_full: MeditationDayStub;
  updated_at: string;
}

export interface NoteInput {
  meditation_day: number;
  content: string;
  id?: number; // Optional for new notes
}
