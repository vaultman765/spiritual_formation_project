import React, { useEffect, useState } from "react";
import SeoMeta from "@/components/seo/SeoMeta";
import { fetchTodayMeditation } from "@/api/homepage";
import type { MeditationData } from "@/utils/types";

function AccordionSection({
  id,
  title,
  children,
  defaultOpen = false,
}: Readonly<{
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}>) {
  return (
    <details
      id={id}
      open={defaultOpen}
      className="mb-4 rounded-2xl group border border-white/15 bg-[var(--bg-card)]/75 p-4 shadow-sm shadow-black/20"
    >
      <summary className="cursor-pointer select-none list-none font-display text-xl text-[var(--text-light)]">
        <span
          aria-hidden="true"
          className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-primary-dark)]/90 text-black"
        >
          <span className="text-lg leading-none pb-0.5 group-open:hidden">+</span>
          <span className="text-lg leading-none pb-0.5 hidden group-open:inline">–</span>
        </span>
        <h2 className="inline">{title}</h2>
      </summary>
      <div className="mt-3 space-y-3 text-[var(--text-main)]">{children}</div>
    </details>
  );
}

function Tip({ children, TipHeader = "Tip" }: Readonly<{ children: React.ReactNode; TipHeader?: string }>) {
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
  inLanguage: "en-US",
  image: "https://www.catholicmentalprayer.com/images/how_to_pray/how_to_pray.jpg",
  mainEntityOfPage: "https://www.catholicmentalprayer.com/how-to-pray",
  totalTime: "PT10M",
  estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: 0 },
  tool: [{ "@type": "HowToTool", name: "Notebook (optional)" }],
  supply: [{ "@type": "HowToSupply", name: "Bible or meditation text" }],
  author: { "@type": "Organization", name: "Spiritual Formation Project" },
  publisher: {
    "@type": "Organization",
    name: "Spiritual Formation Project",
    logo: { "@type": "ImageObject", url: "https://www.catholicmentalprayer.com/images/logo_748.png", width: 748, height: 598 },
  },
  datePublished: "2025-08-29",
  dateModified: "2025-08-30",
  step: [
    {
      "@type": "HowToStep",
      name: "The Day Before: Preparation and Particular Examen",
      text: "Read tomorrow’s passages, choose a focus, and make a short particular examen with 3 touchpoints (morning, midday, night).",
      url: "https://www.catholicmentalprayer.com/how-to-pray#day-before",
      image: "https://www.catholicmentalprayer.com/images/how_to_pray/the_day_before.jpg",
    },
    {
      "@type": "HowToStep",
      name: "Morning: Immediate Preparation",
      text: "Upon waking, recollect yourself, ask for grace, and elicit feelings and affections that align with the meditation's focus.",
      url: "https://www.catholicmentalprayer.com/how-to-pray#morning-preparation",
      image: "https://www.catholicmentalprayer.com/images/how_to_pray/morning_preparation.jpg",
    },
    {
      "@type": "HowToStep",
      name: "Commencement: Begin the Meditation",
      text: "Call to mind God’s presence, adore, acknowledge your weakness, ask for help. Make the preludes.",
      url: "https://www.catholicmentalprayer.com/how-to-pray#commencement",
      image: "https://www.catholicmentalprayer.com/images/how_to_pray/commencement.jpg",
      itemListElement: [
        {
          "@type": "HowToDirection",
          name: "Recall the Divine Presence",
          text: "Call to mind the Divine presence while standing.",
          url: "https://www.catholicmentalprayer.com/how-to-pray#commencement",
        },
        {
          "@type": "HowToDirection",
          name: "Adoration",
          text: "Adore God on bended knees or seated, acknowledging His majesty.",
          url: "https://www.catholicmentalprayer.com/how-to-pray#commencement",
        },
        {
          "@type": "HowToDirection",
          name: "Preparatory Prayer",
          text: "Say the Preparatory Prayer, including acknowledgment of God's greatness, sorrow for sins, and a petition for grace.",
          url: "https://www.catholicmentalprayer.com/how-to-pray#commencement",
        },
        {
          "@type": "HowToDirection",
          name: "Preludes",
          text: "Make the Preludes by setting the scene of the meditation and asking for a specific grace.",
          url: "https://www.catholicmentalprayer.com/how-to-pray#commencement",
        },
      ],
    },
    {
      "@type": "HowToStep",
      name: "Body of the Meditation: Memory, Understanding, Will",
      text: "Use your memory to vividly recall the specific meditation scene or truth, reflect with your understanding, and move your will to form a concrete resolution for the day.",
      url: "https://www.catholicmentalprayer.com/how-to-pray#body-of-meditation",
      image: "https://www.catholicmentalprayer.com/images/how_to_pray/body_of_meditation.jpg",
      itemListElement: [
        {
          "@type": "HowToDirection",
          name: "Memory",
          text: "Use your memory to vividly recall the specific meditation scene or truth, engaging your imagination.",
          url: "https://www.catholicmentalprayer.com/how-to-pray#body-of-meditation",
        },
        {
          "@type": "HowToDirection",
          name: "Understanding",
          text: "Reflect with your understanding: what is the practical takeaway? What obstacles must be removed? How have you done in the past?",
          url: "https://www.catholicmentalprayer.com/how-to-pray#body-of-meditation",
        },
        {
          "@type": "HowToDirection",
          name: "Will",
          text: "Move your will: elicit pious affections and form a concrete resolution for the day.",
          url: "https://www.catholicmentalprayer.com/how-to-pray#body-of-meditation",
        },
      ],
    },
    {
      "@type": "HowToStep",
      name: "Conclusion: Recapitulation, Ejaculatory Prayer, Colloquy",
      text: "Recap your resolution, say an ejaculatory prayer to remind you throughout the day, and have a heartfelt colloquy with Jesus, the BVM, or a saint.",
      url: "https://www.catholicmentalprayer.com/how-to-pray#conclusion",
      image: "https://www.catholicmentalprayer.com/images/how_to_pray/conclusion.jpg",
    },
    {
      "@type": "HowToStep",
      name: "Reflection: Examination and Recapitulation",
      text: "After rising, examine how the meditation went, review key insights and your resolution, and plan to check in at midday and night.",
      url: "https://www.catholicmentalprayer.com/how-to-pray#reflection",
      image: "https://www.catholicmentalprayer.com/images/how_to_pray/reflection.jpg",
    },
  ],
};

const breadcrumbsJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.catholicmentalprayer.com" },
    { "@type": "ListItem", position: 2, name: "How to Pray", item: "https://www.catholicmentalprayer.com/how-to-pray" },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  url: "https://www.catholicmentalprayer.com/how-to-pray#faq-resources",
  name: "Frequently Asked Questions",
  description: "Common questions and answers about the Ignatian mental prayer method.",
  inLanguage: "en-US",
  mainEntity: [
    {
      "@type": "Question",
      name: "I get distracted. What should I do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Everyone does. When you notice, just return to Jesus without fuss.",
      },
    },
    {
      "@type": "Question",
      name: "How long should I pray?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Start with 10–15 minutes. As you grow, extend to 20–30 minutes.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need vivid imagination?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. A simple recollection of the truth is enough. Imagination helps some, but it's not required.",
      },
    },
    {
      "@type": "Question",
      name: "What if it feels dry?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Fidelity matters more than feelings. God works in hidden ways. Keep showing up.",
      },
    },
  ],
};

export default function HowToPrayPage() {
  const [today, setToday] = useState<MeditationData | null>(null);

  useEffect(() => {
    fetchTodayMeditation().then(setToday).catch(console.error);
  }, []);

  return (
    <main>
      <SeoMeta
        title="How to Pray – Ignatian Mental Prayer (Beginner’s Guide)"
        description="A gentle, step-by-step guide to Ignatian mental prayer – clear, non-intimidating, and practical. Start tonight with the particular examen; tomorrow, pray with confidence."
        canonicalUrl="https://www.catholicmentalprayer.com/how-to-pray"
        imageUrl="https://www.catholicmentalprayer.com/images/how_to_pray/how_to_pray.jpg"
        keywords="Spiritual Formation, Mental Prayer, Ignatian Prayer, Catholic Prayer, Prayer Guide, How to Pray, Christian Meditation, Prayer Techniques, Spiritual Growth"
        type="article"
        jsonLd={[howToJsonLd, faqJsonLd]}
        breadcrumbsJsonLd={breadcrumbsJsonLd}
      />

      <article className="mx-auto max-w-3xl px-2 py-6">
        <header className="mb-8 text-center">
          <h1 className="font-display text-4xl text-[var(--text-light)]">How to Pray</h1>
          <p className="mx-auto mt-3 max-w-2xl text-[var(--text-muted)]">
            A step-by-step guide to Ignatian mental prayer – clear and practical. Start tonight with the particular examen; tomorrow, pray
            with confidence.
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
          <p className="mx-auto mt-3 max-w-2xl text-[var(--text-muted)]">
            Or, for a more in-depth article on the Ignatian method, check out the{" "}
            <a href="/how-to-pray/guide" rel="noopener noreferrer">
              In-Depth Guide
            </a>
            !
          </p>
        </header>

        {/* OVERVIEW */}
        <section className="mb-8 rounded-2xl border border-white/15 bg-[var(--bg-card)]/75 p-5 shadow-black/20">
          <h2 className="font-display underline text-center text-2xl text-[var(--text-light)]">Overview</h2>
          <h3 className="font-display text-lg text-center text-[var(--text-light)]">
            Brief overview of the method of mental prayer. Each section is broken down in the dropdowns below.
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
                  <em>Preparatory Prayer</em>
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
                  conclusion? How have I done before? What hindrances need to be removed for the future? Related to the sin to be destroyed
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
              <strong>Reflection</strong>: After rising, examine how the meditation went, review key insights and your resolution, and plan
              to check in at midday and night.
            </li>
          </ol>
          <Tip TipHeader="Tips">
            <ul className="list-disc pl-6">
              <li>
                Start with <span className="font-semibold">8–15 minutes</span>. Consistency beats intensity. If you get distracted, gently
                return to the Lord.
              </li>
              <li>
                Be sure to check out all available arcs and meditations on the{" "}
                <a href="https://www.catholicmentalprayer.com/explore" target="_blank" rel="noopener noreferrer">
                  explore page
                </a>
                , browse{" "}
                <a href="https://www.catholicmentalprayer.com/explore/prebuilt" target="_blank" rel="noopener noreferrer">
                  prebuilt journeys
                </a>{" "}
                (coming soon!), or create your own{" "}
                <a href="https://www.catholicmentalprayer.com/create-custom-journey" target="_blank" rel="noopener noreferrer">
                  custom journey
                </a>
                !
              </li>
            </ul>
          </Tip>
        </section>

        <ol>
          {/* DAILY FLOW ACCORDION */}
          <li>
            <AccordionSection id="day-before" title="1) The Day Before: Preparation • Particular Examen">
              <ul className="list-disc pl-6">
                <li>
                  <span className="font-semibold">Topic readings</span>: Read the readings for the next morning's meditation.
                </li>
                <li>
                  <span className="font-semibold">
                    Particular examen focusing on one fault/sin to overcome or virtue to obtain. This should be very specific - for example,
                    instead of, "I want to not be judgmental", pick a specific instance or circumstance you know you are judgmental and
                    focus on that first. (3 touchpoints)
                  </span>
                  :
                  <ul className="mt-1 list-[circle] pl-5">
                    <li>
                      On waking (tomorrow): resolve to guard self against the particular sin or defect / practice the particular virtue.
                    </li>
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
                    Each meditation day on this site has primary and secondary readings. It is highly suggested to read both sets of
                    readings. Generally it will take under 15 minutes of reading to complete both.
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
          </li>

          <li>
            <AccordionSection id="morning-preparation" title="2) Morning: Immediate Preparation">
              <ul className="list-disc pl-6">
                <li>
                  <span className="font-semibold">Immediately Upon Waking</span>: Think of the approaching meditation and pray for grace.
                </li>
                <li>
                  <span className="font-semibold">As you get up</span>: Elicit feelings and affections that align with the meditation's
                  focus.
                </li>
                <li>
                  <span className="font-semibold">Enter the meditation</span>: With a tranquil mind.
                </li>
              </ul>
            </AccordionSection>
          </li>

          <li>
            <AccordionSection id="commencement" title="3) Commencement: Begin the Meditation">
              <ol className="list-decimal pl-6">
                <li>
                  <span className="font-semibold">Before beginning</span>: Standing - Call to mind the Divine presence.
                </li>
                <li>
                  <span className="font-semibold">Adoration</span>: Adore God on bended knees (or seated if required) for who He is and what
                  He has done.
                </li>
                <li>
                  <span className="font-semibold">Preparatory Prayer</span>:
                  <ul className="mt-1 list-[circle] pl-5">
                    <li>
                      <em>Acknowledgment</em>: God's supreme power and our own nothingness.
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
                      <em>Set the Scene</em>: Recall to mind the overall subject of the meditation (generally the primary reading) and
                      represent in your heart the place of the mystery.
                    </li>
                    <li>
                      <em>Beg for Grace</em>: Seek for a particular grace - not general. Seek for understanding. Seek for a pious
                      inclination of will.
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
                    If the meditation is not something that can be seen (a specific sin, virtue, etc.), a representation suffices (e.g.,
                    hell or a monster for sin)
                  </li>
                  <li>
                    Each meditation day on this site has a prelude image that can be used to help set the scene, or an idea to build on.
                  </li>
                </ul>
              </Tip>
            </AccordionSection>
          </li>

          <li>
            <AccordionSection id="body-of-meditation" title="4) Body of the Meditation: Memory • Understanding • Will">
              <ol className="list-decimal pl-6">
                <li>
                  <span className="font-semibold">The Memory (meditative points)</span>: Similar to the first prelude, but specifically on
                  the part(s) proposed for meditation. These will be a very narrowed focus on a specific details and/or elements of the
                  scene. For example, if it was Christ speaking in the reading, think of him speaking directly to you. If it is a meditation
                  on the spear in the side of Christ, meditate on being there, contemplating the blood and water flowing out.
                </li>
                <li>
                  <span className="font-semibold">The Understanding</span>: For each meditative point, apply various reflections to oneself.
                  Use the questions below:
                  <ul className="mt-1 list-[decimal] pl-5">
                    <li>What is the practical conclusion for my circumstances? How to regulate conduct.</li>
                    <li>What motives urge its adoption? The reasoning to adopt the practical conclusion.</li>
                    <li>
                      How has it been observed in me before? If well, give God thanks. If poorly, shame. Be specific, humble yourself before
                      God
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
                    The Memory/Meditative points are not meant to be reflections, but rather a meditation on a specific detail from the
                    theme or the greater arc, or the primary reading. Reflections come after.
                  </li>
                  <li>
                    {" "}
                    This can seem overwhelming at first, but take it one step at a time. This is a process of great spiritual growth and it
                    doesn't matter where you start, but where you are going.
                  </li>
                </ul>
              </Tip>
            </AccordionSection>
          </li>

          <li>
            <AccordionSection id="conclusion" title="5) Conclusion: Recapitulation • Ejaculatory Prayer • Colloquy">
              <ul className="list-disc pl-6">
                <li>
                  <span className="font-semibold">Recapitulation</span>: Confirm the resolution(s) made during the meditation.
                </li>
                <li>
                  <span className="font-semibold">Ejaculatory Prayer</span>: Serves during the day as a reminder of the resolution and a
                  plea for divine assistance. During meditation often combined with an Our Father and Hail Mary.
                </li>
                <li>
                  <span className="font-semibold">Colloquy</span>: Addressed to Jesus Christ, the Blessed Virgin, or a saint. Ask for grace
                  to observe resolutions. Can include any other urgent petitions. Vocal prayer.
                </li>
              </ul>
            </AccordionSection>
          </li>

          <li>
            <AccordionSection id="reflection" title="6) Reflection: Examination • Recapitulation">
              <ul className="list-disc pl-6">
                <li>Rise reverently from kneeling</li>
                <li>An examination of how the meditation was performed. How was the meditation? How did we do with the preparation?</li>
                <li>Short review of the key reflections and insights gained during the meditation. Review resolution(s) again.</li>
                <li>Remember at midday to check in and review how you have done so far. Ask for grace. Remember the Ejaculatory Prayer.</li>
                <li>At night: brief examen; check how you did with the day’s resolution; prepare tomorrow’s topic.</li>
              </ul>
            </AccordionSection>
          </li>

          {/* Friendly extras */}
          <li>
            <AccordionSection id="faq-resources" title="FAQ & Resources">
              <ul className="list-disc pl-6">
                <li>
                  <span className="font-semibold">“Is there an article on this that goes more in-depth?”</span> Definitely, check out our{" "}
                  <a href="/how-to-pray/guide" target="_blank" rel="noopener noreferrer">
                    in-depth guide
                  </a>
                  !
                </li>
                <li>
                  <span className="font-semibold">“Are there any books you recommend for mental prayer?”</span> There are two great
                  resources:
                  <ul className="list-decimal pl-6">
                    <li>
                      <span className="font-semibold">
                        <a href="https://amzn.to/4lYJJK5" target="_blank" rel="noopener noreferrer">
                          A Brief Guide to Mental Prayer According to the Mind of St. Ignatius
                        </a>
                      </span>{" "}
                      by an anonymous Jesuit Priest, editor: Christian B. Wagner
                    </li>
                    <li>
                      <span className="font-semibold">
                        <a href="/docs/readings/St_Ignatius_of_Loyola_Spiritual_Exercises.pdf" target="_blank" rel="noopener noreferrer">
                          St. Ignatius of Loyola: Spiritual Exercises
                        </a>
                      </span>{" "}
                      by St. Ignatius of Loyola
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold">“I get distracted.”</span> Everyone does. When you notice, just return to Jesus without
                  fuss.
                </li>
                <li>
                  <span className="font-semibold">“How long should I pray?”</span> Start with 10–15 minutes. As you grow, extend to 20–30.
                </li>
                <li>
                  <span className="font-semibold">“Do I need vivid imagination?”</span> No. A simple recollection of the truth is enough.
                </li>
                <li>
                  <span className="font-semibold">“What if it feels dry?”</span> Fidelity matters more than feelings. God works in hidden
                  ways.
                </li>
              </ul>
            </AccordionSection>
          </li>
        </ol>

        <section className="mt-10 text-sm text-[var(--text-muted)]">
          <p>
            Inspired by the classical Ignatian method (see <em>Spiritual Exercises</em> of St. Ignatius of Loyola) and the clear, practical
            outline in <span className="underline">A Brief Guide to Mental Prayer According to the Mind of St. Ignatius</span> (Jesuit
            author; ed. Christian B. Wagner). This page paraphrases their method in beginner-friendly language.
          </p>
        </section>
      </article>
    </main>
  );
}
