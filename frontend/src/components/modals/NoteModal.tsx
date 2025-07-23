import { useEffect, useRef, useState } from "react";
import type { MeditationNote } from "@/utils/types";
import { saveNote, deleteNote, getAllNotes } from "@/hooks/useNotes";

interface NoteModalProps {
  note: MeditationNote;
  onClose: () => void;
  onUpdate: () => void;
}

export default function NoteModal({ note, onClose, onUpdate }: NoteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { meditation_day_full } = note;
  const { arc_title, day_title, master_day_number } = meditation_day_full || {};

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);
  const [_, setIsDeleting] = useState(false);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    getAllNotes();
  }, []);

  const handleSave = async () => {
    try {
      await saveNote({
        id: note.id,
        content: editedContent,
        meditation_day: note.meditation_day_full.id,
      });
      await onUpdate();
      setIsEditing(false);
      onClose(); // Optional: refresh or reload logic could be handled at parent level
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      await deleteNote(master_day_number);
      await onUpdate();
      setIsDeleting(true);
      onClose();
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div
        ref={modalRef}
        className="max-w-xl w-full max-h-[70vh] overflow-y-auto bg-black/90 p-6 rounded-xl shadow-xl text-white relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/70 hover:text-white text-lg"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-xl font-display font-semibold text-yellow-300 mb-1">
          {day_title}
        </h2>
        <p className="text-sm italic text-white/70 mb-4">
          from <span className="underline">{arc_title}</span>
        </p>

        {isEditing ? (
          <textarea
            className="w-full h-60 p-4 bg-white/10 border border-white/20 text-white rounded whitespace-pre-wrap"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        ) : (
          <div className="whitespace-pre-wrap break-words text-sm leading-relaxed text-white/90">
            {note.content}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
