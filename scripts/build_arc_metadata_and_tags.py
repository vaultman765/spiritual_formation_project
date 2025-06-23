#!/usr/bin/env python3

"""
CLI Tool: build_arc_metadata_and_tags.py

Usage:
    python build_arc_metadata_and_tags.py metadata
    python build_arc_metadata_and_tags.py tags
    python build_arc_metadata_and_tags.py all
    python build_arc_metadata_and_tags.py metadata --arc arc_love_of_god arc_passion_of_christ
"""

import argparse
import yaml
from pathlib import Path
from typing import Any, Dict, List, Optional

# === Constants ===
METADATA_DIR = Path("metadata")
DAY_FILES_DIR = METADATA_DIR / "meditations"
TAGS_DIR = METADATA_DIR / "arc_tags"
INDEX_FILE = METADATA_DIR / "_index_by_arc.yaml"
TAG_BANK_FILE = METADATA_DIR / "tag_bank.yaml"
ARC_METADATA_FILE = METADATA_DIR / "arc_metadata.yaml"

TAG_CATEGORIES = [
    "thematic", "doctrinal", "virtue", "mystical", "liturgical", "typological", "structural"
]

# === Utilities ===

def load_yaml(file_path: Path) -> Any:
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return None
    except yaml.YAMLError as e:
        print(f"YAML error in {file_path}: {e}")
        return None

def write_yaml(file_path: Path, data: Any, mode: str = 'w') -> None:
    with open(file_path, mode, encoding="utf-8") as f:
        yaml.dump(data, f, sort_keys=False, allow_unicode=True)

# === Shared Data Loader ===

class ArcDataLoader:
    """Loads day data for arcs from index."""
    def __init__(self, index_data: Dict[str, Any]):
        self.index_data = index_data

    def load_arc_day_data(self, arc_ids: Optional[List[str]] = None) -> Dict[str, List[Dict[str, Any]]]:
        arc_to_days = {}
        for arc_id, arc_info in self.index_data.items():
            if arc_ids and arc_id not in arc_ids:
                continue
            arc_days = []
            for i in range(arc_info["start_day"], arc_info["end_day"] + 1):
                day_file = DAY_FILES_DIR / f"day_{i:04d}.yaml"
                day_data = load_yaml(day_file)
                if day_data:
                    arc_days.append(day_data)
            arc_to_days[arc_id] = arc_days
        return arc_to_days

# === Core Generators ===

class ArcMetadataGenerator:
    """Generates arc_metadata.yaml, updating or overwriting as needed."""    
    def __init__(self, index_data: Dict[str, Any]):
        self.index_data = index_data

    def generate(self, arc_ids: Optional[List[str]] = None) -> None:
        loader = ArcDataLoader(self.index_data)
        arc_data = loader.load_arc_day_data(arc_ids=arc_ids)

        # If generating for all arcs, overwrite the file
        if arc_ids is None or set(arc_ids) == set(self.index_data.keys()):
            arc_metadata = []
        else:
            # Load existing metadata and filter out arcs being updated
            arc_metadata = load_yaml(ARC_METADATA_FILE) or []
            arc_metadata = [entry for entry in arc_metadata if entry["arc_id"] not in arc_data]

        # Add/replace metadata for selected arcs
        for arc_id, arc_days in arc_data.items():
            if not arc_days:
                continue
            first_day = arc_days[0]
            metadata_entry = {
                "arc_id": arc_id,
                "arc_title": first_day.get("arc_title", ""),
                "arc_number": first_day.get("arc_number", ""),
                "day_count": len(arc_days),
                "master_day_range": {
                    "start": first_day.get("master_day_number"),
                    "end": arc_days[-1].get("master_day_number")
                },
                "anchor_image": sorted({day.get("anchor_image", "") for day in arc_days}),
                "primary_reading": sorted({day.get("primary_reading", {}).get("title", "") for day in arc_days}),
                "tags": sorted({
                    tag
                    for day in arc_days
                    for category in (day.get("tags") or {}).values()
                    if category
                    for tag in category
                })
            }
            arc_metadata.append(metadata_entry)

        write_yaml(ARC_METADATA_FILE, arc_metadata, mode='w')

class ArcTagGenerator:
    """Generates arc_tags/*.yaml files for each arc."""
    def __init__(self, index_data: Dict[str, Any], tag_bank: Dict[str, Any]):
        self.index_data = index_data
        self.tag_bank = tag_bank

    def generate(self, arc_ids: Optional[List[str]] = None) -> None:
        loader = ArcDataLoader(self.index_data)
        arc_data = loader.load_arc_day_data(arc_ids=arc_ids)

        TAGS_DIR.mkdir(parents=True, exist_ok=True)

        for arc_id, arc_days in arc_data.items():
            if not arc_days:
                continue
            first_day = arc_days[0]
            tag_dict = {category: set() for category in TAG_CATEGORIES}
            for day in arc_days:
                tags = day.get("tags") or {}
                for category, tag_list in tags.items():
                    if tag_list is None:
                        continue
                    if category in self.tag_bank:
                        for tag in tag_list:
                            if tag in self.tag_bank[category]:
                                tag_dict[category].add(tag)

            tag_file = TAGS_DIR / f"{arc_id}_tags.yaml"
            tag_yaml = {
                "arc_id": arc_id,
                "arc_title": first_day.get("arc_title", ""),
                "arc_number": first_day.get("arc_number", ""),
                "day_count": len(arc_days),
                "master_day_range": {
                    "start": first_day.get("master_day_number"),
                    "end": arc_days[-1].get("master_day_number")
                },
                "tags": {k: sorted(list(tag_dict[k])) for k in TAG_CATEGORIES}
            }
            write_yaml(tag_file, tag_yaml)

# === CLI Entrypoint ===

class ArcMetadataCLI:
    """Command-line interface for generating arc metadata and tags."""
    def __init__(self):
        self.index_data = load_yaml(INDEX_FILE) or {}
        self.tag_bank = load_yaml(TAG_BANK_FILE) or {}

    def run(self) -> None:
        parser = argparse.ArgumentParser(description="Generate arc_metadata and arc_tags from day files.")
        parser.add_argument("mode", choices=["metadata", "tags", "both"], help="What to generate.")
        parser.add_argument("--arc", nargs="+", help="Limit to specific arc_ids")
        args = parser.parse_args()
        
        # Validate arc_ids
        arc_ids = None
        if args.arc:
            invalid = [arc for arc in args.arc if arc not in self.index_data]
            if invalid:
                print(f"Invalid arc_ids: {invalid}")
                return
            arc_ids = args.arc

        if args.mode in ["metadata", "both"]:
            print("Generating arc_metadata.yaml...")
            ArcMetadataGenerator(self.index_data).generate(arc_ids=arc_ids)

        if args.mode in ["tags", "both"]:
            print("Generating arc_tags/*.yaml...")
            ArcTagGenerator(self.index_data, self.tag_bank).generate(arc_ids=arc_ids)

if __name__ == "__main__":
    ArcMetadataCLI().run()
