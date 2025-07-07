# 📘 Spiritual Formation Project – Unified Roadmap

Last updated: July 3, 2025

This file integrates all current roadmap and planning data from:

- ✅ `priority_work_order.md`
- ✅ `web_project_status_summary.md`
- ✅ `next_phase_plan.md`

---

## 🧱 Project Pillars

### 1. YAML Meditation Infrastructure (Core)

- ✅ Arc system fully planned through Arc 13
- ✅ `day_full_schema.yaml` enforced
- ✅ Tag bank in place (`tag_bank.yaml`)
- ✅ All days validated against schema + tag categories
- ✅ YAML import pipeline to DB complete (`build_and_import_arc.py`)
- ✅ GitHub token sync working (partial PR testing pending)

**Next up:**

- 🔜 Arc 14 YAML generation (`The Angelus`)
- 🔜 Arc 15–16 follow-up
- 🪵 Long-term: full-text `day.md` generator from YAML (optional)

---

## 🖥️ Backend Infrastructure (Django + API)

### Completed

- ✅ Full Django model structure (Arc, Day, Tag, etc.)
- ✅ `import_arc.py` and `import_day_yaml.py` pipeline
- ✅ Admin console working
- ✅ ArcTagViewer frontend → backend API integration complete
- ✅ Dev server running locally with GitHub-linked repo

### In Progress

- 🛠️ Multi-import script (planned for GitHub CI)
- 🛠️ Better search for arcs/tags/keywords
- 🔍 Add dry-run, checksum skipping to arc imports
- 🪵 Automate `arc_metadata.yaml` rebuild from schema

---

## 🎨 Frontend Admin UI

### Completed

- ✅ React + Vite + Tailwind dev setup
- ✅ ArcTagViewer component
- ✅ Django REST API consumption
- ✅ Local live preview + dev support

### In Progress

- 🔜 Better tag navigation (search bar, highlight matches, etc.)
- 🔜 Metadata display per arc (anchor image, primary reading, day count)
- 🔜 ArcPageViewer component design
- 🪵 Add Cypress tests for core tag/arc UI

---

## 🌐 Frontend – **User Website**

This is the next major stage.

### Wireframing + UX Goals

- 🟦 Mobile-first + desktop-friendly layouts
- 🟦 Beautiful display of meditations and arcs
- 🟦 Tag navigation experience (hover + drill-in)
- 🟦 Thematic browsing and reading path suggestions

### Pages to Build

- 🧭 Homepage (intro + journey explorer)
- 🏷️ Tag browser + detail pages
- 🌀 Arc viewer (anchor image, intro, linked days)
- 📅 Day viewer (show `day.yaml` formatted as prayer page)
- 🛐 Search and discoverability UI (title, tags, reading sources)

### Future User Features

- 🔐 Account login (track progress, favorites, reading plans)
- 🧘 User meditation tracking (complete/skip/favorite)
- 🗂️ Downloadable meditations (PDF/ePub)
- 📥 Daily email option

---

## ☁️ Hosting & Deployment (AWS)

### Proposed Setup

- 🐳 Django backend via Docker (Fargate or EC2)
- 🎛️ PostgreSQL managed DB (RDS)
- 📁 Meditation YAMLs stored in S3
- 🌐 Vite/React frontend hosted via CloudFront + S3
- 🚦 Load balancer (ALB) for autoscaling
- 🧩 Optional: API Gateway for Lambda expansions

### Benefits

- ⚙️ Flexible autoscaling
- 🔒 IAM + permissioned user actions
- 💸 Cost-effective if set up smartly
- 🪵 GitHub Action → deploy to AWS pipeline

---

## 🧭 Next Phase Tasks (As of July 3)

### 💡 Meditation Expansion

- Arc 14: The Angelus → start YAMLs (7 days)
- Arc 15–16: Evangelical Counsels, Simplicity
- Review roadmap for new arc additions to Section 3

### 🎨 UX Design

- Begin **wireframe sketching** for:
  - Arc viewer
  - Day viewer
  - Tag drilldown
  - Mobile tag navigation
- Present options for layout aesthetics

### ⚙️ Backend

- Add `last_imported_at` metadata to arcs
- Improve schema validation error reporting

### 🔁 GitHub Integration

- Monitor for restored write access to repo
- If available:
  - Add pull request hooks
  - CI job for import + schema check + preview

---

## 🔁 Long-Term Goals

| Area               | Goal                                                                 |
| ------------------ | -------------------------------------------------------------------- |
| ✍️ Meditation Flow | Complete 1000+ day plan (50+ arcs), full spiritual journey           |
| 📚 Reading Plan     | YAML-based reading plan, linked to arcs                             |
| 📖 Book Library     | Book index with tags, arc links, themes, reading bundles            |
| 🧠 Theology Depth   | More Thomistic and Mystical arcs with rare saints and Church docs   |
| 🗂️ Search & Browse  | Smart tag search, reading-source cross-links, Feast Day filter      |
| 🌐 Public Site UX   | Full-featured frontend for users (web/mobile optimized)             |
