# website/api/views/homepage_day_views.py
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo
from django.utils.timezone import localdate
from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from website.models import MeditationDay

# Pick an anchor you’re happy with (when your rotation “started”)
HOMEPAGE_ANCHOR_DATE = date(2025, 9, 21)   # <-- set once
HOMEPAGE_ANCHOR_DAY  = 13                  # <-- master_day_number on that date

DEFAULT_TZ = "America/New_York"
SWITCH_HOUR = 1  # 1 AM local time

def service_date(tz_name: str | None, switch_hour: int) -> date:
    """
    Returns the 'service day' (calendar date) in the given timezone,
    shifted back by `switch_hour` hours to roll the day at that time.
    """
    try:
        tz = ZoneInfo(tz_name) if tz_name else ZoneInfo(DEFAULT_TZ)
    except Exception:
        tz = ZoneInfo(DEFAULT_TZ)
    now = datetime.now(tz)
    shifted = now - timedelta(hours=switch_hour)
    return shifted.date()

def compute_today_tomorrow(tz_name: str | None) -> tuple[int | None, int | None]:
    """
    Compute (today, tomorrow) master_day_numbers using a timezone-aware 'service day'.
    """
    max_day = (
        MeditationDay.objects.order_by("-master_day_number")
        .values_list("master_day_number", flat=True)
        .first()
    )
    if not max_day:
        return (None, None)

    d = service_date(tz_name, SWITCH_HOUR)
    days_elapsed = (d - HOMEPAGE_ANCHOR_DATE).days

    today_num = ((HOMEPAGE_ANCHOR_DAY - 1 + days_elapsed) % max_day) + 1
    tomorrow_num = (today_num % max_day) + 1
    return (today_num, tomorrow_num)

def build_day_payload(day_number: int) -> dict | None:
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
    """
    Stateless rotation, defaulting to America/New_York with a 3AM rollover.
    Optionally accept ?tz=Area/City to compute per-viewer.
    """

    @action(detail=False, url_path="today")
    def today(self, request):
        tz_name = request.query_params.get("tz")  # optional
        today_num, _ = compute_today_tomorrow(tz_name)
        if not today_num:
            return Response({"error": "No days available"}, status=status.HTTP_404_NOT_FOUND)
        payload = build_day_payload(today_num)
        return Response(payload) if payload else Response({"error": "Not found"}, status=404)

    @action(detail=False, url_path="tomorrow")
    def tomorrow(self, request):
        tz_name = request.query_params.get("tz")  # optional
        _, tomorrow_num = compute_today_tomorrow(tz_name)
        if not tomorrow_num:
            return Response({"error": "No days available"}, status=status.HTTP_404_NOT_FOUND)
        payload = build_day_payload(tomorrow_num)
        return Response(payload) if payload else Response({"error": "Not found"}, status=404)
