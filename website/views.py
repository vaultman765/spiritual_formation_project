from django.http import JsonResponse
from .models import Arc, Tag, ArcTag

def arc_tags_view(request):
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
