import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotesPage from '@/pages/notes/NotesPage';
import * as groupNotes from '@/utils/groupNotes';
import * as notesApi from '@/hooks/useNotes';

jest.mock('@/utils/groupNotes');
jest.mock('@/hooks/useNotes');
jest.mock('@/components/SimpleListboxDropdown', () => ({
  __esModule: true,
  default: ({ options, selected, onChange }: { options: string[]; selected: string; onChange: (val: string) => void }) => (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      data-testid="dropdown"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option === 'month' ? 'Group by Month' : 'Group by Arc'}
        </option>
      ))}
    </select>
  ),
}));

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('NotesPage Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should group notes by arc and display them', async () => {
    jest.spyOn(notesApi, 'getAllNotes').mockResolvedValue([
      {
        id: 1,
        content: 'Note 1',
        meditation_day_full: {
          id: 101,
          arc_id: 'arc_day_1',
          arc_day_number: 1,
          day_title: 'Day 1',
          master_day_number: 1,
          arc_title: 'Love of God - Foundation of All',
        },
        updated_at: '2023-10-01T00:00:00Z',
      },
      {
        id: 2,
        content: 'Note 2',
        meditation_day_full: {
          id: 102,
          arc_id: 'arc_day_1',
          arc_day_number: 2,
          day_title: 'Day 2',
          master_day_number: 2,
          arc_title: 'Love of God - Foundation of All',
        },
        updated_at: '2023-10-01T00:00:00Z',
      },
      {
        id: 3,
        content: 'Note 3',
        meditation_day_full: {
          id: 103,
          arc_id: 'arc_day_2',
          arc_day_number: 1,
          day_title: 'Day 3',
          master_day_number: 3,
          arc_title: 'Heaven and Judgment',
        },
        updated_at: '2023-10-01T00:00:00Z',
      },
    ]);

    jest.spyOn(groupNotes, 'groupNotesByArc').mockReturnValue({
      'Love of God - Foundation of All': [
        {
          id: 1,
          content: 'Note 1',
          meditation_day_full: {
            id: 101,
            arc_id: 'arc_day_1',
            arc_day_number: 1,
            day_title: 'Day 1',
            master_day_number: 1,
            arc_title: 'Love of God - Foundation of All',
          },
          updated_at: '2023-10-01T00:00:00Z',
        },
        {
          id: 2,
          content: 'Note 2',
          meditation_day_full: {
            id: 102,
            arc_id: 'arc_day_1',
            arc_day_number: 2,
            day_title: 'Day 2',
            master_day_number: 2,
            arc_title: 'Love of God - Foundation of All',
          },
          updated_at: '2023-10-01T00:00:00Z',
        },
      ],
      'Heaven and Judgment': [
        {
          id: 3,
          content: 'Note 3',
          meditation_day_full: {
            id: 103,
            arc_id: 'arc_day_2',
            arc_day_number: 1,
            day_title: 'Day 3',
            master_day_number: 3,
            arc_title: 'Heaven and Judgment',
          },
          updated_at: '2023-10-01T00:00:00Z',
        },
      ],
    });

    await act(async () => {
      render(<NotesPage />);
    });

    // Simulate dropdown interaction to select "arc"
    const dropdown = screen.getByTestId('dropdown');
    fireEvent.change(dropdown, { target: { value: 'arc' } });

    // Assert that the grouped notes are rendered
    const arc_titles1 = await screen.findAllByText((content) => content.includes('Love of God - Foundation of All'));
    expect(arc_titles1).toHaveLength(3); // Assert that only one arc title is rendered (one greater than # of notes)

    const arc_titles2 = await screen.findAllByText((content) => content.includes('Heaven and Judgment'));
    expect(arc_titles2).toHaveLength(2); // Assert that only one arc title is rendered (one greater than # of notes)
  });

  it('should group notes by month and display them', async () => {
    jest.spyOn(notesApi, 'getAllNotes').mockResolvedValue([
      {
        id: 1,
        content: 'Note 1',
        meditation_day_full: {
          id: 101,
          arc_id: 'arc_day_1',
          arc_day_number: 1,
          day_title: 'Day 1',
          master_day_number: 1,
          arc_title: 'Arc 1',
        },
        updated_at: '2023-10-01T00:00:00Z',
      },
    ]);

    jest.spyOn(groupNotes, 'groupNotesByMonth').mockReturnValue({
      'October 2023': [
        {
          id: 1,
          content: 'Note 1',
          meditation_day_full: {
            id: 101,
            arc_id: 'arc_day_1',
            arc_day_number: 1,
            day_title: 'Day 1',
            master_day_number: 1,
            arc_title: 'Arc 1',
          },
          updated_at: '2023-10-01T00:00:00Z',
        },
      ],
    });

    await act(async () => {
      render(<NotesPage />);
    });

    expect(await screen.findByText((content) => content.includes('October 2023'))).toBeInTheDocument();
  });

  it('should update search term and filter notes', async () => {
    jest.spyOn(notesApi, 'getAllNotes').mockResolvedValue([
      {
        id: 1,
        content: 'Note 1',
        meditation_day_full: {
          id: 101,
          arc_id: 'arc_day_1',
          arc_day_number: 1,
          day_title: 'Day 1',
          master_day_number: 1,
          arc_title: 'Love of God - Foundation of All',
        },
        updated_at: '2023-10-01T00:00:00Z',
      },
      {
        id: 2,
        content: 'Note 2',
        meditation_day_full: {
          id: 102,
          arc_id: 'arc_day_1',
          arc_day_number: 2,
          day_title: 'Day 2',
          master_day_number: 2,
          arc_title: 'Love of God - Foundation of All',
        },
        updated_at: '2023-10-01T00:00:00Z',
      },
    ]);

    await act(async () => {
      render(<NotesPage />);
    });

    // Simulate typing into the search input
    const searchInput = screen.getByPlaceholderText('Search notes...');
    fireEvent.change(searchInput, { target: { value: 'Note 1' } });

    // Assert that the search term is updated
    expect(searchInput).toHaveValue('Note 1');
  });

  it('should update sortBy and render grouped notes', async () => {
    jest.spyOn(notesApi, 'getAllNotes').mockResolvedValue([
      {
        id: 1,
        content: 'Note 1',
        meditation_day_full: {
          id: 101,
          arc_id: 'arc_day_1',
          arc_day_number: 1,
          day_title: 'Day 1',
          master_day_number: 1,
          arc_title: 'Love of God - Foundation of All',
        },
        updated_at: '2023-10-01T00:00:00Z',
      },
      {
        id: 2,
        content: 'Note 2',
        meditation_day_full: {
          id: 102,
          arc_id: 'arc_day_1',
          arc_day_number: 2,
          day_title: 'Day 2',
          master_day_number: 2,
          arc_title: 'Love of God - Foundation of All',
        },
        updated_at: '2023-10-01T00:00:00Z',
      },
    ]);

    await act(async () => {
      render(<NotesPage />);
    });

    // Simulate changing the dropdown value
    const dropdown = screen.getByTestId('dropdown');
    fireEvent.change(dropdown, { target: { value: 'arc' } });

    // Assert that grouped notes are rendered
    const arc_titles1 = await screen.findAllByText((content) => content.includes('Love of God - Foundation of All'));
    expect(arc_titles1).toHaveLength(3); // Assert that only one arc title is rendered (one greater than # of notes)
    expect(await screen.findByText('Day 1')).toBeInTheDocument();
    expect(await screen.findByText('Day 2')).toBeInTheDocument();
  });

  it('should open and close NoteModal when clicking on a NoteCard', async () => {
    jest.spyOn(notesApi, 'getAllNotes').mockResolvedValue([
      {
        id: 1,
        content: 'Note 1',
        meditation_day_full: {
          id: 101,
          arc_id: 'arc_day_1',
          arc_day_number: 1,
          day_title: 'Day 1',
          master_day_number: 1,
          arc_title: 'Love of God - Foundation of All',
        },
        updated_at: '2023-10-01T00:00:00Z',
      },
    ]);

    await act(async () => {
      render(<NotesPage />);
    });

    // Simulate clicking on a NoteCard
    const noteCard = screen.getByText('Day 1');
    fireEvent.click(noteCard);

    // Assert that the NoteModal is opened
    expect(await screen.findByText('Note 1')).toBeInTheDocument();

    // Simulate closing the NoteModal by pressing Escape
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    // Assert that the NoteModal is closed
    expect(screen.queryByText('Note 1')).not.toBeInTheDocument();
  });
});