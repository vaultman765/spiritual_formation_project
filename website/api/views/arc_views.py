from django.http import JsonResponse
from website.models import Arc, ArcTag


def arc_tags_by_arc(request):
    arcs = Arc.objects.all().order_by("arc_number")
    data = []

    for arc in arcs:
        arc_tags = ArcTag.objects.filter(arc=arc).select_related("tag")
        tag_list = [
            {"name": at.tag.name, "category": at.tag.category}
            for at in arc_tags
        ]
        data.append({
            "arc_id": arc.arc_id,
            "arc_title": arc.arc_title,
            "tags": tag_list,
        })

    return JsonResponse(data, safe=False)


def arc_metadata_list(request):
    arcs = Arc.objects.all().order_by("arc_number")
    data = [
        {
            "arc_id": arc.arc_id,
            "arc_number": arc.arc_number,
            "arc_title": arc.arc_title,
            "day_count": arc.day_count,
            "master_day_start": arc.master_day_start,
            "master_day_end": arc.master_day_end,
            "anchor_image": arc.anchor_image,
            "arc_summary": arc.arc_summary,
            "primary_reading": arc.primary_reading,
            "card_tags": arc.card_tags.split(",") if arc.card_tags else [],
        }
        for arc in arcs
    ]
    return JsonResponse(data, safe=False)


def arc_metadata_detail(request, arc_id):
    try:
        arc = Arc.objects.get(arc_id=arc_id)
        data = {
            "arc_id": arc.arc_id,
            "arc_number": arc.arc_number,
            "arc_title": arc.arc_title,
            "day_count": arc.day_count,
            "master_day_start": arc.master_day_start,
            "master_day_end": arc.master_day_end,
            "anchor_image": arc.anchor_image,
            "primary_reading": arc.primary_reading,
        }
        return JsonResponse(data)
    except Arc.DoesNotExist:
        return JsonResponse({"error": "Arc not found"}, status=404)
