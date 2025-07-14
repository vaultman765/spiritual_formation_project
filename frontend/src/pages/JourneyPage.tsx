import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/authContext';
import { useJourney } from '@/context/journeyContext';

export default function JourneyPage() {
  const { user, loading: authLoading } = useAuth();
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [recentlyCompletedArc, setRecentlyCompletedArc] = useState<string | null>(null);
  const [recentlyCompletedJourney, setRecentlyCompletedJourney] = useState<string | null>(null);
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
  } = useJourney();

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

  useEffect(() => {
    const journey = localStorage.getItem("justCompletedJourney");
    const arc = localStorage.getItem("justCompletedArc");
    if (journey) {
      setRecentlyCompletedJourney(journey);
      localStorage.removeItem("justCompletedJourney");
    }
    else if (arc) {
      setRecentlyCompletedArc(arc);
      localStorage.removeItem("justCompletedArc");
    }
  }, []);

  useEffect(() => {
    if (authLoading || journeyLoading) return;

    // Ensure we only redirect if `journey` is explicitly null (not undefined or still loading)
    if (!user) {
      navigate('/auth/login');
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

  const currentArc = activeJourney?.arc_progress?.find(a => a.status === 'in_progress');
  const canCompleteJourney = activeJourney?.arc_progress.every(arc =>
    arc.status === 'completed' || arc.status === 'skipped' ||
    (arc.status === 'in_progress' && arc.current_day === arc.day_count)
  );

  return (
    <main className="main-background">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-display font-semibold text-white">
          {activeJourney?.title}
        </h1>
        <p className="text-lg text-[var(--text-muted)]">Your Current Mental Prayer Journey</p>
      </header>

      {currentArc && (
        <section className="mb-10 text-center">
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
        <div className="bg-blue-700 text-white px-6 py-3 rounded-lg shadow text-center mb-4">
          🌟 Congratulations! You just completed the arc: <strong>{recentlyCompletedArc}</strong>! 🌟
          <button
            onClick={() => setRecentlyCompletedArc(null)}
            className=" top-1 right-2 text-white hover:text-red-300 text-md"
          >
            ×
          </button>
        </div>
      ) : null}
      {activeJourney && activeJourney.is_active ? (
      <section>
        <h2 className="text-xl font-semibold text-[var(--text-subtle-heading)] text-center mb-4">
          Journey Progress
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          {activeJourney?.arc_progress
            ?.sort((a, b) => a.order - b.order)
            .map((arc) => {
              let cardStyle = '';
              let statusLabel = '';

              switch (arc.status) {
                case 'completed':
                  cardStyle = 'bg-green-800/20 border-green-400';
                  statusLabel = `✅ Completed (${arc.day_count} days)`;
                  break;
                case 'in_progress':
                  cardStyle = 'bg-yellow-800/20 border-yellow-400';
                  statusLabel = `🔄 Day ${arc.current_day} of ${arc.day_count}`;
                  break;
                case 'upcoming':
                  cardStyle = 'bg-blue-800/20 border-blue-400';
                  statusLabel = `🔜 Upcoming (${arc.day_count} days)`;
                  break;
                case 'skipped':
                  cardStyle = 'bg-red-800/20 border-red-400 text-red-100 italic';
                  statusLabel = `⏭️ Skipped`;
                  break;
              }

              return (
                <Link to={`/arcs/${arc.arc_id}`} key={arc.order} className="!no-underline">
                  <div className={`rounded p-4 shadow border ${cardStyle}`}>
                    <div className="text-white font-semibold mb-1">{arc.arc_title}</div>
                    <div className="text-sm text-[var(--text-muted)]">{statusLabel}</div>
                  </div>
                </Link>
              );
            })}
        </div>

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

        {/* Restart Journey button and confirmation dialog */}
        <div className="flex flex-row justify-center mt-6 gap-4">
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
          {activeJourney && (
              <div className="flex justify-center mb-4">
                <button
                  className="bg-yellow-600 text-white px-4 py-1 rounded hover:bg-yellow-500"
                  onClick={() => setShowRestartConfirm(true)}
                >
                  🔁 Restart This Journey
                </button>
              

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
                      <button
                        className="bg-gray-700 px-4 py-1 rounded hover:bg-gray-600"
                        onClick={() => setShowRestartConfirm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              </div>
          )}
          {activeJourney?.is_custom && activeJourney?.is_active && (
             <div className="flex justify-center mb-4">
            <button
              onClick={() => navigate('/edit-journey')}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold shadow hover:shadow-lg transition"
            >
              ✏️ Edit This Journey
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
              <h2 className="text-3xl font-display font-semibold mb-4 text-white">
                Past Journeys
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {archivedJourneys.map((j) => (
                  <div key={j.id} className="p-4 rounded-lg bg-gray-800 shadow-md">
                    <h3 className="text-xl font-semibold text-white mb-2">{j.title}</h3>
                    <p className="text-white/70 text-sm mb-2">
                      {j.arc_progress.length} arcs
                    </p>
                    {j.completed_on ? (
                      <p className="text-green-400 text-sm mb-2">Completed on {new Date(j.completed_on).toLocaleDateString()}</p>
                    ) : (
                      <p className="text-yellow-400 text-sm mb-2">Incomplete</p>
                    )}
                    <button
                      onClick={() => restoreJourney(j.id)}
                      className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-bold"
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
      </section>
    </main>
  );
}
