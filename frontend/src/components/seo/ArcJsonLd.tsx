import { Helmet } from "react-helmet-async";
import type { ArcData } from "@/utils/types";

export default function ArcJsonLd({ arc }: { readonly arc: ArcData }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: arc.arc_title,
    description: arc.arc_summary || "A guided Ignatian arc of spiritual meditations.",
    url: `https://www.catholicmentalprayer.com/arcs/${arc.arc_id}`,
    image: `https://www.catholicmentalprayer.com/images/arc_whole/${arc.arc_id}.jpg`,
    keywords: arc.card_tags?.join(", ") || "",
    provider: {
      "@type": "Organization",
      name: "Spiritual Formation Project",
      url: "https://www.catholicmentalprayer.com",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
