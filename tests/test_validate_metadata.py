import pytest
from unittest.mock import MagicMock
from scripts.validate_metadata import (
    SchemaValidator,
    TagValidator,
    CrossValidator,
    IntegrityValidator,
    MetadataValidator,
)


@pytest.fixture
def valid_arc():
    return {
        "arc_id": "arc_love_of_god",
        "arc_title": "The Love of God",
        "arc_number": 1,
        "day_count": 7,
        "master_day_range": {"start": 1, "end": 7},
        "anchor_image": ["image1"],
        "primary_reading": ["reading1"],
        "tags": ["love", "virtue"],
    }


@pytest.fixture
def valid_tag_bank():
    return {
        "virtue": ["love"],
        "doctrinal": [],
        "emotional": [],
        "liturgical": [],
        "mystical": [],
        "typological": [],
    }


@pytest.fixture
def valid_arc_tag():
    return {
        "arc_id": "arc_love_of_god",
        "arc_title": "The Love of God",
        "arc_number": 1,
        "tags": {"virtue": ["love"]},
    }


@pytest.fixture
def valid_day():
    return {
        "arc_id": "arc_love_of_god",
        "arc_title": "The Love of God",
        "arc_number": 1,
        "master_day_number": 1,
        "arc_day_number": 1,
        "anchor_image": ["image1"],
        "primary_reading": ["reading1"],
        "tags": {"virtue": ["love"]},
    }


def test_schema_validator_valid(monkeypatch, valid_arc):
    validator = SchemaValidator()
    monkeypatch.setattr(validator, "arc_metadata_schema", {"type": "object"})
    assert validator.validate(valid_arc, {"type": "object"}, "source") == []


def test_schema_validator_invalid(monkeypatch, valid_arc):
    validator = SchemaValidator()
    monkeypatch.setattr(validator, "arc_metadata_schema", {"type": "array"})
    errors = validator.validate(valid_arc, {"type": "array"}, "source")
    assert errors and "Schema error" in errors[0]


def test_tag_validator_valid(valid_tag_bank):
    validator = TagValidator()
    validator.valid_tags = {"love"}
    assert validator.validate_tags(["love"], "source") == []


def test_tag_validator_invalid(valid_tag_bank):
    validator = TagValidator()
    validator.valid_tags = {"love"}
    errors = validator.validate_tags(["hate"], "source")
    assert errors and "Invalid tag" in errors[0]


def test_tag_validator_duplicate(valid_tag_bank):
    validator = TagValidator()
    validator.valid_tags = {"love"}
    errors = validator.validate_tags(["love", "love"], "source")
    assert any("Duplicate tag" in e for e in errors)


def test_cross_validator_arc_tag_consistency(valid_arc, valid_arc_tag):
    cv = CrossValidator([valid_arc], [MagicMock(stem="arc_love_of_god_tags")], [])
    cv.arc_tag_data = {"arc_love_of_god": valid_arc_tag}
    cv.day_data = {}
    assert cv._check_arc_tag_consistency() == []


def test_cross_validator_day_arc_consistency(valid_arc, valid_day):
    cv = CrossValidator([valid_arc], [], [])
    cv.day_data = {"day_0001.yaml": valid_day}
    assert cv._check_day_arc_consistency() == []


def test_cross_validator_title_and_number_consistency(
    valid_arc, valid_arc_tag, valid_day
):
    cv = CrossValidator([valid_arc], [MagicMock(stem="arc_love_of_god_tags")], [])
    cv.arc_tag_data = {"arc_love_of_god": valid_arc_tag}
    cv.day_data = {"day_0001.yaml": valid_day}
    assert cv._check_title_and_number_consistency() == []


def test_integrity_validator_valid(monkeypatch, valid_arc, valid_arc_tag, valid_day):
    monkeypatch.setattr(
        "scripts.validate_metadata.load_yaml",
        lambda f: valid_day if "day" in getattr(f, "name", "") else valid_arc_tag,
    )
    # Create 7 valid days to match day_count
    days = {
        i + 1: {**valid_day, "master_day_number": i + 1, "arc_day_number": i + 1}
        for i in range(7)
    }
    iv = IntegrityValidator(
        [valid_arc],
        [MagicMock(stem="arc_love_of_god_tags")],
        [MagicMock(name=f"day_{i+1:04d}.yaml") for i in range(7)],
    )
    iv.arc_tag_data = {"arc_love_of_god": valid_arc_tag}
    iv.day_data = days
    assert iv.validate() == []


