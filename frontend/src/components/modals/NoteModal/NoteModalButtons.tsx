import * as modal from "@/components/modals/BaseModal";
import { CancelButton } from "@/components/modals/BaseModal";
import { useModal } from "@/hooks/useModal";
import { deleteNote, saveNote } from "@/hooks/useNotes";
import type { MeditationNote } from "@/utils/types";
import { toast } from "react-toastify";

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
}: Readonly<NoteActionButtonProps>) {
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
        const confirmUpdate = window.confirm("This will delete your note.\n\nDo you want to continue?");
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
      console.error('Note operation failed:', actionType, error);
      toast.error(`Failed to ${actionType} note.`);
    } finally {
      closeModal();
    }
  };

  let buttonText = "";
  if (actionType === "save") {
    buttonText = "Save Note";
  } else if (actionType === "delete") {
    buttonText = "Delete Note";
  } else {
    buttonText = "Edit Note";
  }

  let buttonVariant: "primary" | "secondary" | "danger" = "secondary";
  if (actionType === "save" || actionType === "edit") {
    buttonVariant = "primary";
  } else if (actionType === "delete") {
    buttonVariant = "danger";
  }

  return <modal.ModalButton text={buttonText} onClick={handleAction} variant={buttonVariant} />;
}

export function EditNoteModalButtons({
  id,
  modalId,
  master_day_number,
  content,
  setNoteId,
  onUpdate,
  onClose,
}: Readonly<{
  id?: number;
  modalId: string;
  master_day_number: number;
  content: string;
  setNoteId: (id: number | null) => void;
  onUpdate: () => void;
  onClose?: () => void;
}>) {
  return (
    <div className="mt-6 flex justify-between items-center">
      <CancelButton
        modalId={modalId}
        onClick={() => {
          if (onClose) onClose(); // Invoke onClose if provided
        }}
      />
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
  onClose,
}: Readonly<{
  modalId: string;
  note: MeditationNote;
  master_day_number: number;
  setNoteId: (id: number | null) => void;
  onUpdate: () => void;
  onEdit: () => void;
  onClose?: () => void;
}>) {
  return (
    <div className="mt-6 flex justify-between items-center">
      <CancelButton
        modalId={modalId}
        onClick={() => {
          if (onClose) onClose(); // Invoke onClose if provided
        }}
      />
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
