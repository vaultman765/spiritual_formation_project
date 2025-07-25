import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAuth } from '@/context/authContext';
import { fetchDayByArc } from "@/api/days";
import type { MeditationData } from "@/utils/types";
import SecondaryReadings from "@/components/SecondaryReadings";
import ScrollToTop from "@/components/ScrollToTop";
import { useJourney } from "@/context/journeyContext";
import { getNote, saveNote, deleteNote } from '@/hooks/useNotes';

export default function MeditationDayPage() {
  const { user } = useAuth();
  const [day, setDay] = useState<MeditationData | null>(null);
  const [showResolution, setShowResolution] = useState(false);
  const { arcID, arcDayNumber } = useParams<{ arcID: string; arcDayNumber: string }>();
  const { markDayComplete, refreshJourneys } = useJourney();
  const navigate = useNavigate();
  const { activeJourney } = useJourney();
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteContent, setNoteContent] = useState<string>("");
  const [noteId, setNoteId] = useState<number | null>(null);
  const [loadingNote, setLoadingNote] = useState(true);

  const currentArc = activeJourney?.arc_progress?.find(a => a.status === 'in_progress');
  const isCurrentArc = currentArc?.arc_id === arcID;
  const currentDay = currentArc?.current_day;
  const isCurrentDay = currentDay === parseInt(arcDayNumber || "0");

  const handleSaveNote = async () => {
    if (!day) return;

    const originalNote = await getNote(day.master_day_number);

    try {
      const saved = await saveNote({
        meditation_day: day.master_day_number,
        content: noteContent ?? "",
        id: originalNote?.id
      });
      setNoteId(saved.id);
      toast.success('Note saved successfully!');
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note.');
    } finally {
      setShowNoteModal(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!day) return;

    try {
      console.log('Deleting note for day:', day.master_day_number);
      await deleteNote(day.master_day_number);
      setNoteContent("");
      setNoteId(null);
      toast.success('Note deleted successfully!');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note.');
      setShowNoteModal(false);
      getNote(day.master_day_number)
    } finally {
      setShowNoteModal(false);
      getNote(day.master_day_number)
    }
  };

  useEffect(() => {
    const fetchNote = async () => {
      if (!day?.master_day_number) return;

      try {
        const note = await getNote(day.master_day_number);
        setNoteContent(note.content);
        setNoteId(note.id);
      } catch (err) {
        console.warn('No note found for day', day.master_day_number);
      } finally {
        setLoadingNote(false);
      }
    };

    fetchNote();
  }, [day?.master_day_number]);



  const handleMarkDayComplete = async () => {
    try {
      await markDayComplete();
      navigate("/my-journey");
      await refreshJourneys();
    } catch (error) {
      console.error("Failed to mark day complete:", error);
    }
  }

  useEffect(() => {
    if (arcID && arcDayNumber) {
      fetchDayByArc(arcID, parseInt(arcDayNumber))
        .then(setDay)
        .catch(console.error);
    }
  }, [arcID, arcDayNumber]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [arcDayNumber]);

    if (!day || loadingNote) return <p className="text-center text-white mt-10">Loading...</p>;


  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--bg-light)] via-[var(--bg-mid)] to-[var(--bg-dark)] text-white px-6 pb-2 pt-0">
      <ScrollToTop />

      {/* Header */}
      <section className="text-center mb-6 relative">
              <h1 className="text-4xl md:text-5xl font-display font-semibold text-[var(--text-main)] mb-2 leading-snug">
                {day.day_title}
              </h1>
              <p className="text-sm italic text-[var(--text-muted)]">
                Arc: {day.arc_title} (Day {day.arc_day_number} of {day.arc_total_days}) •{" "}
                <Link
                  to={`/arcs/${day.arc_id}`}
                  className="underline hover:text-[var(--brand-primary)]"
                >
                  View Arc
                </Link>
              </p>
      
              {day.resolution && (
                <button
                  onClick={() => setShowResolution(!showResolution)}
                  className="absolute top-0 right-0 mt-2 mr-2 text-xs text-[var(--text-muted)] hover:text-white border border-white/20 px-3 py-1 rounded-full transition-all duration-200"
                >
                  {showResolution ? "Hide Resolution" : "Show Suggested Resolution"}
                </button>
              )}
            </section>

            {user && (
              <div className="flex justify-end gap-3 mt-2 mr-4">
                <button
                  className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded shadow"
                  onClick={() => setShowNoteModal(true)}
                >
                  {noteContent ? 'Edit Your Notes' : 'Take Meditation Notes'}
                </button>
              </div>
            )}


      {/* Side-by-Side Image and Readings */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-12 mb-6">
        <div className="flex flex-col md:flex-row gap-x-12 gap-y-6 items-center">
          {/* Image */}
          <div className="flex-shrink-0">
            <img
              src={`/images/arc_days/${day.arc_id}_day_${String(
                day.arc_day_number
              ).padStart(2, "0")}.jpg`}
              alt={day.day_title}
              className="rounded-xl border-2 border-yellow-500 max-w-sm w-full object-contain shadow-lg shadow-black/20"
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col space-y-12 max-w-xl text-center md:text-left items-center md:items-start mt-6 md:mt-0">
            {/* Primary Reading */}
            <div>
              <h2 className="text-sm uppercase tracking-widest text-[var(--text-subtle-heading)] mb-1">
                Primary Reading
              </h2>
              <p className="text-lg font-semibold text-[var(--text-light)]">
                {day.primary_reading.title}
              </p>
            </div>

            {/* Secondary Readings */}
            <div>
              <h2 className="text-sm uppercase tracking-widest text-[var(--text-subtle-heading)] mb-1">
                Secondary Readings
              </h2>
              <SecondaryReadings readings={day.secondary_readings} />
            </div>

            {/* Prelude Image */}
            <div>
              <h2 className="text-sm uppercase tracking-widest text-[var(--text-subtle-heading)] mb-1">
                Prelude Image
              </h2>
              <p className="text-[var(--text-main)] bg-white/5 p-3 rounded-md shadow-inner max-w-md">
                {day.anchor_image}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meditative Points */}
      <section className="mb-3 max-w-4xl text-center mx-auto">
        <h2 className="text-sm tracking-[.15em] font-semibold text-[var(--text-subtle-heading)] uppercase mb-3">
          Meditative Points
        </h2>
        <ol className="pl-5 space-y-2 text-[var(--text-main)] text-sm max-w-3xl mx-auto">
          {day.meditative_points.map((pt, i) => (
            <li key={i} className="mb-2">
              {pt}
            </li>
          ))}
        </ol>
      </section>

      <hr className="border-t border-white/10 my-4 max-w-2xl mx-auto" />

      {/* Ejaculatory Prayer */}
      <section className="text-center mb-4">
        <h2 className="text-sm tracking-[.15em] font-semibold text-[var(--text-subtle-heading)] uppercase mb-3">
          Ejaculatory Prayer
        </h2>
        <p className="text-[var(--text-main)] max-w-4xl mx-auto">
          {day.ejaculatory_prayer}
        </p>
      </section>

      {/* Colloquy */}
      <section className="text-center">
        <h2 className="text-sm tracking-[.15em] font-semibold text-[var(--text-subtle-heading)] uppercase mb-2">
          Colloquy
        </h2>
        <p className="text-[var(--text-main)] italic max-w-4xl mx-auto">
          {day.colloquy}
        </p>
      </section>

      {/* Optional Resolution */}
      {showResolution && day.resolution && (
        <section className="text-center mt-8">
          <h2 className="text-sm tracking-[.15em] font-semibold text-[var(--text-subtle-heading)] uppercase mb-2">
            Resolution
          </h2>
          <p className="text-[var(--text-main)] italic max-w-3xl mx-auto">
            {day.resolution}
          </p>
        </section>
      )}

      <hr className="border-t border-white/10 my-4 max-w-2xl mx-auto" />

      {/* Navigation */}
      <div className="mt-10 flex justify-between max-w-xl mx-auto px-4">
        {day.arc_day_number > 1 ? (
          <button
            className="text-sm text-[var(--text-light)] hover:text-white underline"
            onClick={() => navigate(`/days/${day.arc_id}/${day.arc_day_number - 1}`)}
          >
            ← Previous Day
          </button>
        ) : <div />}

        {isCurrentArc && isCurrentDay && (
          <button
            onClick={handleMarkDayComplete}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-semibold shadow hover:shadow-lg transition mt-10"
          >
            ✅ Mark Today as Complete
          </button>
        )}

        {day.arc_day_number < day.arc_total_days ? (
          <button
            className="text-sm text-[var(--text-light)] hover:text-white underline"
            onClick={() => navigate(`/days/${day.arc_id}/${day.arc_day_number + 1}`)}
          >
            Next Day →
          </button>
        ) : <div />}
      </div>

      {/* Note Editor Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#fefae0] text-gray-900 w-[90%] max-w-2xl rounded-lg shadow-lg border border-gray-300 px-6 py-6 relative font-serif">
            {/* Close Button */}
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setShowNoteModal(false)}
            >
              &times;
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-4 text-center border-b pb-2 border-gray-300">
              My Meditation Notes
            </h2>

            {/* Textarea */}
            <textarea
              className="w-full h-64 p-4 bg-transparent border border-gray-400 rounded-lg resize-none font-serif text-[1rem] leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Write your thoughts, inspirations, or resolutions here..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />

            {/* Buttons */}
            <div className="mt-6 flex justify-between items-center">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowNoteModal(false)}
              >
                Cancel
              </button>
              <div className="flex gap-2">
                {noteId && (
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={handleDeleteNote}
                  >
                    Delete
                  </button>
                )}
                <button
                  className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
                  onClick={handleSaveNote}
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}