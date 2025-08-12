import boto3
import json
import sys
import yaml
from io import StringIO
from pathlib import Path
from jsonschema import validate, ValidationError
from typing import Any, Union
from scripts.utils.paths import ENV, S3_BUCKET_NAME
from scripts.utils.log import configure_logging, get_logger

sys.path.append(str(Path(__file__).resolve().parent.parent))
configure_logging()
logger = get_logger(__name__)


# ---------- Validation helpers ----------
class IndentDumper(yaml.SafeDumper):
    def increase_indent(self, flow=False, indentless=False):
        return super().increase_indent(flow, False)


class DayYamlValidator:
    def __init__(self, schema_path):
        self.schema = load_yaml(schema_path)

    def validate(self, data):
        try:
            validate(instance=data, schema=self.schema)
            return True, None
        except ValidationError as ve:
            return False, ve.message


# ---------- S3 helpers ----------
def _ensure_key(p: Union[str, Path]) -> str:
    # Turn Path into forward-slash key
    return str(p).replace("\\", "/") if isinstance(p, (Path,)) else str(p)


def _s3() -> boto3.client:
    return boto3.client("s3")


def load_yaml(path: Union[str, Path], encoding="utf-8-sig") -> Any:
    try:
        p = Path(path)
        with p.open("r", encoding=encoding) as f:
            return yaml.safe_load(f)
    except Exception as e:
        logger.error(f"Error loading YAML from {path}: {e}")
        raise e


def write_yaml(path: Union[str, Path], data, encoding="utf-8") -> None:
    try:
        p = Path(path)
        p.parent.mkdir(parents=True, exist_ok=True)
        with p.open("w", encoding=encoding) as f:
            yaml.dump(
                data,
                f,
                allow_unicode=True,
                sort_keys=False,
                default_flow_style=False,
                indent=2,
                Dumper=IndentDumper,
            )
    except Exception as e:
        logger.error(f"Error writing YAML to {path}: {e}")
        raise e


# ---------- JSON I/O (for checksum) ----------
def load_json(path_or_key: Union[str, Path]) -> dict:
    if ENV in ('Prod', 'Staging'):
        key = _ensure_key(path_or_key)
        try:
            obj = _s3().get_object(Bucket=S3_BUCKET_NAME, Key=key)
            return json.loads(obj["Body"].read().decode("utf-8"))
        except _s3().exceptions.NoSuchKey:  # type: ignore[attr-defined]
            return {}
        except Exception:
            return {}
    else:
        p = Path(path_or_key)
        if not p.exists():
            return {}
        try:
            return json.loads(p.read_text(encoding="utf-8"))
        except Exception as e:
            logger.error(f"Error loading JSON from {path_or_key}: {e}")
            raise e


def write_json(data: dict, path_or_key: Union[str, Path]):
    try:
        if ENV in ('Prod', 'Staging'):
            key = _ensure_key(path_or_key)
            _s3().put_object(Bucket=S3_BUCKET_NAME, Key=key, Body=json.dumps(data, indent=2).encode("utf-8"))
        else:
            p = Path(path_or_key)
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(json.dumps(data, indent=2), encoding="utf-8")
    except Exception as e:
        logger.error(f"Error writing JSON to {path_or_key}: {e}")
        raise e
