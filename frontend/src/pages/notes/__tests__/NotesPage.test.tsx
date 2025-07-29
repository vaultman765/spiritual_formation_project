import { ModalProvider } from "@/context/modalContext";
import * as notesApi from "@/hooks/useNotes";
import NotesPage from "@/pages/notes/NotesPage";
import * as groupNotes from "@/utils/groupNotes";
import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";

jest.mock("@/utils/groupNotes");
jest.mock("@/hooks/useNotes");
jest.mock("@/components/SimpleListboxDropdown", () => ({
  __esModule: true,
  default: ({
    options,
    selected,
    onChange,
  }: {
    options: string[];
    selected: string;
    onChange: (val: string) => void;
  }) => (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      data-testid="dropdown"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option === "month" ? "Group by Month" : "Group by Arc"}
        </option>
      ))}
    </select>
  ),
}));

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("NotesPage Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should group notes by arc and display them", async () => {
    jest.spyOn(notesApi, "getAllNotes").mockResolvedValue([
      {
        id: 1,
        content: "Note 1",
        meditation_day_full: {
          id: 101,
          arc_id: "arc_day_1",
          arc_day_number: 1,
          day_title: "Day 1",
          master_day_number: 1,
          arc_title: "Love of God - Foundation of All",
        },
        updated_at: "2023-10-01T00:00:00Z",
      },
      {
        id: 2,
        content: "Note 2",
        meditation_day_full: {
          id: 102,
          arc_id: "arc_day_1",
          arc_day_number: 2,
          day_title: "Day 2",
          master_day_number: 2,
          arc_title: "Love of God - Foundation of All",
        },
        updated_at: "2023-10-01T00:00:00Z",
      },
    ]);

    jest.spyOn(groupNotes, "groupNotesByArc").mockReturnValue({
      "Love of God - Foundation of All": [
        {
          id: 1,
          content: "Note 1",
          meditation_day_full: {
            id: 101,
            arc_id: "arc_day_1",
            arc_day_number: 1,
            day_title: "Day 1",
            master_day_number: 1,
            arc_title: "Love of God - Foundation of All",
          },
          updated_at: "2023-10-01T00:00:00Z",
        },
        {
          id: 2,
          content: "Note 2",
          meditation_day_full: {
            id: 102,
            arc_id: "arc_day_1",
            arc_day_number: 2,
            day_title: "Day 2",
            master_day_number: 2,
            arc_title: "Love of God - Foundation of All",
          },
          updated_at: "2023-10-01T00:00:00Z",
        },
      ],
    });

    await act(async () => {
      render(
        <ModalProvider>
          {" "}
          {/* Wrap NotesPage with ModalProvider */}
          <NotesPage />
        </ModalProvider>
      );
    });

    const dropdown = screen.getByTestId("dropdown");
    fireEvent.change(dropdown, { target: { value: "arc" } });

    const arcTitles = await screen.findAllByText((content) =>
      content.includes("Love of God - Foundation of All")
    );
    expect(arcTitles).toHaveLength(3);
  });

  it("should open and close NoteModal when clicking on a NoteCard", async () => {
    jest.spyOn(notesApi, "getAllNotes").mockResolvedValue([
      {
        id: 1,
        content: "Note 1",
        meditation_day_full: {
          id: 101,
          arc_id: "arc_day_1",
          arc_day_number: 1,
          day_title: "Day 1",
          master_day_number: 1,
          arc_title: "Love of God - Foundation of All",
        },
        updated_at: "2023-10-01T00:00:00Z",
      },
    ]);

    jest.spyOn(groupNotes, "groupNotesByArc").mockReturnValue({
      "Love of God - Foundation of All": [
        {
          id: 1,
          content: "Note 1",
          meditation_day_full: {
            id: 101,
            arc_id: "arc_day_1",
            arc_day_number: 1,
            day_title: "Day 1",
            master_day_number: 1,
            arc_title: "Love of God - Foundation of All",
          },
          updated_at: "2023-10-01T00:00:00Z",
        },
      ],
    });

    await act(async () => {
      render(
        <ModalProvider>
          <NotesPage />
        </ModalProvider>
      );
    });

    // Set the dropdown to "arc" to trigger grouping by arc
    const dropdown = screen.getByTestId("dropdown");
    fireEvent.change(dropdown, { target: { value: "arc" } });

    screen.debug(); // Inspect the rendered DOM

    // Query the NoteCard by day title
    const noteCard = screen.getByText("Day 1");
    expect(noteCard).toBeInTheDocument();

    fireEvent.click(noteCard);

    // Assert that the NoteModal is opened
    expect(await screen.findByText("Note 1")).toBeInTheDocument();

    // Simulate closing the NoteModal by clicking the close button
    const closeButton = screen.getByText("×");
    fireEvent.click(closeButton);

    // Assert that the NoteModal is closed
    expect(screen.queryByText("Note 1")).not.toBeInTheDocument();
  });
});
