import { useState } from "react";
import * as modal from "@/components/modals/BaseModal";
import { useModal } from "@/hooks/useModal";
import { saveNote, deleteNote, getNote } from "@/hooks/useNotes";
import type { MeditationData } from "@/utils/types";
import { toast } from "react-toastify";

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

  const dayId = day?.master_day_number;

  const handleSave = async () => {
    if (!dayId) return;

    const originalNote = await getNote(dayId);

    if (originalNote && originalNote.content === noteContent) {
      closeModal();
      return; // No changes made
    }

    try {
      const saved = await saveNote({
        meditation_day: day.master_day_number,
        content: noteContent ?? "",
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

  const handleDelete = async () => {
    if (!dayId) return;

    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await deleteNote(dayId);
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

  if (!isOpen) return null;

  return (
    <modal.BaseModal>
      <modal.CloseButton />
      <modal.ModalTitle title={title} />
      <EditNoteContent
        content={noteContent}
        placeholder="Write your thoughts, inspirations, or resolutions here..."
        onChange={setNoteContent}
      />
      <div className="mt-6 flex justify-between items-center">
        <modal.CancelButton />
        <div className="flex gap-2">
          <modal.SaveButton text="Save Note" onClick={handleSave} />
          <modal.DeleteButton text="Delete Note" onClick={handleDelete} />
        </div>
      </div>
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
