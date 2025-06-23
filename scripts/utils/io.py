import yaml
from pathlib import Path
from typing import Any


def load_yaml(file_path: Path) -> Any:
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return None
    except yaml.YAMLError as e:
        print(f"YAML error in {file_path}: {e}")
        return None


def write_yaml(file_path: Path, data: Any, mode: str = 'w') -> None:
    with open(file_path, mode, encoding="utf-8") as f:
        yaml.dump(data, f, sort_keys=False, allow_unicode=True)
