import { groupNotesByArc, groupNotesByMonth } from '@/utils/groupNotes';
import type { MeditationNote } from '@/utils/types';

describe('groupNotesByArc', () => {
  it('should return an empty object when given an empty array', () => {
    const notes: MeditationNote[] = [];
    const result = groupNotesByArc(notes);
    expect(result).toEqual({});
  });

  it('should group notes by arc title', () => {
    const notes: MeditationNote[] = [
      { meditation_day_full: { id: 1, arc_id: 'arc_1', arc_day_number: 1, day_title: 'Day 1', master_day_number: 1, arc_title: 'Arc 1' }, content: 'Note 1', id: 1, updated_at: '2023-10-01T00:00:00Z' },
      { meditation_day_full: { id: 2, arc_id: 'arc_2', arc_day_number: 2, day_title: 'Day 2', master_day_number: 2, arc_title: 'Arc 2' }, content: 'Note 2', id: 2, updated_at: '2023-10-01T00:00:00Z' },
      { meditation_day_full: { id: 3, arc_id: 'arc_1', arc_day_number: 3, day_title: 'Day 3', master_day_number: 3, arc_title: 'Arc 1' }, content: 'Note 3', id: 3, updated_at: '2023-10-01T00:00:00Z' },
    ];
    const result = groupNotesByArc(notes);
    expect(result).toEqual({
      'Arc 1': [
        { meditation_day_full: { id: 1, arc_id: 'arc_1', arc_day_number: 1, day_title: 'Day 1', master_day_number: 1, arc_title: 'Arc 1' }, content: 'Note 1', id: 1, updated_at: '2023-10-01T00:00:00Z' },
        { meditation_day_full: { id: 3, arc_id: 'arc_1', arc_day_number: 3, day_title: 'Day 3', master_day_number: 3, arc_title: 'Arc 1' }, content: 'Note 3', id: 3, updated_at: '2023-10-01T00:00:00Z' },
      ],
      'Arc 2': [{ meditation_day_full: { id: 2, arc_id: 'arc_2', arc_day_number: 2, day_title: 'Day 2', master_day_number: 2, arc_title: 'Arc 2' }, content: 'Note 2', id: 2, updated_at: '2023-10-01T00:00:00Z' }],
    });
  });

  it('should throw an error for notes with null meditation_day_full', () => {
    const notes: MeditationNote[] = [
      { meditation_day_full: null, content: 'Note 2', id: 5, updated_at: '2023-10-01T00:00:00Z' } as unknown as MeditationNote, // Type assertion
    ];
    expect(() => groupNotesByArc(notes)).toThrow('Invalid note: meditation_day_full is null for note ID 5');
  });
});

describe('groupNotesByMonth', () => {
  it('should return an empty object when given an empty array', () => {
    const notes: MeditationNote[] = [];
    const result = groupNotesByMonth(notes);
    expect(result).toEqual({});
  });

  it('should group notes by month-year', () => {
    const notes: MeditationNote[] = [
      { meditation_day_full: { id: 1, arc_id: 'arc_1', arc_day_number: 1, day_title: 'Day 1', master_day_number: 1, arc_title: 'Arc 1' }, content: 'Note 1', id: 1, updated_at: '2023-10-01T00:00:00Z' },
      { meditation_day_full: { id: 2, arc_id: 'arc_2', arc_day_number: 2, day_title: 'Day 2', master_day_number: 2, arc_title: 'Arc 2' }, content: 'Note 2', id: 2, updated_at: '2023-11-01T00:00:00Z' },
      { meditation_day_full: { id: 3, arc_id: 'arc_1', arc_day_number: 3, day_title: 'Day 3', master_day_number: 3, arc_title: 'Arc 1' }, content: 'Note 3', id: 3, updated_at: '2023-10-15T00:00:00Z' },
    ];
    const result = groupNotesByMonth(notes);
    expect(result).toEqual({
      'October 2023': [
        { meditation_day_full: { id: 2, arc_id: 'arc_2', arc_day_number: 2, day_title: 'Day 2', master_day_number: 2, arc_title: 'Arc 2' }, content: 'Note 2', id: 2, updated_at: '2023-11-01T00:00:00Z' },
        { meditation_day_full: { id: 3, arc_id: 'arc_1', arc_day_number: 3, day_title: 'Day 3', master_day_number: 3, arc_title: 'Arc 1' }, content: 'Note 3', id: 3, updated_at: '2023-10-15T00:00:00Z' },
      ],
      'September 2023': [
        { meditation_day_full: { id: 1, arc_id: 'arc_1', arc_day_number: 1, day_title: 'Day 1', master_day_number: 1, arc_title: 'Arc 1' }, content: 'Note 1', id: 1, updated_at: '2023-10-01T00:00:00Z' },
      ],
    });
  });
});