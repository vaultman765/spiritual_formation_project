import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TagFilterDropdown from "@/components/TagFilterDropdown";
import { DetailArcCard } from "@/components/cards/ArcCard";
import { fetchAllArcs } from "@/api/arcs";
import type { ArcData } from "@/utils/types";
import { Helmet } from "react-helmet-async";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [arcs, setArcs] = useState<ArcData[]>([]);
  const location = useLocation();
  const canonicalUrl = `https://www.catholicmentalprayer.com${location.pathname}`;

  const availableTags = Array.from(new Set(arcs.flatMap((arc) => arc.card_tags))).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  const tagOptions = ["All Tags", ...availableTags];

  const filteredArcs = arcs.filter((arc) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      arc.arc_title.toLowerCase().includes(searchText) || arc.card_tags.some((tag) => tag.toLowerCase().includes(searchText));

    const matchesTag = selectedTag ? arc.card_tags.includes(selectedTag) : true;

    return matchesSearch && matchesTag;
  });

  useEffect(() => {
    fetchAllArcs().then(setArcs).catch(console.error);
  }, []);

  return (
    <main>
      <Helmet>
        <title>Explore Meditation Arcs | Catholic Mental Prayer</title>
        <meta
          name="description"
          content="Browse over 1000 days of Ignatian meditations organized into arcs. Start your custom journey in Ignatian style mental prayer today."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Explore Meditation Arcs | Spiritual Formation Project" />
        <meta
          property="og:description"
          content="Explore our full library of Ignatian meditation arcs and build your own spiritual formation path."
        />
        <meta property="og:image" content="https://www.catholicmentalprayer.com/images/og-explore.jpg" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Explore Meditation Arcs | Spiritual Formation Project" />
        <meta name="twitter:description" content="Choose from prebuilt or custom journeys rooted in Ignatian spirituality." />
        <meta name="twitter:image" content="https://www.catholicmentalprayer.com/images/og-explore.jpg" />
      </Helmet>

      <header className="header">
        <h1 className="text-4xl md:text-5xl font-display font-semibold text-[var(--text-main)]">Explore Arcs and Journeys</h1>
        <p className="mt-4 text-lg text-[var(--text-muted)] max-w-4xl mx-auto">
          Explore all available arcs of mental prayer. Walk the full 1000+ day journey or begin with a custom path.
        </p>
      </header>

      {/* Action Buttons */}
      <section className="section-standard">
        <Link
          to="/create-custom-journey"
          className="!no-underline text-base font-semibold bg-[var(--brand-primary)] !text-black px-6 py-2 rounded shadow-md shadow-black/20 hover:bg-[var(--hover-gold)] hover:ring-2 hover:ring-yellow-300/70 focus:ring"
        >
          Create a Custom Journey
        </Link>
        <Link
          to="/explore/prebuilt"
          className="!no-underline text-base font-semibold bg-[var(--brand-primary)] !text-black px-6 py-2 rounded shadow-md shadow-black/20 hover:bg-[var(--hover-gold)] hover:ring-2 hover:ring-yellow-300/70 focus:ring"
        >
          Browse Prebuilt Journeys
        </Link>
      </section>

      {/* Search Bar */}
      <section className="section-standard">
        <input
          type="text"
          placeholder="Search arcs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 w-full md:w-1/2"
        />

        {/* Tag Filter Dropdown */}
        <TagFilterDropdown selected={selectedTag} onChange={setSelectedTag} options={tagOptions} />
      </section>

      {/* Arc Grid */}
      <section className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {filteredArcs.map((arc) => (
          <DetailArcCard key={arc.arc_id} arc={arc} />
        ))}
      </section>
    </main>
  );
}
