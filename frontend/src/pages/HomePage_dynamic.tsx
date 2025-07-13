import { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext';
import MeditationCard from "@/components/MeditationCard";
import type { MeditationData } from "@/utils/types";
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { user } = useAuth();
  const [today, setToday] = useState<MeditationData | null>(null);
  const [tomorrow, setTomorrow] = useState<MeditationData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetch('/api/user/journey/', { credentials: 'include' })
        .then((res) => res.json())
        .then((journey) => {
          const currentArc = journey.arc_progress.find((a: any) => a.status === 'in_progress');
          if (!currentArc) return;

          const { arcId, currentDay, dayCount } = currentArc;

          fetch(`/api/days/?arc_id=${arcId}&arc_day_number=${currentDay}`)
            .then((res) => res.json())
            .then(setToday)
            .catch(console.error);

          if (currentDay < dayCount) {
            fetch(`/api/days/?arc_id=${arcId}&arc_day_number=${currentDay + 1}`)
              .then((res) => res.json())
              .then(setTomorrow)
              .catch(console.error);
          }
        })
        .catch(console.error);
    } else {
      fetch('/api/days/homepage/today')
        .then((res) => res.json())
        .then(setToday)
        .catch(console.error);

      fetch('/api/days/homepage/tomorrow')
        .then((res) => res.json())
        .then(setTomorrow)
        .catch(console.error);
    }
  }, [user]);

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

      <section className="px-6 py-2 grid grid-cols-2 gap-12 max-w-6xl mx-auto">
        {today && (
          <MeditationCard
            title={today.day_title}
            subtitle="Today's Meditation"
            imageSrc={`/images/arc_days/${String(today.arc_id)}_day_${String(today.arc_day_number).padStart(2, '0')}.jpg`}
            altText={today.day_title}
            link={`/days/${today.arc_id}/${today.arc_day_number}`}
            tag={`Arc: ${today.arc_title} – Day ${today.arc_day_number}`}
          />
        )}
        {tomorrow && (
          <MeditationCard
            title={tomorrow.day_title}
            subtitle="Tomorrow's Meditation"
            imageSrc={`/images/arc_days/${String(tomorrow.arc_id)}_day_${String(tomorrow.arc_day_number).padStart(2, '0')}.jpg`}
            altText={tomorrow.day_title}
            link={`/days/${tomorrow.arc_id}/${tomorrow.arc_day_number}`}
            tag={`Arc: ${tomorrow.arc_title} – Day ${tomorrow.arc_day_number}`}
          />
        )}
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