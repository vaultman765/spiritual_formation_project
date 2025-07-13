import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/authContext';
import { useJourney } from '@/context/journeyContext';

export default function JourneyPage() {
  const { journey, journeyLoading } = useJourney();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || journeyLoading) return;

    // Ensure we only redirect if `journey` is explicitly null (not undefined or still loading)
    if (!user) {
      navigate('/auth/login');
      return;
    }

    if (journey === null) {
      navigate('/start-journey');
    }
  }, [authLoading, journeyLoading, user, journey, navigate]);

  if (authLoading || journeyLoading) {
    return (
      <main className="main-background text-white text-center py-20">
        <p className="text-lg">Loading your journey...</p>
      </main>
    );
  }

  const currentArc = journey?.arc_progress?.find(a => a.status === 'in_progress');

  return (
    <main className="main-background">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-display font-semibold text-white">
          {journey?.title}
        </h1>
        <p className="text-lg text-[var(--text-muted)] mt-2">Your Current Mental Prayer Journey</p>
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
              Continue Today’s Prayer
            </button>
          </Link>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold text-[var(--text-subtle-heading)] text-center mb-4">Journey Progress</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {journey?.arc_progress
            ?.sort((a, b) => a.order - b.order)
            .map((arc) => (
            <Link to={`/arcs/${arc.arc_id}`} key={arc.order} className="!no-underline">
              <div
                className={`rounded p-4 shadow border ${
                  arc.status === 'completed'
                    ? 'bg-green-800/20 border-green-400'
                    : arc.status === 'in_progress'
                    ? 'bg-yellow-800/20 border-yellow-400'
                    : 'bg-blue-800/20 border-blue-400'
                }`}
              >
                <div className="text-white font-semibold mb-1">{arc.arc_title}</div>
                <div className="text-sm text-[var(--text-muted)]">
                  {arc.status === 'completed' && `✅ Completed (${arc.day_count} days)`}
                  {arc.status === 'in_progress' && `🔄 Day ${arc.current_day} of ${arc.day_count}`}
                  {arc.status === 'upcoming' && `🔜 Upcoming (${arc.day_count} days)`}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
