import SeoMeta from "@/components/seo/SeoMeta";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchTodayMeditation } from "@/api/homepage";
import type { MeditationData } from "@/utils/types";

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Ignatian Mental Prayer — In-Depth Guide",
  description: "A printable, detailed guide that expands the beginner steps with extra tips, detail, and examples.",
  image: "https://www.catholicmentalprayer.com/images/how_to_pray/how_to_pray.jpg",
  author: { "@type": "Organization", name: "Spiritual Formation Project" },
  publisher: {
    "@type": "Organization",
    name: "Spiritual Formation Project",
    logo: {
      "@type": "ImageObject",
      url: "https://www.catholicmentalprayer.com/images/logo_748.png",
      width: 748,
      height: 598,
    },
  },
  mainEntityOfPage: "https://www.catholicmentalprayer.com/how-to-pray/guide",
  inLanguage: "en-US",
  timeRequired: "PT30M",
  wordCount: 6941,
  datePublished: "2025-08-29",
  dateModified: "2025-08-30",
  hasPart: {
    "@type": "MediaObject",
    encodingFormat: "application/pdf",
    contentUrl: "https://www.catholicmentalprayer.com/docs/resources/Ignatian_Mental_Prayer_Step_by_Step.pdf",
    name: "Ignatian Mental Prayer — In-Depth Guide (PDF)",
  },
  isPartOf: {
    "@type": "WebPage",
    "@id": "https://www.catholicmentalprayer.com/how-to-pray",
  },
};

const breadcrumbsJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.catholicmentalprayer.com" },
    { "@type": "ListItem", position: 2, name: "How to Pray", item: "https://www.catholicmentalprayer.com/how-to-pray" },
    { "@type": "ListItem", position: 3, name: "In-Depth Guide", item: "https://www.catholicmentalprayer.com/how-to-pray/guide" },
  ],
};

export default function InDepthHowToPrayPage() {
  const pdfUrl = "/docs/resources/Ignatian_Mental_Prayer_Step_by_Step.pdf";
  const [today, setToday] = useState<MeditationData | null>(null);
  const location = useLocation();
  const canonicalUrl = `https://www.catholicmentalprayer.com${location.pathname}`;

  useEffect(() => {
    fetchTodayMeditation().then(setToday).catch(console.error);
  }, []);

  return (
    <main>
      <SeoMeta
        title="Ignatian Mental Prayer — In-Depth Guide (PDF)"
        description="Printable, detailed article expanding the beginner method with tips, examples, and step-by-step help."
        canonicalUrl={canonicalUrl}
        imageUrl="https://www.catholicmentalprayer.com/images/how_to_pray/how_to_pray.jpg"
        keywords="Spiritual Formation, Mental Prayer, Ignatian Prayer, Catholic Prayer, Prayer Guide, How to Pray, Christian Meditation, Prayer Techniques, Spiritual Growth, In Depth Guide"
        type="article"
        jsonLd={articleJsonLd}
        breadcrumbsJsonLd={breadcrumbsJsonLd}
      />

      <article className="mx-auto max-w-4xl px-2 py-6">
        <header className="mb-6 text-center">
          <h1 className="font-display text-4xl text-[var(--text-light)]">Ignatian Mental Prayer — In-Depth Guide</h1>
          <p className="mt-3 text-[var(--text-muted)]">
            This printable guide expands the beginner steps with extra detail, tips, and examples.
          </p>
          {today && (
            <p className="mx-auto mt-3 max-w-2xl text-[var(--text-muted)]">
              After reading the article, check out today&apos;s featured meditation{" "}
              <a href={`/days/${today.arc_id}/${today.arc_day_number}`} target="_blank" rel="noopener noreferrer">
                here
              </a>
              !
            </p>
          )}
        </header>

        {/* PDF Viewer with mobile fallback */}
        <section className="px-6 py-6 max-w-5xl mx-auto">
          {/* Desktop viewer */}
          <div className="hidden sm:block h-[90vh]">
            <iframe src={pdfUrl} title="How to Pray PDF" className="w-full h-full border rounded bg-white overflow-auto" />
          </div>

          {/* Mobile viewer alternative */}
          <div className="sm:hidden text-center">
            <p className="mb-4 text-[var(--text-muted)]">For best experience on mobile, use the direct link:</p>
            <a
              href={pdfUrl}
              className="inline-block rounded-2xl border border-white/15 bg-[var(--brand-primary-dark)]/90 px-4 py-2 !text-black no-underline shadow mb-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open PDF in Browser
            </a>
            <p className="mt-4 text-sm text-[var(--text-muted)]">Or download to view offline:</p>
            <a
              href={pdfUrl}
              className="inline-block rounded-2xl border border-white/15 bg-gray-700 px-4 py-2 text-white no-underline shadow"
              download
            >
              Download PDF
            </a>
          </div>
        </section>
      </article>
    </main>
  );
}
