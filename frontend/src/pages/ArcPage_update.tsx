import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchArcById } from "@/api/arcs";
import { fetchDaysByArcId } from "@/api/days";
import type { ArcData, DaySummary } from "@/utils/types";

export default function ArcPage() {
  const { arcId } = useParams<{ arcId: string }>();
  const [arc, setArc] = useState<ArcData | null>(null);
  const [days, setDays] = useState<DaySummary[]>([]);

  useEffect(() => {
    if (!arcId) return;

    fetchArcById(arcId)
      .then(setArc)
      .catch((err) => console.error("Failed to fetch arc:", err));

    fetchDaysByArcId(arcId)
      .then(setDays)
      .catch((err) => console.error("Failed to fetch arc days:", err));
  }, [arcId]);

  const isSingleReading = arc?.primary_reading.length === 1;

  console.log("Arc Data:", arc);
  console.log("Days Data:",  arc?.primary_reading.length);

    const dailyCards =
      arc && days.length
        ? Array.from({ length: arc.day_count }, (_, i) => ({
            day: i + 1,
            day_title: days[i].day_title,
            reading: isSingleReading ? null : days[i].primary_reading_title ?? null,
          }))
        : [];


  if (!arc) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--bg-light)] via-[var(--bg-mid)] to-[var(--bg-dark)] text-white px-6">

      {/* Title */}
      <section className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-display font-semibold text-[var(--text-main)]">
          {arc.arc_title}
        </h1>
        <p className="text-sm italic text-[var(--text-muted)] mt-1">
          {arc.day_count}-day Meditation
        </p>
      </section>

      {/* Arc Overview Section */}
      <section className="flex flex-col lg:flex-row justify-center items-start lg:items-center gap-10 max-w-6xl mx-auto mb-12">
        {/* Image */}
        <img
          src={`/images/arc_whole/${arc.arc_id}.jpg`}
          alt={arc.arc_title}
          className="rounded-xl border-[3px] border-yellow-500 shadow-lg shadow-black/30 max-h-[420px] w-auto max-w-lg object-contain"
        />

        {/* Text Block */}
        <div className="flex flex-col text-center lg:text-left max-w-sm gap-12">
          <div>
            <h2 className="text-sm uppercase tracking-widest text-yellow-300 mb-1">
              Primary Reading
            </h2>
            <p className="text-lg font-semibold text-[var(--text-light)]">
              {isSingleReading ? arc.primary_reading[0] : 'Various (see below)'}
            </p>
          </div>

          <div></div>
          <div></div>

          <div>
            <h2 className="text-sm uppercase tracking-widest text-[var(--text-subtle-heading)] mb-1">
              Arc Summary
            </h2>
            <p className="text-sm text-[var(--text-main)] leading-relaxed">
              {arc.arc_summary}
            </p>
          </div>
        </div>
      </section>

      {/* Arc Day Cards */}
      <section className="text-center mb-10">
        <h2 className="text-sm uppercase tracking-widest text-[var(--text-subtle-heading)] mb-3 border-b-2 border-yellow-500 inline-block pb-1">
          Daily Meditations
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto px-4">
          {dailyCards.map(({ day, day_title, reading }) => (
            <Link to={`/days/${arcId}/${day}`} key={day} className="!no-underline block">
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
        <Link to={`/days/${arcId}/1`}>
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 rounded-md shadow transition">
            Begin Day 1
          </button>
        </Link>
      </section>
    </main>
  );
}