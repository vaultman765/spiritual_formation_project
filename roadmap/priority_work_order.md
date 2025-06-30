# ✅ MENTAL PRAYER PROJECT — MASTER PRIORITY WORK ORDER (2025-06 Update)

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

---

## 🔥 HIGH PRIORITY NEXT STEPS (Updated June 2025)

### ✅ Active Focus Areas

- [x] 📘 **Arc 10 YAMLs: Rosary – Joyful Mysteries (Days 78–84)**

- [ ] 🧭 **Section 3 Planning (Arcs 46–55)**
  - Planning in progress
  - Continue expanding roadmap organically

- [ ] 💻 **Backend + Frontend API Pipeline**
  - [x] Arc metadata list endpoint (`/api/arcs/`)
  - [x] Arc detail endpoint (`/api/arcs/<arc_id>/`)
  - [x] Arc tag overview endpoint (`/api/arc-tags/overview/`)
  - [ ] Meditation detail API (`/api/days/<day_number>/`)
  - [ ] Tag cloud endpoint (`/api/tag-cloud/`)
  - [ ] Reading Plan metadata API

- [ ] 🧱 **Admin + ER Diagram**
  - Scaffold admin backend
  - Create visual model for project structure

- [ ] 🧩 **React UI Development**
  - [x] ArcTagsOverview component live
  - [ ] ArcTagViewer: filtering, style upgrades
  - [ ] ArcMetadataOverview: wireframe + build
  - [ ] Meditation viewer UI (day page)
  - [ ] Navbar or sidebar scaffold
  - [ ] React routes for core pages

---

## 🛠️ TECHNICAL PRIORITIES + TOOLING

- [ ] `--dry-run` flag for `build_and_import_arc.py` ✅ *Planned Wednesday*
- [ ] Checksum or timestamp skipping logic in import scripts ✅ *Planned Wednesday*
- [ ] CLI tool: tag fixer + metadata generator (`--arc`, `--fix`, `--dry-run`)
- [ ] CLI: validate `_index_by_arc.yaml` + tag sync ✅ *Planned Thursday*
- [ ] CLI: delete arc or arc tags from DB (admin only)
- [ ] Expand test suite to include all major utilities
- [ ] Consolidate `pyproject.toml` to manage lint/CI/tools

---

## 🧘 MEDITATION CONTENT PROGRESS

- [x] Arc 10 complete (Rosary – Joyful Mysteries)
- [ ] Arc 11: Rosary – Sorrowful Mysteries (Begin Wednesday)
- [ ] YAML generation for all future arcs must be validated on creation
- [ ] Continue planning long-term arcs to reach 1000+ days

---

## 🖼️ DESIGN + UX WORKFLOWS

- [ ] Design aesthetic principles (monastic, timeless, clean)
- [ ] Tailwind styling setup in React
- [ ] UI Components: shadcn/ui + lucide-react
- [ ] Page templates:
  - Arc overview
  - Day meditation
  - Tag browse
  - Reading Plan landing
- [ ] Create mockups in `mockups/` folder
- [ ] Explore Figma or Excalidraw for visual drafts

---

## 🧭 LONG-TERM + WEBSITE ROADMAP

- [ ] `meditations_index.yaml` generator (per-day index)
- [ ] Auto-link arcs ↔ books
- [ ] Django model expansion (books, reading plan)
- [ ] Liturgical calendar + feast support
- [ ] Full frontend data model: filtering, navigation, linking

---

## 💤 DEFERRED / FUTURE IDEAS

- ❌ Markdown generator (`generate_md_from_yaml.py`) — not needed
- ❌ Markdown SMPF validator — not needed
- 📱 Mobile app (distant future)
- 🧠 NLP-based tag suggestions (v2)
- 🗺️ Spiritual “journey map” by tag profile
- 💡 VSCode YAML helpers or snippets

---

## 📆 WEEKLY EXECUTION PLAN (JUNE 30 – JULY 5)

### 🕊️ Sunday (June 30 – Tonight)

- ✅ Confirm Arc YAMLs are fully imported and UI visible
- ✅ Arc tag overview API + frontend tested
- ✅ Arc metadata list + detail APIs built
- ✅ Planning refresh for the week

---

### 🧠 Monday (July 1)

- 🧩 Build `api/tag-cloud/` endpoint
- 🧪 Confirm full arc sync logic is working for all arcs
- 🛠️ Design folder structure for `website/views/`
- 🪟 Scaffold basic React navigation bar

---

### ✨ Tuesday (July 2)

- 🎨 Refactor `ArcTagViewer` layout + polish tag styling
- 📊 Build `ArcMetadataOverview` frontend component
- 📚 Add 2 books to Tier 2 reading plan with metadata + roadmap tags

---

### 🔁 Wednesday (July 3)

- 🧪 Add `--dry-run` flag to `build_and_import_arc.py`
- 🔁 Begin checksum/timestamp skip logic for importers
- ✍️ Start YAML planning for Arc 11 (Rosary – Sorrowful Mysteries)

---

### 🚀 Thursday (July 4)

- 🧹 CLI: validate `_index_by_arc.yaml` + arc_tag mappings
- 🧼 CLI: delete arc or tags from DB
- 🧵 Confirm Django models cleanly support all planned UI

---

### 🧱 Friday (July 5)

- 🔐 Plan future frontend auth strategy
- 🧵 Build early concept UI for meditation list or search
- 🧪 Run full metadata validation + DB sync sweep for all arcs

---

*Praise be to Jesus and Mary.*
