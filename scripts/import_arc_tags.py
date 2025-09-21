import os
import sys
import django
import argparse
from scripts.utils.paths import PROJECT_ROOT, DJANGO_SETTINGS_MODULE, ARC_TAGS_DIR
from scripts.utils.log import configure_logging, get_logger  # noqa: E402
from scripts.utils.io import load_yaml  # noqa: E402

# Setup Django
sys.path.append(str(PROJECT_ROOT))


def setup_django():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", DJANGO_SETTINGS_MODULE)
    django.setup()


setup_django()  # noqa: E402

from website.models import Arc, Tag, ArcTag  # noqa: E402

configure_logging()  # Call once at the start of your script

logger = get_logger(__name__)


def import_tags_for_file(tag_file):
    if not tag_file.exists():
        logger.warning(f"Tag file not found: {tag_file.name}")
        return 0

    tag_data = load_yaml(tag_file)
    arc_id_local = tag_data.get("arc_id")

    if not arc_id_local:
        logger.warning(f"Skipping {tag_file.name}: no arc_id found.")
        return 0

    try:
        arc = Arc.objects.get(arc_id=arc_id_local)
    except Arc.DoesNotExist:
        logger.error(f"Arc not found: {arc_id_local}. Skipping {tag_file.name}.")
        return 0

    # Clear existing tags
    ArcTag.objects.filter(arc=arc).delete()

    count = 0
    # Load tags per category
    for category, tag_list in tag_data.get("tags", {}).items():
        for tag_name in tag_list:
            tag = Tag.objects.filter(name=tag_name).first()
            if tag is None:
                tag = Tag.objects.create(name=tag_name, category=category)
            ArcTag.objects.get_or_create(arc=arc, tag=tag)
            count += 1

    logger.info(f"Imported tags for arc: {arc_id_local}")
    return count


def import_arc_tags(arc_id: str = None):
    count = 0
    tag_files = [ARC_TAGS_DIR / f"{arc_id}_tags.yaml"] if arc_id else ARC_TAGS_DIR.glob("*.yaml")

    for tag_file in tag_files:
        count += import_tags_for_file(tag_file)

    logger.info(f"✅ Imported total {count} ArcTags.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--arc-id", help="Import tag data for a specific arc only")
    args = parser.parse_args()

    import_arc_tags(arc_id=args.arc_id)
