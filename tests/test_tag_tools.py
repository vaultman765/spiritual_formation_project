import pytest
from unittest.mock import MagicMock
from scripts.tag_tools import (
    TagBank, YamlTagFileHandler, MarkdownTagFileHandler,
    TagSynchronizer
)

# --- TagBank Tests ---


def test_tagbank_load_and_save(tmp_path):
    yaml_content = "virtue:\n  - patience\nvice:\n  - pride\n"
    file_path = tmp_path / "tag_bank.yaml"
    file_path.write_text(yaml_content)
    tb = TagBank(path=file_path)
    assert tb.tags == {"virtue": ["patience"], "vice": ["pride"]}
    tb.add_tag("humility", "virtue")
    tb.save()
    loaded = file_path.read_text()
    assert "humility" in loaded


def test_tagbank_return_all_tags():
    tb = TagBank()
    tb.tags = {"virtue": ["patience"], "vice": ["pride"]}
    assert tb.return_all_tags() == {"patience", "pride"}


def test_tagbank_move_tag():
    tb = TagBank()
    tb.tags = {"virtue": ["patience"], "vice": []}
    tb.move_tag("patience", "virtue", "vice")
    assert "patience" in tb.tags["vice"]
    assert "patience" not in tb.tags["virtue"]


def test_tagbank_delete_tag():
    tb = TagBank()
    tb.tags = {"virtue": ["patience"], "vice": ["pride"]}
    tb.delete_tag("patience")
    assert "patience" not in tb.tags["virtue"]


def test_tagbank_add_tag():
    tb = TagBank()
    tb.tags = {"virtue": []}
    tb.add_tag("patience", "virtue")
    assert "patience" in tb.tags["virtue"]
    tb.add_tag("patience", "virtue")  # Should not duplicate
    assert tb.tags["virtue"].count("patience") == 1

# --- YamlTagFileHandler Tests ---


def test_yaml_tag_file_handler_update_tag_flat(tmp_path):
    file_path = tmp_path / "arc.yaml"
    file_path.write_text("tags:\n  - patience\n  - humility\n")
    handler = YamlTagFileHandler([str(file_path)])
    handler.file_paths = [str(file_path)]  # For compatibility
    handler.update_tag("patience", "fortitude")
    data = file_path.read_text()
    assert "fortitude" in data
    assert "patience" not in data


def test_yaml_tag_file_handler_update_tag_nested(tmp_path):
    file_path = tmp_path / "arc.yaml"
    file_path.write_text("tags:\n  virtue:\n    - patience\n    - humility\n  vice:\n    - pride\n")
    handler = YamlTagFileHandler([str(file_path)])
    handler.file_paths = [str(file_path)]
    handler.update_tag("patience", "fortitude")
    data = file_path.read_text()
    assert "fortitude" in data
    assert "patience" not in data


def test_yaml_tag_file_handler_delete_tag_flat(tmp_path):
    file_path = tmp_path / "arc.yaml"
    file_path.write_text("tags:\n  - patience\n  - humility\n")
    handler = YamlTagFileHandler([str(file_path)])
    handler.file_paths = [str(file_path)]
    handler.delete_tag("patience")
    data = file_path.read_text()
    assert "patience" not in data


def test_yaml_tag_file_handler_delete_tag_nested(tmp_path):
    file_path = tmp_path / "arc.yaml"
    file_path.write_text("tags:\n  virtue:\n    - patience\n    - humility\n  vice:\n    - pride\n")
    handler = YamlTagFileHandler([str(file_path)])
    handler.file_paths = [str(file_path)]
    handler.delete_tag("patience")
    data = file_path.read_text()
    assert "patience" not in data

# --- MarkdownTagFileHandler Tests ---


def test_markdown_tag_file_handler_update_tag(tmp_path):
    file_path = tmp_path / "med.md"
    file_path.write_text("<!-- tags: patience, humility -->")
    handler = MarkdownTagFileHandler([file_path])
    handler.update_tag("patience", "fortitude")
    data = file_path.read_text()
    assert "fortitude" in data
    assert "patience" not in data


