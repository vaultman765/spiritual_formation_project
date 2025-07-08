import React from 'react';

const secondaryReadings = [
  {
    title: 'Catechism of the Catholic Church',
    reference: '§§535–537',
    url: 'https://www.vatican.va/archive/ENG0015/__P1L.HTM',
  },
  {
    title: 'St. Cyril of Jerusalem, Catechetical Lectures',
    reference: 'Lecture 3',
    url: 'https://www.newadvent.org/fathers/310103.htm',
  },
];

export default function MeditationDayPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--bg-light)] via-[var(--bg-mid)] to-[var(--bg-dark)] text-white px-6 pb-2 pt-0">
      {/* Header */}
      <section className="text-center mb-6">
        <p className="text-sm uppercase tracking-widest text-[var(--text-subtle-heading)] mb-1">Meditation</p>
        <h1 className="text-4xl md:text-5xl font-display font-semibold text-[var(--text-main)] mb-2 leading-snug">
          The Baptism of Christ in the Jordan
        </h1>

        <p className="text-sm italic text-[var(--text-muted)]">
          Arc: Rosary – Luminous Mysteries: Day 1 of 7
        </p>
      </section>

      {/* Side-by-Side Image and Readings */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-12 mb-6">
        <div className="flex flex-col md:flex-row gap-x-12 gap-y-6 items-center">
          {/* Image */}
          <div className="flex-shrink-0">
            <img
              src="/images/arc_days/arc_rosary_luminous_mysteries_day_01.jpg"
              alt="Baptism of Christ"
              className="rounded-xl border-2 border-yellow-500 max-w-sm w-full object-contain shadow-lg shadow-black/20"
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col space-y-12 max-w-xl text-center md:text-left items-center md:items-start mt-6 md:mt-0">
            
            {/* Primary Reading */}
            <div>
              <h2 className="text-sm uppercase tracking-widest text-[var(--text-subtle-heading)] mb-1">Primary Reading</h2>
              <p className="text-lg font-semibold text-[var(--text-light)]">Matthew 3:13–17</p>
            </div>

            {/* Secondary Readings */}
            <div>
              <h2 className="text-sm uppercase tracking-widest text-[var(--text-subtle-heading)] mb-1">Secondary Readings</h2>
              <ul className="space-y-2">
                {secondaryReadings.map((reading, idx) => (
                  <li key={idx}>
                    <a
                      href={reading.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-main)] hover:underline"
                    >
                      {reading.title} – <span className="italic">{reading.reference}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prelude Image */}
            <div>
              <h2 className="text-sm uppercase tracking-widest text-[var(--text-subtle-heading)] mb-1">Prelude Image</h2>
              <p className="text-[var(--text-main)] bg-white/5 p-3 rounded-md shadow-inner max-w-md">
                Christ standing in the Jordan as the heavens open, the Spirit descending, and the Father's voice resounding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meditative Points */}
      <section className="mb-3 max-w-4xl text-center mx-auto">
        <h2 className="text-sm tracking-[.15em] font-semibold text-[var(--text-subtle-heading)] uppercase mb-3">Meditative Points</h2>
        <ol className="pl-5 space-y-2 text-[var(--text-main)] text-sm max-w-3xl mx-auto">
          <li>
            Jesus descends into the Jordan not for His own sake, but to sanctify the waters for us.
          </li>
          <li>
            The heavens open, revealing the Trinity - the voice of the Father, the presence of the Spirit, the beloved Son.
          </li>
          <li>
            Here begins His public mission - with humility, submission, and divine affirmation. 
          </li>
        </ol>
      </section>

      
      <hr className="border-t border-white/10 my-4 max-w-2xl mx-auto" />

      {/* Ejaculatory Prayer */}
      <section className="text-center mb-4">
        <h2 className="text-sm tracking-[.15em] font-semibold text-[var(--text-subtle-heading)] uppercase mb-3">Ejaculatory Prayer</h2>
        <p className="text-[var(--text-main)] max-w-4xl mx-auto">
          Jesus, help me to humbly receive all that You desire to pour out upon me.
        </p>
      </section>

      {/* Colloquy / Resolution */}
      <section className="text-center">
        <h2 className="text-sm tracking-[.15em] font-semibold text-[var(--text-subtle-heading)] uppercase mb-2">Colloquy</h2>
        <p className="text-[var(--text-main)] italic max-w-4xl mx-auto">
          Lord, grant me the grace to receive Your gifts without pride, to approach You in humility as You approached the Jordan, and to walk each day in the light of my baptism.
        </p>
      </section>
      <div className="mt-10 mb-4 h-px bg-white/5 max-w-sm mx-auto" />
    </main>
  );
}
