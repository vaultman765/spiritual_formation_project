from django.urls import path
from website.views.arc_views import arc_tags_by_arc, arc_metadata_list, arc_metadata_detail
from website.views.tag_views import arcs_grouped_by_tag
from website.views.day_views import arc_day_list, day_metadata_view, day_summary_view, day_detail_by_arc_view

urlpatterns = [
    path("api/arc-tags/", arc_tags_by_arc, name="arc_tags"),
    path("api/arcs-with-tags/", arc_tags_by_arc, name="arc_tags_legacy"),
    path("api/arcs-by-tag/", arcs_grouped_by_tag, name="arcs_by_tag"),
    path("api/arcs/", arc_metadata_list, name="arc_metadata_list"),
    path("api/arcs/<str:arc_id>/", arc_metadata_detail, name="arc_metadata_detail"),
    path("api/arcs/<str:arc_id>/days/", arc_day_list, name="arc-day-list"),
    path("api/days/<int:day_number>/", day_metadata_view, name="day_metadata"),
    path("api/days/", day_summary_view, name="day_summary"),
    path("api/days/<str:arc_id>/<int:arc_day_number>/", day_detail_by_arc_view, name="day_by_arc"),
]
