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
  status: 'in_progress' | 'upcoming' | 'completed';
  order: number;
}

export interface Journey {
  id: number;
  title: string;
  arc_progress: ArcProgressItem[];
}

export interface JourneyContextType {
  journey: Journey | null;
  refreshJourney: () => Promise<void>;
  createJourney: (title: string, arc_progress: ArcProgressItem[]) => Promise<void>;
  journeyLoading: boolean;
}

export type User = {
  id: number;
  username: string;
  email: string;
};

