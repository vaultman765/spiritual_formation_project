// src/pages/prayers/PrayersIndexPage.tsx
import { useMemo, useState } from "react";
import SeoMeta from "@/components/seo/SeoMeta";
import { Link } from "react-router-dom";
import { PRAYER_CATEGORIES, prayers } from "@/data/prayers";

const canonical = "https://www.catholicmentalprayer.com/prayers";

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: prayers.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `https://www.catholicmentalprayer.com/prayers/${p.slug}`,
    name: p.title,
  })),
};

const breadcrumbsJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.catholicmentalprayer.com" },
    { "@type": "ListItem", position: 2, name: "Prayers", item: canonical },
  ],
};

export default function PrayersIndexPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | "All">("All");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return prayers.filter((p) => {
      const okCat = cat === "All" ? true : p.categories.includes(cat);
      const okQ =
        !term ||
        p.title.toLowerCase().includes(term) ||
        p.summary?.toLowerCase().includes(term) ||
        p.categories.join(" ").toLowerCase().includes(term);
      return okCat && okQ;
    });
  }, [q, cat]);

  return (
    <main>
      <SeoMeta
        title="Catholic Prayers & Devotional Texts"
        description="Find the Apostles’ Creed, Hail Mary, Hail, Holy Queen, Anima Christi, the Angelus, litanies, and more - beautifully formatted and printable."
        canonicalUrl={canonical}
        type="article"
        imageUrl="https://www.catholicmentalprayer.com/images/how_to_pray/chaplets/rosary_og.jpg"
        jsonLd={[itemListJsonLd]}
        breadcrumbsJsonLd={breadcrumbsJsonLd}
      />

      <article className="mx-auto max-w-4xl px-2 py-6">
        <header className="mb-6 text-center">
          <h1 className="font-display text-4xl text-[var(--text-light)]">Prayers</h1>
          <p className="mx-auto mt-3 max-w-2xl text-[var(--text-muted)]">Search, filter by category, and open any prayer.</p>
        </header>

        {/* Search + filter */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search prayers..."
            className="w-full sm:w-2/3 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-[var(--text-main)] outline-none focus:border-[var(--brand-primary)]"
          />
          <div className="flex flex-wrap gap-2">
            <button
              className={`rounded-full px-3 py-1 text-sm border ${cat === "All" ? "bg-white/10" : "border-white/15 bg-white/0"}`}
              onClick={() => setCat("All")}
            >
              All
            </button>
            {PRAYER_CATEGORIES.map((c) => (
              <button
                key={c}
                className={`rounded-full px-3 py-1 text-sm border ${cat === c ? "bg-white/10" : "border-white/15 bg-white/0"}`}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Groups by category (respect filter) */}
        <div className="space-y-10">
          {(cat === "All" ? PRAYER_CATEGORIES : [cat]).map((category) => {
            const items = results.filter((p) => p.categories.includes(category));
            if (!items.length) return null;
            return (
              <section key={category}>
                <h2 className="mb-3 text-sm uppercase tracking-widest text-[var(--text-subtle-heading)]">{category}</h2>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {items.map((p) => (
                    <li key={p.slug}>
                      <Link
                        to={`/prayers/${p.slug}`}
                        className="!no-underline block rounded-xl border border-white/10 bg-[var(--bg-card)]/70 p-4 hover:border-white/20"
                      >
                        <h3 className="no-underline font-semibold text-[var(--text-light)]">{p.title}</h3>
                        {p.summary ? (
                          <p className="no-underline mt-1 line-clamp-2 text-sm text-[var(--text-muted)]">{p.summary}</p>
                        ) : p.style === "litany" ? (
                          <p className="no-underline mt-1 text-sm text-[var(--text-muted)]">Open litany</p>
                        ) : (
                          <p className="no-underline mt-1 text-sm text-[var(--text-muted)]">Open prayer</p>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </article>
    </main>
  );
}
