import { useEffect, useRef, useState } from "react";
import * as modal from "@/components/modals/BaseModal";
import { useModal } from "@/hooks/useModal";
import { saveNote, deleteNote, getNote } from "@/hooks/useNotes";
import type { MeditationData, MeditationNote } from "@/utils/types";
import { toast } from "react-toastify";
import { getAllNotes } from "@/hooks/useNotes";

interface NoteModalProps {
  note: MeditationNote;
  onClose: () => void;
  onUpdate: () => void;
}

export function EditNoteModal({
  modalId = "editNoteModal",
  title,
  content,
  day,
  onUpdate,
}: {
  modalId: string;
  title: string;
  content: string;
  day: MeditationData | MeditationNote["meditation_day_full"] | null;
  onUpdate: () => void;
}) {
  const { isOpen } = useModal(modalId);
  const [noteContent, setNoteContent] = useState(content);
  const [_, setNoteId] = useState<number | null>(null);

  // Synchronize noteContent with the content prop
  useEffect(() => {
    setNoteContent(content);
  }, [content]);

  if (!isOpen) return null;
  if (!day?.master_day_number) {
    return (
      <modal.BaseModal modalId={modalId}>
        <modal.CloseButton modalId={modalId} />
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold">No Day Selected</h2>
          <p>Please select a meditation day to edit its note.</p>
        </div>
      </modal.BaseModal>
    );
  }

  return (
    <modal.BaseModal modalId={modalId}>
      <modal.CloseButton modalId={modalId} />
      <modal.ModalTitle title={title} />
      <EditNoteContent
        content={noteContent}
        placeholder="Write your thoughts, inspirations, or resolutions here..."
        onChange={setNoteContent}
      />
      <EditModalButtons
        modalId={modalId}
        day={day as MeditationData}
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
  modalId,
  day,
  setNoteContent,
  setNoteId,
  onUpdate,
}: {
  modalId: string;
  day: MeditationData;
  setNoteContent: (content: string) => void;
  setNoteId: (id: number | null) => void;
  onUpdate: NoteModalProps["onUpdate"];
}) {
  const { closeModal } = useModal(modalId);
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
  modalId,
  day,
  content,
  setNoteId,
  onUpdate,
}: {
  modalId: string;
  day: MeditationData;
  content: string;
  setNoteId: (id: number | null) => void;
  onUpdate: NoteModalProps["onUpdate"];
}) {
  const { closeModal } = useModal(modalId);
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

export function EditNoteButton({
  modalId = "editNoteModal",
  note,
  day,
  onUpdate,
  onClick,
}: {
  modalId: string;
  note: MeditationNote;
  day: MeditationData | null;
  onUpdate: () => void;
  onClick: () => void;
}) {
  const { isOpen, closeModal } = useModal(modalId);

  return (
    <>
      <modal.EditButton
        onClick={onClick} // Open the modal when the button is clicked
        text="Edit Note"
      />
      {isOpen && (
        <EditNoteModal
          modalId="editNoteModal"
          title={note.meditation_day_full?.day_title || "Edit Note"}
          content={note.content}
          day={day}
          onUpdate={() => {
            closeModal(); // Close the modal after updating
            onUpdate();
          }}
        />
      )}
    </>
  );
}

export function EditModalButtons({
  modalId = "editNoteModal",
  day,
  content,
  setNoteContent,
  setNoteId,
  onUpdate,
}: {
  modalId: string;
  day: MeditationData;
  content: string;
  setNoteContent: (content: string) => void;
  setNoteId: (id: number | null) => void;
  onUpdate: NoteModalProps["onUpdate"];
}) {
  return (
    <div className="mt-6 flex justify-between items-center">
      <modal.CancelButton modalId={modalId} />
      <div className="flex gap-2">
        <SaveNoteButton
          modalId={modalId}
          day={day}
          content={content}
          setNoteId={setNoteId}
          onUpdate={onUpdate}
        />
        <DeleteNoteButton
          modalId={modalId}
          day={day}
          setNoteContent={setNoteContent}
          setNoteId={setNoteId}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  );
}

export function ViewModalButtons({
  modalId = "viewNoteModal",
  note,
  day,
  setNoteContent,
  setNoteId,
  onUpdate,
  onClick,
}: {
  modalId: string;
  note: MeditationNote;
  day: MeditationData;
  setNoteContent: (content: string) => void;
  setNoteId: (id: number | null) => void;
  onUpdate: NoteModalProps["onUpdate"];
  onClick: () => void;
}) {
  return (
    <div className="mt-6 flex justify-between items-center">
      <modal.CancelButton modalId={modalId} />
      <div className="flex gap-2">
        <EditNoteButton
          modalId="viewNoteModal"
          note={note} // Pass the note to EditNoteButton
          day={day}
          onUpdate={onUpdate}
          onClick={onClick}
        />
        <DeleteNoteButton
          modalId="viewNoteModal"
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
  modalId = "viewNoteModal",
  note,
  onUpdate,
  onEdit,
}: {
  modalId: string;
  note: MeditationNote;
  onClose: () => void;
  onUpdate: () => void;
  onEdit: () => void;
}) {
  const { meditation_day_full } = note;
  const { arc_title, day_title, master_day_number, arc_id, arc_day_number } =
    meditation_day_full || {};

  const [_, setNoteId] = useState<number | null>(null);
  const [noteContent, setNoteContent] = useState(note.content);
  const { isOpen } = useModal(modalId);

  const normalizedDay: Partial<MeditationData> = {
    master_day_number,
    arc_id,
    arc_title,
    day_title,
    arc_day_number,
  };

  useEffect(() => {
    getAllNotes();
  }, []);

  if (!isOpen) return null;
  if (!normalizedDay?.master_day_number) {
    return (
      <modal.BaseModal modalId={modalId}>
        <modal.CloseButton modalId={modalId} />
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold">No Day Selected</h2>
          <p>Please select a meditation day to edit its note.</p>
        </div>
      </modal.BaseModal>
    );
  }

  return (
    <modal.BaseModal modalId={modalId}>
      <modal.CloseButton modalId={modalId} />
      <p className="text-xs italic font-bold text-center">
        <span className="underline">{arc_title}</span>
      </p>
      <modal.ModalTitle title={day_title} />

      <div className="w-full h-64 p-4 bg-transparent block wrap-break-word overflow-y-auto whitespace-normal text-balance border border-gray-400 rounded-lg resize-none font-serif text-[1rem] leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-400">
        {note.content}
      </div>
      <ViewModalButtons
        modalId={modalId}
        note={note}
        day={normalizedDay as MeditationData} // Cast to MeditationData
        setNoteContent={setNoteContent}
        setNoteId={setNoteId}
        onUpdate={onUpdate}
        onClick={onEdit} // Pass onClick to EditNoteButton
      />
    </modal.BaseModal>
  );
}
