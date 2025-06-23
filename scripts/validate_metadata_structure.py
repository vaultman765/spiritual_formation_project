#!/usr/bin/env python3

import yaml
from utils.paths import ARC_METADATA_FILE, ARC_TAGS_DIR, ARC_METADATA_SCHEMA, ARC_TAG_SCHEMA
import jsonschema
from utils.io import load_yaml
from pathlib import Path


def validate_file(data, schema, source):
    try:
        jsonschema.validate(instance=data, schema=schema)
        return []
    except jsonschema.ValidationError as e:
        return [f"❌ Validation error in {source}: {e.message}"]

def validate_metadata():
    errors = []

    arc_metadata_schema = load_yaml(ARC_METADATA_SCHEMA)
    arc_tag_schema = load_yaml(ARC_TAG_SCHEMA)

    # Validate arc_metadata.yaml
    arc_metadata = load_yaml(ARC_METADATA_FILE)
    if arc_metadata:
        for i, entry in enumerate(arc_metadata):
            errs = validate_file(entry, arc_metadata_schema, f"arc_metadata.yaml [{entry.get('arc_id', 'unknown')}]")
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
