#!/usr/bin/env python3

import sys
from pathlib import Path
from typing import List, Dict, Any, Set
import jsonschema
from collections import defaultdict

from scripts.utils.io import load_yaml
from scripts.utils.paths import (
    ARC_METADATA_FILE, ARC_TAGS_DIR, DAY_FILES_DIR, TAG_BANK_FILE,
    ARC_METADATA_SCHEMA, ARC_TAG_SCHEMA, DAY_SCHEMA
)
from scripts.utils.constants import TAG_CATEGORIES


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
            return [f"❌ Schema error in {source}: {e.message}"]


class TagValidator:
    def __init__(self):
        self.tag_bank = load_yaml(TAG_BANK_FILE)
        self.valid_tags = set()
        for category in TAG_CATEGORIES:
            self.valid_tags.update(self.tag_bank.get(category, []))

    def validate_tags(self, tag_list: List[str], source: str) -> List[str]:
        errors = []
        seen = set()
        for tag in tag_list:
            if tag in seen:
                errors.append(f"❌ Duplicate tag '{tag}' in {source}")
            elif tag not in self.valid_tags:
                errors.append(f"❌ Invalid tag in {source}: '{tag}' not in tag_bank")
            seen.add(tag)
        return errors


class CrossValidator:
    def __init__(self, arc_metadata: List[Dict[str, Any]], arc_tag_files: List[Path], day_files: List[Path]):
        self.arc_metadata = arc_metadata
        self.arc_tag_data = {p.stem.replace("_tags", ""): load_yaml(p) for p in arc_tag_files}
        self.day_data = {f.name: load_yaml(f) for f in day_files}


    def validate(self) -> List[str]:
        errors = []
        errors.extend(self._check_arc_tag_consistency())
        errors.extend(self._check_day_arc_consistency())
        errors.extend(self._check_title_and_number_consistency())
        return errors

    def _check_arc_tag_consistency(self) -> List[str]:
        """Check that every arc in metadata has a tag file and vice versa."""
        errors = []
        metadata_arcs = {arc["arc_id"] for arc in self.arc_metadata}
        tag_arcs = set(self.arc_tag_data.keys())

        for arc_id in metadata_arcs - tag_arcs:
            errors.append(f"❌ Arc ID '{arc_id}' in arc_metadata.yaml not found in arc_tags/*.yaml")
        for arc_id in tag_arcs - metadata_arcs:
            errors.append(f"❌ Arc ID '{arc_id}' in arc_tags/*.yaml not found in arc_metadata.yaml")
        return errors

    def _check_day_arc_consistency(self) -> List[str]:
        """Check that every arc_id in day files exists in arc_metadata."""
        errors = []
        metadata_arcs = {arc["arc_id"] for arc in self.arc_metadata}
        for fname, data in self.day_data.items():
            arc_id = data.get("arc_id")
            if arc_id and arc_id not in metadata_arcs:
                errors.append(f"❌ Arc ID '{arc_id}' in {fname} not found in arc_metadata.yaml")
        return errors

    def _check_title_and_number_consistency(self) -> List[str]:
        """Check arc_title and arc_number consistency across metadata, tag files, and day files."""
        errors = []
        metadata_arcs = {arc["arc_id"]: arc for arc in self.arc_metadata}
        for arc_id, arc_meta in metadata_arcs.items():
            meta_title = arc_meta["arc_title"]
            meta_number = arc_meta["arc_number"]
            # Check arc_tags
            tag_data = self.arc_tag_data.get(arc_id)
            if tag_data:
                if tag_data.get("arc_title") != meta_title:
                    errors.append(f"❌ arc_title mismatch for {arc_id} in arc_tags/*.yaml")
                if tag_data.get("arc_number") != meta_number:
                    errors.append(f"❌ arc_number mismatch for {arc_id} in arc_tags/*.yaml")
            # Check day files
            for fname, data in self.day_data.items():
                if data.get("arc_id") == arc_id:
                    if data.get("arc_title") != meta_title:
                        errors.append(f"❌ arc_title mismatch in {fname} (expected: {meta_title})")
                    if data.get("arc_number") != meta_number:
                        errors.append(f"❌ arc_number mismatch in {fname} (expected: {meta_number})")
        return errors


