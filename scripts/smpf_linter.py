import os
import sys

REQUIRED_SECTIONS = [
    "Anchor Image",
    "Primary Reading",
    "Meditative Points",
    "Colloquy",
    "Resolution"
]

def check_smpf_format(filepath):
    with open(filepath, encoding='utf-8') as f:
        content = f.read()

    missing = []
    for section in REQUIRED_SECTIONS:
        if section not in content:
            missing.append(section)

    if missing:
        print(f"❌ {filepath} is missing: {', '.join(missing)}")
        return False
    else:
        print(f"✅ {filepath} passed SMPF check.")
        return True

def main():
    base_dirs = ["meditations", "archive"]
    success = True

    for base_dir in base_dirs:
        for root, _, files in os.walk(base_dir):
            for file in files:
                if file.endswith(".md"):
                    full_path = os.path.join(root, file)
                    if not check_smpf_format(full_path):
                        success = False

    if not success:
        sys.exit(1)

if __name__ == "__main__":
    main()
