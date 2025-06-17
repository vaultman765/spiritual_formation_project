import os
import re
import sys
import yaml
from abc import ABC, abstractmethod
from pathlib import Path
from collections import defaultdict
from typing import List, Set, Dict, Any

ROOT = Path(__file__).resolve().parent.parent
METADATA = ROOT / "metadata"
MEDITATIONS = ROOT / "meditations"

TAG_BANK_PATH = METADATA / "tag_bank.yaml"
ARC_METADATA_PATH = METADATA / "arc_metadata.yaml"
ARC_TAGS_DIR = METADATA / "arc_tags"
INDEX_PATH = METADATA / "meditations_index.yaml"


class MetadataLoader:
    @staticmethod
    def load_yaml(path: Path) -> Any:
        with open(path, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)

class MetadataChecker(ABC):
    @abstractmethod
    def check(self, errors: List[str]):
        pass

class TagValidator:
    def __init__(self, tag_bank: Dict[str, List[str]]):
        self.canonical = {t.lower() for tags in tag_bank.values() for t in tags}

    def validate_tags(self, used_tags: List[str], source: str, errors: List[str]):
        for tag in used_tags:
            if tag.lower() not in self.canonical:
                errors.append(f"[{source}] Invalid tag: {tag}")

class IndexChecker:
    def __init__(self, loader, tag_validator):
        self.loader = loader
        self.tag_validator = tag_validator

    def check(self, errors):
        index = self.loader.load_yaml(INDEX_PATH)
        arc_metadata = self.loader.load_yaml(ARC_METADATA_PATH)
        arc_ids = set(arc["arc_id"] for arc in arc_metadata)
        seen = set()
        files = set(f.name for f in MEDITATIONS.glob("*.md"))
        for entry in index:
            filename = entry.get("filename")
            arc_id = entry.get("arc_id")
            day = entry.get("day_within_arc")
            tags = entry.get("tags", [])
            if filename not in files:
                errors.append(f"[Index] Missing file: {filename}")
            if arc_id not in arc_ids:
                errors.append(f"[Index: {filename}] Invalid arc_id: {arc_id}")  # <-- This must be present
            self.tag_validator.validate_tags(tags, f"Index: {filename}", errors)
            key = (arc_id, day)
            if key in seen:
                errors.append(f"[Index] Duplicate day {day} in arc {arc_id}")
            seen.add(key)

class MeditationStructureChecker(MetadataChecker):
    def check(self, errors: List[str]):
        for file in MEDITATIONS.glob("*.md"):
            with file.open(encoding="utf-8") as f:
                content = f.read()
            if "## " not in content:
                errors.append(f"[Structure] Missing arc title (##) in {file.name}")
            if "### " not in content:
                errors.append(f"[Structure] No day sections (###) in {file.name}")

class ArcTagsChecker(MetadataChecker):
    def __init__(self, loader: MetadataLoader):
        self.loader = loader

    def check(self, errors: List[str]):
        arc_meta = self.loader.load_yaml(ARC_METADATA_PATH)
        arc_ids = {arc['arc_id'] for arc in arc_meta}
        tag_files = {f.stem.replace('_tags', '') for f in ARC_TAGS_DIR.glob("*.yaml")}
        missing = arc_ids - tag_files
        if missing:
            for arc_id in missing:
                errors.append(f"[Arc Tags] Missing arc_tags/{arc_id}_tags.yaml")

class TagUsageChecker(MetadataChecker):
    def __init__(self, loader: MetadataLoader, tag_validator: TagValidator):
        self.loader = loader
        self.tag_validator = tag_validator

    def check(self, errors: List[str]):
        # arc_metadata
        for arc in self.loader.load_yaml(ARC_METADATA_PATH):
            self.tag_validator.validate_tags(arc.get("tags", []), f"arc_metadata:{arc.get('arc_id')}", errors)
        # arc_tags
        for file in ARC_TAGS_DIR.glob("*.yaml"):
            data = self.loader.load_yaml(file)
            for tags in data.get("tags", {}).values():
                self.tag_validator.validate_tags(tags, f"arc_tags:{file.name}", errors)
        # meditations
        for file in MEDITATIONS.glob("*.md"):
            with open(file, 'r', encoding='utf-8') as f:
                content = f.read()
            match = re.search(r'<!--\s*tags:\s*(.*?)-->', content)
            if match:
                tag_line = match.group(1)
                tags = [t.strip().lower() for t in tag_line.split(",") if t.strip()]
                self.tag_validator.validate_tags(tags, f"meditations:{file.name}", errors)

class MetadataIntegrityChecker:
    def __init__(self):
        self.errors: List[str] = []
        self.loader = MetadataLoader()
        tag_bank = self.loader.load_yaml(TAG_BANK_PATH)
        self.tag_validator = TagValidator(tag_bank)
        self.checkers = [
            IndexChecker(self.loader, self.tag_validator),
            MeditationStructureChecker(),
            ArcTagsChecker(self.loader),
            TagUsageChecker(self.loader, self.tag_validator)
        ]

    def run_all(self) -> List[str]:
        for checker in self.checkers:
            checker.check(self.errors)
        return self.errors

    def report(self):
        if self.errors:
            print("❌ Metadata Validation Failed:")
            for err in self.errors:
                print(" -", err)
        else:
            print("✅ All metadata and tag checks passed.")

def main():
    checker = MetadataIntegrityChecker()
    errors = checker.run_all()
    checker.report()
    if errors:
        sys.exit(1)

if __name__ == "__main__":
    main()
