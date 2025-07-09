from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from website.models import Tag, ArcTag
from website.api.serializers.tag_serializer import TagSerializer


class TagViewSet(ReadOnlyModelViewSet):
    """
    Provides access to canonical tags and arc/tag relationships.

    Endpoints:
    - `GET /api/tags/`: List all tags (with name and category)

    Extra Actions:
    - `GET /api/tags/arcs-by-tag/`: Return dict of `{ tag_name: [arc_id, ...] }`
    """
    queryset = Tag.objects.all().order_by("category", "name")
    serializer_class = TagSerializer

    @action(detail=False, url_path="arcs-by-tag")
    def arcs_by_tag(self, request):
        result = {}
        for arc_tag in ArcTag.objects.select_related("tag", "arc"):
            tag_name = arc_tag.tag.name
            arc_id = arc_tag.arc.arc_id
            result.setdefault(tag_name, []).append(arc_id)
        return Response(result)
