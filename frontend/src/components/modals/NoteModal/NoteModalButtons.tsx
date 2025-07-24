import { toast } from "react-toastify";
import { CancelButton } from "@/components/modals/BaseModal";
import type { MeditationNote } from "@/utils/types";
import * as modal from "@/components/modals/BaseModal";
import { saveNote, deleteNote } from "@/hooks/useNotes";
import { useModal } from "@/hooks/useModal";

interface NoteActionButtonProps {
  id?: number;
  modalId: string;
  actionType: "save" | "delete" | "edit";
  master_day_number: number;
  content?: string;
  setNoteId?: (id: number | null) => void;
  onUpdate: () => void;
  onEdit?: () => void;
}

export function NoteActionButton({
  id,
  modalId,
  actionType,
  master_day_number,
  content,
  setNoteId,
  onUpdate,
  onEdit,
}: NoteActionButtonProps) {
  const { closeModal } = useModal(modalId);

  const handleAction = async () => {
    try {
      if (actionType === "save") {
        const saved = await saveNote({
          id,
          meditation_day: master_day_number,
          content: content ?? "",
        });
        setNoteId?.(saved.id);
        toast.success("Note saved successfully!");
      } else if (actionType === "delete") {
        const confirmUpdate = window.confirm(
          "This will delete your note.\n\nDo you want to continue?"
        );
        if (confirmUpdate) {
          await deleteNote(master_day_number);
          toast.success("Note deleted successfully!");
        } else {
          return; // Exit if user cancels
        }
      } else if (actionType === "edit") {
        onEdit?.();
      }
      onUpdate();
    } catch (error) {
      toast.error(`Failed to ${actionType} note.`);
    } finally {
      closeModal();
    }
  };

  const buttonText =
    actionType === "save"
      ? "Save Note"
      : actionType === "delete"
      ? "Delete Note"
      : "Edit Note";
  const buttonVariant =
    actionType === "save" || actionType === "edit"
      ? "primary"
      : actionType === "delete"
      ? "danger"
      : "secondary";

  return (
    <modal.ModalButton
      text={buttonText}
      onClick={handleAction}
      variant={buttonVariant}
    />
  );
}

export function EditNoteModalButtons({
  modalId,
  master_day_number,
  content,
  setNoteId,
  onUpdate,
  id, // Add id to props
}: {
  modalId: string;
  master_day_number: number;
  content: string;
  setNoteId: (id: number | null) => void;
  onUpdate: () => void;
  id?: number; // Add id to props
}) {
  return (
    <div className="mt-6 flex justify-between items-center">
      <CancelButton modalId={modalId} onClick={() => {}} />
      <div className="flex gap-2">
        <NoteActionButton
          modalId={modalId}
          actionType="save"
          master_day_number={master_day_number}
          content={content}
          setNoteId={setNoteId}
          onUpdate={onUpdate}
          id={id}
        />
        <NoteActionButton
          modalId={modalId}
          actionType="delete"
          master_day_number={master_day_number}
          setNoteId={setNoteId}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  );
}

export function ViewNoteModalButtons({
  modalId,
  note,
  master_day_number,
  setNoteId,
  onUpdate,
  onEdit,
}: {
  modalId: string;
  note: MeditationNote;
  master_day_number: number;
  setNoteContent: (content: string) => void;
  setNoteId: (id: number | null) => void;
  onUpdate: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="mt-6 flex justify-between items-center">
      <CancelButton modalId={modalId} onClick={() => {}} />
      <div className="flex gap-2">
        <NoteActionButton
          modalId={modalId}
          actionType="edit"
          master_day_number={master_day_number}
          content={note.content}
          setNoteId={setNoteId}
          onUpdate={onUpdate}
          onEdit={onEdit}
        />
        <NoteActionButton
          modalId={modalId}
          actionType="delete"
          master_day_number={master_day_number}
          setNoteId={setNoteId}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  );
}
