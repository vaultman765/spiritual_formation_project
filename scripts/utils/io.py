import json
import sys
import yaml
from pathlib import Path
from typing import Any, Union
from scripts.utils.log import configure_logging, get_logger

sys.path.append(str(Path(__file__).resolve().parent.parent))
configure_logging()
logger = get_logger(__name__)


# ---------- Validation helpers ----------
class IndentDumper(yaml.SafeDumper):
    def increase_indent(self, flow=False, indentless=False):
        return super().increase_indent(flow, False)


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
def load_json(path: Union[str, Path]) -> dict:
    p = Path(path)
    if not p.exists():
        return {}
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:
        logger.error(f"Error loading JSON from {path}: {e}")
        raise e


def write_json(data: dict, path: Union[str, Path]):
    try:
        p = Path(path)
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(json.dumps(data, indent=2), encoding="utf-8")
    except Exception as e:
        logger.error(f"Error writing JSON to {path}: {e}")
        raise e
