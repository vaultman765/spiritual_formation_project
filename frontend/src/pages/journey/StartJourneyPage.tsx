export default function StartJourneyPage() {
  return (
    <main className="text-center px-4 py-20">
      <h1 className="text-4xl md:text-5xl font-display font-semibold text-[var(--text-main)] mb-6">
        Begin Your Prayer Journey
      </h1>
      <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto mb-10">
        You haven’t started a journey yet. Choose one of the options below to
        begin walking with Christ through structured daily meditations.
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-6">
        <button
          onClick={() => (window.location.href = "/create-custom-journey")}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 rounded-md shadow transition"
        >
          Create a Custom Journey
        </button>

        <button
          onClick={() => (window.location.href = "/prebuilt-journeys")}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 rounded-md shadow transition"
        >
          Browse Prebuilt Journeys
        </button>
      </div>
    </main>
  );
}
