import os
import sys
import django
import logging
import argparse
import yaml
from pathlib import Path
from datetime import datetime

sys.path.append(str(Path(__file__).resolve().parent.parent))
from scripts.utils.io import DayYamlValidator, load_yaml  # noqa: E402
from scripts.utils.paths import DAY_SCHEMA, DJANGO_SETTINGS_MODULE, INDEX_FILE, DAY_FILES_DIR  # noqa: E402
from scripts.utils.log import configure_logging, get_logger  # noqa: E402
from scripts.utils.arc_loader import load_arc_from_metadata  # noqa: E402


def setup_django():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", DJANGO_SETTINGS_MODULE)
    django.setup()


setup_django()  # noqa: E402


from website.models import Arc, MeditationDay, Tag, DayTag, SecondaryReading  # noqa: E402

configure_logging()  # Call once at the start of your script

logger = get_logger(__name__)


class DayImporter:
    """
    Handles importing a single meditation day YAML into the database.
    """
    def __init__(self, arc_model: Arc, day_model: MeditationDay, tag_model: Tag,
                 daytag_model: DayTag, secondary_model: SecondaryReading, logger: logging.Logger) -> None:
        self.Arc = arc_model
        self.MeditationDay = day_model
        self.Tag = tag_model
        self.DayTag = daytag_model
        self.SecondaryReading = secondary_model
        self.logger = logger

    def import_day(self, data: dict) -> bool:
        """
        Import a single day's data. Returns True if successful, False otherwise.
        """
        required_fields = ["master_day_number", "arc_day_number", "arc_id", "primary_reading", "meditative_points"]
        missing = [f for f in required_fields if f not in data or not data[f]]

        # Allow empty 'reference' in 'primary_reading'
        if "primary_reading" in missing and isinstance(data.get("primary_reading"), dict) \
                and "title" in data["primary_reading"]:
            missing.remove("primary_reading")

        if missing:
            self.logger.error(f"Missing required fields: {missing}")
            return False

        arc = load_arc_from_metadata(data["arc_id"], self.Arc)
        try:
            day = self._create_or_update_day(data["master_day_number"], arc, data["arc_day_number"], data)
        except Exception as e:
            self.logger.error(f"Failed to create/update day: {e}")
            return False
        self._replace_secondary_readings(meditation_day=day, readings=data.get("secondary_reading", []))
        self._replace_tags(day, data.get("tags", {}))
        return True

    def _create_or_update_day(self, day_num: int, arc, arc_day: int, data: dict) -> MeditationDay:
        med_points = data.get("meditative_points", [])
        if not med_points:
            self.logger.error("No meditative_points provided.")
            raise ValueError("No meditative_points provided.")
        defaults = {
            "arc": arc,
            "arc_day_number": arc_day,
            "arc_title": arc.arc_title,
            "arc_number": arc.arc_number,
            "day_title": data.get("day_title", f"Day {day_num}"),
            "anchor_image": data.get("anchor_image", ""),
            "primary_reading_title": data["primary_reading"]["title"],
            "primary_reading_reference": data["primary_reading"].get("reference", ""),
            "primary_reading_url": data["primary_reading"].get("url", ""),
            "meditative_point_1": med_points[0],
            "meditative_point_2": med_points[1] if len(med_points) > 1 else "",
            "meditative_point_3": med_points[2] if len(med_points) > 2 else "",
            "ejaculatory_prayer": data["ejaculatory_prayer"],
            "colloquy": data["colloquy"],
            "resolution": data.get("resolution", "")
        }
        day, created = self.MeditationDay.objects.update_or_create(
            master_day_number=day_num, defaults=defaults
        )
        self.logger.info(f"{'Created' if created else 'Updated'} Day {day_num} (Arc: {arc.arc_id})")
        return day

    def _replace_secondary_readings(self, meditation_day: MeditationDay, readings: list) -> None:
        meditation_day.secondary_readings.all().delete()
        for sr in readings:
            try:
                self.SecondaryReading.objects.create(
                    meditation_day=meditation_day,
                    title=sr["title"],
                    reference=sr.get("reference", ""),
                    url=sr.get("url", "")
                )
            except Exception as e:
                self.logger.warning(f"Skipping malformed secondary reading: {e}")

    def _replace_tags(self, meditation_day: MeditationDay, tags: dict) -> None:
        self.DayTag.objects.filter(meditation_day=meditation_day).delete()
        for category, tag_list in tags.items():
            for tag_name in tag_list:
                tag, _ = self.Tag.objects.get_or_create(name=tag_name, defaults={"category": category})
                self.DayTag.objects.get_or_create(meditation_day=meditation_day, tag=tag)


