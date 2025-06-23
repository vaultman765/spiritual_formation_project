
import argparse
from tag_tools import TagBank, TagScanner, YamlTagFileHandler, MarkdownTagFileHandler, TagSynchronizer
from pathlib import Path

# Set up paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
ARC_TAGS_DIR = PROJECT_ROOT / "metadata" / "arc_tags"
MEDITATIONS_DIR = PROJECT_ROOT / "meditations"


def add_tag(tag, category):
    tagbank = TagBank()
    tagbank.add_tag(tag, category)
    tagbank.save()
    print(f"✅ Added tag '{tag}' to category '{category}'")


def rename_tag(old, new):
    tagbank = TagBank()
    tagbank.delete_tag(old)
    tagbank.add_tag(new, "uncategorized")  # User should manually move if needed
    tagbank.save()
    print(f"🔁 Renamed tag in tag_bank: '{old}' → '{new}'")

    # Update in all files
    yaml_files = list(ARC_TAGS_DIR.glob("*.yaml")) + [PROJECT_ROOT / "metadata" / "arc_metadata.yaml"]
    md_files = list(MEDITATIONS_DIR.glob("*.md"))

    handlers = [
        YamlTagFileHandler(yaml_files),
        MarkdownTagFileHandler(md_files)
    ]
    TagSynchronizer(handlers).update_tag(old, new)
    print("✅ Renamed tag across all files")


def delete_tag(tag):
    tagbank = TagBank()
    tagbank.delete_tag(tag)
    tagbank.save()
    print(f"🗑 Deleted tag '{tag}' from tag_bank")

    yaml_files = list(ARC_TAGS_DIR.glob("*.yaml")) + [PROJECT_ROOT / "metadata" / "arc_metadata.yaml"]
    md_files = list(MEDITATIONS_DIR.glob("*.md"))

    handlers = [
        YamlTagFileHandler(yaml_files),
        MarkdownTagFileHandler(md_files)
    ]
    TagSynchronizer(handlers).delete_tag(tag)
    print("✅ Deleted tag from all files")


def validate_tags():
    tagbank = TagBank()
    scanner = TagScanner(tagbank)
    used = scanner.get_all_used_tags()
    canonical = tagbank.return_all_tags()

    invalid = sorted(used - canonical)
    if invalid:
        print("❌ Invalid tags found:")
        for tag in invalid:
            print(f" - {tag}")
    else:
        print("✅ All tags used are valid")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Tag CLI using tag_tools.py")
    subparsers = parser.add_subparsers(dest="command")

    add = subparsers.add_parser("add")
    add.add_argument("--tag", required=True)
    add.add_argument("--category", required=True)

    rename = subparsers.add_parser("rename")
    rename.add_argument("--old", required=True)
    rename.add_argument("--new", required=True)

    delete = subparsers.add_parser("delete")
    delete.add_argument("--tag", required=True)

    subparsers.add_parser("validate")

    args = parser.parse_args()

    if args.command == "add":
        add_tag(args.tag, args.category)
    elif args.command == "rename":
        rename_tag(args.old, args.new)
    elif args.command == "delete":
        delete_tag(args.tag)
    elif args.command == "validate":
        validate_tags()
    else:
        parser.print_help()
