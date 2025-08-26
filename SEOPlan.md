# 📈 SEO Optimization Checklist for catholicmentalprayer.com

A complete step-by-step plan to make your Vite + React + Node site fully SEO-optimized and discoverable on Google, Bing,
and beyond.

---

## 🧭 Phase 1: Crawlability & Indexing

> ✅ Ensure search engines can access and understand your content.

### ✅ 1.1 Robots.txt & Sitemap

- [x] Allow all bots
- [x] Link to sitemap in `robots.txt`
- [ ] **Add image sitemap** for `/images/arc_whole/` and `/arc_days/`
- [x] Submit sitemap to:
  - [Google Search Console](https://search.google.com/search-console)
  - [Bing Webmaster Tools](https://www.bing.com/webmasters/)

### ✅ 1.2 Canonical URLs

- [ ] Add `<link rel="canonical">` per page  
  _Use `react-helmet-async` for this._

---

## 🧠 Phase 2: Metadata & Structured Information

> ✅ Help crawlers understand and preview your content.

### ✅ 2.1 Page Metadata

- [x] Add dynamic:
  - `<title>`
  - `<meta name="description">`
  - `<link rel="canonical">`
  _Use `react-helmet-async`_

### ✅ 2.2 Open Graph & Twitter Cards

- [x] Add to `<head>`:

  ```html
  <meta property="og:title" content="..." />
  <meta property="og:description" content="..." />
  <meta property="og:image" content="..." />
  <meta property="og:url" content="..." />

### ✅ 2.3 Schema.org Structured Data

- [ ] Add JSON-LD to key content:

- Arcs → @type: Book
- Meditations → @type: Article
- Notes → @type: CreativeWork

- [ ] Embed in:

- ArcCard.tsx
- MeditationCard.tsx
- NoteCard.tsx

## 🚀 Phase 3: Performance & Rendering

> ✅ Ensure your content is visible before JavaScript execution.

### ✅ 3.1 Pre-rendering or SSR

- [ ] Setup prerender-node

- Serve HTML snapshots to crawlers
- OR
- Migrate to Next.js for SSR

### ✅ 3.2 Core Web Vitals

- [ ] Test with [PageSpeed Insights](https://pagespeed.web.dev/)

- [ ] Optimize:

  - Fonts
  - Image sizes
  - Lazy loading
  - Layout shift (CLS)

## 📸 Phase 4: Image SEO

> ✅ Boost visibility in Google Image Search.

### ✅ 4.1 Alt Text

- [x] Already used in <CardImage /> ✅

- [ ] Verify meaningful alt text for all images

### ✅ 4.2 Image Sitemap

- [ ] Add <image:image> to sitemap entries:

```xml
<image:image>
  <image:loc>https://www.catholicmentalprayer.com/images/arc_whole/love_of_god.jpg</image:loc>
  <image:title>Love of God Arc</image:title>
</image:image>
```

## 🧩 Phase 5: UX & Semantic HTML

> ✅ Improve accessibility and search engine semantics.

### ✅ 5.1 Accessible Navigation

- [x] Semantic `<nav>`, aria-labels used ✅

### ✅ 5.2 Semantic Content

- [ ] Use consistent `<h1>` → `<h2>` → `<h3>` structure

- [ ] Use `<ul>/<li>` for lists where applicable

### ✅ 5.3 Breadcrumbs (Optional)

- [ ] Add JSON-LD BreadcrumbList for deep pages like:
  - /arcs/:arc_id/day/:day_id

## 📈 Phase 6: Search Console & Analytics

> ✅ Track visibility, errors, and performance.

### ✅ 6.1 Google Search Console

- [x] Verified ✅

- [ ] Submit updated sitemap

- [ ] Monitor:

  - Indexing status
  - Mobile usability
  - CWV performance

### ✅ 6.2 Bing Webmaster Tools

- [ ] Submit domain and sitemap

### ✅ 6.3 Analytics

- [ ] Install:

- Google Analytics 4
- OR privacy-friendly tool (e.g. Plausible, Matomo)

- [ ] Track:

- Arc starts
- Note activity
- Journey completions

## 📢 Phase 7: Content Strategy (Optional)

> ✅ Rank for long-tail queries and grow organic traffic.

### ✅ 7.1 Blog / Guides

- [ ] Add /blog or /guides section

- [ ] Write longform articles on topics like:

  - “How to Start Catholic Mental Prayer”
  - “Ignatian Meditation for Beginners”

### ✅ 7.2 Static SEO Pages

- [ ] Create rich content pages:

  - /about
  - /how-to-pray
  - /resources

✅ TL;DR — Final SEO Checklist
Priority Task
⭐️⭐️⭐️ Add dynamic metadata with react-helmet-async
⭐️⭐️⭐️ Setup prerender-node middleware
⭐️⭐️⭐️ Add JSON-LD schema for cards
⭐️⭐️ Open Graph & Twitter tags
⭐️⭐️ Image sitemap
⭐️⭐️ Submit to Bing Webmaster
⭐️ Analytics tracking
⭐️ Blog / SEO content