def test_markdown_tag_file_handler_delete_tag(tmp_path):
    file_path = tmp_path / "med.md"
    file_path.write_text("<!-- tags: patience, humility -->")
    handler = MarkdownTagFileHandler([file_path])
    handler.delete_tag("patience")
    data = file_path.read_text()
    assert "patience" not in data

# --- TagSynchronizer Tests ---


def test_tag_synchronizer_update_and_delete():
    handler1 = MagicMock()
    handler2 = MagicMock()
    sync = TagSynchronizer([handler1, handler2])
    sync.update_tag("a", "b")
    handler1.update_tag.assert_called_with("a", "b")
    handler2.update_tag.assert_called_with("a", "b")
    sync.delete_tag("a")
    handler1.delete_tag.assert_called_with("a")
    handler2.delete_tag.assert_called_with("a")

# --- TagScanner Tests ---


@pytest.fixture
def fake_tagbank():
    tb = TagBank()
    tb.tags = {"virtue": ["patience", "humility"], "vice": ["pride"]}
    return tb


def test_tag_scanner_get_all_used_tags(tmp_path, fake_tagbank):
    # Setup fake arc_tags (nested)
    arc_tags_dir = tmp_path / "arc_tags"
    arc_tags_dir.mkdir()
    (arc_tags_dir / "arc1.yaml").write_text("tags:\n  virtue:\n    - patience\n  vice:\n    - pride\n")
    # Setup fake arc_metadata
    arc_metadata = tmp_path / "arc_metadata.yaml"
    arc_metadata.write_text("- tags:\n    - humility\n")
    # Setup fake meditations
    med_dir = tmp_path / "meditations"
    med_dir.mkdir()
    (med_dir / "med1.md").write_text("<!-- tags: [patience, humility] -->")

    # Patch global paths
    import scripts.tag_tools as tt
    tt.ARC_TAGS_DIR = arc_tags_dir
    tt.ARC_METADATA_PATH = arc_metadata
    tt.MEDITATIONS_DIR = med_dir

    scanner = tt.TagScanner(fake_tagbank)
    used = scanner.get_all_used_tags()
    assert "patience" in used
    assert "humility" in used
    assert "pride" in used


def test_tag_scanner_find_unused_tags(tmp_path, fake_tagbank):
    # Setup so only "patience" is used
    arc_tags_dir = tmp_path / "arc_tags"
    arc_tags_dir.mkdir()
    (arc_tags_dir / "arc1.yaml").write_text("tags:\n  virtue:\n    - patience\n")
    arc_metadata = tmp_path / "arc_metadata.yaml"
    arc_metadata.write_text("")
    med_dir = tmp_path / "meditations"
    med_dir.mkdir()
    (med_dir / "med1.md").write_text("<!-- tags: [patience] -->")

    import scripts.tag_tools as tt
    tt.ARC_TAGS_DIR = arc_tags_dir
    tt.ARC_METADATA_PATH = arc_metadata
    tt.MEDITATIONS_DIR = med_dir

    scanner = tt.TagScanner(fake_tagbank)
    unused = scanner.find_unused_tags()
    unused_tags = [tag for cat, tag in unused]
    assert "humility" in unused_tags
    assert "pride" in unused_tags
    assert "patience" not in unused_tags


def test_tag_scanner_generate_usage_report(tmp_path, fake_tagbank):
    arc_tags_dir = tmp_path / "arc_tags"
    arc_tags_dir.mkdir()
    (arc_tags_dir / "arc1.yaml").write_text("tags:\n  virtue:\n    - patience\n  vice:\n    - pride\n")
    arc_metadata = tmp_path / "arc_metadata.yaml"
    arc_metadata.write_text("- tags:\n    - humility\n")
    med_dir = tmp_path / "meditations"
    med_dir.mkdir()
    (med_dir / "med1.md").write_text("<!-- tags: [patience, humility] -->")

    import scripts.tag_tools as tt
    tt.ARC_TAGS_DIR = arc_tags_dir
    tt.ARC_METADATA_PATH = arc_metadata
    tt.MEDITATIONS_DIR = med_dir

    scanner = tt.TagScanner(fake_tagbank)
    report = scanner.generate_usage_report()
    assert isinstance(report, dict)
    assert "patience" in report
    assert "humility" in report
    assert "pride" in report
