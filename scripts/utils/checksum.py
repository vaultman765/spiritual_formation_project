
import hashlib
import json
from typing import Union
from pathlib import Path
from scripts.utils.paths import CHECKSUM_FILE
from scripts.utils.io import load_json, write_json
from scripts.utils.log import configure_logging, get_logger

configure_logging()
logger = get_logger(__name__)


def _read_lines(path: Union[str, Path]) -> list[str]:
    p = Path(path)
    with p.open("r", encoding="utf-8-sig") as f:
        return f.readlines()


def _basename(path: Union[str, Path]) -> str:
    s = str(path)
    return s[s.rfind("/") + 1 :]


def load_checksums():
    try:
        return load_json(CHECKSUM_FILE)
    except json.JSONDecodeError as e:
        logger.error(f"Failed to load checksums. Error: {e}")
        raise e


def save_checksums(data):
    try:
        write_json(data, CHECKSUM_FILE)
    except Exception as e:
        logger.error(f"Failed to save checksums. Error: {e}")
        raise e


def compute_checksum(path: Union[str, Path]) -> str:
    """Compute the checksum for a file, ignoring the sync comment."""
    h = hashlib.sha256()
    lines = _read_lines(path)
    filtered = [ln.strip() for ln in lines if not ln.strip().startswith("# Last imported into DB")]
    h.update("\n".join(filtered).encode("utf-8"))
    return h.hexdigest()


def should_skip(path: Union[str, Path], checksums: dict, skip: bool) -> bool:
    if not skip:
        return False
    fname = _basename(path)
    current = compute_checksum(path)
    cached = checksums.get(fname)

    if cached is None or cached != current:
        return False
    return True


def update_checksum(path: Union[str, Path], mapping: dict):
    fname = _basename(path)
    mapping[fname] = compute_checksum(path)
