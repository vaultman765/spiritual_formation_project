import type { MeditationNote } from '@/utils/types';

/**
 * Groups notes by their associated arc.
 * @param notes - Array of meditation notes.
 * @returns An object where keys are arc titles and values are arrays of notes.
 */

export function groupNotesByArc(notes: MeditationNote[]): Record<string, MeditationNote[]> {
  return notes.reduce((acc, note) => {
    if (!note.meditation_day_full) {
      throw new Error(`Invalid note: meditation_day_full is null for note ID ${note.id}`);
    }

    const arcTitle = note.meditation_day_full.arc_title;

    if (!acc[arcTitle]) {
      acc[arcTitle] = [];
    }
    acc[arcTitle].push(note);
    return acc;
  }, {} as Record<string, MeditationNote[]>);
}

/**
 * Groups notes by their associated month.
 * @param notes - Array of meditation notes.
 * @returns An object where keys are month-year strings and values are arrays of notes.
 */
export function groupNotesByMonth(notes: MeditationNote[]): Record<string, MeditationNote[]> {
  return notes.reduce((acc, note) => {
    const updatedAt = new Date(note.updated_at);
    const monthYear = `${updatedAt.toLocaleString('default', { month: 'long' })} ${updatedAt.getFullYear()}`;

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(note);
    return acc;
  }, {} as Record<string, MeditationNote[]>);
}