
# 🛠️ Project Infrastructure & Automation Roadmap

---

## ✅ SECTION 1: GitHub Actions – Current Status & Phases

### 🟢 Implemented:

- **Tag Format Checker** (`tag_format_check.yml`)
  - Scans `/meditations/` for invalid tags based on `tag_bank.yaml`
  - Fails on any unrecognized tag
  - Highlights issues in markdown context

### 🟡 In Progress:

- **Tag Auto-Fixer CLI Tool**
  - Maps old → new tags from `tag_bank_refactored.yaml`
  - Will update `.md` and `.yaml` files in-place (Phase 2)
  - CLI integration with logging and dry-run mode

- **Markdown Format Validator**
  - Ensure SMPF structure (Anchor → Reading → Meditations → Colloquy → Resolution)
  - Warn on missing or reordered elements

### 🔜 Planned:

- **Auto Index Builder**
  - Generates/updates `meditations_index.yaml` automatically from `.md` files
  - Validates day range, arc title, tags, and SMPF completeness

- **SMPF Template Enforcer**
  - Checks for valid heading levels, resolution section, and anchor metadata
  - Planned to enforce consistent daily prayer formatting

---

## 🧠 SECTION 2: Auto-Tag + Index Roadmap

### ✅ Canonical Tag Bank

- `tag_bank.yaml` finalized and now includes all emotional, doctrinal, mystical, seasonal, and virtue tags
- Refactoring complete (duplicates resolved, poetic simplifications applied)

### 🔄 In Progress:

- **Tag Update Script** (Phase 2)
  - Reads `tag_bank_refactored.yaml`
  - Applies tag mapping to all `.md` and `/metadata/arc_tags/*.yaml` files
  - Logs unmapped tags and diffs

- **Index Integration**
  - Plan to maintain:
    - `meditations_index.yaml` — per-day index
    - `arc_metadata.yaml` — arc-level summary
    - `arc_tags/*.yaml` — arc-level tags

---

## 📑 SECTION 3: YAML Validation Suite (Planned)

- Validate:
  - `arc_metadata.yaml` → required keys: `title`, `day_range`, `status`, etc.
  - `arc_tags/*.yaml` → correct structure and tag categories
  - `meditations_index.yaml` → correct linkages, tags, ranges
- Output pretty error messages in GitHub Actions CI
- Optional: convert to HTML-style log output

---

## 🌐 SECTION 4: Django / Website Planning

### 🧱 Foundation Plans:

- Django backend with:
  - Meditation model (title, body, tags, arc, day, readings, image ref, etc.)
  - Arc model (title, day range, category, liturgical tag, theme bundle, etc.)
  - Tag model (multi-type: doctrinal, emotional, virtue, etc.)

- Admin interface for:
  - Tag editing and mapping
  - Metadata override and manual adjustment

### 🔎 Navigation Goals:

- Thematic search (e.g., “suffering” → see all relevant days)
- Liturgical calendar integration
- Tag-based bundles (e.g., “Marian Path”, “Suffering & Trust”)

### 🧰 Developer Features:

- GitHub Action-triggered YAML validation and sync
- VSCode plugin integrations or CLI format checkers
- Long-term: CLI tool to scaffold new arc and meditations with template

---

## 🚀 SECTION 5: Immediate Next Steps

- [ ] Finish and test Tag Auto-Fixer (Phase 2)
- [ ] Implement Markdown Structure Validator
- [ ] Begin `meditations_index.yaml` population + script
- [ ] Prepare Django model prototype and schema proposal
- [ ] Sync roadmap status into project board view for visibility
