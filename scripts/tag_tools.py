"""
tag_tools.py

Unified Tag Management Utility for the Mental Prayer Project.

Features:
- Tag renaming
- Tag category movement
- Tag deletion
- Unused tag detection
- Usage reports
"""

import yaml
import re
from pathlib import Path
from collections import defaultdict
from abc import ABC, abstractmethod

PROJECT_ROOT = Path(__file__).parent.parent
TAG_BANK_PATH = PROJECT_ROOT / "metadata" / "tag_bank.yaml"
ARC_METADATA_PATH = PROJECT_ROOT / "metadata" / "arc_metadata.yaml"
ARC_TAGS_DIR = PROJECT_ROOT / "metadata" / "arc_tags"
MEDITATIONS_DIR = PROJECT_ROOT / "meditations"


class TagBank:
    """
    Manages the canonical tag bank YAML file, including loading, saving,
    and operations such as moving, deleting, and adding tags to categories.
    """
    def __init__(self, path: Path = TAG_BANK_PATH) -> None:
        """
        Initialize the TagBank and load tags from the YAML file.
        """
        self.path = path
        self.tags = {}
        self._load()

    def _load(self) -> None:
        """
        Load tags from the YAML file into the tags dictionary.
        Handles missing or malformed files gracefully.
        """
        try:
            with self.path.open() as f:
                data = yaml.safe_load(f)
                if not isinstance(data, dict):
                    raise ValueError(f"Tag bank YAML at {self.path} is not a dict.")
                self.tags = data
        except FileNotFoundError:
            print(f"Warning: Tag bank file {self.path} not found. Starting with empty tags.")
            self.tags = {}
        except Exception as e:
            print(f"Error loading tag bank: {e}")
            self.tags = {}

    def save(self) -> None:
        """
        Save the current tags dictionary back to the YAML file.
        """
        with self.path.open("w") as f:
            yaml.dump(self.tags, f, sort_keys=False)

    def return_all_tags(self) -> set:
        """
        Returns a set of all tags across all categories.
        """
        return {tag for tags in self.tags.values() for tag in tags}

    def move_tag(self, tag: str, from_category: str, to_category: str) -> None:
        """
        Move a tag from one category to another.
        """
        tag = tag.strip().lower()
        if tag in self.tags.get(from_category, []):
            self.tags[from_category].remove(tag)
            if tag not in self.tags.get(to_category, []):
                self.tags.setdefault(to_category, []).append(tag)

    def delete_tag(self, tag: str) -> None:
        """
        Delete a tag from all categories in the tag bank.
        """
        for cat in self.tags:
            if tag in self.tags[cat]:
                self.tags[cat].remove(tag)

    def add_tag(self, tag: str, category: str) -> None:
        """
        Add a tag to a specific category if not already present.
        """
        tag = tag.strip().lower()
        if tag not in self.tags.get(category, []):
            self.tags.setdefault(category, []).append(tag)


class TagFileHandler(ABC):
    """
    Abstract base class for tag file operations.
    Subclasses must implement update_tag for their file type.
    """
    @abstractmethod
    def update_tag(self, old: str, new: str) -> None:
        """
        Update occurrences of a tag from old to new in the file(s).
        """
        pass

    def delete_tag(self, tag: str) -> None:
        pass


class YamlTagFileHandler(TagFileHandler):
    """
    Handles updating tags in YAML files (e.g., arc_tags).
    """
    def __init__(self, files: list[Path]):
        """
        Initialize with a list of YAML file paths.
        """
        self.files = files

    def update_tag(self, old: str, new: str) -> None:
        """
        Replace occurrences of old tag with new tag in YAML files.
        """
        old, new = old.strip().lower(), new.strip().lower()
        changed = False
        for path in self.files:
            with open(path, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f)

            file_changed = False

            if isinstance(data, dict) and "tags" in data:
                tags = data["tags"]
                # Handle nested dict of tag categories
                if isinstance(tags, dict):
                    for category, tag_list in tags.items():
                        updated_list = [new if t == old else t for t in tag_list]
                        if updated_list != tag_list:
                            tags[category] = updated_list
                            file_changed = True
                # Handle flat list of tags
                elif isinstance(tags, list):
                    updated_list = [new if t == old else t for t in tags]
                    if updated_list != tags:
                        data["tags"] = updated_list
                        file_changed = True

            if file_changed:
                with open(path, "w", encoding="utf-8") as f:
                    yaml.safe_dump(data, f, sort_keys=False)
                changed = True

        return changed

    def delete_tag(self, tag: str) -> bool:
        tag = tag.strip().lower()
        changed = False
        for path in self.files:
            with open(path, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f)

            file_changed = False

            if isinstance(data, dict) and "tags" in data:
                tags = data["tags"]
                # Nested structure
                if isinstance(tags, dict):
                    for category, tag_list in tags.items():
                        updated_list = [t for t in tag_list if t != tag]
                        if updated_list != tag_list:
                            tags[category] = updated_list
                            file_changed = True
                # Flat structure
                elif isinstance(tags, list):
                    updated_list = [t for t in tags if t != tag]
                    if updated_list != tags:
                        data["tags"] = updated_list
                        file_changed = True

            if file_changed:
                with open(path, "w", encoding="utf-8") as f:
                    yaml.safe_dump(data, f, sort_keys=False)
                changed = True

        return changed