def test_metadata_validator_run(monkeypatch, valid_arc, valid_arc_tag, valid_day):
    mv = MetadataValidator()

    def fake_load_yaml(x):
        if hasattr(x, "name") and "tag" in x.name:
            return valid_arc_tag
        if hasattr(x, "name") and "day" in x.name:
            return valid_day
        return [valid_arc]

    tag_file_mock = MagicMock()
    tag_file_mock.name = "arc_love_of_god_tags.yaml"
    day_file_mock = MagicMock()
    day_file_mock.name = "day_0001.yaml"
    monkeypatch.setattr("scripts.validate_metadata.load_yaml", fake_load_yaml)
    monkeypatch.setattr(
        "scripts.validate_metadata.ARC_TAGS_DIR",
        MagicMock(glob=lambda x: [tag_file_mock]),
    )
    monkeypatch.setattr(
        "scripts.validate_metadata.DAY_FILES_DIR",
        MagicMock(glob=lambda x: [day_file_mock]),
    )
    monkeypatch.setattr(
        mv.schema_validator, "validate", lambda data, schema, source: []
    )
    monkeypatch.setattr(mv.tag_validator, "validate_tags", lambda tags, source: [])
    monkeypatch.setattr(
        "scripts.validate_metadata.CrossValidator", MagicMock(validate=lambda self: [])
    )
    monkeypatch.setattr(
        "scripts.validate_metadata.IntegrityValidator",
        MagicMock(validate=lambda self: []),
    )
    mv.run()  # Should not raise


def test_main(monkeypatch):
    monkeypatch.setattr(
        "scripts.validate_metadata.MetadataValidator", MagicMock(run=lambda self: None)
    )
    import scripts.validate_metadata

    scripts.validate_metadata.__name__ = "__main__"
    scripts.validate_metadata.MetadataValidator().run()


def test_cross_validator__arc_title_mismatch_raises(tmp_path):
    arc_metadata = [{"arc_id": "arc_test", "arc_title": "Title A", "arc_number": 1}]
    arc_tag_files = [tmp_path / "arc_test_tags.yaml"]
    arc_tag_files[0].write_text(
        "arc_id: arc_test\narc_title: Title B\narc_number: 1", encoding="utf-8"
    )
    day_files = []

    validator = CrossValidator(arc_metadata, arc_tag_files, day_files)
    errors = validator.validate()
    assert any("arc_title mismatch" in e for e in errors)


def test_integrity_validator__primary_reading_mismatch(tmp_path):
    arc_metadata = [
        {
            "arc_id": "arc_test",
            "arc_title": "Consistency",
            "arc_number": 42,
            "day_count": 1,
            "master_day_range": {"start": 1, "end": 1},
            "anchor_image": ["Image A"],
            "primary_reading": [{"title": "Correct Reading"}],
            "tags": ["trust"],
        }
    ]
    arc_tag_files = []
    file = tmp_path / "day_0001.yaml"
    file.write_text(
        "arc_id: arc_test\narc_day_number: 1\nmaster_day_number: 1\narc_title: Consistency"
        "\narc_number: 42\nanchor_image: Image A\nprimary_reading:\n  title: Wrong Reading"
        "\ntags:\n  doctrinal: [trust]",
        encoding="utf-8",
    )
    validator = IntegrityValidator(arc_metadata, arc_tag_files, [file])
    errors = validator.validate()
    assert any("primary_reading mismatch" in e for e in errors)


def test_metadata_validator__raises_system_exit(monkeypatch):
    def fake_load_yaml(x):
        x_str = str(x)
        if "arc_metadata.yaml" in x_str and "schema" not in x_str:
            return [
                {
                    "arc_id": "bad",
                    "arc_title": "A",
                    "arc_number": 1,
                    "day_count": 1,
                    "master_day_range": {"start": 1, "end": 1},
                    "anchor_image": ["img"],
                    "primary_reading": [{"title": "t"}],
                    "tags": ["fake"],
                }
            ]
        if "schema" in x_str:
            return {"type": "object"}  # minimal valid schema
        return {}

    monkeypatch.setattr("scripts.validate_metadata.load_yaml", fake_load_yaml)
    monkeypatch.setattr(
        "scripts.validate_metadata.ARC_TAGS_DIR", MagicMock(glob=lambda x: [])
    )
    monkeypatch.setattr(
        "scripts.validate_metadata.DAY_FILES_DIR", MagicMock(glob=lambda x: [])
    )
    monkeypatch.setattr("scripts.validate_metadata.TAG_BANK_FILE", MagicMock())
    monkeypatch.setattr("builtins.print", lambda *args, **kwargs: None)

    with pytest.raises(SystemExit) as e:
        MetadataValidator().run()
    assert e.value.code == 1
