import { render, screen, fireEvent } from "@testing-library/react";
import {
  NoteActionButton,
  EditNoteModalButtons,
  ViewNoteModalButtons,
} from "@/components/modals/NoteModal/NoteModalButtons";
import { useModal } from "@/hooks/useModal";
import type { MeditationNote } from "@/utils/types";
import { saveNote, deleteNote } from "@/hooks/useNotes";
import { toast } from "react-toastify";

jest.mock("@/hooks/useModal", () => ({
  useModal: jest.fn(() => ({
    closeModal: jest.fn(),
  })),
}));

jest.mock("@/hooks/useNotes", () => ({
  saveNote: jest.fn(),
  deleteNote: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("NoteModalButtons", () => {
  describe("NoteActionButton", () => {
    it("calls saveNote and closes the modal when actionType is 'save'", async () => {
      const closeModal = jest.fn();
      const onUpdate = jest.fn();
      const setNoteId = jest.fn();
      (useModal as jest.Mock).mockReturnValue({ closeModal });
      (saveNote as jest.Mock).mockResolvedValue({ id: 1 });

      render(
        <NoteActionButton
          modalId="testModal"
          actionType="save"
          master_day_number={1}
          content="Test content"
          setNoteId={setNoteId}
          onUpdate={onUpdate}
        />
      );

      fireEvent.click(screen.getByText("Save Note"));

      expect(saveNote).toHaveBeenCalledWith({
        id: undefined,
        meditation_day: 1,
        content: "Test content",
      });
      await screen.findByText("Save Note"); // Wait for async actions
      expect(setNoteId).toHaveBeenCalledWith(1);
      expect(toast.success).toHaveBeenCalledWith("Note saved successfully!");
      expect(onUpdate).toHaveBeenCalled();
      expect(closeModal).toHaveBeenCalled();
    });

    it("calls deleteNote and closes the modal when actionType is 'delete'", async () => {
      const closeModal = jest.fn();
      const onUpdate = jest.fn();
      (useModal as jest.Mock).mockReturnValue({ closeModal });
      (deleteNote as jest.Mock).mockResolvedValue(undefined);

      window.confirm = jest.fn(() => true); // Mock confirmation dialog

      render(
        <NoteActionButton
          modalId="testModal"
          actionType="delete"
          master_day_number={1}
          onUpdate={onUpdate}
        />
      );

      fireEvent.click(screen.getByText("Delete Note"));

      expect(deleteNote).toHaveBeenCalledWith(1);
      await screen.findByText("Delete Note"); // Wait for async actions
      expect(toast.success).toHaveBeenCalledWith("Note deleted successfully!");
      expect(onUpdate).toHaveBeenCalled();
      expect(closeModal).toHaveBeenCalled();
    });

    it("calls onEdit when actionType is 'edit'", () => {
      const onEdit = jest.fn();

      render(
        <NoteActionButton
          modalId="testModal"
          actionType="edit"
          master_day_number={1}
          onEdit={onEdit}
          onUpdate={jest.fn()} // Add this line
        />
      );

      fireEvent.click(screen.getByText("Edit Note"));

      expect(onEdit).toHaveBeenCalled();
    });
  });

  describe("EditNoteModalButtons", () => {
    it("renders Save, Delete, and Cancel buttons", () => {
      const onUpdate = jest.fn();
      const setNoteId = jest.fn();

      render(
        <EditNoteModalButtons
          modalId="testModal"
          master_day_number={1}
          content="Test content"
          setNoteId={setNoteId}
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText("Save Note")).toBeInTheDocument();
      expect(screen.getByText("Delete Note")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
  });

  describe("ViewNoteModalButtons", () => {
    it("renders Edit, Delete, and Cancel buttons", () => {
      const onUpdate = jest.fn();
      const onEdit = jest.fn();
      const setNoteId = jest.fn();

      render(
        <ViewNoteModalButtons
          modalId="testModal"
          note={{ content: "Test content" } as MeditationNote}
          master_day_number={1}
          setNoteContent={jest.fn()} // Add this line
          setNoteId={setNoteId}
          onUpdate={onUpdate}
          onEdit={onEdit}
        />
      );

      expect(screen.getByText("Edit Note")).toBeInTheDocument();
      expect(screen.getByText("Delete Note")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
  });
});
