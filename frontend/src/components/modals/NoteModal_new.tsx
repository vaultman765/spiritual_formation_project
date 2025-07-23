import { useEffect, useRef, useState } from "react";
import * as modal from "@/components/modals/BaseModal";
import { useModal } from "@/hooks/useModal";
import { saveNote, deleteNote, getNote } from "@/hooks/useNotes";
import type { MeditationData, MeditationNote } from "@/utils/types";
import { toast } from "react-toastify";

interface NoteModalProps {
  note: MeditationNote;
  onClose: () => void;
  onUpdate: () => void;
}

export function EditNoteModal({
  title,
  content,
  day,
  onUpdate,
}: {
  title: string;
  content: string;
  day: MeditationData | null;
  onUpdate: () => void;
}) {
  const { isOpen, closeModal } = useModal();
  const [noteContent, setNoteContent] = useState(content);
  const [_, setNoteId] = useState<number | null>(null);

  if (!isOpen) return null;
  if (!day?.master_day_number) {
    return (
      <modal.BaseModal>
        <modal.CloseButton />
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold">No Day Selected</h2>
          <p>Please select a meditation day to edit its note.</p>
        </div>
      </modal.BaseModal>
    );
  }

  return (
    <modal.BaseModal>
      <modal.CloseButton />
      <modal.ModalTitle title={title} />
      <EditNoteContent
        content={noteContent}
        placeholder="Write your thoughts, inspirations, or resolutions here..."
        onChange={setNoteContent}
      />
      <EditModalButtons
        day={day}
        content={noteContent}
        setNoteContent={setNoteContent}
        setNoteId={setNoteId}
        onUpdate={onUpdate}
      />
    </modal.BaseModal>
  );
}

export function EditNoteContent({
  content,
  placeholder,
  onChange,
}: {
  content: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <textarea
      className="w-full h-64 p-4 bg-transparent border border-gray-400 rounded-lg resize-none font-serif text-[1rem] leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-400"
      placeholder={placeholder}
      value={content}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function DeleteNoteButton({
  day,
  setNoteContent,
  setNoteId,
  onUpdate,
}: {
  day: MeditationData;
  setNoteContent: (content: string) => void;
  setNoteId: (id: number | null) => void;
  onUpdate: NoteModalProps["onUpdate"];
}) {
  const { closeModal } = useModal();
  const handleDelete = async () => {
    if (!day?.master_day_number) return;

    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await deleteNote(day.master_day_number);
      setNoteContent("");
      setNoteId(null);
      toast.success("Note deleted successfully!");
      onUpdate();
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note.");
    } finally {
      closeModal();
    }
  };
  return <modal.DeleteButton text="Delete Note" onClick={handleDelete} />;
}

export function SaveNoteButton({
  day,
  content,
  setNoteId,
  onUpdate,
}: {
  day: MeditationData;
  content: string;
  setNoteId: (id: number | null) => void;
  onUpdate: NoteModalProps["onUpdate"];
}) {
  const { closeModal } = useModal();
  const handleSave = async () => {
    if (!day?.master_day_number) return;

    const originalNote = await getNote(day.master_day_number);

    if (originalNote && originalNote.content === content) {
      closeModal();
      return;
    }

    try {
      const saved = await saveNote({
        meditation_day: day.master_day_number,
        content: content ?? "",
        id: originalNote?.id,
      });
      setNoteId(saved.id);
      toast.success("Note saved successfully!");
      onUpdate();
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note.");
    } finally {
      closeModal();
    }
  };
  return <modal.SaveButton text="Save Note" onClick={handleSave} />;
}

export function EditModalButtons({
  day,
  content,
  setNoteContent,
  setNoteId,
  onUpdate,
}: {
  day: MeditationData;
  content: string;
  setNoteContent: (content: string) => void;
  setNoteId: (id: number | null) => void;
  onUpdate: NoteModalProps["onUpdate"];
}) {
  return (
    <div className="mt-6 flex justify-between items-center">
      <modal.CancelButton />
      <div className="flex gap-2">
        <SaveNoteButton
          day={day}
          content={content}
          setNoteId={setNoteId}
          onUpdate={onUpdate}
        />
        <DeleteNoteButton
          day={day}
          setNoteContent={setNoteContent}
          setNoteId={setNoteId}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  );
}

export function ViewerNoteModal({
  title,
  content,
  note,
  onClose,
  onUpdate,
}: {
  title: string;
  content: string;
  note: MeditationNote;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { meditation_day_full } = note;
  const { arc_title, day_title, master_day_number, arc_id, arc_day_number } =
    meditation_day_full || {};

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);
  const [_, setNoteId] = useState<number | null>(null);
  const [noteContent, setNoteContent] = useState(content);

  const normalizedDay: Partial<MeditationData> = {
    master_day_number,
    arc_id,
    arc_title,
    day_title,
    arc_day_number,
  };

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

  // useEffect(() => {
  //   getAllNotes();
  // }, []);

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

        {isEditing ? (
          <EditModalButtons
            day={normalizedDay as MeditationData} // Cast to MeditationData
            content={noteContent}
            setNoteContent={setNoteContent}
            setNoteId={setNoteId}
            onUpdate={onUpdate}
          />
        ) : (
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <DeleteNoteButton
              day={normalizedDay as MeditationData} // Cast to MeditationData
              setNoteContent={setNoteContent}
              setNoteId={setNoteId}
              onUpdate={onUpdate}
            />
          </div>
        )}
      </div>
    </div>
  );
}
