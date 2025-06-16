import os
import sys
import yaml
from pathlib import Path

def load_yaml(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    except Exception as e:
        print(f"❌ Failed to load YAML file: {path}\n{e}")
        sys.exit(1)

def validate_tag(tag, canonical_tags):
    return tag.lower() in canonical_tags

def main():
    root = Path(".")
    metadata_path = "metadata/arc_metadata.yaml"
    tag_bank_path = "metadata/tag_bank.yaml"
    arc_tags_dir = "metadata/arc_tags"
    meditations_dir = "meditations"

    tag_bank = load_yaml(tag_bank_path)
    canonical_tags = {tag.lower() for tags in tag_bank.values() for tag in tags}

    arc_metadata = load_yaml(metadata_path)
    arc_tag_files = {f.stem.replace("arc_", ""): f for f in arc_tags_dir.glob("*.yaml")}

    errors = []

    # Validate arc_metadata ↔ arc_tags link and tag validity
    for arc in arc_metadata:
        arc_id = arc.get("arc_id")
        tags = arc.get("tags", [])

        if not arc_id:
            errors.append("❌ Missing arc_id in arc_metadata entry.")
            continue

        if arc_id not in arc_tag_files:
            errors.append(f"❌ No arc_tags file found for arc_id: {arc_id}")
            continue

        for tag in tags:
            if not validate_tag(tag, canonical_tags):
                errors.append(f"❌ Invalid tag in arc_metadata ({arc_id}): '{tag}'")

    # Validate arc_tags structure and tag values
    for arc_id, file_path in arc_tag_files.items():
        arc_data = load_yaml(file_path)
        if arc_data.get("arc_id") != arc_id:
            errors.append(f"❌ arc_id mismatch in {file_path.name} (expected '{arc_id}')")
        tag_blocks = arc_data.get("tags", {})
        for category, tags in tag_blocks.items():
            if not isinstance(tags, list):
                errors.append(f"❌ Invalid tag list for category '{category}' in {file_path.name}")
                continue
            for tag in tags:
                if not validate_tag(tag, canonical_tags):
                    errors.append(f"❌ Invalid tag in {file_path.name}: '{tag}'")

    # Validate meditation files
    for file in meditations_dir.glob("*.md"):
        with open(file, "r", encoding="utf-8") as f:
            content = f.read()

        if "tags:" not in content:
            errors.append(f"❌ Missing tag block in {file.name}")
            continue

        lines = content.splitlines()
        tag_lines = [line.strip() for line in lines if line.strip().startswith("-")]
        for tag in tag_lines:
            tag_clean = tag.strip("- ").lower()
            if not validate_tag(tag_clean, canonical_tags):
                errors.append(f"❌ Invalid tag in {file.name}: '{tag_clean}'")

    # Report results
    if errors:
        print("❌ Metadata Validation Failed! The following issues were found:")
        for err in errors:
            print("   -", err)
        sys.exit(1)
    else:
        print("✅ All metadata and tags are valid.")

if __name__ == "__main__":
    main()