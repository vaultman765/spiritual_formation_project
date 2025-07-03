
import hashlib
import json
from pathlib import Path
from scripts.utils.paths import CHECKSUM_FILE


def load_checksums():
    if CHECKSUM_FILE.exists():
        return json.loads(CHECKSUM_FILE.read_text())
    return {}


def save_checksums(updated):
    CHECKSUM_FILE.write_text(json.dumps(updated, indent=2))


def compute_checksum(path: Path):
    hasher = hashlib.sha256()
    with open(path, "r", encoding="utf-8") as f:
        lines = [line for line in f if not line.strip().startswith("#")]
        content = "".join(lines).encode("utf-8")
        hasher.update(content)
    return hasher.hexdigest()


def should_skip(path: Path, checksums: dict, skip_enabled: bool) -> bool:
    if not skip_enabled:
        return False
    current = compute_checksum(path)
    cached = checksums.get(path.name)
    if current == cached:
        return True
    print(f"⏩ Updating changed: {path.name}")
    return False


def update_checksum(path: Path, updated: dict):
    updated[path.name] = compute_checksum(path)
