// /src/components/seo/SeoMeta.tsx
import { Helmet } from "react-helmet-async";

type SeoMetaProps = {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl?: string;
  type?: "website" | "article" | "book";
  locale?: string;
  siteName?: string;
  twitterHandle?: string;
  jsonLd?: object;
  breadcrumbsJsonLd?: object;
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

      {/* JSON-LD */}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
      {breadcrumbsJsonLd && <script type="application/ld+json">{JSON.stringify(breadcrumbsJsonLd)}</script>}
    </Helmet>
  );
}
