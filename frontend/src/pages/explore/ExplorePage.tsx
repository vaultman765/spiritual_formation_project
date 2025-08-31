import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TagFilterDropdown from "@/components/TagFilterDropdown";
import { DetailArcCard } from "@/components/cards/ArcCard";
import { fetchAllArcs } from "@/api/arcs";
import type { ArcData } from "@/utils/types";
import SeoMeta from "@/components/seo/SeoMeta";

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

  const exploreStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Explore Arcs",
    description: "Browse meditation arcs for Ignatian Mental Prayer.",
    itemListElement: filteredArcs.map((arc, index) => ({
      "@type": "Book",
      position: index + 1,
      name: arc.arc_title,
      url: `https://www.catholicmentalprayer.com/explore/${arc.arc_id}`,
      description: arc.arc_summary || "Meditation arc focused on spiritual growth.",
      image: `https://www.catholicmentalprayer.com/images/arc_whole/${arc.arc_id}.jpg`,
      author: {
        "@type": "Organization",
        name: "Spiritual Formation Project",
      },
      numberOfPages: arc.day_count,
      keywords: arc.card_tags.join(", "),
    })),
  };

  const exploreBreadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.catholicmentalprayer.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Explore Arcs",
        item: "https://www.catholicmentalprayer.com/explore",
      },
    ],
  };

  return (
    <main>
      <SeoMeta
        title="Explore Meditation Arcs | Spiritual Formation Project"
        description="Browse over 1000 days of Ignatian meditations organized into arcs. Start your custom journey in Ignatian style mental prayer today."
        canonicalUrl={canonicalUrl}
        imageUrl="https://www.catholicmentalprayer.com/images/og-explore.jpg"
        type="website"
        jsonLd={exploreStructuredData}
        breadcrumbsJsonLd={exploreBreadcrumbData}
      />

      <header className="header">
        <h1 className="text-4xl md:text-5xl font-display font-semibold text-[var(--text-main)]">Explore Arcs and Journeys</h1>
        <p className="mt-4 text-lg text-[var(--text-muted)] max-w-4xl mx-auto">
          Explore all available arcs of mental prayer. Walk the full 1000+ day journey or begin with a custom path.
        </p>
      </header>

      {/* Action Buttons */}
      <section className="px-6 mb-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-center">
          <Link
            to="/create-custom-journey"
            className="!no-underline text-base font-semibold bg-[var(--brand-primary)] !text-[var(--bg-dark)] px-6 py-3 rounded shadow-md shadow-black/20 hover:bg-[var(--hover-gold)] hover:ring-2 hover:ring-yellow-300/70 focus:ring w-full sm:w-auto text-center"
          >
            Create a Custom Journey
          </Link>
          <Link
            to="/explore/prebuilt"
            className="!no-underline text-base font-semibold bg-[var(--brand-primary)] !text-[var(--bg-dark)] px-6 py-3 rounded shadow-md shadow-black/20 hover:bg-[var(--hover-gold)] hover:ring-2 hover:ring-yellow-300/70 focus:ring w-full sm:w-auto text-center"
          >
            Browse Prebuilt Journeys
          </Link>
        </div>
      </section>

      {/* Search + Filter */}
      <section className="px-6 mb-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-center">
          <input
            type="text"
            placeholder="Search arcs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-style w-full sm:w-1/2"
          />
          <TagFilterDropdown selected={selectedTag} onChange={setSelectedTag} options={tagOptions} />
        </div>
      </section>

      {/* Arc Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto overflow-visible">
        {filteredArcs.map((arc) => (
          <DetailArcCard key={arc.arc_id} arc={arc} />
        ))}
      </section>
    </main>
  );
}
