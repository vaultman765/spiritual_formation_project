from django.contrib import admin
from .models import (
    Arc,
    MeditationDay,
    Tag,
    ArcTag,
    DayTag,
    SecondaryReading,
    UserJourney,
    UserJourneyArcProgress,
    PageView
)


@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    list_display = ("created_at", "path", "visitor_id", "user", "ip", "tz")
    list_filter  = ("tz",)
    search_fields = ("path", "visitor_id", "referrer", "user_agent", "ip")
    date_hierarchy = "created_at"


@admin.register(Arc)
class ArcAdmin(admin.ModelAdmin):
    list_display = ["arc_id", "arc_title", "arc_number", "day_count", "master_day_start", "master_day_end"]
    search_fields = ["arc_id", "arc_title"]
    ordering = ["arc_number"]


@admin.register(MeditationDay)
class MeditationDayAdmin(admin.ModelAdmin):
    list_display = [
        "master_day_number", "arc_day_number", "arc_title", "day_title",
        "primary_reading_title"
    ]
    search_fields = ["day_title", "primary_reading_title"]
    ordering = ["master_day_number"]


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["name", "category"]
    search_fields = ["name"]
    list_filter = ["category"]


@admin.register(ArcTag)
class ArcTagAdmin(admin.ModelAdmin):
    list_display = ["arc", "tag"]
    list_filter = ["tag__category"]


@admin.register(DayTag)
class DayTagAdmin(admin.ModelAdmin):
    list_display = ["meditation_day", "tag"]
    list_filter = ["tag__category"]


@admin.register(SecondaryReading)
class SecondaryReadingAdmin(admin.ModelAdmin):
    list_display = ["meditation_day", "title", "reference"]
    search_fields = ["title", "reference"]


@admin.register(UserJourney)
class UserJourneyAdmin(admin.ModelAdmin):
    list_display = ["user", "title"]
    search_fields = ["user__username", "journey__title"]
    list_filter = ["user"]


@admin.register(UserJourneyArcProgress)
class UserJourneyArcProgressAdmin(admin.ModelAdmin):
    list_display = ['user_journey', 'arc_id', 'arc_title', 'order', 'status', 'current_day', 'day_count']
    list_filter = ['status']
    search_fields = ['arc_id', 'arc_title']
    ordering = ['user_journey', 'order']
