import argparse
import subprocess
import sys
from pathlib import Path
from scripts.utils.io import load_yaml
from scripts.utils.paths import INDEX_FILE, ARC_METADATA_FILE, ARC_TAGS_DIR, DAY_FILES_DIR
from scripts.utils.log import configure_logging, get_logger
from scripts.utils.checksum import load_checksums, save_checksums, should_skip, update_checksum

sys.path.append(str(Path(__file__).resolve().parent.parent))
configure_logging()
logger = get_logger(__name__)


class ArcMetadataHandler:
    def __init__(self):
        self.index = load_yaml(INDEX_FILE)

    def arc_id_in_index(self, arc_id: list[str]) -> bool:
        return all(aid in self.index for aid in arc_id)

    def get_start_end_days(self, arc_id: str) -> tuple[int, int]:
        if arc_id not in self.index:
            raise ValueError(f"Arc ID '{arc_id}' not found in index")
        return self.index[arc_id]["start_day"], self.index[arc_id]["end_day"]

    def get_day_list(self, arc_ids: list[str]) -> list[str]:
        day_files = []
        for aid in arc_ids:
            start_day, end_day = self.get_start_end_days(aid)
            day_files.extend([f"day_{day:04}.yaml" for day in range(start_day, end_day + 1)])
        return day_files


def run(command: list[str], description: str):
    command = [sys.executable if c == "python" else c for c in command]
    logger.info(f"\n▶ {description}: {' '.join(command)}")
    result = subprocess.run(command, capture_output=True, text=True, encoding="utf-8", errors="replace")

    # Always show stdout if there is any
    if result.stdout:
        logger.info(result.stdout)

    if result.returncode != 0:
        logger.error(f"Command failed with return code {result.returncode}")
        if result.stderr:
            logger.error(f"STDERR: {result.stderr}")
        raise RuntimeError(f"Step failed: {description}")


def run_import_arc_metadata(arc_id):
    """Import arc metadata for a specific arc ID."""
    run(["python", "-m", "scripts.import_arc_metadata", "--arc-id", arc_id], f"Import arc metadata for {arc_id}")


def main(index_file: Path, arc_metadata_file: Path, arc_tags_dir: Path, day_files_dir: Path):
    parser = argparse.ArgumentParser(description="Full build + import pipeline for an arc")
    parser.add_argument("--arc-id", required=True,
                        help="Arc ID to process (e.g. arc_love_of_god). Use --arc-id all to do all arcs")
    parser.add_argument("--skip-days", action="store_true", help="Skip importing meditation days")
    parser.add_argument("--skip-tags", action="store_true", help="Skip importing arc tags")
    parser.add_argument("--skip-unchanged", action="store_true", help="Skip files with unchanged checksum")
    args = parser.parse_args()

    arc_id = args.arc_id

    index = load_yaml(index_file)
    if arc_id == 'all':
        index = load_yaml(index_file)
        arc_ids = list(index.keys())
    else:
        if arc_id not in index:
            logger.error(f"⚠️  Arc ID '{arc_id}' not found in _index_by_arc.yaml — update it before running this script.")
            return
        arc_ids = [arc_id]

    # Check arc is registered
    arc_handler = ArcMetadataHandler()
    if not arc_handler.arc_id_in_index(arc_ids):
        logger.error(f"Arc ID '{arc_ids}' not found in _index_by_arc.yaml — update it before running this script.")
        return

    # Step 1: Rebuild arc_metadata.yaml and arc_tags (can do all at once)
    run(["python", "-m", "scripts.build_arc_metadata_and_tags", "both"], "Build arc metadata and tags")

    # Step 2: Import arc metadata (one at a time)
    if args.skip_unchanged:
        checksums = load_checksums()
        if not should_skip(arc_metadata_file, checksums, args.skip_unchanged):
            for aid in arc_ids:
                run_import_arc_metadata(aid)
            update_checksum(arc_metadata_file, checksums)
            save_checksums(checksums)
        else:
            logger.info("⏩ Skipping unchanged arc metadata file")
    else:
        for aid in arc_ids:
            run_import_arc_metadata(aid)

    # Step 3: Import meditation days (one at a time)
    arc_handler = ArcMetadataHandler(INDEX_FILE)
    day_list = arc_handler.get_day_list(arc_ids)
    if not args.skip_days:
        if args.skip_unchanged:
            checksums = load_checksums()
            for day_file in day_list:
                day_file_path = Path(day_files_dir / day_file)
                if not should_skip(day_file_path, checksums, args.skip_unchanged):
                    run(["python", "-m", "scripts.import_day_yaml", "--file", str(day_file)], f"Import {day_file}")
                    update_checksum(day_file_path, checksums)
            save_checksums(checksums)
        else:
            # If not skipping unchanged, just import all days
            for aid in arc_ids:
                run(["python", "-m", "scripts.import_day_yaml", "--arc-id", aid], f"Import arc days for {aid}")

    # Step 4: Import arc-level tags (one at a time)
    if not args.skip_tags:
        if args.skip_unchanged:
            checksums = load_checksums()
            for aid in arc_ids:
                tag_file = Path(f"{arc_tags_dir}/{aid}_tags.yaml")
                if not should_skip(tag_file, checksums, args.skip_unchanged):
                    run(["python", "-m", "scripts.import_arc_tags", "--arc-id", aid], f"Import arc tags for {aid}")
                    update_checksum(tag_file, checksums)
            save_checksums(checksums)
        else:
            # If not skipping unchanged, just import all tags
            for aid in arc_ids:
                run(["python", "-m", "scripts.import_arc_tags", "--arc-id", aid], f"Import arc tags for {aid}")

    logger.info("\n✅ All steps complete.")


if __name__ == "__main__":
    main(index_file=INDEX_FILE,
         arc_metadata_file=ARC_METADATA_FILE,
         arc_tags_dir=ARC_TAGS_DIR,
         day_files_dir=DAY_FILES_DIR)
