import * as modal from "@/components/modals/BaseModal";
import EditNoteContent from "@/components/modals/NoteModal/EditNoteContent";
import { EditNoteModalButtons, ViewNoteModalButtons } from "@/components/modals/NoteModal/NoteModalButtons";
import { useModal } from "@/hooks/useModal";
import type { MeditationNote } from "@/utils/types";
import { useEffect, useState } from "react";

interface NoteModalProps {
  modalId: string;
  title: string;
  content: string;
  day?: MeditationNote | null;
  master_day_number?: number;
  onUpdate: () => void;
  onClose?: () => void;
  onEdit?: () => void;
}

export function EditNoteModal({ modalId = "editNoteModal", day, title, content, master_day_number, onUpdate, onClose }: NoteModalProps) {
  const { isOpen } = useModal(modalId);
  const [noteContent, setNoteContent] = useState(content);

  useEffect(() => {
    setNoteContent(content);
  }, [content]);

  if (!isOpen) return null;

  if (!master_day_number) {
    return (
      <modal.BaseModal modalId={modalId} onClose={onClose}>
        <modal.CloseButton modalId={modalId} />
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold">No Day Selected</h2>
          <p>Please select a meditation day to edit its note.</p>
        </div>
      </modal.BaseModal>
    );
  }

  return (
    <modal.BaseModal modalId={modalId} onClose={onClose}>
      <modal.CloseButton modalId={modalId} />
      <modal.ModalTitle title={title} />
      <EditNoteContent
        content={noteContent}
        placeholder="Write your thoughts, inspirations, or resolutions here..."
        onChange={setNoteContent}
      />
      <EditNoteModalButtons
        id={day?.id}
        modalId={modalId}
        master_day_number={master_day_number}
        content={noteContent}
        setNoteId={() => {}}
        onUpdate={onUpdate}
      />
    </modal.BaseModal>
  );
}

export function ViewerNoteModal({ modalId = "viewerNoteModal", day, onUpdate, onEdit, onClose }: NoteModalProps) {
  const { isOpen } = useModal(modalId);

  if (!isOpen || !day) return null;

  const { meditation_day_full, content } = day as MeditationNote;

  if (!meditation_day_full?.master_day_number) {
    return (
      <modal.BaseModal modalId={modalId} onClose={onClose}>
        <modal.CloseButton modalId={modalId} />
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold">No Day Selected</h2>
          <p>Please select a meditation day to view its note.</p>
        </div>
      </modal.BaseModal>
    );
  }

  return (
    <modal.BaseModal modalId={modalId} onClose={onClose}>
      <modal.CloseButton modalId={modalId} />
      <modal.ModalTitle title={meditation_day_full.day_title} />
      <div
        className="w-full h-64 p-4 bg-transparent block wrap-break-word overflow-y-auto whitespace-normal text-balance border border-gray-400 rounded-lg resize-none font-serif text-[1rem] leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-400"
        style={{ whiteSpace: "pre-wrap" }}
      >
        {content}
      </div>
      <ViewNoteModalButtons
        modalId={modalId}
        note={day as MeditationNote}
        master_day_number={meditation_day_full?.master_day_number}
        setNoteContent={() => {}}
        setNoteId={() => {}}
        onUpdate={onUpdate}
        onEdit={onEdit ?? (() => {})}
      />
    </modal.BaseModal>
  );
}
