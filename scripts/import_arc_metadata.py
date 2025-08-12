import django
import os
import sys
import argparse
import yaml
from pathlib import Path
from scripts.utils.arc_loader import load_arc_from_metadata
from scripts.utils.log import configure_logging, get_logger
from scripts.utils.paths import DJANGO_SETTINGS_MODULE

sys.path.append(str(Path(__file__).resolve().parent.parent))
configure_logging()
logger = get_logger(__name__)


def setup_django():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", DJANGO_SETTINGS_MODULE)
    django.setup()


setup_django()  # noqa: E402

from website.models import Arc  # noqa: E402

ARC_METADATA_PATH = Path("metadata") / "arc_metadata.yaml"


def main(arc_id: str = None):
    if not ARC_METADATA_PATH.exists():
        logger.error("arc_metadata.yaml not found.")
        return

    with open(ARC_METADATA_PATH, "r", encoding="utf-8-sig") as f:
        metadata = yaml.safe_load(f)

    count = 0
    for arc in metadata:
        this_id = arc["arc_id"]
        if arc_id and this_id != arc_id:
            continue

        obj = load_arc_from_metadata(this_id, Arc)
        logger.info(f"[OK] Synced arc: {obj.arc_number} — {obj.arc_title}")
        count += 1

    if count == 0:
        logger.warning("No arcs imported. Check arc_id?")
    else:
        logger.info(f"{count} arcs imported/updated.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--arc-id", help="Import only the specified arc_id")
    args = parser.parse_args()
    main(arc_id=args.arc_id)
