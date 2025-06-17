# test_check_metadata_integrity.py

import sys
import types
import pytest
from unittest.mock import patch, mock_open, MagicMock

import scripts.check_metadata_integrity as cmi

@pytest.fixture
def tag_bank():
    return {"category": ["prayer", "fasting", "almsgiving"]}

@pytest.fixture
def arc_metadata():
    return [
        {"arc_id": "arc1", "tags": ["prayer"]},
        {"arc_id": "arc2", "tags": ["fasting"]}
    ]

@pytest.fixture
def meditations_index():
    return [
        {"filename": "day1.md", "arc_id": "arc1", "day_within_arc": 1, "tags": ["prayer"]},
        {"filename": "day2.md", "arc_id": "arc2", "day_within_arc": 1, "tags": ["fasting"]}
    ]

@pytest.fixture
def arc_tags_file():
    return {"tags": {"1": ["prayer"], "2": ["fasting"]}}

@pytest.fixture
def meditation_files(tmp_path):
    f1 = tmp_path / "day1.md"
    f1.write_text("## Arc Title\n### Day 1\n<!-- tags: prayer -->")
    f2 = tmp_path / "day2.md"
    f2.write_text("## Arc Title\n### Day 2\n<!-- tags: fasting -->")
    return [f1, f2]

@pytest.fixture
def arc_tags_dir(tmp_path):
    f = tmp_path / "arc_tags"
    f.mkdir()
    (f / "arc1.yaml").write_text("tags:\n  1: [prayer]")
    (f / "arc2.yaml").write_text("tags:\n  1: [fasting]")
    return f

@pytest.fixture
def patch_paths(monkeypatch, tmp_path, meditation_files, arc_tags_dir):
    monkeypatch.setattr(cmi, "MEDITATIONS", tmp_path)
    monkeypatch.setattr(cmi, "ARC_TAGS_DIR", arc_tags_dir)
    monkeypatch.setattr(cmi, "INDEX_PATH", tmp_path / "meditations_index.yaml")
    monkeypatch.setattr(cmi, "ARC_METADATA_PATH", tmp_path / "arc_metadata.yaml")
    monkeypatch.setattr(cmi, "TAG_BANK_PATH", tmp_path / "tag_bank.yaml")

def test_metadata_loader_load_yaml(tmp_path):
    yaml_path = tmp_path / "test.yaml"
    yaml_path.write_text("foo: bar")
    assert cmi.MetadataLoader.load_yaml(yaml_path) == {"foo": "bar"}

def test_tag_validator_valid_and_invalid(tag_bank):
    validator = cmi.TagValidator(tag_bank)
    errors = []
    validator.validate_tags(["prayer", "invalid"], "source", errors)
    assert errors == ["[source] Invalid tag: invalid"]

def test_index_checker_all_good(monkeypatch, tag_bank, arc_metadata, meditations_index, patch_paths):
    loader = cmi.MetadataLoader()
    validator = cmi.TagValidator(tag_bank)
    monkeypatch.setattr(loader, "load_yaml", lambda path: meditations_index if "index" in str(path) else arc_metadata)
    monkeypatch.setattr(cmi, "MEDITATIONS", MagicMock())
    mock1 = MagicMock()
    mock1.name = "day1.md"
    mock2 = MagicMock()
    mock2.name = "day2.md"
    cmi.MEDITATIONS.glob = MagicMock(return_value=[mock1, mock2])
    checker = cmi.IndexChecker(loader, validator)
    errors = []
    checker.check(errors)
    assert errors == []

def test_index_checker_errors(monkeypatch, tag_bank, arc_metadata, meditations_index, patch_paths):
    loader = cmi.MetadataLoader()
    validator = cmi.TagValidator(tag_bank)
    bad_index = [
        {"filename": "missing.md", "arc_id": "arc3", "day_within_arc": 1, "tags": ["badtag"]},
        {"filename": "day1.md", "arc_id": "arc1", "day_within_arc": 1, "tags": ["prayer"]},
        {"filename": "day1.md", "arc_id": "arc1", "day_within_arc": 1, "tags": ["prayer"]},  # duplicate
    ]
    monkeypatch.setattr(loader, "load_yaml", lambda path: bad_index if "index" in str(path) else arc_metadata)
    monkeypatch.setattr(cmi, "MEDITATIONS", MagicMock())
    mock1 = MagicMock()
    mock1.name = "day1.md"
    cmi.MEDITATIONS.glob = MagicMock(return_value=[mock1])
    # Patch the paths so the checker uses the test data
    monkeypatch.setattr(cmi, "INDEX_PATH", "index")
    monkeypatch.setattr(cmi, "ARC_METADATA_PATH", "arc_metadata")
    checker = cmi.IndexChecker(loader, validator)
    errors = []
    checker.check(errors)
    print(errors)
    assert any("Missing file" in e for e in errors)
    assert any("Invalid arc_id" in e for e in errors)
    assert any("Invalid tag" in e for e in errors)
    assert any("Duplicate day" in e for e in errors)

def test_meditation_structure_checker(monkeypatch, tmp_path):
    good = tmp_path / "good.md"
    good.write_text("## Arc Title\n### Day 1")
    bad = tmp_path / "bad.md"
    bad.write_text("No headings here")
    monkeypatch.setattr(cmi, "MEDITATIONS", tmp_path)
    checker = cmi.MeditationStructureChecker()
    errors = []
    checker.check(errors)
    assert "[Structure] Missing arc title (##) in bad.md" in errors
    assert "[Structure] No day sections (###) in bad.md" in errors

