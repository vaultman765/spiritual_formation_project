import React from 'react';
import { Link } from 'react-router-dom';
import MeditationCard from "@/components/MeditationCard";

export default function HomePage() {
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

      {/* Bottom Section – Cards */} 
      <section className="px-6 py-2 grid grid-cols-2 gap-12 max-w-6xl mx-auto">

        {/* Today’s Meditation */}
        <MeditationCard
          title="The Baptism of Christ in the Jordan"
          subtitle="Today's Meditation"
          imageSrc="/images/arc_days/arc_rosary_luminous_mysteries_day_01.jpg"
          altText="Baptism of Christ painting"
          link="/days/001"
          tag="Arc: Rosary – Luminous Mysteries Day 1 of 7"
        />

        {/* Tomorrow's Meditation */}
        <MeditationCard
          title="The Wedding at Cana"
          subtitle="Tomorrow's Meditation"
          imageSrc="/images/arc_days/arc_rosary_luminous_mysteries_day_02.jpg"
          altText="Wedding at Cana painting"
          link="/days/002"
          tag="Arc: Rosary – Luminous Mysteries Day 2 of 7"
        />
      </section>
      

      <section className="px-6 pb-2 pt-4 grid grid-cols-1 gap-6 max-w-6xl mx-auto">
        {/* How to Pray */}
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
