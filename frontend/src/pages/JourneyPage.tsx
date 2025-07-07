import React from 'react';
import { Link } from 'react-router-dom';

// Example Arc Card Component
function ArcCard({ arcId, title, dayCount, imageUrl, cardTags }) {
  return (
    <Link
      to={`/arcs/${arcId}`}
      className="block rounded-2xl border border-[var(--brand-primary-dark)] bg-[var(--bg-card)]/75 shadow-md shadow-black/20 hover:scale-[1.01] hover:shadow-lg hover:shadow-yellow-400/20 transition-all duration-200 overflow-hidden"
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover object-center"
      />
      <div className="p-4">
        <h2 className="text-xl font-display font-semibold text-[var(--text-light)] mb-1">{title}</h2>
        <p className="text-sm text-[var(--text-muted)] mb-2">{dayCount}-day arc</p>
        <div className="flex flex-wrap gap-2">
          {cardTags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs bg-white/10 text-white border border-white/10 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function JourneyPage() {
  // Temporary hardcoded data until API integration
  const arcList = [
    {
      arcId: 'arc_love_of_god',
      title: 'The Love of God',
      dayCount: 7,
      imageUrl: '/images/arc_love_of_god.jpg',
      cardTags: ['charity', 'trinity', 'union']
    },
    {
      arcId: 'arc_passion_of_christ',
      title: 'The Passion of Christ',
      dayCount: 14,
      imageUrl: '/images/arc_passion_of_christ.jpg',
      cardTags: ['suffering', 'redemption', 'sacrifice']
    },
    {
      arcId: 'arc_immaculate_heart_of_mary',
      title: 'The Immaculate Heart of Mary',
      dayCount: 7,
      imageUrl: '/images/arc_immaculate_heart.jpg',
      cardTags: ['mary', 'adoration', 'maternal-heart']
    }
  ];

  return (
    <main className="bg-gradient-to-b from-[var(--bg-light)] via-[var(--bg-mid)] to-[var(--bg-dark)] min-h-screen px-6 pb-20">
      <header className="text-center pt-12 pb-8">
        <h1 className="text-4xl md:text-5xl font-display font-semibold text-[var(--text-main)]">Your Journey</h1>
        <p className="mt-4 text-lg text-[var(--text-muted)] max-w-3xl mx-auto">
          Explore all available arcs of mental prayer. Walk the full 1000+ day journey or begin with a custom path.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/journeys/custom/create"
            className="bg-[var(--brand-primary)] text-black px-6 py-2 rounded shadow hover:bg-[var(--hover-gold)]"
          >
            Create a Custom Journey
          </Link>
          <Link
            to="/journeys/prebuilt"
            className="border border-[var(--brand-primary)] text-[var(--brand-primary)] px-6 py-2 rounded hover:bg-[var(--brand-primary)] hover:text-black transition-colors"
          >
            Browse Prebuilt Journeys
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {arcList.map((arc) => (
          <ArcCard key={arc.arcId} {...arc} />
        ))}
      </section>
    </main>
  );
}