def test_arc_tags_checker(monkeypatch, arc_metadata, tmp_path):
    arc_tags_dir = tmp_path / "arc_tags"
    arc_tags_dir.mkdir()
    (arc_tags_dir / "arc1.yaml").write_text("tags:\n  1: [prayer]")
    monkeypatch.setattr(cmi, "ARC_TAGS_DIR", arc_tags_dir)
    loader = cmi.MetadataLoader()
    monkeypatch.setattr(loader, "load_yaml", lambda path: arc_metadata)
    checker = cmi.ArcTagsChecker(loader)
    errors = []
    checker.check(errors)
    assert "[Arc Tags] Missing arc_tags/arc2_tags.yaml" in errors

def test_tag_usage_checker(monkeypatch, tag_bank, arc_metadata, arc_tags_file, tmp_path):
    loader = cmi.MetadataLoader()
    validator = cmi.TagValidator(tag_bank)
    monkeypatch.setattr(loader, "load_yaml", lambda path: arc_metadata if "arc_metadata" in str(path) else arc_tags_file)
    arc_tags_dir = tmp_path / "arc_tags"
    arc_tags_dir.mkdir()
    (arc_tags_dir / "arc1.yaml").write_text("tags:\n  1: [prayer]")
    monkeypatch.setattr(cmi, "ARC_TAGS_DIR", arc_tags_dir)
    # Mock meditation file with valid and invalid tags
    med_file = tmp_path / "med1.md"
    med_file.write_text("## Arc Title\n### Day 1\n<!-- tags: prayer, invalid -->")
    monkeypatch.setattr(cmi, "MEDITATIONS", tmp_path)
    checker = cmi.TagUsageChecker(loader, validator)
    errors = []
    checker.check(errors)
    assert any("Invalid tag: invalid" in e for e in errors)

def test_metadata_integrity_checker_all_good(monkeypatch, tag_bank, arc_metadata, meditations_index, arc_tags_file):
    import scripts.check_metadata_integrity as cmi

    # Patch all YAML loads to return the correct fixture
    def fake_load_yaml(path, *a, **kw):
        path_str = str(path)
        if "tag_bank" in path_str:
            return tag_bank
        elif "arc_metadata" in path_str:
            return arc_metadata
        elif "index" in path_str:
            return meditations_index
        elif "arc_tags" in path_str and path_str.endswith(".yaml"):
            return arc_tags_file
        else:
            return {}

    monkeypatch.setattr(cmi.MetadataLoader, "load_yaml", staticmethod(fake_load_yaml))

    # Patch all path constants to dummy values
    monkeypatch.setattr(cmi, "TAG_BANK_PATH", "tag_bank")
    monkeypatch.setattr(cmi, "ARC_METADATA_PATH", "arc_metadata")
    monkeypatch.setattr(cmi, "INDEX_PATH", "index")
    monkeypatch.setattr(cmi, "ARC_TAGS_DIR", "arc_tags")
    monkeypatch.setattr(cmi, "MEDITATIONS", "meditations")

    # Patch MEDITATIONS.glob to return two mock markdown files
    med1 = MagicMock()
    med1.name = "day1.md"
    med2 = MagicMock()
    med2.name = "day2.md"
    # Patch open() for these files to return the correct content
    def fake_open(file, mode='r', encoding=None):
        class DummyFile:
            def __enter__(self):
                if "day1.md" in str(file):
                    self.content = "## Arc Title\n### Day 1\n<!-- tags: prayer -->"
                elif "day2.md" in str(file):
                    self.content = "## Arc Title\n### Day 2\n<!-- tags: fasting -->"
                else:
                    self.content = ""
                return self
            def __exit__(self, exc_type, exc_val, exc_tb):
                pass
            def read(self):
                return self.content
        return DummyFile()
    monkeypatch.setattr(cmi, "open", fake_open, raising=False)
    monkeypatch.setattr(med1, "open", lambda encoding=None: fake_open("day1.md"), raising=False)
    monkeypatch.setattr(med2, "open", lambda encoding=None: fake_open("day2.md"), raising=False)
    monkeypatch.setattr(cmi, "MEDITATIONS", MagicMock())
    cmi.MEDITATIONS.glob = MagicMock(return_value=[med1, med2])

    # Patch ARC_TAGS_DIR.glob to return two mock arc tag YAML files
    arc1 = MagicMock()
    arc1.stem = "arc1"
    arc1.name = "arc1.yaml"
    arc2 = MagicMock()
    arc2.stem = "arc2"
    arc2.name = "arc2.yaml"
    monkeypatch.setattr(cmi, "ARC_TAGS_DIR", MagicMock())
    cmi.ARC_TAGS_DIR.glob = MagicMock(return_value=[arc1, arc2])

    # Now run the checker
    checker = cmi.MetadataIntegrityChecker()
    errors = checker.run_all()
    assert errors == []

def test_metadata_integrity_checker_report(monkeypatch):
    checker = cmi.MetadataIntegrityChecker()
    checker.errors = ["error1", "error2"]
    with patch("builtins.print") as mock_print:
        checker.report()
        mock_print.assert_any_call("❌ Metadata Validation Failed:")
        mock_print.assert_any_call(" -", "error1")
        mock_print.assert_any_call(" -", "error2")
    checker.errors = []
    with patch("builtins.print") as mock_print:
        checker.report()
        mock_print.assert_any_call("✅ All metadata and tag checks passed.")

def test_main_exit(monkeypatch):
    monkeypatch.setattr(cmi, "MetadataIntegrityChecker", lambda: MagicMock(run_all=lambda: ["err"], report=lambda: None))
    with pytest.raises(SystemExit):
        cmi.__name__ = "__main__"
        exec(open(cmi.__file__, encoding="utf-8").read(), cmi.__dict__)
