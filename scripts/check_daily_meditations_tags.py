#!/usr/bin/env python3
import os
import re
import yaml
import sys

TAG_BANK_PATH = "metadata/tag_bank.yaml"
TARGET_DIR = "meditations"

def load_tag_bank(path):
    with open(path, "r") as f:
        data = yaml.safe_load(f)

    # Flatten all tag values into a single lowercase set
    tag_bank = set()
    if "tags" in data:
        data = data["tags"]  # Support tags: {} format

    for category, values in data.items():
        if isinstance(values, list):
            tag_bank.update(tag.strip().lower() for tag in values)

    return tag_bank

def extract_tags_from_md(content):
    tag_lines = re.findall(r'<!--\s*tags:\s*(.*?)\s*-->', content)
    tags = []
    for line in tag_lines:
        tags.extend(tag.strip().lower() for tag in line.split(","))
    return tags

def scan_meditations(tag_bank):
    errors = []
    for root, _, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith(".md"):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                tags = extract_tags_from_md(content)
                for tag in tags:
                    if tag not in tag_bank:
                        errors.append(f"[{path}] Invalid tag: '{tag}'")
    return errors

def main():
    if not os.path.exists(TAG_BANK_PATH):
        print(f"❌ Tag bank not found at {TAG_BANK_PATH}")
        sys.exit(1)

    tag_bank = load_tag_bank(TAG_BANK_PATH)
    errors = scan_meditations(tag_bank)

    if errors:
        print("❌ Tag Format Check Failed! The following tag issues were found:")
        for err in errors:
            print("   -", err)
        sys.exit(1)
    else:
        print("✅ All tags valid!")

if __name__ == "__main__":
    main()
