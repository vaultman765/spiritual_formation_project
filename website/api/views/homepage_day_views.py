# website/api/views/homepage_day_views.py
from datetime import date
from django.utils.timezone import localdate
from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from website.models import MeditationDay

# Pick an anchor you’re happy with (when your rotation “started”)
HOMEPAGE_ANCHOR_DATE = date(2025, 9, 21)   # <-- set once
HOMEPAGE_ANCHOR_DAY  = 13                  # <-- master_day_number on that date

def compute_today_tomorrow():
    """Return (today_master_day_number, tomorrow_master_day_number)."""
    max_day = (
        MeditationDay.objects.order_by("-master_day_number")
        .values_list("master_day_number", flat=True)
        .first()
    )
    if not max_day:
        return (None, None)

    days_elapsed = (localdate() - HOMEPAGE_ANCHOR_DATE).days
    # Normalize in case someone sets anchor in the future
    days_elapsed = int(days_elapsed)

    today_num = ((HOMEPAGE_ANCHOR_DAY - 1 + days_elapsed) % max_day) + 1
    tomorrow_num = (today_num % max_day) + 1
    return (today_num, tomorrow_num)

def build_day_payload(day_number):
    try:
        day = MeditationDay.objects.get(master_day_number=day_number)
    except MeditationDay.DoesNotExist:
        return None
    return {
        "master_day_number": day.master_day_number,
        "arc_day_number": day.arc_day_number,
        "arc_id": day.arc.arc_id,
        "arc_title": day.arc_title,
        "arc_number": day.arc_number,
        "day_title": day.day_title,
        "anchor_image": day.anchor_image,
        "primary_reading": {
            "title": day.primary_reading_title,
            "reference": day.primary_reading_reference,
            "url": day.primary_reading_url,
        },
        "secondary_readings": [
            {"title": sr.title, "reference": sr.reference, "url": sr.url}
            for sr in day.secondary_readings.all()
        ],
        "meditative_points": list(filter(None, [
            day.meditative_point_1,
            day.meditative_point_2,
            day.meditative_point_3,
        ])),
        "ejaculatory_prayer": day.ejaculatory_prayer,
        "colloquy": day.colloquy,
        "resolution": day.resolution,
        "tags": {
            dt.tag.category: dt.tag.name
            for dt in day.daytag_set.select_related("tag").all()
        },
    }

class HomepageDayViewSet(ViewSet):
    """Stateless rotation based on an anchor date/day."""

    @action(detail=False, url_path="today")
    def today(self, request):
        today_num, _ = compute_today_tomorrow()
        if not today_num:
            return Response({"error": "No days available"}, status=status.HTTP_404_NOT_FOUND)
        payload = build_day_payload(today_num)
        return Response(payload) if payload else Response({"error": "Not found"}, status=404)

    @action(detail=False, url_path="tomorrow")
    def tomorrow(self, request):
        _, tomorrow_num = compute_today_tomorrow()
        if not tomorrow_num:
            return Response({"error": "No days available"}, status=status.HTTP_404_NOT_FOUND)
        payload = build_day_payload(tomorrow_num)
        return Response(payload) if payload else Response({"error": "Not found"}, status=404)
