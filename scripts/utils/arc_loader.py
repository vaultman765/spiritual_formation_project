import yaml
from scripts.utils.paths import ARC_METADATA_FILE


def load_arc_from_metadata(arc_id: str, arc_model) -> object:
    """
    Loads a single Arc from arc_metadata.yaml and inserts or updates the Arc model in the database.
    """
    if not ARC_METADATA_FILE.exists():
        raise FileNotFoundError(f"arc_metadata.yaml not found at: {ARC_METADATA_FILE}")

    with open(ARC_METADATA_FILE, "r", encoding="utf-8") as f:
        metadata = yaml.safe_load(f)

    arc_data = next((arc for arc in metadata if arc["arc_id"] == arc_id), None)
    if not arc_data:
        raise ValueError(f"Arc ID '{arc_id}' not found in arc_metadata.yaml")

    if "master_day_start" not in arc_data:
        range_data = arc_data.get("master_day_range", {})
        arc_data["master_day_start"] = range_data.get("start")
        arc_data["master_day_end"] = range_data.get("end")

    arc_obj, created = arc_model.objects.update_or_create(
        arc_id=arc_id,
        defaults={
            "arc_title": arc_data["arc_title"],
            "arc_number": arc_data["arc_number"],
            "day_count": arc_data["day_count"],
            "master_day_start": arc_data["master_day_start"],
            "master_day_end": arc_data["master_day_end"],
            "anchor_image": arc_data["anchor_image"],
            "arc_summary": arc_data["arc_summary"],
            "primary_reading": arc_data["primary_reading"],
            "card_tags": arc_data["card_tags"],
        }
    )
    return arc_obj
