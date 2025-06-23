from pathlib import Path

# Project structure
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

METADATA_DIR = PROJECT_ROOT / "metadata"
DAY_FILES_DIR = METADATA_DIR / "meditations"
ARC_TAGS_DIR = METADATA_DIR / "arc_tags"
ARC_METADATA_FILE = METADATA_DIR / "arc_metadata.yaml"
INDEX_FILE = METADATA_DIR / "_index_by_arc.yaml"
TAG_BANK_FILE = METADATA_DIR / "tag_bank.yaml"

SCHEMA_DIR = PROJECT_ROOT / "schema"
ARC_METADATA_SCHEMA = SCHEMA_DIR / "arc_metadata_schema.yaml"
ARC_TAG_SCHEMA = SCHEMA_DIR / "arc_tag_schema.yaml"
