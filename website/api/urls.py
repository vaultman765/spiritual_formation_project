from django.urls import path, include
from rest_framework.routers import DefaultRouter
from website.api.views.arc_views import ArcViewSet
from website.api.views.day_views import DayViewSet
from website.api.views.tag_views import TagViewSet
from website.api.views.homepage_day_views import HomepageDayViewSet
from website.api.views.user_journey_views import UserJourneyViewSet, UserJourneyListAllView
from website.api.views.auth_views import current_user_view, register_view, login_view, logout_view

router = DefaultRouter()
router.register(r'arcs', ArcViewSet, basename='arc')
router.register(r'days', DayViewSet, basename='day')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'days/homepage', HomepageDayViewSet, basename='homepage-days')
router.register(r'user/journey', UserJourneyViewSet, basename='user-journey')

urlpatterns = [
    path("api/user/register/", register_view, name="user-register"),
    path("api/user/current/", current_user_view, name="user-current"),
    path("api/user/login/", login_view, name="user-login"),
    path("api/user/logout/", logout_view, name="user-logout"),
    path('api/user/journeys/', UserJourneyListAllView.as_view(), name='user-journey-list'),
    path("api/", include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),

]
