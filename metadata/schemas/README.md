# 📁 /schema/ — Metadata Validation Schemas

This folder contains the canonical **JSON Schema files** that define and enforce the structure of all metadata files in
the Mental Prayer Project. These schemas are used for:

- ✅ Local validation
- ✅ GitHub Actions
- ✅ Automation and consistency enforcement
- ✅ Long-term project maintainability

---

## 📄 Included Schema Files

### `day_full_template_schema.yaml`

Validates all files in `/metadata/meditations/day_XXX.yaml`.

- Ensures proper structure for daily meditation files
- Enforces required fields like `master_day_number`, `anchor_image`, `colloquy`, `tags`, etc.
- Validates tag categories and reading structures
- Supports future automation and templating

### `arc_metadata_schema.yaml`

Validates the global arc metadata file `/metadata/arc_metadata.yaml`.

- Ensures correct arc identifiers and day ranges
- Defines structure for anchor images, primary readings, and arc-level tags
- Optional fields like `description` or `arc_status` can be added in the future

### `arc_tag_schema.yaml`

Validates each file in `/metadata/arc_tags/*.yaml`.

- Organizes tags by canonical category: `doctrinal`, `virtue`, `mystical`, etc.
- Ensures tag arrays are well-formed and match the current tag bank
- Enforces consistency with arc IDs and arc structure

---

## 🛠️ How to Use These Schemas

These files will be used by:

- Local scripts (`validate_metadata.py`, `build_arc_metadata.py`, etc.)
- GitHub Actions to block invalid pull requests
- Any automated tooling that reads or writes project metadata

They are tightly bound to:

- `tag_bank.yaml`
- The current structure of `day_000X.yaml` files
- The global arc YAML system

---

## 🧩 Adding New Schemas

Only add new schema files when new structured metadata types are introduced. Potential future additions might include:

- `tag_bank_schema.yaml` — to enforce tag structure rules
- `_index_by_arc_schema.yaml` — only if reintroduced in active tooling
