import { useEffect, useState, useMemo } from 'react';
import NoteCard from '@/components/cards/NoteCard';
import NoteModal from '@/components/modals/NoteModal';
import SimpleListboxDropdown from '@/components/SimpleListboxDropdown';
import { getAllNotes } from '@/hooks/useNotes';
import { groupNotesByArc, groupNotesByMonth } from '@/utils/groupNotes'
import type { MeditationNote } from '@/utils/types';


export default function NotesPage() {
  const [notes, setNotes] = useState<MeditationNote[]>([]);
  const [sortBy, setSortBy] = useState<'month' | 'arc'>('month');
  const [groupedNotes, setGroupedNotes] = useState<Record<string, MeditationNote[]>>({});
  const [selectedNote, setSelectedNote] = useState<MeditationNote | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNotes = async () => {
    const data = await getAllNotes();
    setNotes(data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);
  

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const content = note.content?.toLowerCase() || '';
      const title = note.meditation_day_full?.day_title?.toLowerCase() || '';
      const arc = note.meditation_day_full?.arc_title?.toLowerCase() || '';
      const search = searchTerm.toLowerCase();
      return content.includes(search) || title.includes(search) || arc.includes(search);
    });
  }, [notes, searchTerm]);

  useEffect(() => {
    if (sortBy === 'month') {
      const grouped = groupNotesByMonth(filteredNotes);
      setGroupedNotes(grouped);
    } else {
      const grouped = groupNotesByArc(filteredNotes);
      setGroupedNotes(grouped);
    }
  }, [filteredNotes, sortBy]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--bg-light)] via-[var(--bg-mid)] to-[var(--bg-dark)] text-white px-6 pb-2 pt-0">
      <div className="px-4 py-12 max-w-5xl mx-auto">
        <h1 className="text-4xl font-display text-white mb-2 text-center">
          My Notes
        </h1>
        <p className="text-center text-white/70 mb-10">
          Review your past meditations and graces.
        </p>

        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes..."
            className="flex-1 rounded px-4 py-2 bg-white/10 text-white placeholder-white/40"
          />
          <SimpleListboxDropdown
            options={['month', 'arc']}
            selected={sortBy}
            onChange={(val) => setSortBy(val as "month" | "arc")}
            labelFormatter={(val) => val === 'month' ? 'Group by Month' : 'Group by Arc'}
          />
        </div>

        {Object.entries(groupedNotes || {}).map(([groupTitle, groupNotes]) => (
          <div key={groupTitle} className="mb-10">
            <h2 className="text-lg text-white/60 font-semibold mb-3">{groupTitle}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={() => setSelectedNote(note)}
                />
              ))}
            </div>
          </div>
        ))}

        {selectedNote && (
          <NoteModal 
            note={selectedNote}
            onClose={() => setSelectedNote(null)}
            onUpdate={fetchNotes} />
        )}
      </div>
    </main>
  );
}