class IntegrityValidator:
    def __init__(self, arc_metadata: List[Dict[str, Any]], arc_tag_files: List[Path], day_files: List[Path]):
        self.arc_metadata = arc_metadata
        self.arc_tag_files = arc_tag_files
        self.day_files = day_files
        self.arc_tag_data = {p.stem.replace("_tags", ""): load_yaml(p) for p in arc_tag_files}
        self.day_data = {int(f.name[4:8]): load_yaml(f) for f in day_files}

    def validate(self) -> List[str]:
        errors = []
        seen_master = set()
        arc_day_seen = defaultdict(set)

        for num, data in self.day_data.items():
            if num != data.get("master_day_number"):
                errors.append(f"❌ File day_{num:04d}.yaml has mismatched master_day_number: {data.get('master_day_number')}")
            if num in seen_master:
                errors.append(f"❌ Duplicate master_day_number {num}")
            seen_master.add(num)

            arc_id = data.get("arc_id")
            arc_day = data.get("arc_day_number")
            if arc_day in arc_day_seen[arc_id]:
                errors.append(f"❌ Duplicate arc_day_number {arc_day} in arc '{arc_id}'")
            arc_day_seen[arc_id].add(arc_day)

        for arc in self.arc_metadata:
            arc_id = arc["arc_id"]
            arc_days = [d for d in self.day_data.values() if d.get("arc_id") == arc_id]
            count_check = len(arc_days)
            expected = arc["day_count"]
            range_check = arc["master_day_range"]["end"] - arc["master_day_range"]["start"] + 1

            if expected != range_check:
                errors.append(f"❌ day_count mismatch in {arc_id}: {expected} ≠ master_day_range length {range_check}")
            if expected != count_check:
                errors.append(f"❌ day_count mismatch in {arc_id}: {expected} ≠ actual files found {count_check}")

            # Optional: check anchor_image and primary_reading consistency if only one expected
            anchor_images = set(
                d.get("anchor_image")[0] if isinstance(d.get("anchor_image"), list) and d.get("anchor_image") else d.get("anchor_image")
                for d in arc_days
            )
            if len(anchor_images) == 1 and list(anchor_images)[0] != arc["anchor_image"][0]:
                errors.append(f"❌ anchor_image mismatch in {arc_id}")

            # Fix: extract a string for primary_reading
            def extract_primary_reading(val):
                if isinstance(val, list) and val:
                    item = val[0]
                    if isinstance(item, dict):
                        return item.get("title")
                    return item
                if isinstance(val, dict):
                    return val.get("title")
                return val

            primary_readings = set(
                extract_primary_reading(d.get("primary_reading"))
                for d in arc_days
            )
            expected_primary = extract_primary_reading(arc["primary_reading"])
            if len(primary_readings) == 1 and list(primary_readings)[0] != expected_primary:
                errors.append(f"❌ primary_reading mismatch in {arc_id}")

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

        for i, arc in enumerate(arc_metadata):
            errors.extend(self.schema_validator.validate(arc, self.schema_validator.arc_metadata_schema, f"arc_metadata.yaml [{i}]"))
        for tag_file in arc_tag_files:
            data = load_yaml(tag_file)
            if data:
                errors.extend(self.schema_validator.validate(data, self.schema_validator.arc_tag_schema, tag_file.name))
        for day_file in day_files:
            data = load_yaml(day_file)
            if data:
                errors.extend(self.schema_validator.validate(data, self.schema_validator.day_schema, day_file.name))

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

        cross = CrossValidator(arc_metadata, arc_tag_files, day_files)
        errors.extend(cross.validate())

        integrity = IntegrityValidator(arc_metadata, arc_tag_files, day_files)
        errors.extend(integrity.validate())

        if errors:
            print("\n".join(errors))
            print(f"❌ Metadata validation failed with {len(errors)} error(s).")
            sys.exit(1)
        else:
            print("✅ All metadata passed schema, tag, and integrity validation.")

if __name__ == "__main__":
    MetadataValidator().run()
