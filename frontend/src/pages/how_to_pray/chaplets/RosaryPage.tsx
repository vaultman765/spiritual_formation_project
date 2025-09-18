import SeoMeta from "@/components/seo/SeoMeta";
import AccordionSection from "@/components/ui/AccordionSection";

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Pray the Holy Rosary",
  description:
    "A step-by-step, beginner-friendly guide to praying the Holy Rosary, with the order of prayers, mysteries by day, and reference texts.",
  mainEntityOfPage: "https://www.catholicmentalprayer.com/prayers/rosary",
  inLanguage: "en-US",
  image: "https://www.catholicmentalprayer.com/images/how_to_pray/chaplets/rosary-og.jpg",
  supply: [
    { "@type": "HowToSupply", name: "Rosary beads (optional)" },
    { "@type": "HowToSupply", name: "Mystery list (this page)" },
  ],
  tool: [{ "@type": "HowToTool", name: "Prayer book or website" }],
  datePublished: "2025-09-15",
  dateModified: "2025-09-15",
  totalTime: "PT20M", // Rosary ~20 minutes
  estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: 0 },
  step: [
    { "@type": "HowToStep", name: "Sign of the Cross & Apostles’ Creed" },
    { "@type": "HowToStep", name: "Our Father" },
    { "@type": "HowToStep", name: "Three Hail Marys (Faith, Hope, Charity)" },
    { "@type": "HowToStep", name: "Glory Be" },
    { "@type": "HowToStep", name: "Announce the 1st Mystery; then Our Father" },
    { "@type": "HowToStep", name: "Ten Hail Marys" },
    { "@type": "HowToStep", name: "Glory Be (and Fatima Prayer)" },
    { "@type": "HowToStep", name: "Repeat for 2nd–5th mysteries" },
    { "@type": "HowToStep", name: "Hail, Holy Queen and closing prayer; Sign of the Cross" },
  ],
};

const breadcrumbsJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.catholicmentalprayer.com" },
    { "@type": "ListItem", position: 2, name: "Prayers", item: "https://www.catholicmentalprayer.com/prayers" },
    { "@type": "ListItem", position: 3, name: "The Holy Rosary", item: "https://www.catholicmentalprayer.com/prayers/rosary" },
  ],
};

