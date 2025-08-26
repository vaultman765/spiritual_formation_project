import { render, screen, fireEvent } from "@/test-utils/testing-library-exports";
import EditNoteContent from "@/components/modals/NoteModal/EditNoteContent";

describe("EditNoteContent", () => {
  it("renders the textarea with the correct placeholder and value", () => {
    render(<EditNoteContent content="Test content" placeholder="Write something..." onChange={() => {}} />);

    const textarea = screen.getByPlaceholderText("Write something...");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue("Test content");
  });

  it("calls onChange when the user types", () => {
    const handleChange = jest.fn();
    render(<EditNoteContent content="" placeholder="Write something..." onChange={handleChange} />);

    const textarea = screen.getByPlaceholderText("Write something...");
    fireEvent.change(textarea, { target: { value: "New content" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("New content");
  });

  it("updates the value when the content prop changes", () => {
    const { rerender } = render(<EditNoteContent content="Initial content" placeholder="Write something..." onChange={() => {}} />);

    const textarea = screen.getByPlaceholderText("Write something...");
    expect(textarea).toHaveValue("Initial content");

    rerender(<EditNoteContent content="Updated content" placeholder="Write something..." onChange={() => {}} />);

    expect(textarea).toHaveValue("Updated content");
  });
});
