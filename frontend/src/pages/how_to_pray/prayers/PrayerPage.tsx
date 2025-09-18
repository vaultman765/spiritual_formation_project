import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import SeoMeta from "@/components/seo/SeoMeta";
import { getPrayerBySlug, type PrayerBlock } from "@/data/prayers";

/* ---------- helpers (unchanged) ---------- */
function normalize(block?: PrayerBlock): string[][] {
  if (!block) return [];
  if (typeof block === "string") {
    const paras = block.split(/\n{2,}/);
    return paras.map((p) => p.split(/\n/));
  }
  if (Array.isArray(block) && block.every((x) => typeof x === "string")) {
    const out: string[][] = [[]];
    for (const line of block as string[]) {
      if (line.trim() === "") out.push([]);
      else out[out.length - 1].push(line);
    }
    return out.filter((p) => p.length);
  }
  return block as string[][];
}

function flattenForRows(paras: string[][]): string[] {
  const rows: string[] = [];
  paras.forEach((p, idx) => {
    p.forEach((line) => rows.push(line));
    if (idx < paras.length - 1) rows.push("");
  });
  return rows;
}

function Paragraphs({ paras }: { paras: string[][] }) {
  return (
    <div className="space-y-3">
      {paras.map((lines, i) => (
        <p key={i} className="text-[var(--text-main)] leading-relaxed">
          {lines.map((ln, j) => (
            <span key={j}>
              {ln}
              {j < lines.length - 1 ? <br /> : null}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

function LitanyTable({
  litany,
  lang = "English",
  className = "",
}: {
  litany: {
    defaultResponse?: string;
    rows: Array<{
      call?: string;
      response?: string;
      solo?: string;
      rubric?: string;
      heading?: string;
      spacer?: true;
      size?: "sm" | "md" | "lg";
    }>;
  };
  lang?: string;
  className?: string;
}) {
  const br = (text: string) =>
    text.split(/\n+/).map((ln, i, arr) => (
      <span key={i}>
        {ln}
        {i < arr.length - 1 ? <br /> : null}
      </span>
    ));

  const spaceClass = (size?: "sm" | "md" | "lg") => (size === "lg" ? "h-8" : size === "sm" ? "h-3" : "h-5");

  // DESKTOP (two columns)
  return (
    <section className={`mt-4 ${className}`}>
      <div className="hidden md:block">
        <div className="relative overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-3 shadow-sm">
          <div aria-hidden className="pointer-events-none absolute inset-y-1 left-1/2 w-px bg-white/10" />
          <table className="w-full table-fixed text-[var(--text-main)]" aria-label={`${lang} litany`}>
            <colgroup>
              <col className="w-1/2" />
              <col className="w-1/2" />
            </colgroup>
            <thead>
              <tr className="text-[var(--text-subtle-heading)] text-xs uppercase tracking-widest">
                <th className="text-left py-2 pr-6">Leader</th>
                <th className="text-left py-2 pl-6">Response</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {litany.rows.map((row, i) => {
                // Spacer row (explicit or legacy empty pair)
                const isLegacyEmpty =
                  (row.call ?? "").trim() === "" &&
                  (row.response ?? "").trim() === "" &&
                  !row.solo &&
                  !row.rubric &&
                  !row.heading &&
                  !row.spacer;
                if (row.spacer || isLegacyEmpty) {
                  return (
                    <tr key={i}>
                      <td colSpan={2} className={spaceClass(row.size)} aria-hidden="true" />
                    </tr>
                  );
                }

                // Full-width kinds
                if (row.solo || row.rubric || row.heading) {
                  const text = row.solo ?? row.rubric ?? row.heading ?? "";
                  const cls = row.rubric
                    ? "italic text-[var(--text-muted)]"
                    : row.heading
                    ? "text-xs uppercase tracking-widest text-[var(--text-subtle-heading)]"
                    : "text-[var(--text-main)]";
                  return (
                    <tr key={i}>
                      <td colSpan={2} className={`py-2 leading-7 ${cls}`}>
                        {br(text)}
                      </td>
                    </tr>
                  );
                }

                // Normal pair
                const call = row.call ?? "";
                const resp = (row.response ?? litany.defaultResponse ?? "").trim();
                return (
                  <tr key={i}>
                    <td className="pr-6 py-1 leading-7">{br(call)}</td>
                    <td className="pl-6 py-1 leading-7">{br(resp)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE + PRINT (stacked cards) */}
      <div className="md:hidden print:block space-y-4">
        {litany.rows.map((row, i) => {
          // Spacer (explicit or legacy empty)
          const isLegacyEmpty =
            (row.call ?? "").trim() === "" && (row.response ?? "").trim() === "" && !row.solo && !row.rubric && !row.heading && !row.spacer;
          if (row.spacer || isLegacyEmpty) {
            return <div key={i} className={spaceClass(row.size)} aria-hidden="true" />;
          }

          // Full-width blocks
          if (row.solo || row.rubric || row.heading) {
            const text = row.solo ?? row.rubric ?? row.heading ?? "";
            const cls = row.rubric
              ? "italic text-[var(--text-muted)]"
              : row.heading
              ? "text-xs uppercase tracking-widest text-[var(--text-subtle-heading)]"
              : "text-[var(--text-main)]";
            return (
              <div key={i} className={`rounded-xl border border-white/10 bg-white/5 p-3 ${cls}`}>
                {br(text)}
              </div>
            );
          }

          // Pair card
          const call = row.call ?? "";
          const resp = (row.response ?? litany.defaultResponse ?? "").trim();
          return (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3 text-[var(--text-main)]">
              <div className="text-xs uppercase tracking-widest text-[var(--text-subtle-heading)]">Leader</div>
              <div className="leading-7">{br(call)}</div>
              <div className="mt-2 text-xs uppercase tracking-widest text-[var(--text-subtle-heading)]">Response</div>
              <div className="leading-7">{br(resp)}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- component ---------- */
export default function PrayerPage() {
  const { slug } = useParams();
  const prayer = useMemo(() => getPrayerBySlug(slug || ""), [slug]);

  if (!prayer) {
    return (
      <main className="mx-auto max-w-3xl px-2 py-10 text-center">
        <h1 className="text-3xl font-display text-[var(--text-light)]">Prayer not found</h1>
        <p className="mt-2 text-[var(--text-muted)]">
          Try the{" "}
          <Link to="/prayers" className="underline">
            Prayers index
          </Link>
          .
        </p>
      </main>
    );
  }

  const url = `https://www.catholicmentalprayer.com/prayers/${prayer.slug}`;
  const image = prayer.image ?? "https://www.catholicmentalprayer.com/images/how_to_pray/prayers/prayers_default_og.jpg";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: prayer.title,
    url,
    image,
    inLanguage: "en-US",
    genre: "Prayer",
    about: prayer.categories.join(", "),
  };
  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.catholicmentalprayer.com" },
      { "@type": "ListItem", position: 2, name: "Prayers", item: "https://www.catholicmentalprayer.com/prayers" },
      { "@type": "ListItem", position: 3, name: prayer.title, item: url },
    ],
  };

  const parasEn = normalize(prayer.body);
  const parasLa = normalize(prayer.bodyLatin);
  const hasLatin = parasLa.length > 0;

  const rowsEn = flattenForRows(parasEn);
  const rowsLa = flattenForRows(parasLa);
  const rowCount = Math.max(rowsEn.length, rowsLa.length);
  const pairedRows = Array.from({ length: rowCount }, (_, i) => [rowsEn[i] ?? "", rowsLa[i] ?? ""]);
  const isLitany = prayer.style === "litany" || !!prayer.litany;

  return (
    <main>
      {/* Print CSS: hide navbar & buttons; use stacked content for printing */}
      <style>{`
        @media print {
          nav, .no-print { display: none !important; }
          body { background: #fff !important; }
          main, article { color: #000 !important; }
          a { text-decoration: none !important; color: #000 !important; }
        }
      `}</style>

      <SeoMeta
        title={prayer.title}
        description={prayer.summary || `${prayer.title} (text).`}
        canonicalUrl={url}
        imageUrl={image}
        type="article"
        jsonLd={[jsonLd]}
        breadcrumbsJsonLd={breadcrumbsJsonLd}
      />

      <article className="mx-auto max-w-5xl px-4 py-6">
        <header className="mb-6 text-center">
          <h1 className="font-display text-4xl text-[var(--text-light)]">{prayer.title}</h1>
          {prayer.summary && <p className="mx-auto mt-3 max-w-2xl text-[var(--text-muted)]">{prayer.summary}</p>}
        </header>

        {/* BILINGUAL (EN + LATIN) */}
        {isLitany ? (
          <>
            <LitanyTable litany={prayer.litany!} />
            {prayer.litanyLatin && <LitanyTable className="mt-8" litany={prayer.litanyLatin} lang="Latin" />}
          </>
        ) : hasLatin ? (
          <>
            {/* DESKTOP: paired, never-wrap, with faint center divider */}
            <section className="hidden md:block">
              <div className="relative mx-auto max-w-5xl overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-3 shadow-sm">
                {/* center divider for visual balance */}
                <div aria-hidden className="pointer-events-none absolute inset-y-1 left-1/2 w-px bg-white/10" />

                <table className="table-fixed w-full text-[var(--text-main)]" aria-label={`${prayer.title} (English and Latin)`}>
                  <colgroup>
                    <col className="w-1/2" />
                    <col className="w-1/2" />
                  </colgroup>
                  <thead>
                    <tr className="text-[var(--text-subtle-heading)] text-xs uppercase tracking-widest">
                      <th className="text-left py-2 pr-6">English</th>
                      <th className="text-left py-2 pl-6">Latin</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    {pairedRows.map(([en, la], i) => {
                      const isBlank = en.trim() === "" && la.trim() === "";
                      return (
                        <tr key={i} className={isBlank ? "h-3" : ""}>
                          {/* nowrap keeps lines paired; overflow handled by the container */}
                          <td className="pr-6 align-top md:whitespace-nowrap leading-7 md:text-[clamp(14px,0.95vw,16px)]">{en}</td>
                          <td className="pl-6 align-top md:whitespace-nowrap leading-7 md:text-[clamp(14px,0.95vw,16px)]">{la}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* MOBILE + PRINT: stacked blocks (readable & printer-friendly) */}
            <section className="grid gap-8 md:hidden print:block">
              <div>
                <h2 className="mb-2 text-sm uppercase tracking-widest text-[var(--text-subtle-heading)]">English</h2>
                <Paragraphs paras={parasEn} />
              </div>
              <div>
                <h2 className="mb-2 text-sm uppercase tracking-widest text-[var(--text-subtle-heading)]">Latin</h2>
                <Paragraphs paras={parasLa} />
              </div>
            </section>
          </>
        ) : (
          // SINGLE LANGUAGE: centered column with comfortable measure
          <section className="mx-auto max-w-prose">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm">
              <Paragraphs paras={parasEn} />
            </div>
          </section>
        )}

        {/* Collapsible notes/history */}
        {prayer.about && (
          <section className="mt-8">
            <details className="rounded-xl border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer font-semibold text-[var(--text-light)]">About this prayer</summary>
              <div className="mt-3">
                <Paragraphs paras={normalize(prayer.about)} />
              </div>
            </details>
          </section>
        )}

        {/* Actions */}
        <div className="no-print mt-6 flex justify-center">
          <button
            onClick={() => window.print()}
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-[var(--text-muted)] hover:text-white"
          >
            Print
          </button>
        </div>

        {prayer.sourceUrl && (
          <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
            Source / reference:&nbsp;
            <a className="underline" href={prayer.sourceUrl} target="_blank" rel="noopener noreferrer">
              {prayer.sourceUrl}
            </a>
          </p>
        )}
      </article>
    </main>
  );
}
