from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from website.models import MeditationDay, DayTag
from collections import defaultdict


class DayViewSet(ReadOnlyModelViewSet):
    """
    Provides access to Meditation Day content.

    Endpoints:
    - `GET /api/days/`: Summary of all days
    - `GET /api/days/?arc_id=...`: List days in a specific arc
    - `GET /api/days/?master_day_number=...`: Retrieve one day by master number
    - `GET /api/days/?arc_id=...&arc_day_number=...`: Retrieve one day by arc+day number

    Returns:
    - Full meditative structure, secondary readings, tags, etc.
    """
    queryset = MeditationDay.objects.all().select_related("arc").order_by("master_day_number")
    lookup_field = "master_day_number"

    def list(self, request):
        arc_id = request.query_params.get("arc_id")
        arc_day_number = request.query_params.get("arc_day_number")
        master_day_number = request.query_params.get("master_day_number")

        if master_day_number:
            return self._single_day_by_master(master_day_number)
        elif arc_id and arc_day_number:
            return self._single_day_by_arc(arc_id, arc_day_number)
        elif arc_id:
            return self._days_for_arc(arc_id)
        else:
            return self._day_summary_list()

    def _single_day_by_master(self, day_num):
        try:
            day = MeditationDay.objects.get(master_day_number=day_num)
        except MeditationDay.DoesNotExist:
            return Response({"error": "Day not found"}, status=404)
        return Response(self._build_day_detail(day))

    def _single_day_by_arc(self, arc_id, arc_day_num):
        try:
            day = MeditationDay.objects.get(arc__arc_id=arc_id, arc_day_number=arc_day_num)
        except MeditationDay.DoesNotExist:
            return Response({"error": "Day not found"}, status=404)
        return Response(self._build_day_detail(day))

    def _days_for_arc(self, arc_id):
        days = (
            MeditationDay.objects
            .filter(arc__arc_id=arc_id)
            .order_by("arc_day_number")
            .values("arc_day_number", "master_day_number", "day_title")
        )
        return Response(list(days))

    def _day_summary_list(self):
        data = []
        for day in self.queryset.prefetch_related("daytag_set__tag"):
            tags_by_category = defaultdict(list)
            for dt in day.daytag_set.all():
                tags_by_category[dt.tag.category].append(dt.tag.name)
            data.append({
                "master_day_number": day.master_day_number,
                "arc_day_number": day.arc_day_number,
                "arc_id": day.arc.arc_id,
                "arc_title": day.arc.arc_title,
                "day_title": day.day_title,
                "tags": tags_by_category,
            })
        return Response(data)

    def _build_day_detail(self, day):
        tags_qs = DayTag.objects.filter(meditation_day=day).select_related("tag")
        tags_by_category = defaultdict(list)
        for dt in tags_qs:
            tags_by_category[dt.tag.category].append(dt.tag.name)

        return {
            "master_day_number": day.master_day_number,
            "arc_day_number": day.arc_day_number,
            "arc_id": day.arc.arc_id,
            "arc_title": day.arc_title,
            "arc_number": day.arc.arc_number,
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
                }
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
            "tags": tags_by_category,
        }