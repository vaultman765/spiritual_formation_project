# ✅ MENTAL PRAYER PROJECT — MASTER PRIORITY WORK ORDER (Updated July 2, 2025)

---

## 🔄 ACTIVE WORKFLOWS

These tools are complete and in daily use:

- ✅ **YAML → Metadata Builder**: `build_arc_metadata_and_tags.py`
- ✅ **Full Metadata Validator**: `validate_metadata.py`
- ✅ **Arc Import Wrapper**: `build_and_import_arc.py`
- ✅ **GitHub Actions (all enforce failures)**:
  - `metadata-validate.yml`
  - `yaml-lint.yml`
  - `python-lint.yml`
- ✅ **Schemas Completed**:
  - `day_full_schema.yaml`
  - `arc_metadata_schema.yaml`
  - `arc_tag_schema.yaml`
- ✅ **Validator Tests**: `test_validate_metadata.py` with mocking + edge case handling

---

## 🧱 COMPLETED MILESTONES

- ✅ Arc YAML migration for:
  - Love of God
  - Love of Neighbor
  - Holy Fear of the Lord
  - Passion of Christ
  - Litany of the Sacred Heart
  - Sin, Mercy, and Conversion
  - Christ our High Priest
  - Heaven and Judgment
  - Immaculate Heart of Mary
  - Rosary – Joyful Mysteries

- ✅ All tags canonicalized in `tag_bank.yaml`
- ✅ All arc metadata centralized in `arc_metadata.yaml`
- ✅ Frontend: ArcTagsOverview functional and live
- ✅ Frontend: Arc metadata API working
- ✅ Tier 1 Reading Plan written
- ✅ Theme Roadmap finalized (Sections 1–3 aligned)
- ✅ DayListViewer click routing to DayDetailPage complete
- ✅ DayDetailPage full layout/styling/polish complete

---

## 🔥 HIGH PRIORITY NEXT STEPS (JULY 2–7)

### ✅ Active Focus Areas

- [x] 📘 Arc 10 YAMLs: Rosary – Joyful Mysteries (Days 78–84) — **Complete**

- [ ] 🧭 Section 3 Planning (Arcs 46–55) — **Resume Sunday**

- [ ] 💻 Backend + Frontend API Pipeline
  - [x] Arc metadata list endpoint (`/api/arcs/`)
  - [x] Arc detail endpoint (`/api/arcs/<arc_id>/`)
  - [x] Arc tag overview endpoint (`/api/arc-tags/overview/`)
  - [x] Meditation detail API (`/api/days/<day_number>/`)
  - [ ] Tag cloud endpoint (`/api/tag-cloud/`) — **Planned Friday**
  - [ ] Reading Plan metadata API — **Planned Sunday**

- [ ] 🧱 Admin + ER Diagram
  - Scaffold admin backend
  - Create visual model for project structure

- [ ] 🧩 React UI Development
  - [x] ArcTagsOverview component live
  - [x] DayDetailPage fully styled + connected
  - [x] Day click in DayListViewer routes to detail view
  - [ ] ArcTagViewer: filtering, style upgrades — **Planned Tuesday**
  - [ ] ArcMetadataOverview component — **Planned Tuesday**
  - [ ] Navbar + routing polish — **Planned Friday**

---

## 🛠️ TECHNICAL PRIORITIES + TOOLING

- [ ] `--dry-run` flag for `build_and_import_arc.py` — **Planned Wednesday**
- [ ] Checksum or timestamp skipping logic — **Planned Wednesday**
- [ ] CLI: tag fixer / renamer tool — **Planned Tuesday**
- [ ] CLI: validate `_index_by_arc.yaml` + tag sync — **Planned Thursday**
- [ ] CLI: delete arc or arc tags from DB (admin only)
- [ ] Expand test suite coverage
- [ ] Refactor CLI modules for better reuse

---

## 🧘 MEDITATION CONTENT PROGRESS

- ✅ Arc 10 complete (Rosary – Joyful Mysteries)
- [ ] Arc 11: Rosary – Sorrowful Mysteries — **Begin Wednesday**
- [ ] Continue YAML generation for all planned arcs (target 1000+ days)
- [ ] Integrate `meditations_index.yaml` auto-updates (Friday or Sunday)

---

## 📚 READING PLAN PROGRESS

- [ ] Add *Jesus of Nazareth* trilogy to plan — **Planned Thursday**
- [ ] Add *Intro to the Devout Life* with companion arcs — **Planned Thursday**
- [ ] Start `book_tag_map.yaml` to link books ↔ tags — **Planned Thursday/Friday**
- [ ] Add CLI: `link_books_to_arcs.py`

---

## 🖼️ DESIGN + UX WORKFLOWS

- ✅ Tailwind working with Vite + TSX layout
- ✅ DayDetailPage layout + spacing polished
- ✅ Tags render cleanly in both list + detail views
- [ ] Responsive tweaks for small screens — **Planned Friday**
- [ ] Arc metadata + DayList TOC layout — **Planned Friday/Saturday**

---

## 🧭 LONG-TERM + WEBSITE ROADMAP

- [ ] `meditations_index.yaml` generator (per-day index) — **Planned Friday**
- [ ] Auto-link arcs ↔ books — **Planned over weekend**
- [ ] Liturgical calendar support (seasonal search)
- [ ] Full frontend data model (tags, arcs, readings, search)
- [ ] Finalize Django models for long-term site launch

---

## 💤 DEFERRED / FUTURE IDEAS

- ❌ Markdown generator (`generate_md_from_yaml.py`) — not needed
- ❌ Markdown SMPF validator — not needed
- 📱 Mobile app (distant future)
- 🧠 NLP-based tag suggestions (v2)
- 🗺️ Spiritual “journey map” by tag profile
- 💡 VSCode YAML helpers or snippets

---

## 📆 WEEKLY EXECUTION PLAN (JULY 2–7)

### ✅ Tuesday (July 2)

- [x] Tailwind bug fixed, styles working
- [x] DayDetailPage polish complete
- [x] DayListViewer → DayDetail click routing
- [ ] ArcTagViewer UI filtering + hover polish
- [ ] CLI tool: `rename_tag.py`
- [ ] Refactor: `check_arc_tags.py`

### 🔁 Wednesday (July 3)

- [ ] YAML generation for Arc 11 (Rosary – Sorrowful Mysteries)
- [ ] Add 3+ YAML days, validate with schema
- [ ] Patch `meditations_index.yaml`
- [ ] Add `--dry-run` and checksum skip to import scripts

### 📚 Thursday (July 4)

- [ ] Add 2+ books to reading plan with metadata
- [ ] Add companion arcs + tag map
- [ ] Create initial `book_tag_map.yaml`

### 💻 Friday (July 5)

- [ ] `api/tag-cloud/` endpoint
- [ ] Polish responsive layout for day + list views
- [ ] Add basic ArcBrowser layout (arc_title, days, tags)

### 📐 Saturday (July 6)

- [ ] Refactor scripts for modular CLI
- [ ] Add `delete_arc.py` CLI
- [ ] Start GitHub Action for tag format enforcement

### 🧭 Sunday (July 7)

- [ ] Resume Section 3 planning (Arcs 46–55)
- [ ] Add missing arcs to roadmap
- [ ] Add reading → arc links
- [ ] Begin frontend Arc overview page

---

*Praise be to Jesus and Mary.*
