import yaml
import os
import sys

def validate_tag_file(filepath):
    with open(filepath) as f:
        data = yaml.safe_load(f)

    expected_top_keys = ["arc_id", "title", "day_range", "tags"]
    expected_tag_keys = ["thematic", "doctrinal", "virtue", "mystical", "liturgical", "typological", "structural"]

    actual_keys = list(data.keys())
    if actual_keys != expected_top_keys:
        print(f"❌ {filepath} - Top-level keys out of order: {actual_keys}")
        return False

    tag_keys = list(data["tags"].keys())
    if tag_keys != expected_tag_keys:
        print(f"❌ {filepath} - Tag keys incorrect or out of order: {tag_keys}")
        return False

    print(f"✅ {filepath} passed tag format check.")
    return True

def main():
    base_path = "metadata/arc_tags"
    success = True

    for root, dirs, files in os.walk(base_path):
        for file in files:
            if file.endswith(".yaml"):
                full_path = os.path.join(root, file)
                if not validate_tag_file(full_path):
                    success = False

    if not success:
        sys.exit(1)

if __name__ == "__main__":
    main()
