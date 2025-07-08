import React from 'react';
import { Link } from 'react-router-dom';

const arcData = {
  arcId: 'arc_rosary_joyful_mysteries',
  dayCount: 7,
  arcTitle: 'The Rosary – Joyful Mysteries',
  arcSummary:
    'Enter into the childhood and hidden life of Christ through the Joyful Mysteries of the Rosary. These meditations reveal the humility of God, the obedience of Mary, and the silent growth of the Redeemer.',
  arcImage: '/images/arc_whole/arc_rosary_joyful_mysteries.jpg',
  primaryReadings: [
    { title: 'Luke 1:26–38' },
    { title: 'Luke 1:39–56' },
    { title: 'Luke 2:1–7' },
    { title: 'Luke 2:21–35' },
    { title: 'Luke 2:41–52' },
    { title: 'John 2:1–11' },
    { title: 'Luke 2:39–40' },
  ],
  dayInfo: [
    { day: 1, day_title: 'The Annunciation' },
    { day: 2, day_title: 'The Visitation' },
    { day: 3, day_title: 'The Nativity' },
    { day: 4, day_title: 'The Presentation' },
    { day: 5, day_title: 'The Finding in the Temple' },
    { day: 6, day_title: 'The Wedding at Cana' },
    { day: 7, day_title: 'The Hidden Years' },
  ]
};

const arcData2 = {
  arcId: 'arc_love_of_god',
  dayCount: 7,
  arcTitle: 'The Love of God',
  arcSummary:
    'Explore the depths of God’s love through Scripture and meditation on His eternal charity toward mankind.',
  arcImage: '/images/arc_whole/arc_love_of_god.jpg',
  primaryReadings: [
    { title: '1 John 4:7–21' },
  ],
  dayInfo: [
    { day: 1, day_title: 'God Is Love' },
    { day: 2, day_title: 'The Cross Reveals Love' },
    { day: 3, day_title: 'Love Poured into Our Hearts' },
    { day: 4, day_title: 'Perfect Love Casts Out Fear' },
    { day: 5, day_title: 'He Loved Them to the End' },
    { day: 6, day_title: 'Love One Another as I Have Loved You' },
    { day: 7, day_title: 'Remain in My Love' },
  ]
};

export default function ArcDetailPage() {
  const {
    arcId,
    arcTitle,
    dayCount,
    arcSummary,
    arcImage,
    primaryReadings,
    dayInfo
  } = arcData2;

  const isSingleReading = primaryReadings.length === 1;

  const dailyCards = Array.from({ length: dayCount }, (_, i) => ({
    day: i + 1,
    day_title: dayInfo[i]?.day_title,
    reading: isSingleReading ? null : primaryReadings[i]?.title ?? null,
  }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--bg-light)] via-[var(--bg-mid)] to-[var(--bg-dark)] text-white px-6">

      {/* Title */}
      <section className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-display font-semibold text-[var(--text-main)]">
          {arcTitle}
        </h1>
        <p className="text-sm italic text-[var(--text-muted)] mt-1">
          {dayCount}-day Meditation
        </p>
      </section>

      {/* Arc Top Section */}
      <section className="flex flex-col lg:flex-row justify-center items-start lg:items-center gap-10 max-w-6xl mx-auto mb-12">
        {/* Image */}
        <img
          src={arcImage}
          alt={arcTitle}
          className="rounded-xl border-[3px] border-yellow-500 shadow-lg shadow-black/30 max-h-[420px] w-auto max-w-lg object-contain"
        />

        {/* Text Block */}
        <div className="flex flex-col text-center lg:text-left max-w-sm gap-12">
          <div>
            <h2 className="text-sm uppercase tracking-widest text-yellow-300 mb-1">
              Primary Reading
            </h2>
            <p className="text-lg font-semibold text-[var(--text-light)]">
              {isSingleReading ? primaryReadings[0].title : 'Various (see below)'}
            </p>
          </div>
          <div></div>
          <div>
            <h2 className="text-sm uppercase tracking-widest text-[var(--text-subtle-heading)] mb-1">
              Arc Summary
            </h2>
            <p className="text-sm text-[var(--text-main)] leading-relaxed">
              {arcSummary}
            </p>
          </div>
        </div>
      </section>

      {/* Daily Meditation Cards */}
      <section className="text-center mb-10">
        <h2 className="text-sm uppercase tracking-widest text-[var(--text-subtle-heading)] mb-3 border-b-2 border-yellow-500 inline-block pb-1">
          Daily Meditations
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto px-4">
          {dailyCards.map(({ day, day_title, reading }) => (
            <Link to={`/arcs/${arcId}/days/${day}`} key={day} className="!no-underline block">
              <li
                className="bg-white/5 px-4 py-3 rounded-md shadow shadow-black/10 hover:bg-white/10 transition
                  flex flex-col justify-evenly items-center
                  hover:scale-105 transform duration-200 ease-in-out"
              >
                <div className="text-yellow-400 font-bold text-center text-xs mb-1">
                  Day {day}
                </div>
                <div className="font-semibold text-[var(--text-light)] text-center text-sm">
                  {day_title ?? 'Untitled'}
                </div>
                {reading && (
                  <div className="text-[var(--text-muted)] italic text-xs text-center mt-1">
                    {reading}
                  </div>
                )}
              </li>
            </Link>
          ))}
        </ul>
      </section>

        {/* Begin Button */}
        <section className="text-center">
          <Link to={`/days/${dayInfo[0]?.day ?? 1}`}>
            <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 rounded-md shadow transition">
              Begin Day {dayInfo[0]?.day ?? 1}
            </button>
          </Link>
        </section>
      </main>
  );
}