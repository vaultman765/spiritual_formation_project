# spiritual_formation_project

## 📁 `spiritual_formation_project/` – Master Directory Structure

This is the official structure for your spiritual formation project, optimized for meditation, reading, tagging, and future web deployment.

---

### 📂 Root Structure

```text
spiritual_formation_project/
├── meditations/                          # ✅ All finalized SMPF-formatted arcs
│   ├── arc_litany_sacred_heart.md
│   ├── arc_passion_of_christ.md
│   └── arc_<topic_name>.md
│
├── roadmap/                              # ✅ Master structure, arc metadata, rhythm mapping
│   ├── mental_prayer_theme_roadmap.md    # Source of truth for arc order + structure
│   ├── arc_metadata.json                 # (optional future format for dev use)
│   └── rhythm_map.md                     # (optional: “symphony”/spacing notes)
│
├── metadata/                             # ✅ Tags, schemas, classification logic
│   └── tag_bank.yaml                     # Master list of structured tags by category
│
├── reading_plan/                         # 📚 Full spiritual reading journey
│   ├── reading_plan_master_list.md       # Tiered must-read list + natural flow
│   ├── reading_plan_map.md               # Theme-tagged companion to roadmap
│   ├── reading_visual_tracker.png        # (Optional: progress image)
│   ├── tag_bank_reading.yaml             # (Optional: reading-specific tags)
│   └── sources/                          # Supporting material
│       ├── book_bundles_by_theme.md
│       └── resource_links.json
│
├── documents/                            # 🔍 Embedded PDF readings and fallback sources
│   ├── readings/                         # PDFs of key secondary readings used in meditations
│   │   ├── st_augustine_city_of_god_xvii.pdf
│   │   ├── st_john_chrysostom_homily_on_baptism.pdf
│   │   └── ...
│   ├── encyclicals/                      # Papal encyclicals for use in reading or prayer
│   └── patristic_sources/                # Church Fathers PDFs or excerpts
│
├── source_plan/                          # 🗂️ Full raw archive of every daily entry
│   └── working_mental_prayer_plan.md     # All meditations, past and current
│
├── archive/                              # 🗔️ Non-final or temporary files
│   └── Partials - Waiting to Combine/    # In-progress meditations or drafts
│
├── config/                               # ⚙️ Dev + formatting tools
```

---

### ✅ Notes

- **`meditations/`** – Each file is one complete arc, SMPF-formatted, tagged, and named `arc_<theme>.md`.
- **`roadmap/`** – The planning and rhythm space; never store meditation content here.
- **`metadata/`** – Central source of truth for tags, schemas, or future relational logic.
- **`reading_plan/`** – Parallel formation path with book lists, flow, and resources.
- **`source_plan/`** – Master archive of every meditation ever created.
- **`archive/`** – Non-final drafts or in-progress files to keep workspace clean.
- **`config/`** – Editor settings, linters, and future dev configs.

This structure is designed to last for 1000+ days of content and full modular site export in the future.
