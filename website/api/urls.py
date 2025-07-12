from django.urls import path, include
from rest_framework.routers import DefaultRouter
from website.api.views.arc_views import ArcViewSet
from website.api.views.day_views import DayViewSet
from website.api.views.tag_views import TagViewSet
from website.api.views.homepage_day_views import HomepageDayViewSet
from website.api.views.user_journey_views import UserJourneyView
from website.api.views.auth_views import current_user_view

router = DefaultRouter()
router.register(r'arcs', ArcViewSet, basename='arc')
router.register(r'days', DayViewSet, basename='day')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'days/homepage', HomepageDayViewSet, basename='homepage-days')

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/user/journey/", UserJourneyView.as_view(), name="user-journey"),
    path('api-auth/', include('rest_framework.urls')),
    path("api/current-user/", current_user_view),
]