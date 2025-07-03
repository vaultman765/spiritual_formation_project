import argparse
import subprocess
import sys
import yaml
from pathlib import Path
from scripts.utils.paths import INDEX_FILE, ARC_METADATA_FILE, ARC_TAGS_DIR, DAY_FILES_DIR
from scripts.utils.log import configure_logging, get_logger
from scripts.utils.checksum import load_checksums, save_checksums, should_skip, update_checksum

sys.path.append(str(Path(__file__).resolve().parent.parent))
configure_logging()
logger = get_logger(__name__)


class ArcMetadataHandler:
    def __init__(self, index_file: Path) -> None:
        self.index_file = index_file
        self.index = self._load_index()

    def _load_index(self) -> dict:
        with open(self.index_file, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)

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


def execute_command(command: list[str], description: str) -> None:
    """Execute a shell command and handle errors."""
    command = [sys.executable if c == "python" else c for c in command]
    # logger.info(f"\n▶ {description}: {' '.join(command)}")
    result = subprocess.run(command, capture_output=True, text=True, encoding="utf-8")
    if result.returncode != 0:
        logger.error(f"Command failed: {result.stderr}")
        raise RuntimeError(f"Step failed: {description}")
    logger.info(result.stdout)


def process_with_checksums(file_path: Path, command, description: str, checksums: dict, skip_unchanged: bool) -> None:
    """Process a file with checksum validation."""
    if skip_unchanged and should_skip(file_path, checksums, skip_unchanged):
        return

    # Handle nested commands (e.g., for day files)
    if isinstance(command[0], list):  # Check if the first item is a list
        for sub_command in command:
            execute_command(sub_command, description)
    else:
        execute_command(command, description)

    update_checksum(file_path, checksums)
    logger.info(f"✅ Processed file: {file_path.stem}")


def process_step(file_paths: list[Path], command: callable, description: str, checksums: dict, skip_unchanged: bool) -> None:
    """Process a single step for one or multiple file paths."""
    if isinstance(file_paths, list):
        for file_path in file_paths:
            process_with_checksums(file_path, command, description, checksums, skip_unchanged)
    else:
        # Handle single file path (e.g., arc_metadata or arc_tags)
        process_with_checksums(file_paths, command, description, checksums, skip_unchanged)


def process_arc_steps(arc_ids: list[str], steps: list[dict], skip_unchanged: bool) -> None:
    checksums = load_checksums() if skip_unchanged else None
    for step in steps:
        for aid in arc_ids:
            file_paths = step["file_path"](aid)
            command = step["command"](aid)
            description = step["description"](aid)
            process_step(file_paths, command, description, checksums, skip_unchanged)
    if checksums:
        save_checksums(checksums)
        logger.info("✅ Updated checksums saved.")


def main(index_file: Path, arc_metadata_file: Path, arc_tags_dir: Path, day_files_dir: Path) -> None:
    parser = argparse.ArgumentParser(description="Full build + import pipeline for an arc")
    parser.add_argument("--arc-id", required=True, help="Arc ID to process (e.g. arc_love_of_god). Use 'all' for all arcs")
    parser.add_argument("--skip-days", action="store_true", help="Skip importing meditation days")
    parser.add_argument("--skip-tags", action="store_true", help="Skip importing arc tags")
    parser.add_argument("--skip-unchanged", action="store_true", help="Skip files with unchanged checksum")
    args = parser.parse_args()

    arc_handler = ArcMetadataHandler(index_file)

    if args.arc_id != "all" and not arc_handler.arc_id_in_index([args.arc_id]):
        logger.error(f"❌ Invalid Arc ID: {args.arc_id}")
        sys.exit(1)

    arc_ids = list(arc_handler.index.keys()) if args.arc_id == "all" else [args.arc_id]

    # Validate arc IDs
    if not arc_handler.arc_id_in_index(arc_ids):
        logger.warning(f"⚠️ Arc ID '{arc_ids}' not found in index")

    # Step 1: Rebuild arc_metadata.yaml and arc_tags (can do all at once)
    execute_command(["python", "-m", "scripts.build_arc_metadata_and_tags", "both"], "Build arc metadata and tags")

    # Define steps
    steps = [
        {
            "file_path": lambda aid: arc_metadata_file,
            "command": lambda aid: ["python", "-m", "scripts.import_arc_metadata", "--arc-id", aid],
            "description": lambda aid: f"Import arc metadata for {aid}",
        },
        {
            "file_path": lambda aid: [
                Path(day_files_dir / f"day_{day:04}.yaml") for day in range(
                    arc_handler.get_start_end_days(aid)[0],
                    arc_handler.get_start_end_days(aid)[1] + 1
                )
            ],
            "command": lambda aid: [
                ["python", "-m", "scripts.import_day_yaml", "--file", str(Path(day_files_dir / f"day_{day:04}.yaml"))]
                for day in range(
                    arc_handler.get_start_end_days(aid)[0],
                    arc_handler.get_start_end_days(aid)[1] + 1
                )
            ],
            "description": lambda aid: f"Import day files for {aid}",
        },
        {
            "file_path": lambda aid: Path(arc_tags_dir / f"{aid}_tags.yaml"),
            "command": lambda aid: ["python", "-m", "scripts.import_arc_tags", "--arc-id", aid],
            "description": lambda aid: f"Import arc tags for {aid}",
        },
    ]

    # Process steps
    process_arc_steps(arc_ids, steps, args.skip_unchanged)
    logger.info("\n✅ All steps complete.")


if __name__ == "__main__":
    main(index_file=INDEX_FILE,
         arc_metadata_file=ARC_METADATA_FILE,
         arc_tags_dir=ARC_TAGS_DIR,
         day_files_dir=DAY_FILES_DIR)
