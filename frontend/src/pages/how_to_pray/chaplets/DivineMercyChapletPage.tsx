import SeoMeta from "@/components/seo/SeoMeta";
import AccordionSection from "@/components/ui/AccordionSection";

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Pray the Divine Mercy Chaplet",
  description: "A step-by-step guide to the Divine Mercy Chaplet (using Rosary beads): opening, decade prayers, and closing.",
  mainEntityOfPage: "https://www.catholicmentalprayer.com/prayers/divine-mercy-chaplet",
  inLanguage: "en-US",
  image: "https://www.catholicmentalprayer.com/images/how_to_pray/chaplets/divine_mercy_chaplet_og.jpg",
  supply: [{ "@type": "HowToSupply", name: "Rosary beads (optional)" }],
  tool: [{ "@type": "HowToTool", name: "Prayer card or website" }],
  datePublished: "2025-09-15",
  dateModified: "2025-09-15",
  totalTime: "PT10M", // Divine Mercy Chaplet ~10 minutes
  estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: 0 },
  step: [
    { "@type": "HowToStep", name: "Sign of the Cross" },
    { "@type": "HowToStep", name: "Opening prayers on large bead: “You expired, Jesus…” and 3x “O Blood and Water…”" },
    { "@type": "HowToStep", name: "On the large bead: Eternal Father prayer." },
    { "@type": "HowToStep", name: "On each of the 10 Hail Mary beads: For the sake of His sorrowful Passion..." },
    { "@type": "HowToStep", name: "Repeat the decade pattern five times" },
    { "@type": "HowToStep", name: "Conclude: Holy God, Holy Mighty One, Holy Immortal One... 3x" },
    { "@type": "HowToStep", name: "Closing prayer(s). Finish with the Sign of the Cross." },
  ],
};

const breadcrumbsJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.catholicmentalprayer.com" },
    { "@type": "ListItem", position: 2, name: "Prayers", item: "https://www.catholicmentalprayer.com/prayers" },
    {
      "@type": "ListItem",
      position: 3,
      name: "Divine Mercy Chaplet",
      item: "https://www.catholicmentalprayer.com/prayers/divine-mercy-chaplet",
    },
  ],
};

export default function DivineMercyChapletPage() {
  const canonical = "https://www.catholicmentalprayer.com/prayers/divine-mercy-chaplet";

  return (
    <main>
      <SeoMeta
        title="How to Pray the Divine Mercy Chaplet"
        description="Pray the Divine Mercy Chaplet step by step — bead-by-bead cues, the decade prayers, and a printable reference."
        canonicalUrl={canonical}
        imageUrl="https://www.catholicmentalprayer.com/images/how_to_pray/chaplets/divine_mercy_chaplet_og.jpg"
        type="article"
        jsonLd={[howToJsonLd]}
        breadcrumbsJsonLd={breadcrumbsJsonLd}
      />

      <article className="mx-auto max-w-3xl px-2 py-6">
        <header className="mb-8 text-center">
          <h1 className="font-display text-4xl text-[var(--text-light)]">Divine Mercy Chaplet</h1>
          <p className="mx-auto mt-3 max-w-2xl text-[var(--text-muted)]">
            Prayed on ordinary Rosary beads. Below: a quick order and all reference prayers.
          </p>
        </header>

        <section className="mb-6">
          <figure className="mx-auto w-full max-w-[720px] px-2 flex flex-col items-center">
            <img
              src="/images/how_to_pray/chaplets/divine_mercy_diagram.jpg"
              alt="Divine Mercy Chaplet structure (five decades)"
              className="block w-auto max-h-[500px] rounded-xl shadow-lg shadow-black/20"
              loading="lazy"
              width={600}
              height={600}
            />
            <figcaption className="mt-2 text-center text-xs text-[var(--text-muted)]">Chaplet prayed on Rosary beads.</figcaption>
          </figure>
        </section>

        <AccordionSection id="chaplet-order" title="Step-by-Step Order (Quick Start)" defaultOpen>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Make the <a href="/prayers/sign-of-the-cross">Sign of the Cross</a>.
            </li>
            <li>Opening prayers on the first large bead: “You expired, Jesus…” and 3× “O Blood and Water…” (see below for reference)</li>
            <li>
              On the next three small beads: <a href="/prayers/our-father">Our Father</a>, <a href="/prayers/hail-mary">Hail Mary</a>, and{" "}
              <a href="/prayers/apostles-creed">Apostles' Creed</a>.
              <br />
            </li>
            <li>
              On the large bead: <strong>Eternal Father</strong> prayer.
              <br />
            </li>
            <li>
              On each of the 10 small beads: <strong>For the sake of His sorrowful Passion…</strong>
              <br />
              <span className="text-sm text-[var(--text-muted)]">“…have mercy on us and on the whole world.” (10×)</span>
            </li>
            <li>Repeat the decade (steps 4–5) for five decades total.</li>
            <li>
              Conclude: <strong>Holy God, Holy Mighty One, Holy Immortal One</strong>
              <br />
              <span className="text-sm text-[var(--text-muted)]">“…have mercy on us and on the whole world.” (3×)</span>
            </li>
            <li>
              Closing prayer(s). Finish with the <a href="/prayers/sign-of-the-cross">Sign of the Cross</a>.
            </li>
          </ol>
        </AccordionSection>

        <AccordionSection id="chaplet-texts" title="Reference Prayers (Texts)">
          <div className="space-y-4">
            <details className="rounded-xl border border-white/10 p-3">
              <summary className="cursor-pointer font-semibold text-[var(--text-light)]">You expired, Jesus…</summary>
              <p className="mt-2 text-sm">
                You expired, Jesus, but the source of life gushed forth for souls, and the ocean of mercy opened up for the whole world. O
                Fount of Life, unfathomable Divine Mercy, envelop the whole world and empty Yourself out upon us.
              </p>
            </details>

            <details className="rounded-xl border border-white/10 p-3">
              <summary className="cursor-pointer font-semibold text-[var(--text-light)]">O Blood and Water… (3×)</summary>
              <p className="mt-2 text-sm">
                O Blood and Water, which gushed forth from the Heart of Jesus as a fount of mercy for us, I trust in You!
              </p>
            </details>

            <details className="rounded-xl border border-white/10 p-3">
              <summary className="cursor-pointer font-semibold text-[var(--text-light)]">Eternal Father</summary>
              <p className="mt-2 text-sm">
                Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, our Lord Jesus Christ, in
                atonement for our sins and those of the whole world.
              </p>
            </details>

            <details className="rounded-xl border border-white/10 p-3">
              <summary className="cursor-pointer font-semibold text-[var(--text-light)]">For the sake of His sorrowful Passion…</summary>
              <p className="mt-2 text-sm">For the sake of His sorrowful Passion, have mercy on us and on the whole world.</p>
            </details>

            <details className="rounded-xl border border-white/10 p-3">
              <summary className="cursor-pointer font-semibold text-[var(--text-light)]">Holy God (3×)</summary>
              <p className="mt-2 text-sm">Holy God, Holy Mighty One, Holy Immortal One, have mercy on us and on the whole world</p>
            </details>
          </div>
        </AccordionSection>
      </article>
    </main>
  );
}
