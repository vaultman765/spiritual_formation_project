import NoteCard from "@/components/cards/NoteCard";
import { ModalRenderer } from "@/components/modals/BaseModal";
import { EditNoteModal, ViewerNoteModal } from "@/components/modals/NoteModal/NoteModal";
import SimpleListboxDropdown from "@/components/SimpleListboxDropdown";
import { useModal } from "@/hooks/useModal";
import { getAllNotes } from "@/hooks/useNotes";
import { groupNotesByArc, groupNotesByMonth } from "@/utils/groupNotes";
import type { MeditationNote } from "@/utils/types";
import { useEffect, useMemo, useState } from "react";

export default function NotesPage() {
  const [notes, setNotes] = useState<MeditationNote[]>([]);
  const [sortBy, setSortBy] = useState<"month" | "arc">("month");
  const [groupedNotes, setGroupedNotes] = useState<Record<string, MeditationNote[]>>({});
  const [selectedNote, setSelectedNote] = useState<MeditationNote | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { openModal: openViewerModal, closeModal: closeViewerModal } = useModal("viewerNoteModal");
  const { openModal: openEditorModal, closeModal: closeEditorModal } = useModal("editNoteModal");

  const fetchNotes = async () => {
    const data = await getAllNotes();
    setNotes(data);
  };

  const modals = [
    {
      id: "viewerNoteModal",
      content: (
        <ViewerNoteModal
          modalId="viewerNoteModal"
          day={selectedNote}
          title={selectedNote?.meditation_day_full?.day_title || "View Note"}
          content={selectedNote?.content || ""}
          onClose={() => {
            closeViewerModal();
            setSelectedNote(null);
          }}
          onUpdate={fetchNotes}
          onEdit={() => {
            setSelectedNote(selectedNote);
            closeViewerModal();
            openEditorModal();
          }}
        />
      ),
    },
    {
      id: "editNoteModal",
      content: (
        <EditNoteModal
          modalId="editNoteModal"
          day={selectedNote}
          title={selectedNote?.meditation_day_full?.day_title || "Edit Note"}
          content={selectedNote?.content || ""}
          master_day_number={selectedNote?.meditation_day_full?.master_day_number}
          onClose={() => {
            closeEditorModal();
            setSelectedNote(null);
          }}
          onUpdate={fetchNotes}
        />
      ),
    },
  ];

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const content = note.content?.toLowerCase() || "";
      const title = note.meditation_day_full?.day_title?.toLowerCase() || "";
      const arc = note.meditation_day_full?.arc_title?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();
      return content.includes(search) || title.includes(search) || arc.includes(search);
    });
  }, [notes, searchTerm]);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (sortBy === "month") {
      const grouped = groupNotesByMonth(filteredNotes);
      setGroupedNotes(grouped);
    } else {
      const grouped = groupNotesByArc(filteredNotes);
      setGroupedNotes(grouped);
    }
  }, [filteredNotes, sortBy]);

  return (
    <main>
      <div className="px-4 py-12 max-w-5xl mx-auto">
        <h1 className="text-4xl font-display text-[var(--text-light)] mb-2 text-center">My Notes</h1>
        <p className="text-center text-[var(--text-muted)] mb-10">Review your past meditation notes.</p>

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes..."
            className="w-full sm:w-auto flex-1 rounded px-4 py-2 bg-white/10 text-white placeholder-white/40"
          />
          <SimpleListboxDropdown
            options={["month", "arc"]}
            selected={sortBy}
            onChange={(val) => setSortBy(val as "month" | "arc")}
            labelFormatter={(val) => (val === "month" ? "Group by Month" : "Group by Arc")}
          />
        </div>

        {Object.entries(groupedNotes || {}).length === 0 ? (
          <p className="text-center text-[var(--text-main)]">No notes available.</p>
        ) : (
          Object.entries(groupedNotes).map(([groupTitle, groupNotes]) => (
            <div key={groupTitle} className="mb-10">
              <h2 className="text-lg text-[var(--text-muted)] font-semibold mb-3">{groupTitle}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onClick={() => {
                      setSelectedNote(note);
                      openViewerModal();
                    }}
                  />
                ))}
              </div>
            </div>
          ))
        )}

        <ModalRenderer modals={modals} />
      </div>
    </main>
  );
}