export default function RosaryPage() {
  const canonical = "https://www.catholicmentalprayer.com/prayers/rosary";

  return (
    <main>
      <SeoMeta
        title="How to Pray the Holy Rosary"
        description="Beginner-friendly Rosary guide: order of prayers, mysteries by day, and reference texts. Pray with confidence."
        canonicalUrl={canonical}
        imageUrl="https://www.catholicmentalprayer.com/images/how_to_pray/chaplets/rosary-og.jpg"
        type="article"
        jsonLd={[howToJsonLd]}
        breadcrumbsJsonLd={breadcrumbsJsonLd}
      />

      <article className="mx-auto max-w-3xl px-2 py-6">
        <header className="mb-8 text-center">
          <h1 className="font-display text-4xl text-[var(--text-light)]">The Holy Rosary</h1>
          <p className="mx-auto mt-3 max-w-2xl text-[var(--text-muted)]">
            A simple, step-by-step guide to praying the Rosary — with mysteries by day and reference prayers below.
          </p>
        </header>

        <section className="mb-6">
          <figure className="mx-auto w-full max-w-[720px] px-2 flex flex-col items-center">
            <img
              src="/images/how_to_pray/chaplets/rosary_diagram.jpg"
              alt="Rosary structure (five decades)"
              className="block w-auto max-h-[500px] rounded-xl shadow-lg shadow-black/20"
              loading="lazy"
              width={495}
              height={633}
            />
            <figcaption className="mt-2 text-center text-xs text-[var(--text-muted)]">
              Simple visual layout of the Rosary decades.
            </figcaption>
          </figure>
        </section>

        {/* ORDER */}
        <AccordionSection id="order" title="Step-by-Step Order (Quick Start)" defaultOpen>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Make the <a href="/prayers/sign-of-the-cross">Sign of the Cross</a> and pray the{" "}
              <a href="/prayers/apostles-creed">Apostles’ Creed</a>.
            </li>
            <li>
              On the first large bead: <a href="/prayers/our-father">Our Father</a>.
            </li>
            <li>
              On the next three small beads: three <a href="/prayers/hail-mary">Hail Marys</a> (for Faith, Hope, Charity).
            </li>
            <li>
              On the chain: <a href="/prayers/glory-be">Glory Be</a>.
            </li>
            <li>Announce the 1st Mystery; on the next large bead, pray the Our Father.</li>
            <li>On the ten small beads: ten Hail Marys (meditating on the Mystery).</li>
            <li>
              On the chain: Glory Be (and the <a href="/prayers/fatima-prayer">Fatima Prayer</a>, optional but customary).
            </li>
            <li>Repeat steps 5–7 for the 2nd–5th Mysteries.</li>
            <li>
              After the five decades: pray the <a href="/prayers/hail-holy-queen">Hail, Holy Queen</a> and the Rosary closing prayer. Finish
              with the Sign of the Cross.
            </li>
          </ol>
          <p className="text-sm text-[var(--text-muted)] mt-2">
            Tip: Announce each Mystery before its decade and keep the scene in mind as you pray.
          </p>
        </AccordionSection>

        {/* MYSTERIES BY DAY */}
        <AccordionSection id="mysteries" title="Mysteries & Days (with Scripture)">
          <div className="space-y-3">
            <details className="rounded-xl border border-white/10 p-3">
              <summary className="cursor-pointer font-semibold text-[var(--text-light)]">Joyful — Monday & Saturday</summary>
              <ol className="mt-2 list-decimal pl-5 text-sm text-[var(--text-main)] space-y-1">
                <li>
                  The Annunciation <small className="block text-[var(--text-muted)]">Luke 1:26–38</small>
                </li>
                <li>
                  The Visitation <small className="block text-[var(--text-muted)]">Luke 1:39–56</small>
                </li>
                <li>
                  The Nativity <small className="block text-[var(--text-muted)]">Luke 2:1–20; Matthew 1:18–25</small>
                </li>
                <li>
                  The Presentation <small className="block text-[var(--text-muted)]">Luke 2:22–38</small>
                </li>
                <li>
                  Finding the Child Jesus in the Temple <small className="block text-[var(--text-muted)]">Luke 2:41–52</small>
                </li>
              </ol>
            </details>

            <details className="rounded-xl border border-white/10 p-3">
              <summary className="cursor-pointer font-semibold text-[var(--text-light)]">Sorrowful — Tuesday & Friday</summary>
              <ol className="mt-2 list-decimal pl-5 text-sm text-[var(--text-main)] space-y-1">
                <li>
                  The Agony in the Garden{" "}
                  <small className="block text-[var(--text-muted)]">Matthew 26:36–46; Mark 14:32–42; Luke 22:39–46</small>
                </li>
                <li>
                  The Scourging at the Pillar <small className="block text-[var(--text-muted)]">John 19:1; Matthew 27:26; Mark 15:15</small>
                </li>
                <li>
                  The Crowning with Thorns{" "}
                  <small className="block text-[var(--text-muted)]">Matthew 27:27–31; John 19:2–3; Mark 15:16–20</small>
                </li>
                <li>
                  The Carrying of the Cross{" "}
                  <small className="block text-[var(--text-muted)]">John 19:16–17; Luke 23:26–32; Matthew 27:32; Mark 15:21</small>
                </li>
                <li>
                  The Crucifixion{" "}
                  <small className="block text-[var(--text-muted)]">John 19:18–37; Luke 23:33–49; Matthew 27:33–54; Mark 15:22–39</small>
                </li>
              </ol>
            </details>

            <details className="rounded-xl border border-white/10 p-3">
              <summary className="cursor-pointer font-semibold text-[var(--text-light)]">Glorious — Wednesday & Sunday</summary>
              <ol className="mt-2 list-decimal pl-5 text-sm text-[var(--text-main)] space-y-1">
                <li>
                  The Resurrection <small className="block text-[var(--text-muted)]">Matthew 28; Mark 16; Luke 24; John 20</small>
                </li>
                <li>
                  The Ascension <small className="block text-[var(--text-muted)]">Acts 1:6–11; Luke 24:50–53</small>
                </li>
                <li>
                  The Descent of the Holy Spirit <small className="block text-[var(--text-muted)]">Acts 2:1–11</small>
                </li>
                <li>
                  The Assumption of Mary{" "}
                  <small className="block text-[var(--text-muted)]">Traditionally contemplated; cf. Revelation 12:1; Psalm 132:8</small>
                </li>
                <li>
                  The Coronation of Mary{" "}
                  <small className="block text-[var(--text-muted)]">Traditionally contemplated; cf. Revelation 12:1; Psalm 45</small>
                </li>
              </ol>
            </details>

            <details className="rounded-xl border border-white/10 p-3">
              <summary className="cursor-pointer font-semibold text-[var(--text-light)]">Luminous — Thursday</summary>
              <ol className="mt-2 list-decimal pl-5 text-sm text-[var(--text-main)] space-y-1">
                <li>
                  The Baptism in the Jordan{" "}
                  <small className="block text-[var(--text-muted)]">Matthew 3:13–17; Mark 1:9–11; Luke 3:21–22</small>
                </li>
                <li>
                  The Wedding at Cana <small className="block text-[var(--text-muted)]">John 2:1–11</small>
                </li>
                <li>
                  The Proclamation of the Kingdom{" "}
                  <small className="block text-[var(--text-muted)]">Mark 1:14–15 (cf. Matthew 5–7; Luke 4:16–21)</small>
                </li>
                <li>
                  The Transfiguration <small className="block text-[var(--text-muted)]">Matthew 17:1–8; Mark 9:2–8; Luke 9:28–36</small>
                </li>
                <li>
                  The Institution of the Eucharist{" "}
                  <small className="block text-[var(--text-muted)]">Luke 22:14–20; Matthew 26:26–29; Mark 14:22–25; 1 Cor 11:23–26</small>
                </li>
              </ol>
            </details>

            <p className="text-sm text-[var(--text-muted)]">
              Note: Sunday assignments sometimes vary by liturgical season; Glorious on most Sundays is common and perfectly fine.
            </p>
          </div>
        </AccordionSection>

        {/* REFERENCE PRAYERS */}
        <AccordionSection id="ref-prayers" title="Reference Prayers (Texts)">
          <div className="space-y-4">
            <details className="rounded-xl border border-white/10 p-3">
              <summary className="cursor-pointer font-semibold text-[var(--text-light)]">Apostles’ Creed</summary>
              <p className="mt-2 text-sm">
                I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, His only Son, our Lord; who was
                conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; He
                descended into hell; on the third day He rose again from the dead; He ascended into heaven, and is seated at the right hand
                of God the Father almighty; from there He will come to judge the living and the dead. I believe in the Holy Spirit, the holy
                catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.
              </p>
            </details>

            <details className="rounded-xl border border-white/10 p-3">
              <summary className="cursor-pointer font-semibold text-[var(--text-light)]">Our Father</summary>
              <p className="mt-2 text-sm">
                Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven. Give us
                this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into
                temptation, but deliver us from evil. Amen.
              </p>
            </details>

            <details className="rounded-xl border border-white/10 p-3">
              <summary className="cursor-pointer font-semibold text-[var(--text-light)]">Hail Mary</summary>
              <p className="mt-2 text-sm">
                Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus.
                Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.
              </p>
            </details>

            <details className="rounded-xl border border-white/10 p-3">
              <summary className="cursor-pointer font-semibold text-[var(--text-light)]">Glory Be</summary>
              <p className="mt-2 text-sm">
                Glory be to the Father, and to the Son, and to the Holy Spirit; as it was in the beginning, is now, and ever shall be, world
                without end. Amen.
              </p>
            </details>

            <details className="rounded-xl border border-white/10 p-3">
              <summary className="cursor-pointer font-semibold text-[var(--text-light)]">Fatima Prayer</summary>
              <p className="mt-2 text-sm">
                O my Jesus, forgive us our sins, save us from the fires of hell; lead all souls to Heaven, especially those most in need of
                Thy mercy. Amen.
              </p>
            </details>

            <details className="rounded-xl border border-white/10 p-3">
              <summary className="cursor-pointer font-semibold text-[var(--text-light)]">Hail, Holy Queen</summary>
              <p className="mt-2 text-sm">
                Hail, holy Queen, Mother of mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve;
                to thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes
                of mercy toward us; and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O
                sweet Virgin Mary! Pray for us, O holy Mother of God, that we may be made worthy of the promises of Christ. Amen.
              </p>
            </details>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-3">
            Want separate pages to link from meditations? We’ll also publish each text under <code>/prayers/&lt;slug&gt;</code> (e.g.,{" "}
            <code>/prayers/hail-holy-queen</code>).
          </p>
        </AccordionSection>
      </article>
    </main>
  );
}
