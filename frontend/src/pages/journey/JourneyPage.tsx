import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { useJourney } from "@/context/journeyContext";
import { JourneyArcCard } from "@/components/cards/ArcCard";
import type { Journey } from "@/utils/types";
import { Helmet } from "react-helmet-async";

export default function JourneyPage() {
  const { user, loading: authLoading } = useAuth();
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [recentlyCompletedArc, setRecentlyCompletedArc] = useState<string | null>(null);
  const [recentlyCompletedJourney, setRecentlyCompletedJourney] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [journeyToDelete, setJourneyToDelete] = useState<Journey | null>(null);
  const arcsPerPage = 9;
  const navigate = useNavigate();
  const {
    archivedJourneys,
    activeJourney,
    pastJourneys,
    journeyLoading,
    restoreJourney,
    restartJourney,
    refreshJourneys,
    completeJourney,
    skipArc,
    skipDay,
    deleteJourney,
  } = useJourney();
  const location = useLocation();
  const canonicalUrl = `https://www.catholicmentalprayer.com${location.pathname}`;

  useEffect(() => {
    if (!activeJourney?.arc_progress) return;

    const sorted = [...activeJourney.arc_progress].sort((a, b) => a.order - b.order);
    const inProgressIndex = sorted.findIndex((arc) => arc.status === "in_progress");
    if (inProgressIndex !== -1) {
      const page = Math.floor(inProgressIndex / arcsPerPage);
      setCurrentPage(page);
    }
  }, [activeJourney]);

  const visibleArcs = activeJourney?.arc_progress
    ?.sort((a, b) => a.order - b.order)
    ?.slice(currentPage * arcsPerPage, (currentPage + 1) * arcsPerPage);

  const totalPages = Math.ceil((activeJourney?.arc_progress?.length || 0) / arcsPerPage);

  const handleRestoreJourney = async (journey: Journey) => {
    try {
      await restoreJourney(journey.id);
      await refreshJourneys();
      setTimeout(() => navigate("/my-journey"), 50);
    } catch (err) {
      console.error("Error restoring journey:", err);
    }
  };

  const handleSkipDay = async () => {
    try {
      await skipDay();
      await refreshJourneys();
    } catch (err) {
      console.error("Error skipping day", err);
    }
  };

  const handleSkipArc = async () => {
    try {
      await skipArc();
      await refreshJourneys();
    } catch (err) {
      console.error("Error skipping arc", err);
    }
  };

  const handleCompleteJourney = async () => {
    try {
      await completeJourney();
      alert("Congratulations on completing your journey!");
      await refreshJourneys();
    } catch (err) {
      console.error("Error completing journey:", err);
    }
  };

  const handleDeleteJourney = async () => {
    if (!journeyToDelete) return;

    try {
      await deleteJourney(journeyToDelete.id);
      setShowDeleteConfirm(false);
      setJourneyToDelete(null);
      await refreshJourneys();
    } catch (err) {
      console.error("Error deleting journey:", err);
    }
  };

  useEffect(() => {
    refreshJourneys();
  }, []);

  useEffect(() => {
    const journey = localStorage.getItem("justCompletedJourney");
    const arc = localStorage.getItem("justCompletedArc");
    if (journey) {
      setRecentlyCompletedJourney(journey);
      localStorage.removeItem("justCompletedJourney");
    } else if (arc) {
      setRecentlyCompletedArc(arc);
      localStorage.removeItem("justCompletedArc");
    }
  }, []);

  useEffect(() => {
    if (authLoading || journeyLoading) return;

    // Ensure we only redirect if `journey` is explicitly null (not undefined or still loading)
    if (!user) {
      navigate("/auth/login");
      return;
    }

    if (!activeJourney && pastJourneys.length === 0) {
      navigate("/start-journey");
    }
  }, [authLoading, journeyLoading, user, activeJourney, navigate]);

  if (authLoading || journeyLoading) {
    return (
      <main className="main-background text-white text-center py-20">
        <p className="text-lg">Loading your journey...</p>
      </main>
    );
  }

  const currentArc = activeJourney?.arc_progress?.find((a) => a.status === "in_progress");
  const canCompleteJourney = activeJourney?.arc_progress.every(
    (arc) => arc.status === "completed" || arc.status === "skipped" || (arc.status === "in_progress" && arc.current_day === arc.day_count)
  );

  return (
    <main>
      <Helmet>
        <title>My Journey | Spiritual Formation Project</title>
        <meta
          name="description"
          content="Track your progress on your personal journey of Ignatian mental prayer. View current arcs, complete days, and celebrate milestones."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="My Journey | Spiritual Formation Project" />
        <meta
          property="og:description"
          content="Continue your journey with daily Ignatian meditation. Track your spiritual growth and prayer habits."
        />
        <meta property="og:image" content="https://www.catholicmentalprayer.com/images/og-journey.jpg" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="My Journey | Spiritual Formation Project" />
        <meta name="twitter:description" content="View your current meditation journey and explore your completed arcs." />
        <meta name="twitter:image" content="https://www.catholicmentalprayer.com/images/og-journey.jpg" />
      </Helmet>

      <header className="text-center mb-12">
        <h1 className="text-4xl font-display font-semibold text-white">{activeJourney?.title}</h1>
        <p className="text-lg text-[var(--text-muted)]">Your Current Mental Prayer Journey</p>
      </header>

      {currentArc && (
        <section className="mb-10 text-center" key={activeJourney?.id || "no-journey"}>
          <h2 className="text-2xl text-[var(--text-subtle-heading)] font-semibold mb-2">Currently In</h2>
          <p className="text-xl text-white font-medium">{currentArc.arc_title}</p>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Day {currentArc.current_day} of {currentArc.day_count}
          </p>
          <Link to={`/days/${currentArc.arc_id}/${currentArc.current_day}`}>
            <button className="bg-[var(--brand-primary)] px-6 py-2 rounded shadow font-semibold text-black hover:bg-[var(--hover-gold)]">
              Start Next Meditation
            </button>
          </Link>
        </section>
      )}
      {recentlyCompletedJourney ? (
        <div className="bg-blue-700 text-white px-6 py-3 rounded-lg shadow text-center mb-4">
          🌟 Congratulations! You just completed the journey: <strong>{recentlyCompletedJourney}</strong>! 🌟
        </div>
      ) : recentlyCompletedArc ? (
        <div className="bg-blue-700 text-white px-6 py-3 rounded-lg shadow text-center mb-4 relative">
          <div className="pr-8">
            🌟 Congratulations! You just completed the arc: <strong>{recentlyCompletedArc}</strong>! 🌟
          </div>
          <button
            onClick={() => setRecentlyCompletedArc(null)}
            className="absolute top-2 right-2 text-white hover:text-red-300 text-md"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      ) : null}
      {activeJourney && activeJourney.is_active ? (
        <section>
          <h2 className="text-xl font-semibold text-[var(--text-subtle-heading)] text-center mb-4">Journey Progress</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
            {visibleArcs?.map((arc) => (
              <JourneyArcCard key={arc.arc_id} {...arc} />
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mb-4">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === 0 ? "bg-white/20 text-white/50 cursor-not-allowed" : "bg-white text-black hover:bg-yellow-200"
                }`}
              >
                ← Prev
              </button>
              <span className="text-white/70 pt-2">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages - 1}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === totalPages - 1
                    ? "bg-white/20 text-white/50 cursor-not-allowed"
                    : "bg-white text-black hover:bg-yellow-200"
                }`}
              >
                Next →
              </button>
            </div>
          )}

          <div className="flex gap-4 justify-center mt-6">
            {!canCompleteJourney && (
              <div className="flex gap-4">
                <button
                  onClick={handleSkipDay}
                  className="bg-yellow-600 hover:bg-yellow-700 px-6 py-2 rounded-lg text-black font-semibold shadow hover:shadow-lg transition"
                >
                  Skip Day
                </button>

                <button
                  onClick={handleSkipArc}
                  className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg text-white font-semibold shadow hover:shadow-lg transition"
                >
                  Skip Arc
                </button>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-row justify-center mt-6 gap-4">
            {/* Complete Journey */}
            {canCompleteJourney && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={handleCompleteJourney}
                  className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-white font-semibold shadow hover:shadow-lg transition"
                >
                  🎉 Complete Journey
                </button>
              </div>
            )}

            {/* Restart Journey button */}
            {activeJourney && (
              <div className="flex justify-center mb-4">
                <button
                  className="bg-yellow-600 text-white px-4 py-1 rounded hover:bg-yellow-500"
                  onClick={() => setShowRestartConfirm(true)}
                >
                  🔁 Restart This Journey
                </button>

                {/* Confirm dialog for restarting journey */}
                {showRestartConfirm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 text-white p-6 rounded-lg border border-white/20 w-[300px] text-center">
                      <p className="mb-4">Are you sure you want to restart this journey?</p>
                      <div className="flex justify-around">
                        <button
                          className="bg-red-600 px-4 py-1 rounded hover:bg-red-500"
                          onClick={async () => {
                            await restartJourney();
                            setShowRestartConfirm(false);
                          }}
                        >
                          Yes, Restart
                        </button>
                        <button className="bg-gray-700 px-4 py-1 rounded hover:bg-gray-600" onClick={() => setShowRestartConfirm(false)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Edit Journey button */}
            {activeJourney?.is_custom && activeJourney?.is_active && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => navigate("/edit-journey")}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold shadow hover:shadow-lg transition"
                >
                  ✏️ Edit This Journey
                </button>
              </div>
            )}

            {/* Delete Journey button */}
            {activeJourney && (
              <div className="flex justify-center mb-4">
                <button
                  className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg text-white font-semibold shadow hover:shadow-lg transition"
                  onClick={() => {
                    setJourneyToDelete(activeJourney);
                    setShowDeleteConfirm(true);
                    refreshJourneys();
                  }}
                >
                  🗑️ Delete This Journey
                </button>
              </div>
            )}
          </div>
        </section>
      ) : (
        <div className="text-center mt-10">
          <p className="text-lg text-white mb-4">You’ve completed your most recent journey.</p>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => navigate("/create-custom-journey")}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 rounded-md shadow transition"
            >
              Create a Custom Journey
            </button>
            <button
              onClick={() => navigate("/prebuilt")}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl text-white font-bold shadow transition"
            >
              Browse Prebuilt Journeys
            </button>
          </div>
        </div>
      )}
      <section>
        {archivedJourneys?.length > 0 && (
          <div className="mt-10">
            <h2 className="text-3xl font-display font-semibold mb-4 text-white">Past Journeys</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {archivedJourneys.map((journey) => (
                <div key={journey.id} className="p-4 rounded-lg bg-gray-800 shadow-md">
                  <h3 className="text-xl font-semibold text-white mb-2">{journey.title}</h3>
                  <p className="text-white/70 text-sm mb-2">{journey.arc_progress.length} arcs</p>
                  {journey.completed_on ? (
                    <p className="text-green-400 text-sm mb-2">Completed on {new Date(journey.completed_on).toLocaleDateString()}</p>
                  ) : (
                    <p className="text-yellow-400 text-sm mb-2">Incomplete</p>
                  )}
                  <button
                    onClick={() => {
                      handleRestoreJourney(journey);
                    }}
                    className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-bold"
                  >
                    Restore
                  </button>

                  {/* Delete button for archived journeys */}
                  <button
                    onClick={() => {
                      setJourneyToDelete(journey);
                      setShowDeleteConfirm(true);
                      refreshJourneys();
                    }}
                    className="text-red-500 hover:text-red-700 text-sm ml-4"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      {showDeleteConfirm && journeyToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-lg border border-white/20 w-[300px] text-center">
            <p className="mb-4 font-semibold">Delete this journey?</p>
            <p className="mb-4 text-sm text-white/70">This cannot be undone.</p>
            <div className="flex justify-around">
              <button className="bg-red-600 px-4 py-1 rounded hover:bg-red-500" onClick={handleDeleteJourney}>
                Yes, Delete
              </button>
              <button className="bg-gray-700 px-4 py-1 rounded hover:bg-gray-600" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
