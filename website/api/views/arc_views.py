from django.http import JsonResponse
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from website.models import Arc, ArcTag, MeditationDay
from website.api.serializers.arc_serializer import ArcSerializer


class ArcViewSet(ReadOnlyModelViewSet):
    """
    Provides access to Arc metadata.

    Endpoints:
    - `GET /api/arcs/`: List all arcs
    - `GET /api/arcs/<arc_id>/`: Retrieve full metadata for one arc
    - `GET /api/arcs/?arc_id=...`: Filter arcs by arc_id

    Extra Actions:
    - `GET /api/arcs/with-tags/`: Return all arcs with their associated tags
    - `GET /api/arcs/by-tag/`: Return arcs grouped by tag
    - GET /api/arcs/<arc_id>/days/: Return all days in an arc with their metadata
    """
    queryset = Arc.objects.all().order_by("arc_number")
    serializer_class = ArcSerializer
    lookup_field = "arc_id"  # Use arc_id for detail lookups


    def get_queryset(self):
        queryset = super().get_queryset()
        arc_id = self.request.query_params.get("arc_id")
        if arc_id:
            queryset = queryset.filter(arc_id=arc_id)
        return queryset


    @action(detail=False, methods=["get"], url_path="with-tags")
    def with_tags(self, request):
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
        return Response(data, status=status.HTTP_200_OK)


    @action(detail=False, methods=["get"], url_path="by-tag")
    def by_tag(self, request):
        result = {}
        for arc_tag in ArcTag.objects.select_related("tag", "arc"):
            tag_name = arc_tag.tag.name
            arc_id = arc_tag.arc.arc_id
            result.setdefault(tag_name, []).append(arc_id)
        return Response(result, status=status.HTTP_200_OK)


    @action(detail=True, url_path="days")
    def list_arc_days(self, request, arc_id=None):
        arc = self.get_object()
        days = MeditationDay.objects.filter(arc=arc).order_by("arc_day_number").values(
            "arc_day_number", "master_day_number", "day_title"
        )
        return Response(list(days))
