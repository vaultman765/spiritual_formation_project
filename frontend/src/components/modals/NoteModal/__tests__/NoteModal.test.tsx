import { render, screen, fireEvent } from "@/test-utils/testing-library-exports";
import { EditNoteModal, ViewerNoteModal } from "@/components/modals/NoteModal/NoteModal";
import { useModal } from "@/hooks/useModal";

jest.mock("@/hooks/useModal", () => ({
  useModal: jest.fn(() => ({
    isOpen: jest.fn(),
    closeModal: jest.fn(),
  })),
}));

jest.mock("@/components/modals/BaseModal", () => ({
  ...jest.requireActual("@/components/modals/BaseModal"),
  CloseButton: ({ modalId }: { modalId: string }) => {
    const { closeModal } = useModal(modalId);
    return (
      <button onClick={() => closeModal()} aria-label="Close" type="button">
        ×
      </button>
    );
  },
}));

describe("NoteModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("EditNoteModal", () => {
    it("renders correctly with provided props", () => {
      (useModal as jest.Mock).mockReturnValue({ isOpen: true });

      render(
        <EditNoteModal
          modalId="editNoteModal"
          day={{
            id: 1,
            content: "Test content",
            meditation_day_full: {
              id: 1,
              arc_id: "arc_love_of_god",
              arc_day_number: 1,
              arc_title: "Arc Title",
              day_title: "Day 1",
              master_day_number: 1,
            },
            updated_at: "2024-01-01T00:00:00Z",
          }}
          title="Edit Note"
          content="Test content"
          master_day_number={1}
          onUpdate={jest.fn()}
          onClose={jest.fn()}
        />
      );

      expect(screen.getByText("Edit Note")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Write your thoughts, inspirations, or resolutions here...")).toHaveValue("Test content");
    });

    it("calls closeModal when the close button is clicked", () => {
      const closeModal = jest.fn();
      (useModal as jest.Mock).mockReturnValue({ isOpen: true, closeModal });

      render(
        <EditNoteModal
          modalId="editNoteModal"
          day={{
            id: 1,
            content: "Test content",
            meditation_day_full: {
              id: 1,
              arc_id: "arc_love_of_god",
              arc_day_number: 1,
              arc_title: "Arc Title",
              day_title: "Day 1",
              master_day_number: 1,
            },
            updated_at: "2024-01-01T00:00:00Z",
          }}
          title="Edit Note"
          content="Test content"
          master_day_number={1}
          onUpdate={jest.fn()}
          onClose={jest.fn()}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: "Close" }));
      expect(closeModal).toHaveBeenCalledTimes(1);
    });

    it("does not render when isOpen is false", () => {
      (useModal as jest.Mock).mockReturnValue({ isOpen: false });

      const { container } = render(
        <EditNoteModal
          modalId="editNoteModal"
          day={{
            id: 1,
            content: "Test content",
            meditation_day_full: {
              id: 1,
              arc_id: "arc_love_of_god",
              arc_day_number: 1,
              arc_title: "Arc Title",
              day_title: "Day 1",
              master_day_number: 1,
            },
            updated_at: "2024-01-01T00:00:00Z",
          }}
          title="Edit Note"
          content="Test content"
          master_day_number={1}
          onUpdate={jest.fn()}
          onClose={jest.fn()}
        />
      );

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("ViewerNoteModal", () => {
    it("renders correctly with provided props", () => {
      (useModal as jest.Mock).mockReturnValue({ isOpen: true });

      render(
        <ViewerNoteModal
          modalId="viewerNoteModal"
          day={{
            id: 1,
            content: "Test content",
            meditation_day_full: {
              id: 1,
              arc_id: "arc_love_of_god",
              arc_day_number: 1,
              arc_title: "Arc Title",
              day_title: "Day 1",
              master_day_number: 1,
            },
            updated_at: "2024-01-01T00:00:00Z",
          }}
          title="Day 1"
          content="Test content"
          onUpdate={jest.fn()}
          onEdit={jest.fn()}
          onClose={jest.fn()}
        />
      );

      expect(screen.getByText("Day 1")).toBeInTheDocument();
      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("calls onEdit when the edit button is clicked", () => {
      const onEdit = jest.fn();
      (useModal as jest.Mock).mockReturnValue({
        isOpen: true,
        closeModal: jest.fn(),
      });

      render(
        <ViewerNoteModal
          modalId="viewerNoteModal"
          day={{
            id: 1,
            content: "Test content",
            meditation_day_full: {
              id: 1,
              arc_id: "arc_love_of_god",
              arc_day_number: 1,
              arc_title: "Arc Title",
              day_title: "Day 1",
              master_day_number: 1,
            },
            updated_at: "2024-01-01T00:00:00Z",
          }}
          title="Day 1"
          content="Test content"
          onUpdate={jest.fn()}
          onEdit={onEdit}
          onClose={jest.fn()}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: /edit/i }));
      expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it("does not render when isOpen is false", () => {
      (useModal as jest.Mock).mockReturnValue({ isOpen: false });

      const { container } = render(
        <ViewerNoteModal
          modalId="viewerNoteModal"
          day={{
            id: 1,
            content: "Test content",
            meditation_day_full: {
              id: 1,
              arc_id: "arc_love_of_god",
              arc_day_number: 1,
              arc_title: "Arc Title",
              day_title: "Day 1",
              master_day_number: 1,
            },
            updated_at: "2024-01-01T00:00:00Z",
          }}
          title="Day 1"
          content="Test content"
          onUpdate={jest.fn()}
          onEdit={jest.fn()}
          onClose={jest.fn()}
        />
      );

      expect(container).toBeEmptyDOMElement();
    });
  });
});
