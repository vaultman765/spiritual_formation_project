
import hashlib
import json
from pathlib import Path
from scripts.utils.paths import CHECKSUM_FILE


def load_checksums():
    if CHECKSUM_FILE.exists():
        try:
            return json.loads(CHECKSUM_FILE.read_text())
        except json.JSONDecodeError:
            print("❌ Failed to load checksums. File might be corrupted.")
            return {}
    return {}


def save_checksums(updated):
    CHECKSUM_FILE.write_text(json.dumps(updated, indent=2))


def compute_checksum(path: Path):
    """Compute the checksum for a file, ignoring the sync comment."""
    hasher = hashlib.sha256()
    with open(path, "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f if not line.strip().startswith("# Last imported into DB")]
        content = "\n".join(lines).encode("utf-8")  # Normalize line endings
        hasher.update(content)
    return hasher.hexdigest()


def should_skip(path: Path, checksums: dict, skip_enabled: bool) -> bool:
    if not skip_enabled:
        return False

    current_checksum = compute_checksum(path)
    cached_checksum = checksums.get(path.name)

    if cached_checksum is None:
        print(f"Checksum missing for {path.name}. File will be processed.")
        return False

    if current_checksum != cached_checksum:
        print(f"Checksum mismatch for {path.name}. File will be processed.")
        return False
    return True


def update_checksum(path: Path, updated: dict):
    updated[path.name] = compute_checksum(path)
