#!/usr/bin/env python3

import yaml
import jsonschema
from pathlib import Path

# === Paths ===
METADATA_DIR = Path("metadata")
SCHEMA_DIR = Path("schema")

ARC_METADATA_PATH = METADATA_DIR / "arc_metadata.yaml"
ARC_METADATA_SCHEMA_PATH = SCHEMA_DIR / "arc_metadata_schema.yaml"
ARC_TAGS_DIR = METADATA_DIR / "arc_tags"
ARC_TAG_SCHEMA_PATH = SCHEMA_DIR / "arc_tag_schema.yaml"

def load_yaml(path: Path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    except Exception as e:
        print(f"❌ Failed to load YAML from {path}: {e}")
        return None

def validate_file(data, schema, source):
    try:
        jsonschema.validate(instance=data, schema=schema)
        return []
    except jsonschema.ValidationError as e:
        return [f"❌ Validation error in {source}: {e.message}"]

def validate_metadata():
    errors = []

    arc_metadata_schema = load_yaml(ARC_METADATA_SCHEMA_PATH)
    arc_tag_schema = load_yaml(ARC_TAG_SCHEMA_PATH)

    # Validate arc_metadata.yaml
    arc_metadata = load_yaml(ARC_METADATA_PATH)
    if arc_metadata:
        for i, entry in enumerate(arc_metadata):
            errs = validate_file(entry, arc_metadata_schema[0], f"arc_metadata.yaml [{i}]")
            errors.extend(errs)

    # Validate each arc_tag YAML
    for tag_file in ARC_TAGS_DIR.glob("*.yaml"):
        data = load_yaml(tag_file)
        if data:
            errs = validate_file(data, arc_tag_schema, tag_file.name)
            errors.extend(errs)

    if errors:
        print("\n".join(errors))
        print(f"❌ Metadata validation failed with {len(errors)} error(s).")
        exit(1)
    else:
        print("✅ All metadata passed schema validation.")

if __name__ == "__main__":
    validate_metadata()