def import_day_file(path: Path, dry_run: bool = False) -> bool:
    """Import a single YAML file into the database."""
    if not path.exists():
        logging.info(f"Updating path to {DAY_FILES_DIR / path}")
        path = DAY_FILES_DIR / path
    if not path.exists():
        logging.error(f"File not found: {path}")
        return False

    data = load_yaml(path)
    if not data:
        return False

    validator = DayYamlValidator(DAY_SCHEMA)
    valid, error = validator.validate(data)
    if not valid:
        logging.error(f"Validation failed for {path.name}: {error}")
        return False

    if dry_run:
        logging.info(f"[DRY RUN] Would import: {path.name}")
        return True

    importer = DayImporter(Arc, MeditationDay, Tag, DayTag, SecondaryReading, logger=logging)
    success = importer.import_day(data)
    if not success:
        logging.error(f"Failed to import {path.name}")
        return False

    # Append sync comment
    if not dry_run:
        try:
            with open(path, "r", encoding="utf-8") as f:
                lines = f.readlines()
            if not lines[0].startswith("# Last imported into DB"):
                lines.insert(0, f"# Last imported into DB: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            else:
                lines[0] = f"# Last imported into DB: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
            with open(path, "w", encoding="utf-8") as f:
                f.writelines(lines)
        except Exception as e:
            logging.warning(f"Could not write sync comment to {path.name}: {e}")

    return success


def import_folder(folder: Path, dry_run: bool = False):
    yaml_files = sorted(folder.glob("day_*.yaml"))
    success, failure = 0, 0
    for f in yaml_files:
        if import_day_file(f, dry_run=dry_run):
            success += 1
        else:
            failure += 1
    logging.info(f"\nImported {success} files, {failure} failed.")


def import_arc(arc_id: str, dry_run: bool = False):
    index = load_yaml(INDEX_FILE)
    if arc_id not in index:
        logging.error(f"Arc ID '{arc_id}' not found in index.")
        return

    arc_info = index[arc_id]
    start_day = arc_info["start_day"]
    end_day = arc_info["end_day"]

    success, failure = 0, 0
    for day_num in range(start_day, end_day + 1):
        path = DAY_FILES_DIR / f"day_{day_num:04}.yaml"
        if path.exists():
            if import_day_file(path, dry_run=dry_run):
                success += 1
            else:
                failure += 1
        else:
            logging.warning(f"Missing file: {path}")
    logging.info(f"\nImported arc '{arc_id}' - {success} files, {failure} failed.")


def main():
    parser = argparse.ArgumentParser(description="Import YAML meditation day(s) into the Django DB")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--file", type=str, help="Path to a single day YAML file")
    group.add_argument("--folder", type=str, help="Path to a folder of day_*.yaml files")
    group.add_argument("--arc-id", type=str, help="Arc ID to import from arc index")
    parser.add_argument("--dry-run", action="store_true", help="Validate and show actions, but do not write to DB")
    args = parser.parse_args()

    if args.file:
        import_day_file(Path(args.file), dry_run=args.dry_run)
    elif args.folder:
        import_folder(Path(args.folder), dry_run=args.dry_run)
    elif args.arc_id:
        import_arc(args.arc_id, dry_run=args.dry_run)


if __name__ == "__main__":
    result = main()
    sys.exit()
