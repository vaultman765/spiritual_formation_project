import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MeditationCard from "@/components/MeditationCard";
import type { MeditationData } from "@/utils/types";
import { fetchTodayMeditation, fetchTomorrowMeditation } from "@/api/homepage";

export default function HomePage() {
  const [today, setToday] = useState<MeditationData | null>(null);
  const [tomorrow, setTomorrow] = useState<MeditationData | null>(null);

  useEffect(() => {
    fetchTodayMeditation().then(setToday).catch(console.error);
    fetchTomorrowMeditation().then(setTomorrow).catch(console.error);
  }, []);

  return (
    <main className="main-background">
      {/* Header */}
      <header className="header">
        <h1 className="text-5xl md:text-6xl font-display font-semibold text-[var(--text-main)]">
          Encounter God through Ignatian Mental Prayer
        </h1>
        <p className="mt-4 text-[var(--text-muted)] max-w-4xl mx-auto text-lg">
          Ignatian mental prayer is a way to engage with God through meditation on Sacred Scripture. Make time each day to step away, reflect, and grow in intimacy with the Lord.
        </p>
        <div className="mt-6">
          <button
            className="text-base font-semibold bg-[var(--brand-primary)] text-black px-6 py-2 rounded shadow-md shadow-black/20 hover:bg-[var(--hover-gold)] hover:ring-2 hover:ring-yellow-300/70 focus:ring"
            onClick={() => alert('Coming soon...')}
          >
            Start Here
          </button>
        </div>
      </header>

      {/* Meditation Cards */}
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
      

      {/* How to Pray CTA */}
      <section className="px-6 pb-2 pt-4 grid grid-cols-1 gap-6 max-w-6xl mx-auto">
        <Link to="/how-to-pray" className="homepage-section-link">
          <h2 className="text-xl pb-2 font-display font-semibold text-[var(--text-light)] tracking-wide">📖 How to Pray</h2>
          <p className="text-[var(--text-muted)] font-display">
            New to Mental Prayer? No problem! Click here to learn how to begin using the method of mental prayer taught by St. Ignatius.
          </p>
        </Link>
      </section>
    </main>
  );
}
