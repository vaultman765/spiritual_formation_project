import sys
from subprocess import run
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Builds and imports an arc with optional skipping and checksum logic."

    def add_arguments(self, parser):
        parser.add_argument("--arc-id", required=True, help="Arc ID to import (e.g. arc_love_of_god)")
        parser.add_argument("--skip-days", action="store_true", help="Skip importing day YAMLs")
        parser.add_argument("--skip-tags", action="store_true", help="Skip importing arc tags")
        parser.add_argument("--skip-unchanged", action="store_true",
                            help="Skip files that haven't changed (checksum-based)")

    def handle(self, *args, **options):
        arc_id = options["arc_id"]
        skip_days = options["skip_days"]
        skip_tags = options["skip_tags"]
        skip_unchanged = options["skip_unchanged"]

        command = [sys.executable, "-m", "scripts.build_and_import_arc", "--arc-id", arc_id]
        if skip_days:
            command.append("--skip-days")
        if skip_tags:
            command.append("--skip-tags")
        if skip_unchanged:
            command.append("--skip-unchanged")

        self.stdout.write(self.style.NOTICE(f"Running arc import: {arc_id}"))
        run(command, check=True)
