from rest_framework import serializers
from .models import Arc, Tag, Day


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = [
            'slug',
            'label',
            'description',
            'category',
        ]


class ArcSerializer(serializers.ModelSerializer):
    class Meta:
        model = Arc
        fields = [
            'arc_id',
            'arc_title',
            'arc_number',
            'day_count',
            'primary_reading',
            'anchor_image',
            'arc_summary',
            'card_tags',
        ]


class DaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Day
        fields = [
            'master_day_number',
            'arc_day_number',
            'arc_id',
            'day_title',
            'meditative_points',
            'ejaculatory_prayer',
            'colloquy',
        ]