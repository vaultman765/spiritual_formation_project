import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchDayByArc } from "@/api/days";
import type { MeditationData } from "@/utils/types";
import SecondaryReadings from "@/components/SecondaryReadings";
import ScrollToTop from "@/components/ScrollToTop";


export default function MeditationDayPage() {
  const [day, setDay] = useState<MeditationData | null>(null);
  const [showResolution, setShowResolution] = useState(false);
  const { arcID, arcDayNumber } = useParams<{ arcID: string; arcDayNumber: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (arcID && arcDayNumber) {
      fetchDayByArc(arcID, parseInt(arcDayNumber))
        .then(setDay)
        .catch(console.error);
    }
  }, [arcID, arcDayNumber]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [arcDayNumber]);

  if (!day) return <p className="text-center text-white mt-10">Loading...</p>;


  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--bg-light)] via-[var(--bg-mid)] to-[var(--bg-dark)] text-white px-6 pb-2 pt-0">
      <ScrollToTop />

      {/* Header */}
      <section className="text-center mb-6 relative">
              <h1 className="text-4xl md:text-5xl font-display font-semibold text-[var(--text-main)] mb-2 leading-snug">
                {day.day_title}
              </h1>
              <p className="text-sm italic text-[var(--text-muted)]">
                Arc: {day.arc_title} (Day {day.arc_day_number} of {day.arc_total_days}) •{" "}
                <Link
                  to={`/arc/${day.arc_id}`}
                  className="underline hover:text-[var(--brand-primary)]"
                >
                  View Arc
                </Link>
              </p>
      
              {day.resolution && (
                <button
                  onClick={() => setShowResolution(!showResolution)}
                  className="absolute top-0 right-0 mt-2 mr-2 text-xs text-[var(--text-muted)] hover:text-white border border-white/20 px-3 py-1 rounded-full transition-all duration-200"
                >
                  {showResolution ? "Hide Resolution" : "Show Suggested Resolution"}
                </button>
              )}
            </section>

      {/* Side-by-Side Image and Readings */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-12 mb-6">
        <div className="flex flex-col md:flex-row gap-x-12 gap-y-6 items-center">
          {/* Image */}
          <div className="flex-shrink-0">
            <img
              src={`/images/arc_days/${day.arc_id}_day_${String(
                day.arc_day_number
              ).padStart(2, "0")}.jpg`}
              alt={day.day_title}
              className="rounded-xl border-2 border-yellow-500 max-w-sm w-full object-contain shadow-lg shadow-black/20"
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col space-y-12 max-w-xl text-center md:text-left items-center md:items-start mt-6 md:mt-0">
            {/* Primary Reading */}
            <div>
              <h2 className="text-sm uppercase tracking-widest text-[var(--text-subtle-heading)] mb-1">
                Primary Reading
              </h2>
              <p className="text-lg font-semibold text-[var(--text-light)]">
                {day.primary_reading.title}
              </p>
            </div>

            {/* Secondary Readings */}
            <div>
              <h2 className="text-sm uppercase tracking-widest text-[var(--text-subtle-heading)] mb-1">
                Secondary Readings
              </h2>
              <SecondaryReadings readings={day.secondary_readings} />
            </div>

            {/* Prelude Image */}
            <div>
              <h2 className="text-sm uppercase tracking-widest text-[var(--text-subtle-heading)] mb-1">
                Prelude Image
              </h2>
              <p className="text-[var(--text-main)] bg-white/5 p-3 rounded-md shadow-inner max-w-md">
                {day.anchor_image}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meditative Points */}
      <section className="mb-3 max-w-4xl text-center mx-auto">
        <h2 className="text-sm tracking-[.15em] font-semibold text-[var(--text-subtle-heading)] uppercase mb-3">
          Meditative Points
        </h2>
        <ol className="pl-5 space-y-2 text-[var(--text-main)] text-sm max-w-3xl mx-auto">
          {day.meditative_points.map((pt, i) => (
            <li key={i} className="mb-2">
              {pt}
            </li>
          ))}
        </ol>
      </section>

      <hr className="border-t border-white/10 my-4 max-w-2xl mx-auto" />

      {/* Ejaculatory Prayer */}
      <section className="text-center mb-4">
        <h2 className="text-sm tracking-[.15em] font-semibold text-[var(--text-subtle-heading)] uppercase mb-3">
          Ejaculatory Prayer
        </h2>
        <p className="text-[var(--text-main)] max-w-4xl mx-auto">
          {day.ejaculatory_prayer}
        </p>
      </section>

      {/* Colloquy */}
      <section className="text-center">
        <h2 className="text-sm tracking-[.15em] font-semibold text-[var(--text-subtle-heading)] uppercase mb-2">
          Colloquy
        </h2>
        <p className="text-[var(--text-main)] italic max-w-4xl mx-auto">
          {day.colloquy}
        </p>
      </section>

      {/* Optional Resolution */}
      {showResolution && day.resolution && (
        <section className="text-center mt-8">
          <h2 className="text-sm tracking-[.15em] font-semibold text-[var(--text-subtle-heading)] uppercase mb-2">
            Resolution
          </h2>
          <p className="text-[var(--text-main)] italic max-w-3xl mx-auto">
            {day.resolution}
          </p>
        </section>
      )}

      <hr className="border-t border-white/10 my-4 max-w-2xl mx-auto" />

      {/* Navigation */}
      <div className="mt-10 flex justify-between max-w-xl mx-auto px-4">
        {day.arc_day_number > 1 ? (
          <button
            className="text-sm text-[var(--text-light)] hover:text-white underline"
            onClick={() => navigate(`/days/${day.arc_id}/${day.arc_day_number - 1}`)}
          >
            ← Previous Day
          </button>
        ) : <div />}

        {day.arc_day_number < day.arc_total_days ? (
          <button
            className="text-sm text-[var(--text-light)] hover:text-white underline"
            onClick={() => navigate(`/days/${day.arc_id}/${day.arc_day_number + 1}`)}
          >
            Next Day →
          </button>
        ) : <div />}
      </div>
    </main>
  );
}