
import boto3
import hashlib
import json
from typing import Union
from pathlib import Path
from scripts.utils.paths import CHECKSUM_FILE, ENV, S3_BUCKET_NAME
from scripts.utils.io import load_json, write_json


def _read_lines(path_or_key: Union[str, Path]) -> list[str]:
    if ENV in ('Prod', 'Staging'):
        key = str(path_or_key).replace("\\", "/")
        s3 = boto3.client("s3")
        obj = s3.get_object(Bucket=S3_BUCKET_NAME, Key=key)
        content = obj["Body"].read().decode("utf-8-sig")
        return content.splitlines()
    else:
        p = Path(path_or_key)
        with p.open("r", encoding="utf-8-sig") as f:
            return f.readlines()


def _basename(path_or_key: Union[str, Path]) -> str:
    s = str(path_or_key)
    return s[s.rfind("/") + 1 :]


def load_checksums():
    try:
        return load_json(CHECKSUM_FILE)
    except json.JSONDecodeError as e:
        print(f"Failed to load checksums. Error: {e}")
        raise e


def save_checksums(data):
    try:
        write_json(data, CHECKSUM_FILE)
    except Exception as e:
        print(f"Failed to save checksums. Error: {e}")
        raise e


def compute_checksum(path_or_key: Union[str, Path]) -> str:
    """Compute the checksum for a file, ignoring the sync comment."""
    h = hashlib.sha256()
    lines = _read_lines(path_or_key)
    filtered = [ln.strip() for ln in lines if not ln.strip().startswith("# Last imported into DB")]
    h.update("\n".join(filtered).encode("utf-8"))
    return h.hexdigest()


def should_skip(path_or_key: Union[str, Path], checksums: dict, skip: bool) -> bool:
    if not skip:
        return False
    fname = _basename(path_or_key)
    current = compute_checksum(path_or_key)
    cached = checksums.get(fname)

    if cached is None or cached != current:
        return False
    return True


def update_checksum(path_or_key: Union[str, Path], mapping: dict):
    fname = _basename(path_or_key)
    mapping[fname] = compute_checksum(path_or_key)
