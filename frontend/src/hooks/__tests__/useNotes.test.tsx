import axios from "axios";
import { getNote, deleteNote, getAllNotes } from "@/hooks/useNotes";
import type { MeditationNote } from "@/utils/types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const API_URL = import.meta.env.VITE_API_URL;

describe("useNotes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getNote", () => {
    it("fetches a note by day ID", async () => {
      const mockNote: MeditationNote = {
        id: 1,
        content: "Test note content",
        meditation_day_full: {
          id: 1,
          arc_id: "arc_1",
          arc_day_number: 64,
          arc_title: "Arc Title",
          day_title: "Day Title",
          master_day_number: 64,
        },
        updated_at: "2023-01-01T00:00:00Z",
      };
      mockedAxios.get.mockResolvedValueOnce({ data: [mockNote] });

      const result = await getNote(64);

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/api/notes/?day=64/`);
      expect(result).toEqual(mockNote);
    });

    it("returns undefined if no note is found", async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      const result = await getNote(64);

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/api/notes/?day=64`);
      expect(result).toBeUndefined();
    });
  });

  describe("deleteNote", () => {
    it("deletes a note by day ID", async () => {
      mockedAxios.delete.mockResolvedValueOnce({});

      await deleteNote(64);

      expect(mockedAxios.delete).toHaveBeenCalledWith(`${API_URL}/api/notes/by-day/`, {
        params: { day: 64 },
        headers: expect.any(Object), // Headers are passed
      });
    });
  });

  describe("getAllNotes", () => {
    it("fetches all notes", async () => {
      const mockNotes: MeditationNote[] = [
        {
          id: 1,
          content: "Note 1 content",
          meditation_day_full: {
            id: 1,
            arc_id: "arc_1",
            arc_day_number: 64,
            arc_title: "Arc Title",
            day_title: "Day Title",
            master_day_number: 64,
          },
          updated_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 2,
          content: "Note 2 content",
          meditation_day_full: {
            id: 2,
            arc_id: "arc_2",
            arc_day_number: 65,
            arc_title: "Another Arc Title",
            day_title: "Another Day Title",
            master_day_number: 65,
          },
          updated_at: "2023-01-02T00:00:00Z",
        },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: mockNotes });

      const result = await getAllNotes();

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/api/notes/`);
      expect(result).toEqual(mockNotes);
    });
  });
});
