from django.contrib import admin
from .models import Arc, MeditationDay, Tag, ArcTag, DayTag, SecondaryReading

@admin.register(Arc)
class ArcAdmin(admin.ModelAdmin):
    list_display = ("arc_id", "title", "day_count", "liturgical_fit")
    search_fields = ("arc_id", "title")

@admin.register(MeditationDay)
class MeditationDayAdmin(admin.ModelAdmin):
    list_display = ("day_number", "arc", "arc_day")
    search_fields = ("day_number",)
    list_filter = ("arc",)

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "category")
    list_filter = ("category",)
    search_fields = ("name",)

@admin.register(ArcTag)
class ArcTagAdmin(admin.ModelAdmin):
    list_display = ("arc", "tag")

@admin.register(DayTag)
class DayTagAdmin(admin.ModelAdmin):
    list_display = ("day", "tag")

@admin.register(SecondaryReading)
class SecondaryReadingAdmin(admin.ModelAdmin):
    list_display = ("day", "title", "reference")
