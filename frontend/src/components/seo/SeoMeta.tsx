// /src/components/seo/SeoMeta.tsx
import { Helmet } from "react-helmet-async";

type SeoMetaProps = {
  readonly title: string;
  readonly description: string;
  readonly canonicalUrl: string;
  readonly imageUrl?: string;
  readonly type?: "website" | "article" | "book";
  readonly locale?: string;
  readonly siteName?: string;
  readonly twitterHandle?: string;
  readonly jsonLd?: object;
  readonly breadcrumbsJsonLd?: object;
  readonly keywords?: string;
};

export default function SeoMeta({
  title,
  description,
  canonicalUrl,
  imageUrl = "https://www.catholicmentalprayer.com/images/og-default.jpg",
  type = "website",
  locale = "en_US",
  siteName = "Spiritual Formation Project",
  twitterHandle = "@RCMentalPrayer",
  keywords = "Ignatian Meditation, Mental Prayer, Catholic Prayer Guide, Ignatian Spirituality, Spiritual Formation, Christian Meditation, Prayer Techniques, Spiritual Growth",
  jsonLd,
  breadcrumbsJsonLd,
}: SeoMetaProps) {
  return (
    <Helmet>
      {/* Title & Description */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />

      {/* Keywords */}
      <meta name="keywords" content={keywords} />

      {/* JSON-LD */}
      {Array.isArray(jsonLd)
        ? jsonLd.map((block, i) => (
            <script key={`${block.name}-${i}`} type="application/ld+json">
              {JSON.stringify(block)}
            </script>
          ))
        : jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
      {breadcrumbsJsonLd && <script type="application/ld+json">{JSON.stringify(breadcrumbsJsonLd)}</script>}
    </Helmet>
  );
}
