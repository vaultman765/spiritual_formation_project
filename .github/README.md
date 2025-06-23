# 📁 GitHub Actions – Metadata Enforcement & Linting

This folder contains GitHub Actions that enforce formatting, metadata integrity, and style across the Mental Prayer Project.

All Actions run on **push** and **pull request**, and will **block merging** if any validation fails.

---

## ✅ Workflows

### 🧪 `metadata-validate.yml`

Runs `scripts/validate_metadata.py`, which performs full validation of:

- ✅ YAML schema (against `/schema/*.yaml`)
- ✅ Tag correctness (using `tag_bank.yaml`)
- ✅ Cross-file field consistency (`arc_id`, `arc_title`, `arc_number`)
- ✅ Day and arc integrity (`day_count`, duplicates, ordering, etc.)

**Failing this Action blocks the PR.**

---

### 🐍 `python-lint.yml`

Runs `flake8` on all Python code in `scripts/` and `tests/`. Ensures:

- Clean and consistent Python style
- No syntax errors or accidental complexity

Configuration is controlled via the root-level [`.flake8`](../.flake8) file.

---

### 📄 `yaml-lint.yml`

Uses `yamllint` to check for:

- Malformed YAML files
- Bad indentation
- Missing colons, trailing spaces, etc.

Settings are controlled via the root-level [`.yamllint.yaml`](../.yamllint.yaml) file.

---

## 🧰 Requirements

GitHub runners install dependencies from [`requirements.txt`](../requirements.txt), including:

- `pyyaml`
- `jsonschema`
- `flake8`
- `yamllint`

---

## 🔒 Lint + Validation = Safe Merges

These Actions protect the structure of the metadata system and ensure every contribution is valid, consistent, and doctrinally sound.

> “Let all things be done decently and in order.”  
> — *1 Corinthians 14:40*
