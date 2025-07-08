import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const availableTags = [
  'suffering',
  'mary',
  'purification',
  'union',
  'adoration',
  'sacred-heart',
  'charity',
  'trinity', 
  'redemption',
  'sacrifice',
  'community',
  'service',
  // Add more as your tag bank grows
];

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
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // Temporary hardcoded data until API integration
  const arcList = [
    {
      arcId: 'arc_love_of_god',
      title: 'The Love of God',
      dayCount: 7,
      imageUrl: '/images/arc_whole/arc_love_of_god.jpg',
      cardTags: ['charity', 'trinity', 'union']
    },
    {
      arcId: 'arc_passion_of_christ',
      title: 'The Passion of Christ',
      dayCount: 14,
      imageUrl: '/images/arc_whole/arc_passion_of_christ.jpg',
      cardTags: ['suffering', 'redemption', 'sacrifice']
    },
    {
      arcId: 'arc_love_of_neighbor',
      title: 'The Love of Neighbor',
      dayCount: 7,
      imageUrl: '/images/arc_whole/arc_love_of_neighbor.jpg',
      cardTags: ['charity', 'community', 'service']
    },
    {
      arcId: 'arc_holy_fear_of_the_lord',
      title: 'The Holy Fear of the Lord',
      dayCount: 7,
      imageUrl: '/images/arc_whole/arc_holy_fear_of_the_lord.jpg',
      cardTags: ['suffering', 'purification', 'union']
    },
  ];

  const filteredArcs = arcList.filter((arc) => {
    const matchesSearch = arc.title.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? arc.cardTags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <main className="main-background">
      <header className="header">
        <h1 className="text-4xl md:text-5xl font-display font-semibold text-[var(--text-main)]">Your Journey</h1>
        <p className="mt-4 text-lg text-[var(--text-muted)] max-w-4xl mx-auto">
          Explore all available arcs of mental prayer. Walk the full 1000+ day journey or begin with a custom path.
        </p>
      </header>

      {/* Action Buttons */}
      <section className="section-standard">
        <Link
          to="/journeys/custom/create"
          className="!no-underline text-base font-semibold bg-[var(--brand-primary)] !text-black px-6 py-2 rounded shadow-md shadow-black/20 hover:bg-[var(--hover-gold)] hover:ring-2 hover:ring-yellow-300/70 focus:ring"
        >
          Create a Custom Journey
        </Link>
        <Link
          to="/journeys/prebuilt"
          className="!no-underline text-base font-semibold bg-[var(--brand-primary)] !text-black px-6 py-2 rounded shadow-md shadow-black/20 hover:bg-[var(--hover-gold)] hover:ring-2 hover:ring-yellow-300/70 focus:ring"
        >
          Browse Prebuilt Journeys
        </Link>
      </section>
      

      {/* Filter Bar */}
      <section className="section-standard">
        <input
          type="text"
          placeholder="Search arcs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 w-full md:w-1/2"
        />

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-4 py-2 rounded bg-white/10 border border-white/20 text-white w-full md:w-1/3"
        >
          <option value="">All Tags</option>
          {availableTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag.replace(/-/g, ' ')}
            </option>
          ))}
        </select>
      </section>

      {/* Arc Grid */}
      <section className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {filteredArcs.map((arc, index) => (
          <Link
            to={`/arcs/${arc.arcId}`}
            className="homepage-section-link"
          >
            <h2 className="text-lg font-semibold text-[var(--text-light)]">
              {arc.title}
            </h2>
            <div className="!mb-0 meditation-image-container">
              <img
                src={`/images/arc_whole/${arc.arcId}.jpg`}
                alt={arc.title}
                className="h-70 meditation-image"
              />
            </div>
            <div className="text-sm text-[var(--text-subtle-heading)]">{arc.dayCount}-day arc</div>
            <div className="flex flex-wrap gap-2 mt-1 justify-center">
              {arc.cardTags.map((tag) => (
                <span
                  key={tag}
                  className="tag-pill-arc"
                >
                  {tag.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
