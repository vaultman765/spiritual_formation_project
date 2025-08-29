import React from "react";
import SeoMeta from "@/components/seo/SeoMeta";

// Lightweight, accessible accordion using <details>/<summary>
function AccordionSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="mb-4 rounded-2xl border border-white/15 bg-[var(--bg-card)]/75 p-4 shadow-sm shadow-black/20" open={defaultOpen}>
      <summary className="cursor-pointer select-none list-none font-display text-xl text-[var(--text-light)]">
        <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-primary-dark)]/90 text-black">
          <span className="text-lg leading-none pb-0.5">+</span>
        </span>
        {title}
      </summary>
      <div className="mt-3 space-y-3 text-[var(--text-main)]">{children}</div>
    </details>
  );
}

function Tip({ children, TipHeader = "Tip" }: { children: React.ReactNode; TipHeader?: string }) {
  return (
    <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/10 p-3 text-[var(--text-main)]">
      <div className="text-sm font-semibold tracking-wide text-[var(--brand-primary-dark)]">{TipHeader}</div>
      <div className="mt-1 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Pray: Ignatian Mental Prayer (Beginner Guide)",
  description:
    "A simple step-by-step method to begin Ignatian mental prayer, from the night-before examen to the closing colloquy and daily follow-through.",
  step: [
    { "@type": "HowToStep", name: "Night before: choose a topic & do a brief particular examen" },
    { "@type": "HowToStep", name: "On waking: turn to God and recall today's topic" },
    { "@type": "HowToStep", name: "Find a quiet place and ask the Holy Spirit for help" },
    { "@type": "HowToStep", name: "Begin: presence of God, adoration, preparatory prayer" },
    { "@type": "HowToStep", name: "Preludes: set the scene and ask for a specific grace" },
    { "@type": "HowToStep", name: "Meditate: remember, reflect, and respond from the heart" },
    { "@type": "HowToStep", name: "Make one concrete resolution" },
    { "@type": "HowToStep", name: "Conclude with a colloquy and an Our Father" },
    { "@type": "HowToStep", name: "Afterward: short review; carry an ejaculatory prayer through the day" },
  ],
};

export default function HowToPrayPage() {
  return (
    <main>
      <SeoMeta
        title="How to Pray – Ignatian Mental Prayer (Beginner’s Guide)"
        description="A gentle, step-by-step guide to Ignatian mental prayer – clear, non-intimidating, and practical. Start tonight with the particular examen; tomorrow, pray with confidence."
        canonicalUrl="https://www.catholicmentalprayer.com/how-to-pray"
        jsonLd={howToJsonLd}
        breadcrumbsJsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.catholicmentalprayer.com" },
            { "@type": "ListItem", position: 2, name: "How to Pray" },
          ],
        }}
      />

      <article className="mx-auto max-w-3xl px-2 py-6">
        <header className="mb-8 text-center">
          <h1 className="font-display text-4xl text-[var(--text-light)]">How to Pray</h1>
          <p className="mx-auto mt-3 max-w-2xl text-[var(--text-muted)]">
            A friendly, Ignatian method for beginners. Short steps, clear words, one resolution each day.
          </p>
        </header>

        {/* OVERVIEW */}
        <section className="mb-8 rounded-2xl border border-white/15 bg-[var(--bg-card)]/75 p-5 shadow-black/20">
          <h2 className="font-display underline text-center text-2xl text-[var(--text-light)]">Overview</h2>
          <h3 className="font-display text-xl text-center text-[var(--text-light)]">
            Brief list of the pieces of mental prayer. Each section broken down in the dropdowns below
          </h3>
          <ol className="mt-3 mb-3 list-decimal space-y-2 pl-6 text-[var(--text-main)]">
            <li>
              <strong>Night Before</strong>: Complete the readings & complete a particular examen. Decide on first prelude (Each meditation
              on this site has a prelude image that can be used)
            </li>
            <li>
              <strong>Immediate Preparation</strong>: Think of your topic of meditation upon waking; find a quiet place; ask the Holy Spirit
              for help
            </li>
            <li>
              <strong>Commencement</strong>:
              <ol className="mt-1 list-disc pl-6">
                <li>
                  <em>Call to mind the Divine presence and adore God on bended knees</em>
                </li>
                <li>
                  <em>Perfatory Prayer</em>
                </li>
                <li>
                  <em>
                    Make the preludes: Bring your imagination to the scene & beg for particular graces, understanding, and inclination of
                    will
                  </em>
                </li>
              </ol>
            </li>
            <li>
              <strong>Body of the Meditation</strong>
              <ol className="mt-1 list-disc pl-6">
                <li>
                  <em>The Memory</em>: Similar to the prelude image, but narrowed in on the specific scene or truth for the day. Can be 1-3
                  proposed points for meditation (each meditation on this site has 1-3 points for reflection as an option)
                </li>
                <li>
                  <em>The Understanding</em>: Various reflections on the meaning and implications applied to oneself. What is the practical
                  conclusion? How have I done before? What hinderances need to be removed for the future? Related to the sin to be destroyed
                  or virtue attained from particular examen.
                </li>
                <li>
                  <em>The Will</em>: Throughout meditation elicit pious affections and form efficacious resolutions.
                </li>
              </ol>
            </li>
            <li>
              <strong>Conclusion</strong>: The recapitulation, ejaculatory prayer, and colloquy.
            </li>
            <li>
              <strong>Reflection</strong>: A simple colloquy (talk heart-to-heart) and an Our Father. Choose a 2–4 word aspiration for the
              day (e.g., “Jesus, I trust You”).
            </li>
          </ol>
          <Tip>
            Start with <span className="font-semibold">8–15 minutes</span>. Consistency beats intensity. If you get distracted, gently
            return to the Lord.
          </Tip>
        </section>

        {/* DAILY FLOW ACCORDION */}
        <AccordionSection title="1) The Day Before: Preparation" defaultOpen>
          <ul className="list-disc pl-6">
            <li>
              <span className="font-semibold">Topic readings</span>: Read the readings for the next morning's meditation.
            </li>
            <li>
              <span className="font-semibold">
                Particular examen focusing on one fault/sin to overcome or virtue to obtain (3 touchpoints)
              </span>
              :
              <ul className="mt-1 list-[circle] pl-5">
                <li>On waking (tomorrow): resolve to guard self against the particular sin or defect / practice the particular virtue.</li>
                <li>Midday: ask for grace; briefly review how you did so far.</li>
                <li>
                  Night: ask the Lord for grace to remember how many times you fell into that sin or failed to practice that virtue and
                  grace to amend yourself in the future.
                </li>
              </ul>
            </li>
          </ul>
          <Tip TipHeader="Tips">
            <ul className="list-disc pl-6">
              <li>
                Each meditation day on this site has primary and secondary readings. It is highly suggested to read both sets of readings.
                Generally it will take under 15 minutes of reading to complete both.
              </li>
              <li>
                When choosing a sin to defeat or virtue to obtain, always focus on any attachment to mortal sins first. They MUST be
                destroyed for spiritual growth.{" "}
                <a href="https://www.ncregister.com/info/confession-guide-for-adults" target="_blank" rel="noopener noreferrer">
                  Go to confession!
                </a>
              </li>
            </ul>
          </Tip>
        </AccordionSection>

        <AccordionSection title="2) Morning: Immediate Preparation">
          <ul className="list-disc pl-6">
            <li>
              <span className="font-semibold">Immediately Upon Waking</span>: Think of the approaching meditation and pray for grace.
            </li>
            <li>
              <span className="font-semibold">As you get up:</span>: Elicit feelings and affections that align with the meditation's focus.
            </li>
            <li>
              <span className="font-semibold">Enter the meditation</span>: With a tranquil mind.
            </li>
          </ul>
        </AccordionSection>

        <AccordionSection title="3) Commencement: Begin the Meditation">
          <ol className="list-decimal pl-6">
            <li>
              <span className="font-semibold">Before beginning</span>: Standing - Call to mind the Divine presence.
            </li>
            <li>
              <span className="font-semibold">Adoration</span>: Adore God on bended knees (or seated if required) for who He is and what He
              has done.
            </li>
            <li>
              <span className="font-semibold">Prefatory Prayer</span>:
              <ul className="mt-1 list-[circle] pl-5">
                <li>
                  <em>Acknowledgement</em>: God's supreme power and our own nothingness.
                </li>
                <li>
                  <em>Sorrow for Sins</em>: Pray to be delivered from sin and its occasions.
                </li>
                <li>
                  <em>Ask for Grace</em>: Pray for Divine Assistance to pray well.
                </li>
              </ul>
            </li>
            <li>
              <span className="font-semibold">Preludes</span>:
              <ul className="mt-1 list-[circle] pl-5">
                <li>
                  <em>Set the Scene</em>: Recall to mind the overall subject of the meditation (generally the primary reading) and represent
                  in your heart the place of the mystery.
                </li>
                <li>
                  <em>Beg for Grace</em>: Seek for a particular grace - not general. Seek for understanding. Seek for a pious inclination of
                  will.
                </li>
              </ul>
            </li>
          </ol>
          <Tip TipHeader="Tips">
            <ul className="list-disc pl-6">
              <li>
                The first prelude is generally a 3-5 minute recollection of the entirety of the primary reading. Seeing yourself at the
                scene, the people there, what is being said, etc. Not as something from long ago, but as if it was happening now.
              </li>
              <li>
                If the meditation is not something that can be seen (a specific sin, virtue, etc.), a representation suffices (e.g., hell or
                a monster for sin)
              </li>
              <li>Each meditation day on this site has a prelude image that can be used to help set the scene, or an idea to build on.</li>
            </ul>
          </Tip>
        </AccordionSection>

        <AccordionSection title="4) Body of the Meditation: Memory • Understanding • Will">
          <ol className="list-decimal pl-6">
            <li>
              <span className="font-semibold">The Memory (meditative points)</span>: Similar to the first prelude, but specifically on the
              part(s) proposed for meditation. These will be a very narrowed focus on a specific details and/or elements of the scene. For
              example, if it was Christ speaking in the reading, think of him speaking directly to you. If it is a meditation on the spear
              in the side of Christ, meditate on being there, contemplating the blood and water flowing out.
            </li>
            <li>
              <span className="font-semibold">The Understanding</span>: For each meditative point, apply various reflections to oneself. Use
              the questions below:
              <ul className="mt-1 list-[decimal] pl-5">
                <li>What is the practical conclusion for my circumstances? How to regulate conduct.</li>
                <li>What motives urge its adoption? The reasoning to adopt the practical conclusion.</li>
                <li>
                  How has it been observed in me before? If well, give God thanks. If poorly, shame. Be specific, humble yourself before God
                </li>
                <li>What is to be done in the future? Seek out future good resolutions - cases more likely to happen.</li>
                <li>What hindrance is to be removed? Identify obstacles that could impede progress.</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold">The Will</span>: Elicit pious affections and form efficacious resolutions throughout the
              entire meditation. Also form good resolution(s) for the day which must be:
              <ul className="mt-1 list-[decimal] pl-5">
                <li>Practical</li>
                <li>Particular</li>
                <li>Suited to present situation</li>
                <li>Founded on solid motives</li>
                <li>Humble</li>
                <li>Joined with prayer for Divine assistance</li>
              </ul>
            </li>
          </ol>
          <Tip TipHeader="Tips">
            <ul className="list-disc pl-6">
              <li>Keep the resolution small, specific, and for today. Ask Jesus for the grace to keep it.</li>
              <li>
                The Memory/Meditative points are not meant to be reflections, but rather a meditation on a specific detail from the theme or
                the greater arc, or the primary reading. Reflections come after.
              </li>
              <li>
                {" "}
                This can seem overwhelming at first, but take it one step at a time. This is a process of great spiritual growth and it
                doesn't matter where you start, but where you are going.
              </li>
            </ul>
          </Tip>
        </AccordionSection>

        <AccordionSection title="5) Conclusion: Recapitulation • Ejaculatory Prayer • Colloquy">
          <ul className="list-disc pl-6">
            <li>
              <span className="font-semibold">Recapitulation</span>: Confirm the resolution(s) made during the meditation.
            </li>
            <li>
              <span className="font-semibold">Ejaculatory Prayer</span>: Serves during the day as a reminder of the resolution and a plea
              for divine assistance. During meditation often combined with an Our Father and Hail Mary.
            </li>
            <li>
              <span className="font-semibold">Colloquy</span>: Addressed to Jesus Christ, the Blessed Virgin, or a saint. Ask for grace to
              observe resolutions. Can include any other urgent petitions. Vocal prayer.
            </li>
          </ul>
        </AccordionSection>

        <AccordionSection title="6) Reflection: Examination • Recapitulation">
          <ul className="list-disc pl-6">
            <li>Rise reverently from kneeling</li>
            <li>An examination of how the meditation was performed. How was the meditation? How did we do with the preparation?</li>
            <li>Short review of the key reflections and insights gained during the meditation. Review resolution(s) again.</li>
            <li>Remember at midday to check in and review how you have done so far. Ask for grace. Remember the Ejaculatory Prayer.</li>
            <li>At night: brief examen; check how you did with the day’s resolution; prepare tomorrow’s topic.</li>
          </ul>
        </AccordionSection>

        {/* Friendly extras */}
        <AccordionSection title="FAQ & Resources">
          <ul className="list-disc pl-6">
            <li>
              <span className="font-semibold">“I get distracted.”</span> Everyone does. When you notice, just return to Jesus without fuss.
            </li>
            <li>
              <span className="font-semibold">“How long should I pray?”</span> Start with 10–15 minutes. As you grow, extend to 20–30.
            </li>
            <li>
              <span className="font-semibold">“Do I need vivid imagination?”</span> No. A simple recollection of the truth is enough.
            </li>
            <li>
              <span className="font-semibold">“What if it feels dry?”</span> Fidelity matters more than feelings. God works in hidden ways.
            </li>
          </ul>
        </AccordionSection>

        <section className="mt-10 text-sm text-[var(--text-muted)]">
          <p>
            Inspired by the classical Ignatian method (see <em>Spiritual Exercises</em> of St. Ignatius of Loyola) and the clear, practical
            outline in <em>A Brief Guide to Mental Prayer According to the Mind of St. Ignatius</em>
            (Jesuit author; ed. Christian B. Wagner). This page paraphrases their method in beginner-friendly language.
          </p>
        </section>
      </article>
    </main>
  );
}
