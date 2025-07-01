import logging


def configure_logging(level=logging.INFO, log_format="%(message)s", ):
    if log_format is None:
        log_format = "%(asctime)s %(levelname)s [%(name)s]: %(message)s"
    logging.basicConfig(level=level,
                        format=log_format,
                        encoding="utf-8",
                        handlers=[
                            logging.StreamHandler(),
                            logging.FileHandler("project.log", encoding="utf-8"),
                            ])


def get_logger(name=None):
    return logging.getLogger(name)
