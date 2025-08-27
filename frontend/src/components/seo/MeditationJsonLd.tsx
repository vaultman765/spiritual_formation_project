import { Helmet } from "react-helmet-async";

interface MeditationJsonLdProps {
  dayTitle: string;
  subtitle: string;
  imageSrc: string;
  altText: string;
  link: string;
  tag: string;
}

export default function MeditationJsonLd({ dayTitle, subtitle, imageSrc, altText, link, tag }: MeditationJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: dayTitle,
    alternativeHeadline: subtitle,
    image: {
      "@type": "ImageObject",
      url: `https://www.catholicmentalprayer.com${imageSrc}`,
      description: altText,
    },
    author: {
      "@type": "Organization",
      name: "Spiritual Formation Project",
      url: "https://www.catholicmentalprayer.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Spiritual Formation Project",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.catholicmentalprayer.com${link}`,
    },
    keywords: tag,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
