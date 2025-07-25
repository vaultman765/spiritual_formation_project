import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  fetchTodayMeditation,
  fetchTomorrowMeditation,
  fetchJourneyMeditation 
} from '@/api/homepage'
import { useAuth } from '@/context/authContext';
import MeditationCard from "@/components/MeditationCard";
import type { MeditationData } from "@/utils/types";


export default function HomePage() {
  const { user } = useAuth();
  const [today, setToday] = useState<MeditationData | null>(null);
  const [tomorrow, setTomorrow] = useState<MeditationData | null>(null);
  const [noJourney, setNoJourney] = useState(false);
  const [journeyComplete, setJourneyComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetch('/api/user/journey/', { credentials: 'include' })
        .then((res) => {
          if (!res.ok) {
            if (res.status === 404) {
              setNoJourney(true);
              return null;
            }
            throw new Error("Failed to fetch journey");
          }
          return res.json();
        })
        .then((journey) => {
          console.log("Fetched journey:", journey);
          if (!journey) return;

          const arcs = journey.arc_progress;
          console.log("Fetched arcs:", arcs);

          if (!arcs || arcs.length === 0) {
            setNoJourney(true);
            return;
          }

          const currentArc = arcs.find((a: any) => a.status === 'in_progress');
          if (!currentArc || !currentArc.arc_id || !currentArc.current_day) {
            console.warn("Current arc or required fields missing:", currentArc);
            return null; // or show a fallback UI
          }

          const currentIndex = arcs.findIndex((a: any) => a.status === 'in_progress');
          const nextArc = arcs[currentIndex + 1];

          if (!currentArc) {
            setNoJourney(true);
            return;
          }

          const { arc_id, current_day, day_count } = currentArc;

          fetchJourneyMeditation(arc_id, current_day)
            .then(setToday)
            .catch(console.error);

          if (current_day < day_count) {
            fetchJourneyMeditation(arc_id, current_day + 1)
              .then(setTomorrow)
              .catch(console.error);
          } else if (nextArc) {
            fetchJourneyMeditation(nextArc.arc_id, 1)
              .then(setTomorrow)
              .catch(console.error);
          } else {
            setTomorrow(null);
            setJourneyComplete(true);
          }
        })
        .catch((err) => {
          console.error(err);
          setNoJourney(true);
        });
    } else {
      fetchTodayMeditation()
        .then(setToday)
        .catch(console.error);

      fetchTomorrowMeditation()
        .then(setTomorrow)
        .catch(console.error);
    }
  }, [user]);

  // 🩹 Bugfix: if user has no journey and today/tomorrow still null, load public meditations
  useEffect(() => {
    if (user && noJourney && !today && !tomorrow) {
      fetch('/api/days/homepage/today')
        .then((res) => res.json())
        .then(setToday)
        .catch(console.error);

      fetch('/api/days/homepage/tomorrow')
        .then((res) => res.json())
        .then(setTomorrow)
        .catch(console.error);
    }
  }, [user, noJourney, today, tomorrow]);

  return (
    <main className="main-background">
      <header className="header">
        <h1 className="text-5xl md:text-6xl font-display font-semibold text-[var(--text-main)]">
          Encounter God through Ignatian Mental Prayer
        </h1>
        <p className="mt-4 text-[var(--text-muted)] max-w-4xl mx-auto text-lg">
          Make time each day to step away, reflect, and grow in intimacy with the Lord.
        </p>
        {!user && (
          <div className="mt-6">
            <button
              className="text-base font-semibold bg-[var(--brand-primary)] text-black px-6 py-2 rounded shadow-md shadow-black/20 hover:bg-[var(--hover-gold)] hover:ring-2 hover:ring-yellow-300/70 focus:ring"
              onClick={() => navigate('/auth/register')}
            >
              Start Here
            </button>
          </div>
        )}
      </header>

      <section className="px-6 py-2 max-w-6xl mx-auto">
        {noJourney && user && (
          <div className="bg-white/10 border border-white/30 rounded p-6 mb-8 text-center text-white shadow-md">
            <p className="text-lg font-medium mb-2">📘 You haven’t started a journey yet.</p>
            <p className="text-sm text-white/80 mb-4">
              These are sample meditations from our meditation library. To receive daily recommendations, begin your own journey.
            </p>
            <button
              onClick={() => navigate('/explore')}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-2 rounded"
            >
              Explore the Journey Library
            </button>
          </div>
        )}
        <div className="grid grid-cols-2 gap-12">
          {today && (
            <MeditationCard
              title={today.day_title}
              subtitle="Current Meditation"
              imageSrc={`/images/arc_days/${String(today.arc_id)}_day_${String(today.arc_day_number).padStart(2, '0')}.jpg`}
              altText={today.day_title}
              link={`/days/${today.arc_id}/${today.arc_day_number}`}
              tag={`Arc: ${today.arc_title} – Day ${today.arc_day_number}`}
            />
          )}
          {tomorrow && (
            <MeditationCard
              title={tomorrow.day_title}
              subtitle="Next Meditation"
              imageSrc={`/images/arc_days/${String(tomorrow.arc_id)}_day_${String(tomorrow.arc_day_number).padStart(2, '0')}.jpg`}
              altText={tomorrow.day_title}
              link={`/days/${tomorrow.arc_id}/${tomorrow.arc_day_number}`}
              tag={`Arc: ${tomorrow.arc_title} – Day ${tomorrow.arc_day_number}`}
            />
          )}
          {user && journeyComplete && !tomorrow && (
            <div className="text-center col-span-2 text-white">
              <p className="text-xl mb-2">🎉 You’ve completed your current journey!</p>
              <button
                onClick={() => navigate('/create-custom-journey')}
                className="mt-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-2 rounded shadow transition"
              >
                Start a New Journey
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="px-6 pb-2 pt-4 grid grid-cols-1 gap-6 max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/how-to-pray')}
          className="homepage-section-link"
        >
          <h2 className="text-xl pb-2 font-display font-semibold text-[var(--text-light)] tracking-wide">
            📖 How to Pray
          </h2>
          <p className="text-[var(--text-muted)] font-display">
            New to Mental Prayer? Learn how to begin using the method taught by St. Ignatius.
          </p>
        </button>
      </section>
    </main>
  );
}