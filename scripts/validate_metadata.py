#!/usr/bin/env python3

import sys
from pathlib import Path
from typing import List, Dict, Any
import jsonschema

from utils.io import load_yaml
from utils.paths import (
    ARC_METADATA_FILE, ARC_TAGS_DIR, DAY_FILES_DIR, TAG_BANK_FILE,
    ARC_METADATA_SCHEMA, ARC_TAG_SCHEMA, DAY_SCHEMA
)
from utils.constants import TAG_CATEGORIES

class SchemaValidator:
    def __init__(self):
        self.arc_metadata_schema = load_yaml(ARC_METADATA_SCHEMA)
        self.arc_tag_schema = load_yaml(ARC_TAG_SCHEMA)
        self.day_schema = load_yaml(DAY_SCHEMA)

    def validate(self, data: Any, schema: Dict, source: str) -> List[str]:
        try:
            jsonschema.validate(instance=data, schema=schema)
            return []
        except jsonschema.ValidationError as e:
            return [f"❌ Validation error in {source}: {e.message}"]

class TagValidator:
    def __init__(self):
        self.tag_bank = load_yaml(TAG_BANK_FILE)
        self.valid_tags = set()
        for category in TAG_CATEGORIES:
            self.valid_tags.update(self.tag_bank.get(category, []))

    def validate_tags(self, tag_list: List[str], source: str) -> List[str]:
        errors = []
        for tag in tag_list:
            if tag not in self.valid_tags:
                errors.append(f"❌ Invalid tag in {source}: '{tag}' not in tag_bank")
        return errors

class CrossValidator:
    def __init__(self, arc_metadata: List[Dict[str, Any]], arc_tag_files: List[Path], day_files: List[Path]):
        self.arc_metadata = arc_metadata
        self.arc_tag_files = arc_tag_files
        self.day_files = day_files

    def validate(self) -> List[str]:
        errors = []
        # Build lookups
        metadata_arcs = {arc["arc_id"]: arc for arc in self.arc_metadata}
        arc_tags_arcs = {p.stem.replace("_tags", ""): load_yaml(p) for p in self.arc_tag_files}
        day_arc_ids = set(load_yaml(f).get("arc_id") for f in self.day_files if load_yaml(f))

        # Check 1: Arc ID consistency
        for arc_id in metadata_arcs:
            if arc_id not in arc_tags_arcs:
                errors.append(f"❌ Arc ID '{arc_id}' in arc_metadata.yaml not found in arc_tags/*.yaml")

        for arc_id in arc_tags_arcs:
            if arc_id not in metadata_arcs:
                errors.append(f"❌ Arc ID '{arc_id}' in arc_tags/*.yaml not found in arc_metadata.yaml")

        for arc_id in day_arc_ids:
            if arc_id and arc_id not in metadata_arcs:
                errors.append(f"❌ Arc ID '{arc_id}' in day_XXXX.yaml not found in arc_metadata.yaml")

        return errors

class MetadataValidator:
    def __init__(self):
        self.schema_validator = SchemaValidator()
        self.tag_validator = TagValidator()

    def run(self) -> None:
        errors = []

        arc_metadata = load_yaml(ARC_METADATA_FILE)
        arc_tag_files = list(ARC_TAGS_DIR.glob("*.yaml"))
        day_files = list(DAY_FILES_DIR.glob("day_*.yaml"))

        # === Schema Validation ===
        for i, arc in enumerate(arc_metadata):
            errors.extend(self.schema_validator.validate(arc, self.schema_validator.arc_metadata_schema, f"arc_metadata.yaml [{arc.get('arc_id', 'unknown')}]"))
        for tag_file in arc_tag_files:
            data = load_yaml(tag_file)
            if data:
                for category in TAG_CATEGORIES:
                    tag_list = data.get("tags", {}).get(category) or []
                    errors.extend(self.tag_validator.validate_tags(tag_list, tag_file.name))
        for day_file in day_files:
            data = load_yaml(day_file)
            if data:
                for category in TAG_CATEGORIES:
                    tag_list = data.get("tags", {}).get(category) or []
                    errors.extend(self.tag_validator.validate_tags(tag_list, day_file.name))

        # === Tag Validation ===
        for arc in arc_metadata:
            errors.extend(self.tag_validator.validate_tags(arc.get("tags", []), f"arc_metadata.yaml [{arc.get('arc_id')}]"))
        for tag_file in arc_tag_files:
            data = load_yaml(tag_file)
            if data:
                for category in TAG_CATEGORIES:
                    errors.extend(self.tag_validator.validate_tags(data.get("tags", {}).get(category) or [], tag_file.name))
        for day_file in day_files:
            data = load_yaml(day_file)
            if data:
                for category in TAG_CATEGORIES:
                    errors.extend(self.tag_validator.validate_tags(data.get("tags", {}).get(category) or [], day_file.name))

        # === Cross File Validation ===
        cross = CrossValidator(arc_metadata, arc_tag_files, day_files)
        errors.extend(cross.validate())

        # === Results ===
        if errors:
            print("\n".join(errors))
            print(f"❌ Metadata validation failed with {len(errors)} error(s).")
            sys.exit(1)
        else:
            print("✅ All metadata passed schema, tag, and integrity validation.")

if __name__ == "__main__":
    MetadataValidator().run()
