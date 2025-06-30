from django.http import JsonResponse, Http404
from django.shortcuts import get_object_or_404
from website.models import MeditationDay, DayTag
from collections import defaultdict


def arc_day_list(request, arc_id):
    days = (
        MeditationDay.objects
        .filter(arc__arc_id=arc_id)
        .order_by("arc_day_number")
        .values(
            "arc_day_number",
            "master_day_number",
            "day_title",
        )
    )
    return JsonResponse(list(days), safe=False)


def day_metadata_view(request, day_number):
    try:
        day = MeditationDay.objects.get(master_day_number=day_number)
    except MeditationDay.DoesNotExist:
        raise Http404("Meditation day not found")

    # Build tags by category
    tags_qs = DayTag.objects.filter(meditation_day=day).select_related("tag")
    tags_by_category = defaultdict(list)
    for dt in tags_qs:
        tags_by_category[dt.tag.category].append(dt.tag.name)

    return JsonResponse({
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
    })


def day_summary_view(request):
    data = []
    for day in MeditationDay.objects.select_related("arc").prefetch_related("daytag_set__tag").all():
        tags_by_category = defaultdict(list)
        for dt in day.daytag_set.all():
            tags_by_category[dt.tag.category].append(dt.tag.name)
        data.append({
            "master_day_number": day.master_day_number,
            "arc_id": day.arc.arc_id,
            "arc_title": day.arc.arc_title,
            "day_title": day.day_title,
            "tags": tags_by_category,
        })
    return JsonResponse(data, safe=False)


def day_detail_by_arc_view(request, arc_id, arc_day_number):
    day = get_object_or_404(
        MeditationDay,
        arc__arc_id=arc_id,
        arc_day_number=arc_day_number
    )

    # Build tags by category
    tags_qs = DayTag.objects.filter(meditation_day=day).select_related("tag")
    tags_by_category = defaultdict(list)
    for dt in tags_qs:
        tags_by_category[dt.tag.category].append(dt.tag.name)

    return JsonResponse({
        "master_day_number": day.master_day_number,
        "arc_day_number": day.arc_day_number,
        "arc_id": day.arc.arc_id,
        "arc_title": day.arc.arc_title,
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
                "url": sr.url
            } for sr in day.secondary_readings.all()
        ],
        "meditative_points": [
            day.meditative_point_1,
            day.meditative_point_2,
            day.meditative_point_3
        ],
        "ejaculatory_prayer": day.ejaculatory_prayer,
        "colloquy": day.colloquy,
        "resolution": day.resolution,
        "tags": tags_by_category,
    }, json_dumps_params={"indent": 2})
