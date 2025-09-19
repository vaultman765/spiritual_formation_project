import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import TagFilterDropdown from "@/components/TagFilterDropdown";
import { DetailArcCard } from "@/components/cards/ArcCard";
import { fetchAllArcs } from "@/api/arcs";
import type { ArcData } from "@/utils/types";
import SeoMeta from "@/components/seo/SeoMeta";

const PAGE_SIZE_OPTIONS = [20, 50, 100];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // URL state
  const qParam = searchParams.get("q") ?? "";
  const tagParam = searchParams.get("tag") ?? "";
  const pageParam = Number(searchParams.get("page") || "1");
  const sizeParam = Number(searchParams.get("size") || "20");

  // UI state
  const [arcs, setArcs] = useState<ArcData[]>([]);
  const [search, setSearch] = useState(qParam);
  const [selectedTag, setSelectedTag] = useState<string>(tagParam);
  const [page, setPage] = useState<number>(pageParam > 0 ? pageParam : 1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS.includes(sizeParam) ? sizeParam : 20);

  const canonicalUrl = `https://www.catholicmentalprayer.com${location.pathname}`;

  useEffect(() => {
    fetchAllArcs().then(setArcs).catch(console.error);
  }, []);

  // available tags
  const availableTags = useMemo(() => {
    return Array.from(new Set(arcs.flatMap((arc) => arc.card_tags))).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  }, [arcs]);
  const tagOptions = ["All Tags", ...availableTags];

  // filter
  const filteredArcs = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    return arcs.filter((arc) => {
      const matchesSearch =
        !searchText ||
        arc.arc_title.toLowerCase().includes(searchText) ||
        arc.card_tags.some((tag) => tag.toLowerCase().includes(searchText));

      const matchesTag = selectedTag ? arc.card_tags.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [arcs, search, selectedTag]);

  // reset to page 1 on filter change
  useEffect(() => {
    setPage(1);
  }, [search, selectedTag, pageSize]);

  // pagination math (client-side)
  const total = filteredArcs.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const pageItems = filteredArcs.slice(startIdx, endIdx);

  // sync URL
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (search) next.set("q", search);
    else next.delete("q");
    if (selectedTag) next.set("tag", selectedTag);
    else next.delete("tag");
    next.set("page", String(safePage));
    next.set("size", String(pageSize));
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedTag, safePage, pageSize]);

  // structured data
  const exploreStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Explore Arcs",
    description: "Browse meditation arcs for Ignatian Mental Prayer.",
    itemListElement: pageItems.map((arc, index) => ({
      "@type": "Book",
      position: startIdx + index + 1,
      name: arc.arc_title,
      url: `https://www.catholicmentalprayer.com/explore/${arc.arc_id}`,
      description: arc.arc_summary || "Meditation arc focused on spiritual growth.",
      image: `https://www.catholicmentalprayer.com/images/arc_whole/${arc.arc_id}.jpg`,
      author: { "@type": "Organization", name: "Spiritual Formation Project" },
      numberOfPages: arc.day_count,
      keywords: arc.card_tags.join(", "),
    })),
  };

  const exploreBreadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.catholicmentalprayer.com" },
      { "@type": "ListItem", position: 2, name: "Explore Arcs", item: "https://www.catholicmentalprayer.com/explore" },
    ],
  };

  // handlers
  const goFirst = () => setPage(1);
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const goLast = () => setPage(totalPages);

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
      <section className="px-6 mb-6 max-w-4xl mx-auto text-center">
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Search arcs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-style w-full sm:w-96"
          />
          <TagFilterDropdown selected={selectedTag} onChange={(v) => setSelectedTag(v === "All Tags" ? "" : v)} options={tagOptions} />
        </div>
      </section>

      {/* Count + Page size */}
      <section className="px-6 max-w-6xl mx-auto mb-3 flex flex-row justify-between items-center">
        <p className="text-sm text-[var(--text-muted)]">
          {total === 0 ? "No arcs found." : `Showing ${startIdx + 1}–${endIdx} of ${total} arcs`}
        </p>

        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-subtle-heading)]">Show</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-[var(--text-main)] [&>option]:text-black"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n} className="text-black bg-white">
                {n}
              </option>
            ))}
          </select>
          <span className="text-sm text-[var(--text-subtle-heading)]">per page</span>
        </div>
      </section>

      {/* Arc Grid (paged) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto overflow-visible">
        {pageItems.map((arc) => (
          <DetailArcCard key={arc.arc_id} arc={arc} />
        ))}
      </section>

      {/* Pagination controls */}
      {total > 0 && (
        <nav className="max-w-6xl mx-auto px-6 mt-8 mb-12 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={goFirst}
              disabled={safePage === 1}
              className="px-3 py-1 rounded-lg border border-white/10 bg-white/5 text-[var(--text-light)] disabled:opacity-40"
              aria-label="First page"
            >
              « First
            </button>
            <button
              onClick={goPrev}
              disabled={safePage === 1}
              className="px-3 py-1 rounded-lg border border-white/10 bg-white/5 text-[var(--text-light)] disabled:opacity-40"
              aria-label="Previous page"
            >
              ‹ Prev
            </button>
            <div className="text-sm text-[var(--text-muted)]">
              Page {safePage} of {totalPages}
            </div>
            <button
              onClick={goNext}
              disabled={safePage === totalPages}
              className="px-3 py-1 rounded-lg border border-white/10 bg-white/5 text-[var(--text-light)] disabled:opacity-40"
              aria-label="Next page"
            >
              Next ›
            </button>
            <button
              onClick={goLast}
              disabled={safePage === totalPages}
              className="px-3 py-1 rounded-lg border border-white/10 bg-white/5 text-[var(--text-light)] disabled:opacity-40"
              aria-label="Last page"
            >
              Last »
            </button>
          </div>
        </nav>
      )}
    </main>
  );
}
