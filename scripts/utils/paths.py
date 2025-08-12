from pathlib import Path
import os

ENV = os.getenv('ENV', 'Local')
AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')
S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME', 'spiritual-formation-prod')

CHECKSUM_S3_KEY = os.getenv('CHECKSUM_S3_KEY', 'checksum/.mental_prayer_checksums.json')


if ENV in ('Prod', 'Staging'):
    # Keys inside the bucket (strings, not Paths)
    PROJECT_ROOT = Path("/app")
    # Single source of truth checksum lives in S3
    CHECKSUM_FILE = PROJECT_ROOT / CHECKSUM_S3_KEY
else:
    PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
    CHECKSUM_FILE = Path.home() / ".mental_prayer_checksums.json"

METADATA_DIR = PROJECT_ROOT / "metadata"
DAY_FILES_DIR = METADATA_DIR / "meditations"
ARC_TAGS_DIR = METADATA_DIR / "arc_tags"
ARC_METADATA_FILE = METADATA_DIR / "arc_metadata.yaml"
INDEX_FILE = METADATA_DIR / "_index_by_arc.yaml"
TAG_BANK_FILE = METADATA_DIR / "tag_bank.yaml"

SCHEMA_DIR = METADATA_DIR / "schemas"
ARC_METADATA_SCHEMA = SCHEMA_DIR / "arc_metadata_schema.yaml"
ARC_TAG_SCHEMA = SCHEMA_DIR / "arc_tag_schema.yaml"
DAY_SCHEMA = SCHEMA_DIR / "day_full_schema.yaml"

DJANGO_SETTINGS_MODULE = "config.settings"
