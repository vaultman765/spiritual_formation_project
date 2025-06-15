# Tag Format Checker – GitHub Action

This GitHub Action validates that all meditation files in `/meditations/` contain only approved tags as defined in your `tag_bank.yaml`.

## ✅ Features

- Scans all `.md` files in `/meditations/`
- Checks all tags inside `<!-- tags: ... -->` blocks
- Validates against the canonical tag bank
- Fails loudly if any tag is unrecognized

## 🛠 How to Use

1. Place `tag_bank.yaml` in your repository root
2. Ensure all meditation files use `<!-- tags: ... -->` format
3. Push changes or open a pull request — the action runs automatically!

## 🎯 Future Enhancements

- Pretty HTML output summary
- Auto-suggestion for mistyped tags
- Enforce presence of tag blocks on each day

Contact your assistant if you want advanced tag insights or index generation!
