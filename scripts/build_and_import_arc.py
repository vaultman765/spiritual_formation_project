import argparse
import subprocess
import sys
import yaml
from pathlib import Path
from scripts.utils.paths import INDEX_FILE
from scripts.utils.log import configure_logging, get_logger

sys.path.append(str(Path(__file__).resolve().parent.parent))
configure_logging()
logger = get_logger(__name__)


def run(command: list[str], description: str):
    command = [sys.executable if c == "python" else c for c in command]
    logger.info(f"\n▶ {description}: {' '.join(command)}")
    result = subprocess.run(command, capture_output=True, text=True, encoding="utf-8")

    # Always show stdout if there is any
    if result.stdout:
        logger.info(result.stdout)

    if result.returncode != 0:
        logger.error(f"Command failed with return code {result.returncode}")
        if result.stderr:
            logger.error(f"STDERR: {result.stderr}")
        raise RuntimeError(f"Step failed: {description}")
    else:
        logger.info(f"✅ {description} completed successfully")


def arc_id_in_index(arc_id):
    with open(INDEX_FILE, "r", encoding="utf-8") as f:
        index = yaml.safe_load(f)
    if isinstance(arc_id, list):
        return all(aid in index for aid in arc_id)
    return arc_id in index


def main():
    parser = argparse.ArgumentParser(description="Full build + import pipeline for an arc")
    parser.add_argument("--arc-id", required=True,
                        help="Arc ID to process (e.g. arc_love_of_god). Use --arc-id all to do all arcs")
    parser.add_argument("--skip-days", action="store_true", help="Skip importing meditation days")
    parser.add_argument("--skip-tags", action="store_true", help="Skip importing arc tags")
    args = parser.parse_args()

    arc_id = args.arc_id

    if arc_id == 'all':
        with open(INDEX_FILE, "r", encoding="utf-8") as f:
            index = yaml.safe_load(f)
        arc_ids = list(index.keys())
    else:
        arc_ids = [arc_id]

    # Check arc is registered
    if not arc_id_in_index(arc_ids):
        logger.warning(f"⚠️  Arc ID '{arc_ids}' not found in _index_by_arc.yaml — remember to update it!")

    # Step 1: Rebuild arc_metadata.yaml and arc_tags (can do all at once)
    run(["python", "-m", "scripts.build_arc_metadata_and_tags", "both"], "Build arc metadata and tags")

    # Step 2: Import arc metadata (one at a time)
    for aid in arc_ids:
        run(["python", "-m", "scripts.import_arc_metadata", "--arc-id", aid], f"Import arc metadata for {aid}")

    # Step 3: Import meditation days (one at a time)
    if not args.skip_days:
        for aid in arc_ids:
            run(["python", "-m", "scripts.import_day_yaml", "--arc-id", aid], f"Import arc days for {aid}")

    # Step 4: Import arc-level tags (one at a time)
    if not args.skip_tags:
        for aid in arc_ids:
            run(["python", "-m", "scripts.import_arc_tags", "--arc-id", aid], f"Import arc tags for {aid}")

    logger.info("\n✅ All steps complete.")


if __name__ == "__main__":
    main()