class MarkdownTagFileHandler(TagFileHandler):
    """
    Handles updating tags in Markdown files using HTML comment tag blocks.
    """
    def __init__(self, files):
        """
        Initialize with a list of Markdown file paths.
        """
        self.files = files

    def update_tag(self, old, new):
        """
        Replace occurrences of old tag with new tag in Markdown tag blocks.
        """
        for file_path in self.files:
            text = file_path.read_text()
            safe_old = re.escape(old)
            safe_new = re.escape(new)
            updated = re.sub(rf"(<!-- tags:.*?){safe_old}", rf"\1{safe_new}", text)
            if updated != text:
                file_path.write_text(updated)

    def delete_tag(self, tag: str) -> None:
        """
        Delete a tag by replacing it with an empty string.
        """
        self.update_tag(tag, "")


class TagSynchronizer:
    """
    Coordinates tag updates and deletions across multiple file handlers.
    """
    def __init__(self, handlers):
        """
        Initialize with a list of TagFileHandler instances.
        """
        self.handlers = handlers

    def update_tag(self, old, new):
        """
        Update a tag across all registered handlers.
        """
        for handler in self.handlers:
            handler.update_tag(old, new)

    def delete_tag(self, tag):
        """
        Delete a tag across all registered handlers.
        """
        for handler in self.handlers:
            handler.delete_tag(tag)


class TagScanner:
    """
    Scans project files to find used tags, unused tags, and generate usage reports.
    """
    def __init__(self, tagbank):
        """
        Initialize with a TagBank instance.
        """
        self.tagbank = tagbank

    def get_all_used_tags(self):
        """
        Collect all tags currently used in arc_tags, arc_metadata, and meditations.
        Returns a set of used tags.
        """
        used = set()

        # arc_tags
        for file in ARC_TAGS_DIR.glob("*.yaml"):
            with file.open() as f:
                arc_data = yaml.safe_load(f)
                for tag_list in arc_data.get("tags", {}).values():
                    used.update(tag_list)

        # arc_metadata
        with ARC_METADATA_PATH.open() as f:
            meta = yaml.safe_load(f)
            if not meta:
                meta = []
            for arc in meta:
                used.update(arc.get("tags", []))

        # meditations
        for file in MEDITATIONS_DIR.glob("*.md"):
            text = file.read_text()
            match = re.search(r"<!-- tags: \[(.*?)\] -->", text)
            if match:
                used.update(tag.strip() for tag in match.group(1).split(","))

        return used

    def find_unused_tags(self) -> list[tuple[str, str]]:
        """
        Return a list of (category, tag) tuples for tags in the tag bank
        that are not used anywhere in the project.
        """
        used = self.get_all_used_tags()
        unused = []
        for cat, tags in self.tagbank.tags.items():
            for tag in tags:
                if tag not in used:
                    unused.append((cat, tag))
        return unused

    def generate_usage_report(self) -> dict[str, int]:
        """
        Generate a report of tag usage counts across all sources.
        Returns a dictionary mapping tag to usage count, sorted by count.
        """
        used = self.get_all_used_tags()
        usage = defaultdict(int)

        for tag in used:
            usage[tag] = 0

        # arc_tags
        for file in ARC_TAGS_DIR.glob("*.yaml"):
            with file.open() as f:
                arc_data = yaml.safe_load(f)
                for tag_list in arc_data.get("tags", {}).values():
                    for tag in tag_list:
                        if tag in usage:
                            usage[tag] += 1

        # arc_metadata
        with ARC_METADATA_PATH.open() as f:
            meta = yaml.safe_load(f)
            for arc in meta:
                for tag in arc.get("tags", []):
                    if tag in usage:
                        usage[tag] += 1

        # meditations
        for file in MEDITATIONS_DIR.glob("*.md"):
            text = file.read_text()
            match = re.search(r"<!-- tags: \[(.*?)\] -->", text)
            if match:
                for tag in match.group(1).split(","):
                    tag = tag.strip()
                    if tag in usage:
                        usage[tag] += 1

        return dict(sorted(usage.items(), key=lambda x: x[1], reverse=True))
