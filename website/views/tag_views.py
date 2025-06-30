from django.http import JsonResponse
from website.models import ArcTag


def arcs_grouped_by_tag(request):
    result = {}
    for arc_tag in ArcTag.objects.select_related("tag", "arc"):
        tag_name = arc_tag.tag.name
        arc_id = arc_tag.arc.arc_id
        result.setdefault(tag_name, []).append(arc_id)
    return JsonResponse(result)
