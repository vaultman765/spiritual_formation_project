import yaml
from pathlib import Path
from typing import Any


class IndentDumper(yaml.SafeDumper):
    def increase_indent(self, flow=False, indentless=False):
        return super().increase_indent(flow, False)


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


def write_yaml(filepath, data, mode='w'):
    with open(filepath, mode, encoding='utf-8') as f:
        yaml.dump(
            data,
            f,
            allow_unicode=True,
            sort_keys=False,
            default_flow_style=False,
            indent=2,
            Dumper=IndentDumper
        )
