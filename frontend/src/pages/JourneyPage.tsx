import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/authContext';
import { useJourney } from '@/context/journeyContext';

export default function JourneyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { journey, createJourney } = useJourney();

  useEffect(() => {
    if (!user) navigate('/auth/login');
  }, [user, navigate]);

  if (journey === null) {
    return (
      <main className="main-background text-center text-white mt-20">
        <h2 className="text-2xl mb-4">Create Your First Prayer Journey</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const input = form.elements.namedItem('title') as HTMLInputElement;
            await createJourney(input.value || 'My Journey with Ignatian Mental Prayer');
          }}
          className="flex flex-col items-center gap-4"
        >
          <input
            type="text"
            name="title"
            placeholder="Journey Title"
            className="px-4 py-2 rounded text-black"
          />
          <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded font-bold">
            Start Journey
          </button>
        </form>
      </main>
    );
  }

  const currentArc = journey.arcProgress?.find(a => a.status === 'in_progress');

  return (
    <main className="main-background">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-display font-semibold text-white">
          {journey.title}
        </h1>
        <p className="text-lg text-[var(--text-muted)] mt-2">Your Current Mental Prayer Journey</p>
      </header>

      {currentArc && (
        <section className="mb-10 text-center">
          <h2 className="text-2xl text-[var(--text-subtle-heading)] font-semibold mb-2">Currently In</h2>
          <p className="text-xl text-white font-medium">{currentArc.arcTitle}</p>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Day {currentArc.currentDay} of {currentArc.dayCount}
          </p>
          <Link to={`/days/${currentArc.arcId}/${currentArc.currentDay}`}>
            <button className="bg-[var(--brand-primary)] px-6 py-2 rounded shadow font-semibold text-black hover:bg-[var(--hover-gold)]">
              Continue Today’s Prayer
            </button>
          </Link>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold text-[var(--text-subtle-heading)] text-center mb-4">Journey Progress</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {journey.arcProgress?.map((arc) => (
            <Link to={`/arcs/${arc.arcId}`} key={arc.arcId} className="!no-underline">
              <div
                className={`rounded p-4 shadow border ${
                  arc.status === 'completed'
                    ? 'bg-green-800/20 border-green-400'
                    : arc.status === 'in_progress'
                    ? 'bg-yellow-800/20 border-yellow-400'
                    : 'bg-blue-800/20 border-blue-400'
                }`}
              >
                <div className="text-white font-semibold mb-1">{arc.arcTitle}</div>
                <div className="text-sm text-[var(--text-muted)]">
                  {arc.status === 'completed' && `✅ Completed (${arc.dayCount} days)`}
                  {arc.status === 'in_progress' && `🔄 Day ${arc.currentDay} of ${arc.dayCount}`}
                  {arc.status === 'upcoming' && `🔜 Upcoming (${arc.dayCount} days)`}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
