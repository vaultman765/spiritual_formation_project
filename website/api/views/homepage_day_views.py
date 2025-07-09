import json
from datetime import date
from pathlib import Path
from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from website.models import MeditationDay

HOMEPAGE_JSON_PATH = Path("website/data/homepage_day.json")


def load_homepage_data():
    if not HOMEPAGE_JSON_PATH.exists():
        return {"today": 1, "tomorrow": 2, "last_updated": "2000-01-01"}
    with open(HOMEPAGE_JSON_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def save_homepage_data(data):
    with open(HOMEPAGE_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def update_homepage_days_if_needed():
    data = load_homepage_data()
    today_str = date.today().isoformat()

    if data["last_updated"] < today_str:
        current_today = data["tomorrow"]
        max_day = MeditationDay.objects.order_by("-master_day_number").first()
        next_day = current_today + 1 if current_today < max_day.master_day_number else 1
        data = {
            "today": current_today,
            "tomorrow": next_day,
            "last_updated": today_str
        }
        save_homepage_data(data)
    return data


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
            {
                "title": sr.title,
                "reference": sr.reference,
                "url": sr.url,
            } for sr in day.secondary_readings.all()
        ],
        "meditative_points": list(filter(None, [
            day.meditative_point_1,
            day.meditative_point_2,
            day.meditative_point_3
        ])),
        "ejaculatory_prayer": day.ejaculatory_prayer,
        "colloquy": day.colloquy,
        "resolution": day.resolution,
        "tags": {
            dt.tag.category: dt.tag.name
            for dt in day.daytag_set.select_related("tag").all()
        }
    }


class HomepageDayViewSet(ViewSet):
    """
    Returns the site-wide "Today" and "Tomorrow" meditations for non-signed-in users.
    - Values rotate daily
    - Loops after last day
    """

    @action(detail=False, url_path="today")
    def today(self, request):
        data = update_homepage_days_if_needed()
        day = build_day_payload(data["today"])
        if not day:
            return Response({"error": "Today not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(day)

    @action(detail=False, url_path="tomorrow")
    def tomorrow(self, request):
        data = update_homepage_days_if_needed()
        day = build_day_payload(data["tomorrow"])
        if not day:
            return Response({"error": "Tomorrow not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(day)
