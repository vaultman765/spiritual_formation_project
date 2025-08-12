import logging
import os
import sys
from pathlib import Path


def configure_logging():
    level = os.getenv("LOG_LEVEL", "INFO").upper()
    handlers = [logging.StreamHandler(sys.stdout)]  # send everything to stdout

    # Optional file logging if explicitly requested
    log_file = os.getenv("LOG_FILE", "").strip()
    if log_file:
        try:
            Path(log_file).parent.mkdir(parents=True, exist_ok=True)
            handlers.append(logging.FileHandler(log_file, encoding="utf-8"))
        except Exception as e:
            print(f"[log] File logging disabled ({e})", file=sys.stderr)

    logging.basicConfig(
        level=getattr(logging, level, logging.INFO),
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
        handlers=handlers,
        force=True,  # override any prior config
    )


def get_logger(name=None):
    return logging.getLogger(name)
